'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Gift, Star, Zap, Trophy, Crown } from 'lucide-react'
import { Button } from './ui/button'
import { sponsorAnalytics } from '../lib/sponsor-analytics'

interface FlowSponsor {
  id: string
  name: string
  logo: string
  description: string
  offer: string
  cta: string
  url: string
  color: string
  icon: React.ReactNode
  badge?: string
}

const FLOW_SPONSORS: FlowSponsor[] = [
  {
    id: 'poap',
    name: 'POAP',
    logo: '🏆',
    description: 'Proof of Attendance Protocol',
    offer: 'Claim your exclusive Ghibli Creator POAP',
    cta: 'Claim POAP',
    url: 'https://poap.xyz',
    color: 'from-purple-500 to-pink-500',
    icon: <Trophy className="w-5 h-5" />,
    badge: 'Limited Edition'
  },
  {
    id: 'nba-topshot',
    name: 'NBA Top Shot',
    logo: '🏀',
    description: 'Official NBA Digital Collectibles',
    offer: 'Get 20% off your first NBA Top Shot pack',
    cta: 'Shop NBA',
    url: 'https://nbatopshot.com',
    color: 'from-red-500 to-orange-500',
    icon: <Star className="w-5 h-5" />,
    badge: 'Exclusive'
  },
  {
    id: 'pinnacle',
    name: 'Pinnacle',
    logo: '⚽',
    description: 'Premier Football NFTs',
    offer: 'Free starter pack for new collectors',
    cta: 'Get Pack',
    url: 'https://pinnacle.xyz',
    color: 'from-green-500 to-emerald-500',
    icon: <Gift className="w-5 h-5" />,
    badge: 'Free'
  },
  {
    id: 'flowty',
    name: 'Flowty',
    logo: '💎',
    description: 'Flow NFT Marketplace',
    offer: 'Zero fees on your first NFT sale',
    cta: 'List NFT',
    url: 'https://flowty.io',
    color: 'from-blue-500 to-cyan-500',
    icon: <Zap className="w-5 h-5" />,
    badge: '0% Fees'
  },
  {
    id: 'matrix-world',
    name: 'Matrix World',
    logo: '🌐',
    description: 'Virtual World on Flow',
    offer: 'Free land plot for NFT creators',
    cta: 'Claim Land',
    url: 'https://matrixworld.org',
    color: 'from-indigo-500 to-purple-500',
    icon: <Crown className="w-5 h-5" />,
    badge: 'Creator Bonus'
  },
  {
    id: 'flovatar',
    name: 'Flovatar',
    logo: '👤',
    description: 'Flow Avatar NFTs',
    offer: 'Create your Flow avatar with 50% off',
    cta: 'Create Avatar',
    url: 'https://flovatar.com',
    color: 'from-pink-500 to-rose-500',
    icon: <Star className="w-5 h-5" />,
    badge: '50% Off'
  }
]

interface FlowSponsorPopupProps {
  isOpen: boolean
  onClose: () => void
  onSponsorClick?: (sponsor: FlowSponsor) => void
  userAddress?: string
  nftTransactionId?: string
}

export function FlowSponsorPopup({ isOpen, onClose, onSponsorClick, userAddress, nftTransactionId }: FlowSponsorPopupProps) {
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showStartTime, setShowStartTime] = useState<number>(0)

  // Track popup open and sponsor views
  useEffect(() => {
    if (isOpen) {
      console.log('🎯 Sponsor popup opened')
      setShowStartTime(Date.now())
      // Track initial sponsor view
      const currentSponsor = FLOW_SPONSORS[currentSponsorIndex]
      sponsorAnalytics.trackSponsorView(currentSponsor.id, currentSponsor.name, userAddress)
    } else {
      console.log('❌ Sponsor popup closed')
    }
  }, [isOpen, userAddress])

  // Track sponsor view changes
  useEffect(() => {
    if (isOpen) {
      const currentSponsor = FLOW_SPONSORS[currentSponsorIndex]
      sponsorAnalytics.trackSponsorView(currentSponsor.id, currentSponsor.name, userAddress)
    }
  }, [currentSponsorIndex, isOpen, userAddress])

  // Rotate through sponsors every 4 seconds
  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentSponsorIndex((prev) => (prev + 1) % FLOW_SPONSORS.length)
        setIsAnimating(false)
      }, 200)
    }, 4000)

    return () => clearInterval(interval)
  }, [isOpen])

  const currentSponsor = FLOW_SPONSORS[currentSponsorIndex]

  const handleSponsorClick = (sponsor: FlowSponsor) => {
    // Track sponsor click
    sponsorAnalytics.trackSponsorClick(sponsor.id, sponsor.name, userAddress, nftTransactionId)
    
    if (onSponsorClick) {
      onSponsorClick(sponsor)
    }
    window.open(sponsor.url, '_blank')
  }

  const handleClose = () => {
    console.log('🔄 Closing sponsor popup')
    // Track popup close with time spent
    if (showStartTime > 0) {
      const timeSpent = Date.now() - showStartTime
      const currentSponsor = FLOW_SPONSORS[currentSponsorIndex]
      sponsorAnalytics.trackSponsorClose(currentSponsor.id, currentSponsor.name, timeSpent)
    }
    onClose()
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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Gift className="w-8 h-8" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">🎉 Exclusive Flow Offers!</h2>
              <p className="text-blue-100">Special deals from the Flow ecosystem</p>
            </div>

            {/* Sponsor Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSponsor.id}
                  initial={{ opacity: 0, x: isAnimating ? 20 : 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  {/* Sponsor Logo & Badge */}
                  <div className="relative inline-block mb-4">
                    <div className="text-6xl mb-2">{currentSponsor.logo}</div>
                    {currentSponsor.badge && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {currentSponsor.badge}
                      </div>
                    )}
                  </div>

                  {/* Sponsor Info */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentSponsor.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{currentSponsor.description}</p>

                  {/* Offer */}
                  <div className={`bg-gradient-to-r ${currentSponsor.color} p-4 rounded-2xl text-white mb-6`}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {currentSponsor.icon}
                      <span className="font-semibold">Special Offer</span>
                    </div>
                    <p className="text-lg">{currentSponsor.offer}</p>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSponsorClick(currentSponsor)}
                    className={`w-full py-4 bg-gradient-to-r ${currentSponsor.color} hover:opacity-90 text-white border-0 rounded-xl text-lg font-semibold group mb-4`}
                  >
                    {currentSponsor.cta}
                    <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </AnimatePresence>

              {/* Sponsor Indicators */}
              <div className="flex justify-center gap-2 mb-4">
                {FLOW_SPONSORS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSponsorIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSponsorIndex 
                        ? 'bg-blue-500 w-6' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-500">
                <p>Powered by Flow Ecosystem Partners</p>
                <div className="flex justify-center gap-4 mt-2">
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={() => handleSponsorClick(currentSponsor)}
                    className="text-blue-500 hover:text-blue-600 transition-colors font-medium"
                  >
                    Explore Offer
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute top-20 left-6 w-2 h-2 bg-yellow-400 rounded-full opacity-60"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div
              className="absolute bottom-20 right-8 w-3 h-3 bg-pink-400 rounded-full opacity-50"
              animate={{
                y: [0, -15, 0],
                x: [0, 5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}