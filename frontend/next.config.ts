
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins:["192.168.1.104"],

  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

export default nextConfig