"use client"

import { useState, useEffect, useCallback, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation" // Added useSearchParams

// Ini adalah komponen utama yang akan menampilkan game Tetris
export default function TetrisPage() {
  const router = useRouter()
  const searchParams = useSearchParams() // Inisialisasi useSearchParams
  const [musicStarted, setMusicStarted] = useState(false) // Untuk melacak apakah musik sudah dimulai
  const [isHover, setIsHover] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Auto-start music when component mounts

  // Logic Game Tetris
  type Board = number[][]
  type Piece = {
    shape: number[][]
    x: number
    y: number
    color: number
  }

  type PrefixedCSS = React.CSSProperties & {
  WebkitImageRendering?: React.CSSProperties['imageRendering'];
  MozImageRendering?: React.CSSProperties['imageRendering'];
};

  const BOARD_WIDTH = 10 // Diubah menjadi 10
  const BOARD_HEIGHT = 15 // Diubah menjadi 15

  const PIECES = [
    { shape: [[1, 1, 1, 1]], color: 1 }, // I
    {
      shape: [
        [1, 1],
        [1, 1],
      ],
      color: 2,
    }, // O
    {
      shape: [
        [0, 1, 0],
        [1, 1, 1],
      ],
      color: 3,
    }, // T
    {
      shape: [
        [0, 1, 1],
        [1, 1, 0],
      ],
      color: 4,
    }, // S
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
      ],
      color: 5,
    }, // Z
    {
      shape: [
        [1, 0, 0],
        [1, 1, 1],
      ],
      color: 6,
    }, // J
    {
      shape: [
        [0, 0, 1],
        [1, 1, 1],
      ],
      color: 7,
    }, // L
  ]

  const [board, setBoard] = useState<Board>(() =>
    Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(0)),
  )
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null)
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameRunning, setGameRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [showLossPopup, setShowLossPopup] = useState(false)

  const createNewPiece = useCallback((): Piece => {
    const piece = PIECES[Math.floor(Math.random() * PIECES.length)]
    return {
      shape: piece.shape,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2),
      y: 0,
      color: piece.color,
    }
  }, [])

  const isValidMove = useCallback(
    (piece: Piece, newX: number, newY: number, newShape?: number[][]): boolean => {
      const shape = newShape || piece.shape

      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardX = newX + x
            const boardY = newY + y

            if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
              return false
            }

            if (boardY >= 0 && board[boardY][boardX]) {
              return false
            }
          }
        }
      }
      return true
    },
    [board],
  )

  const rotatePiece = useCallback((piece: Piece): number[][] => {
    const rotated = piece.shape[0].map((_, index) => piece.shape.map((row) => row[index]).reverse())
    return rotated
  }, [])

  const placePiece = useCallback(
    (piece: Piece): Board => {
      const newBoard = board.map((row) => [...row])

      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const boardY = piece.y + y
            const boardX = piece.x + x
            if (boardY >= 0) {
              newBoard[boardY][boardX] = piece.color
            }
          }
        }
      }
      return newBoard
    },
    [board],
  )

  const clearLines = useCallback((board: Board): { newBoard: Board; linesCleared: number } => {
    const newBoard = board.filter((row) => row.some((cell) => cell === 0))
    const linesCleared = BOARD_HEIGHT - newBoard.length

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0))
    }

    return { newBoard, linesCleared }
  }, [])

  const movePiece = useCallback(
    (direction: "left" | "right" | "down") => {
      if (!currentPiece || !gameRunning) return

      let newX = currentPiece.x
      let newY = currentPiece.y

      switch (direction) {
        case "left":
          newX -= 1
          break
        case "right":
          newX += 1
          break
        case "down":
          newY += 1
          break
      }

      if (isValidMove(currentPiece, newX, newY)) {
        setCurrentPiece({ ...currentPiece, x: newX, y: newY })
      } else if (direction === "down") {
        const newBoard = placePiece(currentPiece)
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)

        setBoard(clearedBoard)
        setLines((prev) => prev + linesCleared)
        setScore((prev) => prev + linesCleared * 100 * level)

        const newPiece = createNewPiece()
        if (isValidMove(newPiece, newPiece.x, newPiece.y)) {
          setCurrentPiece(newPiece)
        } else {
          setGameOver(true)
          setShowLossPopup(true)
          setGameRunning(false)
        }
      }
    },
    [currentPiece, gameRunning, isValidMove, placePiece, clearLines, level, createNewPiece],
  )

  const rotatePieceHandler = useCallback(() => {
    if (!currentPiece || !gameRunning) return

    const rotatedShape = rotatePiece(currentPiece)
    if (isValidMove(currentPiece, currentPiece.x, currentPiece.y, rotatedShape)) {
      setCurrentPiece({ ...currentPiece, shape: rotatedShape })
    }
  }, [currentPiece, gameRunning, rotatePiece, isValidMove])

  const startGame = () => {
    setBoard(
      Array(BOARD_HEIGHT)
        .fill(null)
        .map(() => Array(BOARD_WIDTH).fill(0)),
    )
    setCurrentPiece(createNewPiece())
    setScore(0)
    setLines(0)
    setLevel(1)
    setGameRunning(true)
    setGameOver(false)
    setShowLossPopup(false)
  }

