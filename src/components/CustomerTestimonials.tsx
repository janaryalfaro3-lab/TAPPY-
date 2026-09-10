import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Store,
  Award,
} from 'lucide-react';
import { CustomerTestimonialsSkeleton } from './CustomerTestimonialsSkeleton';

interface CustomerTestimonialsProps {
  isLoading?: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  business: string;
  category: string;
  location: string;
  productUsed: string;
  rating: number;
  reviewsGained: string;
  headline: string;
  content: string;
  avatarInitials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    role: 'Managing Partner',
    business: 'Artisan Roast & Brew',
    category: 'Café & Dining',
    location: 'BGC, Taguig',
    productUsed: 'Acrylic Standee (90×110 mm)',
    rating: 5,
    reviewsGained: '+340 Google Reviews in 60 days',
    headline: 'Tripled our monthly 5-star reviews on Google Maps',
    content:
      'We placed two Acrylic Standees right next to the payment POS. Customers tap their phone while waiting for their takeaway cup—no awkward asking required. Our rating jumped from 4.2 to 4.9 stars!',
    avatarInitials: 'CM',
  },
  {
    id: '2',
    name: 'Dr. Alyssa Santos',
    role: 'Lead Dentist & Founder',
    business: 'Santos Aesthetic Dental Clinic',
    category: 'Healthcare & Clinics',
    location: 'Makati City',
    productUsed: 'Acrylic Square Tag (40×40 mm)',
    rating: 5,
    reviewsGained: '180+ Verified Reviews',
    headline: 'Effortless patient reviews right at checkout',
    content:
      'Patients are always pleased with their treatments but rarely remember to review later at home. Having the contactless tag on our receptionist desk makes giving a review a 2-second tap before leaving.',
    avatarInitials: 'AS',
  },
  {
    id: '3',
    name: 'Marcus Ramirez',
    role: 'Operations Director',
    business: 'Apex Auto Studio & Detailing',
    category: 'Automotive & Services',
    location: 'Quezon City',
    productUsed: 'PVC Business Card & Round Sticker',
    rating: 5,
    reviewsGained: '210 Google Reviews',
    headline: 'Our detailing technicians hand it over at car handover',
    content:
      'Clients appreciate the simplicity. Our crew presents the NFC card during vehicle inspection, and customers immediately tap and rate while their car keys are returned.',
    avatarInitials: 'MR',
  },
  {
    id: '4',
    name: 'Patricia Lim',
    role: 'Co-Founder',
    business: 'Bloom & Petal Florals',
    category: 'Boutique & Retail',
    location: 'Cebu City',
    productUsed: 'Waterproof Round Sticker (35 mm)',
    rating: 5,
    reviewsGained: '95+ Verified 5-Star Reviews',
    headline: 'Stuck directly on our wrapping counter and receipt clipboard',
    content:
      'The stickers look clean and professional on our wooden counter. Everyone who buys a bouquet taps with their phone. Fantastic customer support and quick delivery to Cebu!',
    avatarInitials: 'PL',
  },
];

export const CustomerTestimonials: React.FC<CustomerTestimonialsProps> = ({
  isLoading = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [internalLoading, setInternalLoading] = useState(true);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInternalLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const currentlyLoading = isLoading || internalLoading;
  const current = TESTIMONIALS[currentIndex];

  const handlePrev = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  return (
    <motion.section
      id="testimonials-section"
      className="relative py-20 sm:py-28 bg-slate-50 text-slate-900 border-b border-slate-200"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-full shadow-2xs">
              <span>Client Case Studies</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Trusted by 450+ Philippine Businesses
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Discover how retail storefronts, cafes, and healthcare clinics convert foot traffic into verified 5-star Google reviews.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg self-start md:self-auto font-medium shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Verified Customer Deployments</span>
          </div>
        </div>

        {/* Testimonials Main Container or Skeleton */}
        {currentlyLoading ? (
          <CustomerTestimonialsSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Feature Card: Active Testimonial (8 cols) */}
            <div className="lg:col-span-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 h-full flex flex-col justify-between shadow-2xs">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Stars & Metric Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-1">
                          {[...Array(current.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-amber-400 text-amber-400"
                            />
                          ))}
                          <span className="ml-2 text-xs text-slate-700 font-semibold">5.0 / 5.0</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{current.reviewsGained}</span>
                        </div>
                      </div>

                      {/* Headline */}
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        "{current.headline}"
                      </h3>

                      {/* Body Review */}
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                        {current.content}
                      </p>
                    </div>

                    {/* Customer Info & Hardware Used */}
                    <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 flex items-center justify-center font-bold text-sm">
                          {current.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {current.name}
                            </h4>
                            <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              Verified
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {current.role} · <span className="text-slate-700 font-medium">{current.business}</span> ({current.location})
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right text-xs">
                        <span className="text-slate-400 block text-[11px]">
                          Hardware Deployed
                        </span>
                        <span className="font-semibold text-slate-800">
                          {current.productUsed}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {TESTIMONIALS.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          currentIndex === idx
                            ? 'w-6 bg-slate-900'
                            : 'w-2 bg-slate-200 hover:bg-slate-300'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="testimonials-prev-btn"
                      onClick={handlePrev}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                      aria-label="Previous Review"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      id="testimonials-next-btn"
                      onClick={handleNext}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                      aria-label="Next Review"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar: Key Highlights (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">450+</div>
                  <div className="text-xs text-slate-500">
                    Retail stores, cafes & clinics in the Philippines
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">4.9 / 5.0</div>
                  <div className="text-xs text-slate-500">
                    Average merchant Google rating increase
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">100% Guaranteed</div>
                  <div className="text-xs text-slate-500">
                    Pre-encoded with your link & tested prior to dispatch
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 flex-1 flex flex-col justify-center space-y-2 shadow-2xs">
                <span className="text-xs font-bold text-slate-900">
                  Zero Ongoing Fees
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  TAPPY hardware is a one-time purchase. No monthly recurring fees, no software apps, and unlimited lifetime contactless taps.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};
