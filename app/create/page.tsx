'use client'

import React, { useState, useEffect } from 'react';
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
import { RewardModal } from '../../components/RewardModal';
import { ContractDeployment } from '../../components/ContractDeployment';
import { FlowSponsorPopup } from '../../components/FlowSponsorPopup';
import { walrusAPI } from '../../lib/walrus-api';
import { ipfsUploader } from '../../lib/ipfs-upload';
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
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardModalData, setRewardModalData] = useState<any>(null);
  const [showSponsorPopup, setShowSponsorPopup] = useState(false);

  const { isConnected, address, wallet } = useWallet();

  // Debug wallet state
  useEffect(() => {
    console.log('Create page wallet state:', { isConnected, address, wallet });
  }, [isConnected, address, wallet]);

  // Debug sponsor popup state
  useEffect(() => {
    console.log('Sponsor popup state:', showSponsorPopup);
  }, [showSponsorPopup]);

  const handleWalletConnected = () => {
    console.log('handleWalletConnected called');
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
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setTransformedImage(result.transformedImage);
        console.log('🎨 Ghibli transformation completed:', {
          ipfsUpload: result.metadata?.ipfsUpload,
          walrusHash: result.metadata?.walrusHash,
          style: result.metadata?.style
        });
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
      // Step 1: Upload transformed image to IPFS (multiple providers)
      console.log('📤 Uploading transformed image to IPFS...');
      let imageUploadUrl = transformedImage;
      let ipfsImageHash = null;
      let ipfsProvider = null;

      try {
        const imageBlob = await fetch(transformedImage).then(r => r.blob());
        const imageFile = new File([imageBlob], `ghibli-${metadata.name}-${Date.now()}.jpg`, { type: 'image/jpeg' });

        // Try multiple IPFS providers
        const imageUpload = await ipfsUploader.uploadImage(imageFile);
        if (imageUpload.success && imageUpload.url) {
          imageUploadUrl = imageUpload.url;
          ipfsImageHash = imageUpload.hash;
          ipfsProvider = imageUpload.provider;
          console.log(`✅ Image uploaded to IPFS via ${ipfsProvider}:`, ipfsImageHash);
        } else {
          console.warn('⚠️ All IPFS providers failed, trying fallback...');

          // Try absolute fallback
          const fallbackUpload = await ipfsUploader.uploadToPublicGateway(imageFile);
          if (fallbackUpload.success) {
            imageUploadUrl = fallbackUpload.url;
            ipfsImageHash = fallbackUpload.hash;
            ipfsProvider = fallbackUpload.provider;
            console.log(`✅ Image uploaded via fallback (${ipfsProvider}):`, ipfsImageHash);
          }
        }
      } catch (error) {
        console.warn('⚠️ All upload methods failed, using original URL:', error);
      }

      // Step 2: Create and upload metadata JSON to Walrus IPFS
      console.log('📝 Uploading metadata to Walrus IPFS...');
      let metadataUploadUrl = null;
      let ipfsMetadataHash = null;

      try {
        const nftMetadataJson = {
          name: metadata.name,
          description: metadata.description,
          image: imageUploadUrl,
          creator: metadata.creator,
          attributes: [
            { trait_type: "Style", value: "Studio Ghibli" },
            { trait_type: "Creator", value: metadata.creator },
            { trait_type: "Transformation", value: "AI Generated" },
            ...(ipfsImageHash ? [{ trait_type: "IPFS Hash", value: ipfsImageHash }] : [])
          ],
          external_url: window.location.origin,
          created_at: new Date().toISOString(),
          ipfs: {
            imageHash: ipfsImageHash,
            metadataHash: null // Will be set after upload
          }
        };

        const metadataUpload = await walrusAPI.uploadJSON(nftMetadataJson, `metadata-${metadata.name}-${Date.now()}.json`);
        if (metadataUpload.success && metadataUpload.url) {
          metadataUploadUrl = metadataUpload.url;
          ipfsMetadataHash = metadataUpload.hash;
          console.log('✅ Metadata uploaded to Walrus IPFS:', ipfsMetadataHash);
        } else {
          console.warn('⚠️ Metadata upload failed, proceeding without IPFS metadata:', metadataUpload.error);
        }
      } catch (error) {
        console.warn('⚠️ Metadata upload error, proceeding without IPFS metadata:', error);
      }

      // Step 3: Check if user has collection setup
      const hasCollection = await checkCollection(address!);

      if (!hasCollection) {
        console.log('🔧 Setting up collection...');
        const setupResult = await setupCollection();
        if (!setupResult.success) {
          throw new Error('Failed to setup collection: ' + setupResult.error);
        }
      }

      // Step 4: Mint the NFT on Flow blockchain
      console.log('🎨 Minting NFT on Flow blockchain...');
      const mintResult = await mintGhibliNFT(address!, {
        name: metadata.name,
        description: metadata.description,
        thumbnail: imageUploadUrl,
        originalImage: originalImage,
        transformedImage: imageUploadUrl,
        creator: metadata.creator,
      });

      if (mintResult.success) {
        setTransactionId(mintResult.transactionId || '');
        setShowMintingProgress(false);
        setCurrentState('success');

        // Show professional reward modal
        setRewardModalData({
          name: metadata.name,
          creator: metadata.creator,
          image: imageUploadUrl,
          transactionId: mintResult.transactionId || '',
          ipfsHash: ipfsImageHash,
          metadataHash: ipfsMetadataHash
        });
        setShowRewardModal(true);

        // Show sponsor popup after reward modal with delay
        setTimeout(() => {
          console.log('⏰ Auto-showing sponsor popup after 3 seconds')
          setShowSponsorPopup(true);
        }, 3000); // 3 seconds after success (reduced for demo)

        // Also show immediately for testing (remove in production)
        setTimeout(() => {
          console.log('🧪 Test: Showing sponsor popup immediately')
          setShowSponsorPopup(true);
        }, 1000); // 1 second for immediate test
      } else {
        throw new Error(mintResult.error || 'Minting failed');
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
      window.open(`https://flowscan.io/account/${address}`, '_blank');
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
      <>
        <SuccessScreen
          nftImage={transformedImage}
          nftName={nftMetadata?.name}
          transactionId={transactionId}
          onViewProfile={handleViewProfile}
          onShareNFT={handleShareNFT}
          onShowSponsors={() => {
            console.log('🎯 Flow Offers button clicked, showing sponsor popup')
            setShowSponsorPopup(true)
          }}
        />

        {/* Debug: Test Sponsor Popup Button (remove in production) */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          <button
            onClick={() => {
              console.log('🧪 Debug: Manually triggering sponsor popup')
              setShowSponsorPopup(true)
            }}
            className="block w-full bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 text-sm"
          >
            Test Sponsors
          </button>
          <div className="text-xs text-center text-gray-600 bg-white px-2 py-1 rounded">
            Popup: {showSponsorPopup ? 'OPEN' : 'CLOSED'}
          </div>
        </div>

        {/* Flow Sponsor Popup (Rokt-style) */}
        <FlowSponsorPopup
          isOpen={showSponsorPopup}
          onClose={() => {
            console.log('🔄 Closing sponsor popup from success screen')
            setShowSponsorPopup(false)
          }}
          userAddress={address || undefined}
          nftTransactionId={transactionId || undefined}
          onSponsorClick={(sponsor) => {
            console.log('🎯 Sponsor engagement:', sponsor.name);
            // Additional custom tracking can be added here
          }}
        />
      </>
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

      {/* Professional Reward Modal */}
      {rewardModalData && (
        <RewardModal
          isOpen={showRewardModal}
          onClose={() => setShowRewardModal(false)}
          nftData={rewardModalData}
        />
      )}

      {/* Debug: Test Sponsor Popup Button (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => {
              console.log('🧪 Debug: Manually triggering sponsor popup')
              setShowSponsorPopup(true)
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600"
          >
            Test Sponsors
          </button>
        </div>
      )}

      {/* Flow Sponsor Popup (Rokt-style) */}
      <FlowSponsorPopup
        isOpen={showSponsorPopup}
        onClose={() => {
          console.log('🔄 Closing sponsor popup from create page')
          setShowSponsorPopup(false)
        }}
        userAddress={address || undefined}
        nftTransactionId={transactionId || undefined}
        onSponsorClick={(sponsor) => {
          console.log('🎯 Sponsor engagement:', sponsor.name);
          // Additional custom tracking can be added here
        }}
      />
    </div>
  );
}