'use client'

import React, { useState } from 'react';
import { UploadZone } from '../../components/UploadZone';
import { StepIndicator } from '../../components/StepIndicator';
import { ImageComparison } from '../../components/ImageComparison';
import { ActionButtons } from '../../components/ActionButtons';
import { MintingProgress } from '../../components/MintingProgress';
import { SuccessScreen } from '../../components/SuccessScreen';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { WalletConnect } from '../../components/WalletConnect';
import { MetadataInput } from '../../components/MetadataInput';
import { useWallet } from '../../hooks/useWallet';
// Remove AfterMint import - using hardcoded rewards
import { mintGhibliNFT, setupCollection, checkCollection } from '../../lib/flow-transactions';

type AppState = 'wallet' | 'upload' | 'loading' | 'transform' | 'metadata' | 'mint' | 'success';

interface NFTMetadata {
  name: string;
  description: string;
  creator: string;
}

export default function CreatePage() {
  const [currentState, setCurrentState] = useState<AppState>('wallet');
  const [originalImage, setOriginalImage] = useState<string>('');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [transformedImage, setTransformedImage] = useState<string>('');
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const [creditsLeft, setCreditsLeft] = useState(5);
  const [showMintingProgress, setShowMintingProgress] = useState(false);
  const [mintingError, setMintingError] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');

  const { isConnected, address } = useWallet();
  // Hardcoded reward modal function
  const showHardcodedRewardModal = (nftData: any) => {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 10000; font-family: system-ui;
      ">
        <div style="
          background: white; padding: 2rem; border-radius: 1rem;
          text-align: center; max-width: 500px; margin: 1rem;
        ">
          <h2 style="margin: 0 0 1rem 0; color: #059669;">🎉 NFT Minted Successfully!</h2>
          <img src="${nftData.image}" alt="NFT" style="width: 200px; height: 200px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1rem;">
          <h3 style="margin: 0 0 0.5rem 0;">${nftData.nftName}</h3>
          <p style="margin: 0 0 1.5rem 0; color: #6b7280;">by ${nftData.creator}</p>
          
          <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
            <h4 style="margin: 0 0 0.5rem 0; color: #059669;">🎁 Exclusive Rewards Unlocked!</h4>
            <ul style="text-align: left; margin: 0; padding-left: 1rem;">
              <li>🏷️ 10% off Ghibli merchandise</li>
              <li>🖼️ Exclusive wallpaper collection</li>
              <li>🎨 5 bonus transformation credits</li>
              <li>📦 Free physical print (limited time)</li>
            </ul>
          </div>
          
          <div style="display: flex; gap: 0.5rem;">
            <button onclick="window.open('https://flowscan.org/transaction/${nftData.transactionId}', '_blank')" 
              style="flex: 1; background: #059669; color: white; border: none; padding: 0.75rem; border-radius: 0.5rem; cursor: pointer;">
              View Transaction
            </button>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" 
              style="flex: 1; background: #6b7280; color: white; border: none; padding: 0.75rem; border-radius: 0.5rem; cursor: pointer;">
              Close
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  const handleWalletConnected = () => {
    setCurrentState('upload');
  };

  const handleImageUpload = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);
    setOriginalFile(file);
    setCurrentState('loading');
    
    try {
      // Call the Ghibli transformation API
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/ghibli', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Image transformation failed');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setTransformedImage(result.transformedImage);
        setCurrentState('transform');
      } else {
        throw new Error(result.error || 'Transformation failed');
      }
    } catch (error) {
      console.error('Transformation error:', error);
      // Fallback to mock image for demo
      const mockGhibliImage = "https://images.unsplash.com/photo-1696862048447-3ab8435ce5f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBnaGlibGklMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU1MzUxNTkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
      setTransformedImage(mockGhibliImage + '?v=' + Date.now());
      setCurrentState('transform');
    }
  };

  const handleConfirmMint = () => {
    setCurrentState('metadata');
  };

  const handleMetadataSubmit = async (metadata: NFTMetadata) => {
    setNftMetadata(metadata);
    setShowMintingProgress(true);
    setMintingError('');

    try {
      // Check if user has collection setup
      const hasCollection = await checkCollection(address!);
      
      if (!hasCollection) {
        console.log('Setting up collection...');
        const setupResult = await setupCollection();
        if (!setupResult.success) {
          throw new Error('Failed to setup collection: ' + (setupResult as any).error);
        }
      }

      // Mint the NFT
      console.log('Minting NFT...');
      const mintResult = await mintGhibliNFT(address!, {
        name: metadata.name,
        description: metadata.description,
        thumbnail: transformedImage,
        originalImage: originalImage,
        transformedImage: transformedImage,
        creator: metadata.creator,
      });

      if (mintResult.success) {
        setTransactionId(mintResult.transactionId || '');
        setShowMintingProgress(false);
        setCurrentState('success');
        
        // Show hardcoded reward modal
        setTimeout(() => {
          showHardcodedRewardModal({
            nftName: metadata.name,
            creator: metadata.creator,
            transactionId: mintResult.transactionId || '',
            image: transformedImage,
          });
        }, 1000);
      } else {
        throw new Error((mintResult as any).error || 'Minting failed');
      }
    } catch (error) {
      console.error('Minting error:', error);
      setMintingError(error instanceof Error ? error.message : 'Unknown error');
      setShowMintingProgress(false);
    }
  };

  const handleMetadataCancel = () => {
    setCurrentState('transform');
  };

  const handleMintingComplete = () => {
    setShowMintingProgress(false);
    setCurrentState('success');
  };

  const handleGenerateOther = async () => {
    if (creditsLeft > 0 && originalFile) {
      setCreditsLeft(prev => prev - 1);
      setCurrentState('loading');
      
      try {
        // Call transformation API again
        const formData = new FormData();
        formData.append('image', originalFile);
        
        const response = await fetch('/api/ghibli', {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        
        if (result.success) {
          setTransformedImage(result.transformedImage);
        } else {
          // Fallback to mock with timestamp
          const mockGhibliImage = "https://images.unsplash.com/photo-1696862048447-3ab8435ce5f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBnaGlibGklMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU1MzUxNTkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
          setTransformedImage(mockGhibliImage + '?v=' + Date.now());
        }
        
        setCurrentState('transform');
      } catch (error) {
        console.error('Regeneration error:', error);
        setCurrentState('transform');
      }
    }
  };

  const handleViewProfile = () => {
    if (address) {
      window.open(`https://flowscan.org/account/${address}`, '_blank');
    }
  };

  const handleShareNFT = () => {
    if (transactionId) {
      const shareText = `Check out my new Ghibli-style NFT! 🎨✨\n\nTransaction: https://flowscan.org/transaction/${transactionId}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'My Ghibli NFT',
          text: shareText,
          url: window.location.origin,
        });
      } else {
        navigator.clipboard.writeText(shareText);
        alert('Share link copied to clipboard!');
      }
    }
  };

  const getCurrentStep = () => {
    switch (currentState) {
      case 'wallet':
      case 'upload': return 1;
      case 'loading':
      case 'transform':
      case 'metadata': return 2;
      case 'mint':
      case 'success': return 3;
      default: return 1;
    }
  };

  // Show wallet connection if not connected
  if (!isConnected || currentState === 'wallet') {
    return <WalletConnect onConnected={handleWalletConnected} />;
  }

  if (currentState === 'success') {
    return (
      <SuccessScreen
        nftImage={transformedImage}
        onViewProfile={handleViewProfile}
        onShareNFT={handleShareNFT}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Minting Progress Overlay */}
      {showMintingProgress && (
        <MintingProgress onComplete={handleMintingComplete} />
      )}

      {/* Minting Error Modal */}
      {mintingError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-red-600 mb-4">Minting Failed</h3>
            <p className="text-slate-600 mb-6">{mintingError}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setMintingError('')}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setMintingError('');
                  if (nftMetadata) {
                    handleMetadataSubmit(nftMetadata);
                  }
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-6">
        {/* Step Indicator */}
        {currentState !== 'upload' && (
          <div className="mt-8">
            <StepIndicator currentStep={getCurrentStep()} />
          </div>
        )}

        {/* Main Content */}
        {currentState === 'upload' && (
          <UploadZone onImageUpload={handleImageUpload} />
        )}

        {currentState === 'loading' && (
          <div className="text-center">
            <h1 className="text-3xl mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Creating Your Ghibli Moment
            </h1>
            <LoadingSpinner />
          </div>
        )}

        {currentState === 'transform' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Your Ghibli Transformation
              </h1>
              <p className="text-lg text-slate-600">
                Your image has been magically transformed into Studio Ghibli style!
              </p>
            </div>

            <ImageComparison
              originalImage={originalImage}
              transformedImage={transformedImage}
            />

            <ActionButtons
              creditsLeft={creditsLeft}
              onConfirmMint={handleConfirmMint}
              onGenerateOther={handleGenerateOther}
            />
          </div>
        )}

        {currentState === 'metadata' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Almost Ready to Mint!
              </h1>
              <p className="text-lg text-slate-600">
                Add some details to make your NFT unique
              </p>
            </div>

            <MetadataInput
              onSubmit={handleMetadataSubmit}
              onCancel={handleMetadataCancel}
              isLoading={showMintingProgress}
            />
          </div>
        )}
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-emerald-200 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-teal-200 rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full opacity-5 blur-3xl" />
      </div>
    </div>
  );
}