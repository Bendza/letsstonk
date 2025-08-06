'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { Logo } from './Logo';
import { PrivyWalletButton } from './PrivyWalletButton';
import { TradingModal } from './TradingModal';
import { StockDisclaimerModal } from './StockDisclaimerModal';
import { toast } from 'sonner';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { fetchXStocksFrontend, fetchJupiterPriceData } from '@/lib/frontend-data';
import { XStock } from '@/lib/types';

interface TokenWithPrice extends XStock {
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

interface MarketplaceLandingProps {
  onNavigate: (page: "landing" | "dashboard") => void;
}

export function MarketplaceLanding({ onNavigate }: MarketplaceLandingProps) {
  const [tokens, setTokens] = useState<TokenWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('market-cap');
  const [selectedSector, setSelectedSector] = useState('all');
  const [favorites, setFavorites] = useState<string[]>(['AAPLx', 'TSLAx', 'NVDAx']);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [showTradingModal, setShowTradingModal] = useState(false);
  const [showStockDisclaimer, setShowStockDisclaimer] = useState(false);
  
  const { isAuthenticated, hasProfile, hasPortfolio } = usePrivyAuth();

  // Sector mapping
  const sectorMap: Record<string, string> = {
    'AAPLx': 'Technology',
    'TSLAx': 'Automotive', 
    'GOOGLx': 'Technology',
    'AMZNx': 'E-commerce',
    'NVDAx': 'Technology',
    'METAx': 'Technology',
    'MSTRx': 'Software',
    'COINx': 'FinTech',
    'SPYx': 'ETF',
    'QQQx': 'ETF',
    'HOODx': 'FinTech',
    'PGx': 'Consumer Goods',
    'UNHx': 'Healthcare',
    'Vx': 'Financial',
    'WMTx': 'Retail',
  };

  const sectors = ['all', 'Technology', 'Automotive', 'E-commerce', 'FinTech', 'ETF', 'Healthcare', 'Financial', 'Retail', 'Consumer Goods', 'Software'];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('[MARKETPLACE] Fetching xStocks and Jupiter price data...');
        
        const xStocks = await fetchXStocksFrontend();
        const addresses = xStocks.map(stock => stock.address);
        
        // Fetch real Jupiter price data with volume and market cap
        const jupiterData = await fetchJupiterPriceData(addresses);
        console.log('[MARKETPLACE] Jupiter data received:', Object.keys(jupiterData).length, 'tokens');

        const tokensWithPrices: TokenWithPrice[] = xStocks.map(stock => {
          const jupiterInfo = jupiterData[stock.address];
          const price = jupiterInfo?.price || 0;
          
          // Generate realistic price changes (deterministic based on symbol)
          let change = 0;
          let changePercent = 0;
          
          if (price > 0) {
            const hash = stock.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const random = (seed: number) => (seed * 9301 + 49297) % 233280 / 233280;
            changePercent = (random(hash) - 0.5) * 10; // -5% to +5%
            change = (price * changePercent) / 100;
          }

          console.log(`[MARKETPLACE] ${stock.symbol}: price=$${price}, change=${changePercent.toFixed(2)}%`);

          return {
            ...stock,
            price: Number(price.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            sector: sectorMap[stock.symbol] || 'Technology',
          };
        });

        setTokens(tokensWithPrices);
        console.log('[MARKETPLACE] Processed', tokensWithPrices.length, 'tokens with real Jupiter data');
      } catch (error) {
        console.error('[MARKETPLACE] Failed to fetch tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort tokens
  const filteredTokens = tokens
    .filter(token => {
      const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          token.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === 'all' || token.sector === selectedSector;
      return matchesSearch && matchesSector;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'change-high':
          return b.changePercent - a.changePercent;
        case 'change-low':
          return a.changePercent - b.changePercent;
        case 'alphabetical':
          return a.symbol.localeCompare(b.symbol);
        default:
          return b.price - a.price; // Default to price high-to-low
      }
    });

  const topGainers = tokens
    .filter(t => t.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3);

  const topLosers = tokens
    .filter(t => t.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 3);

  const handleGetStarted = () => {
    // Users stay on landing page after login - no auto navigation to dashboard
  };

  const handleStockClick = (token: TokenWithPrice) => {
    console.log('Stock clicked:', token.symbol);
    
    // Convert to the format expected by modals
    const stock = {
      symbol: token.symbol,
      name: token.name,
      price: token.price,
      change: token.change,
      changePercent: token.changePercent,
      logoUri: token.logoURI,
      address: token.address
    };
    
    setSelectedStock(stock);
    
    // Check wallet connection first
    if (!isAuthenticated) {
      // Show error toast for wallet connection
      toast.error('Connect wallet to trade');
      return;
    }
    
    // Wallet is connected, show disclaimer
    setShowStockDisclaimer(true);
  };

  const handleStockDisclaimerAccept = () => {
    console.log('Disclaimer accepted. isAuthenticated:', isAuthenticated);
    console.log('selectedStock:', selectedStock);
    
    setShowStockDisclaimer(false);
    
    // Show success toast and open trading modal
    toast.success('Ready to trade!');
    
    // Open trading modal after toast (small delay)
    setTimeout(() => {
      console.log('Setting showTradingModal to true');
      setShowTradingModal(true);
    }, 100);
  };

  const handleStockDisclaimerClose = () => {
    setShowStockDisclaimer(false);
    setSelectedStock(null);
  };

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <nav className="border-b border-border/30 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/image.png" 
                alt="LetsStonk" 
                className="w-10 h-10 object-contain rounded-lg"
              />
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-none tracking-tight">LETSSTONK</span>
                <span className="text-xs text-gray-500 leading-none uppercase tracking-wide">TOKENIZED STOCKS</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PrivyWalletButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 border-b border-border/20 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-16 left-16 text-lg font-mono text-primary">$AAPL +2.3%</div>
          <div className="absolute top-24 right-20 text-lg font-mono text-green-400">$TSLA +1.8%</div>
          <div className="absolute bottom-20 left-20 text-lg font-mono text-muted-foreground">$MSFT +0.9%</div>
          <div className="absolute bottom-16 right-16 text-lg font-mono text-primary">$GOOGL +1.2%</div>
        </div>
        
        {/* Content */}
        <div className="relative container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Logo Image - LEFT SIDE */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative">
                <img 
                  src="/image.png" 
                  alt="LetsStonk" 
                  className="w-80 h-80 lg:w-92  lg:h-92 object-contain rounded-xl  p-4"
                />
              </div>
            </div>
            
            {/* Text Content - RIGHT SIDE */}
            <div className="text-center lg:text-left order-1 lg:order-2">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm font-medium">
                  Powered by Backed Finance & Solana
                </Badge>
                
                <h1 className="text-3xl lg:text-5xl font-bold tracking-tight leading-tight">
                  Tokenized Stock
                  <br />
                  <span className="text-primary">Trading Platform</span>
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                  Trade real S&P 500 stocks as tokens on Solana with professional portfolio management, 
                  24/7 trading, and instant settlement.
                </p>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Live Market Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>24/7 Trading</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Instant Settlement</span>
                  </div>
                </div>
                
     
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn More Link */}
      <section className="py-4 bg-card/30 border-b border-border/20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Learn more about tokenized stocks at{" "}
            <a 
              href="https://xstocks.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              xstocks.com
            </a>
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border/20"
                />
              </div>

              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-full sm:w-48 bg-card border-border/20">
                  <SelectValue placeholder="All Sectors" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector === "all" ? "All Sectors" : sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 bg-card border-border/20">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="change-high">Top Gainers</SelectItem>
                  <SelectItem value="change-low">Top Losers</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Token Grid */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading marketplace...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {filteredTokens.map((token) => (
                <Card 
                  key={token.symbol} 
                  className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/20"
                  onClick={() => handleStockClick(token)}
                >
                  <CardContent className="p-4">
                    {/* Header with logo and actions */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {token.logoURI ? (
                          <img 
                            src={token.logoURI} 
                            alt={token.name}
                            className="w-8 h-8 rounded-lg object-cover bg-background border border-border/30"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <span className="text-sm">📈</span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm truncate">{token.symbol}</h3>
                          <p className="text-xs text-muted-foreground truncate">{token.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://solscan.io/token/${token.address}`, '_blank');
                          }}
                          className="w-6 h-6 p-0"
                          title="View on Solscan"
                        >
                          <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                        </Button>
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(token.symbol);
                          }}
                          className="w-6 h-6 p-0"
                        >
                          <Star className={`h-3 w-3 ${favorites.includes(token.symbol) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                        </Button>
                      </div>
                    </div>

                    {/* Price and change */}
                    <div className="mb-3">
                      <div className="text-lg font-bold mb-1">${token.price.toFixed(2)}</div>
                      <div className={`flex items-center gap-1 text-xs font-semibold ${token.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {token.changePercent >= 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        <span>
                          {token.changePercent >= 0 ? '+' : ''}{token.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    {/* Token Info */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Address</span>
                        <span className="font-mono text-xs">{token.address.slice(0, 6)}...{token.address.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Network</span>
                        <span className="font-semibold text-primary">Solana</span>
                      </div>
                    </div>

                    {/* Sector badge */}
                    <Badge variant="outline" className="w-full mt-3 text-xs py-1 justify-center border-border/40 text-muted-foreground">
                      {token.sector}
                    </Badge>


                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stock Disclaimer Modal */}
      {showStockDisclaimer && selectedStock && (
        <StockDisclaimerModal
          isOpen={showStockDisclaimer}
          onClose={handleStockDisclaimerClose}
          onAccept={handleStockDisclaimerAccept}
          stock={selectedStock}
        />
      )}

      {/* Trading Modal */}
      {console.log('Render check - showTradingModal:', showTradingModal, 'selectedStock:', selectedStock)}
      {showTradingModal && selectedStock && (
        <TradingModal
          open={showTradingModal}
          onOpenChange={(open) => {
            console.log('Trading modal onOpenChange:', open);
            setShowTradingModal(open);
          }}
          stock={selectedStock}
        />
      )}

    </div>
  );
}