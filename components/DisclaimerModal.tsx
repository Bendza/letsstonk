"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Shield, FileText, TrendingUp, DollarSign, Users, Globe } from "lucide-react"

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
      <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] p-0 bg-white overflow-hidden">
        <DialogHeader className="px-4 sm:px-8 pt-4 sm:pt-8 pb-4 sm:pb-6 bg-gray-50 border-b border-gray-200">
          <DialogTitle className="text-xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Terms of Service & Risk Disclosure
          </DialogTitle>
          <p className="text-sm sm:text-lg text-gray-600 mt-2">
            Please read carefully and scroll to the bottom to continue
          </p>
        </DialogHeader>
        
        <ScrollArea 
          ref={scrollAreaRef}
          className="px-4 sm:px-8 h-[50vh] sm:h-[400px]"
          onScrollCapture={handleScroll}
        >
          <div className="space-y-4 sm:space-y-8 pb-6">
            {/* Platform Overview */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-6 border border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-300">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                <h3 className="font-bold text-lg sm:text-xl text-gray-900">PLATFORM OVERVIEW</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-6">
                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">WHAT IS SOLSTOCK?</h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    SolStock is an AI-powered robo-advisor platform that enables automated investment in tokenized stocks (xStocks) 
                    on the Solana blockchain. The platform uses algorithmic portfolio management to diversify investments based on 
                    your risk tolerance.
                  </p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">XSTOCKS EXPLAINED</h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    xStocks are tokenized representations of real stocks, backed 1:1 by actual shares held in regulated custody 
                    by Backed Finance AG. Each token represents fractional ownership in the underlying stock and tracks its price performance.
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Disclosure */}
            <div className="bg-red-50 rounded-lg p-3 sm:p-6 border border-red-200">
              <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-red-300">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                <h3 className="font-bold text-lg sm:text-xl text-red-900">RISK DISCLOSURE</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-6">
                <div className="bg-white border border-red-200 rounded-lg p-3 sm:p-5">
                  <h4 className="font-semibold text-sm sm:text-base text-red-900 mb-2 sm:mb-3">INVESTMENT RISKS</h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2 sm:mb-3">
                    <strong className="text-red-800">All investments carry significant risk of loss.</strong> Stock prices can be volatile 
                    and may decline rapidly due to market conditions, economic factors, or company-specific events.
                  </p>
                  <ul className="text-xs sm:text-sm text-gray-700 space-y-1 ml-3 sm:ml-4">
                    <li>• You may lose some or all of your invested capital</li>
                    <li>• Past performance does not guarantee future results</li>
                    <li>• Market volatility can cause significant portfolio fluctuations</li>
                    <li>• Automated rebalancing may not prevent losses</li>
                  </ul>
                </div>
                
                <div className="bg-white border border-red-200 rounded-lg p-3 sm:p-5">
                  <h4 className="font-semibold text-sm sm:text-base text-red-900 mb-2 sm:mb-3">BLOCKCHAIN & TECHNICAL RISKS</h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    Trading on blockchain networks involves additional risks including smart contract vulnerabilities, 
                    network congestion, transaction failures, and potential loss of funds due to technical issues or user error.
                  </p>
                </div>
                
                <div className="bg-white border border-red-200 rounded-lg p-3 sm:p-5">
                  <h4 className="font-semibold text-sm sm:text-base text-red-900 mb-2 sm:mb-3">REGULATORY RISKS</h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    Cryptocurrency and tokenized securities regulations are evolving. Changes in laws or regulations could 
                    affect the platform's operations, token values, or your ability to trade.
                  </p>
                </div>
              </div>
            </div>

            {/* Regulatory Compliance */}
            <div className="bg-blue-50 rounded-lg p-3 sm:p-6 border border-blue-200">
              <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-blue-300">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                <h3 className="font-bold text-lg sm:text-xl text-blue-900">REGULATORY COMPLIANCE</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-6">
                <div className="bg-white border border-blue-200 rounded-lg p-3 sm:p-5">
                  <h4 className="font-semibold text-sm sm:text-base text-blue-900 mb-2 sm:mb-3">GEOGRAPHIC RESTRICTIONS</h4>
                  <div className="space-y-2 text-xs sm:text-sm text-gray-700 leading-relaxed">
                    <p><strong className="text-blue-800">IMPORTANT: This platform is NOT available to:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• US persons (citizens, residents, or entities)</li>
                      <li>• Persons subject to international sanctions</li>
                      <li>• Residents of restricted jurisdictions</li>
                      <li>• UK retail clients (professional clients only)</li>
                    </ul>
                    <p className="mt-2">
                      By using this service, you confirm you are not located in a restricted jurisdiction and are not a prohibited person.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white border border-blue-200 rounded-lg p-3 sm:p-5">
                  <h4 className="font-semibold text-sm sm:text-base text-blue-900 mb-2 sm:mb-3">QUALIFIED INVESTOR STATUS</h4>
                  <div className="space-y-2 text-xs sm:text-sm text-gray-700 leading-relaxed">
                    <p>
                      <strong>You must qualify as a "Professional Client"</strong> as defined in applicable financial services regulations:
                    </p>
                    <ul className="ml-4 space-y-1">
                      <li>• Swiss Professional Client (FinSA Article 4(3) and 5(1))</li>
                      <li>• EU/EEA Qualified Investor (Prospectus Regulation 2017/1129)</li>
                      <li>• Equivalent qualified/accredited investor status in your jurisdiction</li>
                    </ul>
                    <p>
                      <strong className="text-red-600">If you do not meet these requirements, you are prohibited from using this platform.</strong>
                    </p>
                  </div>
                </div>
                
                <div className="bg-white border border-blue-200 rounded-lg p-3 sm:p-5">
                  <h4 className="font-semibold text-sm sm:text-base text-blue-900 mb-2 sm:mb-3">BACKED FINANCE INTEGRATION</h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    Tokenized securities are provided by Backed Assets (Liechtenstein) AG, approved by the Financial Market Authority (FMA) 
                    of Liechtenstein. Securities are governed by Swiss law and backed 1:1 by underlying assets held in regulated custody.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms of Service Section */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-300">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                <h3 className="font-bold text-lg sm:text-xl text-gray-900">TERMS OF SERVICE</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-6">
                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">ACCEPTANCE OF TERMS</h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    By using this platform, you agree to be bound by these terms of service and all applicable laws and regulations. 
                    If you do not agree with any of these terms, you are prohibited from using the platform.
                  </p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">PLATFORM USAGE</h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    You may use the platform solely for lawful investment purposes. You agree not to use the platform for any 
                    illegal activities, market manipulation, or in violation of any applicable regulations.
                  </p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">INVESTMENT RESPONSIBILITY</h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    You acknowledge that all investment decisions are made at your own risk and discretion. The platform provides 
                    automated portfolio management tools, but you remain fully responsible for your investment outcomes.
                    You represent that you have sufficient knowledge and experience in financial matters to evaluate the risks and merits of this investment. 
                    <strong>You should not invest more than you can afford to lose.</strong>
                  </p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">LIMITATION OF LIABILITY</h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, 
                    or punitive damages arising from your use of this platform or any investment losses.
                  </p>
                </div>
              </div>
            </div>

            {/* Final Acknowledgment */}
            <div className="bg-gray-900 text-white rounded-lg p-3 sm:p-6">
              <h3 className="font-bold text-white mb-3 sm:mb-4 text-base sm:text-lg">FINAL ACKNOWLEDGMENT</h3>
              <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">
                By proceeding, you acknowledge that you have read and understood all the risks, terms, and conditions outlined above. 
                You confirm that you are making an informed decision to use this platform and accept full responsibility for your investment decisions.
              </p>
            </div>
          </div>
        </ScrollArea>
        
        {/* Acceptance Checkboxes */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gray-50 border-t border-gray-200">
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="mt-1 flex-shrink-0"
              />
              <label htmlFor="terms" className="text-xs sm:text-sm font-medium text-gray-900 leading-relaxed">
                I have read and agree to the <strong>Terms of Service</strong> and understand the platform's operations
              </label>
            </div>
            
            <div className="flex items-start gap-2 sm:gap-3">
              <Checkbox 
                id="risks" 
                checked={risksAccepted}
                onCheckedChange={(checked) => setRisksAccepted(checked as boolean)}
                className="mt-1 flex-shrink-0"
              />
              <label htmlFor="risks" className="text-xs sm:text-sm font-medium text-gray-900 leading-relaxed">
                I acknowledge and accept all <strong>investment risks</strong> including potential total loss of capital
              </label>
            </div>
            
            <div className="flex items-start gap-2 sm:gap-3">
              <Checkbox 
                id="regulatory" 
                checked={regulatoryAccepted}
                onCheckedChange={(checked) => setRegulatoryAccepted(checked as boolean)}
                className="mt-1 flex-shrink-0"
              />
              <label htmlFor="regulatory" className="text-xs sm:text-sm font-medium text-gray-900 leading-relaxed">
                I confirm I am <strong>not a US person</strong>, <strong>qualify as a Professional Client</strong>, and am legally permitted to use this service
              </label>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              {!hasScrolledToBottom && "Please scroll to the bottom to continue"}
              {hasScrolledToBottom && !canProceed && "Please accept all terms to continue"}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="px-4 sm:px-6 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAccept}
                disabled={!canProceed}
                className="px-6 sm:px-8 bg-gray-900 hover:bg-gray-800 text-white order-1 sm:order-2"
              >
                Accept & Continue
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
