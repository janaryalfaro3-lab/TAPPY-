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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 shadow-2xl rounded-3xl overflow-hidden p-6 md:p-8 space-y-6 text-white ring-1 ring-white/10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] uppercase font-mono tracking-widest font-bold rounded-full">
            <Radio className="w-3 h-3 animate-pulse text-sky-400" />
            Interactive Tap Simulator
          </div>
          <h3 className="font-display text-2xl font-extrabold tracking-tight text-white">
            Experience the One-Tap Flow
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto tracking-wide">
            Click on the Acrylic Standee below to simulate tapping an iPhone or Android smartphone within 2–4 cm.
          </p>
        </div>

        {/* Visual Stage */}
        <div className="relative h-96 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-center overflow-hidden [perspective:1000px] p-4">
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
                    className="absolute -top-6 -right-12 w-28 h-48 bg-slate-900 border-2 border-sky-400 rounded-2xl shadow-xl p-2.5 z-30 flex flex-col items-center justify-center text-center"
                  >
                    <Radio className="w-8 h-8 animate-ping text-sky-400" />
                    <span className="text-[9px] font-mono text-sky-300 font-bold mt-2">
                      NFC DETECTED
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-950 bg-white hover:bg-slate-200 rounded-xl px-5 py-2.5 transition-colors inline-flex items-center gap-2 shadow-sm cursor-pointer">
                  <Radio className="w-3.5 h-3.5 text-sky-500" />
                  {isTapping ? 'Reading NTAG213 Chip...' : 'Click to Tap Phone on Stand'}
                </span>
                <span className="text-[11px] text-slate-400 block font-mono">
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
              className="w-full max-w-sm p-6 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl relative z-10 text-white"
            >
              {!submitted ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        Your Business Name
                      </h4>
                      <p className="text-[10px] text-sky-400 font-medium">
                        Google Maps Verified
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[9px] font-mono rounded font-bold">
                      Live Modal
                    </span>
                  </div>

                  <div className="text-center py-2 space-y-2 border-y border-slate-800 bg-slate-950/60 rounded-xl p-3">
                    <p className="text-xs text-slate-300 font-medium">
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
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSubmitted(true)}
                    className="w-full py-3 text-[11px] uppercase tracking-[0.14em] font-bold text-slate-950 bg-white hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Post Review to Google</span>
                    <Check className="w-3.5 h-3.5 text-slate-950" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    5-Star Review Published
                  </h4>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto">
                    Customer left 5 stars directly on your Google Maps profile in seconds.
                  </p>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:underline pt-2 cursor-pointer font-medium"
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
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 font-mono">
          <span>iPhone iOS 13+ & Android 5.0+ Supported</span>
          <button
            onClick={onClose}
            className="text-sky-400 hover:text-white transition-colors cursor-pointer font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
