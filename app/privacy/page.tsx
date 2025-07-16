"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/Logo"
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Globe, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicy() {
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
            <Shield className="h-12 w-12 text-white" />
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              PRIVACY POLICY
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            How we collect, use, and protect your personal information on SolStock AI
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
            
            {/* Introduction */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">1. INTRODUCTION</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    SolStock AI ("we," "our," or "us") is committed to protecting your privacy and personal information. 
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                    use our automated investment platform.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Our Commitment</h4>
                    <p className="text-blue-800 leading-relaxed">
                      We believe in transparency and user control over personal data. This policy outlines our practices 
                      in clear, understandable language to help you make informed decisions about your privacy.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Scope of This Policy</h4>
                    <p className="text-gray-700 leading-relaxed">
                      This Privacy Policy applies to all users of the SolStock AI platform, including our website, 
                      mobile applications, and related services. By using our platform, you agree to the collection 
                      and use of information in accordance with this policy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">2. INFORMATION WE COLLECT</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Wallet Information</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We collect information related to your Solana wallet connection:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Wallet addresses (public keys)</li>
                      <li>• Transaction signatures and blockchain data</li>
                      <li>• Portfolio holdings and balances</li>
                      <li>• Trading history and preferences</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Platform Usage Data</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We automatically collect information about your use of our platform:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Device information (browser, operating system)</li>
                      <li>• IP addresses and location data</li>
                      <li>• Usage patterns and feature interactions</li>
                      <li>• Performance metrics and error logs</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Investment Preferences</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We collect information about your investment profile:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Risk tolerance settings</li>
                      <li>• Investment goals and objectives</li>
                      <li>• Portfolio allocation preferences</li>
                      <li>• Rebalancing frequency settings</li>
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2">What We Don't Collect</h4>
                        <p className="text-amber-800 leading-relaxed">
                          We never collect or store your private keys, seed phrases, or wallet passwords. 
                          These remain under your exclusive control at all times.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">3. HOW WE USE YOUR INFORMATION</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Platform Operations</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Provide automated investment services</li>
                        <li>• Execute portfolio rebalancing</li>
                        <li>• Process transactions and trades</li>
                        <li>• Maintain account security</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Service Improvement</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Analyze usage patterns</li>
                        <li>• Optimize algorithm performance</li>
                        <li>• Enhance user experience</li>
                        <li>• Develop new features</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Communication</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Send platform updates</li>
                        <li>• Provide customer support</li>
                        <li>• Share important announcements</li>
                        <li>• Respond to inquiries</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Compliance</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Meet regulatory requirements</li>
                        <li>• Prevent fraud and abuse</li>
                        <li>• Enforce terms of service</li>
                        <li>• Maintain audit trails</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">4. DATA SHARING AND DISCLOSURE</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h4 className="font-semibold text-red-900 mb-3">We Do Not Sell Your Data</h4>
                    <p className="text-red-800 leading-relaxed">
                      We do not sell, trade, or rent your personal information to third parties for marketing purposes. 
                      Your data is used solely to provide and improve our services.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Limited Sharing Scenarios</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We may share your information only in the following circumstances:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>• <strong>Service Providers:</strong> Trusted partners who help operate our platform</li>
                      <li>• <strong>Legal Compliance:</strong> When required by law or legal process</li>
                      <li>• <strong>Business Transfer:</strong> In case of merger, acquisition, or sale</li>
                      <li>• <strong>Safety:</strong> To protect rights, property, or safety of users</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Blockchain Transparency</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Please note that blockchain transactions are inherently public and permanent. 
                      While we don't share your personal information, your wallet addresses and 
                      transaction history are visible on the Solana blockchain.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">5. DATA SECURITY</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    We implement industry-standard security measures to protect your information against 
                    unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Technical Safeguards</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• End-to-end encryption</li>
                        <li>• Secure data transmission (HTTPS)</li>
                        <li>• Regular security audits</li>
                        <li>• Access controls and monitoring</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Operational Security</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Employee security training</li>
                        <li>• Incident response procedures</li>
                        <li>• Regular security updates</li>
                        <li>• Third-party security assessments</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2">Your Responsibility</h4>
                        <p className="text-amber-800 leading-relaxed">
                          While we protect data on our platform, you're responsible for securing your wallet 
                          and private keys. Use hardware wallets and follow best practices for crypto security.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">6. YOUR PRIVACY RIGHTS</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    You have certain rights regarding your personal information, subject to applicable laws:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Access and Control</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Access your personal data</li>
                        <li>• Update or correct information</li>
                        <li>• Export your data</li>
                        <li>• Delete your account</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Privacy Controls</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Opt out of communications</li>
                        <li>• Limit data processing</li>
                        <li>• Object to automated decisions</li>
                        <li>• Withdraw consent</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">How to Exercise Your Rights</h4>
                    <p className="text-blue-800 leading-relaxed">
                      To exercise any of these rights, please contact us at privacy@solstock.ai. 
                      We will respond to your request within 30 days and may require identity verification.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">7. DATA RETENTION</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    We retain your personal information only for as long as necessary to provide our services 
                    and comply with legal obligations.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Retention Periods</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• <strong>Account Data:</strong> While your account is active plus 7 years</li>
                      <li>• <strong>Transaction Records:</strong> 7 years for regulatory compliance</li>
                      <li>• <strong>Usage Analytics:</strong> 2 years for service improvement</li>
                      <li>• <strong>Support Communications:</strong> 3 years for reference</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Secure Deletion</h4>
                    <p className="text-gray-700 leading-relaxed">
                      When data is no longer needed, we securely delete it using industry-standard methods. 
                      Some information may remain in backup systems for a limited time before permanent deletion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* International Transfers */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">8. INTERNATIONAL DATA TRANSFERS</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Our platform operates globally, and your information may be transferred to and processed 
                    in countries other than your own. We ensure appropriate safeguards are in place.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Data Protection Standards</h4>
                    <p className="text-gray-700 leading-relaxed">
                      We implement appropriate safeguards for international transfers, including standard 
                      contractual clauses and adequacy decisions where applicable.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Primary Locations</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Switzerland (primary data processing)</li>
                      <li>• European Union (backup and redundancy)</li>
                      <li>• United States (cloud infrastructure)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates and Contact */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">9. POLICY UPDATES & CONTACT</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Policy Updates</h4>
                    <p className="text-gray-700 leading-relaxed">
                      We may update this Privacy Policy from time to time. We will notify you of any material 
                      changes by posting the new policy on our platform and updating the "Last Updated" date.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Email:</strong> privacy@solstock.ai</p>
                      <p><strong>Data Protection Officer:</strong> dpo@solstock.ai</p>
                      <p><strong>Address:</strong> SolStock AI, Privacy Department, Switzerland</p>
                      <p><strong>Last Updated:</strong> December 2024</p>
                    </div>
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
              <div className="text-sm text-gray-400 uppercase tracking-wide">PRIVACY PROTECTION</div>
            </div>
          </div>
          <p className="text-gray-400 mb-6">
            Your privacy is our priority. Secure, transparent, and user-controlled.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
            <Link href="/risk" className="text-gray-400 hover:text-white">Risk Disclosure</Link>
            <Link href="/how-it-works" className="text-gray-400 hover:text-white">How It Works</Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 