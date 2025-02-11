"use client"

import { useEffect, useState } from "react"

export function useScreenshotDetection() {
  const [isScreenshotTaken, setIsScreenshotTaken] = useState(false)

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsScreenshotTaken(true)
        setTimeout(() => setIsScreenshotTaken(false), 3000)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) {
        setIsScreenshotTaken(true)
        setTimeout(() => setIsScreenshotTaken(false), 3000)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return isScreenshotTaken
}

