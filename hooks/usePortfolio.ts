import { useState, useEffect, useCallback } from 'react';
import { generateMockPortfolio, MockPortfolio } from '@/lib/frontend-data';
import { usePrivyAuth } from './usePrivyAuth';

interface Portfolio {
  id: string;
  user_id: string;
  wallet_address: string;
  risk_level: number;
  total_value: number;
  initial_investment: number;
  current_pnl: number;
  pnl_percentage: number;
  last_rebalanced: string;
  rebalance_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  positions: Position[];
}

interface Position {
  id: string;
  portfolio_id: string;
  symbol: string;
  token_address: string;
  amount: number;
  target_percentage: number;
  current_percentage: number;
  average_price: number;
  current_price: number;
  value: number;
  pnl: number;
  pnl_percentage: number;
  created_at: string;
  updated_at: string;
}

export function usePortfolio(walletAddress?: string | null) {
  const { user, isAuthenticated } = usePrivyAuth();
  const [portfolio, setPortfolio] = useState<MockPortfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    const address = walletAddress || user?.wallet?.address;
    
    if (!address || !isAuthenticated) {
      setPortfolio(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Generate mock portfolio based on wallet address
      const mockPortfolio = generateMockPortfolio(address, 5); // Default risk level 5
      
      setPortfolio(mockPortfolio);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate portfolio';
      setError(errorMessage);
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  }, [walletAddress, user?.wallet?.address, isAuthenticated]);

  const syncPortfolio = useCallback(async () => {
    if (!portfolio) return;

    try {
      setError(null);

      // Just refresh the mock data
      await fetchPortfolio();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync portfolio';
      setError(errorMessage);
      throw err;
    }
  }, [portfolio, fetchPortfolio]);

  // Fetch portfolio data when user changes
  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return {
    portfolio,
    loading,
    error,
    syncPortfolio,
    refetch: fetchPortfolio
  };
} 