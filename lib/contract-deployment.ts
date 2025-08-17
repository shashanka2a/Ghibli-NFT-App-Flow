import * as fcl from '@onflow/fcl'

interface DeploymentResult {
  success: boolean
  contractAddress?: string
  transactionId?: string
  error?: string
}

// Read the contract source code
async function getContractSource(): Promise<string> {
  try {
    const response = await fetch('/contracts/GhibliNFT.cdc')
    if (!response.ok) {
      throw new Error('Failed to load contract source')
    }
    return await response.text()
  } catch (error) {
    console.error('Error loading contract source:', error)
    throw error
  }
}

// Deploy contract transaction
const DEPLOY_CONTRACT_TX = `
transaction(name: String, code: String) {
  prepare(signer: AuthAccount) {
    signer.contracts.add(name: name, code: code.utf8)
  }
}
`

// Check if contract is deployed
const CHECK_CONTRACT_SCRIPT = `
pub fun main(address: Address, contractName: String): Bool {
  let account = getAccount(address)
  return account.contracts.get(name: contractName) != nil
}
`

// Get contract address script
const GET_CONTRACT_ADDRESS_SCRIPT = `
pub fun main(address: Address, contractName: String): Address? {
  let account = getAccount(address)
  if account.contracts.get(name: contractName) != nil {
    return address
  }
  return nil
}
`

export async function deployGhibliNFTContract(): Promise<DeploymentResult> {
  try {
    console.log('🚀 Starting GhibliNFT contract deployment...')

    // Check if user is authenticated
    const user = await fcl.currentUser.snapshot()
    if (!user.loggedIn) {
      throw new Error('User must be authenticated to deploy contract')
    }

    const userAddress = user.addr
    console.log('👤 Deploying from address:', userAddress)

    // Check if contract is already deployed
    const isDeployed = await fcl.query({
      cadence: CHECK_CONTRACT_SCRIPT,
      args: (arg, t) => [
        arg(userAddress, t.Address),
        arg('GhibliNFT', t.String)
      ]
    })

    if (isDeployed) {
      console.log('✅ Contract already deployed at:', userAddress)
      return {
        success: true,
        contractAddress: userAddress,
        transactionId: 'already_deployed'
      }
    }

    // Get contract source code
    const contractCode = await getContractSource()
    console.log('📄 Contract source loaded, length:', contractCode.length)

    // Deploy the contract
    console.log('📤 Submitting deployment transaction...')
    const transactionId = await fcl.mutate({
      cadence: DEPLOY_CONTRACT_TX,
      args: (arg, t) => [
        arg('GhibliNFT', t.String),
        arg(contractCode, t.String)
      ],
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 9999
    })

    console.log('⏳ Waiting for deployment transaction to be sealed:', transactionId)
    const transaction = await fcl.tx(transactionId).onceSealed()

    if (transaction.status === 4) {
      console.log('✅ Contract deployed successfully!')
      console.log('📍 Contract address:', userAddress)
      console.log('🔗 Transaction:', transactionId)
      console.log('🌐 View on FlowScan: https://flowscan.io/transaction/' + transactionId)

      // Store the contract address for future use
      localStorage.setItem('ghibliNFTContractAddress', userAddress)
      localStorage.setItem('ghibliNFTDeploymentTx', transactionId)

      return {
        success: true,
        contractAddress: userAddress,
        transactionId
      }
    } else {
      throw new Error(`Deployment failed with status: ${transaction.status}`)
    }
  } catch (error) {
    console.error('❌ Contract deployment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Deployment failed'
    }
  }
}

export async function getGhibliNFTContractAddress(): Promise<string | null> {
  try {
    // First check localStorage for cached address
    const cachedAddress = localStorage.getItem('ghibliNFTContractAddress')
    if (cachedAddress) {
      // Verify the contract is still deployed
      const isDeployed = await fcl.query({
        cadence: CHECK_CONTRACT_SCRIPT,
        args: (arg, t) => [
          arg(cachedAddress, t.Address),
          arg('GhibliNFT', t.String)
        ]
      })

      if (isDeployed) {
        console.log('📍 Using cached contract address:', cachedAddress)
        return cachedAddress
      } else {
        // Clear invalid cache
        localStorage.removeItem('ghibliNFTContractAddress')
        localStorage.removeItem('ghibliNFTDeploymentTx')
      }
    }

    // Check if user has deployed the contract
    const user = await fcl.currentUser.snapshot()
    if (user.loggedIn) {
      const contractAddress = await fcl.query({
        cadence: GET_CONTRACT_ADDRESS_SCRIPT,
        args: (arg, t) => [
          arg(user.addr, t.Address),
          arg('GhibliNFT', t.String)
        ]
      })

      if (contractAddress) {
        console.log('📍 Found deployed contract at:', contractAddress)
        localStorage.setItem('ghibliNFTContractAddress', contractAddress)
        return contractAddress
      }
    }

    return null
  } catch (error) {
    console.error('Error getting contract address:', error)
    return null
  }
}

export async function ensureContractDeployed(): Promise<string> {
  console.log('🔍 Checking for deployed GhibliNFT contract...')
  
  let contractAddress = await getGhibliNFTContractAddress()
  
  if (!contractAddress) {
    console.log('📦 Contract not found, deploying...')
    const deployResult = await deployGhibliNFTContract()
    
    if (!deployResult.success) {
      throw new Error(`Contract deployment failed: ${deployResult.error}`)
    }
    
    contractAddress = deployResult.contractAddress!
  }
  
  console.log('✅ GhibliNFT contract ready at:', contractAddress)
  return contractAddress
}