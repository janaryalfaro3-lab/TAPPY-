import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Store,
  Coffee,
  Sparkles,
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
  avatarBg: string;
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
    avatarBg: 'bg-amber-600',
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
    avatarBg: 'bg-teal-600',
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
    avatarBg: 'bg-blue-600',
    avatarInitials: 'MR',
  },
  {
    id: '4',
    name: 'Elena Rostova',
    role: 'Creative Director',
    business: 'Lumière Hair & Beauty Lounge',
    category: 'Salons & Spas',
    location: 'Ortigas Center, Pasig',
    productUsed: 'Acrylic Standee & Tag Bundle',
    rating: 5,
    reviewsGained: '+210 reviews in 45 days',
    headline: 'Sleek, minimalist design that fits our salon aesthetic',
    content:
      'The crystal-clear acrylic look blends perfectly with our modern salon counters. Customers frequently comment on how high-tech yet simple it is. The QR fallback also works smoothly for older phones.',
    avatarBg: 'bg-rose-600',
    avatarInitials: 'ER',
  },
  {
    id: '5',
    name: 'Gavin Lim',
    role: 'Head Chef & Owner',
    business: 'The Rustic Hearth Bistro',
    category: 'Café & Dining',
    location: 'Cebu IT Park',
    productUsed: 'PVC Round Stickers (Tabletop Mount)',
    rating: 5,
    reviewsGained: '500+ Total Reviews',
    headline: 'Mounted on table numbers—review volume surged',
    content:
      'We stuck the waterproof PVC stickers onto the corner of each dining table. Guests tap while savoring dessert. Our Google Maps discoverability skyrocketed, bringing in tourist foot traffic weekly.',
    avatarBg: 'bg-emerald-600',
    avatarInitials: 'GL',
  },
];

