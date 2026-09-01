import React from 'react';
import { Droplet, Radio, CheckCircle, Gem } from 'lucide-react';
import { motion } from 'motion/react';

export const TrustBanner: React.FC = () => {
  const points = [
    {
      icon: Droplet,
      title: 'WATERPROOF BUILD',
      sub: 'DURABLE ACRYLIC & PVC',
      color: 'from-sky-500 to-blue-600',
      bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    },
    {
      icon: Radio,
      title: 'NTAG213 CHIP',
      sub: 'INSTANT 1-SEC TAP SPEED',
      color: 'from-indigo-500 to-violet-600',
      bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    },
    {
      icon: CheckCircle,
      title: '3M ADHESIVE',
      sub: 'HEAVY INDUSTRIAL BACKING',
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      icon: Gem,
      title: 'PREMIUM FINISH',
      sub: 'CRYSTAL DUAL-TONE FACE',
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
  ];

  return (
    <motion.section
      id="trust-strip"
      aria-label="Product Features Strip"
      className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md text-white py-7 sm:py-9 relative z-10"
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
                className="flex items-center gap-3.5 sm:gap-4 p-2 rounded-2xl hover:bg-slate-900/60 transition-colors"
              >
                {/* Luminous Container */}
                <div className={`relative w-12 h-12 rounded-2xl border ${pt.bg} flex items-center justify-center shrink-0 shadow-xs backdrop-blur-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[12px] font-mono font-bold tracking-wider text-slate-200 uppercase">
                    {pt.title}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                    {pt.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};
