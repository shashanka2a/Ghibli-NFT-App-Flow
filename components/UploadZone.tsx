import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadZoneProps {
  onImageUpload: (file: File) => void;
}

export function UploadZone({ onImageUpload }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageUpload(imageFile);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Upload Your Ghibli Moment
            </h1>
            <p className="text-lg text-slate-600">
              Transform your memories into magical Studio Ghibli-style art
            </p>
          </motion.div>
        </div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`
            relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 max-w-lg mx-auto
            ${isDragOver 
              ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 scale-105' 
              : 'border-slate-300 bg-gradient-to-br from-slate-50 to-emerald-50 hover:border-emerald-300'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <motion.div
            animate={{ 
              y: isDragOver ? -10 : 0,
              scale: isDragOver ? 1.1 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isDragOver ? (
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
            ) : (
              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            )}
          </motion.div>

          <h3 className="text-lg mb-2 text-slate-700">
            {isDragOver ? 'Drop your image here' : 'Drag & drop your image'}
          </h3>
          
          <p className="text-slate-500 mb-6">
            or click to browse your files
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Upload className="w-5 h-5" />
            Choose File
          </motion.button>

          <div className="mt-6 text-sm text-slate-400">
            Supports: JPG, PNG, WebP (max 10MB)
          </div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-3 h-3 bg-emerald-300 rounded-full opacity-60"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <motion.div
          className="absolute top-32 right-16 w-2 h-2 bg-teal-400 rounded-full opacity-50"
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
      </div>
    </div>
  );
}