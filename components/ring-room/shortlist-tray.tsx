'use client'

import { useSyncExternalStore } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { ShortlistItem } from '@/lib/ring-data'

interface ShortlistTrayProps {
  items: ShortlistItem[]
  onRemove: (ringId: string) => void
  onSelectRing: (ringId: string) => void
}

export function ShortlistTray({ items, onRemove, onSelectRing }: ShortlistTrayProps) {
  const [expanded, setExpanded] = useState(true)

  if (items.length === 0) {
    return null
  }

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10">
      <div className="bg-background/95 backdrop-blur-sm rounded-lg border border-emerald-200 shadow-xl overflow-hidden">
        {/* Header */}
        <button
          className="w-full flex items-center justify-between px-4 py-2 hover:bg-muted/50 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold">Your Shortlist</span>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              {items.length} {items.length === 1 ? 'ring' : 'rings'}
            </Badge>
          </div>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="px-4 pb-4 space-y-2">
            {items.map((item) => (
              <div
                key={item.ring.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onSelectRing(item.ring.id)}
              >
                <div className="flex items-center gap-3">
                  {/* Color indicator */}
                  <div
                    className="w-8 h-8 rounded-full border-2"
                    style={{
                      background: `linear-gradient(135deg, ${item.ring.colors.metal} 50%, ${item.ring.colors.stone} 50%)`
                    }}
                  />
                  <div>
                    <p className="font-medium text-sm">{item.ring.name}</p>
                    <p className="text-xs text-muted-foreground">{item.ring.sku}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-emerald-600">
                    ${item.ring.price.toLocaleString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove(item.ring.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Shortlist Total:</span>
              <span className="font-bold text-emerald-600">
                ${items.reduce((sum, item) => sum + item.ring.price, 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
