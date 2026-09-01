import React from 'react';
import { motion } from 'motion/react';
import { Smartphone, QrCode, Shield, CheckCircle } from 'lucide-react';
import { Translations } from '../data/translations';

interface WhyUsSectionProps {
  t: Translations;
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({ t }) => {
  const pillars = [
    {
      code: '01',
      title: t.whyUs.p1Title,
      description: t.whyUs.p1Desc,
      icon: Smartphone,
    },
    {
      code: '02',
      title: t.whyUs.p2Title,
      description: t.whyUs.p2Desc,
      icon: QrCode,
    },
    {
      code: '03',
      title: t.whyUs.p3Title,
      description: t.whyUs.p3Desc,
      icon: Shield,
    },
    {
      code: '04',
      title: t.whyUs.p4Title,
      description: t.whyUs.p4Desc,
      icon: CheckCircle,
    },
  ];

  return (
    <motion.section
      id="why-us-section"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="py-16 md:py-20 bg-slate-950/40 backdrop-blur-xl border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-slate-700/80 bg-slate-900/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 border-b sm:border-b-0 border-r last:border-r-0 border-slate-800/80 hover:bg-slate-800/50 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-sky-400 text-xs font-bold tracking-widest">
                    {pillar.code}
                  </span>
                  <div className="w-10 h-10 bg-sky-500/10 border border-sky-500/30 rounded-xl flex items-center justify-center text-sky-400">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-2">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pillar.description}
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


