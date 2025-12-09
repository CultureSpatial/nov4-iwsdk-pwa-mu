// Ring Room MVP - Ring Data Schema and Sample Data

export interface RingData {
  id: string
  sku: string
  name: string
  description: string
  price: number
  metal: "platinum" | "gold" | "rose-gold" | "white-gold"
  centerStone: {
    type: "diamond" | "emerald" | "sapphire" | "ruby"
    carat: number
    cut: string
    clarity: string
    color: string
  }
  bandWidth: number // mm
  ringSize: number[]
  modelPath: string
  thumbnailPath: string
  colors: {
    metal: string
    stone: string
    accent: string
  }
}

// Sample ring data for MVP demo
export const RING_CATALOG: RingData[] = [
  {
    id: "ring-001",
    sku: "EG-PT-RND-150",
    name: "Classic Solitaire",
    description: "Timeless platinum solitaire with round brilliant diamond",
    price: 8500,
    metal: "platinum",
    centerStone: {
      type: "diamond",
      carat: 1.5,
      cut: "Round Brilliant",
      clarity: "VS1",
      color: "F",
    },
    bandWidth: 2.5,
    ringSize: [5, 6, 7, 8, 9],
    modelPath: "/assets/3d/duck.glb", // Placeholder - will use procedural geometry
    thumbnailPath: "/platinum-solitaire-diamond-engagement-ring.jpg",
    colors: {
      metal: "#E5E4E2",
      stone: "#B9F2FF",
      accent: "#FFFFFF",
    },
  },
  {
    id: "ring-002",
    sku: "EG-RG-OVL-120",
    name: "Rose Elegance",
    description: "Rose gold halo setting with oval emerald center",
    price: 12000,
    metal: "rose-gold",
    centerStone: {
      type: "emerald",
      carat: 1.2,
      cut: "Oval",
      clarity: "AAA",
      color: "Vivid Green",
    },
    bandWidth: 2.0,
    ringSize: [5, 6, 7, 8],
    modelPath: "/assets/3d/duck.glb",
    thumbnailPath: "/rose-gold-oval-emerald-halo-engagement-ring.jpg",
    colors: {
      metal: "#B76E79",
      stone: "#50C878",
      accent: "#FFD700",
    },
  },
  {
    id: "ring-003",
    sku: "EG-YG-PRN-200",
    name: "Royal Crown",
    description: "Yellow gold three-stone with princess cut sapphire",
    price: 15000,
    metal: "gold",
    centerStone: {
      type: "sapphire",
      carat: 2.0,
      cut: "Princess",
      clarity: "Eye Clean",
      color: "Royal Blue",
    },
    bandWidth: 3.0,
    ringSize: [5, 6, 7, 8, 9, 10],
    modelPath: "/assets/3d/duck.glb",
    thumbnailPath: "/yellow-gold-princess-sapphire-three-stone-engageme.jpg",
    colors: {
      metal: "#FFD700",
      stone: "#0F52BA",
      accent: "#C0C0C0",
    },
  },
]

// Shortlist state management
export interface ShortlistItem {
  ring: RingData
  addedAt: number
  notes?: string
}

export function createShortlistManager() {
  let items: ShortlistItem[] = []
  const listeners = new Set<() => void>()

  return {
    add(ring: RingData) {
      if (!items.find((item) => item.ring.id === ring.id)) {
        items = [...items, { ring, addedAt: Date.now() }]
        listeners.forEach((fn) => fn())
      }
    },
    remove(ringId: string) {
      items = items.filter((item) => item.ring.id !== ringId)
      listeners.forEach((fn) => fn())
    },
    getItems() {
      return items
    },
    subscribe(fn: () => void) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    clear() {
      items = []
      listeners.forEach((fn) => fn())
    },
  }
}
