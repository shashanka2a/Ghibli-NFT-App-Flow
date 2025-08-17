// Simple test script to verify IPFS upload works
// Run with: node scripts/test-ipfs.js

const fs = require('fs');
const path = require('path');

async function testIPFSUpload() {
  console.log('🧪 Testing IPFS upload functionality...');
  
  // Check if fallback image exists
  const fallbackPath = path.join(__dirname, '../public/images/ghibli-fallback.jpg');
  
  if (fs.existsSync(fallbackPath)) {
    console.log('✅ Fallback image found at:', fallbackPath);
    const stats = fs.statSync(fallbackPath);
    console.log('📊 Image size:', (stats.size / 1024).toFixed(2), 'KB');
  } else {
    console.log('❌ Fallback image not found. Please save the Ghibli image as:');
    console.log('   public/images/ghibli-fallback.jpg');
  }
  
  // Check environment variables
  console.log('\n🔧 Environment variables:');
  const envVars = [
    'NEXT_PUBLIC_WALRUS_API_URL',
    'NEXT_PUBLIC_PINATA_API_KEY',
    'NEXT_PUBLIC_WEB3_STORAGE_TOKEN',
    'NEXT_PUBLIC_NFT_STORAGE_TOKEN'
  ];
  
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`⚠️  ${varName}: Not configured`);
    }
  });
  
  console.log('\n📝 To configure IPFS providers:');
  console.log('1. Pinata: https://pinata.cloud/ (Free tier available)');
  console.log('2. Web3.Storage: https://web3.storage/ (Free)');
  console.log('3. NFT.Storage: https://nft.storage/ (Free)');
  console.log('4. Walrus: https://walrus.space/ (Sui ecosystem)');
}

testIPFSUpload().catch(console.error);