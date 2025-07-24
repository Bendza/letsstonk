import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { 
  Connection, 
  VersionedTransaction, 
  PublicKey,
  LAMPORTS_PER_SOL 
} from "@solana/web3.js";
import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getTradingRpcUrl } from "@/lib/rpc-config";

interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee?: any;
  priceImpactPct: string;
  routePlan: any[];
}

interface JupiterSwapParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps?: number;
}

export const useJupiterTrading = () => {
  // Use a dedicated RPC connection for trading to avoid rate limits
  const tradingConnection = new Connection(getTradingRpcUrl(), 'confirmed');
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check SOL balance for transaction fees
  const checkSolBalance = useCallback(async (): Promise<boolean> => {
    if (!publicKey) return false;
    
    try {
      const balance = await tradingConnection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      
      // Need at least 0.01 SOL for transaction fees
      if (solBalance < 0.01) {
        setError(`Insufficient SOL balance: ${solBalance.toFixed(4)} SOL. Need at least 0.01 SOL for transaction fees.`);
        return false;
      }
      
      return true;
    } catch (err) {
      setError('Failed to check SOL balance');
      return false;
    }
  }, [publicKey, tradingConnection]);

  // Get quote from Jupiter
  const getQuote = useCallback(async ({
    inputMint,
    outputMint,
    amount,
    slippageBps = 300 // Increased to 3% for better success rate
  }: JupiterSwapParams): Promise<QuoteResponse | null> => {
    try {
      const response = await fetch(
        `https://lite-api.jup.ag/swap/v1/quote?` +
        `inputMint=${inputMint}&` +
        `outputMint=${outputMint}&` +
        `amount=${amount}&` +
        `slippageBps=${slippageBps}&` +
        `onlyDirectRoutes=false&` +
        `asLegacyTransaction=false`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get quote: ${response.status} ${errorText}`);
      }
      
      const quote = await response.json();
      
      // Check if price impact is too high (> 10%)
      const priceImpact = parseFloat(quote.priceImpactPct || '0');
      if (priceImpact > 10) {
        throw new Error(`Price impact too high: ${priceImpact.toFixed(2)}%. Consider reducing trade size.`);
      }
      
      return quote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get quote');
      return null;
    }
  }, []);

  // Execute swap transaction
  const executeSwap = useCallback(async (
    quoteResponse: QuoteResponse,
    portfolioId?: string
  ): Promise<string | null> => {
    if (!connected || !publicKey) {
      setError('Wallet not connected');
      return null;
    }

    // Check SOL balance first
    const hasSufficientSol = await checkSolBalance();
    if (!hasSufficientSol) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Get swap transaction from Jupiter with better configuration
      const swapResponse = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: publicKey.toString(),
          wrapAndUnwrapSol: true,
          useSharedAccounts: true, // Better for ATA handling
          dynamicComputeUnitLimit: true,
          dynamicSlippage: { // Allow dynamic slippage adjustment
            maxBps: 1000 // Max 10% slippage as fallback
          },
          prioritizationFeeLamports: {
            priorityLevelWithMaxLamports: {
              maxLamports: 1000000, // Reduced from 10M to 1M lamports
              priorityLevel: "medium" // Changed from "high" to "medium"
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

      // Deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // Send transaction through wallet using trading connection with better settings
      const signature = await sendTransaction(transaction, tradingConnection, {
        skipPreflight: true, // Skip preflight to avoid simulation issues
        maxRetries: 5, // Increased retries
        preflightCommitment: 'processed' // Faster confirmation
      });

      console.log('Transaction sent:', signature);

      // Confirm transaction using trading connection with timeout
      const latestBlockHash = await tradingConnection.getLatestBlockhash();
      
      try {
        await tradingConnection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature
        }, 'confirmed');
        
        console.log('Transaction confirmed:', signature);
        
        // Log transaction to Supabase
        if (portfolioId) {
          await logTransaction({
            portfolioId,
            signature,
            inputMint: quoteResponse.inputMint,
            outputMint: quoteResponse.outputMint,
            inputAmount: quoteResponse.inAmount,
            outputAmount: quoteResponse.outAmount,
            type: 'buy'
          });
        }

        return signature;
      } catch (confirmError) {
        // Transaction might still succeed even if confirmation fails
        console.warn('Confirmation failed, but transaction may still succeed:', confirmError);
        
        // Check transaction status manually
        setTimeout(async () => {
          try {
            const status = await tradingConnection.getTransaction(signature, {
              commitment: 'confirmed',
              maxSupportedTransactionVersion: 0
            });
            
            if (status?.meta?.err) {
              console.error('Transaction failed:', status.meta.err);
            } else if (status) {
              console.log('Transaction succeeded after manual check');
              // Log successful transaction
              if (portfolioId) {
                await logTransaction({
                  portfolioId,
                  signature,
                  inputMint: quoteResponse.inputMint,
                  outputMint: quoteResponse.outputMint,
                  inputAmount: quoteResponse.inAmount,
                  outputAmount: quoteResponse.outAmount,
                  type: 'buy'
                });
              }
            }
          } catch (statusError) {
            console.error('Failed to check transaction status:', statusError);
          }
        }, 5000); // Check after 5 seconds
        
        return signature; // Return signature anyway, let user check manually
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Swap failed';
      console.error('Swap execution error:', err);
      
      // Provide more helpful error messages
      if (errorMessage.includes('0x1')) {
        setError('Insufficient funds in your wallet');
      } else if (errorMessage.includes('0x0')) {
        setError('Transaction succeeded but confirmation is pending. Check your wallet.');
      } else if (errorMessage.includes('Instruction #4 Failed')) {
        setError('Transaction failed during execution. This might be due to:\n• Insufficient SOL for fees\n• Token account issues\n• High slippage\n• Network congestion\n\nTry with a smaller amount or higher slippage tolerance.');
      } else {
        setError(errorMessage);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [connected, publicKey, sendTransaction, tradingConnection, checkSolBalance]);

  // Log transaction to Supabase
  const logTransaction = useCallback(async (params: {
    portfolioId: string;
    signature: string;
    inputMint: string;
    outputMint: string;
    inputAmount: string;
    outputAmount: string;
    type: 'buy' | 'sell';
  }) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          portfolio_id: params.portfolioId,
          wallet_address: publicKey?.toString() || null,
          transaction_signature: params.signature,
          transaction_type: params.type,
          input_token: params.inputMint,
          output_token: params.outputMint,
          input_amount: parseFloat(params.inputAmount),
          output_amount: parseFloat(params.outputAmount),
          status: 'confirmed'
        });

      if (error) {
        console.error('Failed to log transaction:', error);
      }
    } catch (err) {
      console.error('Error logging transaction:', err);
    }
  }, [publicKey]);

  // Buy xStock with USDC or SOL
  const buyXStock = useCallback(async (
    stockSymbol: string,
    amountIn: number, // amount expressed in chosen currency (USDC or SOL)
    portfolioId?: string,
    payWith: 'USDC' | 'SOL' = 'USDC'
  ) => {
    try {
      // Get stock metadata from Supabase
      const { data: stockData, error } = await supabase
        .from('xstocks_metadata')
        .select('solana_address, decimals')
        .eq('symbol', stockSymbol)
        .single();

      if (error || !stockData) {
        throw new Error(`Stock ${stockSymbol} not found`);
      }

      const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
      const SOL_MINT = 'So11111111111111111111111111111111111111112';

      // Determine input mint and decimals
      const inputMint = payWith === 'USDC' ? USDC_MINT : SOL_MINT;
      const decimals = payWith === 'USDC' ? 6 : 9; // lamports for SOL
      const amount = Math.floor(amountIn * Math.pow(10, decimals));

      const quote = await getQuote({
        inputMint,
        outputMint: stockData.solana_address,
        amount,
        slippageBps: 300 // 3% slippage for xStocks
      });

      if (!quote) {
        throw new Error('Failed to get quote');
      }

      return await executeSwap(quote, portfolioId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Buy failed');
      return null;
    }
  }, [getQuote, executeSwap]);

  // Sell xStock for USDC
  const sellXStock = useCallback(async (
    stockSymbol: string,
    stockAmount: number,
    portfolioId?: string
  ) => {
    try {
      // Get stock metadata from Supabase
      const { data: stockData, error } = await supabase
        .from('xstocks_metadata')
        .select('solana_address, decimals')
        .eq('symbol', stockSymbol)
        .single();

      if (error || !stockData) {
        throw new Error(`Stock ${stockSymbol} not found`);
      }

      const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
      const amount = Math.floor(stockAmount * Math.pow(10, stockData.decimals || 6));

      const quote = await getQuote({
        inputMint: stockData.solana_address,
        outputMint: USDC_MINT,
        amount,
        slippageBps: 300 // 3% slippage for xStocks
      });

      if (!quote) {
        throw new Error('Failed to get quote');
      }

      return await executeSwap(quote, portfolioId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sell failed');
      return null;
    }
  }, [getQuote, executeSwap]);

  return {
    getQuote,
    executeSwap,
    buyXStock,
    sellXStock,
    checkSolBalance,
    loading,
    error,
    connected,
    publicKey
  };
}; 