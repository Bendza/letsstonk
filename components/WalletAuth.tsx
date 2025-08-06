import React from 'react'
import { useWalletAuth } from '@/hooks/useWalletAuth'
import { useWallets } from '@privy-io/react-auth'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export function WalletAuth() {
  const { 
    user, 
    portfolio,
    loading, 
    error, 
    isAuthenticated, 
    connected, 
    manualAuth, 
    signOut,
    walletAddress
  } = useWalletAuth()

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Authenticating with Supabase...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            Authentication Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-sm mb-4">{error}</div>
          {connected && (
            <Button 
              onClick={manualAuth}
              className="w-full"
              variant="destructive"
            >
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (!connected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            Connect Your Wallet
          </CardTitle>
          <CardDescription>
            Connect your Solana wallet to access SolStock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WalletMultiButton className="w-full" />
          <p className="text-sm text-gray-500 mt-2">
            Supported wallets: Phantom, Solflare, Torus, and more
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Wallet className="h-5 w-5 mr-2" />
            Sign In with Wallet
          </CardTitle>
          <CardDescription>
            Sign a message to authenticate with your wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-800">Connected Wallet</div>
            <div className="text-sm text-blue-600 font-mono">
              {walletAddress ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}` : 'Not connected'}
            </div>
          </div>
          <Button 
            onClick={manualAuth}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Sign In with Wallet
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500">
            This will prompt your wallet to sign a message for authentication
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800">
          <CheckCircle className="h-5 w-5 mr-2" />
          Authentication Successful
        </CardTitle>
        <CardDescription>
          Your wallet is connected and authenticated with SolStock
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">User Profile</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="default">Authenticated</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">User ID:</span>
                  <span className="text-sm font-mono">
                    {user?.id ? `${user.id.slice(0, 8)}...` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Wallet:</span>
                  <span className="text-sm font-mono">
                    {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Risk Tolerance:</span>
                  <span className="text-sm">{user?.risk_tolerance || 5}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Invested:</span>
                  <span className="text-sm">${user?.total_invested || 0}</span>
                </div>
              </div>
            </div>
          </div>
          
          {portfolio && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Portfolio</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Value:</span>
                    <span className="text-sm font-semibold">${portfolio.total_value || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">P&L:</span>
                    <span className={`text-sm font-semibold ${
                      (portfolio.current_pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${portfolio.current_pnl || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">P&L %:</span>
                    <span className={`text-sm font-semibold ${
                      (portfolio.pnl_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {portfolio.pnl_percentage || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Risk Level:</span>
                    <span className="text-sm">{portfolio.risk_level}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active:</span>
                    <Badge variant={portfolio.is_active ? "default" : "secondary"}>
                      {portfolio.is_active ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <Button 
            onClick={signOut}
            variant="outline"
            className="w-full md:w-auto"
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default WalletAuth 