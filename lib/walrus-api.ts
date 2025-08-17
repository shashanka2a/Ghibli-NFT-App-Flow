'use client'

interface WalrusUploadResponse {
  success: boolean
  url?: string
  hash?: string
  error?: string
  size?: number
  contentType?: string
}

interface WalrusStoreResponse {
  newlyCreated?: {
    blobObject: {
      id: string
      blobId: string
      size: number
      encodedSize: number
      contentType: string
    }
  }
  alreadyCertified?: {
    blobId: string
    size: number
    encodedSize: number
    contentType: string
  }
}

export class WalrusAPI {
  private baseUrl: string
  private aggregatorUrl: string
  private apiKey: string
  private maxRetries: number = 3
  private retryDelay: number = 1000

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_WALRUS_API_URL || 'https://publisher-devnet.walrus.space'
    this.aggregatorUrl = 'https://aggregator-devnet.walrus.space'
    this.apiKey = process.env.NEXT_PUBLIC_WALRUS_API_KEY || ''
  }

  async uploadImage(file: File): Promise<WalrusUploadResponse> {
    return this.uploadWithRetry(file, 'image')
  }

  async uploadBlob(blob: Blob, filename: string): Promise<WalrusUploadResponse> {
    const file = new File([blob], filename, { type: blob.type })
    return this.uploadWithRetry(file, 'blob')
  }

  async uploadJSON(metadata: any, filename: string = 'metadata.json'): Promise<WalrusUploadResponse> {
    try {
      const jsonString = JSON.stringify(metadata, null, 2)
      const jsonBlob = new Blob([jsonString], { type: 'application/json' })
      const file = new File([jsonBlob], filename, { type: 'application/json' })

      return await this.uploadWithRetry(file, 'json')
    } catch (error) {
      console.error('Walrus JSON upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'JSON upload failed'
      }
    }
  }

  private async uploadWithRetry(file: File, type: string): Promise<WalrusUploadResponse> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`📤 Uploading ${type} to Walrus (attempt ${attempt}/${this.maxRetries})...`)
        
        const result = await this.performUpload(file)
        
        if (result.success) {
          console.log(`✅ Successfully uploaded ${type} to Walrus:`, result.hash)
          return result
        } else {
          throw new Error(result.error || 'Upload failed')
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        console.warn(`❌ Upload attempt ${attempt} failed:`, lastError.message)
        
        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * attempt
          console.log(`⏳ Retrying in ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    return {
      success: false,
      error: `Upload failed after ${this.maxRetries} attempts: ${lastError?.message || 'Unknown error'}`
    }
  }

  private async performUpload(file: File): Promise<WalrusUploadResponse> {
    // Validate file size (Walrus has limits)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      throw new Error(`File too large: ${file.size} bytes. Max size: ${maxSize} bytes`)
    }

    const formData = new FormData()
    formData.append('file', file)

    const headers: Record<string, string> = {}
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const response = await fetch(`${this.baseUrl}/v1/store`, {
      method: 'POST',
      headers,
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data: WalrusStoreResponse = await response.json()
    
    // Extract blob information
    const blobInfo = data.newlyCreated?.blobObject || data.alreadyCertified
    
    if (!blobInfo?.blobId) {
      throw new Error('No blob ID returned from Walrus')
    }

    // Construct public URL using aggregator
    const publicUrl = `${this.aggregatorUrl}/v1/${blobInfo.blobId}`
    
    // Verify the uploaded content is accessible
    try {
      const verifyResponse = await fetch(publicUrl, { method: 'HEAD' })
      if (!verifyResponse.ok) {
        console.warn('⚠️ Uploaded content not immediately accessible via aggregator')
      }
    } catch (error) {
      console.warn('⚠️ Could not verify uploaded content:', error)
    }

    return {
      success: true,
      url: publicUrl,
      hash: blobInfo.blobId,
      size: blobInfo.size,
      contentType: blobInfo.contentType || file.type
    }
  }

  async getContent(blobId: string): Promise<Response> {
    const url = `${this.aggregatorUrl}/v1/${blobId}`
    return fetch(url)
  }

  async checkBlobExists(blobId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.aggregatorUrl}/v1/${blobId}`, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }
}

export const walrusAPI = new WalrusAPI()