# 🚀 Fixing RPC Rate Limiting Issues

## The Problem
When trading, you're seeing `403 Access forbidden` errors because:
1. **Jupiter provides the swap transaction** (this works fine)
2. **We still need our own RPC to send/confirm the transaction** (this gets rate limited)

## Quick Solutions

### Option 1: Try Different Free RPCs (Easiest) ⚡
Create a `.env.local` file in your project root with:
```bash
NEXT_PUBLIC_TRADING_RPC_URL=https://rpc.ankr.com/solana
```

**Alternative free RPCs to try:**
- `NEXT_PUBLIC_TRADING_RPC_URL=https://rpc.ankr.com/solana` (Recommended - usually reliable)
- `NEXT_PUBLIC_TRADING_RPC_URL=https://solana-api.projectserum.com` (Serum's RPC)

**Restart your app after adding the environment variable!**

### Option 2: Get a Free RPC API Key (Recommended)
1. **Helius** (Free tier: 100,000 requests/day) ⭐ **BEST OPTION**
   - Go to [helius.dev](https://helius.dev)
   - Sign up for free account
   - Get your API key
   - Add to `.env.local`: `NEXT_PUBLIC_TRADING_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_ACTUAL_API_KEY`
   - ⚠️ **Don't use the demo key - it doesn't allow trading!**

2. **QuickNode** (Free tier: 10M compute units/month)
   - Go to [quicknode.com](https://quicknode.com)
   - Create free Solana endpoint
   - Add to `.env.local`: `NEXT_PUBLIC_TRADING_RPC_URL=YOUR_QUICKNODE_URL`

3. **Alchemy** (Free tier: 300M compute units/month)
   - Go to [alchemy.com](https://alchemy.com)
   - Create free Solana endpoint
   - Add to `.env.local`: `NEXT_PUBLIC_TRADING_RPC_URL=YOUR_ALCHEMY_URL`

### Option 3: Use Our Fallback System (Already Implemented)
The app now automatically tries different RPC endpoints if one fails. Just restart your app and it should work better.

## What We Fixed

✅ **Updated Jupiter API endpoints** to use the correct free endpoints:
- `lite-api.jup.ag/swap/v1/quote` (for quotes)
- `lite-api.jup.ag/swap/v1/swap` (for transactions)

✅ **Added RPC fallback system** that tries multiple endpoints automatically

✅ **Separated trading RPC** from general app RPC to avoid conflicts

✅ **Fixed wallet provider RPC** to use custom endpoint instead of rate-limited default

✅ **Added automatic RPC rotation** - tries different free endpoints every 5 minutes

## Testing the Fix

1. Try trading a small amount first
2. Check the browser console for RPC endpoint logs
3. If one RPC fails, it should automatically try the next one

## Production Recommendations

For production use, definitely get a paid RPC provider:
- **Helius**: Best for Solana, great support
- **QuickNode**: Reliable, good performance  
- **Alchemy**: Good free tier, scales well

The free RPCs work for testing but have strict rate limits.

## 🚨 Common Error Messages

**Error: "API key is not allowed to access blockchain" (Code -32052)**
- You're using a demo/restricted API key
- Solution: Get a proper free API key from Helius, QuickNode, or Alchemy
- Don't use `api-key=demo` - it doesn't work for trading!

**Error: "403 Access forbidden"**
- RPC endpoint is rate limiting you
- Solution: Try a different RPC endpoint from the list above
- Check browser console to see which RPC is being used

**Error: "failed to get recent blockhash"**
- Same as 403 - RPC rate limiting
- Solution: Set `NEXT_PUBLIC_TRADING_RPC_URL` in `.env.local` and restart app

## 🔍 Debug Steps (Do This First!)

1. **Check Browser Console**
   - Open browser dev tools (F12)
   - Look for RPC debug logs like "🔍 RPC Configuration Debug"
   - See which RPC endpoint is actually being used

2. **Verify Environment Variable**
   - Make sure `.env.local` file is in your project ROOT (same level as package.json)
   - Restart your development server after adding the env var
   - Check console for "✅ Wallet Provider using custom RPC" message

3. **Test RPC Endpoints**
   - Try each free RPC one by one:
   ```bash
   # In .env.local, try these one at a time:
   NEXT_PUBLIC_TRADING_RPC_URL=https://rpc.ankr.com/solana
   NEXT_PUBLIC_TRADING_RPC_URL=https://solana-api.projectserum.com
   ``` 