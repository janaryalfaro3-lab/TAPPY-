import React from 'react';
import { Droplets, Radio, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const TrustBanner: React.FC = () => {
  const points = [
    {
      icon: Droplets,
      title: 'Waterproof & Durable',
      sub: 'Weatherproof crystal acrylic & high-grade PVC',
    },
    {
      icon: Radio,
      title: 'NTAG213 NFC Chip',
      sub: 'Instant 1-tap Google review launch, zero battery',
    },
    {
      icon: CheckCircle,
      title: 'Strong 3M Adhesive',
      sub: 'Heavy-duty commercial backing on tags & stickers',
    },
    {
      icon: Sparkles,
      title: 'Premium Finish',
      sub: 'Beveled crystal edges & smooth matte surface',
    },
  ];

  return (
    <motion.section
      id="trust-strip"
      aria-label="Product Specifications"
      className="border-b border-slate-200 bg-white text-slate-900 py-6 sm:py-7 relative z-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <motion.div
                key={idx}
                className="flex items-center gap-3.5"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon className="w-4 h-4 text-sky-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {pt.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {pt.sub}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};
