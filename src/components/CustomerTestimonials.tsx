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
    reviewsGained: 'Ranked #1 Auto Detailer locally',
    headline: 'Best ROI hardware investment we made this year',
    content:
      'Our technicians carry the PVC cards when handing vehicle keys back to clients. Customers love the instant tap experience and we consistently get high-detail 5-star reviews with customer photos.',
    avatarInitials: 'MR',
  },
  {
    id: '4',
    name: 'Katrina Dee',
    role: 'General Manager',
    business: 'Verde Urban Boutique Hotel',
    category: 'Hospitality',
    location: 'Pasig City',
    productUsed: 'Acrylic Standee & PVC Cards',
    rating: 5,
    reviewsGained: 'Over 500+ Tourist Reviews',
    headline: 'The easiest check-out review collection flow',
    content:
      'Guests tap the front desk stand while paying their room bills. Foreign and local travelers alike find the tap intuitive and smooth. It significantly increased our Google ranking in Ortigas.',
    avatarInitials: 'KD',
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
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];
  const currentlyLoading = isLoading || internalLoading;

  return (
    <section
      id="testimonials-section"
      className="relative py-20 sm:py-28 bg-slate-950 text-white border-b border-slate-800"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium rounded-full">
              <span>Client Case Studies</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Trusted by 450+ Philippine Businesses
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Discover how retail storefronts, cafes, and healthcare clinics convert foot traffic into verified 5-star Google reviews.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg self-start md:self-auto font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
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
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 h-full flex flex-col justify-between">
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
                          <span className="ml-2 text-xs text-slate-300 font-semibold">5.0 / 5.0</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                          <span>{current.reviewsGained}</span>
                        </div>
                      </div>

                      {/* Headline */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        "{current.headline}"
                      </h3>

                      {/* Body Review */}
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                        {current.content}
                      </p>
                    </div>

                    {/* Customer Info & Hardware Used */}
                    <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-sm">
                          {current.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-white">
                              {current.name}
                            </h4>
                            <span className="text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                              Verified
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {current.role} · <span className="text-slate-300">{current.business}</span> ({current.location})
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right text-xs">
                        <span className="text-slate-400 block text-[11px]">
                          Hardware Deployed
                        </span>
                        <span className="font-medium text-slate-200">
                          {current.productUsed}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    {TESTIMONIALS.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          currentIndex === idx
                            ? 'w-6 bg-white'
                            : 'w-2 bg-slate-700 hover:bg-slate-600'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="testimonials-prev-btn"
                      onClick={handlePrev}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                      aria-label="Previous Review"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      id="testimonials-next-btn"
                      onClick={handleNext}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors cursor-pointer"
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
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">450+</div>
                  <div className="text-xs text-slate-400">
                    Retail stores, cafes & clinics in the Philippines
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">4.9 / 5.0</div>
                  <div className="text-xs text-slate-400">
                    Average merchant Google rating increase
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">100% Guaranteed</div>
                  <div className="text-xs text-slate-400">
                    Pre-encoded with your link & tested prior to dispatch
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex-1 flex flex-col justify-center space-y-2">
                <span className="text-xs font-semibold text-white">
                  Zero Ongoing Fees
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  TAPPY hardware is a one-time purchase. No monthly recurring fees, no software apps, and unlimited lifetime contactless taps.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
