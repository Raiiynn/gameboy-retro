"use client";

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMusic } from "./contexts/MusicContext";

function GameBoyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Gunakan hook dari context untuk mengontrol musik
  const { isMusicPlaying, playMusic, stopMusic } = useMusic();

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  // HAPUS: const [musicStarted, setMusicStarted] = useState(false)
  // HAPUS: const audioRef = useRef<HTMLAudioElement>(null)
  
  const showGameBoy = !isLoading;
  // HAPUS: const backgroundMusic = "/music/OnMelancholyHill.mp3"
  const skipBooting = searchParams.get("direct") === "true";

  useEffect(() => {
    console.log("🚀 Component mounted, skipBooting:", skipBooting)

    if (skipBooting) {
      console.log("⚡ Skipping boot sequence")
      setIsLoading(false)
      return
    }

    console.log("📱 Starting boot sequence")
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2
        console.log("📊 Progress:", newProgress + "%")

        if (newProgress >= 100) {
          clearInterval(interval)
          console.log("✅ Boot complete!")
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [skipBooting])

const handleNavigation = (path: string) => {
  console.log("🧭 Navigasi ke:", path);

  // Cek tujuan path
  if (path === "/music") {
    // Jika tujuannya adalah halaman musik, hentikan lagu latar
    stopMusic(); 
  } else {
    // Jika ke halaman lain, putar lagu jika belum berjalan
    if (!isMusicPlaying) {
      playMusic();
    }
  }

  // Lanjutkan navigasi
  router.push(path);
};

  // 🎨 Complete Inline Styles Objects
  const styles = {
    // Container Styles
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: '"Press Start 2P", cursive', // Applied font
      margin: 0,
      boxSizing: 'border-box' as const
    },

    // GameBoy Body Styles
    gameBoyBody: {
      background: 'linear-gradient(145deg, #e8e8e8 0%, #d0d0d0 50%, #b8b8b8 100%)',
      borderRadius: '24px',
      padding: '24px',
      width: '100%',
      maxWidth: '384px',
      boxShadow: '0 16px 32px rgba(0, 0, 0, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.5), inset 0 -2px 0 rgba(0, 0, 0, 0.1)',
      position: 'relative' as const
    },

    // Top Row Styles
    topRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      paddingLeft: '16px',
      paddingRight: '16px'
    },

    indicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },

    powerDot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#ef4444',
      borderRadius: '50%',
      boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
      animation: 'pulse 2s infinite'
    },

    indicatorText: {
      fontFamily: '"Press Start 2P", cursive', // Applied font
      fontSize: '10px',
      color: '#374151',
      fontWeight: 'bold' as const,
      textTransform: 'uppercase' as const
    },

    brandText: {
      fontFamily: '"Press Start 2P", cursive', // Applied font
      fontSize: '10px',
      color: '#374151',
      textAlign: 'center' as const,
      fontWeight: 'bold' as const,
      letterSpacing: '1px'
    },

    // Screen Styles
    screen: {
      background: 'linear-gradient(135deg, #9bbc0f 0%, #8bac0f 50%, #306230 100%)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      border: '4px solid #1e1e1e',
      boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.1)',
      position: 'relative' as const,
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      overflow: 'hidden'
    },

    screenOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)',
      pointerEvents: 'none' as const,
      borderRadius: '8px'
    },

    screenContent: {
      textAlign: 'center' as const,
      position: 'relative' as const,
      zIndex: 2
    },

    title: {
      fontFamily: '"Press Start 2P", cursive', // Applied font
      fontSize: '20px',
      color: '#001100',
      marginBottom: '8px',
      textShadow: '2px 2px 0px rgba(0,0,0,0.3)',
      fontWeight: 'bold' as const,
      letterSpacing: '2px'
    },

    subtitle: {
      fontFamily: '"Press Start 2P", cursive', // Applied font
      fontSize: '20px',
      color: '#001100',
      marginBottom: '16px',
      textShadow: '2px 2px 0px rgba(0,0,0,0.3)',
      fontWeight: 'bold' as const,
      letterSpacing: '2px'
    },

    pressStart: {
      fontFamily: '"Press Start 2P", cursive', // Applied font
      fontSize: '12px',
      color: '#003300',
      textShadow: '1px 1px 0px rgba(0,0,0,0.2)',
      animation: 'blink 1.5s infinite',
      fontWeight: 'bold' as const
    },

    // Menu Buttons Styles
    menuGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      marginBottom: '24px'
    },

    menuButton: {
      color: 'white',
      border: 'none',
      padding: '12px 16px',
      borderRadius: '8px',
      fontFamily: '"Press Start 2P", cursive', // Applied font
      fontSize: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      transform: 'none',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      fontWeight: 'bold' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
      outline: 'none',
      position: 'relative' as const
    },

    messageButton: {
      backgroundColor: '#3b82f6',
      backgroundImage: 'linear-gradient(145deg, #3b82f6, #2563eb)'
    },

    calmButton: {
      backgroundColor: '#ef4444',
      backgroundImage: 'linear-gradient(145deg, #ef4444, #dc2626)'
    },

    musicButton: {
      backgroundColor: '#a855f7',
      backgroundImage: 'linear-gradient(145deg, #a855f7, #9333ea)'
    },

    tetrisButton: {
      backgroundColor: '#22c55e',
      backgroundImage: 'linear-gradient(145deg, #22c55e, #16a34a)'
    },

    // Controls Styles
    controlsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      padding: '0 8px'
    },

    dpad: {
      position: 'relative' as const,
      width: '64px',
      height: '64px'
    },

    dpadHorizontal: {
      position: 'absolute' as const,
      top: '50%',
      left: '0',
      right: '0',
      height: '20px',
      backgroundColor: '#374151',
      transform: 'translateY(-50%)',
      borderRadius: '2px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    },

    dpadVertical: {
      position: 'absolute' as const,
      left: '50%',
      top: '0',
      bottom: '0',
      width: '20px',
      backgroundColor: '#374151',
      transform: 'translateX(-50%)',
      borderRadius: '2px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    },

    dpadCenter: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      width: '12px',
      height: '12px',
      backgroundColor: '#4b5563',
      transform: 'translate(-50%, -50%)',
      borderRadius: '1px',
      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)'
    },

    actionButtons: {
      display: 'flex',
      gap: '16px'
    },

    actionButton: {
      width: '40px',
      height: '40px',
      backgroundColor: '#ef4444',
      backgroundImage: 'linear-gradient(145deg, #ef4444, #dc2626)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: '"Press Start 2P", cursive', // Applied font
      fontSize: '12px',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      border: 'none',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      transition: 'all 0.1s ease',
      outline: 'none'
    },

    // Select/Start Buttons Styles
    selectStartRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginBottom: '16px'
    },

    selectStartButton: {
      backgroundColor: '#4b5563',
      backgroundImage: 'linear-gradient(145deg, #4b5563, #374151)',
      color: 'white',
      fontFamily: '"Press Start 2P", cursive', // Applied font
      fontSize: '10px',
      padding: '4px 12px',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      transition: 'all 0.1s ease',
      fontWeight: 'bold' as const,
      textTransform: 'uppercase' as const,
      outline: 'none'
    },

    // Speaker Styles
    speakerGrille: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '4px',
      padding: '16px',
      backgroundColor: '#6b7280',
      backgroundImage: 'linear-gradient(145deg, #6b7280, #4b5563)',
      borderRadius: '8px',
      marginLeft: '16px',
      marginRight: '16px',
      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
    },

    speakerDot: {
      width: '4px',
      height: '4px',
      backgroundColor: '#374151',
      borderRadius: '50%',
      boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.3)'
    },

    // Loading Screen Styles (already using inline styles)
    loadingContainer: {
      minHeight: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: '"Press Start 2P", cursive', // Applied font
      margin: 0,
      boxSizing: 'border-box' as const
    },

    loadingBox: {
      border: '2px solid #22c55e',
      backgroundColor: '#000000',
      padding: '32px',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '448px',
      boxShadow: '0 0 20px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(34, 197, 94, 0.1)'
    },

    loadingTitle: {
      fontFamily: '"Press Start 2P", cursive', // Applied font
      color: '#22c55e',
      fontSize: '18px',
      marginBottom: '16px',
      textAlign: 'center' as const,
      fontWeight: 'bold' as const,
      letterSpacing: '2px',
      textShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
    },

    loadingText: {
      fontFamily: '"Press Start 2P", cursive', // Applied font
      color: '#22c55e',
      fontSize: '12px',
      marginBottom: '8px',
      fontWeight: 'bold' as const
    },

    progressBar: {
      backgroundColor: '#374151',
      borderRadius: '9999px',
      height: '16px',
      marginBottom: '8px',
      overflow: 'hidden',
      border: '1px solid #22c55e'
    },

    progressFill: {
      backgroundColor: '#3b82f6',
      backgroundImage: 'linear-gradient(90deg, #3b82f6, #22c55e)',
      height: '100%',
      borderRadius: '9999px',
      transition: 'width 0.1s ease',
      boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
    },

    progressText: {
      fontFamily: '"Press Start 2P", cursive', // Applied font
      fontSize: '12px',
      color: '#9ca3af',
      fontWeight: 'bold' as const
    },

    smileText: {
      fontFamily: '"Press Start 2P", cursive', // Applied font
      color: '#facc15',
      fontSize: '14px',
      textAlign: 'center' as const,
      fontWeight: 'bold' as const,
      letterSpacing: '1px',
      textShadow: '0 0 10px rgba(250, 204, 21, 0.5)',
      animation: 'glow 2s ease-in-out infinite alternate'
    }
  }

  // Button interaction handlers (already using inline styles)
  const handleButtonMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement
    target.style.transform = 'scale(0.95)'
    target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
  }

  const handleButtonMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement
    target.style.transform = 'scale(1)'
    target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
  }

  const handleActionButtonPress = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    target.style.transform = 'scale(0.9)'
    target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    setTimeout(() => {
      target.style.transform = 'scale(1)'
      target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
    }, 100)
  }

  if (isLoading) {
    console.log("🔄 Rendering loading screen, progress:", progress + "%")

    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingBox}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={styles.loadingTitle}>MOOD BOOSTER</h1>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={styles.loadingText}>{"> BOOTING SYSTEM..."}</div>

            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`
                }}
              />
            </div>

            <div style={styles.progressText}>{progress}%</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={styles.smileText}>SMILE!</div>
          </div>
        </div>

        {/* CSS Animations for loading */}
        <style jsx>{`
          @keyframes glow {
            from { text-shadow: 0 0 10px rgba(250, 204, 21, 0.5); }
            to { text-shadow: 0 0 20px rgba(250, 204, 21, 0.8), 0 0 30px rgba(250, 204, 21, 0.6); }
          }
        `}</style>
      </div>
    )
  }

  console.log("🎮 Rendering Game Boy interface")

  return (
    <div style={styles.container}>
      {/* Game Boy Body */}
      <div style={styles.gameBoyBody}>

        {/* Power and Battery Indicators */}
        <div style={styles.topRow}>
          <div style={styles.indicator}>
            <div style={styles.powerDot}></div>
            <span style={styles.indicatorText}>POWER</span>
          </div>
          <div style={styles.brandText}>BUAT "Seseorang"</div>
          <div style={styles.indicator}>
            <div style={styles.powerDot}></div>
            <span style={styles.indicatorText}>BATTERY</span>
          </div>
        </div>

        {/* Game Boy Screen */}
        <div style={styles.screen}>
          {/* Scanline effect */}
          <div style={styles.screenOverlay}></div>

          <div style={styles.screenContent}>
            <h1 style={styles.title}>Semangat</h1>
            <h1 style={styles.subtitle}>Ujian!</h1>
            <p style={styles.pressStart}>Press Start Button</p>
          </div>
        </div>

        {/* Menu Buttons */}
        <div style={styles.menuGrid}>
          <button
            style={{ ...styles.menuButton, ...styles.messageButton }}
            onClick={() => handleNavigation("/message")}
            onMouseDown={handleButtonMouseDown}
            onMouseUp={handleButtonMouseUp}
            onMouseLeave={handleButtonMouseUp}
          >
            MESSAGE
          </button>
          <button
            style={{ ...styles.menuButton, ...styles.calmButton }}
            onClick={() => handleNavigation("/calm")}
            onMouseDown={handleButtonMouseDown}
            onMouseUp={handleButtonMouseUp}
            onMouseLeave={handleButtonMouseUp}
          >
            CALM
          </button>
          <button
            style={{ ...styles.menuButton, ...styles.musicButton }}
            onClick={() => handleNavigation("/music")}
            onMouseDown={handleButtonMouseDown}
            onMouseUp={handleButtonMouseUp}
            onMouseLeave={handleButtonMouseUp}
          >
            MUSIC
          </button>
          <button
            style={{ ...styles.menuButton, ...styles.tetrisButton }}
            onClick={() => handleNavigation("/tetris")}
            onMouseDown={handleButtonMouseDown}
            onMouseUp={handleButtonMouseUp}
            onMouseLeave={handleButtonMouseUp}
          >
            TETRIS
          </button>
        </div>

        {/* Controls */}
        <div style={styles.controlsRow}>
          {/* D-Pad */}
          <div style={styles.dpad}>
            <div style={styles.dpadHorizontal}></div>
            <div style={styles.dpadVertical}></div>
            <div style={styles.dpadCenter}></div>
          </div>

          {/* A and B Buttons */}
          <div style={styles.actionButtons}>
            <div
              style={styles.actionButton}
              onClick={() => console.log("🅱️ B button pressed")}
              onMouseDown={handleActionButtonPress}
            >
              B
            </div>
            <div
              style={styles.actionButton}
              onClick={() => console.log("🅰️ A button pressed")}
              onMouseDown={handleActionButtonPress}
            >
              A
            </div>
          </div>
        </div>

        {/* Select and Start Buttons */}
        <div style={styles.selectStartRow}>
          <button
            style={styles.selectStartButton}
            onClick={() => console.log("📝 SELECT pressed")}
            onMouseDown={handleButtonMouseDown}
            onMouseUp={handleButtonMouseUp}
            onMouseLeave={handleButtonMouseUp}
          >
            SELECT
          </button>
          <button
            style={styles.selectStartButton}
            onClick={() => handleNavigation("/message")} 
            onMouseDown={handleButtonMouseDown}
            onMouseUp={handleButtonMouseUp}
            onMouseLeave={handleButtonMouseUp}
          >
            START
          </button>
        </div>

        {/* Speaker Grille */}
        <div style={styles.speakerGrille}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={styles.speakerDot}></div>
          ))}
        </div>

        {/* BACK button added to the main Game Boy interface */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <button
            style={{ ...styles.selectStartButton, width: '100px' }} // Reusing selectStartButton style
            onClick={() => router.back()} // Navigates back
            onMouseDown={handleButtonMouseDown}
            onMouseUp={handleButtonMouseUp}
            onMouseLeave={handleButtonMouseUp}
          >
            BACK
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes glow {
          from { text-shadow: 0 0 10px rgba(250, 204, 21, 0.5); }
          to { text-shadow: 0 0 20px rgba(250, 204, 21, 0.8), 0 0 30px rgba(250, 204, 21, 0.6); }
        }
      `}</style>
    </div>
  )
}

