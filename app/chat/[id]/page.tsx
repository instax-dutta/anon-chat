"use client"

import { useState, useEffect, useRef } from "react"
import API_CONFIG from "@/utils/apiConfig"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, X, Shield, AlertTriangle, Users, Settings, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useWebSocket } from "@/hooks/useWebSocket"
import { useScreenshotDetection } from "@/hooks/useScreenshotDetection"
import type React from "react"
import ChatMessage from "@/components/ChatMessage"

export default function ChatRoom() {
  const { id } = useParams() as { id: string }
  const [inputMessage, setInputMessage] = useState("")
  const [username, setUsername] = useState("")
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isScreenshotTaken = useScreenshotDetection()

  // Generate a random username on component mount
  useEffect(() => {
    const randomUsername = Math.random().toString(36).substring(7)
    setUsername(randomUsername)

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }
    document.addEventListener("contextmenu", handleContextMenu)

    // Disable text selection
    document.body.style.userSelect = "none"

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.body.style.userSelect = ""
    }
  }, [])

  // Connect to WebSocket
  const {
    messages,
    sendMessage,
    isConnected,
    isLoading,
    error,
    participants,
    maxParticipants
  } = useWebSocket(id, username)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const message = inputMessage.trim()
    
    if (!message || message.length > 1000) {
      return
    }

    setIsSending(true)
    try {
      const success = await sendMessage(message)
      if (success) {
        setInputMessage("")
      }
    } catch (err) {
      console.error("Failed to send message:", err)
    } finally {
      setIsSending(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value)
  }

  const leaveChat = () => {
    if (window.confirm("Are you sure you want to leave this chat?")) {
      // Simply navigate to the homepage. The WebSocket connection will close automatically.
      window.location.href = "/"
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f]">
      {isScreenshotTaken && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white p-2 text-center z-50">
          <AlertTriangle className="inline-block mr-2" />
          Screenshot detected! This action has been logged.
        </div>
      )}

      <header className="bg-gray-800 p-3 sm:p-4 flex justify-between items-center gap-2">
        <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="flex items-center min-w-0">
          <Shield className="mr-2 text-yellow-400 flex-shrink-0" />
          <h1 className="text-lg sm:text-xl font-bold text-purple-300 truncate">AnonChat: Room {id}</h1>
          {isConnected && (
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full flex-shrink-0">
              Connected
            </span>
          )}
        </motion.div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden xs:flex items-center bg-gray-700/50 px-2 sm:px-3 py-1 rounded-full">
            <Users className="mr-1 sm:mr-2 text-purple-300 h-3 sm:h-4 w-3 sm:w-4" />
            <span className="text-xs sm:text-sm text-gray-300 truncate">
              {participants?.length ?? '?'}/{maxParticipants ?? '?'}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-gray-300 hover:text-white">
            <Settings className="mr-2" />
            Settings
          </Button>
          <Button onClick={leaveChat} variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
            <span className="hidden sm:inline">Leave Chat</span>
            <X className="sm:ml-2" />
          </Button>
        </div>
      </header>

      <main ref={chatContainerRef} className="flex-1 overflow-auto p-4 bg-gray-900">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Loader2 className="w-12 h-12 mb-4 text-yellow-400 animate-spin" />
            <p className="text-lg font-medium">Connecting to chat...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-400">
            <AlertTriangle className="w-12 h-12 mb-4 text-red-400" />
            <p className="text-lg font-medium">Error connecting to chat</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Shield className="w-12 h-12 mb-4 text-yellow-400" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start the conversation by sending a message</p>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwnMessage={message.sender_id === username}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="bg-gray-800 p-2 sm:p-4">
        <form onSubmit={handleSendMessage} className="flex gap-1 sm:gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={handleInputChange}
            className="flex-grow bg-gray-700 text-white border-gray-600 focus:border-purple-500 focus:ring-purple-500"
            disabled={!isConnected}
          />
          <Button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 button-glow"
            disabled={!isConnected || !inputMessage.trim()}
          >
            <Send className="mr-2" />
            Send
          </Button>
        </form>
      </footer>
    </div>
  )
}
