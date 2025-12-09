'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Heart, Share2, Ruler } from 'lucide-react'
import type { RingData } from '@/lib/ring-data'

interface RingDetailPanelProps {
  ring: RingData
  onClose: () => void
  onAddToShortlist: () => void
  isInShortlist: boolean
}

export function RingDetailPanel({ ring, onClose, onAddToShortlist, isInShortlist }: RingDetailPanelProps) {
  return (
    <Card className="absolute right-4 top-4 w-80 bg-background/95 backdrop-blur-sm border-emerald-200 shadow-xl z-10">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{ring.name}</CardTitle>
            <p className="text-sm text-muted-foreground">SKU: {ring.sku}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price */}
        <div className="text-2xl font-bold text-emerald-600">
          ${ring.price.toLocaleString()}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground">{ring.description}</p>

        {/* Stone Details */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Center Stone</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Type:</span>{' '}
              <span className="capitalize">{ring.centerStone.type}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Carat:</span>{' '}
              {ring.centerStone.carat}ct
            </div>
            <div>
              <span className="text-muted-foreground">Cut:</span>{' '}
              {ring.centerStone.cut}
            </div>
            <div>
              <span className="text-muted-foreground">Clarity:</span>{' '}
              {ring.centerStone.clarity}
            </div>
          </div>
        </div>

        {/* Metal */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Metal:</span>
          <Badge variant="secondary" className="capitalize">
            {ring.metal.replace('-', ' ')}
          </Badge>
        </div>

        {/* Available Sizes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Available Sizes:</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {ring.ringSize.map((size) => (
              <Badge key={size} variant="outline" className="text-xs">
                {size}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            className={isInShortlist 
              ? "flex-1 bg-emerald-600 hover:bg-emerald-700" 
              : "flex-1"
            }
            onClick={onAddToShortlist}
          >
            <Heart className={`h-4 w-4 mr-2 ${isInShortlist ? 'fill-current' : ''}`} />
            {isInShortlist ? 'In Shortlist' : 'Add to Shortlist'}
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
