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
  webpack: (config) => {
    // Ensure only one instance of Three.js is used
    config.resolve.alias = {
      ...config.resolve.alias,
      three: require.resolve('three'),
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'xr-spatial-tracking=*, camera=*, microphone=*, accelerometer=*, gyroscope=*, magnetometer=*, web-share=*, fullscreen=*, display-capture=*',
          },
          {
            key: 'Feature-Policy',
            value: "xr-spatial-tracking 'self' *; camera 'self' *; microphone 'self' *; accelerometer 'self' *; gyroscope 'self' *; magnetometer 'self' *",
          },
        ],
      },
    ]
  },
}

export default nextConfig
