"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MessagePage() {
  const router = useRouter()
  const [currentMessage, setCurrentMessage] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [typingIndex, setTypingIndex] = useState(0)

  const messages = [
    {
      title: "Hai Ila,",
      content: `Semangat Ujian nya!

Besok itu kesempatanmu buat membuktikan seberapa jauh perjuangan dan kerja keras yang udah kamu lakukan. 

Percayalah bahwa setiap lembar catatan yang kamu baca, setiap malam begadang (sambil main palo) dan setiap latihan soal yang kamu kerjakan pasti membuahkan hasil yang sangat memuaskan.`,
    },
    {
      title: "Lanjutan...",
      content: `Malam ini, tidur yang cukup supaya pikiranmu segar n siap menghadapi tantangan. Bayangin aja kebanggaan dan kelegaan yang bakal kamu rasain ketika menyelesaikan seluruh soal dengan baik. 
      
      Semangat, Ilaa!!

Regards,
Dapa`,
    },
  ]

  const currentFullText = messages[currentMessage].title + "\n\n" + messages[currentMessage].content

  useEffect(() => {
    setDisplayedText("")
    setTypingIndex(0)
    setIsTyping(true)
  }, [currentMessage])

  useEffect(() => {
    if (isTyping && typingIndex < currentFullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentFullText.slice(0, typingIndex + 1))
        setTypingIndex(typingIndex + 1)
      }, 30) // Typing speed

      return () => clearTimeout(timer)
    } else if (typingIndex >= currentFullText.length) {
      setIsTyping(false)
    }
  }, [typingIndex, isTyping, currentFullText])

  const skipTyping = () => {
    setDisplayedText(currentFullText)
    setIsTyping(false)
    setTypingIndex(currentFullText.length)
  }

  const nextMessage = () => {
    if (currentMessage < messages.length - 1) {
      setCurrentMessage(currentMessage + 1)
    }
  }

  const goBack = () => {
    router.push("/?direct=true")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-black border-4 border-yellow-400 rounded-lg p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-green-400 font-pixel text-xl font-bold">Message</h1>
        </div>

        {/* Message Content */}
        <div className="bg-green-900 rounded p-4 h-80 overflow-y-auto mb-4 border-2 border-green-600 relative">
          <div className="text-green-400 font-pixel text-sm leading-relaxed whitespace-pre-line">
            {displayedText}
            {isTyping && <span className="animate-pulse">_</span>}
          </div>

          {/* Skip button */}
          {isTyping && (
            <button
              onClick={skipTyping}
              className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 text-black text-xs px-2 py-1 rounded transition-colors"
            >
              SKIP
            </button>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-2">
          {!isTyping && currentMessage < messages.length - 1 && (
            <button
              onClick={nextMessage}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition-colors font-pixel"
            >
              SELANJUTNYA
            </button>
          )}
          <button
            onClick={goBack}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded transition-colors font-pixel"
          >
            KEMBALI
          </button>
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
