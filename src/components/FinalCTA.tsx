import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface FinalCTAProps {
  onShopClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onShopClick }) => {
  return (
    <motion.section
      id="final-cta-section"
      className="py-24 sm:py-32 bg-[#050505] text-[#E0E0E0] border-b border-white/10"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center space-y-8">
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#2DD4BF] font-semibold">
            Ready to Boost Your Ratings?
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#E0E0E0]">
            Make Every Review One Tap Away.
          </h2>
          <p className="text-base text-[#949494] leading-relaxed tracking-wide">
            Choose from stands, tags, cards, or stickers. Ready out of the box with free Google link pre-programming.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            id="final-cta-shop-btn"
            onClick={onShopClick}
            className="bg-[#E0E0E0] hover:bg-white text-[#050505] px-8 py-4 text-[12px] uppercase tracking-[0.14em] font-semibold transition-all cursor-pointer flex items-center gap-2.5 shadow-lg group active:scale-95"
          >
            <span>Choose Your Product</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.section>
  );
};
