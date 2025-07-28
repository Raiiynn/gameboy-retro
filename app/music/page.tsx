"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"

export default function MusicPage() {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [audioError, setAudioError] = useState(false)

  // Playlist dengan thumbnail
  const playlist = [
    {
      title: "On Melancholy Hill",
      artist: "Gorillaz",
      duration: "3:53",
      url: "/music/OnMelancholyHill.mp3",
      thumbnail: "/thumbnail/OnMelancholyHill.jpg",
    },
    {
      title: "Endlessly",
      artist: "Bixby",
      duration: "2:05",
      url: "/music/endlessly.mp3",
      thumbnail: "/thumbnail/Endlessly.jpg",
    },
    {
      title: "Selalu Ada",
      artist: "Jumbo",
      duration: "2:56",
      url: "/music/SelaluAda.mp3",
      thumbnail: "/thumbnail/SelaluAda.jpg",
    },
    {
      title: "Pergi Makan",
      artist: "Sal Priadi",
      duration: "3:31",
      url: "/music/PergiMakan.mp3",
      thumbnail: "/thumbnail/PergiMakan.jpg",
    },
    {
      title: "Wonderwall",
      artist: "Oasis",
      duration: "4:18",
      url: "/music/Wonderwall.mp3",
      thumbnail: "/thumbnail/Wonderwall.jpg",
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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#9333ea",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#000000",
          border: "4px solid #fbbf24",
          borderRadius: "8px",
          padding: "16px",
          width: "100%",
          maxWidth: "384px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <h1 style={{ color: "#4ade80", fontFamily: "var(--font-press-start), monospace", fontSize: "14px" }}>
            Music Player
          </h1>
        </div>

        {/* Album Art */}
        <div
          style={{
            backgroundColor: "#374151",
            border: "2px solid #4b5563",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#4b5563",
              height: "96px",
              borderRadius: "4px",
              marginBottom: "12px",
              overflow: "hidden",
            }}
          >
            <img
              src={playlist[currentTrack].thumbnail || "/placeholder.svg"}
              alt={`${playlist[currentTrack].title} thumbnail`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: "#4ade80",
                fontFamily: "var(--font-press-start), monospace",
                fontSize: "10px",
                marginBottom: "4px",
              }}
            >
              {playlist[currentTrack].title}
            </div>
            <div
              style={{
                color: "#4ade80",
                fontFamily: "var(--font-press-start), monospace",
                fontSize: "10px",
                marginBottom: "4px",
              }}
            >
              {playlist[currentTrack].artist}
            </div>
            {audioError && (
              <div style={{ color: "#f87171", fontFamily: "var(--font-press-start), monospace", fontSize: "10px" }}>
                Failed to load audio
              </div>
            )}
          </div>
        </div>

        {/* Time Display */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ color: "#4ade80", fontFamily: "var(--font-press-start), monospace", fontSize: "10px" }}>
            {formatTime(currentTime)}
          </span>
          <span style={{ color: "#4ade80", fontFamily: "var(--font-press-start), monospace", fontSize: "10px" }}>
            {duration ? formatTime(duration) : playlist[currentTrack].duration}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: "12px" }}>
          <div
            style={{
              backgroundColor: "#374151",
              height: "8px",
              borderRadius: "4px",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={handleProgressClick}
          >
            <div
              style={{
                backgroundColor: "#9ca3af",
                height: "100%",
                borderRadius: "4px",
                transition: "width 0.1s ease",
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                width: "12px",
                height: "12px",
                backgroundColor: "#3b82f6",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                left: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Volume Display */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <Volume2 size={16} style={{ color: "#4ade80" }} />
          <div
            style={{
              flex: 1,
              marginLeft: "8px",
              marginRight: "8px",
              backgroundColor: "#374151",
              height: "8px",
              borderRadius: "4px",
            }}
          >
            <div style={{ backgroundColor: "#9ca3af", height: "100%", borderRadius: "4px", width: "70%" }} />
          </div>
          <span style={{ color: "#4ade80", fontFamily: "var(--font-press-start), monospace", fontSize: "10px" }}>
            70%
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
          <button
            onClick={prevTrack}
            disabled={isLoading}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              fontFamily: "var(--font-press-start), monospace",
              fontSize: "10px",
              padding: "8px 12px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            <SkipBack size={12} />
          </button>
          <button
            onClick={togglePlay}
            disabled={isLoading}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              fontFamily: "var(--font-press-start), monospace",
              fontSize: "10px",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            {isLoading ? "..." : isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={nextTrack}
            disabled={isLoading}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              fontFamily: "var(--font-press-start), monospace",
              fontSize: "10px",
              padding: "8px 12px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            <SkipForward size={12} />
          </button>
        </div>

        {/* Playlist */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              color: "#fbbf24",
              fontFamily: "var(--font-press-start), monospace",
              fontSize: "10px",
              marginBottom: "8px",
            }}
          >
            PLAYLIST:
          </div>
          <div
            style={{
              backgroundColor: "#000000",
              border: "1px solid #4b5563",
              borderRadius: "4px",
              padding: "8px",
              height: "128px",
              overflowY: "auto",
            }}
          >
            {playlist.map((track, index) => (
              <div
                key={index}
                onClick={() => playTrack(index)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "10px",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  marginBottom: "4px",
                  backgroundColor: index === currentTrack ? "#374151" : "transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
                  <img
                    src={track.thumbnail || "/placeholder.svg"}
                    alt={`${track.title} thumbnail`}
                    style={{ width: "24px", height: "24px", borderRadius: "2px", objectFit: "cover", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      color: "#4ade80",
                      fontFamily: "var(--font-press-start), monospace",
                      fontSize: "10px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {index + 1}. {track.title}
                  </span>
                </div>
                <span
                  style={{
                    color: "#4ade80",
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: "10px",
                    marginLeft: "8px",
                    flexShrink: 0,
                  }}
                >
                  {track.duration}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div style={{ color: "#4ade80", fontFamily: "var(--font-press-start), monospace", fontSize: "10px" }}>
            Click play button or song title
          </div>
          <div style={{ color: "#4ade80", fontFamily: "var(--font-press-start), monospace", fontSize: "10px" }}>
            to start music
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push("/?direct=true")}
          style={{
            width: "100%",
            backgroundColor: "#22c55e",
            color: "white",
            fontFamily: "var(--font-press-start), monospace",
            fontSize: "10px",
            padding: "12px 16px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          SELANJUTNYA
        </button>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src={playlist[currentTrack].url} preload="metadata" crossOrigin="anonymous" />
      </div>
    </div>
  )
}
