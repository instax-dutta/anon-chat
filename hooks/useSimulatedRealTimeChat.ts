"use client"

import { useState, useEffect, useCallback } from "react"

interface ChatMessage {
  id: number
  text: string
  sender: string
  timestamp: Date
  type: "text" | "file"
}

export function useSimulatedRealTimeChat(roomId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadMessages = useCallback(() => {
    try {
      const storedMessages = localStorage.getItem(`chat_${roomId}`)
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages)
        // Ensure proper date objects for timestamps
        const formattedMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(formattedMessages)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setIsLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 1000)
    return () => clearInterval(interval)
  }, [loadMessages])

  const sendMessage = useCallback(
    (newMessage: ChatMessage) => {
      setMessages((prevMessages) => {
        const updatedMessages = [
          ...prevMessages,
          {
            ...newMessage,
            timestamp: new Date(newMessage.timestamp),
          },
        ]
        try {
          localStorage.setItem(`chat_${roomId}`, JSON.stringify(updatedMessages))
        } catch (error) {
          console.error("Error saving message:", error)
        }
        return updatedMessages
      })
    },
    [roomId],
  )

  return { messages, sendMessage, isLoading }
}

