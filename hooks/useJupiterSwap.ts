import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { createJupiterApiClient } from '@jup-ag/api';

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
  allocation: number; // percentage
  usdcAmount: number;
  estimatedTokens: number;
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

  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://mainnet.helius-rpc.com/?api-key=demo');
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

      console.log('🎉 Mock portfolio created successfully:', {
        allocations: validAllocations,
        totalInvestment: validAllocations.reduce((sum, a) => sum + a.usdcAmount, 0),
        results
      });

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
    // For now, use mock portfolio creation since xStocks might not be available
    console.log('🔄 Using mock portfolio creation for testing...');
    return createMockPortfolio(portfolioAllocation);
    
    // Uncomment below for real Jupiter integration when tokens are available
    /*
    if (!publicKey || !signTransaction) {
      return { success: false, results: [], error: 'Wallet not connected' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Filter out zero allocations and get valid tokens
      const validAllocations = portfolioAllocation.filter(allocation => {
        const tokenMint = XSTOCK_MINTS[allocation.symbol as keyof typeof XSTOCK_MINTS];
        return allocation.usdcAmount > 0 && tokenMint;
      });

      if (validAllocations.length === 0) {
        return { success: false, results: [], error: 'No valid allocations found' };
      }

      // Create a single batch swap transaction
      const jupiterApiClient = createJupiterApiClient();
      
      // Get quotes for all swaps
      const quotes = await Promise.all(
        validAllocations.map(async (allocation) => {
          const tokenMint = XSTOCK_MINTS[allocation.symbol as keyof typeof XSTOCK_MINTS];
          const quote = await jupiterApiClient.quoteGet({
            inputMint: USDC_MINT,
            outputMint: tokenMint,
            amount: Math.floor(allocation.usdcAmount * 1_000_000), // Convert to USDC decimals
            slippageBps: 100, // 1% slippage tolerance
          });
          return { allocation, quote };
        })
      );

      // For now, execute the largest allocation first as a single swap
      // In a real implementation, you'd want to use Jupiter's batch swap API
      const largestAllocation = validAllocations.reduce((prev, current) => 
        prev.usdcAmount > current.usdcAmount ? prev : current
      );

      const tokenMint = XSTOCK_MINTS[largestAllocation.symbol as keyof typeof XSTOCK_MINTS];
      const result = await executeSwap(
        USDC_MINT,
        tokenMint,
        Math.floor(largestAllocation.usdcAmount * 1_000_000)
      );

      if (result.success) {
        // For demo purposes, simulate success for other allocations
        const results = validAllocations.map(allocation => ({
          success: allocation === largestAllocation ? true : true, // Simulate success
          signature: allocation === largestAllocation ? result.signature : 'simulated-tx-' + Math.random().toString(36).substr(2, 9)
        }));

        return { success: true, results };
      } else {
        return { success: false, results: [result], error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, results: [], error: errorMessage };
    } finally {
      setIsLoading(false);
    }
    */
  }, [publicKey, signTransaction, createMockPortfolio]);

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
      
      console.log('🔍 xStock Availability Test Results:', testResults);
      return testResults;
    } catch (err) {
      console.error('❌ Error testing xStock availability:', err);
      return [];
    }
  }, [publicKey]);

  return {
    getSwapQuote,
    calculatePortfolioAllocation,
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