import { useState } from "react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { File, ExternalLink, ThumbsUp, Heart, Smile, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatMessageProps {
  message: {
    id: number
    text: string
    sender: string
    timestamp: Date
    type: "text" | "file"
  }
  currentUser: string
}

export default function ChatMessage({ message, currentUser }: ChatMessageProps) {
  const [reaction, setReaction] = useState<string | null>(null)
  const isCurrentUser = message.sender === currentUser

  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline flex items-center"
            onClick={(e) => {
              e.stopPropagation()
              if (!window.confirm("Are you sure you want to open this link? It may contain malicious content.")) {
                e.preventDefault()
              }
            }}
          >
            {part}
            <ExternalLink className="ml-1 w-4 h-4" />
          </a>
        )
      }
      return part
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.text)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`max-w-xs md:max-w-md ${isCurrentUser ? "order-2" : ""}`}>
        <div className="flex items-center mb-1">
          <span className={`text-sm font-semibold ${isCurrentUser ? "text-purple-300" : "text-yellow-300"}`}>
            {isCurrentUser ? "You" : message.sender}
          </span>
          <span className="text-xs text-gray-400 ml-2">{format(new Date(message.timestamp), "HH:mm")}</span>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`rounded-lg p-3 backdrop-blur-sm ${isCurrentUser ? "bg-purple-600/70" : "bg-gray-800/70"}`}
        >
          {message.type === "file" ? (
            <div className="flex items-center">
              <File className="mr-2" />
              <span>{message.text}</span>
            </div>
          ) : (
            <p className="break-words">{renderTextWithLinks(message.text)}</p>
          )}
        </motion.div>
        <div className="flex items-center mt-1 space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-300"
                  onClick={() => setReaction(reaction === "like" ? null : "like")}
                >
                  <ThumbsUp className={`w-4 h-4 ${reaction === "like" ? "text-blue-400" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Like</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-300"
                  onClick={() => setReaction(reaction === "love" ? null : "love")}
                >
                  <Heart className={`w-4 h-4 ${reaction === "love" ? "text-red-400" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Love</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-300"
                  onClick={() => setReaction(reaction === "smile" ? null : "smile")}
                >
                  <Smile className={`w-4 h-4 ${reaction === "smile" ? "text-yellow-400" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Smile</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-300"
                  onClick={copyToClipboard}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  )
}

