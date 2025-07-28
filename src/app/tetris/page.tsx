"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

type Board = number[][]
type Piece = {
  shape: number[][]
  x: number
  y: number
  color: number
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

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

export default function TetrisPage() {
  const router = useRouter()
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
        // Piece can't move down, place it
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
  }

  // Game loop
  useEffect(() => {
    if (!gameRunning) return

    const interval = setInterval(
      () => {
        movePiece("down")
      },
      Math.max(100, 1000 - (level - 1) * 100),
    )

    return () => clearInterval(interval)
  }, [gameRunning, level, movePiece])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return

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
  }, [gameRunning, movePiece, rotatePieceHandler])

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
      "bg-gray-900", // empty
      "bg-cyan-400", // I
      "bg-yellow-400", // O
      "bg-purple-400", // T
      "bg-green-400", // S
      "bg-red-400", // Z
      "bg-blue-400", // J
      "bg-orange-400", // L
    ]
    return colors[value] || "bg-gray-900"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-black border-4 border-yellow-400 rounded-lg p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-green-400 font-pixel text-xl font-bold">Tetris</h1>
        </div>

        {/* Game Info */}
        <div className="flex justify-between text-yellow-400 font-pixel text-sm mb-4">
          <div>Score: {score}</div>
          <div>Level: {level}</div>
        </div>
        <div className="text-yellow-400 font-pixel text-sm text-center mb-4">Lines: {lines}</div>

        {/* Game Board */}
        <div className="bg-gray-800 p-2 rounded mb-4 flex justify-center">
          <div className="grid grid-cols-10 gap-px bg-gray-700 p-1 rounded">
            {renderBoard().map((row, y) =>
              row.map((cell, x) => (
                <div key={`${y}-${x}`} className={`w-4 h-4 ${getCellColor(cell)} border border-gray-600`} />
              )),
            )}
          </div>
        </div>

        {/* Game Over Message */}
        {gameOver && <div className="text-red-400 font-pixel text-center mb-4">GAME OVER!</div>}

        {/* Controls */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => movePiece("left")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-pixel px-3 py-2 rounded transition-colors"
            disabled={!gameRunning}
          >
            {"<"}
          </button>
          <button
            onClick={rotatePieceHandler}
            className="bg-blue-500 hover:bg-blue-600 text-white font-pixel px-3 py-2 rounded transition-colors"
            disabled={!gameRunning}
          >
            ROTATE
          </button>
          <button
            onClick={() => movePiece("right")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-pixel px-3 py-2 rounded transition-colors"
            disabled={!gameRunning}
          >
            {">"}
          </button>
        </div>

        {/* Start Game Button */}
        <button
          onClick={startGame}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition-colors font-pixel mb-2"
        >
          {gameRunning ? "RESTART" : "START GAME"}
        </button>

        {/* Back Button */}
        <button
          onClick={() => router.push("/?direct=true")}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded transition-colors font-pixel"
        >
          KEMBALI
        </button>
      </div>

      {/* Windows activation watermark */}
      <div className="absolute bottom-4 right-4 text-white/50 text-xs">
        <div>Activate Windows</div>
        <div>Go to Settings to activate Windows.</div>
      </div>
    </div>
  )
}
