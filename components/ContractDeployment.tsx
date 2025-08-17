'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Rocket, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react'
import { deployGhibliNFTContract, getGhibliNFTContractAddress } from '../lib/contract-deployment'
import { useWallet } from '../hooks/useWallet'

interface ContractDeploymentProps {
  onDeploymentComplete?: (contractAddress: string) => void
}

export function ContractDeployment({ onDeploymentComplete }: ContractDeploymentProps) {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle')
  const [contractAddress, setContractAddress] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const { isConnected, address } = useWallet()

  useEffect(() => {
    // Check if contract is already deployed
    if (isConnected) {
      checkExistingDeployment()
    }
  }, [isConnected])

  const checkExistingDeployment = async () => {
    try {
      const existingAddress = await getGhibliNFTContractAddress()
      if (existingAddress) {
        setContractAddress(existingAddress)
        setDeploymentStatus('success')
        const cachedTx = localStorage.getItem('ghibliNFTDeploymentTx')
        if (cachedTx) {
          setTransactionId(cachedTx)
        }
      }
    } catch (error) {
      console.error('Error checking existing deployment:', error)
    }
  }

  const handleDeploy = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    setIsDeploying(true)
    setDeploymentStatus('deploying')
    setError(null)

    try {
      const result = await deployGhibliNFTContract()
      
      if (result.success) {
        setContractAddress(result.contractAddress!)
        setTransactionId(result.transactionId!)
        setDeploymentStatus('success')
        
        if (onDeploymentComplete) {
          onDeploymentComplete(result.contractAddress!)
        }
      } else {
        setError(result.error || 'Deployment failed')
        setDeploymentStatus('error')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
      setDeploymentStatus('error')
    } finally {
      setIsDeploying(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-800">Connect your wallet to deploy the GhibliNFT contract</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">GhibliNFT Contract</h3>
            <p className="text-sm text-slate-600">Deploy your NFT contract to Flow blockchain</p>
          </div>
        </div>

        {deploymentStatus === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium mb-2">What will be deployed:</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• GhibliNFT smart contract</li>
                <li>• NFT collection functionality</li>
                <li>• Metadata support</li>
                <li>• Minting capabilities</li>
              </ul>
            </div>
            
            <Button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Deploy Contract
            </Button>
          </motion.div>
        )}

        {deploymentStatus === 'deploying' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full mx-auto mb-4"
            />
            <h4 className="font-medium mb-2">Deploying Contract...</h4>
            <p className="text-sm text-slate-600">This may take a few moments</p>
          </motion.div>
        )}

        {deploymentStatus === 'success' && contractAddress && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Contract Deployed Successfully!</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Contract Address:</div>
                <div className="font-mono text-sm bg-white p-2 rounded border">
                  {contractAddress}
                </div>
              </div>

              {transactionId && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Transaction ID:</div>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    {transactionId}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(contractAddress)}
                className="flex-1"
              >
                Copy Address
              </Button>
              {transactionId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://flowscan.io/transaction/${transactionId}`, '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View on FlowScan
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {deploymentStatus === 'error' && error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Deployment Failed</span>
            </div>

            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-sm text-red-800">{error}</div>
            </div>

            <Button
              onClick={handleDeploy}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          </motion.div>
        )}
      </div>
    </Card>
  )
}