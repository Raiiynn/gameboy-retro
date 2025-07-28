"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"

export default function MusicPage() {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Playlist sesuai dengan file musik yang ada
  const playlist = [
    {
      title: "Selalu Ada",
      artist: "Jumbo",
      duration: "2:56",
      url: "/music/SelaluAda.mp3",
      thumbnail: "/thumbnail/SelaluAda.jpg",
    },
    {
      title: "On Melancholy Hill",
      artist: "Plastic Beach",
      duration: "3:54",
      url: "/music/OnMelancholyHill.mp3", 
      thumbnail: "/thumbnail/OnMelancholyHill.jpg",
    },
    {
      title: "Besok Kita Pergi Makan",
      artist: "Sal Priadi",
      duration: "3:31",
      url: "/music/PergiMakan.mp3", // Sample audio
      thumbnail: "/thumbnail/PergiMakan.jpg",
    },
    {
      title: "Wonderwall",
      artist: "Oasis",
      duration: "4:18",
      url: "/music/Wonderwall.mp3", // Sample audio
      thumbnail: "/thumbnail/Wonderwall.jpg",
    },
    {
      title: "Endlessly",
      artist: "bixby",
      duration: "2:06",
      url: "/music/endlessly.mp3", // Sample audio
      thumbnail: "/thumbnail/endlessly.jpg",
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
      nextTrack()
    }
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => {
      setIsLoading(false)
      setError("")
    }
    const handleError = () => {
      setIsLoading(false)
      setError("Failed to load audio")
      setIsPlaying(false)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("error", handleError)

    audio.volume = volume

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("error", handleError)
    }
  }, [currentTrack, volume])

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
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      setError("Cannot play audio")
      setIsLoading(false)
      setIsPlaying(false)
    }
  }

  const playTrack = async (index: number) => {
    if (index === currentTrack && isPlaying) {
      togglePlay()
      return
    }

    setCurrentTrack(index)
    setCurrentTime(0)
    setError("")

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
          setError("Cannot play this track")
          setIsLoading(false)
          setIsPlaying(false)
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
      <div className="bg-retro-dark border-4 border-retro-yellow rounded-lg p-4 w-full max-w-sm shadow-2xl">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-retro-green font-press-start text-sm">Music Player</h1>
        </div>

        {/* Album Art */}
        <div className="bg-gray-800 border-2 border-gray-600 rounded p-2 mb-4">
          <div className="bg-gray-700 h-32 rounded mb-2 overflow-hidden">
            <img
              src={playlist[currentTrack].thumbnail || "/placeholder.svg"}
              alt={`${playlist[currentTrack].title} cover`}
              className="w-full h-full object-cover pixelated"
            />
          </div>
          <div className="text-center">
            <div className="text-retro-green font-press-start text-xs mb-1">{playlist[currentTrack].title}</div>
            <div className="text-retro-yellow font-press-start text-xs">{playlist[currentTrack].artist}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-white font-press-start text-xs mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{duration ? formatTime(duration) : playlist[currentTrack].duration}</span>
          </div>
          <div className="bg-gray-700 h-2 rounded cursor-pointer" onClick={handleProgressClick}>
            <div
              className="bg-retro-blue h-full rounded transition-all duration-100"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Circular Controls */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={prevTrack}
            className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
              <SkipBack size={12} className="text-gray-800" />
            </div>
          </button>

          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
              {isLoading ? (
                <div className="w-3 h-3 bg-gray-800 rounded-full animate-pulse" />
              ) : isPlaying ? (
                <Pause size={16} className="text-gray-800" />
              ) : (
                <Play size={16} className="text-gray-800 ml-0.5" />
              )}
            </div>
          </button>

          <button
            onClick={nextTrack}
            className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
              <SkipForward size={12} className="text-gray-800" />
            </div>
          </button>
        </div>

        {/* Blue Control Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={prevTrack}
            className="flex-1 bg-retro-blue hover:bg-blue-600 text-white font-press-start text-xs py-2 px-2 rounded transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <SkipBack size={12} />
          </button>
          <button
            onClick={togglePlay}
            className="flex-[2] bg-retro-blue hover:bg-blue-600 text-white font-press-start text-xs py-2 px-4 rounded transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "..." : isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={nextTrack}
            className="flex-1 bg-retro-blue hover:bg-blue-600 text-white font-press-start text-xs py-2 px-2 rounded transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <SkipForward size={12} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 mb-4">
          <button className="text-retro-green">{volume > 0 ? <Volume2 size={12} /> : <VolumeX size={12} />}</button>
        </div>

        {/* Playlist */}
        <div className="bg-gray-800 border-2 border-gray-600 rounded p-2 mb-4">
          <div className="text-retro-yellow font-press-start text-xs mb-2">PLAYLIST:</div>
          <div className="bg-white rounded p-2 h-24 overflow-y-auto">
            {playlist.map((track, index) => (
              <div
                key={index}
                onClick={() => playTrack(index)}
                className={`flex justify-between items-center text-xs cursor-pointer hover:bg-gray-100 p-1 rounded ${
                  index === currentTrack ? "bg-gray-200 font-bold" : ""
                }`}
              >
                <span className="text-black font-press-start text-xs">
                  {index + 1}. {track.title}
                </span>
                <span className="text-gray-600 font-press-start text-xs">{track.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => router.push("/?direct=true")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-press-start text-xs py-3 px-4 rounded transition-colors"
          >
            SELANJUTNYA
          </button>
          <button
            onClick={() => router.back()}
            className="w-full bg-retro-red hover:bg-red-600 text-white font-press-start text-xs py-3 px-4 rounded transition-colors"
          >
            KEMBALI
          </button>
        </div>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src={playlist[currentTrack].url} preload="metadata" crossOrigin="anonymous" />
      </div>
    </div>
  )
}
