"use client"

import { useState, useEffect } from "react"

interface ChatMessage {
  id: number
  text: string
  sender: string
  timestamp: Date
  type: "text" | "file"
}

export function useSimulatedRealTimeChat(roomId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    // Load initial messages from localStorage
    const storedMessages = localStorage.getItem(`chat_${roomId}`)
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    }

    // Set up interval to check for new messages
    const interval = setInterval(() => {
      const currentStoredMessages = localStorage.getItem(`chat_${roomId}`)
      if (currentStoredMessages) {
        const parsedMessages = JSON.parse(currentStoredMessages)
        if (JSON.stringify(parsedMessages) !== JSON.stringify(messages)) {
          setMessages(parsedMessages)
        }
      }
    }, 1000) // Check every second

    return () => clearInterval(interval)
  }, [roomId, messages])

  const sendMessage = (newMessage: ChatMessage) => {
    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    localStorage.setItem(`chat_${roomId}`, JSON.stringify(updatedMessages))
  }

  return { messages, sendMessage }
}

