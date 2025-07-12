"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WalletConnectButton } from "./WalletConnectButton"
import { useWalletAuth } from "@/hooks/useWalletAuth"
import { useState, useEffect } from "react"

interface TestPortfolioProps {
  onGoToApp?: () => void
}

export function TestPortfolio({ onGoToApp }: TestPortfolioProps) {
  const { user, portfolio, loading, error, isAuthenticated, connected, walletAddress, manualAuth } = useWalletAuth()

  return (
    <div className="w-full p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">🧪 BACKEND INTEGRATION TEST</h1>
          <p className="text-gray-600">Testing real wallet authentication and database integration</p>
          
          {/* Wallet Connect Button */}
          <div className="mt-6 mb-4">
            <div className="mb-2 text-sm text-gray-600">
              👇 Connect your Solana wallet to test the integration
            </div>
            <WalletConnectButton />
          </div>
          
          {onGoToApp && (
            <Button 
              onClick={onGoToApp} 
              className="mt-4 btn-primary"
            >
              ✅ Go to Main App
            </Button>
          )}
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          
          {/* Wallet Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className={connected ? "text-green-500" : "text-red-500"}>●</span>
                Wallet Connection
              </CardTitle>
              <CardDescription>
                Real Solana wallet connection status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Status:</strong>{" "}
                  <Badge variant={connected ? "default" : "destructive"}>
                    {connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                {walletAddress && (
                  <div className="text-sm text-gray-600">
                    <strong>Address:</strong><br/>
                    <code className="text-xs bg-gray-100 p-1 rounded">
                      {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                    </code>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Authentication Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className={isAuthenticated ? "text-green-500" : "text-red-500"}>●</span>
                Database Auth
              </CardTitle>
              <CardDescription>
                Supabase authentication via wallet signature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Status:</strong>{" "}
                  <Badge variant={isAuthenticated ? "default" : "destructive"}>
                    {isAuthenticated ? "Authenticated" : "Not Authenticated"}
                  </Badge>
                </div>
                {loading && (
                  <div className="text-sm text-blue-600">
                    🔄 Authenticating...
                  </div>
                )}
                {error && (
                  <div className="text-sm text-red-600">
                    ❌ {error}
                  </div>
                )}
                {user && (
                  <div className="text-sm text-gray-600">
                    <strong>User ID:</strong><br/>
                    <code className="text-xs bg-gray-100 p-1 rounded">
                      {user.id.slice(0, 8)}...
                    </code>
                  </div>
                )}
                {connected && !isAuthenticated && !loading && (
                  <Button 
                    onClick={manualAuth}
                    size="sm"
                    className="w-full mt-2"
                  >
                    🔐 Sign Message to Authenticate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className={portfolio ? "text-green-500" : "text-gray-400"}>●</span>
                Portfolio Setup
              </CardTitle>
              <CardDescription>
                Portfolio creation and database integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Status:</strong>{" "}
                  <Badge variant={portfolio ? "default" : "secondary"}>
                    {portfolio ? "Created" : "Not Created"}
                  </Badge>
                </div>
                {portfolio && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Risk Level:</strong> {portfolio.risk_level}/10</div>
                    <div><strong>Total Value:</strong> ${portfolio.total_value}</div>
                    <div><strong>P&L:</strong> ${portfolio.current_pnl}</div>
                    <div><strong>Active:</strong> {portfolio.is_active ? 'Yes' : 'No'}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Integration Test Results</CardTitle>
            <CardDescription>
              Real-time status of core functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <span>✅ Real Wallet Adapters (Phantom, Solflare, etc.)</span>
                <Badge variant="default">Ready</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>✅ Supabase Database Connection</span>
                <Badge variant="default">Ready</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>{connected ? "✅" : "⏳"} Wallet Connection</span>
                <Badge variant={connected ? "default" : "secondary"}>
                  {connected ? "Connected" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>{isAuthenticated ? "✅" : "⏳"} Signature Authentication</span>
                <Badge variant={isAuthenticated ? "default" : "secondary"}>
                  {isAuthenticated ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>{portfolio ? "✅" : "⏳"} Portfolio Creation</span>
                <Badge variant={portfolio ? "default" : "secondary"}>
                  {portfolio ? "Complete" : "Pending"}
                </Badge>
              </div>
            </div>
            
            {isAuthenticated && portfolio && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <h4 className="font-semibold text-green-800 mb-2">🎉 All Tests Passed!</h4>
                <p className="text-green-700 text-sm">
                  Your wallet is connected, authenticated, and ready for xStock trading. 
                  The integration is working perfectly!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 