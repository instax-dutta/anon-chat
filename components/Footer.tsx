import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-800 bg-opacity-30 backdrop-blur-sm text-gray-400 py-4 px-4 text-center text-sm">
      <div className="container mx-auto">
        <p className="flex items-center justify-center space-x-2">
          <span>© AnonChat</span>
          <span>|</span>
          <span>
            UI by{" "}
            <Link
              href="https://github.com/instax-dutta"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              SDAD
            </Link>
          </span>
          <span>|</span>
          <span>
            Backend by{" "}
            <Link
              href="https://github.com/S8M1T"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              S8M1T
            </Link>
          </span>
        </p>
      </div>
    </footer>
  )
}

