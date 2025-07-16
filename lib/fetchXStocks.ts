import { supabase } from '@/lib/supabase'
import { XStock } from './types'

// Fallback prices (used if Jupiter API fails)
const FALLBACK_PRICES: Record<string, number> = {
  "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp": 228.5,  // AAPLx
  "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB": 405.2,  // TSLAx
  "XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN": 178.3,  // GOOGLx
  "Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg": 185.4,  // AMZNx
  "XsYdjDjNUygZ7yGKfQaB6TxLh2gC6RRjzLtLAGJrhzV": 165.25, // PGx
  "XszvaiXGPwvk2nwb3o9C1CX4K6zH8sez11E6uyup6fe": 560.1,  // UNHx
  "XsqgsbXwWogGJsNcVZ3TyVouy2MbTkfCFhCGGGcQZ2p": 292.85, // Vx
  "Xs151QeqTCiuKtinzfRATnUESM2xTU6V9Wy8Vy538ci": 95.75   // WMTx
};

export async function fetchXStocks(forceRefresh: boolean = false): Promise<XStock[]> {
  console.log('🔄 Fetching xStocks from database...')

  try {
    const { data, error } = await supabase
      .from('xstocks_metadata')
      .select('*')
      .eq('is_active', true)
      .order('symbol')

    if (error) {
      console.error('❌ Error fetching xStocks:', error)
      throw new Error(`Failed to fetch xStocks: ${error.message}`)
    }

    if (!data || data.length === 0) {
      console.log('📊 No xStocks found in database')
      return []
    }

    // Transform database records to match XStock interface
    const xStocks: XStock[] = data.map(record => ({
      symbol: record.symbol,
      address: record.solana_address, // Map solana_address to address
      name: record.name,
      decimals: record.decimals || 6,
      tags: record.tags || [],
      logoURI: record.logo_uri || undefined,
      daily_volume: record.daily_volume || undefined,
      market_cap: record.market_cap || undefined,
    }))

    console.log(`✅ Fetched ${xStocks.length} xStocks from database`)
    return xStocks
  } catch (error) {
    console.error('❌ Error in fetchXStocks:', error)
    throw error
  }
}

export async function fetchPrices(stockAddresses: string[]): Promise<Record<string, number>> {
  console.log('💰 Fetching live prices for', stockAddresses.length, 'stocks...')
  
  try {
    // Try to fetch live prices from Jupiter API
    const idsParam = stockAddresses.join(',')
    const response = await fetch(`https://lite-api.jup.ag/price/v2?ids=${idsParam}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SolanaRoboAdvisor/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Jupiter API error: ${response.status}`)
    }

    const data = await response.json()
    const livePrices: Record<string, number> = {}

    // Extract prices from Jupiter API response
    if (data.data) {
      for (const [address, priceData] of Object.entries(data.data)) {
        if (priceData && typeof priceData === 'object' && 'price' in priceData) {
          livePrices[address] = parseFloat((priceData as any).price)
        }
      }
    }

    console.log(`✅ Fetched live prices for ${Object.keys(livePrices).length} stocks from Jupiter API`)
    return livePrices

  } catch (error) {
    console.warn('⚠️ Jupiter API failed, using fallback prices:', error)
    
    // Fallback to hardcoded prices
    const fallbackPrices: Record<string, number> = {}
    stockAddresses.forEach(address => {
      if (FALLBACK_PRICES[address]) {
        fallbackPrices[address] = FALLBACK_PRICES[address]
      }
    })

    console.log(`✅ Using fallback prices for ${Object.keys(fallbackPrices).length} stocks`)
    return fallbackPrices
  }
}
