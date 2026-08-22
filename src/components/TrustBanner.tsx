import React from 'react';
import { Droplet, Radio, CheckCircle, Gem } from 'lucide-react';
import { motion } from 'motion/react';

export const TrustBanner: React.FC = () => {
  const points = [
    {
      icon: Droplet,
      title: 'WATERPROOF',
      sub: 'DURABLE',
    },
    {
      icon: Radio,
      title: 'NTAG213',
      sub: 'NFC CHIP',
    },
    {
      icon: CheckCircle,
      title: 'STRONG ADHESIVE',
      sub: '(STICKERS)',
    },
    {
      icon: Gem,
      title: 'PREMIUM',
      sub: 'FINISH',
    },
  ];

  return (
    <motion.section
      id="trust-strip"
      aria-label="Product Features Strip"
      className="border-y border-white/10 bg-[#0A0A0A] text-[#E0E0E0] py-7 sm:py-9"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 sm:gap-4 p-2"
              >
                {/* Glowing Cyan/Teal Container matching the physical branding */}
                <div className="relative w-11 h-11 rounded-full border border-[#2DD4BF]/40 bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF] shrink-0 shadow-[0_0_12px_rgba(45,212,191,0.18)]">
                  <Icon className="w-5 h-5 text-[#2DD4BF]" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold tracking-wider text-[#E0E0E0] uppercase font-display leading-tight">
                    {pt.title}
                  </div>
                  <div className="text-[11px] sm:text-xs font-mono font-medium text-[#2DD4BF] uppercase tracking-wide mt-0.5">
                    {pt.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};
