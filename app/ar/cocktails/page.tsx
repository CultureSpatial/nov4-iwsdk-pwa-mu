"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ARFallback } from "@/components/ar/ar-fallback"
import { GestureControls } from "@/components/ar/gesture-controls"
import { EmeraldGlowOverlay } from "@/components/effects/emerald-glow-overlay"
import { trackEvent } from "@/lib/analytics"

const cocktails = [
  {
    id: "elphaba-elixir",
    name: "Elphaba's Elixir",
    description: "A bewitching green cocktail with lime, mint, and magic",
    color: "#10b981",
    ingredients: ["Gin", "Lime", "Mint", "Green Chartreuse"],
    model: "/assets/3d/cocktail-green.glb",
    calories: 180,
    allergens: ["None"],
    pairings: ["Emerald City Appetizers", "Wicked Witch's Brew"],
    price: "$14",
    abv: "18%",
  },
  {
    id: "glinda-sparkle",
    name: "Glinda's Sparkle",
    description: "A shimmering pink champagne cocktail fit for a good witch",
    color: "#ec4899",
    ingredients: ["Champagne", "Elderflower", "Rose", "Edible Glitter"],
    model: "/assets/3d/cocktail-pink.glb",
    calories: 120,
    allergens: ["Sulfites"],
    pairings: ["Oz Old Fashioned", "Yellow Brick Road"],
    price: "$16",
    abv: "12%",
  },
  {
    id: "oz-old-fashioned",
    name: "Oz Old Fashioned",
    description: "A classic with an emerald twist",
    color: "#f59e0b",
    ingredients: ["Bourbon", "Bitters", "Orange", "Emerald Sugar"],
    model: "/assets/3d/cocktail-amber.glb",
    calories: 160,
    allergens: ["None"],
    pairings: ["Glinda's Sparkle", "Elphaba's Elixir"],
    price: "$15",
    abv: "25%",
  },
  {
    id: "wicked-witch-brew",
    name: "Wicked Witch's Brew",
    description: "A mysterious purple potion with blackberry and lavender",
    color: "#8b5cf6",
    ingredients: ["Vodka", "Blackberry", "Lavender", "Lemon"],
    model: "/assets/3d/cocktail-purple.glb",
    calories: 150,
    allergens: ["None"],
    pairings: ["Elphaba's Elixir", "Yellow Brick Road"],
    price: "$13",
    abv: "16%",
  },
  {
    id: "yellow-brick-road",
    name: "Yellow Brick Road",
    description: "A golden journey with mango and passion fruit",
    color: "#fbbf24",
    ingredients: ["Rum", "Mango", "Passion Fruit", "Gold Flakes"],
    model: "/assets/3d/cocktail-gold.glb",
    calories: 190,
    allergens: ["None"],
    pairings: ["Wicked Witch's Brew", "Glinda's Sparkle"],
    price: "$14",
    abv: "20%",
  },
]

