"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MarketplaceLanding } from "../components/MarketplaceLanding"
import { TradingModal } from "../components/TradingModal"
import { DisclaimerModal } from "@/components/DisclaimerModal"
import { usePrivyAuth } from "@/hooks/usePrivyAuth"

export default function Page() {
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [showTradingModal, setShowTradingModal] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const router = useRouter()
  
  const { isAuthenticated, hasProfile, hasPortfolio, user } = usePrivyAuth()

  // Users stay on landing page after login - no auto navigation

  const handleGetStarted = () => {
    // Users stay on landing page - no navigation needed
  }


  const handleTradeStock = (stock: any) => {
    setSelectedStock(stock)
    setShowTradingModal(true)
  }

  const handleCloseTradingModal = () => {
    setShowTradingModal(false)
    setSelectedStock(null)
  }

  const handleNavigate = (page: string) => {
    if (page === "dashboard") {
      router.push('/dashboard/markets')
    } else {
    }
  }

  const handleCloseDisclaimer = () => {
    setShowDisclaimer(false)
  }

  const handleAcceptDisclaimer = () => {
    setShowDisclaimer(false)
  }


  return (
    <div>
      <DisclaimerModal 
        isOpen={showDisclaimer}
        onClose={handleCloseDisclaimer}
        onAccept={handleAcceptDisclaimer}
      />
      <MarketplaceLanding 
        onNavigate={handleNavigate}
      />
      
      {showTradingModal && selectedStock && (
        <TradingModal
          open={showTradingModal}
          onOpenChange={setShowTradingModal}
          stock={selectedStock}
        />
      )}
    </div>
  )
}
