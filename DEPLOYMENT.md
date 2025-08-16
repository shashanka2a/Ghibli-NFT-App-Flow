# Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/mintari-ghibli-nft)

## Manual Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Environment Variables** (Optional - for real APIs)
   Add these in Vercel dashboard → Settings → Environment Variables:
   ```
   REPLICATE_API_TOKEN=your_replicate_token
   HUGGING_FACE_API_TOKEN=your_hugging_face_token
   NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_dynamic_env_id
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

## Features Working in Demo Mode

✅ **Landing Page** - Fully functional
✅ **Image Upload** - Works with mock transformation
✅ **AI Transformation** - Uses mock Ghibli images
✅ **Wallet Connection** - Mock wallet for demo
✅ **NFT Minting** - Mock Flow transactions
✅ **Rewards System** - Hardcoded rewards modal

## Production Setup

To enable real functionality, add the API keys mentioned above and update:
- `app/api/ghibli/route.ts` - Enable real AI transformation
- `components/providers/WalletProvider.tsx` - Enable Dynamic wallet
- `lib/flow-transactions.ts` - Enable real Flow blockchain

## Build Command
```bash
npm run build
```

## Start Command
```bash
npm start
```