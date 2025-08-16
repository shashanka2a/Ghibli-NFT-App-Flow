'use client'

import { ReactNode } from 'react'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { FlowWalletConnectors } from '@dynamic-labs/flow'

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || 'live_default',
        walletConnectors: [FlowWalletConnectors],
        initialAuthenticationMode: 'connect-only',
      }}
    >
      {children}
    </DynamicContextProvider>
  )
}