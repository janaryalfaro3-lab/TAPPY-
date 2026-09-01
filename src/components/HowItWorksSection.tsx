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
      number: '01',
      title: 'Tap with Phone',
      desc: 'Customer brings any iPhone or Android phone near the NFC surface.',
      color: 'from-sky-500 to-blue-600',
      tag: 'NO APP REQUIRED',
    },
    {
      icon: ExternalLink,
      number: '02',
      title: 'Instant Link Pop',
      desc: 'Your business Google review page opens directly on their mobile browser.',
      color: 'from-indigo-500 to-violet-600',
      tag: 'DIRECT GOOGLE URL',
    },
    {
      icon: MessageSquare,
      number: '03',
      title: '5-Star Rating',
      desc: 'The customer selects 5 stars and posts their genuine feedback in seconds.',
      color: 'from-emerald-500 to-teal-600',
      tag: 'BOOST LOCAL SEO',
    },
  ];

  return (
    <motion.section
      id="how-it-works-section"
      className="py-24 sm:py-32 bg-slate-950/50 text-white border-b border-slate-800/80 relative backdrop-blur-xs z-10"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6">
          <div className="max-w-2xl space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] font-mono font-bold tracking-wide rounded-full shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>FRICTIONLESS PROCESS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed tracking-wide">
              Three simple steps for your customers to access your Google Review page in under 3 seconds.
            </p>
          </div>

          {onTryTapDemo && (
            <button
              onClick={onTryTapDemo}
              className="self-start md:self-auto px-5 py-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/50 text-sky-300 text-xs font-mono uppercase tracking-wider font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-lg hover:shadow-sky-500/20 active:scale-95 backdrop-blur-md"
            >
              <Play className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
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
                className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/70 rounded-3xl p-8 sm:p-10 space-y-6 relative shadow-2xl hover:border-sky-400 transition-all group ring-1 ring-white/10"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.8,
                  delay: idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs font-black text-slate-500 group-hover:text-sky-400 transition-colors">
                    {step.number}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-300 bg-sky-500/20 border border-sky-400/30 px-2 py-0.5 rounded-md">
                    {step.tag}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white tracking-tight pt-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed tracking-wide">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Fallback Notice */}
        <motion.div
          className="mt-12 p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3">
            <QrCode className="w-5 h-5 text-teal-400 shrink-0" />
            <p className="text-sm text-white font-medium">
              Prefer not to use NFC? Scan the QR code instead.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Every product includes a printed high-contrast QR code.
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
};
