"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Shield, FileText, TrendingUp } from "lucide-react"

interface DisclaimerModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export function DisclaimerModal({ isOpen, onClose, onAccept }: DisclaimerModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [risksAccepted, setRisksAccepted] = useState(false)
  const [regulatoryAccepted, setRegulatoryAccepted] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10 // 10px threshold
      setHasScrolledToBottom(isAtBottom)
    }
  }

  const canProceed = hasScrolledToBottom && termsAccepted && risksAccepted && regulatoryAccepted

  const handleAccept = () => {
    if (canProceed) {
      onAccept()
      // Reset state
      setHasScrolledToBottom(false)
      setTermsAccepted(false)
      setRisksAccepted(false)
      setRegulatoryAccepted(false)
    }
  }

  const handleClose = () => {
    onClose()
    // Reset state
    setHasScrolledToBottom(false)
    setTermsAccepted(false)
    setRisksAccepted(false)
    setRegulatoryAccepted(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Terms of Service & Risk Disclosure
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea 
          ref={scrollAreaRef}
          className="px-6 h-96"
          onScrollCapture={handleScroll}
        >
          <div className="space-y-6 pb-6">
            {/* Warning Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Important Warning</h3>
                  <p className="text-sm text-amber-700">
                    Trading in tokenized securities involves significant risk of loss. You may lose some or all of your investment. 
                    Past performance does not guarantee future results.
                  </p>
                </div>
              </div>
            </div>

            {/* Investment Risks */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-lg">Investment Risks</h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Market Risk:</strong> The value of your portfolio may fluctuate significantly based on market conditions. 
                  Stock prices can be volatile and unpredictable.
                </p>
                
                <p>
                  <strong>Technology Risk:</strong> This platform operates on blockchain technology which is still evolving. 
                  Smart contracts, while audited, may contain bugs or vulnerabilities.
                </p>
                
                <p>
                  <strong>Liquidity Risk:</strong> Tokenized securities may have limited liquidity compared to traditional markets. 
                  You may not be able to sell your positions when desired.
                </p>
                
                <p>
                  <strong>Regulatory Risk:</strong> The regulatory environment for tokenized securities is evolving. 
                  Changes in regulations could affect the platform's operations.
                </p>
                
                <p>
                  <strong>Counterparty Risk:</strong> This platform relies on third-party custodians and service providers. 
                  Their failure could impact your investments.
                </p>
              </div>
            </div>

            {/* Platform Specifics */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-lg">Platform Information</h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Tokenized Securities:</strong> The stocks in your portfolio are represented by tokens backed 1:1 by real shares 
                  held in regulated custody by Backed Finance AG in Switzerland.
                </p>
                
                <p>
                  <strong>Automated Management:</strong> Your portfolio will be automatically rebalanced according to your selected risk profile. 
                  You can change your risk level at any time.
                </p>
                
                <p>
                  <strong>Fees:</strong> A management fee of 0.1% annually is charged on your portfolio value. 
                  Additional network fees may apply for blockchain transactions.
                </p>
                
                <p>
                  <strong>Custody:</strong> Your tokens are held in your own wallet. You maintain full control and custody of your assets.
                </p>
              </div>
            </div>

            {/* Regulatory Compliance */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-lg">Regulatory Compliance</h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Eligibility:</strong> This service is not available to US persons or residents of restricted jurisdictions. 
                  By proceeding, you confirm you are not a US person.
                </p>
                
                <p>
                  <strong>KYC/AML:</strong> While we don't collect personal information, the underlying token issuers may have 
                  compliance requirements that could affect your ability to trade.
                </p>
                
                <p>
                  <strong>Tax Implications:</strong> You are responsible for understanding and complying with tax obligations 
                  in your jurisdiction related to cryptocurrency and securities trading.
                </p>
              </div>
            </div>

            {/* Terms of Service */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Terms of Service</h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  By using this platform, you agree to our terms of service and acknowledge that you have read and understood 
                  all risks associated with trading tokenized securities.
                </p>
                
                <p>
                  You confirm that you are of legal age in your jurisdiction and have the authority to enter into this agreement.
                </p>
                
                <p>
                  The platform is provided "as is" without warranties of any kind. We are not liable for any losses you may incur.
                </p>
                
                <p>
                  You agree to use the platform only for lawful purposes and in accordance with all applicable laws and regulations.
                </p>
              </div>
            </div>

            {/* Scroll indicator */}
            {!hasScrolledToBottom && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700 text-center">
                  Please scroll to the bottom to continue
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Checkboxes and Actions */}
        <div className="p-6 pt-0 space-y-4 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
                             <Checkbox 
                 id="terms"
                 checked={termsAccepted}
                 onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                 disabled={!hasScrolledToBottom}
                 className="mt-1"
               />
              <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                I have read and agree to the Terms of Service and understand that this platform is not available to US persons.
              </label>
            </div>
            
            <div className="flex items-start space-x-3">
                             <Checkbox 
                 id="risks"
                 checked={risksAccepted}
                 onCheckedChange={(checked) => setRisksAccepted(checked as boolean)}
                 disabled={!hasScrolledToBottom}
                 className="mt-1"
               />
              <label htmlFor="risks" className="text-sm text-gray-700 leading-relaxed">
                I acknowledge and accept all investment risks including potential loss of capital.
              </label>
            </div>
            
            <div className="flex items-start space-x-3">
                             <Checkbox 
                 id="regulatory"
                 checked={regulatoryAccepted}
                 onCheckedChange={(checked) => setRegulatoryAccepted(checked as boolean)}
                 disabled={!hasScrolledToBottom}
                 className="mt-1"
               />
              <label htmlFor="regulatory" className="text-sm text-gray-700 leading-relaxed">
                I understand my tax and regulatory obligations in my jurisdiction.
              </label>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAccept}
              disabled={!canProceed}
              className="flex-1 bg-gray-900 hover:bg-gray-800"
            >
              Accept & Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