function LoadingFallback() {
  console.log("⏳ Loading fallback rendered")

  const fallbackStyles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: '"Press Start 2P", cursive', // Applied font
      margin: 0,
      boxSizing: 'border-box' as const
    },
    box: {
      border: '2px solid #22c55e',
      backgroundColor: '#000000',
      padding: '32px',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '448px',
      boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
    },
    title: {
      fontFamily: '"Press Start 2P", cursive', // Applied font
      color: '#22c55e',
      fontSize: '18px',
      marginBottom: '16px',
      textAlign: 'center' as const,
      fontWeight: 'bold' as const,
      letterSpacing: '2px',
      textShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
    },
    loadingText: {
      fontFamily: '"Press Start 2P", cursive', // Applied font
      color: '#22c55e',
      fontSize: '12px',
      marginBottom: '8px',
      fontWeight: 'bold' as const
    },
    progressBar: {
      backgroundColor: '#374151',
      borderRadius: '9999px',
      height: '16px',
      marginBottom: '8px',
      border: '1px solid #22c55e'
    },
    progressFill: {
      backgroundColor: '#3b82f6',
      backgroundImage: 'linear-gradient(90deg, #3b82f6, #22c55e)',
      height: '100%',
      borderRadius: '9999px',
      width: '50%',
      boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
    },
    smileText: {
      fontFamily: '"Press Start 2P", cursive', // Applied font
      color: '#facc15',
      fontSize: '14px',
      textAlign: 'center' as const,
      fontWeight: 'bold' as const,
      letterSpacing: '1px',
      textShadow: '0 0 10px rgba(250, 204, 21, 0.5)'
    }
  }

  return (
    <div style={fallbackStyles.container}>
      <div style={fallbackStyles.box}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={fallbackStyles.title}>MOOD BOOSTER</h1>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <div style={fallbackStyles.loadingText}>{"> LOADING..."}</div>
          <div style={fallbackStyles.progressBar}>
            <div style={fallbackStyles.progressFill} />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={fallbackStyles.smileText}>SMILE!</div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  console.log("🏠 HomePage component rendered")

  return (
    <Suspense fallback={<LoadingFallback />}>
      <GameBoyContent />
    </Suspense>
  )
}