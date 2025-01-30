"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, X, Upload, Shield } from "lucide-react"
import ChatMessage from "@/components/ChatMessage"
import { motion, AnimatePresence } from "framer-motion"
import type React from "react"

export default function ChatRoom() {
  const { id } = useParams()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [username, setUsername] = useState("")

  useEffect(() => {
    setUsername(Math.random().toString(36).substring(7))
  }, [])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: username,
        timestamp: new Date(),
      }
      setMessages([...messages, newMessage])
      setInputMessage("")
    }
  }

  const endChat = () => {
    if (window.confirm("Are you sure you want to end this chat? This action cannot be undone.")) {
      window.location.href = "/"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-screen"
    >
      <header className="glassmorphism p-4 flex justify-between items-center">
        <motion.h1
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-xl font-bold text-purple-300 flex items-center"
        >
          <Shield className="mr-2 text-yellow-400" />
          AnonChat: Room {id}
        </motion.h1>
        <Button onClick={endChat} variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
          End Chat
          <X className="ml-2" />
        </Button>
      </header>
      <motion.div
        className="flex-grow overflow-auto p-4 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
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
      </motion.div>
      <motion.footer className="glassmorphism p-4" initial={{ y: 20 }} animate={{ y: 0 }}>
        <form onSubmit={sendMessage} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow bg-gray-800 text-white border-gray-700 focus:border-purple-500 focus:ring-purple-500"
          />
          <Button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 button-glow"
          >
            <Send className="mr-2" />
            Send
          </Button>
          <Button type="button" variant="secondary" className="bg-gray-700 hover:bg-gray-600">
            <Upload className="mr-2" />
            Upload
          </Button>
        </form>
      </motion.footer>
    </motion.div>
  )
}

