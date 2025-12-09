"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronUp, ChevronDown, Share2, GitCompare, Trash2 } from "lucide-react"
import type { ShortlistItem } from "@/lib/ring-data"
import { Analytics } from "@/lib/analytics"

interface ShortlistTrayProps {
  items: ShortlistItem[]
  onRemove: (ringId: string) => void
  onSelectRing: (ringId: string) => void
  onClear?: () => void
  onShare?: () => void
  onCompare?: () => void
}

export function ShortlistTray({ items, onRemove, onSelectRing, onClear, onShare, onCompare }: ShortlistTrayProps) {
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    if (expanded && items.length > 0) {
      Analytics.shortlistViewed(items.length)
    }
  }, [expanded, items.length])

  const handleShare = async () => {
    const shareLink = `${window.location.origin}/ring-room?shortlist=${items.map((i) => i.ring.id).join(",")}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Ring Shortlist",
          text: `Check out my shortlist of ${items.length} beautiful rings!`,
          url: shareLink,
        })
        Analytics.shortlistShared(items.length, "native")
      } catch (e) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareLink)
      Analytics.shortlistShared(items.length, "clipboard")
      alert("Shortlist link copied to clipboard!")
    }

    onShare?.()
  }

  if (items.length === 0) {
    return (
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-dashed border-muted-foreground/30 p-4 text-center">
          <p className="text-muted-foreground text-sm">Drag rings down or tap the heart to add to your shortlist</p>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10">
      <div className="bg-background/95 backdrop-blur-sm rounded-lg border border-emerald-200 shadow-xl overflow-hidden">
        {/* Header */}
        <button
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <span className="font-semibold">Your Shortlist</span>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              {items.length} / 10
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">
              ${items.reduce((sum, i) => sum + i.ring.price, 0).toLocaleString()}
            </span>
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="px-4 pb-4 space-y-3">
            {/* Ring thumbnails - horizontal scroll */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {items.map((item) => (
                <div
                  key={item.ring.id}
                  className="relative flex-shrink-0 group cursor-pointer"
                  onClick={() => onSelectRing(item.ring.id)}
                >
                  {/* Color indicator as thumbnail */}
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-transparent group-hover:border-emerald-500 transition-colors"
                    style={{
                      background: `linear-gradient(135deg, ${item.ring.colors.metal} 50%, ${item.ring.colors.stone} 50%)`,
                    }}
                  />
                  {/* Remove button */}
                  <button
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove(item.ring.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {/* Ring name */}
                  <p className="text-xs text-center mt-1 truncate max-w-16">{item.ring.name}</p>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={onCompare}
                disabled={items.length < 2}
              >
                <GitCompare className="h-4 w-4 mr-2" />
                Compare
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={onClear}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
