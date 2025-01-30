import { Inter } from "next/font/google"
import "./globals.css"
import Footer from "@/components/Footer"
import ParticleBackground from "@/components/ParticleBackground"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AnonChat",
  description: "Secure and anonymous chatting platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0f] text-gray-100 min-h-screen flex flex-col`}>
        <div className="relative flex-grow">
          <ParticleBackground />
          <main className="relative z-10">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  )
}

