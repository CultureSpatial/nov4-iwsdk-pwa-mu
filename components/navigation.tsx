"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Home,
  Camera,
  Wine,
  Users,
  TestTube,
  Presentation,
  Activity,
  Scan,
  Store,
  Calendar,
  Hand,
  ClipboardCheck,
  Sparkles,
  QrCode,
  CalendarDays,
} from "lucide-react"

const routes = [
  { name: "Home", path: "/", icon: Home },
  { name: "Events", path: "/events", icon: CalendarDays }, // Added Events route
  { name: "MR Demo", path: "/mr-demo", icon: Hand },
  { name: "Photo Booth", path: "/ar/photo-booth", icon: Camera },
  { name: "Cocktails", path: "/ar/cocktails", icon: Wine },
  { name: "AR Scan", path: "/ar/scan", icon: Scan },
  { name: "IWSDK Demo", path: "/ar/iwsdk", icon: Activity },
  { name: "Presenter Dashboard", path: "/presenter", icon: Presentation },
  { name: "Event Runbook", path: "/runbook", icon: ClipboardCheck },
  { name: "Effects & Assets", path: "/effects", icon: Sparkles },
  { name: "QR Codes", path: "/qr-codes", icon: QrCode },
  { name: "ACE Workflow", path: "/ace", icon: Activity },
  { name: "IWSDK Tests", path: "/test/iwsdk", icon: TestTube },
  { name: "Influencer Kit", path: "/influencer", icon: Users },
  { name: "Retailer Dashboard", path: "/retailer", icon: Store },
  { name: "Hybrid Event", path: "/event", icon: Calendar },
]

export function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 z-50 bg-emerald-900/80 border-emerald-700 hover:bg-emerald-800"
        >
          <Menu className="h-5 w-5 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-emerald-950 border-emerald-700 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">Navigation</SheetTitle>
          <SheetDescription className="text-emerald-200">Access all AR experiences and tools</SheetDescription>
        </SheetHeader>
        <nav className="mt-8 space-y-2">
          {routes.map((route) => {
            const Icon = route.icon
            const isActive = pathname === route.path
            return (
              <Link key={route.path} href={route.path}>
                <Button
                  onClick={() => setOpen(false)}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive ? "bg-emerald-600 hover:bg-emerald-700" : "hover:bg-emerald-900/50 text-emerald-100"
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {route.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
