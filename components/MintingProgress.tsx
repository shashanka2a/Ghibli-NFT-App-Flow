import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

interface MintingProgressProps {
  onComplete: () => void;
}

const mintingSteps = [
  { id: 1, label: 'Connecting to blockchain...', duration: 2000 },
  { id: 2, label: 'Uploading to IPFS...', duration: 3000 },
  { id: 3, label: 'Creating NFT metadata...', duration: 2500 },
  { id: 4, label: 'Minting NFT...', duration: 4000 },
  { id: 5, label: 'Done!', duration: 1000 }
];

export function MintingProgress({ onComplete }: MintingProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (currentStep < mintingSteps.length) {
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, currentStep]);
        setCurrentStep(prev => prev + 1);
      }, mintingSteps[currentStep]?.duration || 1000);

      return () => clearTimeout(timer);
    } else {
      // All steps completed
      setTimeout(onComplete, 1000);
    }
  }, [currentStep, onComplete]);

  // Confetti particles
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: ['#10b981', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5],
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    startX: Math.random() * 100,
    endX: Math.random() * 100,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden"
      >
        {/* Confetti Animation */}
        {currentStep >= mintingSteps.length && (
          <div className="absolute inset-0 pointer-events-none">
            {confettiParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: particle.color,
                  left: `${particle.startX}%`,
                  top: '-10px'
                }}
                initial={{ 
                  y: -10,
                  x: 0,
                  rotate: 0,
                  opacity: 1 
                }}
                animate={{ 
                  y: [0, 400],
                  x: [0, (particle.endX - particle.startX) * 2],
                  rotate: [0, 720],
                  opacity: [1, 0]
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}

        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center"
          >
            <span className="text-2xl">✨</span>
          </motion.div>
          
          <h2 className="text-2xl mb-2">Minting Your NFT</h2>
          <p className="text-slate-600">Please wait while we create your unique digital artwork</p>
        </div>

        <div className="space-y-4">
          {mintingSteps.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = completedSteps.includes(index);
            const isNext = currentStep > index;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                  ${isActive ? 'bg-emerald-50 border border-emerald-200' : 
                    isCompleted ? 'bg-emerald-100 border border-emerald-300' : 
                    'bg-slate-50'}
                `}
              >
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center
                  ${isCompleted ? 'bg-emerald-500 text-white' :
                    isActive ? 'bg-emerald-200 text-emerald-700' :
                    'bg-slate-200 text-slate-500'}
                `}>
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <span className="text-xs">{step.id}</span>
                  )}
                </div>

                <span className={`
                  ${isCompleted || isActive ? 'text-slate-800' : 'text-slate-500'}
                `}>
                  {step.label}
                </span>

                {isActive && (
                  <motion.div
                    className="ml-auto"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Progress</span>
            <span>{Math.round((completedSteps.length / mintingSteps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(completedSteps.length / mintingSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}