// Game loop
useEffect(() => {
  if (!gameRunning) return

  const interval = setInterval(
    () => {
      movePiece("down")
    },
    // Waktu dikurangi agar lebih cepat, dan progresi level disesuaikan
    Math.max(100, 800 - (level - 1) * 75),
  )

  return () => clearInterval(interval)
}, [gameRunning, level, movePiece])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning || showLossPopup) return

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          movePiece("left")
          break
        case "ArrowRight":
          e.preventDefault()
          movePiece("right")
          break
        case "ArrowDown":
          e.preventDefault()
          movePiece("down")
          break
        case "ArrowUp":
        case " ":
          e.preventDefault()
          rotatePieceHandler()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameRunning, movePiece, rotatePieceHandler, showLossPopup])

  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row])

    // Add current piece to display board
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y
            const boardX = currentPiece.x + x
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color
            }
          }
        }
      }
    }

    return displayBoard
  }

  const getCellColor = (value: number) => {
    const colors = [
      "rgb(17, 24, 39)", // empty (bg-gray-900)
      "rgb(34, 211, 238)", // I (bg-cyan-400)
      "rgb(250, 204, 21)", // O (bg-yellow-400)
      "rgb(192, 132, 252)", // T (bg-purple-400)
      "rgb(74, 222, 128)", // S (bg-green-400)
      "rgb(248, 113, 113)", // Z (bg-red-400)
      "rgb(96, 165, 250)", // J (bg-blue-400)
      "rgb(251, 146, 60)", // L (bg-orange-400)
    ]
    return colors[value] || "rgb(17, 24, 39)"
  }

  const baseStyles: React.CSSProperties = {
    fontFamily: '"Press Start 2P", monospace',
    lineHeight: '1.6',
    letterSpacing: '0.05em',
  };

  const gameboyBodyStyles: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 0L0 11V0H11ZM90 0L100 10V0H90ZM11 100L0 89V100H11ZM90 100L100 90V100H90ZM21 0L0 21V0H21ZM79 0L100 21V0H79ZM21 100L0 79V100H21ZM79 100L100 79V100H79ZM31 0L0 31V0H31ZM69 0L100 31V0H69ZM31 100L0 69V100H31ZM69 100L100 69V100H69ZM41 0L0 41V0H41ZM59 0L100 41V0H59ZM41 100L0 59V100H41ZM59 100L100 59V100H59ZM50 0L0 50L50 100L100 50L50 0Z\' fill=\'#c3dae4\' opacity=\'0.2\'/%3E%3C/svg%3E")',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  };

  const gameboyContainerStyles: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.9)',
    border: '4px solid #a7b7c7',
    borderRadius: '16px',
    padding: '25px',
    width: '100%',
    maxWidth: '450px', // Adjusted max-width to fit 10 cells horizontally better
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  };

  const screenHeaderStyles: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '20px',
  };

  const screenTitleStyles: React.CSSProperties = {
    color: '#4a5568',
    fontSize: '24px',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
    letterSpacing: '3px',
    ...baseStyles
  };

  const gameInfoStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    color: '#2d3748',
    fontSize: '12px',
    ...baseStyles
  };

  const scoreLevelLinesTextShadow: React.CSSProperties = {
    textShadow: '0 0 2px rgba(0, 0, 0, 0.1)',
  };

  const screenAreaStyles: React.CSSProperties = {
    background: '#e2e8f0',
    border: '2px solid #a7b7c7',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '20px',
    // Calculate minHeight based on 15 rows, assuming cell size for proportionality
    minHeight: `${BOARD_HEIGHT * 28 + 10}px`, // 28px per cell + padding
    position: 'relative',
    boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.1)',
    borderColor: '#9aacc0',
    borderWidth: '3px',
  };

