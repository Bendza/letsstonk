'use client';

import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Wallet, LogOut, ChevronDown, RefreshCw } from 'lucide-react';

export function PrivyWalletButton() {
  const { 
    isAuthenticated, 
    loading, 
    walletInfo, 
    user, 
    login, 
    logout,
    connectWallet,
    ready 
  } = usePrivyAuth();

  const handleConnect = async () => {
    if (!isAuthenticated) {
      await login();
    } else if (!walletInfo?.connected) {
      await connectWallet();
    }
  };

  const handleDisconnect = async () => {
    await logout();
  };

  // Show loading state while Privy is initializing
  if (!ready || loading) {
    return (
      <Button variant="outline" disabled className="min-w-[120px]">
        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  // Show connect button if not authenticated
  if (!isAuthenticated) {
    return (
      <Button onClick={handleConnect} className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 sm:px-6">
        <Wallet className="h-4 w-4 mr-1 sm:mr-2" />
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="sm:hidden">Connect</span>
      </Button>
    );
  }

  // Show wallet info and dropdown if authenticated
  const walletAddress = walletInfo?.address || user?.id || '';
  const shortAddress = walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 'Connected';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[120px] justify-between">
          <div className="flex items-center">
            <Wallet className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{shortAddress}</span>
            <span className="sm:hidden">Wallet</span>
          </div>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2 text-sm">
          <div className="font-medium">Connected Wallet</div>
          <div className="text-xs text-muted-foreground font-mono">
            {walletAddress}
          </div>
        </div>
        
        {user?.email && (
          <div className="px-3 py-1 text-xs text-muted-foreground border-b">
            {user.email.address}
          </div>
        )}
        
        {!walletInfo?.connected && (
          <DropdownMenuItem onClick={connectWallet}>
            <Wallet className="h-4 w-4 mr-2" />
            Connect Solana Wallet
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={handleDisconnect}>
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}