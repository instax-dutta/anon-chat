import { Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-800 mt-8 py-6 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
        <div className="flex justify-center md:justify-start items-center space-x-2">
          <Shield className="text-purple-400" />
          <span className="text-gray-300">Protected by Onion Routing</span>
        </div>
        <p className="text-sm text-gray-400">© 2025 AnonChat. All rights reserved. Your privacy is our priority.</p>
      </div>
    </footer>
  )
}
