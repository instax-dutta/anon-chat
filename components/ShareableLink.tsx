import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check } from "lucide-react"
import { motion } from "framer-motion"

interface ShareableLinkProps {
  chatId: string
}

export default function ShareableLink({ chatId }: ShareableLinkProps) {
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}/chat/${chatId}`

  const copyLink = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glassmorphism p-6 w-full max-w-md"
    >
      <h2 className="text-xl font-semibold mb-4 text-purple-300">Share this link to start chatting</h2>
      <div className="flex space-x-2">
        <Input
          type="text"
          value={link}
          readOnly
          className="flex-grow bg-gray-800 text-white border-gray-700 focus:border-purple-500 focus:ring-purple-500"
        />
        <Button onClick={copyLink} variant="secondary" className="bg-gray-700 hover:bg-gray-600">
          {copied ? <Check className="mr-2" /> : <Copy className="mr-2" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
      <p className="mt-4 text-sm text-gray-400">This link will only work once and expires after 24 hours.</p>
    </motion.div>
  )
}

