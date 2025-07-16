"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/Logo"
import { ArrowLeft, AlertTriangle, TrendingDown, Zap, Shield, Globe, DollarSign, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function RiskDisclosure() {
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
      <section className="bg-red-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <AlertTriangle className="h-12 w-12 text-white" />
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              RISK DISCLOSURE
            </h1>
          </div>
          <p className="text-xl text-red-100 max-w-3xl mx-auto">
            Important information about investment risks and potential losses on SolStock AI
          </p>
          <div className="mt-8">
            <Badge className="bg-red-800 text-red-100 border-red-700 text-sm px-4 py-2 rounded-none">
              REQUIRED READING BEFORE INVESTING
            </Badge>
          </div>
        </div>
      </section>

      {/* Critical Warning */}
      <section className="py-12 bg-red-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-red-100 border-l-4 border-red-600 p-8 rounded-r-lg">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-8 w-8 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-red-900 mb-4">⚠️ CRITICAL WARNING</h2>
                <div className="space-y-4">
                  <p className="text-red-800 font-semibold text-lg leading-relaxed">
                    ALL INVESTMENTS CARRY SIGNIFICANT RISK OF LOSS. YOU MAY LOSE SOME OR ALL OF YOUR INVESTED CAPITAL.
                  </p>
                  <p className="text-red-800 leading-relaxed">
                    Past performance does not guarantee future results. Only invest money you can afford to lose completely. 
                    This platform is not suitable for all investors and should only be used by those who understand 
                    the risks involved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-12">
            
            {/* Market Risks */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                  <CardTitle className="text-2xl font-bold text-red-900">1. MARKET RISKS</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Stock markets are inherently volatile and unpredictable. Market conditions can change rapidly, 
                    leading to significant losses in short periods.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-900 mb-3">Price Volatility</h4>
                      <ul className="space-y-2 text-red-800">
                        <li>• Stock prices can fluctuate dramatically</li>
                        <li>• Daily swings of 10%+ are common</li>
                        <li>• Bear markets can last months or years</li>
                        <li>• Individual stocks can lose 50%+ of value</li>
                      </ul>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-900 mb-3">Market Downturns</h4>
                      <ul className="space-y-2 text-red-800">
                        <li>• Market crashes can occur suddenly</li>
                        <li>• Recessions impact all sectors</li>
                        <li>• Correlation increases during crises</li>
                        <li>• Recovery time is unpredictable</li>
                      </ul>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-900 mb-3">Economic Factors</h4>
                      <ul className="space-y-2 text-red-800">
                        <li>• Interest rate changes</li>
                        <li>• Inflation and deflation</li>
                        <li>• Currency fluctuations</li>
                        <li>• Geopolitical events</li>
                      </ul>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-900 mb-3">Company-Specific Risks</h4>
                      <ul className="space-y-2 text-red-800">
                        <li>• Earnings disappointments</li>
                        <li>• Management changes</li>
                        <li>• Competitive pressures</li>
                        <li>• Industry disruption</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technology Risks */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-orange-600" />
                  <CardTitle className="text-2xl font-bold text-orange-900">2. TECHNOLOGY RISKS</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Our platform operates on blockchain technology, which introduces unique risks not present 
                    in traditional financial systems.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <h4 className="font-semibold text-orange-900 mb-3">Smart Contract Risks</h4>
                      <p className="text-orange-800 leading-relaxed mb-4">
                        Smart contracts are computer programs that can contain bugs or vulnerabilities:
                      </p>
                      <ul className="space-y-2 text-orange-800">
                        <li>• Code vulnerabilities may be exploited</li>
                        <li>• Upgrades can introduce new bugs</li>
                        <li>• Third-party contract dependencies</li>
                        <li>• Irreversible transactions</li>
                      </ul>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <h4 className="font-semibold text-orange-900 mb-3">Blockchain Network Risks</h4>
                      <p className="text-orange-800 leading-relaxed mb-4">
                        The Solana blockchain may experience technical issues:
                      </p>
                      <ul className="space-y-2 text-orange-800">
                        <li>• Network congestion and high fees</li>
                        <li>• Validator failures or attacks</li>
                        <li>• Protocol upgrades and forks</li>
                        <li>• Temporary network outages</li>
                      </ul>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <h4 className="font-semibold text-orange-900 mb-3">Platform Risks</h4>
                      <p className="text-orange-800 leading-relaxed mb-4">
                        Our platform may experience technical difficulties:
                      </p>
                      <ul className="space-y-2 text-orange-800">
                        <li>• System downtime or maintenance</li>
                        <li>• Data corruption or loss</li>
                        <li>• Cybersecurity breaches</li>
                        <li>• Integration failures with third parties</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liquidity Risks */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-2xl font-bold text-blue-900">3. LIQUIDITY RISKS</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Liquidity refers to how easily you can buy or sell an asset. Tokenized securities may have 
                    different liquidity characteristics than traditional stocks.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Limited Trading Hours</h4>
                    <p className="text-blue-800 leading-relaxed">
                      While blockchain operates 24/7, liquidity may be lower during traditional market off-hours 
                      when institutional traders are inactive.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Market Depth</h4>
                    <p className="text-blue-800 leading-relaxed">
                      Tokenized securities may have less trading volume than traditional stocks, leading to:
                    </p>
                    <ul className="space-y-2 text-blue-800 mt-3">
                      <li>• Wider bid-ask spreads</li>
                      <li>• Price slippage on large orders</li>
                      <li>• Difficulty exiting positions quickly</li>
                      <li>• Price manipulation risks</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Emergency Situations</h4>
                    <p className="text-blue-800 leading-relaxed">
                      During market stress or technical issues, you may be unable to trade when you need to most:
                    </p>
                    <ul className="space-y-2 text-blue-800 mt-3">
                      <li>• Platform maintenance during volatility</li>
                      <li>• Network congestion preventing trades</li>
                      <li>• Extreme market conditions</li>
                      <li>• Regulatory trading halts</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regulatory Risks */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-purple-600" />
                  <CardTitle className="text-2xl font-bold text-purple-900">4. REGULATORY RISKS</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    The regulatory environment for cryptocurrency and tokenized securities is rapidly evolving 
                    and may change in ways that negatively impact your investments.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h4 className="font-semibold text-purple-900 mb-3">Regulatory Changes</h4>
                      <p className="text-purple-800 leading-relaxed mb-4">
                        New laws and regulations could significantly impact the platform:
                      </p>
                      <ul className="space-y-2 text-purple-800">
                        <li>• Bans or restrictions on tokenized securities</li>
                        <li>• Increased compliance requirements</li>
                        <li>• Higher taxes on crypto investments</li>
                        <li>• Geographic access restrictions</li>
                      </ul>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h4 className="font-semibold text-purple-900 mb-3">Compliance Costs</h4>
                      <p className="text-purple-800 leading-relaxed">
                        Regulatory compliance may require significant resources, potentially leading to:
                      </p>
                      <ul className="space-y-2 text-purple-800 mt-3">
                        <li>• Higher platform fees</li>
                        <li>• Reduced functionality</li>
                        <li>• Service discontinuation</li>
                        <li>• Geographic restrictions</li>
                      </ul>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h4 className="font-semibold text-purple-900 mb-3">Enforcement Actions</h4>
                      <p className="text-purple-800 leading-relaxed">
                        Regulatory enforcement could result in:
                      </p>
                      <ul className="space-y-2 text-purple-800 mt-3">
                        <li>• Platform shutdown or suspension</li>
                        <li>• Asset freezing or seizure</li>
                        <li>• Legal proceedings</li>
                        <li>• Investor compensation issues</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Counterparty Risks */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">5. COUNTERPARTY RISKS</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Our platform relies on various third-party service providers. Their failure or misconduct 
                    could negatively impact your investments.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Backed Finance AG</h4>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        The custodian holding the underlying shares:
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Operational failures</li>
                        <li>• Financial difficulties</li>
                        <li>• Regulatory issues</li>
                        <li>• Custody risks</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Market Makers</h4>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        Liquidity providers for trading:
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Withdrawal from market making</li>
                        <li>• Pricing errors</li>
                        <li>• Technical failures</li>
                        <li>• Insolvency risks</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Technology Providers</h4>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        Infrastructure and service providers:
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Service disruptions</li>
                        <li>• Data breaches</li>
                        <li>• Contract terminations</li>
                        <li>• Performance issues</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Blockchain Validators</h4>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        Network consensus participants:
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Validator failures</li>
                        <li>• Consensus attacks</li>
                        <li>• Network splits</li>
                        <li>• Slashing events</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Algorithmic Risks */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-2xl font-bold text-green-900">6. ALGORITHMIC RISKS</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Our platform uses automated algorithms for portfolio management. These systems may not 
                    perform as expected and could result in losses.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-semibold text-green-900 mb-3">Model Risk</h4>
                      <p className="text-green-800 leading-relaxed mb-4">
                        Investment algorithms are based on historical data and assumptions that may not hold:
                      </p>
                      <ul className="space-y-2 text-green-800">
                        <li>• Past performance doesn't predict future results</li>
                        <li>• Market conditions may change unexpectedly</li>
                        <li>• Model assumptions may be incorrect</li>
                        <li>• Overfitting to historical data</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-semibold text-green-900 mb-3">Execution Risk</h4>
                      <p className="text-green-800 leading-relaxed mb-4">
                        Automated systems may fail to execute trades as intended:
                      </p>
                      <ul className="space-y-2 text-green-800">
                        <li>• System downtime during critical moments</li>
                        <li>• Incorrect trade execution</li>
                        <li>• Delayed rebalancing</li>
                        <li>• Price slippage on large orders</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-semibold text-green-900 mb-3">Data Quality Risk</h4>
                      <p className="text-green-800 leading-relaxed mb-4">
                        Algorithms rely on accurate market data:
                      </p>
                      <ul className="space-y-2 text-green-800">
                        <li>• Incorrect price feeds</li>
                        <li>• Delayed market data</li>
                        <li>• Data provider failures</li>
                        <li>• Manipulation of data sources</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Mitigation */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-2xl font-bold text-blue-900">7. RISK MITIGATION MEASURES</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    While we cannot eliminate all risks, we implement various measures to help protect your investments:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Diversification</h4>
                      <ul className="space-y-2 text-blue-800">
                        <li>• Spread investments across multiple stocks</li>
                        <li>• Sector allocation limits</li>
                        <li>• Position size constraints</li>
                        <li>• Risk-adjusted portfolio weights</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Monitoring Systems</h4>
                      <ul className="space-y-2 text-blue-800">
                        <li>• Real-time risk monitoring</li>
                        <li>• Automated alerts and notifications</li>
                        <li>• Performance tracking</li>
                        <li>• Anomaly detection</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Security Measures</h4>
                      <ul className="space-y-2 text-blue-800">
                        <li>• Multi-signature security</li>
                        <li>• Regular security audits</li>
                        <li>• Encrypted data storage</li>
                        <li>• Access controls and monitoring</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Compliance</h4>
                      <ul className="space-y-2 text-blue-800">
                        <li>• Regulatory compliance monitoring</li>
                        <li>• Legal structure optimization</li>
                        <li>• Professional insurance coverage</li>
                        <li>• Regular compliance reviews</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2">Important Note</h4>
                        <p className="text-amber-800 leading-relaxed">
                          These risk mitigation measures cannot guarantee against losses. They are designed to 
                          reduce but not eliminate risk. You should only invest money you can afford to lose.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-gray-600" />
                  <CardTitle className="text-2xl font-bold">8. QUESTIONS AND SUPPORT</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions about these risks or need clarification on any aspect of our platform, 
                    please contact us:
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> support@solstock.ai</p>
                    <p><strong>Risk Management:</strong> risk@solstock.ai</p>
                    <p><strong>Address:</strong> SolStock AI, Risk Management Department, Switzerland</p>
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
            <AlertTriangle className="h-8 w-8 text-white" />
            <div>
              <div className="font-bold text-xl">SOLSTOCK AI</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">RISK DISCLOSURE</div>
            </div>
          </div>
          <p className="text-gray-400 mb-6">
            Invest responsibly. Understand the risks. Never invest more than you can afford to lose.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
            <Link href="/how-it-works" className="text-gray-400 hover:text-white">How It Works</Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 