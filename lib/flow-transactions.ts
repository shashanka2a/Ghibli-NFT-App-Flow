// Mock Flow transactions for demo (no blockchain calls needed)

// Mock mint NFT function
export async function mintGhibliNFT(
  recipientAddress: string,
  metadata: {
    name: string
    description: string
    thumbnail: string
    originalImage: string
    transformedImage: string
    creator: string
  }
) {
  console.log('🎨 Mock NFT minting (no blockchain calls needed)', { recipientAddress, metadata })
  
  try {
    // Simulate minting time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock transaction ID
    const mockTransactionId = `0x${Math.random().toString(16).substr(2, 16)}`
    
    return { 
      success: true, 
      transactionId: mockTransactionId,
      transaction: {
        id: mockTransactionId,
        status: 'sealed',
        events: []
      }
    }
  } catch (error) {
    return { 
      success: false, 
      error: 'Mock minting failed' 
    }
  }
}

// Mock setup collection function
export async function setupCollection() {
  console.log('🔧 Mock collection setup (no blockchain calls needed)')
  
  try {
    // Simulate setup time
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockTransactionId = `0x${Math.random().toString(16).substr(2, 16)}`
    
    return { 
      success: true, 
      transactionId: mockTransactionId 
    }
  } catch (error) {
    return { 
      success: false, 
      error: 'Mock setup failed' 
    }
  }
}

// Mock check collection function
export async function checkCollection(address: string): Promise<boolean> {
  console.log('✅ Mock collection check (no blockchain calls needed)', address)
  
  // Always return true for demo
  return true
}