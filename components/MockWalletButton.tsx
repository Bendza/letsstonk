"use client"

import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import { useMockWallet } from "./MockWalletProvider"

export function MockWalletButton() {
  const { connected, connecting, publicKey, connect, disconnect } = useMockWallet()

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <div className="font-semibold uppercase tracking-wide">CONNECTED</div>
          <div className="text-gray-500 text-xs">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </div>
        </div>
        <Button onClick={disconnect} variant="outline" size="sm" className="btn-secondary bg-transparent">
          <LogOut className="h-4 w-4 mr-2" />
          DISCONNECT
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={connect} disabled={connecting} className="btn-primary">
      <Wallet className="h-4 w-4 mr-2" />
      {connecting ? "CONNECTING..." : "CONNECT WALLET"}
    </Button>
  )
}
