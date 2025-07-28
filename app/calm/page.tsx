"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react"

export default function CalmPage() {
  const router = useRouter()
  const [currentMode, setCurrentMode] = useState<"menu" | "breathing" | "animation" | "stress">("menu")
  const [breathingActive, setBreathingActive] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [breathingCount, setBreathingCount] = useState(0)
  const [animationActive, setAnimationActive] = useState(false)
  const intervalRef = useRef<number | null>(null)

  // Breathing exercise timer
  useEffect(() => {
    if (breathingActive) {
      const phases = [
        { phase: "inhale", duration: 4000 },
        { phase: "hold", duration: 4000 },
        { phase: "exhale", duration: 6000 },
      ]

      let currentPhaseIndex = 0

      const runBreathingCycle = () => {
        const currentPhaseData = phases[currentPhaseIndex]
        setBreathingPhase(currentPhaseData.phase as "inhale" | "hold" | "exhale")

        intervalRef.current = setTimeout(() => {
          currentPhaseIndex = (currentPhaseIndex + 1) % phases.length
          if (currentPhaseIndex === 0) {
            setBreathingCount((prev) => prev + 1)
          }
          runBreathingCycle()
        }, currentPhaseData.duration) as unknown as number
      }

      runBreathingCycle()
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [breathingActive])

  const startBreathing = () => {
    setBreathingActive(true)
    setBreathingCount(0)
  }

  const stopBreathing = () => {
    setBreathingActive(false)
    if (intervalRef.current) {
      clearTimeout(intervalRef.current)
    }
  }

  const resetBreathing = () => {
    stopBreathing()
    setBreathingCount(0)
    setBreathingPhase("inhale")
  }

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case "inhale":
        return "Breathe In..."
      case "hold":
        return "Hold..."
      case "exhale":
        return "Breathe Out..."
    }
  }

  const getBreathingColor = () => {
    switch (breathingPhase) {
      case "inhale":
        return "from-blue-400 to-cyan-400"
      case "hold":
        return "from-purple-400 to-pink-400"
      case "exhale":
        return "from-green-400 to-teal-400"
    }
  }

  if (currentMode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 relative overflow-hidden">
        {/* Calming background animation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 via-cyan-500/10 to-blue-500/10 animate-pulse" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                radial-gradient(circle at 30% 40%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(0, 150, 255, 0.1) 0%, transparent 50%)
              `,
            }}
          />
        </div>

        {/* Game Boy Device */}
        <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
          <div className="bg-gray-200 rounded-3xl p-6 shadow-2xl max-w-sm w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={16} />
                <span className="text-xs font-bold">BACK</span>
              </button>
              <div className="text-xs font-bold text-gray-600">CALM MODE</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-gray-600">RELAX</span>
              </div>
            </div>

            {/* Screen */}
            <div className="bg-teal-900 rounded-lg p-4 mb-6 h-32 flex flex-col justify-center items-center border-4 border-gray-800">
              <div className="text-teal-400 font-pixel text-lg font-bold mb-2">CALM</div>
              <div className="text-cyan-400 font-pixel text-sm mb-2">Relaxation & Breathing</div>
              <div className="text-teal-300 font-pixel text-xs">Choose your path to peace</div>
            </div>

            {/* CALM Menu Options */}
            <div className="grid grid-cols-1 gap-2 mb-6">
              <button
                onClick={() => setCurrentMode("breathing")}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded text-sm transition-colors"
              >
                GUIDED BREATHING
              </button>
              <button
                onClick={() => setCurrentMode("animation")}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded text-sm transition-colors"
              >
                CALMING ANIMATIONS
              </button>
              <button
                onClick={() => setCurrentMode("stress")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded text-sm transition-colors"
              >
                STRESS MANAGEMENT
              </button>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => router.push("/")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs transition-colors"
              >
                HOME
              </button>
            </div>

            {/* Speaker with calming indicator */}
            <div className="mt-4 flex justify-center">
              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-teal-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentMode === "breathing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-teal-900 relative overflow-hidden">
        {/* Breathing background */}
        <div className="absolute inset-0">
          <div
            className={`absolute inset-0 bg-gradient-to-tr ${getBreathingColor()} opacity-20 transition-all duration-1000`}
          />
        </div>

        <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
          <div className="bg-gray-200 rounded-3xl p-6 shadow-2xl max-w-sm w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentMode("menu")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={16} />
                <span className="text-xs font-bold">BACK</span>
              </button>
              <div className="text-xs font-bold text-gray-600">BREATHING</div>
              <div className="text-xs font-bold text-gray-600">CYCLES: {breathingCount}</div>
            </div>

            {/* Breathing Screen */}
            <div className="bg-gray-900 rounded-lg p-4 mb-6 h-40 flex flex-col justify-center items-center border-4 border-gray-800 relative overflow-hidden">
              {/* Breathing Circle */}
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-r ${getBreathingColor()} transition-all duration-1000 ${
                  breathingPhase === "inhale" ? "scale-150" : breathingPhase === "hold" ? "scale-150" : "scale-75"
                } opacity-80`}
              />

              <div className="text-white font-pixel text-sm mt-4 text-center">{getBreathingInstruction()}</div>

              {breathingActive && (
                <div className="text-gray-400 font-pixel text-xs mt-2">
                  {breathingPhase === "inhale" ? "4s" : breathingPhase === "hold" ? "4s" : "6s"}
                </div>
              )}
            </div>

            {/* Breathing Controls */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={breathingActive ? stopBreathing : startBreathing}
                className={`${breathingActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white font-bold py-2 px-4 rounded text-sm transition-colors flex items-center justify-center gap-2`}
              >
                {breathingActive ? <Pause size={16} /> : <Play size={16} />}
                {breathingActive ? "STOP" : "START"}
              </button>
              <button
                onClick={resetBreathing}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                RESET
              </button>
              <button
                onClick={() => setCurrentMode("menu")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
              >
                MENU
              </button>
            </div>

            {/* Instructions */}
            <div className="text-center text-xs text-gray-600 mb-4">
              <p>Follow the circle: Inhale (4s) → Hold (4s) → Exhale (6s)</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentMode === "animation") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 relative overflow-hidden">
        {/* Floating particles animation */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
          <div className="bg-gray-200 rounded-3xl p-6 shadow-2xl max-w-sm w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentMode("menu")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={16} />
                <span className="text-xs font-bold">BACK</span>
              </button>
              <div className="text-xs font-bold text-gray-600">ANIMATIONS</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-gray-600">PEACE</span>
              </div>
            </div>

            {/* Animation Screen */}
            <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg p-4 mb-6 h-40 flex flex-col justify-center items-center border-4 border-gray-800 relative overflow-hidden">
              {/* Ripple effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-20 h-20 border-2 border-white/30 rounded-full animate-ping"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />
                ))}
              </div>

              <div className="text-white font-pixel text-sm text-center z-10">Calming Ripples</div>
              <div className="text-purple-300 font-pixel text-xs mt-2 text-center z-10">Watch and breathe deeply</div>
            </div>

            {/* Animation Controls */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setAnimationActive(!animationActive)}
                className={`${animationActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white font-bold py-2 px-4 rounded text-sm transition-colors`}
              >
                {animationActive ? "PAUSE" : "PLAY"}
              </button>
              <button
                onClick={() => setCurrentMode("menu")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
              >
                MENU
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentMode === "stress") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
          <div className="bg-gray-200 rounded-3xl p-6 shadow-2xl max-w-sm w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentMode("menu")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={16} />
                <span className="text-xs font-bold">BACK</span>
              </button>
              <div className="text-xs font-bold text-gray-600">STRESS MGMT</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-gray-600">CALM</span>
              </div>
            </div>

            {/* Stress Management Screen */}
            <div className="bg-green-900 rounded-lg p-4 mb-6 h-40 flex flex-col justify-center items-center border-4 border-gray-800">
              <div className="text-green-400 font-pixel text-sm font-bold mb-2 text-center">Stress Relief Tips</div>
              <div className="text-green-300 font-pixel text-xs text-center leading-relaxed">
                • Take deep breaths
                <br />• Count to 10
                <br />• Focus on present
                <br />• Relax your muscles
                <br />• Think positive thoughts
              </div>
            </div>

            {/* Stress Management Options */}
            <div className="grid grid-cols-1 gap-2 mb-4">
              <button
                onClick={() => setCurrentMode("breathing")}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
              >
                QUICK BREATHING
              </button>
              <button
                onClick={() => router.push("/?direct=true")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
              >
                BACK TO MENU
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
