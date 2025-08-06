'use client';

// Replaced with Privy authentication - this component now uses PrivyWalletButton
import { PrivyWalletButton } from './PrivyWalletButton';

export function WalletConnectButton() {
  // This component now just renders the Privy wallet button for backward compatibility
  return <PrivyWalletButton />;
}