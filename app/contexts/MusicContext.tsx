"use client";

import { createContext, useContext, useState, useRef, ReactNode, useCallback } from "react";

// Tentukan tipe untuk nilai context
interface MusicContextType {
  isMusicPlaying: boolean;
  playMusic: () => void;
  stopMusic: () => void;
}

// Buat context dengan nilai default
const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Buat Provider Component
export function MusicProvider({ children }: { children: ReactNode }) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  // Gunakan useRef untuk menyimpan instance Audio agar tidak dibuat ulang pada setiap render
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inisialisasi audio hanya sekali saat dibutuhkan
  const initializeAudio = useCallback(() => {
    if (!audioRef.current) {
      // Pastikan path ini benar. File harus ada di /public/music/OnMelancholyHill.mp3
      audioRef.current = new Audio("/music/OnMelancholyHill.mp3");
      audioRef.current.loop = true; // Agar musik berulang

      // Menangani akhir lagu jika tidak di-loop
      audioRef.current.onended = () => {
        setIsMusicPlaying(false);
      };
    }
  }, []);

  const playMusic = useCallback(() => {
    initializeAudio(); // Pastikan audio sudah diinisialisasi

    // `.play()` mengembalikan Promise, tangani dengan benar
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play()
        .then(() => {
          console.log("🎵 Musik berhasil diputar.");
          setIsMusicPlaying(true);
        })
        .catch(error => {
          // Ini akan menampilkan error jika browser memblokir pemutaran
          console.error("❌ Gagal memutar musik:", error);
        });
    }
  }, [initializeAudio]);

  const stopMusic = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
      console.log("⏸️ Musik dihentikan.");
    }
  }, []);

  const value = { isMusicPlaying, playMusic, stopMusic };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

// Buat custom hook untuk kemudahan penggunaan
export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic harus digunakan di dalam MusicProvider");
  }
  return context;
}