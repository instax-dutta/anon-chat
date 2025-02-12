"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, X, Upload, Shield, File, AlertTriangle, Users, Settings, Loader2 } from "lucide-react"
import ChatMessage from "@/components/ChatMessage"
import { motion, AnimatePresence } from "framer-motion"
import { useSimulatedRealTimeChat } from "@/hooks/useSimulatedRealTimeChat"
import { useScreenshotDetection } from "@/hooks/useScreenshotDetection"
import type React from "react"

export default function ChatRoom() {
  const { id } = useParams() as { id: string }
  const [inputMessage, setInputMessage] = useState("")
  const [username, setUsername] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage, isLoading } = useSimulatedRealTimeChat(id)
  const isScreenshotTaken = useScreenshotDetection()

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messagesEndRef]) // Removed 'messages' from dependencies

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: username,
        timestamp: new Date(),
        type: "text" as const,
      }
      sendMessage(newMessage)
      setInputMessage("")
      setIsTyping(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value)
    setIsTyping(e.target.value.length > 0)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setTimeout(() => {
        const newMessage = {
          id: Date.now(),
          text: `File: ${file.name} (Upload simulated)`,
          sender: username,
          timestamp: new Date(),
          type: "file" as const,
        }
        sendMessage(newMessage)
        setIsUploading(false)
      }, 1500)
    }
  }

  const endChat = () => {
    if (window.confirm("Are you sure you want to end this chat? This action cannot be undone.")) {
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

      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="flex items-center">
          <Shield className="mr-2 text-yellow-400" />
          <h1 className="text-xl font-bold text-purple-300">AnonChat: Room {id}</h1>
        </motion.div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <Users className="mr-2" />
            Participants
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <Settings className="mr-2" />
            Settings
          </Button>
          <Button onClick={endChat} variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
            End Chat
            <X className="ml-2" />
          </Button>
        </div>
      </header>

      <main ref={chatContainerRef} className="flex-1 overflow-auto p-4 bg-gray-900">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Shield className="w-12 h-12 mb-4 text-yellow-400" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessage message={message} currentUser={username} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-gray-800 p-4">
        {isTyping && <div className="text-sm text-gray-400 mb-2">Someone is typing...</div>}
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={handleInputChange}
            className="flex-grow bg-gray-700 text-white border-gray-600 focus:border-purple-500 focus:ring-purple-500"
          />
          <Button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 button-glow"
          >
            <Send className="mr-2" />
            Send
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <Button
            type="button"
            variant="secondary"
            className="bg-gray-700 hover:bg-gray-600"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <File className="animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2" />
                Upload
              </>
            )}
          </Button>
        </form>
      </footer>
    </div>
  )
}

