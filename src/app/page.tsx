"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"

export default function Component() {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null
  const isDirect = searchParams?.get("direct") === "true"
  const [bootText, setBootText] = useState("")
  const [progress, setProgress] = useState(0)
  const [showSmile, setShowSmile] = useState(false)
  const [showGameBoy, setShowGameBoy] = useState(isDirect)
  const [musicStarted, setMusicStarted] = useState(false)

  const fullBootText = "BOOTING SYSTEM..."

  // Background music untuk Game Boy interface
  const backgroundMusic = "/music/LastNightOnEarth.mp3"

  useEffect(() => {
    if (isDirect) {
      setShowGameBoy(true)
      return
    }
    // Typing animation for boot text
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullBootText.length) {
        setBootText(fullBootText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            setShowSmile(true)
            setTimeout(() => setShowGameBoy(true), 2000)
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 80)

    return () => {
      clearInterval(typingInterval)
      clearInterval(progressInterval)
    }
  }, [isDirect])

  // Auto-play music when Game Boy interface appears
  useEffect(() => {
    if (showGameBoy && !musicStarted) {
      const playBackgroundMusic = async () => {
        const audio = audioRef.current
        if (audio) {
          try {
            audio.volume = 0.3 // Set volume to 30%
            audio.loop = true // Loop the background music
            await audio.play()
            setMusicStarted(true)
            console.log("Background music started")
          } catch (error) {
            console.log("Autoplay blocked by browser:", error)
            // Fallback: music will start on first user interaction
          }
        }
      }

      // Small delay to ensure Game Boy interface is fully loaded
      const timer = setTimeout(playBackgroundMusic, 1000)
      return () => clearTimeout(timer)
    }
  }, [showGameBoy, musicStarted])

  // Handle user interaction to start music if autoplay was blocked
  const handleUserInteraction = async () => {
    if (showGameBoy && !musicStarted) {
      const audio = audioRef.current
      if (audio) {
        try {
          await audio.play()
          setMusicStarted(true)
        } catch (error) {
          console.log("Could not start music:", error)
        }
      }
    }
  }

  const handleNavigation = (path: string) => {
    // Pause background music when navigating away
    if (audioRef.current) {
      audioRef.current.pause()
    }
    router.push(path)
  }

  if (!showGameBoy) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Grid pattern background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Terminal window */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-black border-2 border-green-400 rounded-lg p-6 w-full max-w-md shadow-2xl shadow-green-400/20">
            {/* Terminal header */}
            <div className="text-center mb-6">
              <h1 className="text-green-400 text-xl font-pixel font-bold tracking-wider">Dari Dapa</h1>
            </div>

            {/* Boot command */}
            <div className="mb-4">
              <div className="text-green-400 font-pixel text-sm">
                {"> "}
                {bootText}
                <span className="animate-pulse">_</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="bg-gray-800 h-4 rounded border border-green-400/30 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-100 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-green-400/30 animate-pulse" />
                </div>
              </div>
              <div className="text-green-400 font-pixel text-xs mt-1 text-center">{progress}%</div>
            </div>

            {/* Smile message */}
            {showSmile && (
              <div className="text-center">
                <div className="text-yellow-400 font-pixel text-lg font-bold animate-pulse">SMILE!</div>
              </div>
            )}
          </div>
        </div>

        {/* Scanlines effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 0, 0.1) 2px,
              rgba(0, 255, 0, 0.1) 4px
            )`,
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden" onClick={handleUserInteraction}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-red-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 via-purple-500/20 to-blue-500/20 animate-pulse" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(255, 0, 150, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(0, 150, 255, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(150, 0, 255, 0.3) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Game Boy Device */}
      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="bg-gray-200 rounded-3xl p-6 shadow-2xl max-w-sm w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${musicStarted ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              ></div>
              <span className="text-xs font-bold text-gray-600">POWER</span>
            </div>
            <div className="text-xs font-bold text-gray-600">Dapa uwu</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs font-bold text-gray-600">BATTERY</span>
            </div>
          </div>

          {/* Screen */}
          <div className="bg-green-900 rounded-lg p-4 mb-6 h-32 flex flex-col justify-center items-center border-4 border-gray-800">
            <div className="text-green-400 font-pixel text-lg font-bold mb-2">Semangat</div>
            <div className="text-green-400 font-pixel text-lg font-bold mb-2">Ujian!</div>
            <div className="text-yellow-400 font-pixel text-xs">Press Start Button</div>
            {musicStarted && (
              <div className="text-green-300 font-pixel text-xs mt-1 animate-pulse">♪ Music Playing ♪</div>
            )}
          </div>

          {/* Music Status Indicator */}
          {!musicStarted && showGameBoy && (
            <div className="text-center mb-4">
              <div className="text-xs text-gray-600 font-pixel">Click anywhere to start music</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              onClick={() => handleNavigation("/message")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
            >
              MESSAGE
            </button>
            <button
              onClick={() => handleNavigation("/calm")}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
            >
              GALLERY
            </button>
            <button
              onClick={() => handleNavigation("/music")}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
            >
              MUSIC
            </button>
            <button
              onClick={() => handleNavigation("/tetris")}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
            >
              TETRIS
            </button>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-end">
            {/* Square D-Pad */}
            <div className="relative">
              <div className="w-16 h-16 relative">
                {/* Vertical bar */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-14 bg-gray-800 rounded-sm" />
                {/* Horizontal bar */}
                <div className="absolute top-1/2 left-1 transform -translate-y-1/2 w-14 h-4 bg-gray-800 rounded-sm" />
                {/* Direction buttons */}
                <button className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-5 bg-gray-700 hover:bg-gray-600 rounded-t-sm transition-colors" />
                <button className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-5 bg-gray-700 hover:bg-gray-600 rounded-b-sm transition-colors" />
                <button className="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-4 bg-gray-700 hover:bg-gray-600 rounded-l-sm transition-colors" />
                <button className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-4 bg-gray-700 hover:bg-gray-600 rounded-r-sm transition-colors" />
              </div>
            </div>

            {/* A/B Buttons */}
            <div className="flex gap-4">
              <button className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full text-white font-bold text-sm transition-colors">
                B
              </button>
              <button className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full text-white font-bold text-sm transition-colors">
                A
              </button>
            </div>
          </div>

          {/* Select/Start */}
          <div className="flex justify-center gap-4 mt-4">
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs transition-colors">
              SELECT
            </button>
            <button
              onClick={() => handleNavigation("/message")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs transition-colors"
            >
              START
            </button>
          </div>

          {/* Speaker */}
          <div className="mt-4 flex justify-center">
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className={`w-1 h-1 bg-gray-400 rounded-full ${musicStarted ? "animate-pulse" : ""}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background Music Audio Element */}
      <audio ref={audioRef} src={backgroundMusic} preload="auto" crossOrigin="anonymous" />

      {/* Windows activation watermark */}
      <div className="absolute bottom-4 right-4 text-white/50 text-xs">
        <div>Activate Windows</div>
        <div>Go to Settings to activate Windows.</div>
      </div>
    </div>
  )
}