export default function CocktailsPage() {
  const [isXRSupported, setIsXRSupported] = useState<boolean | null>(null)
  const [selectedCocktail, setSelectedCocktail] = useState(cocktails[0])
  const [sessionStarted, setSessionStarted] = useState(false)
  const [showGlow, setShowGlow] = useState(false)
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(null)
  const [showRecommendations, setShowRecommendations] = useState(false)

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
    setShowGlow(true)
    setTimeout(() => {
      setSessionStarted(true)
      trackEvent("cocktail_ar_started", { mode: isXRSupported ? "xr" : "fallback" })
    }, 500)
  }

  const ingredientDetails: Record<string, { description: string; origin: string }> = {
    Gin: { description: "Premium botanical gin with juniper notes", origin: "London, UK" },
    Lime: { description: "Fresh-squeezed organic lime juice", origin: "Local farms" },
    Mint: { description: "Hand-picked spearmint leaves", origin: "Garden fresh" },
    "Green Chartreuse": { description: "Herbal liqueur with 130 botanicals", origin: "France" },
    Champagne: { description: "Premium French sparkling wine", origin: "Champagne, France" },
    Elderflower: { description: "Delicate floral liqueur", origin: "St-Germain" },
    Rose: { description: "Organic rose water", origin: "Morocco" },
    "Edible Glitter": { description: "Food-safe shimmer", origin: "Artisan crafted" },
    Bourbon: { description: "Small-batch Kentucky bourbon", origin: "Kentucky, USA" },
    Bitters: { description: "Aromatic cocktail bitters", origin: "Angostura" },
    Orange: { description: "Fresh orange peel and juice", origin: "California" },
    "Emerald Sugar": { description: "House-made colored sugar rim", origin: "In-house" },
    Vodka: { description: "Premium wheat vodka", origin: "Poland" },
    Blackberry: { description: "Fresh muddled blackberries", origin: "Pacific Northwest" },
    Lavender: { description: "Culinary lavender syrup", origin: "Provence, France" },
    Lemon: { description: "Fresh-squeezed lemon juice", origin: "Local farms" },
    Rum: { description: "Caribbean white rum", origin: "Jamaica" },
    Mango: { description: "Ripe mango puree", origin: "Tropical farms" },
    "Passion Fruit": { description: "Fresh passion fruit pulp", origin: "Hawaii" },
    "Gold Flakes": { description: "23k edible gold leaf", origin: "Artisan crafted" },
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

  return (
    <>
      <EmeraldGlowOverlay show={showGlow} duration={2000} onComplete={() => setShowGlow(false)} />

      {!sessionStarted ? (
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
                  <div className="flex justify-between text-emerald-300 text-sm mb-4">
                    <span className="font-semibold">{cocktail.price}</span>
                    <span>{cocktail.calories} cal</span>
                    <span>{cocktail.abv} ABV</span>
                  </div>
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
      ) : (
        <>
          {isXRSupported ? (
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
              <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 p-4">
                <div className="max-w-4xl mx-auto py-8">
                  <Card className="p-6 bg-emerald-950/50 border-emerald-700">
                    <h2 className="text-3xl font-bold text-emerald-100 mb-4">{selectedCocktail.name}</h2>
                    <p className="text-emerald-200 mb-6">{selectedCocktail.description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-emerald-900/30 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-100">{selectedCocktail.price}</div>
                        <div className="text-xs text-emerald-300">Price</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-100">{selectedCocktail.calories}</div>
                        <div className="text-xs text-emerald-300">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-100">{selectedCocktail.abv}</div>
                        <div className="text-xs text-emerald-300">ABV</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-emerald-100 mb-3">Ingredients:</h3>
                      <ul className="space-y-2">
                        {selectedCocktail.ingredients.map((ingredient) => (
                          <li key={ingredient} className="text-emerald-200">
                            <button
                              onClick={() =>
                                setExpandedIngredient(expandedIngredient === ingredient ? null : ingredient)
                              }
                              className="flex items-start w-full text-left hover:text-emerald-100 transition-colors"
                            >
                              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-medium">{ingredient}</div>
                                {expandedIngredient === ingredient && ingredientDetails[ingredient] && (
                                  <div className="mt-2 text-sm text-emerald-300 pl-4 border-l-2 border-emerald-700">
                                    <p>{ingredientDetails[ingredient].description}</p>
                                    <p className="text-xs mt-1">Origin: {ingredientDetails[ingredient].origin}</p>
                                  </div>
                                )}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-emerald-400 mt-2">Tap ingredients to learn more</p>
                    </div>

                    <div className="mb-6 p-3 bg-emerald-900/20 rounded">
                      <h4 className="text-sm font-semibold text-emerald-100 mb-1">Allergens:</h4>
                      <p className="text-sm text-emerald-200">{selectedCocktail.allergens.join(", ") || "None"}</p>
                    </div>

                    <div className="mb-6">
                      <button
                        onClick={() => setShowRecommendations(!showRecommendations)}
                        className="w-full text-left p-3 bg-emerald-800/30 rounded hover:bg-emerald-800/50 transition-colors"
                      >
                        <h4 className="text-sm font-semibold text-emerald-100">
                          Perfect Pairings {showRecommendations ? "▼" : "▶"}
                        </h4>
                      </button>
                      {showRecommendations && (
                        <div className="mt-2 space-y-2">
                          {selectedCocktail.pairings.map((pairing) => (
                            <div key={pairing} className="p-2 bg-emerald-900/20 rounded text-sm text-emerald-200">
                              {pairing}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-center text-emerald-300 text-sm">Swipe left/right to browse cocktails</div>
                  </Card>
                </div>
              </div>
            </GestureControls>
          ) : (
            <ARFallback feature="cocktails">
              <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 p-4">
                <div className="max-w-4xl mx-auto py-8">
                  <Card className="p-6 bg-emerald-950/50 border-emerald-700">
                    <h2 className="text-3xl font-bold text-emerald-100 mb-4">{selectedCocktail.name}</h2>
                    <p className="text-emerald-200 mb-6">{selectedCocktail.description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-emerald-900/30 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-100">{selectedCocktail.price}</div>
                        <div className="text-xs text-emerald-300">Price</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-100">{selectedCocktail.calories}</div>
                        <div className="text-xs text-emerald-300">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-100">{selectedCocktail.abv}</div>
                        <div className="text-xs text-emerald-300">ABV</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-emerald-100 mb-3">Ingredients:</h3>
                      <ul className="space-y-2">
                        {selectedCocktail.ingredients.map((ingredient) => (
                          <li key={ingredient} className="text-emerald-200">
                            <button
                              onClick={() =>
                                setExpandedIngredient(expandedIngredient === ingredient ? null : ingredient)
                              }
                              className="flex items-start w-full text-left hover:text-emerald-100 transition-colors"
                            >
                              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-medium">{ingredient}</div>
                                {expandedIngredient === ingredient && ingredientDetails[ingredient] && (
                                  <div className="mt-2 text-sm text-emerald-300 pl-4 border-l-2 border-emerald-700">
                                    <p>{ingredientDetails[ingredient].description}</p>
                                    <p className="text-xs mt-1">Origin: {ingredientDetails[ingredient].origin}</p>
                                  </div>
                                )}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-emerald-400 mt-2">Tap ingredients to learn more</p>
                    </div>

                    <div className="mb-6 p-3 bg-emerald-900/20 rounded">
                      <h4 className="text-sm font-semibold text-emerald-100 mb-1">Allergens:</h4>
                      <p className="text-sm text-emerald-200">{selectedCocktail.allergens.join(", ") || "None"}</p>
                    </div>

                    <div className="mb-6">
                      <button
                        onClick={() => setShowRecommendations(!showRecommendations)}
                        className="w-full text-left p-3 bg-emerald-800/30 rounded hover:bg-emerald-800/50 transition-colors"
                      >
                        <h4 className="text-sm font-semibold text-emerald-100">
                          Perfect Pairings {showRecommendations ? "▼" : "▶"}
                        </h4>
                      </button>
                      {showRecommendations && (
                        <div className="mt-2 space-y-2">
                          {selectedCocktail.pairings.map((pairing) => (
                            <div key={pairing} className="p-2 bg-emerald-900/20 rounded text-sm text-emerald-200">
                              {pairing}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => {
                          const currentIndex = cocktails.findIndex((c) => c.id === selectedCocktail.id)
                          const prevIndex = (currentIndex - 1 + cocktails.length) % cocktails.length
                          handleCocktailSelect(cocktails[prevIndex])
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => {
                          const currentIndex = cocktails.findIndex((c) => c.id === selectedCocktail.id)
                          const nextIndex = (currentIndex + 1) % cocktails.length
                          handleCocktailSelect(cocktails[nextIndex])
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Next
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </ARFallback>
          )}
        </>
      )}
    </>
  )
}
