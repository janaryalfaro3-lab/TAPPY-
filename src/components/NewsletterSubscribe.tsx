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
        message: 'Please enter a valid email address to receive TAPPY hardware updates.',
      });
      return;
    }

    setIsSubmitting(true);

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
    }, 500);
  };

  return (
    <div
      id="newsletter-subscribe-section"
      className={`relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8 ${className}`}
    >
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Text & Header */}
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Product Updates & Hardware Releases</span>
          </div>

          <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Stay Updated on New NFC Form Factors
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Get early access to upcoming TAPPY form factors, custom branding runs, and conversion strategies for Philippine businesses.
          </p>
        </div>

        {/* Input Form or Subscribed State */}
        <div className="w-full lg:max-w-md">
          <AnimatePresence mode="wait">
            {isSubscribed ? (
              <motion.div
                key="subscribed-state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900">You're subscribed!</p>
                  <p className="text-emerald-700 text-[11px]">
                    Updates active. No spam, ever.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="subscribe-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-2"
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
                    className="w-full pl-10 pr-24 py-2.5 bg-white focus:bg-white border border-slate-200 focus:border-slate-400 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs"
                  />
                  <button
                    id="newsletter-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="absolute right-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs"
                  >
                    <span>{isSubmitting ? 'Joining...' : 'Subscribe'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    Zero spam · Instant unsubscribe anytime
                  </span>
                  <span>Monthly digest</span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