const tetrisGridStyles: PrefixedCSS = {
  display:              'grid',
  gridTemplateColumns:  `repeat(${BOARD_WIDTH}, 1fr)`,
  gridTemplateRows:     `repeat(${BOARD_HEIGHT},1fr)`,
  gap:                  '1px',
  background:           '#cbd5e0',
  padding:              '5px',
  borderRadius:         '4px',
  width:                'calc(100% - 10px)',
  height:               `${BOARD_HEIGHT * 28}px`,
  maxWidth:             `${BOARD_WIDTH * 28}px`,
  margin:               '0 auto',

  // hanya satu imageRendering standar
  imageRendering:       'pixelated',

  // tambahkan vendor‑prefix
  WebkitImageRendering: 'pixelated',
  MozImageRendering:    'crisp-edges',
};


  const tetrisCellStyle: React.CSSProperties = {
    background: '#f0f4f8',
    border: '1px solid #d9e2ec',
    borderRadius: '1px',
    boxShadow: 'inset 0 0 1px rgba(0,0,0,0.05)',
  };

  const tetrisCellFilledStyle = (color: string): React.CSSProperties => ({
    background: color,
    boxShadow: `inset 0 0 5px rgba(0, 0, 0, 0.2), 0 0 8px ${color}`,
    transform: 'scale(1.05)',
    transition: 'transform 0.1s ease-out',
  });

  const errorMessageStyles: React.CSSProperties = {
    color: '#e53e3e',
    fontSize: '14px',
    marginTop: '10px',
    textShadow: '0 0 5px rgba(229, 62, 62, 0.3)',
    textAlign: 'center',
    ...baseStyles
  };

  const controlsContainerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '20px',
  };

  const controlBtnStyles: React.CSSProperties = {
    background: '#4299e1',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)',
  };

  const actionBtnStyles: React.CSSProperties = {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 'bold',
  };

  const btnGreenStyles: React.CSSProperties = {
    background: '#48bb78',
    color: 'white',
    boxShadow: '0 4px 0 #38a169, 0 6px 8px rgba(0, 0, 0, 0.3)',
  };

  const btnRedStyles: React.CSSProperties = {
    background: '#f56565',
    color: 'white',
    boxShadow: '0 4px 0 #e53e3e, 0 6px 8px rgba(0, 0, 0, 0.3)',
  };

  const windowsWatermarkStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    color: 'rgba(0, 0, 0, 0.1)',
    fontSize: '10px',
    textAlign: 'right',
    pointerEvents: 'none',
    zIndex: '1000',
  };

  const popupOverlayStyles: React.CSSProperties = {
    position: 'fixed', // Use fixed to cover the whole viewport
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)', // Slightly darker overlay
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const popupBoxStyles: React.CSSProperties = {
    background: '#1a1a1a', // Darker background for the popup box
    border: '3px solid #00ff41',
    borderRadius: '12px', // Slightly more rounded
    padding: '30px', // More padding
    textAlign: 'center',
    maxWidth: '350px', // Wider popup
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.7)', // More pronounced shadow
    animation: 'fadeIn 0.5s ease-out forwards', // Add fade-in animation
  };

  const popupMessageStyles: React.CSSProperties = {
    color: '#00ff41',
    fontSize: '16px', // Larger font
    textShadow: '0 0 8px rgba(0, 255, 65, 0.7)', // More glow
    marginBottom: '25px',
    lineHeight: '1.8', // Better line spacing
    ...baseStyles,
  };

  const hoverStyle: React.CSSProperties = {
  backgroundColor: '#0056b3',
  };

  const activeStyle: React.CSSProperties = {
    boxShadow: '0 2px 0 #0056b3',
    transform: 'translateY(2px)',
  };

  const finalStyle: React.CSSProperties = {
    ...baseStyles,
    ...(isHover   ? hoverStyle  : {}),
    ...(isActive  ? activeStyle : {}),
  };

  const popupButtonStyles: React.CSSProperties = {
    background: '#0080ff',
    color: 'white',
    border: 'none',
    padding: '12px 25px', // Larger button
    borderRadius: '8px', // More rounded button
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '14px', // Larger font for button
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.1s ease',
    boxShadow: '0 4px 0 #0056b3', // 3D effect

  };

  // Render komponen utama - langsung tampilkan game tanpa loading
  return (
    <Suspense fallback={<div>Loading...</div>}>
      
      {/* Tampilan game Tetris */}
      <div style={gameboyBodyStyles}>
        <div style={gameboyContainerStyles}>
          {/* Header */}
          <div style={screenHeaderStyles}>
            <h1 style={{ ...screenTitleStyles, animation: 'glow 2s ease-in-out infinite' }}>TETRIS</h1>
          </div>

          {/* Game Info */}
          <div style={gameInfoStyles}>
            <div style={scoreLevelLinesTextShadow}>SCORE: {score}</div>
            <div style={scoreLevelLinesTextShadow}>LEVEL: {level}</div>
          </div>
          <div style={{ ...gameInfoStyles, justifyContent: 'center' }}>LINES: {lines}</div>

          {/* Game Board */}
          <div style={screenAreaStyles}>
            <div style={tetrisGridStyles}>
              {renderBoard().map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    style={{
                      ...tetrisCellStyle,
                      ...(cell ? tetrisCellFilledStyle(getCellColor(cell)) : {}),
                    }}
                  />
                )),
              )}
            </div>
          </div>

          {/* Game Over Message (default) */}
          {gameOver && !showLossPopup && <div style={{ ...errorMessageStyles, animation: 'blink 1s infinite' }}>GAME OVER!</div>}

          {/* Controls */}
          <div style={controlsContainerStyles}>
            <button
              onClick={() => movePiece("left")}
              style={controlBtnStyles}
              disabled={!gameRunning || showLossPopup}
            >
              {"<"}
            </button>
            <button
              onClick={rotatePieceHandler}
              style={controlBtnStyles}
              disabled={!gameRunning || showLossPopup}
            >
              ROTATE
            </button>
            <button
              onClick={() => movePiece("right")}
              style={controlBtnStyles}
              disabled={!gameRunning || showLossPopup}
            >
              {">"}
            </button>
          </div>

          {/* Start Game Button */}
          <button
            onClick={startGame}
            style={{ ...actionBtnStyles, ...btnGreenStyles, marginBottom: '8px' }}
          >
            {gameRunning ? "RESTART" : "START GAME"}
          </button>

          {/* Back Button */}
          <button
            onClick={() => router.push("/?direct=true")}
            style={{ ...actionBtnStyles, ...btnRedStyles }}
          >
            KEMBALI
          </button>
        </div>

        {/* Loss Popup */}
        {showLossPopup && (
          <div style={popupOverlayStyles}>
            <div style={popupBoxStyles}>
              <div style={popupMessageStyles}>
                INGET YA! walaupun kamu kalah, tapi kamu selalu menang kok di ..... , HEHE :V
              </div>
              <button
                onClick={startGame}
                style={popupButtonStyles}
              >
                MAIN LAGI
              </button>
            </div>
          </div>
        )}

        {/* Windows activation watermark */}
        <div style={windowsWatermarkStyles}>
          <div>Activate Windows</div>
          <div>Go to Settings to activate Windows.</div>
        </div>
      </div>
    </Suspense>
  )
}