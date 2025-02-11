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

  const loadMessages = useCallback(() => {
    const storedMessages = localStorage.getItem(`chat_${roomId}`)
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
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
        const updatedMessages = [...prevMessages, newMessage]
        localStorage.setItem(`chat_${roomId}`, JSON.stringify(updatedMessages))
        return updatedMessages
      })
    },
    [roomId],
  )

  return { messages, sendMessage }
}

