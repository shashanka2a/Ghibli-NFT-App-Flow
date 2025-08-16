import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Wand2, Sparkles } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: 'Upload', icon: Upload },
  { id: 2, label: 'Transform', icon: Wand2 },
  { id: 3, label: 'Mint NFT', icon: Sparkles }
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-8 mb-12">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <motion.div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center relative z-10
                  ${isCompleted 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                    : isActive 
                    ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-600 ring-4 ring-emerald-200'
                    : 'bg-slate-100 text-slate-400'
                  }
                `}
                animate={isActive ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>

              {/* Glow effect for active step */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-30"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.1, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              )}
            </motion.div>

            {/* Step Label */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`
                ml-3 text-sm font-medium
                ${isCompleted || isActive ? 'text-slate-700' : 'text-slate-400'}
              `}
            >
              {step.label}
            </motion.span>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isCompleted ? 1 : 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className={`
                  ml-6 w-16 h-0.5 origin-left
                  ${isCompleted 
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400' 
                    : 'bg-slate-200'
                  }
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}