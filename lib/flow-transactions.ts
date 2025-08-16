import * as fcl from '@onflow/fcl'

// Flow configuration for testnet
fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
  'flow.network': 'testnet',
  '0xNonFungibleToken': '0x631e88ae7f1d7c20',
  '0xMetadataViews': '0x631e88ae7f1d7c20',
  '0xGhibliNFT': '0x631e88ae7f1d7c20' // Replace with your deployed contract address
})

interface NFTData {
  name: string
  description: string
  thumbnail: string
  originalImage: string
  transformedImage: string
  creator: string
}

interface TransactionResult {
  success: boolean
  transactionId?: string
  error?: string
}

// Setup collection transaction
const SETUP_COLLECTION_TX = `
import NonFungibleToken from 0xNonFungibleToken
import GhibliNFT from 0xGhibliNFT

transaction {
  prepare(signer: AuthAccount) {
    if signer.borrow<&GhibliNFT.Collection>(from: GhibliNFT.CollectionStoragePath) == nil {
      let collection <- GhibliNFT.createEmptyCollection()
      signer.save(<-collection, to: GhibliNFT.CollectionStoragePath)
      signer.link<&GhibliNFT.Collection{NonFungibleToken.CollectionPublic, GhibliNFT.GhibliNFTCollectionPublic}>(
        GhibliNFT.CollectionPublicPath,
        target: GhibliNFT.CollectionStoragePath
      )
    }
  }
}
`

// Check collection script
const CHECK_COLLECTION_SCRIPT = `
import GhibliNFT from 0xGhibliNFT

pub fun main(address: Address): Bool {
  return getAccount(address)
    .getCapability(GhibliNFT.CollectionPublicPath)
    .check<&GhibliNFT.Collection{GhibliNFT.GhibliNFTCollectionPublic}>()
}
`

// Mint NFT transaction
const MINT_NFT_TX = `
import NonFungibleToken from 0xNonFungibleToken
import GhibliNFT from 0xGhibliNFT

transaction(
  recipient: Address,
  name: String,
  description: String,
  thumbnail: String,
  originalImage: String,
  transformedImage: String,
  creator: String
) {
  let minter: &GhibliNFT.NFTMinter
  let recipientCollectionRef: &{NonFungibleToken.CollectionPublic}

  prepare(signer: AuthAccount) {
    self.minter = signer.borrow<&GhibliNFT.NFTMinter>(from: GhibliNFT.MinterStoragePath)
      ?? panic("Could not borrow a reference to the NFT minter")

    self.recipientCollectionRef = getAccount(recipient)
      .getCapability(GhibliNFT.CollectionPublicPath)
      .borrow<&{NonFungibleToken.CollectionPublic}>()
      ?? panic("Could not borrow a reference to the recipient's collection")
  }

  execute {
    let metadata: {String: AnyStruct} = {
      "name": name,
      "description": description,
      "thumbnail": thumbnail,
      "originalImage": originalImage,
      "transformedImage": transformedImage,
      "creator": creator
    }

    self.minter.mintNFT(
      recipient: self.recipientCollectionRef,
      metadata: metadata
    )
  }
}
`

export async function setupCollection(): Promise<TransactionResult> {
  try {
    console.log('🔧 Setting up NFT collection on Flow')

    const transactionId = await fcl.mutate({
      cadence: SETUP_COLLECTION_TX,
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 1000
    })

    console.log('⏳ Waiting for transaction to be sealed:', transactionId)
    const transaction = await fcl.tx(transactionId).onceSealed()

    if (transaction.status === 4) {
      console.log('✅ Collection setup successful')
      return {
        success: true,
        transactionId
      }
    } else {
      throw new Error('Transaction failed')
    }
  } catch (error) {
    console.error('Collection setup error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Setup failed'
    }
  }
}

export async function checkCollection(address: string): Promise<boolean> {
  try {
    console.log('🔍 Checking collection for address:', address)

    const result = await fcl.query({
      cadence: CHECK_COLLECTION_SCRIPT,
      args: (arg, t) => [arg(address, t.Address)]
    })

    return result
  } catch (error) {
    console.error('Collection check error:', error)
    return false
  }
}

export async function mintGhibliNFT(
  recipient: string,
  nftData: NFTData
): Promise<TransactionResult> {
  try {
    console.log('🎨 Minting Ghibli NFT on Flow:', nftData.name)

    const transactionId = await fcl.mutate({
      cadence: MINT_NFT_TX,
      args: (arg, t) => [
        arg(recipient, t.Address),
        arg(nftData.name, t.String),
        arg(nftData.description, t.String),
        arg(nftData.thumbnail, t.String),
        arg(nftData.originalImage, t.String),
        arg(nftData.transformedImage, t.String),
        arg(nftData.creator, t.String)
      ],
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 1000
    })

    console.log('⏳ Waiting for minting transaction to be sealed:', transactionId)
    const transaction = await fcl.tx(transactionId).onceSealed()

    if (transaction.status === 4) {
      console.log('✅ NFT minted successfully:', transactionId)
      return {
        success: true,
        transactionId
      }
    } else {
      throw new Error('Minting transaction failed')
    }
  } catch (error) {
    console.error('Minting error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Minting failed'
    }
  }
}