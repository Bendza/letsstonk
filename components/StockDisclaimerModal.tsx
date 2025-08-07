"use client"

import { useState, useRef } from "react"

export function hasAcceptedStockDisclaimer(stockSymbol: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const acceptedStocks = JSON.parse(localStorage.getItem('stockDisclaimerAccepted') || '{}')
    return !!acceptedStocks[stockSymbol]
  } catch {
    return false
  }
}
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X, ExternalLink } from "lucide-react"

interface StockDisclaimerModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  stock: {
    symbol: string
    name: string
    price: number
    logoUri?: string
    address: string
  }
}

export function StockDisclaimerModal({ isOpen, onClose, onAccept, stock }: StockDisclaimerModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
      setHasScrolledToBottom(isAtBottom)
    }
  }

  const canProceed = hasScrolledToBottom && termsAccepted

  const handleAccept = () => {
    if (canProceed) {
      // Store acceptance in localStorage
      const acceptedStocks = JSON.parse(localStorage.getItem('stockDisclaimerAccepted') || '{}')
      acceptedStocks[stock.symbol] = true
      localStorage.setItem('stockDisclaimerAccepted', JSON.stringify(acceptedStocks))
      
      onAccept()
      // Reset state
      setHasScrolledToBottom(false)
      setTermsAccepted(false)
    }
  }

  const handleClose = () => {
    onClose()
    // Reset state
    setHasScrolledToBottom(false)
    setTermsAccepted(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-[95vw] h-[95vh] sm:max-h-[95vh] p-0 bg-background overflow-hidden border border-border flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            {stock.logoUri && (
              <img 
                src={stock.logoUri} 
                alt={stock.name}
                className="w-12 h-12 rounded-lg object-cover bg-background border border-border"
              />
            )}
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                Trade {stock.symbol}
              </DialogTitle>
              <p className="text-muted-foreground">
                {stock.name} • ${stock.price.toFixed(2)}
              </p>
            </div>
            <a 
              href={stock.address.startsWith('Pre') ? "https://prestocks.com" : "https://xstocks.com"}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Learn more about {stock.address.startsWith('Pre') ? 'PreStocks' : 'xStocks'}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </DialogHeader>
        
        <ScrollArea 
          ref={scrollAreaRef}
          className="px-6 flex-1 min-h-0"
          onScrollCapture={handleScroll}
        >
          <div className="space-y-6 pb-6">
            {/* IMPORTANT DISCLAIMERS */}
            <div className="bg-card border border-border rounded-lg p-6 mt-6">
              <div className="flex items-start gap-3">
                <div>
                  <h3 className="font-bold text-foreground mb-4">Important Disclaimers</h3>
                  
                  <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                    <div className="bg-background rounded-lg p-4 border border-border">
                      <p className="font-semibold text-foreground mb-2">Geographic Restrictions</p>
                      <p>
                        <strong>NOT available to US persons</strong> or residents of restricted jurisdictions. 
                        You confirm you are not a US person and are legally permitted to use this service.
                      </p>
                    </div>

                    <div className="bg-background rounded-lg p-4 border border-border">
                      <p className="font-semibold text-foreground mb-2">Service Disclaimer</p>
                      <p>
                        We provide access to Jupiter DEX swaps only. <strong>We are not brokers, dealers, or investment advisors.</strong> 
                        We do not collect trading fees or provide investment advice. All trades are executed directly through Jupiter protocol.
                      </p>
                    </div>

                    <div className="bg-background rounded-lg p-4 border border-border">
                      <p className="font-semibold text-foreground mb-2">Investment Risk</p>
                      <p>
                        <strong>ALL INVESTMENTS CARRY SIGNIFICANT RISK OF LOSS.</strong> You may lose some or all of your capital. 
                        Only invest what you can afford to lose. We are not responsible for any losses.
                      </p>
                    </div>

                    <div className="bg-background rounded-lg p-4 border border-border">
                      <p className="font-semibold text-foreground mb-2">Limitation of Liability</p>
                      <p>
                        We provide the platform "as is" without warranties. <strong>We are not liable for any losses, damages, or technical issues.</strong> 
                        You trade at your own risk and responsibility.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FINAL ACKNOWLEDGMENT */}
            <div className="bg-background border-2 border-primary rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-3">Acknowledgment</h3>
              <p className="text-muted-foreground leading-relaxed">
                By proceeding, you confirm you understand the risks, meet all legal requirements, and accept full responsibility for your trading decisions.
              </p>
            </div>
          </div>
        </ScrollArea>
        
        {/* Acceptance Checkbox */}
        <div className="px-6 py-4 bg-card/50 border-t border-border flex-shrink-0">
          <div className="flex items-center justify-start mt-2 gap-3 mb-4">
            <Checkbox 
              id="terms" 
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="flex-shrink-0"
            />
            <label htmlFor="terms" className="text-xs font-medium text-foreground leading-relaxed">
              I accept all disclaimers, confirm I'm <strong>not a US person</strong>, and understand the risks
            </label>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="text-xs text-muted-foreground text-center sm:text-left">
              {!hasScrolledToBottom && "Please scroll to the bottom to continue"}
              {hasScrolledToBottom && !canProceed && "Please accept the terms to continue"}
            </div>
            <div className="flex gap-3 w-full">
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="flex-1 sm:flex-initial sm:px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAccept}
                disabled={!canProceed}
                className="flex-1 sm:flex-initial sm:px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Accept & Trade {stock.symbol}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}