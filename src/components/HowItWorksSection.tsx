import React from 'react';
import { Smartphone, ExternalLink, Star, QrCode } from 'lucide-react';

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
    <section
      id="how-it-works-section"
      className="py-20 sm:py-28 bg-slate-950 text-white border-b border-slate-800 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium rounded-full">
              <span>Simple Workflow</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Eliminate awkward review requests. A fast, frictionless process for your customers.
            </p>
          </div>

          {onTryTapDemo && (
            <button
              onClick={onTryTapDemo}
              className="self-start md:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg cursor-pointer transition-colors"
            >
              Try Interactive Tap Simulator
            </button>
          )}
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
                    <Icon className="w-5 h-5 text-sky-400" />
                  </div>
                  <span className="text-sm font-bold text-slate-500">
                    Step 0{step.stepNumber}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fallback Notice */}
        <div className="mt-8 p-5 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2.5 text-slate-300">
            <QrCode className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-medium">
              Every unit includes a printed high-contrast QR code for older phone models.
            </span>
          </div>
          <span>Universal 100% device coverage</span>
        </div>
      </div>
    </section>
  );
};
