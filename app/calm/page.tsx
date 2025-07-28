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

  // Definisi Inline Styles untuk CalmPage
  const styles = {
    // Umum untuk semua mode
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Default background, bisa di-override
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: 'var(--font-press-start), monospace', // Menggunakan font dari globals.css
      margin: 0,
      boxSizing: 'border-box' as const,
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    gameBoyBody: {
      background: 'linear-gradient(145deg, #e8e8e8 0%, #d0d0d0 50%, #b8b8b8 100%)', // bg-gray-200 rounded-3xl p-6 shadow-2xl
      borderRadius: '24px',
      padding: '24px',
      width: '100%',
      maxWidth: '384px', // max-w-sm (14rem = 224px, sm is 24rem = 384px)
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
      position: 'relative' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center', // Added for centering content in the body
      justifyContent: 'center' // Added for centering content in the body
    },
    headerButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px', // gap-2
      color: '#4b5563', // text-gray-600
      transition: 'color 0.2s ease-in-out', // transition-colors
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-press-start), monospace',
      fontSize: '12px', // text-xs
      fontWeight: 'bold' as const,
      padding: '0',
      outline: 'none'
    },
    headerText: {
      fontSize: '12px', // text-xs
      fontWeight: 'bold' as const,
      color: '#4b5563', // text-gray-600
    },
    indicatorDot: {
      width: '12px', // w-3
      height: '12px', // h-3
      backgroundColor: '#10b981', // bg-teal-500
      borderRadius: '50%', // rounded-full
      animation: 'pulse 1.5s infinite', // animate-pulse (assuming pulse is in globals.css)
    },
    // Screen styles
    screen: {
      background: 'linear-gradient(135deg, #9bbc0f 0%, #8bac0f 50%, #306230 100%)', // Default retro green
      borderRadius: '12px', // rounded-lg
      padding: '16px', // p-4
      marginBottom: '24px', // mb-6
      border: '4px solid #1e1e1e', // border-4 border-gray-800
      boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.1)',
      position: 'relative' as const,
      minHeight: '160px', // h-32 (128px) adjusted slightly
      width: 'calc(100% - 8px)', // Adjusted width for padding of parent and border. Original was `w-full`
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    screenOverlay: { // For scanline effect
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)',
      pointerEvents: 'none' as const,
      borderRadius: '8px'
    },
    screenTitle: {
      color: '#2b6cb0', // text-teal-400 (or other specific color)
      fontFamily: 'var(--font-press-start), monospace', // font-pixel
      fontSize: '24px', // text-lg
      fontWeight: 'bold' as const,
      marginBottom: '8px', // mb-2
    },
    screenSubtitle: {
      color: '#2b6cb0', // text-cyan-400 (or other specific color)
      fontFamily: 'var(--font-press-start), monospace', // font-pixel
      fontSize: '16px', // text-sm
      marginBottom: '8px', // mb-2
    },
    screenText: {
      color: '#2b6cb0', // text-teal-300 (or other specific color)
      fontFamily: 'var(--font-press-start), monospace', // font-pixel
      fontSize: '12px', // text-xs
      textAlign: 'center' as const,
    },
    // Button styles
    buttonBase: {
      fontFamily: 'var(--font-press-start), monospace', // font-pixel
      fontWeight: 'bold' as const,
      padding: '12px 16px', // py-3 px-4
      borderRadius: '4px', // rounded
      transition: 'all 0.1s ease', // transition-colors
      border: 'none',
      cursor: 'pointer',
      textTransform: 'uppercase' as const,
      outline: 'none',
      width: '100%', // w-full
      display: 'flex', // For centering content with icons
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)', // Basic shadow
    },
    cyanButton: { // For GUIDED BREATHING
      backgroundColor: '#06b6d4', // bg-cyan-500
      color: 'white',
      backgroundImage: 'linear-gradient(145deg, #06b6d4, #0891b2)',
    },
    tealButton: { // For CALMING ANIMATIONS
      backgroundColor: '#14b8a6', // bg-teal-500
      color: 'white',
      backgroundImage: 'linear-gradient(145deg, #14b8a6, #0d9488)',
    },
    blueButton: { // For STRESS MANAGEMENT / MENU
      backgroundColor: '#3b82f6', // bg-blue-500
      color: 'white',
      backgroundImage: 'linear-gradient(145deg, #3b82f6, #2563eb)',
    },
    grayButton: { // For HOME button
      backgroundColor: '#4b5563', // bg-gray-600
      color: 'white',
      padding: '8px 12px', // px-3 py-1
      fontSize: '12px', // text-xs
      backgroundImage: 'linear-gradient(145deg, #4b5563, #374151)',
      width: 'auto', // Override w-full
    },
    greenButton: { // For PLAY/START
      backgroundColor: '#22c55e', // bg-green-500
      color: 'white',
      backgroundImage: 'linear-gradient(145deg, #22c55e, #16a34a)',
    },
    redButton: { // For STOP/PAUSE
      backgroundColor: '#ef4444', // bg-red-500
      color: 'white',
      backgroundImage: 'linear-gradient(145deg, #ef4444, #dc2626)',
    },
    speakerDot: {
      width: '4px', // w-1
      height: '4px', // h-1
      backgroundColor: '#2dd4bf', // bg-teal-400
      borderRadius: '50%', // rounded-full
      animation: 'pulse 1.5s infinite', // animate-pulse (assuming pulse is in globals.css)
    },
    // Specific styles for Breathing mode
    breathingCircle: {
      width: '80px', // w-20
      height: '80px', // h-20
      borderRadius: '50%', // rounded-full
      background: 'linear-gradient(to right, var(--color-from), var(--color-to))', // bg-gradient-to-r
      transition: 'all 1s ease', // transition-all duration-1000
      opacity: '0.8', // opacity-80
      transform: 'scale(1)', // Default scale
    },
    // Specific styles for Animation mode
    floatingParticle: {
      position: 'absolute' as const,
      width: '8px', // w-2
      height: '8px', // h-2
      backgroundColor: 'white',
      borderRadius: '50%', // rounded-full
      opacity: '0.3', // opacity-30
      animation: 'bounce 3s infinite', // animate-bounce
    },
    rippleEffect: {
      position: 'absolute' as const,
      width: '80px', // w-20
      height: '80px', // h-20
      border: '2px solid rgba(255, 255, 255, 0.3)', // border-2 border-white/30
      borderRadius: '50%', // rounded-full
      animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite', // animate-ping
    },
    // Stress Management specific styles
    stressTipsBox: {
      background: '#042f2e', // bg-green-900 (darker custom green)
      borderRadius: '8px', // rounded-lg
      padding: '16px', // p-4
      marginBottom: '24px', // mb-6
      minHeight: '160px', // h-40 (160px)
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      border: '4px solid #1e1e1e', // border-4 border-gray-800
    },
    stressTipsTitle: {
      color: '#4ade80', // text-green-400
      fontFamily: 'var(--font-press-start), monospace', // font-pixel
      fontSize: '14px', // text-sm
      fontWeight: 'bold' as const,
      marginBottom: '8px', // mb-2
      textAlign: 'center' as const,
    },
    stressTipsContent: {
      color: '#6ee7b7', // text-green-300
      fontFamily: 'var(--font-press-start), monospace', // font-pixel
      fontSize: '12px', // text-xs
      textAlign: 'center' as const,
      lineHeight: '1.6', // leading-relaxed
    },
    // Watermark styles, copied from MessagePage for consistency
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
  }

  // Button interaction handlers (for hover/active states)
  const handleButtonMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement
    target.style.transform = 'scale(0.98)' // Slight scale down
    target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)' // Reduced shadow
  }

  const handleButtonMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement
    target.style.transform = 'scale(1)' // Reset scale
    target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)' // Reset shadow
    // For specific buttons, you might reset background image if needed, but for now this is generic
  }


  if (currentMode === "menu") {
    return (
      <div style={{ ...styles.container, background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #1d4ed8 100%)' }}>
        {/* Calming background animation */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)', // from-teal-500/10 via-cyan-500/10 to-blue-500/10
              animation: 'pulse 3s infinite alternate' // Longer pulse
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: '0.2',
              background: `
                radial-gradient(circle at 30% 40%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(0, 150, 255, 0.1) 0%, transparent 50%)
              `,
            }}
          />
        </div>

        {/* Game Boy Device */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '16px', position: 'relative', zIndex: 10 }}>
          <div style={styles.gameBoyBody}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', width: '100%' }}>
              <button
                onClick={() => router.push("/")}
                style={styles.headerButton}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                <ArrowLeft size={16} />
                <span style={{ fontSize: '12px' }}>BACK</span>
              </button>
              <div style={styles.headerText}>CALM MODE</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ ...styles.indicatorDot, backgroundColor: '#10b981' }}></div> {/* bg-teal-500 */}
                <span style={styles.headerText}>RELAX</span>
              </div>
            </div>

            {/* Screen */}
            <div style={{ ...styles.screen, background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 50%, #0ea5e9 100%)' }}> {/* bg-teal-900 rounded-lg p-4 mb-6 h-32 flex flex-col justify-center items-center border-4 border-gray-800 */}
              <div style={styles.screenOverlay}></div>
              <div style={{ ...styles.screenTitle, color: '#2dd4bf' }}>CALM</div> {/* text-teal-400 */}
              <div style={{ ...styles.screenSubtitle, color: '#22d3ee' }}>Relaxation & Breathing</div> {/* text-cyan-400 */}
              <div style={{ ...styles.screenText, color: '#6ee7b7' }}>Choose your path to peace</div> {/* text-teal-300 */}
            </div>

            {/* CALM Menu Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '24px', width: '100%' }}> {/* grid grid-cols-1 gap-2 mb-6 */}
              <button
                onClick={() => setCurrentMode("breathing")}
                style={{ ...styles.buttonBase, ...styles.cyanButton }}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                GUIDED BREATHING
              </button>
              <button
                onClick={() => setCurrentMode("animation")}
                style={{ ...styles.buttonBase, ...styles.tealButton }}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                CALMING ANIMATIONS
              </button>
              <button
                onClick={() => setCurrentMode("stress")}
                style={{ ...styles.buttonBase, ...styles.blueButton }}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                STRESS MANAGEMENT
              </button>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}> {/* flex justify-center gap-4 mt-4 */}
              <button
                onClick={() => router.push("/?direct=true")}
                style={styles.grayButton}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                HOME
              </button>
            </div>

            {/* Speaker with calming indicator */}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}> {/* mt-4 flex justify-center */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}> {/* grid grid-cols-6 gap-1 */}
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ ...styles.speakerDot, animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>
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
      </div>
    )
  }

  if (currentMode === "breathing") {
    // Dynamically update background colors based on breathing phase
    let breathingBgFrom = '';
    let breathingBgTo = '';
    switch (breathingPhase) {
      case "inhale":
        breathingBgFrom = '#60a5fa'; // blue-400
        breathingBgTo = '#22d3ee'; // cyan-400
        break;
      case "hold":
        breathingBgFrom = '#c084fc'; // purple-400
        breathingBgTo = '#f472b6'; // pink-400
        break;
      case "exhale":
        breathingBgFrom = '#4ade80'; // green-400
        breathingBgTo = '#2dd4bf'; // teal-400
        break;
    }

    return (
      <div style={{ ...styles.container, background: 'linear-gradient(135deg, #1e3a8a 0%, #4c1d95 50%, #0f766e 100%)' }}>
        {/* Breathing background */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${breathingBgFrom} 0%, ${breathingBgTo} 100%)`,
              opacity: '0.2',
              transition: 'all 1s ease', // transition-all duration-1000
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '16px', position: 'relative', zIndex: 10 }}>
          <div style={styles.gameBoyBody}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', width: '100%' }}>
              <button
                onClick={() => setCurrentMode("menu")}
                style={styles.headerButton}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                <ArrowLeft size={16} />
                <span style={{ fontSize: '12px' }}>BACK</span>
              </button>
              <div style={styles.headerText}>BREATHING</div>
              <div style={styles.headerText}>CYCLES: {breathingCount}</div>
            </div>

            {/* Breathing Screen */}
            <div style={{ ...styles.screen, background: '#1f2937', overflow: 'hidden' }}> {/* bg-gray-900 rounded-lg p-4 mb-6 h-40 flex flex-col justify-center items-center border-4 border-gray-800 relative overflow-hidden */}
              <div style={styles.screenOverlay}></div>
              {/* Breathing Circle */}
              <div
                style={{
                  ...styles.breathingCircle,
                  background: `linear-gradient(to right, ${breathingBgFrom}, ${breathingBgTo})`,
                  transform: breathingPhase === "inhale" || breathingPhase === "hold" ? 'scale(1.5)' : 'scale(0.75)',
                }}
              />

              <div style={{ ...styles.screenText, color: 'white', marginTop: '16px' }}>{getBreathingInstruction()}</div> {/* text-white font-pixel text-sm mt-4 text-center */}

              {breathingActive && (
                <div style={{ ...styles.screenText, color: '#9ca3af', marginTop: '8px' }}> {/* text-gray-400 font-pixel text-xs mt-2 */}
                  {breathingPhase === "inhale" ? "4s" : breathingPhase === "hold" ? "4s" : "6s"}
                </div>
              )}
            </div>

            {/* Breathing Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px', width: '100%' }}> {/* grid grid-cols-3 gap-2 mb-4 */}
              <button
                onClick={breathingActive ? stopBreathing : startBreathing}
                style={{ ...styles.buttonBase, ...(breathingActive ? styles.redButton : styles.greenButton), padding: '8px 16px', fontSize: '12px', boxShadow: 'none' }}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                {breathingActive ? <Pause size={16} /> : <Play size={16} />}
                {breathingActive ? "STOP" : "START"}
              </button>
              <button
                onClick={resetBreathing}
                style={{ ...styles.buttonBase, ...styles.grayButton, padding: '8px 16px', fontSize: '12px', boxShadow: 'none' }}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                <RotateCcw size={16} />
                RESET
              </button>
              <button
                onClick={() => setCurrentMode("menu")}
                style={{ ...styles.buttonBase, ...styles.blueButton, padding: '8px 16px', fontSize: '12px', boxShadow: 'none' }}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                MENU
              </button>
            </div>

            {/* Instructions */}
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#4b5563', marginBottom: '16px' }}> {/* text-center text-xs text-gray-600 mb-4 */}
              <p>Follow the circle: Inhale (4s) → Hold (4s) → Exhale (6s)</p>
            </div>
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
      </div>
    )
  }

  if (currentMode === "animation") {
    return (
      <div style={{ ...styles.container, background: 'linear-gradient(135deg, #4c1d95 0%, #be185d 50%, #1e3a8a 100%)' }}>
        {/* Floating particles animation */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.floatingParticle,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                animationPlayState: animationActive ? 'running' : 'paused', // Control animation state
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '16px', position: 'relative', zIndex: 10 }}>
          <div style={styles.gameBoyBody}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', width: '100%' }}>
              <button
                onClick={() => setCurrentMode("menu")}
                style={styles.headerButton}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                <ArrowLeft size={16} />
                <span style={{ fontSize: '12px' }}>BACK</span>
              </button>
              <div style={styles.headerText}>ANIMATIONS</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ ...styles.indicatorDot, backgroundColor: '#ec4899' }}></div> {/* bg-pink-500 */}
                <span style={styles.headerText}>PEACE</span>
              </div>
            </div>

            {/* Animation Screen */}
            <div style={{ ...styles.screen, background: 'linear-gradient(135deg, #4c1d95 0%, #be185d 100%)', overflow: 'hidden' }}> {/* bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg p-4 mb-6 h-40 flex flex-col justify-center items-center border-4 border-gray-800 relative overflow-hidden */}
              <div style={styles.screenOverlay}></div>
              {/* Ripple effect */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.rippleEffect,
                      animationDelay: `${i * 0.5}s`,
                      animationPlayState: animationActive ? 'running' : 'paused', // Control animation state
                    }}
                  />
                ))}
              </div>

              <div style={{ ...styles.screenText, color: 'white', zIndex: 10 }}>Calming Ripples</div> {/* text-white font-pixel text-sm text-center z-10 */}
              <div style={{ ...styles.screenText, color: '#d8b4fe', marginTop: '8px', zIndex: 10 }}>Watch and breathe deeply</div> {/* text-purple-300 font-pixel text-xs mt-2 text-center z-10 */}
            </div>

            {/* Animation Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px', width: '100%' }}> {/* grid grid-cols-2 gap-2 mb-4 */}
              <button
                onClick={() => setAnimationActive(!animationActive)}
                style={{ ...styles.buttonBase, ...(animationActive ? styles.redButton : styles.greenButton), padding: '8px 16px', fontSize: '12px', boxShadow: 'none' }}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                {animationActive ? "PAUSE" : "PLAY"}
              </button>
              <button
                onClick={() => setCurrentMode("menu")}
                style={{ ...styles.buttonBase, ...styles.blueButton, padding: '8px 16px', fontSize: '12px', boxShadow: 'none' }}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                MENU
              </button>
            </div>
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
      </div>
    )
  }

  if (currentMode === "stress") {
    return (
      <div style={{ ...styles.container, background: 'linear-gradient(135deg, #042f2e 0%, #0d9488 50%, #1e3a8a 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '16px', position: 'relative', zIndex: 10 }}>
          <div style={styles.gameBoyBody}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', width: '100%' }}>
              <button
                onClick={() => router.push("/")}
                style={styles.headerButton}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                <ArrowLeft size={16} />
                <span style={{ fontSize: '12px' }}>BACK</span>
              </button>
              <div style={styles.headerText}>STRESS MGMT</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ ...styles.indicatorDot, backgroundColor: '#22c55e' }}></div> {/* bg-green-500 */}
                <span style={styles.headerText}>CALM</span>
              </div>
            </div>

            {/* Stress Management Screen */}
            <div style={styles.stressTipsBox}>
              <div style={styles.screenOverlay}></div>
              <div style={styles.stressTipsTitle}>Stress Relief Tips</div>
              <div style={styles.stressTipsContent}>
                • Take deep breaths
                <br />• Count to 10
                <br />• Focus on present
                <br />• Relax your muscles
                <br />• Think positive thoughts
              </div>
            </div>

            {/* Stress Management Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '16px', width: '100%' }}> {/* grid grid-cols-1 gap-2 mb-4 */}
              <button
                onClick={() => setCurrentMode("breathing")}
                style={{ ...styles.buttonBase, ...styles.greenButton }}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                QUICK BREATHING
              </button>
              <button
                onClick={() => router.push("/?direct=true")}
                style={{ ...styles.buttonBase, ...styles.blueButton }}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseUp}
              >
                BACK TO MENU
              </button>
            </div>
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
      </div>
    )
  }

  return null
}