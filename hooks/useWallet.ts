'use client'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

export function useWallet() {
  const { primaryWallet, user, setShowAuthFlow, isAuthenticated } = useDynamicContext()
  
  const connect = () => {
    setShowAuthFlow(true)
  }
  
  const disconnect = async () => {
    if (primaryWallet) {
      await primaryWallet.disconnect()
    }
  }
  
  // Check if wallet is connected and authenticated
  const isConnected = !!primaryWallet && !!primaryWallet.address && isAuthenticated
  
  return {
    isConnected,
    address: primaryWallet?.address || null,
    user: user ? { addr: primaryWallet?.address, loggedIn: isAuthenticated } : null,
    connect,
    disconnect,
    wallet: primaryWallet
  }
}