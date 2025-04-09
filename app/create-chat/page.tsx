"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Lock, Loader2, Users } from "lucide-react"
import ShareableLink from "@/components/ShareableLink"
import { motion } from "framer-motion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import API_CONFIG from "@/utils/apiConfig"

interface ChatResponse {
  chat_id: string
  onion_address: string
  web_address: string
  max_participants: number
}

export default function CreateChatPage() {
  const [chatTitle, setChatTitle] = useState("")
  const [maxParticipants, setMaxParticipants] = useState<string>("2")
  const [chatData, setChatData] = useState<ChatResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const apiUrl = API_CONFIG.getApiUrl("/chat");

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          max_participants: parseInt(maxParticipants, 10)
        }),
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.error || `Failed to create chat: ${response.statusText}`
        )
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
          maxParticipants={chatData.max_participants}
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
          <div className="mb-4">
            <Label htmlFor="chat-title" className="text-gray-300 mb-2 block">
              Chat Title (optional)
            </Label>
            <Input
              id="chat-title"
              type="text"
              placeholder="Enter a title for your chat"
              value={chatTitle}
              onChange={(e) => setChatTitle(e.target.value)}
              className="bg-gray-800 text-white border-gray-700 focus:border-purple-500 focus:ring-purple-500"
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="max-participants" className="text-gray-300 mb-2 block">
              Maximum Participants
            </Label>
            <div className="flex items-center">
              <Users className="mr-2 text-purple-400" />
              <Select
                value={maxParticipants}
                onValueChange={setMaxParticipants}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-gray-800 text-white border-gray-700 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Select maximum participants" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  <SelectItem value="2">2 people (private chat)</SelectItem>
                  <SelectItem value="5">5 people (small group)</SelectItem>
                  <SelectItem value="10">10 people (medium group)</SelectItem>
                  <SelectItem value="25">25 people (large group)</SelectItem>
                  <SelectItem value="50">50 people (very large group)</SelectItem>
                  <SelectItem value="100">100 people (maximum)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              By default, chats are limited to 2 participants for maximum privacy.
            </p>
          </div>

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
