"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { trackEvent } from "@/lib/analytics"

interface PhotoCaptureProps {
  mode: "xr" | "2d"
}

const frames = [
  { id: "emerald", name: "Emerald City", color: "border-emerald-500" },
  { id: "wicked", name: "Wicked Witch", color: "border-green-600" },
  { id: "glinda", name: "Good Witch", color: "border-pink-500" },
  { id: "oz", name: "Wizard of Oz", color: "border-amber-500" },
]

export function PhotoCapture({ mode }: PhotoCaptureProps) {
  const [selectedFrame, setSelectedFrame] = useState(frames[0])
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      trackEvent("camera_started", { mode })
    } catch (error) {
      console.error("Camera access denied:", error)
      trackEvent("camera_error", { error: String(error) })
    }
  }, [mode])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0)

    // Add frame overlay
    ctx.strokeStyle = selectedFrame.color.replace("border-", "")
    ctx.lineWidth = 20
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

    const photoData = canvas.toDataURL("image/png")
    setCapturedPhoto(photoData)

    trackEvent("photo_captured", {
      frame: selectedFrame.id,
      mode,
    })
  }, [selectedFrame, mode])

  const sharePhoto = useCallback(async () => {
    if (!capturedPhoto) return

    try {
      const blob = await (await fetch(capturedPhoto)).blob()
      const file = new File([blob], "wicked-photo.png", { type: "image/png" })

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: "My Wicked Photo",
          text: "Check out my photo from the Emerald City!",
        })
        trackEvent("share_clicked", { method: "native", feature: "photo_booth" })
      }
    } catch (error) {
      console.error("Share failed:", error)
    }
  }, [capturedPhoto])

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null)
    startCamera()
  }, [startCamera])

  if (capturedPhoto) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 p-4 flex items-center justify-center">
        <Card className="max-w-2xl w-full p-6 bg-emerald-950/50 border-emerald-700">
          <h2 className="text-2xl font-bold text-emerald-100 mb-4 text-center">Your Wicked Photo</h2>
          <img src={capturedPhoto || "/placeholder.svg"} alt="Captured" className="w-full rounded-lg mb-6" />
          <div className="flex gap-4">
            <Button
              onClick={retakePhoto}
              variant="outline"
              className="flex-1 border-emerald-600 text-emerald-100 hover:bg-emerald-800 bg-transparent"
            >
              Retake
            </Button>
            <Button onClick={sharePhoto} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
              Share
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!stream) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full p-6 bg-emerald-950/50 border-emerald-700">
          <h2 className="text-2xl font-bold text-emerald-100 mb-4 text-center">Camera Access Required</h2>
          <p className="text-emerald-200 mb-6 text-center">Allow camera access to capture your magical moment</p>
          <Button onClick={startCamera} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            Enable Camera
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="relative mb-6">
          <video ref={videoRef} autoPlay playsInline className={`w-full rounded-lg border-8 ${selectedFrame.color}`} />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-emerald-100 mb-3 text-center">Choose Your Frame</h3>
          <div className="grid grid-cols-4 gap-4">
            {frames.map((frame) => (
              <button
                key={frame.id}
                onClick={() => setSelectedFrame(frame)}
                className={`p-4 rounded-lg border-4 ${frame.color} ${
                  selectedFrame.id === frame.id ? "bg-emerald-800/50" : "bg-emerald-950/30"
                } text-emerald-100 text-sm font-medium hover:bg-emerald-800/30 transition-colors`}
              >
                {frame.name}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={capturePhoto} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" size="lg">
          Capture Photo
        </Button>
      </div>
    </div>
  )
}
