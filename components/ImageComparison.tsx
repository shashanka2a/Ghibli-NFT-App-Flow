import React from 'react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from './ImageWithFallback';

interface ImageComparisonProps {
  originalImage: string;
  transformedImage: string;
}

export function ImageComparison({ originalImage, transformedImage }: ImageComparisonProps) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Original Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-300 to-slate-400 rounded-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
          <div className="relative bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="aspect-square">
              <ImageWithFallback
                src={originalImage}
                alt="Original image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                Original
              </span>
            </div>
          </div>
        </motion.div>

        {/* Transformed Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
          <div className="relative bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="aspect-square">
              <ImageWithFallback
                src={transformedImage}
                alt="Ghibli-style transformed image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full text-sm">
                ✨ Ghibli Style
              </span>
            </div>
          </div>

          {/* Magical sparkle effects */}
          <motion.div
            className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full"
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
            className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-emerald-400 rounded-full"
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
            className="absolute top-12 left-12 w-1 h-1 bg-teal-400 rounded-full"
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
        </motion.div>
      </div>

      {/* Transform Arrow */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block"
      >
        <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-emerald-200">
          <motion.span
            className="text-2xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            ✨
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}