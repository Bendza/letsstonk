import { Connection, PublicKey } from '@solana/web3.js'

// Note: RPC calls have been disabled to avoid 403 rate limiting errors
// All token statistics are now generated as mock data

export interface TokenStats {
  supply: number
  price: number
  marketCap: number
  decimals: number
  mintAuthority: string | null
  freezeAuthority: string | null
}

export interface VolumeData {
  volume24h: number
  volumeChange24h: number
}

/**
 * Generate mock token statistics to avoid RPC rate limiting
 * This provides realistic-looking data for development/demo purposes
 */
export function getMockTokenStats(mintAddress: string): TokenStats {
  // Use mint address to generate consistent mock data
  const hash = mintAddress.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = (seed: number) => (seed * 9301 + 49297) % 233280 / 233280
  
  // Generate consistent values based on address hash
  const supply = 50000000 + (random(hash) * 100000000) // 50M - 150M tokens
  const price = 100 + (random(hash + 1) * 500) // $100 - $600 per token
  const marketCap = supply * price
  
  return {
    supply,
    price,
    marketCap,
    decimals: 6,
    mintAuthority: null,
    freezeAuthority: null,
  }
}

/**
 * Generate mock volume data
 */
export function getMockVolumeData(mintAddress: string = 'default'): VolumeData {
  // Handle undefined or empty mintAddress
  if (!mintAddress || typeof mintAddress !== 'string') {
    mintAddress = 'default'
  }
  
  const hash = mintAddress.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = (seed: number) => (seed * 9301 + 49297) % 233280 / 233280
  
  const volume24h = 1000000 + (random(hash) * 10000000) // 1M - 11M volume
  const volumeChange24h = -50 + (random(hash + 1) * 100) // -50% to +50% change
  
  return {
    volume24h,
    volumeChange24h,
  }
}

/**
 * Get token statistics - now returns mock data only to avoid RPC 403 errors
 */
export async function getTokenStats(mintAddress: string): Promise<TokenStats | null> {
  console.log(`🔄 Using mock token stats for ${mintAddress} (RPC disabled to avoid 403 errors)`)
  return getMockTokenStats(mintAddress)
}

/**
 * Get multiple token statistics - now returns mock data only
 */
export async function getMultipleTokenStats(mintAddresses: string[]): Promise<Record<string, TokenStats | null>> {
  console.log(`🔄 Using mock token stats for ${mintAddresses.length} tokens (RPC disabled to avoid 403 errors)`)
  
  const stats: Record<string, TokenStats | null> = {}
  
  mintAddresses.forEach(address => {
    stats[address] = getMockTokenStats(address)
  })
  
  return stats
}

/**
 * Get Solscan link for a token
 */
export function getSolscanLink(tokenAddress: string): string {
  return `https://solscan.io/token/${tokenAddress}`
}

/**
 * Format large numbers (e.g., 1,234,567 -> "1.23M")
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B'
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M'
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K'
  } else {
    return num.toFixed(2)
  }
}

/**
 * Format currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
} 