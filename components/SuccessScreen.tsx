import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Share2, User, ExternalLink, Download, Gift } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface SuccessScreenProps {
  nftImage: string;
  nftName?: string;
  transactionId?: string;
  onViewProfile: () => void;
  onShareNFT: () => void;
  onShowSponsors?: () => void;
}

export function SuccessScreen({ nftImage, nftName, transactionId, onViewProfile, onShareNFT, onShowSponsors }: SuccessScreenProps) {
  const [showCelebration, setShowCelebration] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowCelebration(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Celebration particles
  const celebrationParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    emoji: ['🎉', '✨', '🌟', '🎊', '💫'][i % 5],
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    startX: Math.random() * 100,
    endX: Math.random() * 100,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="w-full max-w-2xl relative">
        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-10">
            {celebrationParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute text-2xl"
                style={{ 
                  left: `${particle.startX}%`,
                  top: '-50px'
                }}
                initial={{ 
                  y: -50,
                  x: 0,
                  rotate: 0,
                  opacity: 1,
                  scale: 0
                }}
                animate={{ 
                  y: [0, window.innerHeight + 100],
                  x: [0, (particle.endX - particle.startX) * 3],
                  rotate: [0, 720],
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1, 0]
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: "easeOut"
                }}
              >
                {particle.emoji}
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Success Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full mb-8 shadow-lg"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Trophy className="w-6 h-6" />
            </motion.div>
            <span className="text-lg">NFT Successfully Minted!</span>
          </motion.div>

          {/* NFT Spotlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mb-8"
          >
            {/* Spotlight effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl opacity-20"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-md mx-auto">
              <div className="aspect-square rounded-xl overflow-hidden mb-4">
                <ImageWithFallback
                  src={nftImage}
                  alt="Minted NFT"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl">{nftName || 'Ghibli Moment'}</h3>
                <p className="text-slate-600">Your magical transformation</p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                  <span>Edition 1 of 1</span>
                  <span>•</span>
                  <span>Blockchain: Flow</span>
                </div>
                {transactionId && (
                  <div className="text-xs text-slate-400 font-mono">
                    TX: {transactionId.slice(0, 8)}...{transactionId.slice(-6)}
                  </div>
                )}
              </div>

              {/* Floating sparkles around NFT */}
              <motion.div
                className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 0
                }}
              />
              <motion.div
                className="absolute -bottom-2 -left-2 w-2 h-2 bg-emerald-400 rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 0.7
                }}
              />
              <motion.div
                className="absolute top-4 -left-3 w-2 h-2 bg-teal-400 rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 1.3
                }}
              />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto"
          >
            {/* View Profile Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onViewProfile}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl py-4 px-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <User className="w-5 h-5" />
              <span>View Profile</span>
            </motion.button>

            {/* Share NFT Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onShareNFT}
              className="flex items-center justify-center gap-3 bg-white border-2 border-emerald-200 text-emerald-700 rounded-xl py-4 px-6 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300"
            >
              <Share2 className="w-5 h-5" />
              <span>Share NFT</span>
            </motion.button>
          </motion.div>

          {/* Additional Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex items-center justify-center gap-6 mt-8 text-sm"
          >
            <button className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors">
              <Download className="w-4 h-4" />
              Download
            </button>
            {onShowSponsors && (
              <button 
                onClick={onShowSponsors}
                className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors"
              >
                <Gift className="w-4 h-4" />
                Flow Offers
              </button>
            )}
            <button 
              onClick={() => transactionId && window.open(`https://flowscan.io/transaction/${transactionId}`, '_blank')}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors disabled:opacity-50"
              disabled={!transactionId}
            >
              <ExternalLink className="w-4 h-4" />
              View on FlowScan
            </button>
          </motion.div>

          {/* Congratulations Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-12 p-6 bg-white bg-opacity-60 rounded-2xl backdrop-blur-sm"
          >
            <h2 className="text-2xl mb-2">Congratulations! 🎉</h2>
            <p className="text-slate-600">
              Your image has been transformed into a beautiful Ghibli-style NFT and minted on the blockchain. 
              Share it with the world or keep it as a magical memory!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}