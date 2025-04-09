"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import API_CONFIG from "@/utils/apiConfig"

interface ChatMessage {
  id: string
  chat_id: string
  sender_id: string
  sender_name: string
  content: string
  message_type: "Text" | "File" | "Join" | "Leave" | "System"
  timestamp: string
  file_info?: {
    name: string
    size: number
    mime_type: string
    content: string
  }
}

interface FileInfo {
  name: string
  size: number
  mime_type: string
  content: string
}

interface Participant {
  id: string
  username: string
}

export function useWebSocket(chatId: string, username: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [maxParticipants, setMaxParticipants] = useState<number>(2)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [senderId] = useState<string>(() => `${username}-${Math.random().toString(36).substring(2, 9)}`)
  const socketRef = useRef<WebSocket | null>(null)

  // Get the WebSocket URL from API config
  const getWebSocketUrl = useCallback(() => {
    return API_CONFIG.getWebSocketUrl(chatId);
  }, [chatId])

  // Connect to the WebSocket
  const connect = useCallback(() => {
    try {
      const wsUrl = getWebSocketUrl()
      const socket = new WebSocket(wsUrl)

      socket.onopen = () => {
        setIsConnected(true)
        setIsLoading(false)
        setError(null)

        // Send a join message
        socket.send(
          JSON.stringify({
            message_type: "join",
            content: username,
          })
        )
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          // Handle different types of messages
          if (data.type === "chat_info") {
            setMaxParticipants(data.max_participants || 2);
            setParticipants(data.participants || []);
          } else if (data.type === "participant_joined") {
            // New participant joined
            setParticipants(prev => [...prev, {
              id: data.participant_id,
              username: data.participant_name
            }])
          } else if (data.type === "participant_left") {
            // Participant left
            setParticipants(prev =>
              prev.filter(p => p.id !== data.participant_id)
            )
          } else {
            // Regular chat message
            const message = data as ChatMessage
            setMessages((prevMessages) => [...prevMessages, message])

            // If it's a join/leave message, update participants list
            if (message.message_type === "Join") {
              const newParticipant = {
                id: message.sender_id,
                username: message.sender_name
              }
              setParticipants(prev => {
                if (!prev.some(p => p.id === newParticipant.id)) {
                  return [...prev, newParticipant]
                }
                return prev
              })
            } else if (message.message_type === "Leave") {
              setParticipants(prev =>
                prev.filter(p => p.id !== message.sender_id)
              )
            }
          }
        } catch (err) {
          console.error("Error parsing message:", err)
        }
      }

      socket.onclose = () => {
        setIsConnected(false)
        // Try to reconnect after a delay
        setTimeout(() => {
          if (socketRef.current === socket) {
            connect()
          }
        }, 3000)
      }

      socket.onerror = (err) => {
        setError("WebSocket error occurred")
        console.error("WebSocket error:", err)
        socket.close()
      }

      socketRef.current = socket
    } catch (err) {
      setError("Failed to connect to chat server")
      setIsLoading(false)
      console.error("Connection error:", err)
    }
  }, [chatId, getWebSocketUrl, username])

  // Send a text message
  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        setError("Not connected to chat server")
        return false
      }

      try {
        socketRef.current.send(
          JSON.stringify({
            message_type: "message",
            content,
          })
        )
        
        // Add the message to local state immediately
        const newMessage: ChatMessage = {
          id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          chat_id: chatId,
          sender_id: username,
          sender_name: username,
          content: content,
          message_type: "Text",
          timestamp: new Date().toISOString()
        }
        
        setMessages(prevMessages => [...prevMessages, newMessage])
        return true
      } catch (err) {
        console.error("Error sending message:", err)
        return false
      }
    },
    [chatId, username]
  )

  // Send a file
  const sendFile = useCallback(
    (file: File) => {
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        setError("Not connected to chat server")
        return false
      }

      return new Promise<boolean>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const base64Content = (e.target?.result as string).split(",")[1]
            const fileInfo: FileInfo = {
              name: file.name,
              size: file.size,
              mime_type: file.type || "application/octet-stream",
              content: base64Content,
            }

            socketRef.current?.send(
              JSON.stringify({
                message_type: "file",
                content: `Shared a file: ${file.name}`,
                file_info: fileInfo,
              })
            )
            
            // Add the file message to local state immediately
            const newMessage: ChatMessage = {
              id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              chat_id: chatId,
              sender_id: username,
              sender_name: username,
              content: `Shared a file: ${file.name}`,
              message_type: "File",
              timestamp: new Date().toISOString(),
              file_info: fileInfo
            }
            
            setMessages(prevMessages => [...prevMessages, newMessage])
            resolve(true)
          } catch (err) {
            console.error("Error sending file:", err)
            resolve(false)
          }
        }
        reader.onerror = () => {
          console.error("Error reading file")
          resolve(false)
        }
        reader.readAsDataURL(file)
      })
    },
    [chatId, username]
  )

  // Connect on component mount
  useEffect(() => {
    connect()

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close()
        socketRef.current = null
      }
    }
  }, [connect])

  return {
    messages,
    sendMessage,
    sendFile,
    isConnected,
    isLoading,
    error,
    participants,
    maxParticipants,
  } as const;
}
