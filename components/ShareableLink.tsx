import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ShareableLinkProps {
  chatId: string
  onionAddress?: string
}

export default function ShareableLink({ chatId, onionAddress }: ShareableLinkProps) {
  const [copiedWeb, setCopiedWeb] = useState(false)
  const [copiedOnion, setCopiedOnion] = useState(false)
  const webLink = `${window.location.origin}/chat/${chatId}`

  const copyWebLink = () => {
    navigator.clipboard.writeText(webLink)
    setCopiedWeb(true)
    setTimeout(() => setCopiedWeb(false), 2000)
  }

  const copyOnionLink = () => {
    if (onionAddress) {
      navigator.clipboard.writeText(`http://${onionAddress}/chat/${chatId}`)
      setCopiedOnion(true)
      setTimeout(() => setCopiedOnion(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glassmorphism p-6 w-full max-w-md"
    >
      <h2 className="text-xl font-semibold mb-4 text-purple-300">Share this link to start chatting</h2>

      <Tabs defaultValue="web" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="web">Web Link</TabsTrigger>
          <TabsTrigger value="onion">Onion Link (Tor)</TabsTrigger>
        </TabsList>

        <TabsContent value="web">
          <div className="flex space-x-2">
            <Input
              type="text"
              value={webLink}
              readOnly
              className="flex-grow bg-gray-800 text-white border-gray-700 focus:border-purple-500 focus:ring-purple-500"
            />
            <Button onClick={copyWebLink} variant="secondary" className="bg-gray-700 hover:bg-gray-600">
              {copiedWeb ? <Check className="mr-2" /> : <Copy className="mr-2" />}
              {copiedWeb ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Standard web link for regular browsers.
          </p>
        </TabsContent>

        <TabsContent value="onion">
          <div className="flex space-x-2">
            <Input
              type="text"
              value={onionAddress ? `http://${onionAddress}/chat/${chatId}` : "Loading onion address..."}
              readOnly
              className="flex-grow bg-gray-800 text-white border-gray-700 focus:border-purple-500 focus:ring-purple-500"
            />
            <Button
              onClick={copyOnionLink}
              variant="secondary"
              className="bg-gray-700 hover:bg-gray-600"
              disabled={!onionAddress}
            >
              {copiedOnion ? <Check className="mr-2" /> : <Copy className="mr-2" />}
              {copiedOnion ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="mt-2 text-sm text-yellow-400 flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            <span>For maximum privacy, use this link with Tor Browser.</span>
          </div>
        </TabsContent>
      </Tabs>

      <p className="mt-4 text-sm text-gray-400">This link will only work once and expires after 24 hours.</p>
    </motion.div>
  )
}

