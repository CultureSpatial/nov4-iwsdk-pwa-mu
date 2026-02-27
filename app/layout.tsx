import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import LayoutClient from "./layout-client"

export const metadata: Metadata = {
  title: "Production Documents | Meta Ray-Ban Verchandising Shoot",
  description: "Professional tabbed interface for production call sheet and schedule documentation",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
