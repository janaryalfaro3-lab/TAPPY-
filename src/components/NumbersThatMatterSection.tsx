import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'motion/react';
import {
  Star,
  Users,
  Store,
  CheckCircle2,
} from 'lucide-react';

interface MetricItem {
  id: string;
  label: string;
  sublabel: string;
  targetValue: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  highlightText: string;
  icon: React.ElementType;
}

const METRICS: MetricItem[] = [
  {
    id: 'reviews',
    label: 'Reviews Generated',
    sublabel: 'Verified 5-star Google ratings recorded via tap',
    targetValue: 28450,
    suffix: '+',
    decimals: 0,
    highlightText: '4.8x average review increase',
    icon: Star,
  },
  {
    id: 'customers',
    label: 'Happy Reviewers',
    sublabel: 'Customers who submitted a review in < 5 seconds',
    targetValue: 14200,
    suffix: '+',
    decimals: 0,
    highlightText: '98.9% positive rating sentiment',
    icon: Users,
  },
  {
    id: 'businesses',
    label: 'Philippine Businesses',
    sublabel: 'Retailers, clinics, cafes & hospitality nationwide',
    targetValue: 1840,
    suffix: '+',
    decimals: 0,
    highlightText: 'Across 48 major cities',
    icon: Store,
  },
  {
    id: 'success-rate',
    label: 'Hardware Tap Reliability',
    sublabel: 'Consistent NFC response on iOS & Android devices',
    targetValue: 99.6,
    suffix: '%',
    decimals: 1,
    highlightText: 'Zero pairing or app download',
    icon: CheckCircle2,
  },
];

interface Founder {
  name: string;
  role: string;
  initials: string;
  badge: string;
  bio: string;
  highlights: string[];
}

const FOUNDERS: Founder[] = [
  {
    name: 'Kenji Alfaro',
    role: 'Founder',
    initials: 'KA',
    badge: 'Vision & Strategy',
    bio: 'Dedicated to empowering Philippine businesses with seamless, contactless review-generation hardware and high-converting local growth solutions.',
    highlights: ['Product Architecture', 'Brand Development', 'Customer Experience'],
  },
  {
    name: 'John Paul Garcia',
    role: 'Co-Founder',
    initials: 'JPG',
    badge: 'Operations & Engineering',
    bio: 'Overseeing hardware reliability, microchip encoding, and nationwide fulfillment operations to ensure zero-friction performance.',
    highlights: ['Hardware Operations', 'NFC Programming', 'Fulfillment & Logistics'],
  },
];

function AnimatedCounter({
  target,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1800,
  inView = false,
}: {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }

    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = easeOut * target;
      setCount(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [inView, target, duration]);

  const formattedNumber = count.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className="tabular-nums font-bold">
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}

export function NumbersThatMatterSection({
  onExploreProducts,
}: {
  onExploreProducts?: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-80px' });

  return (
    <section
      id="numbers-that-matter-section"
      ref={sectionRef}
      className="py-20 sm:py-28 bg-slate-900/40 border-y border-slate-800 text-white"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
              <span>Performance Track Record</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Proven Impact Across Businesses
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Real metrics aggregated across thousands of verified Philippine retail counters, dining tables, clinic reception desks, and service providers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-lg self-start md:self-auto font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Active Deployments Nationwide</span>
          </div>
        </div>

        {/* 4 Main Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="pt-2">
                    <div className="text-3xl font-bold text-white tracking-tight">
                      <AnimatedCounter
                        target={metric.targetValue}
                        decimals={metric.decimals}
                        prefix={metric.prefix}
                        suffix={metric.suffix}
                        inView={isInView}
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-200 mt-1">
                      {metric.label}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {metric.sublabel}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 text-xs text-slate-400 font-medium">
                  {metric.highlightText}
                </div>
              </div>
            );
          })}
        </div>

        {/* Founders / Leadership Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
            <div>
              <span className="text-xs text-slate-400 font-medium block">
                Leadership
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                The Team Behind TAPPY
              </h3>
            </div>

            {onExploreProducts && (
              <button
                onClick={onExploreProducts}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
              >
                View Catalog
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FOUNDERS.map((founder, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-sm">
                      {founder.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {founder.name}
                      </h4>
                      <span className="text-xs text-slate-400">
                        {founder.role}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                    {founder.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {founder.bio}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 text-[11px] text-slate-400">
                  {founder.highlights.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
