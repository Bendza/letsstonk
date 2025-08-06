"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, FileText } from "lucide-react"

export function LegalFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      {/* Legal Warning Banner */}
      <div className="bg-red-50 border-b border-red-200 px-6 py-3">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 text-red-800">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm font-medium">
              <strong>Important:</strong> Not available to US persons or residents of restricted jurisdictions. 
              Professional/Qualified investors only. High risk of loss.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">SolStock AI</h3>
            <p className="text-sm text-gray-600">
              Automated tokenized stock trading platform powered by Backed Finance and Solana blockchain.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                FMA Approved
              </Badge>
              <Badge variant="outline" className="text-xs">
                Swiss Law
              </Badge>
            </div>
          </div>

          {/* Legal Resources */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">Legal Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/terms" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/risk-disclosure" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3" />
                  Risk Disclosure
                </Link>
              </li>
              <li>
                <a 
                  href="https://assets.backed.fi/legal-documentation" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <FileText className="h-3 w-3" />
                  Backed Finance Docs ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Regulatory Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">Regulatory</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">Backed Assets AG</p>
                <p>Approved by FMA Liechtenstein</p>
                <p>Registration: FL-0002.677.649-2</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Governing Law</p>
                <p>Swiss Law</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Supported Networks</p>
                <p>Solana (xStocks)</p>
              </div>
            </div>
          </div>

          {/* Restrictions */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">Restrictions</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="font-medium text-red-800 mb-1">Not Available To:</p>
                <ul className="space-y-1 text-red-700">
                  <li>• US persons</li>
                  <li>• UK retail clients</li>
                  <li>• Sanctioned individuals</li>
                  <li>• Non-qualified investors</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Text */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="space-y-4 text-xs text-gray-500">
            <p>
              <strong>Important Disclaimer:</strong> The securities have not been and will not be registered under the U.S. Securities Act of 1933, 
              as amended, or with any securities regulatory authority of any State or other jurisdiction of the United States and may not be offered, 
              sold or delivered within the United States to, or for the account or benefit of U.S. Persons.
            </p>
            
            <p>
              Tokenized securities are issued by Backed Assets (Liechtenstein) AG and governed by Swiss law. All investments carry significant risk of loss. 
              Past performance does not guarantee future results. You should not invest more than you can afford to lose.
            </p>
            
            <p>
              This platform is for Professional Clients and Qualified Investors only as defined in applicable financial services regulations. 
              By using this service, you confirm you meet these requirements and are not located in a restricted jurisdiction.
            </p>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-200">
              <p>© 2024 SolStock AI. All rights reserved.</p>
              <p>Powered by Backed Finance & Solana</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}