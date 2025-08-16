import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, Coins } from 'lucide-react';

interface ActionButtonsProps {
  creditsLeft: number;
  onConfirmMint: () => void;
  onGenerateOther: () => void;
  isLoading?: boolean;
}

export function ActionButtons({ creditsLeft, onConfirmMint, onGenerateOther, isLoading }: ActionButtonsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-12">
      {/* Credits Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-2 mb-8"
      >
        <Coins className="w-5 h-5 text-yellow-500" />
        <span className="text-slate-600">
          <span className="text-yellow-600">{creditsLeft}</span> credits remaining
        </span>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Confirm & Mint Button */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirmMint}
          disabled={isLoading}
          className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {/* Background Animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />
          
          <div className="relative z-10 flex items-center justify-center gap-3">
            <motion.div
              animate={isLoading ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
            <div className="text-left">
              <div className="text-lg">Confirm & Mint</div>
              <div className="text-sm opacity-90">Create your NFT</div>
            </div>
          </div>

          {/* Sparkle Effects */}
          <motion.div
            className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full opacity-60"
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
            className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-white rounded-full opacity-50"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              delay: 1
            }}
          />
        </motion.button>

        {/* Generate Other Button */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGenerateOther}
          disabled={isLoading || creditsLeft <= 0}
          className="group relative overflow-hidden bg-white border-2 border-slate-200 text-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Background Animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />
          
          <div className="relative z-10 flex items-center justify-center gap-3">
            <motion.div
              whileHover={{ rotate: -180 }}
              transition={{ duration: 0.3 }}
            >
              <RotateCcw className="w-6 h-6 text-emerald-600" />
            </motion.div>
            <div className="text-left">
              <div className="text-lg">Generate Other</div>
              <div className="text-sm text-slate-500">Try different style</div>
            </div>
          </div>

          {creditsLeft <= 0 && (
            <div className="absolute inset-0 bg-slate-100 opacity-80 flex items-center justify-center rounded-xl">
              <span className="text-sm text-slate-500">No credits left</span>
            </div>
          )}
        </motion.button>
      </div>

      {/* Helper Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center text-sm text-slate-500 mt-6"
      >
        Each generation uses 1 credit. Minting is free!
      </motion.p>
    </div>
  );
}