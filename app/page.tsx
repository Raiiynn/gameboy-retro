"use client"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// ✅ Komponen terpisah untuk handle search params
function GameBoyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  // ✅ Cek apakah ada parameter 'direct' untuk skip booting
  const skipBooting = searchParams.get("direct") === "true"

  useEffect(() => {
    // ✅ Jika direct=true, langsung skip booting
    if (skipBooting) {
      setIsLoading(false)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(interval)
  }, [skipBooting])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="border-2 border-green-400 bg-black p-8 rounded-lg w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="font-press-start text-green-400 text-lg mb-4">MOOD BOOSTER</h1>
          </div>

          <div className="mb-4">
            <div className="font-press-start text-green-400 text-xs mb-2">{"> BOOTING SYSTEM..."}</div>

            <div className="bg-gray-800 rounded-full h-4 mb-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-100 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="font-press-start text-xs text-gray-400">{progress}%</div>
          </div>

          <div className="text-center">
            <div className="font-press-start text-yellow-400 text-sm">SMILE!</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-purple-600 flex items-center justify-center p-4">
      <div className="gameboy-body p-6 w-full max-w-sm">
        {/* Power and Battery Indicators */}
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="font-press-start text-xs text-gray-700">POWER</span>
          </div>
          <div className="font-press-start text-xs text-gray-700 text-center">BUAT ILA</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="font-press-start text-xs text-gray-700">BATTERY</span>
          </div>
        </div>

        {/* Game Boy Screen */}
        <div className="gameboy-screen rounded p-4 mb-4">
          <div className="text-center">
            <h1 className="retro-green font-press-start text-lg mb-2">Happy</h1>
            <h1 className="retro-green font-press-start text-lg mb-4">Birthday!</h1>
            <p className="retro-yellow font-press-start text-xs mb-4">Press Start Button</p>
          </div>
        </div>

        {/* Menu Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            onClick={() => router.push("/message")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-press-start text-xs py-3 px-4 rounded transition-colors"
          >
            MESSAGE
          </button>
          <button
            onClick={() => router.push("/calm")}
            className="bg-red-500 hover:bg-red-600 text-white font-press-start text-xs py-3 px-4 rounded transition-colors"
          >
            CALM
          </button>
          <button
            onClick={() => router.push("/music")}
            className="bg-purple-500 hover:bg-purple-600 text-white font-press-start text-xs py-3 px-4 rounded transition-colors"
          >
            MUSIC
          </button>
          <button
            onClick={() => router.push("/tetris")}
            className="bg-green-500 hover:bg-green-600 text-white font-press-start text-xs py-3 px-4 rounded transition-colors"
          >
            TETRIS
          </button>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          {/* D-Pad */}
          <div className="relative w-16 h-16">
            <div className="absolute top-1/2 left-0 right-0 h-5 bg-gray-600 transform -translate-y-1/2 rounded"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-5 bg-gray-600 transform -translate-x-1/2 rounded"></div>
          </div>

          {/* A and B Buttons */}
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-press-start text-xs cursor-pointer hover:bg-red-600">
              B
            </div>
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-press-start text-xs cursor-pointer hover:bg-red-600">
              A
            </div>
          </div>
        </div>

        {/* Select and Start Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <button className="bg-gray-600 text-white font-press-start text-xs py-1 px-3 rounded-full hover:bg-gray-500">
            SELECT
          </button>
          <button
            onClick={() => router.push("/music")}
            className="bg-gray-600 text-white font-press-start text-xs py-1 px-3 rounded-full hover:bg-gray-500"
          >
            START
          </button>
        </div>

        {/* Speaker Grille */}
        <div className="grid grid-cols-6 gap-1 p-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="w-1 h-1 bg-gray-500 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Windows activation watermark */}
      <div className="absolute bottom-4 right-4 text-white/50 text-xs">
        <div>Activate Windows</div>
        <div>Go to Settings to activate Windows.</div>
      </div>
    </div>
  )
}

// ✅ Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="border-2 border-green-400 bg-black p-8 rounded-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="font-press-start text-green-400 text-lg mb-4">MOOD BOOSTER</h1>
        </div>
        <div className="mb-4">
          <div className="font-press-start text-green-400 text-xs mb-2">{"> LOADING..."}</div>
          <div className="bg-gray-800 rounded-full h-4 mb-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full animate-pulse" style={{ width: "50%" }} />
          </div>
        </div>
        <div className="text-center">
          <div className="font-press-start text-yellow-400 text-sm">SMILE!</div>
        </div>
      </div>
    </div>
  )
}

// ✅ Main component dengan Suspense boundary
export default function HomePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GameBoyContent />
    </Suspense>
  )
}
