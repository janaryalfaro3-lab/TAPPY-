import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Radio, Star, Check, RotateCcw, X, ArrowLeft } from 'lucide-react';
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTap = () => {
    setIsTapping(true);
    setTimeout(() => {
      setTapped(true);
      setIsTapping(false);
    }, 500);
  };

  const handleReset = () => {
    setTapped(false);
    setIsTapping(false);
    setSubmitted(false);
    setSelectedStars(5);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden p-6 md:p-8 space-y-6 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 px-3 py-1.5 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
          aria-label="Exit Simulator"
        >
          <X className="w-3.5 h-3.5" />
          <span>Close</span>
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold rounded-full">
            <Radio className="w-3.5 h-3.5 text-sky-600" />
            <span>Interactive NFC Simulator</span>
          </div>
          <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Experience the One-Tap Flow
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click on the Acrylic Standee below to simulate tapping an iPhone or Android smartphone within 2–4 cm.
          </p>
        </div>

        {/* Visual Stage */}
        <div className="relative h-96 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden [perspective:1000px] p-4">
          {!tapped ? (
            /* Idle Stand / Prompt to Tap */
            <div
              onClick={handleTap}
              className="flex flex-col items-center cursor-pointer group p-4 text-center space-y-4 select-none relative z-10"
            >
              {/* Product Mockup */}
              <div className="relative [transform-style:preserve-3d] group-hover:[transform:rotateX(4deg)_scale(1.02)] transition-transform duration-300">
                <ProductMockup format="stand" />

                {/* Approaching Phone during click */}
                {isTapping && (
                  <motion.div
                    initial={{ y: -100, opacity: 0, rotateZ: -10 }}
                    animate={{ y: 20, opacity: 1, rotateZ: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="absolute -top-6 -right-12 w-28 h-44 bg-slate-900 border-2 border-sky-500 rounded-2xl shadow-xl p-2.5 z-30 flex flex-col items-center justify-center text-center text-white"
                  >
                    <Radio className="w-7 h-7 animate-ping text-sky-400" />
                    <span className="text-[10px] font-bold text-sky-300 mt-2">
                      NFC DETECTED
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl px-5 py-2.5 transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer">
                  <Radio className="w-3.5 h-3.5 text-sky-400" />
                  {isTapping ? 'Reading NTAG213 Chip...' : 'Click to Simulate Tap'}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Zero app install · Opens Google Maps profile in ~1s
                </span>
              </div>
            </div>
          ) : (
            /* Tapped State: Review Prompt */
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm p-6 bg-white border border-slate-200 rounded-xl shadow-lg relative z-10 text-slate-900"
            >
              {!submitted ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Your Business Name
                      </h4>
                      <p className="text-[11px] text-sky-700 font-medium">
                        Google Maps Verified
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] rounded font-semibold">
                      Live Modal
                    </span>
                  </div>

                  <div className="text-center py-2 space-y-2 border-y border-slate-100 bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600 font-medium">
                      Rate your experience on Google
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setSelectedStars(star)}
                          className="p-1 hover:scale-115 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= selectedStars
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSubmitted(true)}
                    className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Post Review to Google</span>
                    <Check className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    5-Star Review Published
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Customer left 5 stars directly on your Google Maps profile in seconds.
                  </p>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-xs text-sky-700 hover:underline pt-2 cursor-pointer font-semibold"
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
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
          <span>iPhone iOS 13+ & Android 5.0+ Supported</span>
          <button
            onClick={onClose}
            className="text-sky-700 hover:text-sky-800 transition-colors cursor-pointer font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Close Simulator</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
