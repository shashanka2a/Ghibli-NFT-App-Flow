# Mintari - Ghibli NFT Creator

Transform your images into Studio Ghibli style NFTs on Flow blockchain.

## Features

- 🎨 **AI Image Transformation**: Convert any image to Ghibli style using Replicate/Hugging Face APIs
- 🔗 **Dynamic Wallet Integration**: Connect Flow wallets (Blocto, Lilico, Flow Wallet)
- ⛓️ **Flow Blockchain**: Real NFT minting on Flow testnet/mainnet
- 🎁 **Reward System**: Hardcoded rewards for successful NFT mints
- 📱 **Responsive Design**: Beautiful UI with Tailwind CSS and Framer Motion

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:
```bash
# AI Transformation (choose one)
REPLICATE_API_TOKEN=r8_your_token_here
HUGGING_FACE_API_TOKEN=hf_your_token_here

# Dynamic Wallet
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_env_id_here

# Flow Network
NEXT_PUBLIC_FLOW_NETWORK=testnet
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)**

## API Keys Setup

### Replicate (Recommended)
1. Go to [replicate.com](https://replicate.com)
2. Sign up and get API token
3. Add to `.env.local`

### Hugging Face (Free Alternative)
1. Go to [huggingface.co](https://huggingface.co)
2. Create account → Settings → Access Tokens
3. Add to `.env.local`

### Dynamic Wallet
1. Go to [dynamic.xyz](https://dynamic.xyz)
2. Create project → Get Environment ID
3. Add to `.env.local`

## Project Structure

```
├── app/
│   ├── page.tsx              # Landing page
│   ├── create/page.tsx       # Main NFT creation app
│   ├── api/ghibli/route.ts   # AI transformation API
│   └── layout.tsx            # Root layout
├── components/
│   ├── providers/            # Wallet provider
│   ├── ui/                   # UI components
│   ├── WalletConnect.tsx     # Wallet connection
│   ├── MetadataInput.tsx     # NFT metadata form
│   └── ...
├── lib/
│   └── flow-transactions.ts  # Flow blockchain logic
└── contracts/
    └── GhibliNFT.cdc        # Flow smart contract
```

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Flow Blockchain** - NFT minting
- **Dynamic Labs** - Wallet connection
- **Replicate/Hugging Face** - AI image transformation

## License

MIT