import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Menu } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-gray-800 p-4 sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center text-white">
          <Shield className="mr-2" />
          AnonChat
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/privacy">Privacy</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-300 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 px-4 py-2 space-y-2">
          <Link href="/about" className="block text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link href="/privacy" className="block text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>
            Privacy
          </Link>
        </div>
      )}
    </header>
  )
}
