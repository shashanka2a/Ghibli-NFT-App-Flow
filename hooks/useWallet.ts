'use client'

import { useFlowWallet } from '../components/providers/WalletProvider'

export function useWallet() {
  const { user, isConnected, address, connect, disconnect, authenticate } = useFlowWallet()
  
  return {
    user,
    isConnected,
    address,
    connect,
    disconnect,
    authenticate,
    wallet: user
  }
}