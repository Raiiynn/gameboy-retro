"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"

export default function MusicPage() {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [audioError, setAudioError] = useState(false)

  // Playlist sesuai dengan file musik yang ada
  const playlist = [
    {
      title: "On Bended Knee",
      artist: "Boyz II Men",
      duration: "5:20",
      url: "/music/OnMelancholyHill.mp3",
    },
    {
      title: "(Everything I Do) I Do It For You",
      artist: "Bryan Adams",
      duration: "6:32",
      url: "/music/endlessly.mp3",
    },
    {
      title: "Just the Two of Us",
      artist: "Bill Withers",
      duration: "7:18",
      url: "/music/SelaluAda.mp3",
    },
    {
      title: "Nothing's Gonna Change My Love For You",
      artist: "George Benson",
      duration: "3:52",
      url: "/music/PergiMakan.mp3",
    },
    {
      title: "How Deep Is Your Love",
      artist: "Bee Gees",
      duration: "3:58",
      url: "/music/Wonderwall.mp3",
    },
  ]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration)
      }
    }
    const handleEnded = () => {
      setIsPlaying(false)
      const nextIndex = (currentTrack + 1) % playlist.length
      setCurrentTrack(nextIndex)
      setCurrentTime(0)

      setTimeout(async () => {
        if (audio) {
          try {
            setIsLoading(true)
            audio.load()
            await audio.play()
            setIsPlaying(true)
            setIsLoading(false)
          } catch (error) {
            console.error("Error playing next track:", error)
            setIsLoading(false)
            setIsPlaying(false)
            setAudioError(true)
          }
        }
      }, 100)
    }
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => {
      setIsLoading(false)
      setAudioError(false)
    }
    const handleError = () => {
      setIsLoading(false)
      setIsPlaying(false)
      setAudioError(true)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("error", handleError)

    audio.volume = 0.7

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("error", handleError)
    }
  }, [currentTrack, playlist.length])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        setIsLoading(true)
        await audio.play()
        setIsPlaying(true)
        setIsLoading(false)
        setAudioError(false)
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      setIsLoading(false)
      setIsPlaying(false)
      setAudioError(true)
    }
  }

  const playTrack = async (index: number) => {
    if (index === currentTrack && isPlaying) {
      togglePlay()
      return
    }

    setCurrentTrack(index)
    setCurrentTime(0)
    setAudioError(false)

    setTimeout(async () => {
      const audio = audioRef.current
      if (audio) {
        try {
          setIsLoading(true)
          audio.load()
          await audio.play()
          setIsPlaying(true)
          setIsLoading(false)
        } catch (error) {
          console.error("Error playing track:", error)
          setIsLoading(false)
          setIsPlaying(false)
          setAudioError(true)
        }
      }
    }, 100)
  }

  const nextTrack = () => {
    const nextIndex = (currentTrack + 1) % playlist.length
    playTrack(nextIndex)
  }

  const prevTrack = () => {
    const prevIndex = (currentTrack - 1 + playlist.length) % playlist.length
    playTrack(prevIndex)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const newTime = (clickX / width) * duration

    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  return (
    <div className="min-h-screen bg-purple-600 flex items-center justify-center p-4">
      <div className="bg-black border-4 border-yellow-400 rounded-lg p-4 w-full max-w-sm shadow-2xl">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-green-400 font-press-start text-sm">Music Player</h1>
        </div>

        {/* Album Art */}
        <div className="bg-gray-700 border-2 border-gray-600 rounded p-3 mb-4">
          <div className="bg-gray-600 h-24 rounded mb-3 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
              <span className="text-gray-500 text-xs">♪</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-press-start text-xs mb-1">{playlist[currentTrack].title}</div>
            <div className="text-green-400 font-press-start text-xs mb-1">{playlist[currentTrack].artist}</div>
            {audioError && <div className="text-red-400 font-press-start text-xs">Failed to load audio</div>}
          </div>
        </div>

        {/* Time and Volume */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-400 font-press-start text-xs">{formatTime(currentTime)}</span>
          <span className="text-green-400 font-press-start text-xs">
            {duration ? formatTime(duration) : playlist[currentTrack].duration}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="bg-gray-700 h-2 rounded cursor-pointer relative" onClick={handleProgressClick}>
            <div
              className="bg-gray-400 h-full rounded transition-all duration-100"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
            <div
              className="absolute top-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Volume Display */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-green-400 font-press-start text-xs">♪</span>
          <div className="flex-1 mx-2 bg-gray-700 h-2 rounded">
            <div className="bg-gray-400 h-full rounded" style={{ width: "70%" }} />
          </div>
          <span className="text-green-400 font-press-start text-xs">70%</span>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={prevTrack}
            className="bg-blue-500 hover:bg-blue-600 text-white font-press-start text-xs py-2 px-3 rounded transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <SkipBack size={12} />
          </button>
          <button
            onClick={togglePlay}
            className="bg-blue-500 hover:bg-blue-600 text-white font-press-start text-xs py-2 px-4 rounded transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "..." : isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={nextTrack}
            className="bg-blue-500 hover:bg-blue-600 text-white font-press-start text-xs py-2 px-3 rounded transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <SkipForward size={12} />
          </button>
        </div>

        {/* Playlist */}
        <div className="mb-4">
          <div className="text-yellow-400 font-press-start text-xs mb-2">PLAYLIST:</div>
          <div className="bg-black border border-gray-600 rounded p-2 h-32 overflow-y-scroll retro-scroll-playlist">
            {playlist.map((track, index) => (
              <div
                key={index}
                onClick={() => playTrack(index)}
                className={`flex justify-between items-center text-xs cursor-pointer hover:bg-gray-800 p-1 rounded transition-colors mb-1 ${
                  index === currentTrack ? "bg-gray-800" : ""
                }`}
              >
                <span className="text-green-400 font-press-start text-xs flex-1">
                  {index + 1}. {track.title}
                </span>
                <span className="text-green-400 font-press-start text-xs ml-2">{track.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-4">
          <div className="text-green-400 font-press-start text-xs">Click play button or song title</div>
          <div className="text-green-400 font-press-start text-xs">to start music</div>
        </div>

        {/* Back Button - ✅ LANGSUNG KE GAMEBOY */}
        <button
          onClick={() => router.push("/?direct=true")}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-press-start text-xs py-3 px-4 rounded transition-colors"
        >
          SELANJUTNYA
        </button>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src={playlist[currentTrack].url} preload="metadata" crossOrigin="anonymous" />
      </div>
    </div>
  )
}
