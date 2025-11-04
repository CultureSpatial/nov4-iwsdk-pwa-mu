"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ARFallback } from "@/components/ar/ar-fallback"
import { GestureControls } from "@/components/ar/gesture-controls"
import { trackEvent } from "@/lib/analytics"

const cocktails = [
  {
    id: "elphaba-elixir",
    name: "Elphaba's Elixir",
    description: "A bewitching green cocktail with lime, mint, and magic",
    color: "#10b981",
    ingredients: ["Gin", "Lime", "Mint", "Green Chartreuse"],
    model: "/assets/3d/cocktail-green.glb",
  },
  {
    id: "glinda-sparkle",
    name: "Glinda's Sparkle",
    description: "A shimmering pink champagne cocktail fit for a good witch",
    color: "#ec4899",
    ingredients: ["Champagne", "Elderflower", "Rose", "Edible Glitter"],
    model: "/assets/3d/cocktail-pink.glb",
  },
  {
    id: "oz-old-fashioned",
    name: "Oz Old Fashioned",
    description: "A classic with an emerald twist",
    color: "#f59e0b",
    ingredients: ["Bourbon", "Bitters", "Orange", "Emerald Sugar"],
    model: "/assets/3d/cocktail-amber.glb",
  },
]

export default function CocktailsPage() {
  const [isXRSupported, setIsXRSupported] = useState<boolean | null>(null)
  const [selectedCocktail, setSelectedCocktail] = useState(cocktails[0])
  const [sessionStarted, setSessionStarted] = useState(false)

  useEffect(() => {
    const checkXRSupport = async () => {
      try {
        if ("xr" in navigator) {
          const supported = await navigator.xr?.isSessionSupported("immersive-ar")
          setIsXRSupported(supported || false)
          trackEvent("cocktail_menu_loaded", { xr_supported: supported })
        } else {
          setIsXRSupported(false)
        }
      } catch (error) {
        console.log("[v0] XR check failed:", error)
        setIsXRSupported(false)
        trackEvent("cocktail_menu_loaded", { xr_supported: false, error: "permissions" })
      }
    }
    checkXRSupport()
  }, [])

  const handleCocktailSelect = (cocktail: (typeof cocktails)[0]) => {
    setSelectedCocktail(cocktail)
    trackEvent("menu_item_viewed", {
      item_id: cocktail.id,
      item_name: cocktail.name,
    })
  }

  const handleStartSession = () => {
    setSessionStarted(true)
    trackEvent("cocktail_ar_started", { mode: isXRSupported ? "xr" : "fallback" })
  }

  if (isXRSupported === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950">
        <div className="text-center text-emerald-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4" />
          <p>Loading menu...</p>
        </div>
      </div>
    )
  }

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <h1 className="text-4xl font-bold text-emerald-100 mb-2 text-center">Wicked Cocktail Menu</h1>
          <p className="text-emerald-200 mb-8 text-center">
            {isXRSupported
              ? "View cocktails in AR and explore ingredients in 3D"
              : "Explore our magical cocktail collection"}
          </p>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {cocktails.map((cocktail) => (
              <Card
                key={cocktail.id}
                className="p-6 bg-emerald-950/50 border-emerald-700 cursor-pointer hover:border-emerald-500 transition-colors"
                onClick={() => handleCocktailSelect(cocktail)}
              >
                <div className="w-full h-32 rounded-lg mb-4" style={{ backgroundColor: cocktail.color }} />
                <h3 className="text-xl font-bold text-emerald-100 mb-2">{cocktail.name}</h3>
                <p className="text-emerald-200 text-sm mb-4">{cocktail.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cocktail.ingredients.map((ingredient) => (
                    <span key={ingredient} className="px-2 py-1 bg-emerald-800/50 text-emerald-200 text-xs rounded">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleStartSession}
            className="w-full max-w-md mx-auto block bg-emerald-600 hover:bg-emerald-700 text-white"
            size="lg"
          >
            {isXRSupported ? "View in AR" : "Explore Menu"}
          </Button>
        </div>
      </div>
    )
  }

  const content = (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 p-4">
      <GestureControls
        onSwipeLeft={() => {
          const currentIndex = cocktails.findIndex((c) => c.id === selectedCocktail.id)
          const nextIndex = (currentIndex + 1) % cocktails.length
          handleCocktailSelect(cocktails[nextIndex])
        }}
        onSwipeRight={() => {
          const currentIndex = cocktails.findIndex((c) => c.id === selectedCocktail.id)
          const prevIndex = (currentIndex - 1 + cocktails.length) % cocktails.length
          handleCocktailSelect(cocktails[prevIndex])
        }}
      >
        <div className="max-w-4xl mx-auto py-8">
          <Card className="p-6 bg-emerald-950/50 border-emerald-700">
            <h2 className="text-3xl font-bold text-emerald-100 mb-4">{selectedCocktail.name}</h2>
            <p className="text-emerald-200 mb-6">{selectedCocktail.description}</p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-emerald-100 mb-3">Ingredients:</h3>
              <ul className="space-y-2">
                {selectedCocktail.ingredients.map((ingredient) => (
                  <li key={ingredient} className="text-emerald-200 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center text-emerald-300 text-sm">Swipe left/right to browse cocktails</div>
          </Card>
        </div>
      </GestureControls>
    </div>
  )

  return isXRSupported ? content : <ARFallback feature="cocktails">{content}</ARFallback>
}
