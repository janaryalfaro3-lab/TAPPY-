import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Clock,
  ShieldCheck,
  Check,
  Copy,
} from 'lucide-react';

// Official Contact Channels
const WHATSAPP_NUMBER = '639171234567';
const MESSENGER_USERNAME = 'tapreviewnfc.ph';
const SUPPORT_EMAIL = 'support@tapreviewnfc.store';
const SUPPORT_PHONE = '+63 917 123 4567';

const QUICK_INQUIRIES = [
  'Hi! How do I provide my Google review link for pre-programming?',
  'Hello! Do you offer bulk discounts for multiple store branches?',
  'Is an app or monthly subscription required for customers to tap?',
  'What is the delivery timeline for Metro Manila & Provinces?',
];

export function SupportFloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openWhatsApp = (msg?: string) => {
    const textToSend = msg || customMessage || 'Hi TAPREVIEWNFC! I have a question about your NFC Google Review products.';
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openMessenger = (msg?: string) => {
    const url = `https://m.me/${MESSENGER_USERNAME}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyEmailAddress = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end print:hidden"
    >
      {/* Floating Card Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-[calc(100vw-3rem)] sm:w-96 mb-4 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10 text-white"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display text-sm font-extrabold text-white">
                      TAPREVIEW Support
                    </h3>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  </div>
                  <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online · Fast Reply
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                aria-label="Close support dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Primary Direct Action Buttons (WhatsApp & Messenger) */}
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block">
                  Choose Your Preferred Messenger
                </span>

                {/* WhatsApp Primary Button */}
                <button
                  onClick={() => openWhatsApp()}
                  className="w-full p-3.5 bg-gradient-to-r from-[#25D366]/20 to-[#128C7E]/20 hover:from-[#25D366]/30 hover:to-[#128C7E]/30 border border-[#25D366]/50 hover:border-[#25D366] rounded-2xl transition-all flex items-center justify-between group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#25D366] text-slate-950 flex items-center justify-center font-bold shadow-md">
                      <MessageCircle className="w-5 h-5 fill-slate-950" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-extrabold text-white group-hover:text-[#25D366] transition-colors flex items-center gap-1.5">
                        <span>Chat on WhatsApp</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#25D366]" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Instant chat with our product specialist
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </button>

                {/* Facebook Messenger Button */}
                <button
                  onClick={() => openMessenger()}
                  className="w-full p-3.5 bg-gradient-to-r from-[#0084FF]/20 to-[#00C6FF]/20 hover:from-[#0084FF]/30 hover:to-[#00C6FF]/30 border border-[#0084FF]/50 hover:border-[#0084FF] rounded-2xl transition-all flex items-center justify-between group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0084FF] text-white flex items-center justify-center font-bold shadow-md">
                      <Send className="w-4 h-4 fill-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-extrabold text-white group-hover:text-[#0084FF] transition-colors flex items-center gap-1.5">
                        <span>Chat on Messenger</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#0084FF]" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Official Facebook Page Support
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>

              {/* Quick Inquiry Prompts */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block">
                  Frequently Asked Inquiries (Tap to Ask)
                </span>
                <div className="space-y-1.5">
                  {QUICK_INQUIRIES.map((inquiry, idx) => (
                    <button
                      key={idx}
                      onClick={() => openWhatsApp(inquiry)}
                      className="w-full text-left p-2.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-between gap-2 group cursor-pointer"
                    >
                      <span className="truncate">{inquiry}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Support Contacts */}
              <div className="p-3 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Phone className="w-3 h-3 text-sky-400" />
                    Direct Phone / Viber:
                  </span>
                  <a
                    href={`tel:${WHATSAPP_NUMBER}`}
                    className="font-bold text-white hover:text-sky-400 transition-colors"
                  >
                    {SUPPORT_PHONE}
                  </a>
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-1.5 border-t border-slate-800/60">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Mail className="w-3 h-3 text-sky-400" />
                    Email Support:
                  </span>
                  <button
                    onClick={copyEmailAddress}
                    className="inline-flex items-center gap-1 font-bold text-sky-400 hover:underline cursor-pointer"
                  >
                    <span>{copiedEmail ? 'Copied!' : 'support@tapreviewnfc.store'}</span>
                    {copiedEmail ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Guarantee Footer */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-400" />
                  Mon–Sat: 9AM – 6PM PHT
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  Verified PH Merchant
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) Trigger */}
      <motion.button
        id="persistent-support-fab"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-full shadow-2xl cursor-pointer transition-all duration-300 ${
          isOpen
            ? 'bg-slate-800 text-white ring-2 ring-slate-600'
            : 'bg-gradient-to-r from-sky-500 via-sky-400 to-teal-400 text-slate-950 shadow-sky-500/25 ring-2 ring-white/20'
        }`}
        aria-label="Open support and contact options"
      >
        {/* Pulsing ring animation when closed */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-sky-400/40 animate-ping pointer-events-none opacity-60" />
        )}

        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 fill-slate-950 text-slate-950 group-hover:rotate-12 transition-transform" />
            </div>
          )}
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-extrabold tracking-tight leading-tight">
            {isOpen ? 'Close Support' : 'Need Help? Chat with Us'}
          </span>
          {!isOpen && (
            <span className="text-[10px] font-mono font-semibold text-slate-900/80 leading-tight">
              WhatsApp & Messenger
            </span>
          )}
        </div>

        {/* Small live badge for mobile */}
        {!isOpen && (
          <span className="sm:hidden flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950" />
          </span>
        )}
      </motion.button>
    </div>
  );
}
