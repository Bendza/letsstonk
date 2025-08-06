// Frontend-only xStocks integration - no Supabase required
import { XStock } from './types'
import { fetchXStocksFrontend, fetchPricesFrontend } from './frontend-data'

// Re-export for backward compatibility
export async function fetchXStocks(forceRefresh: boolean = false): Promise<XStock[]> {
  return await fetchXStocksFrontend()
}

// Re-export for backward compatibility
export async function fetchPrices(stockAddresses: string[]): Promise<Record<string, number>> {
  return await fetchPricesFrontend(stockAddresses)
}

// Deprecated - kept for backward compatibility but no longer updates database
export async function updateXStockMarketData(
  address: string, 
  marketCap: number, 
  dailyVolume: number
): Promise<void> {
  // No-op in frontend-only mode
  console.warn('updateXStockMarketData is deprecated in frontend-only mode')
}