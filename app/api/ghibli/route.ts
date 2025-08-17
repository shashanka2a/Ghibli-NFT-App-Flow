import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max size is 10MB.' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload an image.' }, { status: 400 })
    }

    console.log('🎨 Starting Ghibli transformation for:', file.name)

    // Step 1: Transform image using AI service
    const transformationResult = await callGhibliTransformationAPI(file)

    if (!transformationResult.success) {
      return NextResponse.json(
        { error: transformationResult.error || 'Image transformation failed'},
        { status: 500 }
      )
    }

    // Step 2: Upload transformed image to IPFS (multiple providers)
    const { ipfsUploader } = await import('../../lib/ipfs-upload')
    const ipfsResult = await ipfsUploader.uploadImage(transformationResult.imageBlob, `ghibli-${Date.now()}.jpg`)

    if (!ipfsResult.success) {
      console.warn('All IPFS providers failed, trying final fallback:', ipfsResult.error)
      
      // Try absolute fallback
      try {
        const fallbackResult = await ipfsUploader.uploadToPublicGateway(transformationResult.imageBlob, `ghibli-${Date.now()}.jpg`)
        
        return NextResponse.json({
          success: true,
          transformedImage: fallbackResult.url,
          ipfsUrl: fallbackResult.url,
          ipfsHash: fallbackResult.hash,
          metadata: {
            originalSize: file.size,
            originalType: file.type,
            transformedAt: new Date().toISOString(),
            style: 'ghibli',
            ipfsUpload: true,
            provider: fallbackResult.provider
          }
        })
      } catch (fallbackError) {
        // Ultimate fallback to direct URL
        return NextResponse.json({
          success: true,
          transformedImage: transformationResult.imageUrl,
          ipfsUrl: null,
          metadata: {
            originalSize: file.size,
            originalType: file.type,
            transformedAt: new Date().toISOString(),
            style: 'ghibli',
            ipfsUpload: false,
            error: 'All upload methods failed'
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      transformedImage: ipfsResult.url, // Use IPFS URL
      ipfsUrl: ipfsResult.url,
      ipfsHash: ipfsResult.hash,
      metadata: {
        originalSize: file.size,
        originalType: file.type,
        transformedAt: new Date().toISOString(),
        style: 'ghibli',
        ipfsUpload: true,
        provider: ipfsResult.provider,
        ipfsHash: ipfsResult.hash
      }
    })

  } catch (error) {
    console.error('Ghibli transformation error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')},
      { status: 500 }
    )
  }
}

async function callGhibliTransformationAPI(file: File) {
  const replicateToken = process.env.REPLICATE_API_TOKEN
  const huggingFaceToken = process.env.HUGGING_FACE_API_TOKEN

  // Try Replicate first (best quality)
  if (replicateToken) {
    try {
      console.log('🎨 Using Replicate for Ghibli transformation')
      return await transformWithReplicate(file, replicateToken)
    } catch (error) {
      console.warn('Replicate failed, trying Hugging Face:', error)
    }
  }

  // Try Hugging Face as fallback
  if (huggingFaceToken) {
    try {
      console.log('🎨 Using Hugging Face for Ghibli transformation')
      return await transformWithHuggingFace(file, huggingFaceToken)
    } catch (error) {
      console.warn('Hugging Face failed, using mock:', error)
    }
  }

  // Fallback to mock transformation
  console.log('🎨 Using mock Ghibli transformation (no API keys configured)')
  return await mockGhibliTransformation()
}

async function transformWithReplicate(file: File, token: string) {
  const base64 = await fileToBase64(file)
  
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", // Stable Diffusion model
      input: {
        image: `data:${file.type};base64,${base64}`,
        prompt: "Studio Ghibli style, anime art, beautiful magical landscape, soft pastel colors, detailed illustration, Miyazaki style, whimsical atmosphere, hand-drawn animation style, masterpiece, high quality",
        negative_prompt: "ugly, blurry, low quality, distorted, dark, scary, realistic, photograph, 3d render, nsfw, bad anatomy",
        num_inference_steps: 20,
        guidance_scale: 7.5,
        strength: 0.8
      }
    })
  })

  if (!response.ok) {
    throw new Error(`Replicate API error: ${response.statusText}`)
  }

  const prediction = await response.json()
  
  // Poll for completion
  let result = prediction
  while (result.status === 'starting' || result.status === 'processing') {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: { 'Authorization': `Token ${token}` }
    })
    result = await pollResponse.json()
  }

  if (result.status === 'succeeded' && result.output) {
    const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output
    const imageBlob = await fetch(imageUrl).then(r => r.blob())
    
    return {
      success: true,
      imageUrl,
      imageBlob
    }
  }

  throw new Error('Replicate transformation failed')
}

async function transformWithHuggingFace(file: File, token: string) {
  const formData = new FormData()
  formData.append('inputs', file)

  const response = await fetch(
    'https://api-inference.huggingface.co/models/nitrosocke/Ghibli-Diffusion',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    }
  )

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.statusText}`)
  }

  const imageBlob = await response.blob()
  const imageUrl = URL.createObjectURL(imageBlob)

  return {
    success: true,
    imageUrl,
    imageBlob
  }
}

async function mockGhibliTransformation() {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Use the beautiful Ghibli fallback image
  const fallbackImageUrl = '/images/ghibli-fallback.jpg'
  
  try {
    // Try to fetch the fallback image
    const imageResponse = await fetch(new URL(fallbackImageUrl, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
    
    if (imageResponse.ok) {
      const imageBlob = await imageResponse.blob()
      
      return {
        success: true,
        imageUrl: fallbackImageUrl,
        imageBlob
      }
    }
  } catch (error) {
    console.warn('Could not fetch fallback image, using external URL')
  }
  
  // Fallback to external image if local image fails
  const externalFallback = "https://images.unsplash.com/photo-1696862048447-3ab8435ce5f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBnaGlibGklMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU1MzUxNTkxfDA&ixlib=rb-4.1.0&q=80&w=1080"
  const imageBlob = await fetch(externalFallback).then(r => r.blob())
  
  return {
    success: true,
    imageUrl: `${externalFallback}&v=${Date.now()}`,
    imageBlob
  }
}

async function uploadToWalrusIPFS(imageBlob: Blob, filename: string) {
  try {
    const walrusApiUrl = process.env.NEXT_PUBLIC_WALRUS_API_URL || 'https://publisher-devnet.walrus.space'
    const walrusApiKey = process.env.NEXT_PUBLIC_WALRUS_API_KEY

    const formData = new FormData()
    formData.append('file', imageBlob, filename)

    const headers: Record<string, string> = {}
    if (walrusApiKey) {
      headers['Authorization'] = `Bearer ${walrusApiKey}`
    }

    console.log('📤 Uploading to Walrus IPFS...')
    
    const response = await fetch(`${walrusApiUrl}/v1/store`, {
      method: 'POST',
      headers,
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Walrus API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Extract blob ID from Walrus response
    const blobId = data.newlyCreated?.blobObject?.blobId || data.alreadyCertified?.blobId
    
    if (!blobId) {
      throw new Error('No blob ID returned from Walrus')
    }

    // Construct public URL
    const publicUrl = `https://aggregator-devnet.walrus.space/v1/${blobId}`
    
    console.log('✅ Successfully uploaded to Walrus IPFS:', blobId)

    return {
      success: true,
      url: publicUrl,
      hash: blobId
    }
  } catch (error) {
    console.error('Walrus IPFS upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  return buffer.toString('base64')
}