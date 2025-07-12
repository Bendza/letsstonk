# Backend Setup Guide

## Overview

Your Solana xStocks trading app uses **Supabase as the primary backend** with Edge Functions for complex operations. This eliminates the need for a separate backend server while providing enterprise-grade functionality.

## Architecture

```
Frontend (Next.js)
↕️ 
Supabase Edge Functions (Authentication, Jupiter Integration, Price Updates)
↕️ 
Supabase Database (PostgreSQL with RLS)
```

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Solana Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
# Alternative: https://api.devnet.solana.com for development

# Jupiter API (Optional - for better rate limits)
JUP_API_KEY=your-jupiter-api-key-optional

# Application Configuration
NEXT_PUBLIC_APP_ENV=development
```

## Edge Functions

Your backend consists of these Supabase Edge Functions:

### 1. **wallet-auth** - User Authentication
- **Purpose**: Handles wallet-based authentication using signature verification
- **Endpoint**: `https://your-project.supabase.co/functions/v1/wallet-auth`
- **Method**: POST
- **Payload**:
  ```json
  {
    "walletAddress": "string",
    "signature": "string", 
    "message": "string",
    "riskTolerance": 5
  }
  ```

### 2. **jupiter-quote** - Swap Quotes
- **Purpose**: Gets swap quotes from Jupiter API with safety checks
- **Endpoint**: `https://your-project.supabase.co/functions/v1/jupiter-quote`
- **Method**: POST
- **Payload**:
  ```json
  {
    "inputMint": "USDC_mint_address",
    "outputMint": "xStock_mint_address",
    "amount": 1000000,
    "slippageBps": 50
  }
  ```

### 3. **price-update** - Price Data Updates
- **Purpose**: Fetches and stores current xStock prices
- **Schedule**: Every 5 minutes during market hours (automated via cron)
- **Endpoint**: `https://your-project.supabase.co/functions/v1/price-update`
- **Method**: GET (for manual triggers)

### 4. **rebalance** - Portfolio Rebalancing
- **Purpose**: Automated portfolio rebalancing
- **Schedule**: Daily at 3 AM UTC (automated via cron)
- **Endpoint**: `https://your-project.supabase.co/functions/v1/rebalance`

### 5. **portfolio-sync** - On-Chain Portfolio Sync
- **Purpose**: Syncs on-chain token balances with database records
- **Schedule**: Every hour during market hours (automated via cron)
- **Endpoint**: `https://your-project.supabase.co/functions/v1/portfolio-sync`
- **Method**: POST
- **Payload**:
  ```json
  {
    "walletAddress": "string",
    "portfolioId": "optional-string"
  }
  ```

### 6. **risk-analysis** - Portfolio Risk Analysis
- **Purpose**: Calculates portfolio risk metrics and generates recommendations
- **Schedule**: Daily at 2 AM UTC (automated via cron)
- **Endpoint**: `https://your-project.supabase.co/functions/v1/risk-analysis`
- **Method**: GET or POST
- **Query Params** (GET): `?walletAddress=xxx&riskTolerance=5`

## Database Schema

Your database is already set up with:

- ✅ **users** - User profiles and wallet addresses
- ✅ **portfolios** - User investment portfolios
- ✅ **positions** - Individual stock holdings
- ✅ **transactions** - Swap history and records
- ✅ **price_history** - Historical price data
- ✅ **rebalance_logs** - Rebalancing activity logs

## Deployment Steps

### 1. **Database Setup** (Already Done)
Your database schema is already deployed via the migration in `supabase/migrations/001_initial_schema.sql`.

### 2. **Deploy Edge Functions**
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy all functions
supabase functions deploy wallet-auth
supabase functions deploy jupiter-quote
supabase functions deploy price-update
supabase functions deploy portfolio-sync
supabase functions deploy risk-analysis
supabase functions deploy rebalance

# Set up cron jobs
supabase functions deploy --cron-file supabase/functions/cron.yaml
```

### 3. **Environment Variables Setup**
Set these in your Supabase project dashboard under **Settings > Edge Functions**:

```
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
JUP_API_KEY=your-jupiter-api-key-optional
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available.

### 4. **Testing Functions**

Test each function after deployment:

```bash
# Test wallet auth
curl -X POST https://your-project.supabase.co/functions/v1/wallet-auth \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"test","signature":"test","message":"test"}'

# Test Jupiter quote
curl -X POST https://your-project.supabase.co/functions/v1/jupiter-quote \
  -H "Content-Type: application/json" \
  -d '{"inputMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","outputMint":"8Yv9Jz4z7UCCN52HGAgrjbzduFJo5pTre5tKl2cozNhW","amount":1000000}'

# Test price update
curl https://your-project.supabase.co/functions/v1/price-update

# Test portfolio sync
curl -X POST https://your-project.supabase.co/functions/v1/portfolio-sync \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"your-wallet-address"}'

# Test risk analysis
curl "https://your-project.supabase.co/functions/v1/risk-analysis?walletAddress=your-wallet-address"
```

## Frontend Integration

Your frontend can now use the Supabase client (`lib/supabase.ts`) to:

1. **Authenticate users** via wallet signatures
2. **Fetch portfolio data** with real-time subscriptions
3. **Get swap quotes** through Edge Functions
4. **Record transactions** in the database
5. **Display real-time prices** from the price history table

## Development vs Production

### Development Setup:
- Use `https://api.devnet.solana.com` for Solana RPC
- Test with devnet tokens
- Shorter cron intervals for testing

### Production Setup:
- Use `https://api.mainnet-beta.solana.com` or dedicated RPC
- Real mainnet tokens
- Proper error monitoring and alerting

## Monitoring & Logs

- **Function Logs**: Available in Supabase Dashboard > Edge Functions
- **Database Activity**: Monitor via Supabase Dashboard > Database
- **Cron Jobs**: Check execution logs in Edge Functions section

## Security Features

✅ **Row Level Security (RLS)** - Users can only access their own data
✅ **Signature Verification** - Wallet ownership verification
✅ **Service Role Key** - Secure server-side operations
✅ **CORS Protection** - Controlled cross-origin requests

## Why Supabase vs Custom Backend?

**Advantages of this Supabase approach:**
- ✅ **No server management** - Fully managed infrastructure
- ✅ **Real-time subscriptions** - Live portfolio updates
- ✅ **Built-in authentication** - Secure user management
- ✅ **Automatic scaling** - Handles traffic spikes
- ✅ **Edge Functions** - Fast, distributed compute
- ✅ **Scheduled tasks** - Built-in cron jobs
- ✅ **Cost effective** - Pay only for usage

**When you might need a custom backend:**
- Complex business logic requiring long-running processes
- Integration with enterprise systems requiring special protocols
- Regulatory requirements for specific infrastructure

For your xStocks trading app, **Supabase provides everything you need** without the complexity of managing servers.

## Next Steps

1. Deploy the Edge Functions
2. Test the authentication flow
3. Integrate Jupiter quotes in your frontend
4. Set up real-time portfolio updates
5. Monitor function performance and optimize as needed

Your backend is now production-ready! 🚀 