export const CustomerTestimonials: React.FC<CustomerTestimonialsProps> = ({
  isLoading = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [internalLoading, setInternalLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initial content loading simulation for smooth perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setInternalLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Ensure video always autoplays reliably across all browsers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsVideoPlaying(true);
          setVideoLoaded(true);
        })
        .catch(() => {
          // Autoplay fallback with muted retry
          video.muted = true;
          video.play().catch(() => {});
        });
    }
  }, []);

  // Autoplay carousel rotation
  useEffect(() => {
    if (!isAutoplay) return;

    autoplayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isAutoplay]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      const nextMute = !videoRef.current.muted;
      videoRef.current.muted = nextMute;
      setIsVideoMuted(nextMute);
    }
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const current = TESTIMONIALS[currentIndex];

  const currentlyLoading = isLoading || internalLoading;

  return (
    <section
      id="testimonials-section"
      className="relative py-24 sm:py-32 overflow-hidden text-white border-b border-slate-800"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      {/* Background Video Player Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-20 bg-slate-950">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-90 transition-opacity duration-700"
        >
          <source src="/nfc-showcase.mp4" type="video/mp4" />
          <source src="/AQNlPRBnriMxLwmSDZbaNJnd5qdbr8BUFnnXmCJ0iFHLso9VaUBt7dKB2A9i2lSkIcZL96AwSHrrfKdwn0sQA_PCPJ6mzqFFHmJNHgGL8A.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Cinematic Dark Glassmorphism Overlay for Crisp Typography & Contrast */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90 backdrop-blur-[2px]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[11px] font-mono uppercase tracking-[0.2em] rounded-full backdrop-blur-md font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Real Customer Stories</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Trusted by 450+ Local Businesses
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              See how verified brick-and-mortar storefronts, cafés, and clinics turn in-person foot traffic into lasting 5-star Google reputations.
            </p>
          </div>

          {/* Video Controller Badge */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3.5 py-2 rounded-2xl text-xs font-mono text-slate-300 shadow-xl pointer-events-auto ring-1 ring-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
              <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider">
                Live Showcase Video
              </span>
            </div>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            <button
              onClick={toggleVideoPlayback}
              title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
              aria-label={isVideoPlaying ? 'Pause Background Video' : 'Play Background Video'}
            >
              {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={toggleVideoMute}
              title={isVideoMuted ? 'Unmute Video' : 'Mute Video'}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
              aria-label={isVideoMuted ? 'Unmute Background Video' : 'Mute Background Video'}
            >
              {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Carousel Main Container or Skeleton */}
        {currentlyLoading ? (
          <CustomerTestimonialsSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Feature Card: Active Testimonial */}
            <div className="lg:col-span-8">
              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden h-full flex flex-col justify-between">
                {/* Background ambient accent */}
                <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="space-y-5">
                      {/* Stars & Metric Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                          {[...Array(current.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                            />
                          ))}
                          <span className="ml-2 text-xs font-mono text-slate-300 font-bold">5.0 / 5.0</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{current.reviewsGained}</span>
                        </div>
                      </div>

                      {/* Headline Quote */}
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                        "{current.headline}"
                      </h3>

                      {/* Body Review */}
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                        {current.content}
                      </p>
                    </div>

                    {/* Customer Info & Hardware Used */}
                    <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl ${current.avatarBg} text-white flex items-center justify-center font-display font-bold text-base shadow-md ring-2 ring-white/10`}
                        >
                          {current.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-white tracking-tight">
                              {current.name}
                            </h4>
                            <span className="text-xs text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded font-mono">
                              Verified Owner
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium">
                            {current.role} · <span className="text-slate-300 font-semibold">{current.business}</span> ({current.location})
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                          Hardware Deployed
                        </span>
                        <span className="text-xs font-mono font-medium text-teal-300">
                          {current.productUsed}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls & Pagination */}
                <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-800/80">
                  {/* Dots indicator */}
                  <div className="flex items-center gap-2">
                    {TESTIMONIALS.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer active:scale-95 ${
                          currentIndex === idx
                            ? 'w-8 bg-teal-400 shadow-[0_0_8px_#14B8A6]'
                            : 'w-2 bg-slate-700 hover:bg-slate-600'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Left / Right arrow buttons with active:scale-95 */}
                  <div className="flex items-center gap-2">
                    <button
                      id="testimonials-prev-btn"
                      onClick={handlePrev}
                      className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all cursor-pointer shadow-md active:scale-95"
                      aria-label="Previous Review"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      id="testimonials-next-btn"
                      onClick={handleNext}
                      className="p-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white border border-teal-500 transition-all cursor-pointer shadow-md active:scale-95"
                      aria-label="Next Review"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar: Social Proof Stats & Quick Highlights */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* Stat Box 1 */}
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white font-display">450+</div>
                  <div className="text-xs text-slate-400 font-medium">
                    Storefronts & venues in the Philippines
                  </div>
                </div>
              </div>

              {/* Stat Box 2 */}
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Star className="w-6 h-6 fill-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white font-display">4.9 / 5.0</div>
                  <div className="text-xs text-slate-400 font-medium">
                    Average client Google rating increase
                  </div>
                </div>
              </div>

              {/* Stat Box 3 */}
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white font-display">100%</div>
                  <div className="text-xs text-slate-400 font-medium">
                    Pre-programmed & tested prior to dispatch
                  </div>
                </div>
              </div>

              {/* Micro Quote Thumbnail Box */}
              <div className="bg-gradient-to-br from-teal-950/70 to-slate-900/90 backdrop-blur-xl border border-teal-500/30 rounded-2xl p-6 shadow-xl flex-1 flex flex-col justify-center space-y-3">
                <div className="flex items-center gap-2 text-teal-300 text-xs font-mono font-semibold">
                  <Quote className="w-4 h-4 text-teal-400" />
                  <span>Zero Subscription Fees</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Unlike software platforms that charge monthly fees to collect reviews, TAPREVIEWNFC is a one-time hardware purchase with unlimited lifetime taps."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
