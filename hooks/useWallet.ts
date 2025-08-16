'use client'

import { useMockWallet } from '../components/providers/WalletProvider'

export function useWallet() {
  const mockWallet = useMockWallet()
  
  return {
    isConnected: mockWallet.isConnected,
    address: mockWallet.address,
    user: mockWallet.isConnected ? { addr: mockWallet.address, loggedIn: true } : null,
    connect: mockWallet.connect,
    disconnect: mockWallet.disconnect,
  }
}