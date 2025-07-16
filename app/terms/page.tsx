"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/Logo"
import { ArrowLeft, FileText, Shield, AlertTriangle, Scale, Users, Globe } from "lucide-react"
import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <Link href="/">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FileText className="h-12 w-12 text-white" />
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              TERMS OF SERVICE
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Legal terms and conditions governing the use of SolStock AI platform
          </p>
          <div className="mt-8">
            <Badge className="bg-gray-800 text-gray-200 border-gray-700 text-sm px-4 py-2 rounded-none">
              LAST UPDATED: DECEMBER 2024
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-12">
            
            {/* Acceptance of Terms */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Scale className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">1. ACCEPTANCE OF TERMS</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    By accessing and using the SolStock AI platform (the "Platform"), you agree to be bound by these 
                    Terms of Service ("Terms") and all applicable laws and regulations. If you do not agree with any 
                    part of these terms, you are prohibited from using or accessing this Platform.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Agreement Scope</h4>
                    <p className="text-gray-700 leading-relaxed">
                      These Terms constitute a legally binding agreement between you and SolStock AI regarding your 
                      use of the Platform. By using the Platform, you represent that you have the legal capacity 
                      to enter into this agreement.
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2">Important Notice</h4>
                        <p className="text-amber-800 leading-relaxed">
                          The Platform is not available to US persons or residents of certain jurisdictions. 
                          By using this Platform, you confirm that you are not a US person and are legally 
                          permitted to access these services.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Description */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">2. PLATFORM DESCRIPTION</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    SolStock AI is an automated investment platform that provides algorithmic portfolio management 
                    services for tokenized securities (xStocks) on the Solana blockchain. The Platform enables 
                    users to invest in diversified portfolios based on their risk tolerance.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Core Services</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Automated portfolio rebalancing</li>
                        <li>• Risk-adjusted asset allocation</li>
                        <li>• Real-time performance monitoring</li>
                        <li>• Tokenized stock trading</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Technology Stack</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Solana blockchain infrastructure</li>
                        <li>• AI-powered optimization algorithms</li>
                        <li>• Backed Finance xStocks integration</li>
                        <li>• Real-time market data feeds</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">3. USER RESPONSIBILITIES</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Account Security</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      You are responsible for maintaining the security of your wallet and private keys. 
                      We do not store your private keys and cannot recover them if lost.
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Keep your private keys secure and confidential</li>
                      <li>• Use secure wallet software and hardware</li>
                      <li>• Never share your wallet credentials</li>
                      <li>• Report any unauthorized access immediately</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Compliance Requirements</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      You must comply with all applicable laws and regulations in your jurisdiction:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Verify legal eligibility to use the Platform</li>
                      <li>• Comply with tax reporting requirements</li>
                      <li>• Adhere to anti-money laundering regulations</li>
                      <li>• Respect intellectual property rights</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Prohibited Activities</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      The following activities are strictly prohibited:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Market manipulation or fraudulent trading</li>
                      <li>• Attempting to hack or disrupt the Platform</li>
                      <li>• Using the Platform for illegal activities</li>
                      <li>• Circumventing geographic restrictions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Risks */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <CardTitle className="text-2xl font-bold text-red-900">4. INVESTMENT RISKS</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h4 className="font-semibold text-red-900 mb-3">Risk Acknowledgment</h4>
                    <p className="text-red-800 leading-relaxed">
                      <strong>All investments carry significant risk of loss.</strong> You may lose some or all 
                      of your invested capital. Past performance does not guarantee future results. You should 
                      not invest more than you can afford to lose.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Market Risks</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Stock price volatility</li>
                        <li>• Market downturns</li>
                        <li>• Economic factors</li>
                        <li>• Company-specific events</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Technology Risks</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Smart contract vulnerabilities</li>
                        <li>• Blockchain network issues</li>
                        <li>• Technical failures</li>
                        <li>• Cybersecurity threats</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">5. LIMITATION OF LIABILITY</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    To the maximum extent permitted by law, SolStock AI and its affiliates shall not be liable 
                    for any indirect, incidental, special, consequential, or punitive damages arising from your 
                    use of the Platform or any investment losses.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Disclaimer of Warranties</h4>
                    <p className="text-gray-700 leading-relaxed">
                      The Platform is provided "as is" without warranties of any kind, either express or implied. 
                      We do not warrant that the Platform will be uninterrupted, error-free, or free from harmful components.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Indemnification</h4>
                    <p className="text-gray-700 leading-relaxed">
                      You agree to indemnify and hold harmless SolStock AI from any claims, damages, or expenses 
                      arising from your use of the Platform or violation of these Terms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regulatory Compliance */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">6. REGULATORY COMPLIANCE</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Geographic Restrictions</h4>
                    <p className="text-blue-800 leading-relaxed">
                      This Platform is <strong>NOT available to US persons</strong> or residents of certain 
                      jurisdictions. By using this service, you confirm that you are not a US citizen, resident, 
                      or entity, and are not accessing the Platform from within the United States.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Swiss Regulation</h4>
                    <p className="text-gray-700 leading-relaxed">
                      The Platform operates under Swiss financial regulations. The tokenized securities are 
                      backed by shares held in regulated custody by Backed Finance AG in Switzerland.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Compliance Monitoring</h4>
                    <p className="text-gray-700 leading-relaxed">
                      We reserve the right to monitor compliance with these Terms and applicable regulations. 
                      We may suspend or terminate access for users who violate these requirements.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modifications and Termination */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">7. MODIFICATIONS AND TERMINATION</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Terms Modifications</h4>
                    <p className="text-gray-700 leading-relaxed">
                      We reserve the right to modify these Terms at any time. Changes will be effective 
                      immediately upon posting to the Platform. Your continued use constitutes acceptance 
                      of the modified Terms.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Service Termination</h4>
                    <p className="text-gray-700 leading-relaxed">
                      We may terminate or suspend your access to the Platform at any time, with or without 
                      cause, and with or without notice. You may terminate your use of the Platform at any 
                      time by discontinuing access.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Survival</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Provisions regarding liability, indemnification, and dispute resolution shall survive 
                      termination of these Terms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">8. CONTACT INFORMATION</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> legal@solstock.ai</p>
                    <p><strong>Address:</strong> SolStock AI, Blockchain Innovation Hub, Switzerland</p>
                    <p><strong>Last Updated:</strong> December 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-white" />
            <div>
              <div className="font-bold text-xl">SOLSTOCK AI</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">LEGAL DOCUMENTATION</div>
            </div>
          </div>
          <p className="text-gray-400 mb-6">
            Professional automated investment platform built on Solana blockchain
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
            <Link href="/risk" className="text-gray-400 hover:text-white">Risk Disclosure</Link>
            <Link href="/how-it-works" className="text-gray-400 hover:text-white">How It Works</Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 