import React from 'react';
import { motion } from 'framer-motion';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full" />
        <motion.div
          className="absolute inset-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
      <motion.p
        className="ml-4 text-slate-600"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Transforming your image with Ghibli magic...
      </motion.p>
    </div>
  );
}