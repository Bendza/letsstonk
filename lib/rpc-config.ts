// RPC Configuration for SolStock
// This helps avoid rate limiting by using different endpoints for different purposes
import { Connection } from '@solana/web3.js'

export const RPC_ENDPOINTS = {
  // Primary RPC for general use (wallet connection, etc.)
  PRIMARY: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  
  // Trading RPC for transaction execution (to avoid rate limits on primary)
  TRADING: process.env.NEXT_PUBLIC_TRADING_RPC_URL || 'https://api.mainnet-beta.solana.com',
  
  // Alternative free RPC endpoints that allow full blockchain access
  ALTERNATIVES: [
    'https://rpc.ankr.com/solana',
    'https://solana-api.projectserum.com',
    'https://api.mainnet-beta.solana.com', // Keep as last resort
    // Note: Removed Helius demo as it doesn't allow full blockchain access
    // Add your own RPC endpoints here
  ]
}

// Get the best available RPC endpoint for trading
export function getTradingRpcUrl(): string {
  // Priority order: custom trading RPC > primary RPC > alternatives
  const customRpc = RPC_ENDPOINTS.TRADING
  
  // If custom RPC is set and it's not the default rate-limited one, use it
  if (customRpc && customRpc !== 'https://api.mainnet-beta.solana.com') {
    return customRpc
  }
  
  // Try alternatives if no custom RPC or if it's the default rate-limited one
  // Rotate through alternatives to distribute load
  const alternatives = RPC_ENDPOINTS.ALTERNATIVES.filter(url => url !== 'https://api.mainnet-beta.solana.com')
  if (alternatives.length > 0) {
    // Use a simple rotation based on current time
    const index = Math.floor(Date.now() / (1000 * 60 * 5)) % alternatives.length // Change every 5 minutes
    return alternatives[index]
  }
  
  // Fallback to default (will likely get rate limited)
  return RPC_ENDPOINTS.PRIMARY || 'https://api.mainnet-beta.solana.com'
}

// Create a connection with automatic fallback to different RPC endpoints
export function createResilientConnection(commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed'): Connection {
  const primaryUrl = getTradingRpcUrl()
  return new Connection(primaryUrl, commitment)
}

// Retry mechanism for RPC calls with different endpoints
export async function executeWithRpcFallback<T>(
  operation: (connection: Connection) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  const endpoints = [getTradingRpcUrl(), ...RPC_ENDPOINTS.ALTERNATIVES]
  
  let lastError: Error | null = null
  
  for (let i = 0; i < Math.min(maxRetries, endpoints.length); i++) {
    try {
      const connection = new Connection(endpoints[i], 'confirmed')
      const result = await operation(connection)
      return result
    } catch (error) {
      lastError = error as Error
      
      // If it's a rate limit error (403), try the next endpoint immediately
      if (error instanceof Error && (error.message.includes('403') || error.message.includes('rate limit'))) {
        continue
      }
      
      // For other errors, still try the next endpoint but with a small delay
      if (i < endpoints.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }
  
  throw lastError || new Error('All RPC endpoints failed')
}

// Test if an RPC endpoint supports full blockchain access (needed for trading)
export async function testRpcEndpoint(rpcUrl: string): Promise<boolean> {
  try {
    const connection = new Connection(rpcUrl, 'confirmed')
    
    // Test basic RPC calls that are needed for trading
    const blockhash = await connection.getLatestBlockhash()
    const slot = await connection.getSlot()
    
    if (blockhash && slot > 0) {
      return true
    }
    
    return false
  } catch (error) {
    return false
  }
}

// Get a working RPC endpoint by testing them
export async function getWorkingRpcUrl(): Promise<string> {
  const endpoints = [getTradingRpcUrl(), ...RPC_ENDPOINTS.ALTERNATIVES]
  
  for (const endpoint of endpoints) {
    const isWorking = await testRpcEndpoint(endpoint)
    if (isWorking) {
      return endpoint
    }
  }
  
  // Fallback to default if all tests fail
  return 'https://api.mainnet-beta.solana.com'
}

// Configuration notes:
// 1. Set NEXT_PUBLIC_TRADING_RPC_URL in your .env.local for dedicated trading RPC
// 2. Consider using paid RPC providers like Helius, QuickNode, or Alchemy for production
// 3. Free RPCs have rate limits - paid RPCs provide better reliability
// 4. Jupiter provides the swap transaction, but you still need RPC to send/confirm it
// 5. For testing: Try different free RPC endpoints if one gets rate limited 