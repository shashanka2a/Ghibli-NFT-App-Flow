'use client'

interface WalrusUploadResponse {
  success: boolean
  url?: string
  hash?: string
  error?: string
}

export class WalrusAPI {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_WALRUS_API_URL || 'https://publisher-devnet.walrus.space'
    this.apiKey = process.env.NEXT_PUBLIC_WALRUS_API_KEY || ''
  }

  async uploadImage(file: File): Promise<WalrusUploadResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${this.baseUrl}/v1/store`, {
        method: 'POST',
        headers: {
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Walrus returns blob ID that can be accessed via aggregator
      const blobId = data.newlyCreated?.blobObject?.blobId || data.alreadyCertified?.blobId
      
      if (!blobId) {
        throw new Error('No blob ID returned from Walrus')
      }

      const publicUrl = `https://aggregator-devnet.walrus.space/v1/${blobId}`

      return {
        success: true,
        url: publicUrl,
        hash: blobId
      }
    } catch (error) {
      console.error('Walrus upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  async uploadJSON(metadata: any): Promise<WalrusUploadResponse> {
    try {
      const jsonBlob = new Blob([JSON.stringify(metadata, null, 2)], {
        type: 'application/json'
      })
      
      const file = new File([jsonBlob], 'metadata.json', {
        type: 'application/json'
      })

      return await this.uploadImage(file)
    } catch (error) {
      console.error('Walrus JSON upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'JSON upload failed'
      }
    }
  }
}

export const walrusAPI = new WalrusAPI()