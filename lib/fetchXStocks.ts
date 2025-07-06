import type { XStock } from "./types"
import { fetchXStocksAction, fetchPricesAction } from "./server-actions"

export class XStocksFetcher {
  private static instance: XStocksFetcher
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  static getInstance(): XStocksFetcher {
    if (!XStocksFetcher.instance) {
      XStocksFetcher.instance = new XStocksFetcher()
    }
    return XStocksFetcher.instance
  }

  async fetchXStocks(): Promise<XStock[]> {
    const cacheKey = "xstocks"
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data
    }

    try {
      // Use server action instead of direct API call
      const xStocks = await fetchXStocksAction()

      this.cache.set(cacheKey, {
        data: xStocks,
        timestamp: Date.now(),
      })

      return xStocks
    } catch (error) {
      console.error("Failed to fetch xStocks:", error)

      // Return cached data if available, even if stale
      if (cached) {
        return cached.data
      }

      // This should not happen since server action has fallback
      throw error
    }
  }

  async getXStockAddresses(): Promise<Record<string, string>> {
    const xStocks = await this.fetchXStocks()
    return xStocks.reduce(
      (acc, stock) => {
        acc[stock.symbol] = stock.address
        return acc
      },
      {} as Record<string, string>,
    )
  }

  async fetchPrices(tokenAddresses: string[]): Promise<Record<string, number>> {
    const cacheKey = `prices-${tokenAddresses.join(",")}`
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < 30000) {
      // 30s cache for prices
      return cached.data as Record<string, number>
    }

    try {
      // Use server action instead of direct API call
      const prices = await fetchPricesAction(tokenAddresses)

      this.cache.set(cacheKey, {
        data: prices,
        timestamp: Date.now(),
      })

      return prices
    } catch (error) {
      console.error("Failed to fetch prices:", error)

      // Return cached data if available
      if (cached) {
        return cached.data as Record<string, number>
      }

      throw error
    }
  }
}

export const xStocksFetcher = XStocksFetcher.getInstance()
