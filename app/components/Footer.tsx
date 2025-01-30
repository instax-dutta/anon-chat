import { Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-800 p-4 mt-8">
      <div className="container mx-auto text-center">
        <div className="flex justify-center items-center mb-4">
          <Shield className="mr-2 text-purple-400" />
          <span>Protected by Onion Routing</span>
        </div>
        <p className="text-sm text-gray-400">© 2023 AnonChat. All rights reserved. Your privacy is our priority.</p>
      </div>
    </footer>
  )
}

