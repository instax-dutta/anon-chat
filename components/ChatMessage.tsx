import { format } from "date-fns"
import { motion } from "framer-motion"

interface ChatMessageProps {
  message: {
    id: number
    text: string
    sender: string
    timestamp: Date
  }
  currentUser: string
}

export default function ChatMessage({ message, currentUser }: ChatMessageProps) {
  const isCurrentUser = message.sender === currentUser

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`max-w-xs md:max-w-md rounded-lg p-3 ${
          isCurrentUser ? "bg-gradient-to-r from-purple-600 to-yellow-500" : "glassmorphism"
        }`}
      >
        <p className="text-sm font-semibold mb-1">{isCurrentUser ? "You" : message.sender}</p>
        <p className="break-words">{message.text}</p>
        <p className="text-xs text-gray-400 mt-1">{format(message.timestamp, "HH:mm")}</p>
      </motion.div>
    </motion.div>
  )
}

