import React from "react"
import { motion } from "framer-motion"
import { Shield, Download, File, User, Info } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ChatMessageProps {
  message: {
    id: string
    chat_id: string
    sender_id: string
    sender_name: string
    content: string
    message_type: "Text" | "File" | "Join" | "Leave" | "System"
    timestamp: string
    file_info?: {
      name: string
      size: number
      mime_type: string
      content: string
    }
  }
  isOwnMessage: boolean
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
  const timestamp = new Date(message.timestamp)
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true })

  const handleDownload = () => {
    if (!message.file_info) return

    const link = document.createElement("a")
    link.href = `data:${message.file_info.mime_type};base64,${message.file_info.content}`
    link.download = message.file_info.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
        {!isOwnMessage && (
          <div className="flex items-center mb-1">
            <Shield className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium text-yellow-400">{message.sender_name}</span>
          </div>
        )}

        {message.message_type === "File" && message.file_info ? (
          <div className="mb-2">
            <div className="flex items-center bg-gray-900/50 p-2 rounded-md">
              <File className="text-purple-400 mr-2" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{message.file_info.name}</div>
                <div className="text-xs text-gray-400">
                  {(message.file_info.size / 1024).toFixed(1)} KB
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="ml-2 p-1 bg-gray-700 hover:bg-gray-600 rounded-full"
                title="Download file"
              >
                <Download className="w-4 h-4 text-purple-300" />
              </button>
            </div>
          </div>
        ) : null}

        <p className="text-white break-words">{message.content}</p>
        <div className="text-right mt-1">
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage