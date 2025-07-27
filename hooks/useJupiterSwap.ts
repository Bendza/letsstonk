import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { createJupiterApiClient } from '@jup-ag/api';
import { getTradingRpcUrl } from '@/lib/rpc-config';
import { getAllocationForRisk } from '@/lib/risk-engine';
import { fetchXStocks, fetchPrices } from '@/lib/fetchXStocks';

// Real xStocks token mint addresses from Backed Finance
const XSTOCK_MINTS = {
  'AAPLx': 'XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp', // Apple xStock
  'WMTx': 'Xs151QeqTCiuKtinzfRATnUESM2xTU6V9Wy8Vy538ci', // Walmart xStock
  'GOOGLx': 'XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN', // Alphabet xStock
  'AMZNx': 'Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg', // Amazon xStock
  'TSLAx': 'XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB', // Tesla xStock
  'Vx': 'XsqgsbXwWogGJsNcVZ3TyVouy2MbTkfCFhCGGGcQZ2p', // Visa xStock
  'UNHx': 'XszvaiXGPwvk2nwb3o9C1CX4K6zH8sez11E6uyup6fe', // UnitedHealth xStock
  'PGx': 'XsYdjDjNUygZ7yGKfQaB6TxLh2gC6RRjzLtLAGJrhzV', // Procter & Gamble xStock
  // Legacy mappings for backward compatibility
  'AAPL': 'XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp',
  'MSFT': 'XsqgsbXwWogGJsNcVZ3TyVouy2MbTkfCFhCGGGcQZ2p',
  'GOOGL': 'XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN',
  'AMZN': 'Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg',
  'TSLA': 'XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB',
  'V': 'XsqgsbXwWogGJsNcVZ3TyVouy2MbTkfCFhCGGGcQZ2p',
};

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC mint address

interface SwapQuote {
  inputAmount: number;
  outputAmount: number;
  priceImpact: number;
  route: any;
}

interface PortfolioAllocation {
  symbol: string;
  allocation: number;
  usdcAmount: number;
  estimatedTokens: number;
  currentPrice?: number;
}

interface SwapResult {
  success: boolean;
  signature?: string;
  error?: string;
}

export function useJupiterSwap() {
  const { publicKey, signTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the proper RPC configuration for trading
  const connection = new Connection(getTradingRpcUrl(), 'confirmed');
  const jupiterApi = createJupiterApiClient();

  // Get quote for a single token swap
  const getSwapQuote = useCallback(async (
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50 // 0.5% slippage
  ): Promise<SwapQuote | null> => {
    try {
      const quote = await jupiterApi.quoteGet({
        inputMint,
        outputMint,
        amount,
        slippageBps,
      });

      if (!quote) return null;

      return {
        inputAmount: parseInt(quote.inAmount),
        outputAmount: parseInt(quote.outAmount),
        priceImpact: parseFloat(quote.priceImpactPct || '0'),
        route: quote,
      };
    } catch (error) {
      console.error('Error getting swap quote:', error);
      return null;
    }
  }, [jupiterApi]);

  // Calculate portfolio allocation based on risk level
  const calculatePortfolioAllocation = useCallback((
    riskLevel: number,
    totalUsdcAmount: number
  ): PortfolioAllocation[] => {
    // Risk-based allocation logic
    const allocations = getRiskBasedAllocations(riskLevel);
    
    return allocations.map(allocation => ({
      symbol: allocation.symbol,
      allocation: allocation.percentage,
      usdcAmount: (totalUsdcAmount * allocation.percentage) / 100,
      estimatedTokens: 0, // Will be calculated with quotes
    }));
  }, []);

  // Calculate portfolio allocation with current PRICES for preview (not swap quotes)
  const calculatePortfolioAllocationWithPrices = useCallback(async (
    riskLevel: number,
    totalUsdcAmount: number
  ): Promise<PortfolioAllocation[]> => {
    try {
      console.log(`[PREVIEW] Calculating allocation for risk level ${riskLevel}, amount ${totalUsdcAmount}`);
      
      // Get risk-based allocation from risk engine
      const riskAllocations = getAllocationForRisk(riskLevel);
      
      // Fetch xStocks data and prices (same as Markets.tsx)
      const xStocks = await fetchXStocks();
      const addresses = xStocks.map(stock => stock.address);
      const prices = await fetchPrices(addresses);
      
      // Create a map for easy lookup
      const stockMap = new Map(xStocks.map(stock => [stock.symbol, stock]));
      
      const portfolioAllocations: PortfolioAllocation[] = riskAllocations.map(allocation => {
        // Convert xTSLA -> TSLAx format for lookup
        const lookupSymbol = allocation.symbol.replace('x', '') + 'x';
        const stock = stockMap.get(lookupSymbol);
        
        const usdcAmount = (totalUsdcAmount * allocation.percentage) / 100;
        const currentPrice = stock ? prices[stock.address] || 0 : 0;
        const estimatedTokens = currentPrice > 0 ? usdcAmount / currentPrice : 0;
        
        console.log(`[PREVIEW] ${allocation.symbol} -> ${lookupSymbol}: $${currentPrice}, ${estimatedTokens} tokens`);
        
        return {
          symbol: lookupSymbol, // Use the correct format (TSLAx, AAPLx, etc.)
          allocation: allocation.percentage,
          usdcAmount,
          estimatedTokens,
          currentPrice,
        };
      });
      
      console.log(`[PREVIEW] Portfolio allocation calculated with ${portfolioAllocations.length} positions`);
      return portfolioAllocations;
      
    } catch (error) {
      console.error('[PREVIEW] Error calculating portfolio allocation:', error);
      
      // Return basic allocation without prices on error
      const riskAllocations = getAllocationForRisk(riskLevel);
      return riskAllocations.map(allocation => ({
        symbol: allocation.symbol.replace('x', '') + 'x',
        allocation: allocation.percentage,
        usdcAmount: (totalUsdcAmount * allocation.percentage) / 100,
        estimatedTokens: 0,
        currentPrice: 0,
      }));
    }
  }, []);

  // Get quotes for entire portfolio
  const getPortfolioQuotes = useCallback(async (
    portfolioAllocation: PortfolioAllocation[]
  ): Promise<PortfolioAllocation[]> => {
    const quotedAllocations = await Promise.all(
      portfolioAllocation.map(async (allocation) => {
        const tokenMint = XSTOCK_MINTS[allocation.symbol as keyof typeof XSTOCK_MINTS];
        if (!tokenMint) return allocation;

        const quote = await getSwapQuote(
          USDC_MINT,
          tokenMint,
          Math.floor(allocation.usdcAmount * 1_000_000) // Convert to USDC decimals
        );

        return {
          ...allocation,
          estimatedTokens: quote ? quote.outputAmount : 0,
        };
      })
    );

    return quotedAllocations;
  }, [getSwapQuote]);

  // Execute a single swap
  const executeSwap = useCallback(async (
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50
  ): Promise<SwapResult> => {
    if (!publicKey || !signTransaction) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get quote
      const quote = await jupiterApi.quoteGet({
        inputMint,
        outputMint,
        amount,
        slippageBps,
      });

      if (!quote) {
        throw new Error('Unable to get quote');
      }

      // Get swap transaction
      const swapResponse = await jupiterApi.swapPost({
        swapRequest: {
          quoteResponse: quote,
          userPublicKey: publicKey.toBase58(),
          wrapAndUnwrapSol: true,
        },
      });

      if (!swapResponse.swapTransaction) {
        throw new Error('Unable to create swap transaction');
      }

      // Deserialize and sign transaction
      const swapTransactionBuf = Buffer.from(swapResponse.swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      
      const signedTransaction = await signTransaction(transaction);

      // Send transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: true,
        maxRetries: 2,
      });

      // Confirm transaction
      await connection.confirmTransaction(signature, 'confirmed');

      return { success: true, signature };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, signTransaction, connection, jupiterApi]);

  // Mock portfolio creation for testing (since xStocks might not be available on Jupiter)
  const createMockPortfolio = useCallback(async (
    portfolioAllocation: PortfolioAllocation[]
  ): Promise<{ success: boolean; results: SwapResult[]; error?: string }> => {
    if (!publicKey || !signTransaction) {
      return { success: false, results: [], error: 'Wallet not connected' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate portfolio creation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Filter out zero allocations
      const validAllocations = portfolioAllocation.filter(allocation => 
        allocation.usdcAmount > 0
      );

      if (validAllocations.length === 0) {
        return { success: false, results: [], error: 'No valid allocations found' };
      }

      // Simulate successful portfolio creation
      const results: SwapResult[] = validAllocations.map(allocation => ({
        success: true,
        signature: 'mock-tx-' + Math.random().toString(36).substr(2, 9),
      }));



      return { success: true, results };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, results: [], error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, signTransaction]);

  // Execute portfolio creation (single batch transaction)
  const createPortfolio = useCallback(async (
    portfolioAllocation: PortfolioAllocation[]
  ): Promise<{ success: boolean; results: SwapResult[]; error?: string }> => {
    if (!publicKey || !signTransaction) {
      return { success: false, results: [], error: 'Wallet not connected' };
    }

    console.log('[PORTFOLIO] Starting real portfolio creation with Jupiter...');
    setIsLoading(true);
    setError(null);

    try {
      // Filter out zero allocations and get valid tokens
      const validAllocations = portfolioAllocation.filter(allocation => {
        const tokenMint = XSTOCK_MINTS[allocation.symbol as keyof typeof XSTOCK_MINTS];
        const hasValidAmount = allocation.usdcAmount > 0;
        console.log(`[PORTFOLIO] ${allocation.symbol}: $${allocation.usdcAmount}, mint: ${tokenMint}, valid: ${hasValidAmount && !!tokenMint}`);
        return hasValidAmount && tokenMint;
      });

      if (validAllocations.length === 0) {
        return { success: false, results: [], error: 'No valid allocations found. Ensure tokens have valid mint addresses.' };
      }

      console.log(`[PORTFOLIO] Executing ${validAllocations.length} real Jupiter swaps...`);
      
      // Execute individual swaps for each allocation using direct Jupiter API (like TradingModal)
      const results: SwapResult[] = [];
      let successCount = 0;
      
      for (const allocation of validAllocations) {
        try {
          const tokenMint = XSTOCK_MINTS[allocation.symbol as keyof typeof XSTOCK_MINTS];
          const usdcAmount = Math.floor(allocation.usdcAmount * 1_000_000); // Convert to USDC decimals
          
          console.log(`[PORTFOLIO] Swapping ${allocation.usdcAmount} USDC -> ${allocation.symbol} (${tokenMint})`);
          
          // Step 1: Get quote using direct API call (like TradingModal)
          const quoteResponse = await fetch(
            `https://lite-api.jup.ag/swap/v1/quote?` +
            `inputMint=${USDC_MINT}&` +
            `outputMint=${tokenMint}&` +
            `amount=${usdcAmount}&` +
            `slippageBps=300&` + // 3% slippage like TradingModal
            `onlyDirectRoutes=false&` +
            `asLegacyTransaction=false`
          );
          
          if (!quoteResponse.ok) {
            throw new Error(`Failed to get quote: ${quoteResponse.status}`);
          }
          
          const quote = await quoteResponse.json();
          
          // Step 2: Get swap transaction using direct API call (like TradingModal)
          const swapResponse = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              quoteResponse: quote,
              userPublicKey: publicKey.toString(),
              wrapAndUnwrapSol: true,
              useSharedAccounts: true, // Better for ATA handling
              dynamicComputeUnitLimit: true,
              dynamicSlippage: { // Allow dynamic slippage adjustment
                maxBps: 1000 // Max 10% slippage as fallback
              },
              prioritizationFeeLamports: {
                priorityLevelWithMaxLamports: {
                  maxLamports: 1000000, // Same as TradingModal
                  priorityLevel: "medium"
                }
              }
            })
          });

          if (!swapResponse.ok) {
            const errorText = await swapResponse.text();
            throw new Error(`Failed to get swap transaction: ${swapResponse.status} ${errorText}`);
          }

          const { swapTransaction } = await swapResponse.json();

          if (!swapTransaction) {
            throw new Error('No swap transaction received from Jupiter');
          }

          // Step 3: Execute transaction (same as TradingModal)
          const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
          const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
          
          const signedTransaction = await signTransaction(transaction);

          // Send with same settings as TradingModal
          const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
            skipPreflight: true, // Skip preflight to avoid simulation issues!
            maxRetries: 5,
            preflightCommitment: 'processed'
          });

          // Confirm transaction
          const latestBlockHash = await connection.getLatestBlockhash();
          await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature
          }, 'confirmed');

          results.push({ success: true, signature });
          successCount++;
          console.log(`[PORTFOLIO] ✅ ${allocation.symbol} swap successful: ${signature}`);
          
          // Add small delay between swaps to avoid rate limiting
          if (allocation !== validAllocations[validAllocations.length - 1]) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
        } catch (error) {
          console.error(`[PORTFOLIO] Error swapping ${allocation.symbol}:`, error);
          results.push({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown swap error' 
          });
        }
      }

      const allSuccessful = successCount === validAllocations.length;
      const partialSuccess = successCount > 0 && successCount < validAllocations.length;
      
      if (allSuccessful) {
        console.log(`[PORTFOLIO] ✅ Portfolio creation complete! ${successCount}/${validAllocations.length} swaps successful`);
        return { success: true, results };
      } else if (partialSuccess) {
        console.warn(`[PORTFOLIO] ⚠️ Partial success: ${successCount}/${validAllocations.length} swaps completed`);
        return { 
          success: false, 
          results, 
          error: `Partial portfolio creation: ${successCount}/${validAllocations.length} swaps successful. Some positions may be missing.` 
        };
      } else {
        console.error(`[PORTFOLIO] ❌ Portfolio creation failed: No swaps were successful`);
        return { 
          success: false, 
          results, 
          error: 'Portfolio creation failed: All swaps failed. Check token availability and wallet balance.' 
        };
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown portfolio creation error';
      console.error('[PORTFOLIO] Portfolio creation error:', error);
      setError(errorMessage);
      return { success: false, results: [], error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, signTransaction, connection]);

  // Test function to verify xStock tokens are available
  const testXStockAvailability = useCallback(async () => {
    if (!publicKey) return;

    try {
      const jupiterApiClient = createJupiterApiClient();
      
      // Test a small quote for each xStock token
      const testResults = [];
      
      for (const [symbol, mintAddress] of Object.entries(XSTOCK_MINTS)) {
        try {
          const quote = await jupiterApiClient.quoteGet({
            inputMint: USDC_MINT,
            outputMint: mintAddress,
            amount: 1000000, // 1 USDC
            slippageBps: 50,
          });
          
          testResults.push({
            symbol,
            mintAddress,
            available: true,
            outputAmount: quote.outAmount,
            priceImpact: quote.priceImpactPct
          });
        } catch (err) {
          console.warn(`❌ ${symbol} not available on Jupiter:`, err);
          testResults.push({
            symbol,
            mintAddress,
            available: false,
            error: err instanceof Error ? err.message : 'Unknown error'
          });
        }
      }
      
      return testResults;
    } catch (err) {
      console.error('❌ Error testing xStock availability:', err);
      return [];
    }
  }, [publicKey]);

  return {
    getSwapQuote,
    calculatePortfolioAllocation,
    calculatePortfolioAllocationWithPrices,
    getPortfolioQuotes,
    executeSwap,
    createPortfolio,
    createMockPortfolio,
    testXStockAvailability,
    isLoading,
    error,
  };
}

// Risk-based allocation strategies
function getRiskBasedAllocations(riskLevel: number): Array<{ symbol: string; percentage: number }> {
  const allocationsMap: Record<number, Array<{ symbol: string; percentage: number }>> = {
    1: [
      { symbol: 'AAPL', percentage: 20 },
      { symbol: 'MSFT', percentage: 20 },
      { symbol: 'JPM', percentage: 15 },
      { symbol: 'V', percentage: 15 },
      { symbol: 'BRK.B', percentage: 30 },
    ],
    2: [
      { symbol: 'AAPL', percentage: 25 },
      { symbol: 'MSFT', percentage: 25 },
      { symbol: 'GOOGL', percentage: 15 },
      { symbol: 'JPM', percentage: 15 },
      { symbol: 'V', percentage: 20 },
    ],
    3: [
      { symbol: 'AAPL', percentage: 25 },
      { symbol: 'MSFT', percentage: 20 },
      { symbol: 'GOOGL', percentage: 20 },
      { symbol: 'AMZN', percentage: 15 },
      { symbol: 'V', percentage: 20 },
    ],
    4: [
      { symbol: 'AAPL', percentage: 20 },
      { symbol: 'MSFT', percentage: 20 },
      { symbol: 'GOOGL', percentage: 20 },
      { symbol: 'AMZN', percentage: 20 },
      { symbol: 'TSLA', percentage: 20 },
    ],
    5: [
      { symbol: 'AAPL', percentage: 18 },
      { symbol: 'MSFT', percentage: 18 },
      { symbol: 'GOOGL', percentage: 18 },
      { symbol: 'AMZN', percentage: 18 },
      { symbol: 'TSLA', percentage: 28 },
    ],
    6: [
      { symbol: 'AAPL', percentage: 15 },
      { symbol: 'MSFT', percentage: 15 },
      { symbol: 'GOOGL', percentage: 20 },
      { symbol: 'AMZN', percentage: 20 },
      { symbol: 'TSLA', percentage: 30 },
    ],
    7: [
      { symbol: 'AAPL', percentage: 15 },
      { symbol: 'GOOGL', percentage: 20 },
      { symbol: 'AMZN', percentage: 20 },
      { symbol: 'TSLA', percentage: 25 },
      { symbol: 'NVDA', percentage: 20 },
    ],
    8: [
      { symbol: 'GOOGL', percentage: 20 },
      { symbol: 'AMZN', percentage: 20 },
      { symbol: 'TSLA', percentage: 30 },
      { symbol: 'NVDA', percentage: 25 },
      { symbol: 'META', percentage: 5 },
    ],
    9: [
      { symbol: 'AMZN', percentage: 15 },
      { symbol: 'TSLA', percentage: 35 },
      { symbol: 'NVDA', percentage: 30 },
      { symbol: 'META', percentage: 20 },
    ],
    10: [
      { symbol: 'TSLA', percentage: 40 },
      { symbol: 'NVDA', percentage: 35 },
      { symbol: 'META', percentage: 25 },
    ],
  };

  return allocationsMap[riskLevel] || allocationsMap[5];
} 