"use client"

import type { RingData } from "@/lib/ring-data"
import { Analytics } from "@/lib/analytics"

const STORAGE_KEY = "ring-shortlist"
const MAX_ITEMS = 10

export interface ShortlistItem {
  ring: RingData
  addedAt: number
  notes?: string
}

class ShortlistManager {
  private items: ShortlistItem[] = []
  private listeners = new Set<() => void>()

  constructor() {
    this.load()
  }

  add(ring: RingData, method: "button" | "drag" = "button"): boolean {
    if (this.items.length >= MAX_ITEMS) {
      console.log("[v0] Shortlist full - max 10 items")
      return false
    }

    if (this.has(ring.id)) {
      console.log("[v0] Ring already in shortlist:", ring.id)
      return false
    }

    this.items = [...this.items, { ring, addedAt: Date.now() }]
    this.save()
    this.notify()

    Analytics.ringShortlisted(ring.id, ring.name, method)

    return true
  }

  remove(ringId: string): void {
    const item = this.items.find((i) => i.ring.id === ringId)
    if (item) {
      this.items = this.items.filter((i) => i.ring.id !== ringId)
      this.save()
      this.notify()

      Analytics.ringRemovedFromShortlist(ringId, item.ring.name)
    }
  }

  toggle(ringId: string, ring: RingData, method: "button" | "drag" = "button"): boolean {
    if (this.has(ringId)) {
      this.remove(ringId)
      return false
    } else {
      return this.add(ring, method)
    }
  }

  has(ringId: string): boolean {
    return this.items.some((item) => item.ring.id === ringId)
  }

  getAll(): ShortlistItem[] {
    return this.items
  }

  getCount(): number {
    return this.items.length
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.ring.price, 0)
  }

  clear(): void {
    const count = this.items.length
    this.items = []
    this.save()
    this.notify()

    Analytics.shortlistCleared(count)
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn())
  }

  private save(): void {
    try {
      const data = this.items.map((item) => ({
        ringId: item.ring.id,
        addedAt: item.addedAt,
        notes: item.notes,
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error("[v0] Failed to save shortlist:", e)
    }
  }

  private load(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored) as Array<{ ringId: string; addedAt: number; notes?: string }>
        // Note: We'll need to resolve ringIds to full RingData objects
        // This will be done when the ring catalog is available
        console.log(
          "[v0] Loaded shortlist IDs:",
          data.map((d) => d.ringId),
        )
      }
    } catch (e) {
      console.error("[v0] Failed to load shortlist:", e)
    }
  }

  hydrate(catalog: RingData[]): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored) as Array<{ ringId: string; addedAt: number; notes?: string }>
        this.items = data
          .map((d) => {
            const ring = catalog.find((r) => r.id === d.ringId)
            if (ring) {
              return { ring, addedAt: d.addedAt, notes: d.notes }
            }
            return null
          })
          .filter((item): item is ShortlistItem => item !== null)
        this.notify()
      }
    } catch (e) {
      console.error("[v0] Failed to hydrate shortlist:", e)
    }
  }

  generateShareLink(): string {
    const ids = this.items.map((item) => item.ring.id).join(",")
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    return `${baseUrl}/ring-room?shortlist=${encodeURIComponent(ids)}`
  }
}

// Singleton instance
export const shortlistManager = new ShortlistManager()
