'use client'

interface IPFSUploadResult {
  success: boolean
  url?: string
  hash?: string
  provider?: string
  error?: string
}

class IPFSUploader {
  private providers = [
    {
      name: 'Walrus',
      upload: this.uploadToWalrus.bind(this)
    },
    {
      name: 'Pinata',
      upload: this.uploadToPinata.bind(this)
    },
    {
      name: 'Web3Storage',
      upload: this.uploadToWeb3Storage.bind(this)
    },
    {
      name: 'NFTStorage',
      upload: this.uploadToNFTStorage.bind(this)
    }
  ]

  async uploadImage(file: File | Blob, filename: string = 'ghibli-nft.jpg'): Promise<IPFSUploadResult> {
    console.log('📤 Starting IPFS upload with multiple providers...')

    // Try each provider in order
    for (const provider of this.providers) {
      try {
        console.log(`🔄 Trying ${provider.name}...`)
        const result = await provider.upload(file, filename)
        
        if (result.success) {
          console.log(`✅ Successfully uploaded via ${provider.name}:`, result.url)
          return { ...result, provider: provider.name }
        }
      } catch (error) {
        console.warn(`❌ ${provider.name} failed:`, error)
        continue
      }
    }

    // If all providers fail, return error
    return {
      success: false,
      error: 'All IPFS providers failed'
    }
  }

  private async uploadToWalrus(file: File | Blob, filename: string): Promise<IPFSUploadResult> {
    const walrusUrl = process.env.NEXT_PUBLIC_WALRUS_API_URL || 'https://publisher-devnet.walrus.space'
    const walrusKey = process.env.NEXT_PUBLIC_WALRUS_API_KEY

    const formData = new FormData()
    const fileToUpload = file instanceof File ? file : new File([file], filename, { type: 'image/jpeg' })
    formData.append('file', fileToUpload)

    const headers: Record<string, string> = {}
    if (walrusKey) {
      headers['Authorization'] = `Bearer ${walrusKey}`
    }

    const response = await fetch(`${walrusUrl}/v1/store`, {
      method: 'POST',
      headers,
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Walrus upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    const blobId = data.newlyCreated?.blobObject?.blobId || data.alreadyCertified?.blobId

    if (!blobId) {
      throw new Error('No blob ID returned from Walrus')
    }

    return {
      success: true,
      url: `https://aggregator-devnet.walrus.space/v1/${blobId}`,
      hash: blobId
    }
  }

  private async uploadToPinata(file: File | Blob, filename: string): Promise<IPFSUploadResult> {
    const pinataKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
    const pinataSecret = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY

    if (!pinataKey || !pinataSecret) {
      throw new Error('Pinata credentials not configured')
    }

    const formData = new FormData()
    const fileToUpload = file instanceof File ? file : new File([file], filename, { type: 'image/jpeg' })
    formData.append('file', fileToUpload)

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': pinataKey,
        'pinata_secret_api_key': pinataSecret
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
      hash: data.IpfsHash
    }
  }

  private async uploadToWeb3Storage(file: File | Blob, filename: string): Promise<IPFSUploadResult> {
    const web3StorageToken = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN

    if (!web3StorageToken) {
      throw new Error('Web3.Storage token not configured')
    }

    const formData = new FormData()
    const fileToUpload = file instanceof File ? file : new File([file], filename, { type: 'image/jpeg' })
    formData.append('file', fileToUpload)

    const response = await fetch('https://api.web3.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${web3StorageToken}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Web3.Storage upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      url: `https://w3s.link/ipfs/${data.cid}`,
      hash: data.cid
    }
  }

  private async uploadToNFTStorage(file: File | Blob, filename: string): Promise<IPFSUploadResult> {
    const nftStorageToken = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN

    if (!nftStorageToken) {
      throw new Error('NFT.Storage token not configured')
    }

    const formData = new FormData()
    const fileToUpload = file instanceof File ? file : new File([file], filename, { type: 'image/jpeg' })
    formData.append('file', fileToUpload)

    const response = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${nftStorageToken}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`NFT.Storage upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      url: `https://nftstorage.link/ipfs/${data.value.cid}`,
      hash: data.value.cid
    }
  }

  // Upload to a simple IPFS gateway as final fallback
  async uploadToPublicGateway(file: File | Blob, filename: string): Promise<IPFSUploadResult> {
    try {
      // Convert to base64 and create a data URL as absolute fallback
      const buffer = await file.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
      const dataUrl = `data:image/jpeg;base64,${base64}`
      
      return {
        success: true,
        url: dataUrl,
        hash: 'local_' + Date.now(),
        provider: 'Local Base64'
      }
    } catch (error) {
      throw new Error('Even local fallback failed')
    }
  }
}

export const ipfsUploader = new IPFSUploader()