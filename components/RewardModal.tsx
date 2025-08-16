'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, ExternalLink, Copy, Check, Sparkles, Trophy, Star } from 'lucide-react'
import { Button } from './ui/button'

interface RewardModalProps {
  isOpen: boolean
  onClose: () => void
  nftData: {
    name: string
    creator: string
    image: string
    transactionId: string
  }
}

interface Reward {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  value: string
  action: string
  actionUrl?: string
  claimed?: boolean
}

export function RewardModal({ isOpen, onClose, nftData }: RewardModalProps) {
  const [copiedTx, setCopiedTx] = useState(false)
  const [claimedRewards, setClaimedRewards] = useState<Set<string>>(new Set())

  const rewards: Reward[] = [
    {
      id: 'discount',
      title: 'Ghibli Store Discount',
      description: '15% off official merchandise',
      icon: <Gift className="w-5 h-5" />,
      value: '15% OFF',
      action: 'Claim Now',
      actionUrl: 'https://ghibli.jp/store'
    },
    {
      id: 'wallpapers',
      title: 'Exclusive Wallpapers',
      description: 'HD wallpaper collection',
      icon: <Sparkles className="w-5 h-5" />,
      value: '12 Images',
      action: 'Download',
      actionUrl: '#'
    },
    {
      id: 'credits',
      title: 'Bonus Credits',
      description: 'Extra transformation credits',
      icon: <Trophy className="w-5 h-5" />,
      value: '+5 Credits',
      action: 'Add to Account'
    },
    {
      id: 'print',
      title: 'Physical Print',
      description: 'Free premium print (limited time)',
      icon: <Star className="w-5 h-5" />,
      value: 'FREE',
      action: 'Order Print',
      actionUrl: '#'
    }
  ]

  const copyTransactionId = async () => {
    try {
      await navigator.clipboard.writeText(nftData.transactionId)
      setCopiedTx(true)
      setTimeout(() => setCopiedTx(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const claimReward = (rewardId: string, actionUrl?: string) => {
    setClaimedRewards(prev => new Set([...prev, rewardId]))
    
    if (actionUrl && actionUrl !== '#') {
      window.open(actionUrl, '_blank')
    }
  }

  const viewTransaction = () => {
    window.open(`https://flowscan.org/transaction/${nftData.transactionId}`, '_blank')
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-2">🎉 NFT Minted Successfully!</h2>
                <p className="text-emerald-100">Your exclusive rewards are now unlocked</p>
              </motion.div>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto">
              {/* NFT Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-8"
              >
                <img
                  src={nftData.image}
                  alt={nftData.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{nftData.name}</h3>
                  <p className="text-slate-600">by {nftData.creator}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyTransactionId}
                    className="flex items-center gap-2"
                  >
                    {copiedTx ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedTx ? 'Copied!' : 'Copy TX'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={viewTransaction}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View
                  </Button>
                </div>
              </motion.div>

              {/* Rewards Grid */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-center mb-6">
                  🎁 Your Exclusive Rewards
                </h4>
                
                {rewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      claimedRewards.has(reward.id)
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        claimedRewards.has(reward.id)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {claimedRewards.has(reward.id) ? <Check className="w-5 h-5" /> : reward.icon}
                      </div>
                      <div>
                        <h5 className="font-semibold">{reward.title}</h5>
                        <p className="text-sm text-slate-600">{reward.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-600">{reward.value}</span>
                      <Button
                        size="sm"
                        onClick={() => claimReward(reward.id, reward.actionUrl)}
                        disabled={claimedRewards.has(reward.id)}
                        className={`${
                          claimedRewards.has(reward.id)
                            ? 'bg-emerald-500 hover:bg-emerald-500'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                        }`}
                      >
                        {claimedRewards.has(reward.id) ? 'Claimed' : reward.action}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex gap-3 mt-8 pt-6 border-t border-slate-200"
              >
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    const shareText = `Just minted my Ghibli-style NFT! 🎨✨\n\nCheck it out: https://flowscan.org/transaction/${nftData.transactionId}`
                    
                    if (navigator.share) {
                      navigator.share({
                        title: 'My Ghibli NFT',
                        text: shareText,
                        url: window.location.origin
                      })
                    } else {
                      navigator.clipboard.writeText(shareText)
                      alert('Share link copied to clipboard!')
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  Share NFT
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}