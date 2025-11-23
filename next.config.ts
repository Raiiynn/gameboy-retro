/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["placeholder.svg", "hebbkx1anhila5yf.public.blob.vercel-storage.com"],
    unoptimized: true,
  },
  // Tambahan untuk memastikan CSS ter-build dengan benar
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
}

export default nextConfig
