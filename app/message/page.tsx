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

  // Definisi Inline Styles untuk MessagePage
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // from-purple-600 via-purple-700 to-blue-800
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px', // p-4
      fontFamily: '"Press Start 2P", cursive', // Menggunakan font Game Boy
      margin: 0,
      boxSizing: 'border-box' as const,
      position: 'relative' as const, // For watermark absolute positioning
    },
    gameBoyFrame: {
      backgroundColor: '#000000', // bg-black
      border: '4px solid #facc15', // border-4 border-yellow-400
      borderRadius: '8px', // rounded-lg
      padding: '24px', // p-6
      width: '100%',
      maxWidth: '448px', // max-w-md (approx. 448px for Tailwind's md)
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
    },
    header: {
      textAlign: 'center' as const, // text-center
      marginBottom: '16px', // mb-4
    },
    headerTitle: {
      color: '#4ade80', // text-green-400
      fontFamily: '"Press Start 2P", cursive', // font-pixel
      fontSize: '20px', // text-xl
      fontWeight: 'bold' as const, // font-bold
    },
    messageContentBox: {
      backgroundColor: '#166534', // bg-green-900 (darker green)
      borderRadius: '4px', // rounded
      padding: '16px', // p-4
      height: '320px', // h-80 (80 * 4px = 320px)
      overflowY: 'auto' as const, // overflow-y-auto
      marginBottom: '16px', // mb-4
      border: '2px solid #001100', // border-2 border-green-600 (use a dark retro green)
      position: 'relative' as const, // relative for skip button
      // Custom scrollbar - will need a global style or pseudo-elements not directly inline
      // For basic scrolling to work, just overflow-y-auto is enough.
      // If full custom scrollbar is desired, it's typically done via CSS modules or global CSS.
    },
    messageText: {
      color: '#4ade80', // text-green-400
      fontFamily: '"Press Start 2P", cursive', // font-pixel
      fontSize: '14px', // text-sm
      lineHeight: '1.6', // leading-relaxed
      whiteSpace: 'pre-line' as const, // whitespace-pre-line
    },
    typingCursor: {
      animation: 'pulse 1s infinite', // animate-pulse
    },
    skipButton: {
      position: 'absolute' as const, // absolute
      top: '8px', // top-2
      right: '8px', // right-2
      backgroundColor: '#facc15', // bg-yellow-500
      color: '#000000', // text-black
      fontSize: '12px', // text-xs
      padding: '4px 8px', // px-2 py-1
      borderRadius: '4px', // rounded
      transition: 'background-color 0.2s ease', // transition-colors
      border: 'none',
      cursor: 'pointer',
      fontFamily: '"Press Start 2P", cursive',
      fontWeight: 'bold' as const,
      outline: 'none',
      // Hover and Active styles handled via onMouseDown/Up
    },
    navigationButtonsContainer: {
      display: 'flex',
      flexDirection: 'column' as const, // space-y-2
      gap: '8px', // gap-2
    },
    navButton: {
      width: '100%', // w-full
      fontWeight: 'bold' as const, // font-bold
      padding: '12px 16px', // py-3 px-4
      borderRadius: '4px', // rounded
      transition: 'background-color 0.2s ease', // transition-colors
      fontFamily: '"Press Start 2P", cursive', // font-pixel
      border: 'none',
      cursor: 'pointer',
      textTransform: 'uppercase' as const,
      outline: 'none',
      // Hover and Active styles handled via onMouseDown/Up
    },
    nextButton: {
      backgroundColor: '#22c55e', // bg-green-500
      color: 'white', // text-white
    },
    backButton: {
      backgroundColor: '#ef4444', // bg-red-500
      color: 'white', // text-white
    },
    windowsWatermark: {
      position: 'absolute' as const, // absolute
      bottom: '16px', // bottom-4
      right: '16px', // right-4
      color: 'rgba(255, 255, 255, 0.5)', // text-white/50
      fontSize: '12px', // text-xs
      textAlign: 'right' as const,
      fontFamily: 'monospace', // Often monospace for system messages
      pointerEvents: 'none' as const, // To allow clicks through
      zIndex: 1000,
    },
    windowsWatermarkLink: {
        textDecoration: 'underline',
        cursor: 'pointer',
        pointerEvents: 'auto' as const, // Make link clickable
    }
  };

  // Button interaction handlers untuk efek tekan
  const handleButtonMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    if (target.style.backgroundColor === styles.nextButton.backgroundColor) { // Green button
      target.style.backgroundColor = '#15803d'; // darker green for active
      target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
    } else if (target.style.backgroundColor === styles.backButton.backgroundColor) { // Red button
      target.style.backgroundColor = '#b91c1c'; // darker red for active
      target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
    } else if (target.style.backgroundColor === styles.skipButton.backgroundColor) { // Yellow button
        target.style.backgroundColor = '#d97706'; // darker yellow for active
        target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
    }
  };

  const handleButtonMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    if (target.style.backgroundColor === '#15803d') { // Reset green
      target.style.backgroundColor = styles.nextButton.backgroundColor;
      target.style.boxShadow = 'none';
    } else if (target.style.backgroundColor === '#b91c1c') { // Reset red
      target.style.backgroundColor = styles.backButton.backgroundColor;
      target.style.boxShadow = 'none';
    } else if (target.style.backgroundColor === '#d97706') { // Reset yellow
        target.style.backgroundColor = styles.skipButton.backgroundColor;
        target.style.boxShadow = 'none';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.gameBoyFrame}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Message</h1>
        </div>

        {/* Message Content */}
        <div style={styles.messageContentBox}>
          <div style={styles.messageText}>
            {displayedText}
            {isTyping && <span style={styles.typingCursor}>_</span>}
          </div>

          {/* Skip button */}
          {isTyping && (
            <button
              onClick={skipTyping}
              style={styles.skipButton}
              onMouseDown={handleButtonMouseDown}
              onMouseUp={handleButtonMouseUp}
              onMouseLeave={handleButtonMouseUp} // Reset style if mouse leaves while pressed
            >
              SKIP
            </button>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={styles.navigationButtonsContainer}>
          {!isTyping && currentMessage < messages.length - 1 && (
            <button
              onClick={nextMessage}
              style={{ ...styles.navButton, ...styles.nextButton }}
              onMouseDown={handleButtonMouseDown}
              onMouseUp={handleButtonMouseUp}
              onMouseLeave={handleButtonMouseUp}
            >
              SELANJUTNYA
            </button>
          )}
          <button
            onClick={goBack}
            style={{ ...styles.navButton, ...styles.backButton }}
            onMouseDown={handleButtonMouseDown}
            onMouseUp={handleButtonMouseUp}
            onMouseLeave={handleButtonMouseUp}
          >
            KEMBALI
          </button>
        </div>
      </div>

      {/* Windows activation watermark */}
      <div style={styles.windowsWatermark}>
        <div>Activate Windows</div>
        <div
            style={styles.windowsWatermarkLink}
            onClick={() => alert('Going to Settings to activate Windows... (This is a demo)')} // Add some action
        >
            Go to Settings to activate Windows.
        </div>
      </div>

      {/* CSS Animations (defined globally or in a <style jsx> block) */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}