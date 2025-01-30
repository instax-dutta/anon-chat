"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Lock } from "lucide-react"
import ShareableLink from "@/components/ShareableLink"
import { motion } from "framer-motion"

export default function CreateChatPage() {
  const [chatTitle, setChatTitle] = useState("")
  const [chatId, setChatId] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, we'd make an API call here to create the chat room
    const newChatId = Math.random().toString(36).substring(7)
    setChatId(newChatId)
  }

  if (chatId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col items-center justify-center p-4"
      >
        <h1 className="text-3xl font-bold mb-6 text-purple-300">Chat Room Created</h1>
        <ShareableLink chatId={chatId} />
        <Button
          asChild
          className="mt-6 bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 button-glow"
        >
          <a href={`/chat/${chatId}`}>
            Enter Chat Room
            <ArrowRight className="ml-2" />
          </a>
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      <h1 className="text-3xl font-bold mb-6 text-purple-300">Create a New Chat</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="glassmorphism p-6 mb-6">
          <Input
            type="text"
            placeholder="Enter chat title (optional)"
            value={chatTitle}
            onChange={(e) => setChatTitle(e.target.value)}
            className="mb-4 bg-gray-800 text-white border-gray-700 focus:border-purple-500 focus:ring-purple-500"
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 button-glow"
          >
            Create Chat Room
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </form>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <Lock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <p className="text-gray-300 max-w-md">
          Your chat room will be secure and anonymous. No personal information is required or stored.
        </p>
      </motion.div>
    </motion.div>
  )
}

