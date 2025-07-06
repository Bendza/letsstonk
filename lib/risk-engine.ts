import type { Allocation } from "./types"

// Risk allocation buckets - Conservative to Aggressive
export const riskBuckets: Record<number, Allocation[]> = {
  1: [
    // Ultra Conservative
    { symbol: "xTSLA", percentage: 20, address: "" },
    { symbol: "xAAPL", percentage: 30, address: "" },
    { symbol: "xMSFT", percentage: 25, address: "" },
    { symbol: "xGOOGL", percentage: 15, address: "" },
    { symbol: "xAMZN", percentage: 10, address: "" },
  ],
  2: [
    { symbol: "xTSLA", percentage: 25, address: "" },
    { symbol: "xAAPL", percentage: 25, address: "" },
    { symbol: "xMSFT", percentage: 20, address: "" },
    { symbol: "xGOOGL", percentage: 15, address: "" },
    { symbol: "xAMZN", percentage: 15, address: "" },
  ],
  3: [
    { symbol: "xTSLA", percentage: 30, address: "" },
    { symbol: "xAAPL", percentage: 20, address: "" },
    { symbol: "xMSFT", percentage: 20, address: "" },
    { symbol: "xGOOGL", percentage: 15, address: "" },
    { symbol: "xAMZN", percentage: 15, address: "" },
  ],
  4: [
    { symbol: "xTSLA", percentage: 35, address: "" },
    { symbol: "xAAPL", percentage: 20, address: "" },
    { symbol: "xMSFT", percentage: 15, address: "" },
    { symbol: "xGOOGL", percentage: 15, address: "" },
    { symbol: "xAMZN", percentage: 15, address: "" },
  ],
  5: [
    // Moderate
    { symbol: "xTSLA", percentage: 40, address: "" },
    { symbol: "xAAPL", percentage: 15, address: "" },
    { symbol: "xMSFT", percentage: 15, address: "" },
    { symbol: "xGOOGL", percentage: 15, address: "" },
    { symbol: "xAMZN", percentage: 15, address: "" },
  ],
  6: [
    { symbol: "xTSLA", percentage: 45, address: "" },
    { symbol: "xAAPL", percentage: 15, address: "" },
    { symbol: "xMSFT", percentage: 10, address: "" },
    { symbol: "xGOOGL", percentage: 15, address: "" },
    { symbol: "xAMZN", percentage: 15, address: "" },
  ],
  7: [
    { symbol: "xTSLA", percentage: 50, address: "" },
    { symbol: "xAAPL", percentage: 12, address: "" },
    { symbol: "xMSFT", percentage: 10, address: "" },
    { symbol: "xGOOGL", percentage: 13, address: "" },
    { symbol: "xAMZN", percentage: 15, address: "" },
  ],
  8: [
    { symbol: "xTSLA", percentage: 55, address: "" },
    { symbol: "xAAPL", percentage: 10, address: "" },
    { symbol: "xMSFT", percentage: 10, address: "" },
    { symbol: "xGOOGL", percentage: 12, address: "" },
    { symbol: "xAMZN", percentage: 13, address: "" },
  ],
  9: [
    { symbol: "xTSLA", percentage: 60, address: "" },
    { symbol: "xAAPL", percentage: 10, address: "" },
    { symbol: "xMSFT", percentage: 8, address: "" },
    { symbol: "xGOOGL", percentage: 12, address: "" },
    { symbol: "xAMZN", percentage: 10, address: "" },
  ],
  10: [
    // Ultra Aggressive
    { symbol: "xTSLA", percentage: 70, address: "" },
    { symbol: "xAAPL", percentage: 8, address: "" },
    { symbol: "xMSFT", percentage: 7, address: "" },
    { symbol: "xGOOGL", percentage: 8, address: "" },
    { symbol: "xAMZN", percentage: 7, address: "" },
  ],
}

export function getAllocationForRisk(riskLevel: number): Allocation[] {
  return riskBuckets[riskLevel] || riskBuckets[5] // Default to moderate
}

export function calculatePositionAmounts(
  totalAmount: number,
  riskLevel: number,
  xStocks: Record<string, string>,
): Array<{ symbol: string; address: string; amount: number }> {
  const allocation = getAllocationForRisk(riskLevel)

  return allocation.map((item) => ({
    symbol: item.symbol,
    address: xStocks[item.symbol] || "",
    amount: (totalAmount * item.percentage) / 100,
  }))
}
