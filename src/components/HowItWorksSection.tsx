import React from 'react';
import { Smartphone, ExternalLink, MessageSquare, QrCode, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface HowItWorksSectionProps {
  onTryTapDemo?: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onTryTapDemo }) => {
  const steps = [
    {
      icon: Smartphone,
      title: 'Tap',
      desc: 'Customer taps their phone on the NFC product.',
    },
    {
      icon: ExternalLink,
      title: 'Open',
      desc: 'The configured Google Review link opens instantly.',
    },
    {
      icon: MessageSquare,
      title: 'Review',
      desc: 'The customer leaves 5 stars and their review.',
    },
  ];

  return (
    <motion.section
      id="how-it-works-section"
      className="py-24 sm:py-32 bg-[#080808] text-[#E0E0E0] border-b border-white/10"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6">
          <div className="max-w-2xl space-y-3 text-left">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#2DD4BF] font-semibold">
              Seamless Customer Flow
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#E0E0E0]">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-[#949494] leading-relaxed tracking-wide">
              Three simple steps for your customers to access your Google Review page.
            </p>
          </div>

          {onTryTapDemo && (
            <button
              onClick={onTryTapDemo}
              className="self-start md:self-auto px-5 py-2.5 bg-[#121212] hover:bg-[#1A1A1A] border border-[#2DD4BF]/40 hover:border-[#2DD4BF] text-[#2DD4BF] text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(45,212,191,0.12)] active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-[#2DD4BF]" />
              <span>Try Tap Simulator</span>
            </button>
          )}
        </div>

        {/* 3 Step Flow with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                className="bg-[#0E0E0E] border border-white/10 p-8 sm:p-10 space-y-5 relative hover:border-[#2DD4BF]/40 transition-colors"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.8,
                  delay: idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="w-12 h-12 border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.15)]">
                  <Icon className="w-5 h-5 text-[#2DD4BF]" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-bold text-[#E0E0E0] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#949494] leading-relaxed tracking-wide">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Fallback Notice */}
        <motion.div
          className="mt-12 p-6 bg-[#0E0E0E] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3">
            <QrCode className="w-5 h-5 text-[#2DD4BF] shrink-0" />
            <p className="text-sm text-[#E0E0E0] font-medium">
              Prefer not to use NFC? Scan the QR code instead.
            </p>
          </div>
          <span className="text-xs text-[#949494] font-mono">
            Every product includes a printed high-contrast QR code.
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
};
