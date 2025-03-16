"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Lock, Loader2 } from "lucide-react"
import ShareableLink from "@/components/ShareableLink"
import { motion } from "framer-motion"

interface ChatResponse {
  chat_id: string
  onion_address: string
  web_address: string
}

export default function CreateChatPage() {
  const [chatTitle, setChatTitle] = useState("")
  const [chatData, setChatData] = useState<ChatResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Get the API URL based on the environment
      const isProduction = process.env.NODE_ENV === "production"
      const apiUrl = isProduction
        ? `${window.location.origin}/api/chat`
        : "http://localhost:3000/api/chat"

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: chatTitle.trim() || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create chat: ${response.statusText}`)
      }

      const data = await response.json()
      setChatData(data)
    } catch (err) {
      console.error("Error creating chat:", err)
      setError(err instanceof Error ? err.message : "Failed to create chat room")
    } finally {
      setIsLoading(false)
    }
  }

  if (chatData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col items-center justify-center p-4"
      >
        <h1 className="text-3xl font-bold mb-6 text-purple-300">Chat Room Created</h1>
        <ShareableLink
          chatId={chatData.chat_id}
          onionAddress={chatData.onion_address}
        />
        <Button
          asChild
          className="mt-6 bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 button-glow"
        >
          <a href={`/chat/${chatData.chat_id}`}>
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
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-md mb-6 w-full max-w-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="glassmorphism p-6 mb-6">
          <Input
            type="text"
            placeholder="Enter chat title (optional)"
            value={chatTitle}
            onChange={(e) => setChatTitle(e.target.value)}
            className="mb-4 bg-gray-800 text-white border-gray-700 focus:border-purple-500 focus:ring-purple-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 button-glow"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Chat Room
                <ArrowRight className="ml-2" />
              </>
            )}
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

