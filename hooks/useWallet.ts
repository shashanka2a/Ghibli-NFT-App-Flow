'use client'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

export function useWallet() {
  const { primaryWallet, user, setShowAuthFlow } = useDynamicContext()
  
  const connect = () => {
    setShowAuthFlow(true)
  }
  
  const disconnect = async () => {
    if (primaryWallet) {
      await primaryWallet.disconnect()
    }
  }
  
  return {
    isConnected: !!primaryWallet,
    address: primaryWallet?.address || null,
    user: user ? { addr: primaryWallet?.address, loggedIn: true } : null,
    connect,
    disconnect,
    wallet: primaryWallet
  }
}