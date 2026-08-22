import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Radio, Star, Check, RotateCcw, X } from 'lucide-react';
import { ProductMockup } from './ProductMockup';

interface InteractiveTapDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveTapDemo: React.FC<InteractiveTapDemoProps> = ({ isOpen, onClose }) => {
  const [tapped, setTapped] = useState(false);
  const [isTapping, setIsTapping] = useState(false);
  const [selectedStars, setSelectedStars] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleTap = () => {
    setIsTapping(true);
    setTimeout(() => {
      setTapped(true);
      setIsTapping(false);
    }, 600);
  };

  const handleReset = () => {
    setTapped(false);
    setIsTapping(false);
    setSubmitted(false);
    setSelectedStars(5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-[#050505]/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-[#0E0E0E] border border-white/10 shadow-2xl overflow-hidden p-6 md:p-8 space-y-6 text-[#E0E0E0]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#949494] hover:text-[#E0E0E0] hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#141414] border border-white/10 text-[#2DD4BF] text-[10px] uppercase font-mono tracking-widest font-semibold">
            <Radio className="w-3 h-3 animate-pulse text-[#2DD4BF]" />
            Interactive Tap Simulator
          </div>
          <h3 className="font-display text-2xl font-bold tracking-tight text-[#E0E0E0]">
            Experience the One-Tap Flow
          </h3>
          <p className="text-xs text-[#949494] max-w-md mx-auto tracking-wide">
            Click on the Acrylic Standee below to simulate tapping an iPhone or Android smartphone within 2–4 cm.
          </p>
        </div>

        {/* Visual Stage */}
        <div className="relative h-96 bg-[#050505] border border-white/10 flex items-center justify-center overflow-hidden [perspective:1000px] p-4">
          {!tapped ? (
            /* Idle Stand / Prompt to Tap */
            <div
              onClick={handleTap}
              className="flex flex-col items-center cursor-pointer group p-4 text-center space-y-4 select-none relative z-10"
            >
              {/* True Product Mockup */}
              <div className="relative [transform-style:preserve-3d] group-hover:[transform:rotateX(4deg)_scale(1.04)] transition-transform duration-300">
                <ProductMockup format="stand" />

                {/* Approaching Phone during click */}
                {isTapping && (
                  <motion.div
                    initial={{ y: -120, opacity: 0, rotateZ: -15 }}
                    animate={{ y: 20, opacity: 1, rotateZ: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="absolute -top-6 -right-12 w-28 h-48 bg-[#0D0D0D] border-2 border-[#2DD4BF] rounded-2xl shadow-[0_0_30px_rgba(45,212,191,0.4)] p-2.5 z-30 flex flex-col items-center justify-center text-center"
                  >
                    <Radio className="w-8 h-8 animate-ping text-[#2DD4BF]" />
                    <span className="text-[9px] font-mono text-[#2DD4BF] font-bold mt-2">
                      NFC DETECTED
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#050505] bg-[#2DD4BF] hover:bg-[#14B8A6] px-5 py-2 transition-colors inline-flex items-center gap-2 shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                  <Radio className="w-3.5 h-3.5" />
                  {isTapping ? 'Reading NTAG213 Chip...' : 'Click to Tap Phone on Stand'}
                </span>
                <span className="text-[11px] text-[#949494] block font-mono">
                  No app required · Opens Google Maps in ~1s
                </span>
              </div>
            </div>
          ) : (
            /* Tapped State: Review Prompt */
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-sm p-6 bg-[#121212] border border-white/20 shadow-2xl relative z-10 text-[#E0E0E0]"
            >
              {!submitted ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-xs font-semibold text-[#E0E0E0]">
                        Your Business Name
                      </h4>
                      <p className="text-[10px] text-[#2DD4BF]">
                        Google Maps Verified
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[9px] font-mono">
                      Live Modal
                    </span>
                  </div>

                  <div className="text-center py-2 space-y-2 border-y border-white/10 bg-[#080808] p-3">
                    <p className="text-xs text-[#949494]">
                      Rate your experience on Google
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-[#FBBC05]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setSelectedStars(star)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= selectedStars
                                ? 'fill-[#FBBC05] text-[#FBBC05]'
                                : 'text-[#444]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSubmitted(true)}
                    className="w-full py-3 text-[11px] uppercase tracking-[0.14em] font-semibold text-[#050505] bg-[#2DD4BF] hover:bg-[#14B8A6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Post Review to Google</span>
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="w-10 h-10 bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#E0E0E0]">
                    5-Star Review Published
                  </h4>
                  <p className="text-xs text-[#949494] max-w-xs mx-auto">
                    Customer left 5 stars directly on your Google Maps profile in seconds.
                  </p>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-xs text-[#2DD4BF] hover:underline pt-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Simulator
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Footer info in simulator */}
        <div className="flex items-center justify-between text-xs text-[#949494] pt-2 border-t border-white/10 font-mono">
          <span>iPhone iOS 13+ & Android 5.0+ Supported</span>
          <button
            onClick={onClose}
            className="text-[#2DD4BF] hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
