"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, MessageSquare, Lock, Eye } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = [
    "Click 'Start Anonymous Chat'",
    "Share the generated link",
    "Chat securely and anonymously",
    "End chat to delete all data",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % steps.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10 space-y-6"
      >
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-yellow-400 text-shadow">
          AnonChat
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
          The privacy-first chat platform built on Tor hidden services.
        </p>
        <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto mt-4">
          AnonChat enables truly anonymous, end-to-end encrypted conversations without accounts or tracking. 
          Your chats are routed through the Tor network, ensuring your identity and location remain private. 
          No logs, no metadata, no compromises — just secure, ephemeral communication.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="z-10"
      >
        <Button
          asChild
          size="lg"
          className="px-8 py-4 text-lg sm:text-xl bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105 button-glow rounded-full"
        >
          <Link href="/create-chat">
            Start Anonymous Chat
            <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full z-10"
      >
        <FeatureCard
          icon={<Shield className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400" />}
          title="End-to-end Encrypted"
          description="State-of-the-art encryption for your peace of mind."
        />
        <FeatureCard
          icon={<MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />}
          title="Anonymous Chatting"
          description="Chat freely without revealing your identity."
        />
        <FeatureCard
          icon={<Lock className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400" />}
          title="Self-Destructing Chats"
          description="Messages vanish when the chat ends."
        />
        <FeatureCard
          icon={<Eye className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />}
          title="No Logs Policy"
          description="We don't store any of your conversations."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full max-w-4xl z-10"
      >
        <div className="glassmorphism p-6 sm:p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-300 text-center">How It Works</h2>
          <div className="relative h-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <p className="text-base sm:text-lg text-yellow-300">{steps[currentStep]}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentStep ? "bg-yellow-400" : "bg-gray-600"}`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="glassmorphism p-6 hover-lift">
      <div className="flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-purple-300">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  )
}
