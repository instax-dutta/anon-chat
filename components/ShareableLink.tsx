import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, Users, Mail, Send, Plus, X } from "lucide-react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface ShareableLinkProps {
  chatId: string
  onionAddress?: string // Keeping for backward compatibility but not using it
  maxParticipants?: number
}

export default function ShareableLink({ chatId, maxParticipants }: ShareableLinkProps) {
  const [copiedWeb, setCopiedWeb] = useState(false)
  const [emails, setEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [isValidEmail, setIsValidEmail] = useState(true)
  const webLink = `${window.location.origin}/chat/${chatId}`

  const copyWebLink = () => {
    navigator.clipboard.writeText(webLink)
    setCopiedWeb(true)
    setTimeout(() => setCopiedWeb(false), 2000)
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCurrentEmail(value)
    setIsValidEmail(value === "" || validateEmail(value))
  }

  const addEmail = () => {
    if (currentEmail && validateEmail(currentEmail) && !emails.includes(currentEmail)) {
      setEmails([...emails, currentEmail])
      setCurrentEmail("")
    } else if (!validateEmail(currentEmail)) {
      setIsValidEmail(false)
    } else if (emails.includes(currentEmail)) {
      toast({
        title: "Email already added",
        description: "This email is already in the list",
        variant: "destructive",
      })
    }
  }

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addEmail()
    }
  }

  const sendInvites = () => {
    if (emails.length === 0) {
      toast({
        title: "No emails added",
        description: "Please add at least one email address",
        variant: "destructive",
      })
      return
    }

    const subject = "🔒 Join me in a secure chat on AnonChat"
    const body = `
Hi there,

🌟 You've been invited to join a private, secure conversation on AnonChat! 🌟

💬 AnonChat provides end-to-end encrypted messaging where your privacy is our top priority.

🔐 No registration required, no personal data stored, and messages disappear after 24 hours.

📱 Simply click the magic link below to join instantly:
${webLink}

⏳ This invitation expires in 24 hours and can only be used once.

${maxParticipants && maxParticipants > 2 ? `👥 This is a group chat with up to ${maxParticipants} participants.` : "👤 This is a private one-on-one conversation."}

Looking forward to chatting with you!

✨ Sent via AnonChat - Secure, Private, Ephemeral
    `.trim()

    const mailtoLink = `mailto:${emails.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink, '_blank')

    toast({
      title: "✨ Invitation Ready!",
      description: `Your secure chat invite is prepared for ${emails.length} recipient${emails.length > 1 ? 's' : ''}. Check your email client to send it.`,
      variant: "default"
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glassmorphism p-6 w-full max-w-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-purple-300">Share this link to start chatting</h2>
        {maxParticipants && (
          <Badge variant="outline" className="bg-gray-800 text-yellow-400 border-yellow-500/50 flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {maxParticipants} {maxParticipants === 1 ? 'person' : 'people'}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="web" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="web">Web Link</TabsTrigger>
          <TabsTrigger value="email">Email Invite</TabsTrigger>
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
            Secure link for sharing with others. All traffic is routed through secure channels.
          </p>
        </TabsContent>

        <TabsContent value="email">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="email"
                value={currentEmail}
                onChange={handleEmailChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter email address"
                className={`flex-grow bg-gray-800 text-white border-gray-700 focus:border-purple-500 focus:ring-purple-500 ${!isValidEmail ? 'border-red-500' : ''}`}
              />
              <Button 
                onClick={addEmail} 
                variant="secondary" 
                className="bg-gray-700 hover:bg-gray-600"
                disabled={!currentEmail || !isValidEmail}
              >
                <Plus className="mr-2" />
                Add
              </Button>
            </div>
            
            {!isValidEmail && (
              <p className="text-sm text-red-500">Please enter a valid email address</p>
            )}

            {emails.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-400 mb-2">Recipients:</p>
                <div className="flex flex-wrap gap-2">
                  {emails.map((email, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="bg-gray-700 text-white flex items-center gap-1 py-1 px-2"
                    >
                      <Mail className="w-3 h-3" />
                      <span>{email}</span>
                      <button 
                        onClick={() => removeEmail(email)}
                        className="ml-1 text-gray-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={sendInvites} 
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105"
              disabled={emails.length === 0}
            >
              <Send className="mr-2 w-4 h-4" />
              {emails.length > 1 ? `Send ${emails.length} Magic Invites ✨` : 'Send Magic Invite ✨'}
            </Button>

            <p className="text-sm text-gray-400 italic">
              ✨ This will open your email client with a beautifully crafted invitation message. Your recipients will receive a secure, one-time link to join your chat.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 text-sm text-gray-400">
        <p>This link will only work once and expires after 24 hours.</p>
        {maxParticipants && maxParticipants > 2 && (
          <p className="mt-2 flex items-center">
            <Users className="w-4 h-4 mr-1 text-purple-400" />
            <span>This is a group chat that can accommodate up to {maxParticipants} participants.</span>
          </p>
        )}
        {maxParticipants && maxParticipants === 2 && (
          <p className="mt-2 flex items-center">
            <Users className="w-4 h-4 mr-1 text-purple-400" />
            <span>This is a private one-on-one chat.</span>
          </p>
        )}
      </div>
    </motion.div>
  )
}

