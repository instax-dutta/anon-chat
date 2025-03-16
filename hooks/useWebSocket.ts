"use client"

import { useState, useEffect, useCallback, useRef } from "react"

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

export function useWebSocket(chatId: string, username: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<WebSocket | null>(null)

  // Get the WebSocket URL based on the environment
  const getWebSocketUrl = useCallback(() => {
    const isProduction = process.env.NODE_ENV === "production"
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const host = isProduction ? window.location.host : "localhost:3000"
    return `${protocol}//${host}/api/ws/${chatId}`
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
          const message = JSON.parse(event.data) as ChatMessage
          setMessages((prevMessages) => [...prevMessages, message])
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
        return true
      } catch (err) {
        console.error("Error sending message:", err)
        return false
      }
    },
    []
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
    []
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
  }
}