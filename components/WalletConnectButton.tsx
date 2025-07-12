'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { Button } from '@/components/ui/button';
import { ClientOnly } from '@/components/ClientOnly';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, RefreshCw, Wallet, ChevronDown } from 'lucide-react';

export function WalletConnectButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const { isAuthenticated, loading, authInProgress, manualAuth, signOut } = useWalletAuth();

  const handleAuthenticate = async () => {
    if (!connected) {
      console.log('❌ Wallet not connected');
      return;
    }

    console.log('🔐 Manual authentication requested...');
    await manualAuth();
  };

  const handleSignOut = async () => {
    console.log('👋 Manual sign out requested...');
    await signOut();
  };

  const handleDisconnect = async () => {
    console.log('🔌 Disconnecting wallet...');
    await disconnect();
  };

  const walletAddress = publicKey?.toString() || '';
  const shortAddress = walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : '';

  return (
    <ClientOnly fallback={<div className="w-32 h-10 bg-gray-200 animate-pulse rounded"></div>}>
      {!connected ? (
        <WalletMultiButton />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">{shortAddress}</span>
              <span className="sm:hidden">Wallet</span>
              {(loading || authInProgress) && <RefreshCw className="h-3 w-3 animate-spin" />}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2 border-b">
              <div className="text-sm font-medium">Connected Wallet</div>
              <div className="text-xs text-gray-500 font-mono">{shortAddress}</div>
              <div className="text-xs text-gray-500 mt-1">
                {isAuthenticated ? (
                  <span className="text-green-600">✓ Authenticated</span>
                ) : (
                  <span className="text-amber-600">⚠ Not authenticated</span>
                )}
              </div>
            </div>
            
            {!isAuthenticated && (
              <DropdownMenuItem onClick={handleAuthenticate} disabled={loading || authInProgress}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {loading || authInProgress ? 'Authenticating...' : 'Authenticate'}
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={handleDisconnect}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Change Wallet
            </DropdownMenuItem>
            
            {isAuthenticated && (
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </ClientOnly>
  );
}

// Custom hook to use wallet context more easily
export function useWalletConnection() {
  const { connected, publicKey, wallet, connecting, disconnecting } = useWallet()
  
  return {
    connected,
    publicKey,
    wallet,
    connecting,
    disconnecting,
    walletAddress: publicKey?.toString() || null,
  }
} 