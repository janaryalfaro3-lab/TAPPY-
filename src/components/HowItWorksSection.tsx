import React from 'react';
import { Smartphone, ExternalLink, Star, QrCode } from 'lucide-react';
import { motion } from 'motion/react';
import { TiltCard3D } from './TiltCard3D';

interface HowItWorksSectionProps {
  onTryTapDemo?: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onTryTapDemo }) => {
  const steps = [
    {
      icon: Smartphone,
      stepNumber: '1',
      title: 'Customer Taps Hardware',
      desc: 'The customer touches their iPhone or Android phone against your countertop stand, tag, or sticker.',
    },
    {
      icon: ExternalLink,
      stepNumber: '2',
      title: 'Review Page Opens Instantly',
      desc: 'Their mobile browser automatically displays your official Google business review dialog—no app required.',
    },
    {
      icon: Star,
      stepNumber: '3',
      title: '5-Star Feedback Posted',
      desc: 'The customer submits their rating and comment in seconds before leaving your counter or table.',
    },
  ];

  return (
    <motion.section
      id="how-it-works-section"
      className="py-20 sm:py-28 bg-white text-slate-900 border-b border-slate-200 relative z-10"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-full">
              <span>Simple Workflow</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Eliminate awkward review requests. A fast, frictionless process for your customers.
            </p>
          </div>

          {onTryTapDemo && (
            <button
              onClick={onTryTapDemo}
              className="self-start md:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-2xs active:scale-98"
            >
              Try Interactive Tap Simulator
            </button>
          )}
        </div>

        {/* 3 Step Cards Grid with Staggered Fade-in-up */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <TiltCard3D
                  maxTilt={8}
                  scale={1.02}
                  className="h-full bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5 hover:border-slate-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between" style={{ transform: 'translateZ(15px)' }}>
                    <div className="w-11 h-11 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                      Step 0{step.stepNumber}
                    </span>
                  </div>

                  <div className="space-y-1.5" style={{ transform: 'translateZ(10px)' }}>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </TiltCard3D>
              </motion.div>
            );
          })}
        </div>

        {/* Fallback Notice */}
        <motion.div
          className="mt-8 p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2.5 text-slate-800">
            <QrCode className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="font-semibold">
              Every unit includes a printed high-contrast QR code for older phone models without NFC.
            </span>
          </div>
          <span className="text-slate-500 font-medium">Universal 100% device coverage</span>
        </motion.div>
      </div>
    </motion.section>
  );
};
