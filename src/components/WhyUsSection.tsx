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
      className="py-16 md:py-20 bg-white border-b border-neutral-200"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-neutral-200 bg-white shadow-xs">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 border-b sm:border-b-0 border-r last:border-r-0 border-neutral-200 hover:bg-neutral-50/80 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-cyan-700 text-xs font-bold tracking-widest">
                    {pillar.code}
                  </span>
                  <div className="w-9 h-9 bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-900 mb-2">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
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


