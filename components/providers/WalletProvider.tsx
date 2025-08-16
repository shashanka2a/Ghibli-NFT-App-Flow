'use client'

import { ReactNode, createContext, useContext, useState } from 'react'

interface WalletProviderProps {
  children: ReactNode
}

// Mock wallet context for demo (no API keys needed)
interface MockWalletContext {
  isConnected: boolean
  address: string | null
  connect: () => void
  disconnect: () => void
}

const WalletContext = createContext<MockWalletContext>({
  isConnected: false,
  address: null,
  connect: () => {},
  disconnect: () => {}
})

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)

  const connect = () => {
    // Mock wallet connection
    setIsConnected(true)
    setAddress('0x1234567890abcdef') // Mock Flow address
    console.log('🔗 Mock wallet connected (no API keys needed)')
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    console.log('🔌 Mock wallet disconnected')
  }

  return (
    <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

// Export hook for components to use
export function useMockWallet() {
  return useContext(WalletContext)
}