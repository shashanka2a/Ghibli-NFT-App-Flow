import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Wallet, ExternalLink, CheckCircle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

interface WalletConnectProps {
  onConnected: () => void;
}

export function WalletConnect({ onConnected }: WalletConnectProps) {
  const { isConnected, address, connect, disconnect, user } = useWallet();

  React.useEffect(() => {
    console.log('WalletConnect state:', { isConnected, address, user });
    if (isConnected && address) {
      console.log('Wallet connected, calling onConnected');
      onConnected();
    }
  }, [isConnected, address, onConnected]);

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-emerald-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white shadow-xl border-0">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Wallet className="w-8 h-8 text-white" />
            </motion.div>
            
            <h2 className="text-3xl mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Connect Your Wallet
            </h2>
            <p className="text-slate-600">
              Connect your Flow wallet to start creating and minting Ghibli-style NFTs
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="w-full">
              <DynamicWidget />
            </div>
            
            {!isConnected && (
              <div className="text-center text-sm text-slate-500">
                <p>Supported wallets:</p>
                <div className="flex justify-center gap-4 mt-2">
                  <span className="px-3 py-1 bg-slate-100 rounded-full">Blocto</span>
                  <span className="px-3 py-1 bg-slate-100 rounded-full">Lilico</span>
                  <span className="px-3 py-1 bg-slate-100 rounded-full">Flow Wallet</span>
                </div>
              </div>
            )}

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6 mt-6"
              >
                {/* Connected Status */}
                <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 p-4 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Wallet Connected</span>
                </div>

                {/* Wallet Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Address:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-white px-2 py-1 rounded">
                        {formatAddress(address || '')}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://flowscan.org/account/${address}`, '_blank')}
                        className="p-1 h-auto"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {user?.loggedIn && (
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Status:</span>
                      <span className="text-emerald-600 font-medium">Authenticated</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={onConnected}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 rounded-xl"
                  >
                    Continue to Create NFT
                  </Button>
                  
                  <Button
                    onClick={disconnect}
                    variant="outline"
                    className="w-full py-3 rounded-xl border-slate-300 hover:bg-slate-50"
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200"
          >
            <p className="text-sm text-blue-800 text-center">
              🔒 Your wallet connection is secure and encrypted. We never store your private keys.
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}