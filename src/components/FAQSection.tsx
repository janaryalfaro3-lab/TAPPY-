import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How does the NFC product work?',
    answer:
      'Inside each product is an NTAG213 NFC microchip. When an iPhone or Android phone is tapped near the chip (or within 2–4 cm), the phone automatically prompts the user to open your Google Review link without any manual pairing or battery requirement.',
  },
  {
    question: 'Does my customer need an app?',
    answer:
      'No. NFC reading is built directly into modern iOS and Android operating systems natively. Customers do not need to download, install, or register for any third-party app.',
  },
  {
    question: 'Can I use the QR code instead?',
    answer:
      'Yes. Every product is printed with a crisp, high-contrast QR code as a universal fallback for older smartphones or customers who prefer scanning with their camera app.',
  },
  {
    question: 'What link will the NFC tag open?',
    answer:
      'It opens your official Google Maps place review page directly in the customer’s mobile browser or Google Maps app, presenting the 5-star review writing dialog immediately.',
  },
  {
    question: 'Can the NFC link be changed later?',
    answer:
      'Yes. The NTAG213 chip can be rewritten anytime using free standard NFC tools (such as NFC Tools on iOS or Android) if your business relocates, changes name, or updates its Google profile.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'We ship nationwide across the Philippines. Orders are processed within 24–48 hours, with delivery taking 2–4 business days via express courier (LBC / J&T).',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept GCash, Maya, major Credit/Debit Cards (Visa, Mastercard, JCB, AMEX), and direct Bank Transfers (BDO, BPI, UnionBank).',
  },
  {
    question: 'How do I provide my Google Review link?',
    answer:
      'You can enter your Business Name or Google Maps review link during checkout. We will pre-encode and verify the link onto your hardware prior to dispatch. Step-by-step instructions are also included with your package.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <motion.section
      id="faqs-section"
      className="py-24 sm:py-32 bg-[#080808] text-[#E0E0E0] border-b border-white/10"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-14 sm:mb-16 space-y-3 text-left">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#2DD4BF] font-semibold">
            Common Inquiries
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#E0E0E0]">
            Questions, Answered.
          </h2>
          <p className="text-sm sm:text-base text-[#949494] leading-relaxed tracking-wide">
            Everything you need to know about our NFC Google Review products, setup, and ordering.
          </p>
        </div>

        {/* Minimalist Accordion */}
        <div className="divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="group transition-colors">
                <button
                  id={`faq-toggle-${idx}`}
                  onClick={() => toggleItem(idx)}
                  className="w-full py-6 flex items-center justify-between text-left gap-6 cursor-pointer select-none transition-colors"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-base sm:text-[17px] font-medium tracking-wide transition-colors ${
                      isOpen ? 'text-[#E0E0E0]' : 'text-[#CCCCCC] group-hover:text-white'
                    }`}
                  >
                    {faq.question}
                  </span>

                  {/* Elegant Thin Cross Icon that smoothly rotates */}
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 text-[#949494] group-hover:text-[#2DD4BF] transition-colors">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`w-5 h-5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen ? 'rotate-45 text-[#2DD4BF]' : 'rotate-0'
                      }`}
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pr-6 text-sm text-[#949494] leading-[1.8] tracking-[0.015em]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};
