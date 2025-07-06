"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Shield, ExternalLink } from "lucide-react"

interface DisclaimerModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export function DisclaimerModal({ isOpen, onClose, onAccept }: DisclaimerModalProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedRisks, setAcceptedRisks] = useState(false)
  const [acceptedLocation, setAcceptedLocation] = useState(false)

  const canProceed = acceptedTerms && acceptedRisks && acceptedLocation

  const handleAccept = () => {
    if (canProceed) {
      onAccept()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            Important Legal Disclaimers
          </DialogTitle>
          <DialogDescription>
            Please read and acknowledge the following important information before proceeding.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Geographic Restrictions */}
            <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-4 rounded-r-lg">
              <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Geographic Restrictions
              </h3>
              <div className="text-red-700 space-y-2">
                <p>
                  <strong>This service is NOT available to:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>US persons (as defined by US securities laws)</li>
                  <li>US residents or citizens</li>
                  <li>Persons located in the United States</li>
                  <li>Entities organized under US law</li>
                </ul>
                <p className="text-sm">
                  By proceeding, you represent and warrant that you are not a US person and are not accessing this
                  service from within the United States.
                </p>
              </div>
            </div>

            {/* Investment Risks */}
            <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 p-4 rounded-r-lg">
              <h3 className="font-bold text-amber-800 mb-2">Investment Risks & Disclaimers</h3>
              <div className="text-amber-700 space-y-2 text-sm">
                <p>
                  <strong>This is NOT investment advice.</strong> All investments carry risk of loss.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Past performance does not guarantee future results</li>
                  <li>You may lose some or all of your invested capital</li>
                  <li>Cryptocurrency and tokenized securities are highly volatile</li>
                  <li>Regulatory changes may affect token value and availability</li>
                  <li>Smart contract risks and blockchain network risks apply</li>
                  <li>No FDIC or SIPC insurance protection</li>
                </ul>
              </div>
            </div>

            {/* xStocks Information */}
            <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
              <h3 className="font-bold text-blue-800 mb-2">About xStocks (Backed Finance)</h3>
              <div className="text-blue-700 space-y-2 text-sm">
                <p>xStocks are tokenized securities issued by Backed Finance AG, a Swiss company.</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Each xStock token represents a fractional interest in the underlying stock</li>
                  <li>Tokens do NOT provide voting rights or direct ownership of shares</li>
                  <li>Backed Finance holds the underlying shares in custody</li>
                  <li>Redemption and corporate actions are subject to Backed Finance's terms</li>
                  <li>Regulatory status may vary by jurisdiction</li>
                </ul>
                <p>
                  <a
                    href="https://backed.fi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    Learn more about Backed Finance <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>
            </div>

            {/* Platform Risks */}
            <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded-r-lg">
              <h3 className="font-bold text-purple-800 mb-2">Platform & Technology Risks</h3>
              <div className="text-purple-700 space-y-2 text-sm">
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Solana blockchain network risks and potential downtime</li>
                  <li>Smart contract vulnerabilities and bugs</li>
                  <li>Wallet security and private key management risks</li>
                  <li>Slippage and MEV (Maximum Extractable Value) risks</li>
                  <li>Jupiter DEX aggregator dependencies</li>
                  <li>Platform may be discontinued or modified</li>
                </ul>
              </div>
            </div>

            {/* Regulatory Notice */}
            <div className="border-l-4 border-gray-500 pl-4 bg-gray-50 p-4 rounded-r-lg">
              <h3 className="font-bold text-gray-800 mb-2">Regulatory Notice</h3>
              <div className="text-gray-700 space-y-2 text-sm">
                <p>
                  This platform and its services have not been registered with or approved by any securities regulator.
                </p>
                <p>
                  Users are responsible for compliance with their local laws and regulations. Consult with qualified
                  legal and financial advisors before using this service.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm leading-relaxed">
                I have read and agree to the <button className="text-blue-600 hover:underline">Terms of Service</button>{" "}
                and <button className="text-blue-600 hover:underline">Privacy Policy</button>
              </label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="risks"
                checked={acceptedRisks}
                onCheckedChange={(checked) => setAcceptedRisks(checked as boolean)}
              />
              <label htmlFor="risks" className="text-sm leading-relaxed">
                I understand the risks involved in trading tokenized securities and cryptocurrency, including the risk
                of total loss
              </label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="location"
                checked={acceptedLocation}
                onCheckedChange={(checked) => setAcceptedLocation(checked as boolean)}
              />
              <label htmlFor="location" className="text-sm leading-relaxed">
                I confirm that I am NOT a US person and am not accessing this service from the United States
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAccept} disabled={!canProceed} className="bg-blue-600 hover:bg-blue-700">
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
