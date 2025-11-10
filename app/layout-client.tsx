"use client"

import type React from "react"

import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { initializeAmplitude } from "@/lib/analytics"
import { useEffect } from "react"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export default function LayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  useEffect(() => {
    initializeAmplitude()
  }, [])

  return (
    <>
      {children}
      <Analytics />
    </>
  )
}
