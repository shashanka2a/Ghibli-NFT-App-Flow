'use client'

import { ReactNode, createContext, useContext, useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'

// Configure FCL for Flow testnet
fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
  'flow.network': 'testnet',
  'app.detail.title': 'Mintari - Ghibli NFT Creator',
  'app.detail.icon': 'https://mintari.app/icon.png'
})

interface WalletProviderProps {
  children: ReactNode
}

interface FlowUser {
  addr: string | null
  loggedIn: boolean
  cid: string | null
  expiresAt: number | null
  f_type: string
  f_vsn: string
  services: any[]
}

interface WalletContextType {
  user: FlowUser | null
  isConnected: boolean
  address: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  authenticate: () => Promise<void>
}

const WalletContext = createContext<WalletContextType>({
  user: null,
  isConnected: false,
  address: null,
  connect: async () => {},
  disconnect: async () => {},
  authenticate: async () => {}
})

export function WalletProvider({ children }: WalletProviderProps) {
  const [user, setUser] = useState<FlowUser | null>(null)

  useEffect(() => {
    // Subscribe to FCL user changes
    const unsubscribe = fcl.currentUser.subscribe(setUser)
    return () => unsubscribe()
  }, [])

  const connect = async () => {
    try {
      console.log('🔗 Connecting to Flow wallet...')
      await fcl.authenticate()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnect = async () => {
    try {
      console.log('🔌 Disconnecting Flow wallet...')
      await fcl.unauthenticate()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  const authenticate = async () => {
    try {
      console.log('🔐 Authenticating with Flow wallet...')
      await fcl.authenticate()
    } catch (error) {
      console.error('Failed to authenticate:', error)
    }
  }

  const isConnected = user?.loggedIn || false
  const address = user?.addr || null

  return (
    <WalletContext.Provider value={{
      user,
      isConnected,
      address,
      connect,
      disconnect,
      authenticate
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useFlowWallet() {
  return useContext(WalletContext)
}