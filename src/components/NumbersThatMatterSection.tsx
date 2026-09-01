import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  TrendingUp,
  Star,
  Users,
  Store,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  UserCheck,
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
  color: string;
  bgGlow: string;
}

const METRICS: MetricItem[] = [
  {
    id: 'reviews',
    label: 'Reviews Generated',
    sublabel: 'Verified 5-star Google ratings recorded via tap',
    targetValue: 28450,
    suffix: '+',
    decimals: 0,
    highlightText: '4.8x monthly average surge',
    icon: Star,
    color: 'text-amber-400',
    bgGlow: 'from-amber-500/20 to-orange-500/5',
  },
  {
    id: 'customers',
    label: 'Happy Customers',
    sublabel: 'Patrons who completed a 1-tap review in < 3s',
    targetValue: 14200,
    suffix: '+',
    decimals: 0,
    highlightText: '98.9% positive rating sentiment',
    icon: Users,
    color: 'text-sky-400',
    bgGlow: 'from-sky-500/20 to-blue-500/5',
  },
  {
    id: 'businesses',
    label: 'Businesses Using NFC',
    sublabel: 'Retailers, clinics, cafes & hotels nationwide',
    targetValue: 1840,
    suffix: '+',
    decimals: 0,
    highlightText: 'Across 48 Philippine cities',
    icon: Store,
    color: 'text-emerald-400',
    bgGlow: 'from-emerald-500/20 to-teal-500/5',
  },
  {
    id: 'success-rate',
    label: 'Tap-to-Review Success Rate',
    sublabel: 'Zero friction on iPhone iOS & Android devices',
    targetValue: 99.6,
    suffix: '%',
    decimals: 1,
    highlightText: 'Instant native URL resolution',
    icon: Zap,
    color: 'text-cyan-400',
    bgGlow: 'from-cyan-500/20 to-sky-500/5',
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
    bio: 'Overseeing hardware reliability, high-speed microchip encoding, and nationwide fulfillment operations to ensure zero-friction performance.',
    highlights: ['Hardware Operations', 'NFC Programming', 'Fulfillment & Logistics'],
  },
];

// Helper Animated Counter Component
function AnimatedCounter({
  target,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 2000,
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
      // Ease out cubic
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
    <span className="font-mono tabular-nums tracking-tight">
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
  const isInView = useInView(sectionRef, { once: false, margin: '-100px' });
  const [activeTab, setActiveTab] = useState<'all' | 'growth'>('all');

  return (
    <section
      id="numbers-that-matter-section"
      ref={sectionRef}
      className="py-24 sm:py-32 relative overflow-hidden bg-slate-950/60 backdrop-blur-xl border-y border-slate-800/80 text-white"
    >
      {/* Subtle background ambient glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] font-mono uppercase font-bold tracking-wider shadow-sm"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Impact At A Glance
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
            >
              Numbers That Matter
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-sm sm:text-base leading-relaxed"
            >
              Real metrics aggregated across thousands of verified Philippine retail counters, dining tables, clinic reception desks, and hotel checkouts.
            </motion.p>
          </div>

          {/* Real-time sync badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-5 py-3.5 backdrop-blur-2xl shadow-xl self-start md:self-auto"
          >
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Active Hardware Fleet</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Updated Daily across PH Stores
              </p>
            </div>
          </motion.div>
        </div>

        {/* 4 Main Animated Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {METRICS.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 hover:border-sky-400/50 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1"
              >
                {/* Gradient background hover effect */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${metric.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10 space-y-4">
                  {/* Top Bar: Icon & Highlight Pill */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center ${metric.color} shadow-inner group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-full">
                      #0{index + 1}
                    </span>
                  </div>

                  {/* Animated Value */}
                  <div className="pt-2">
                    <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      <AnimatedCounter
                        target={metric.targetValue}
                        decimals={metric.decimals}
                        prefix={metric.prefix}
                        suffix={metric.suffix}
                        inView={isInView}
                        duration={2200 + index * 200}
                      />
                    </div>
                    <h3 className="font-display text-sm font-bold text-slate-100 mt-1">
                      {metric.label}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                    {metric.sublabel}
                  </p>
                </div>

                {/* Card Footer Pill */}
                <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-sky-300 font-medium">
                    {metric.highlightText}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Founders / Leadership Bento Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800/80 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase tracking-wider mb-1">
                <UserCheck className="w-4 h-4 text-sky-400" />
                Leadership & Vision
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                Meet the Founders Behind TAPPY
              </h3>
            </div>

            {onExploreProducts && (
              <button
                onClick={onExploreProducts}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-sky-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer shrink-0"
              >
                <span>View Products</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FOUNDERS.map((founder, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-6 hover:border-sky-500/40 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Subtle corner glow */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      {/* Monogram Typography Avatar (No picture) */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/20 via-sky-500/10 to-blue-600/20 border border-sky-500/30 flex items-center justify-center text-sky-300 font-mono font-extrabold text-base shadow-inner group-hover:border-sky-400/60 group-hover:scale-105 transition-all">
                        {founder.initials}
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-white group-hover:text-sky-300 transition-colors">
                          {founder.name}
                        </h4>
                        <span className="text-xs font-mono font-bold text-sky-400 block">
                          {founder.role}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg shrink-0">
                      {founder.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {founder.bio}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/60 flex flex-wrap gap-1.5 relative z-10">
                  {founder.highlights.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900/90 border border-slate-800/80 px-2 py-0.5 rounded-md"
                    >
                      <CheckCircle2 className="w-3 h-3 text-sky-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
