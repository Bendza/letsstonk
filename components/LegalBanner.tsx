"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"

export function LegalBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-3 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div className="text-sm">
              <strong>IMPORTANT:</strong> This service is NOT available to US persons or residents. By continuing, you
              confirm you are not a US person and agree to our{" "}
              <button className="underline hover:no-underline">Terms of Service</button>.
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-white hover:bg-red-700 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
