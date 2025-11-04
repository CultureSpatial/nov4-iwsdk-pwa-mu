/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'xr-spatial-tracking=*, camera=*, microphone=*, accelerometer=*, gyroscope=*, magnetometer=*',
          },
        ],
      },
    ]
  },
}

export default nextConfig
