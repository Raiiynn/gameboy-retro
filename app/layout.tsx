import type React from "react"
import type { Metadata } from "next"
import { Press_Start_2P } from "next/font/google"
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Retro Music Player",
  description: "A retro-style music player",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} antialiased`}>{children}</body>
    </html>
  )
}
