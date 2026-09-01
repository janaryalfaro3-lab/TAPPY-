import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { useToast } from './ToastProvider';

interface NewsletterSubscribeProps {
  className?: string;
}

const NEWSLETTER_STORAGE_KEY = 'tappy_newsletter_subscribed_email';

export const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(() => {
    try {
      return Boolean(localStorage.getItem(NEWSLETTER_STORAGE_KEY));
    } catch {
      return false;
    }
  });

  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showToast({
        type: 'warning',
        title: 'Valid Email Required',
        message: 'Please enter a valid email address to receive TAPPY hardware launch updates.',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate instant network submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      try {
        localStorage.setItem(NEWSLETTER_STORAGE_KEY, cleanEmail);
      } catch (err) {
        console.warn('Could not store newsletter state', err);
      }

      showToast({
        type: 'success',
        title: 'Subscribed to TAPPY Updates',
        message: `You're in! We'll notify ${cleanEmail} when new NFC review hardware formats launch.`,
      });
      setEmail('');
    }, 600);
  };

  return (
    <div
      id="newsletter-subscribe-section"
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 border border-slate-800/80 p-6 sm:p-8 backdrop-blur-xl ${className}`}
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Text & Header */}
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>Product Drops & Firmware Updates</span>
          </div>

          <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Stay Ahead on New NFC Hardware Launches
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Get early access to upcoming TAPPY form factors, custom branding runs, and conversion strategies for Philippine businesses.
          </p>
        </div>

        {/* Input Form or Subscribed State */}
        <div className="w-full lg:max-w-md">
          <AnimatePresence mode="wait">
            {isSubscribed ? (
              <motion.div
                key="subscribed-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white">You're subscribed!</p>
                  <p className="text-emerald-300/90 text-[11px] font-mono">
                    VIP launch notifications active. No spam ever.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="subscribe-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2.5"
              >
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="newsletter-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your business email..."
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-28 py-3 bg-slate-950/80 hover:bg-slate-950 focus:bg-slate-950 border border-slate-700/80 focus:border-sky-400 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition-all font-sans shadow-inner"
                  />
                  <button
                    id="newsletter-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="absolute right-1.5 px-3.5 py-2 bg-white hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-md hover:shadow-sky-400/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 font-mono"
                  >
                    <span>{isSubmitting ? 'Joining...' : 'Join'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-sky-400" />
                    Zero spam · Instant 1-click unsubscribe
                  </span>
                  <span className="text-slate-400">Monthly digest</span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
