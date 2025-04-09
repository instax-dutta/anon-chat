import React from "react"
import { motion } from "framer-motion"
import { Shield, User, Info } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ChatMessageProps {
  message: {
    id: string
    chat_id: string
    sender_id: string
    sender_name: string
    content: string
    message_type: "Text" | "Join" | "Leave" | "System"
    timestamp: string
  }
  isOwnMessage: boolean
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
  let timestamp: Date
  try {
    timestamp = new Date(message.timestamp)
    if (isNaN(timestamp.getTime())) throw new Error("Invalid date")
  } catch {
    timestamp = new Date() // fallback to now
  }
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true })

  // System messages
  if (message.message_type === "System") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center my-2"
      >
        <div className="bg-gray-800/50 text-gray-400 px-4 py-2 rounded-full text-sm flex items-center">
          <Info className="w-4 h-4 mr-2" />
          {message.content}
        </div>
      </motion.div>
    )
  }

  // Join/Leave messages
  if (message.message_type === "Join" || message.message_type === "Leave") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center my-2"
      >
        <div className="bg-gray-800/50 text-gray-400 px-4 py-2 rounded-full text-sm flex items-center">
          <User className="w-4 h-4 mr-2" />
          {message.content}
        </div>
      </motion.div>
    )
  }

  // Regular messages
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] ${
          isOwnMessage
            ? "bg-purple-600/30 border-purple-600/50"
            : "bg-gray-800/50 border-gray-700/50"
        } border rounded-lg p-3`}
      >
        <div className="flex items-center mb-1">
          <Shield className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-sm font-medium text-yellow-400">
            {isOwnMessage ? "You" : message.sender_name}
          </span>
        </div>

        <p className="text-white break-words">{message.content}</p>
        <div className="text-right mt-1">
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage
