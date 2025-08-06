# SolStock Setup Guide

## 🎯 Quick Start

Your app is currently running in **DEMO MODE** because no Privy App ID is configured.

### Current Status: DEMO MODE
- ✅ Full UI working
- ✅ Mock wallet connections  
- ✅ Fake transactions for testing
- ❌ No real trading

## 🚀 Enable Real Trading

To enable real Solana wallet connections and Jupiter trading:

### 1. Get Privy App ID

1. Go to [Privy Dashboard](https://dashboard.privy.io/)
2. Create account and new app
3. Copy your App ID

### 2. Configure Environment

Create `.env.local` file in project root:

```bash
# .env.local
NEXT_PUBLIC_PRIVY_APP_ID=your-actual-privy-app-id-here
```

### 3. Restart Development Server

```bash
npm run dev
```

## 🎮 Mode Comparison

| Feature | Demo Mode | Production Mode |
|---------|-----------|-----------------|
| UI/UX | ✅ Full | ✅ Full |
| Wallet Connection | 🎭 Mock | ✅ Real (Privy) |
| Jupiter Quotes | ✅ Real API | ✅ Real API |
| Trading | 🎭 Mock | ✅ Real On-Chain |
| SOL Balance | 🎭 2.5 SOL | ✅ Actual Balance |
| Transactions | 🎭 Fake Sigs | ✅ Real Solscan Links |

## 🔍 Debug Panel

The trading modal shows debug info:

**Demo Mode:**
- Mode: Demo (No Privy App ID)
- Wallet: DemoWall...5678
- Connected: Yes
- SendTx: Available

**Production Mode:**  
- Mode: Production
- Wallet: [Your actual wallet]
- Connected: Yes  
- SendTx: Available

## 🛠️ Troubleshooting

### Still showing Demo Mode?
1. Check `.env.local` exists
2. Verify App ID is correct (no quotes)  
3. Restart development server
4. Check browser console for errors

### Real Trading Not Working?
1. Ensure wallet has SOL for fees (0.01+ SOL)
2. Check Jupiter API connectivity
3. Verify stock token addresses
4. Monitor browser console logs

## 🔗 Resources

- [Privy Dashboard](https://dashboard.privy.io/)
- [Jupiter API](https://docs.jup.ag/)
- [xStocks Info](https://xstocks.com)