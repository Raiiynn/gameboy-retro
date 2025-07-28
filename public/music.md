# Cara Menambahkan Musik Sendiri

## Opsi 1: File Lokal
1. Buat folder `public/music/` di project Anda
2. Tambahkan file MP3 Anda ke folder tersebut
3. Update URL di playlist menjadi: `/music/nama-file.mp3`

## Opsi 2: URL Online
Gunakan layanan seperti:
- SoundCloud (dengan API)
- YouTube (dengan API) 
- File hosting seperti Google Drive, Dropbox
- CDN musik

## Opsi 3: Sample Audio (Saat ini digunakan)
Menggunakan SoundHelix untuk demo - musik instrumental gratis

## Format yang Didukung
- MP3 (recommended)
- WAV
- OGG
- M4A

## Contoh Update Playlist:
\`\`\`javascript
const playlist = [
  {
    title: "Lagu Favorit",
    artist: "Artis Favorit", 
    duration: "3:45",
    url: "/music/lagu-favorit.mp3" // File lokal
  }
]
