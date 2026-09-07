import React from 'react';
import { Droplets, Radio, CheckCircle, Shield } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  const points = [
    {
      icon: Droplets,
      title: 'Waterproof Build',
      sub: 'Durable acrylic & weather-resistant PVC',
    },
    {
      icon: Radio,
      title: 'NTAG213 Contactless',
      sub: 'Instant 1-second tap response',
    },
    {
      icon: CheckCircle,
      title: 'Commercial Adhesive',
      sub: 'Heavy-duty 3M backing on tags & stickers',
    },
    {
      icon: Shield,
      title: 'Universal Fallback',
      sub: 'Printed high-contrast QR code included',
    },
  ];

  return (
    <section
      id="trust-strip"
      aria-label="Product Specifications"
      className="border-b border-slate-800 bg-slate-900/40 text-white py-6 sm:py-7 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300">
                  <Icon className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    {pt.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {pt.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
