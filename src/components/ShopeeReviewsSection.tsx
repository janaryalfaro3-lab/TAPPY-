import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle2, ThumbsUp, ShoppingBag, ShieldCheck, MessageSquareQuote } from 'lucide-react';

interface ShopeeReview {
  id: string;
  username: string;
  location: string;
  businessType: string;
  productVariant: string;
  rating: number;
  date: string;
  reviewText: string;
  tagline: string;
  helpfulCount: number;
  verified: boolean;
}

const SHOPEE_REVIEWS: ShopeeReview[] = [
  {
    id: 'shopee-1',
    username: 'patricia_cafe_bgc',
    location: 'BGC, Taguig',
    businessType: 'Specialty Café & Bakery',
    productVariant: 'Acrylic Google Review Standee (90 × 110 mm)',
    rating: 5,
    date: '2 days ago',
    tagline: 'From 18 to 86 reviews in 2 weeks!',
    reviewText:
      'Super ganda ng quality! Makapal yung clear acrylic at sobrang bilis mag-load ng Google Review link pag tinatap ng customers sa counter. From 18 reviews lang kami dati, in 2 weeks naging 86 reviews na agad! Worth every peso. Dumating din agad naka-bubble wrap nang maayos with pre-encoded chip.',
    helpfulCount: 42,
    verified: true,
  },
  {
    id: 'shopee-2',
    username: 'dr.kristine_dental',
    location: 'Quezon City',
    businessType: 'Dental Clinic & Orthodontics',
    productVariant: 'Acrylic NFC Tag (40 × 40 mm)',
    rating: 5,
    date: '5 days ago',
    tagline: 'Zero awkwardness sa reception desk.',
    reviewText:
      'Sobrang helpful nito sa reception desk namin sa clinic. Usually kasi nahihiya magtanong yung receptionist to ask for 5-star reviews, pero ngayon customers themselves tap their phones while paying. Smooth both sa iPhone and Samsung/Android. Responsive din si seller nung nag-request kami ng specific Google Place ID pre-programming!',
    helpfulCount: 38,
    verified: true,
  },
  {
    id: 'shopee-3',
    username: 'renz_autodetailing_dvo',
    location: 'Davao City',
    businessType: 'Auto Care & Detailing Hub',
    productVariant: 'PVC NFC Business Card (85.6 × 54 mm)',
    rating: 5,
    date: '1 week ago',
    tagline: 'Ready to use pagkabukas ng parcel.',
    reviewText:
      'Galing ng pre-programming, ready to use pagkabukas ng parcel. Pinamigay ko sa service advisors ko para pag ini-explain yung natapos na ceramic coating sa car owner, tap lang sa phone ng client. Ang laking tulong sa local SEO ranking ng shop namin sa Google Maps. Very professional look!',
    helpfulCount: 29,
    verified: true,
  },
  {
    id: 'shopee-4',
    username: 'chloe_nails_cebu',
    location: 'Cebu City',
    businessType: 'Nail & Lash Studio',
    productVariant: 'Acrylic Google Review Standee (90 × 110 mm)',
    rating: 5,
    date: '2 weeks ago',
    tagline: 'Aesthetic & instant tap speed!',
    reviewText:
      'Aesthetic tingnan sa cashier counter, match na match sa minimalist studio theme namin! Legit na no app needed—nag-try ako sa iPhone 13 at Android phone ng staff, 1 second lang lumabas agad review page with 5-star selector. Salamat seller, oorder ulit kami for our 2nd branch soon!',
    helpfulCount: 51,
    verified: true,
  },
  {
    id: 'shopee-5',
    username: 'chef_miguel_mnl',
    location: 'Makati City',
    businessType: 'Casual Dining Bistro',
    productVariant: 'PVC NFC Round Sticker (40 × 40 mm)',
    rating: 5,
    date: '3 weeks ago',
    tagline: 'Dinikit namin sa bill folders!',
    reviewText:
      'Napakadaling gamitin. Dinikit namin sa bill folders bago iabot yung resibo sa diners. Halos 70% ng satisfied guests nag-iiwan ng review on the spot kasi zero friction talaga, hindi na nila kailangan mag-search pa sa Google Maps. Fast shipping and secured packing via express courier.',
    helpfulCount: 34,
    verified: true,
  },
];

export const ShopeeReviewsSection: React.FC<{ isLoading?: boolean }> = ({
  isLoading = false,
}) => {
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [internalLoading, setInternalLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setInternalLoading(false);
    }, 750);
    return () => clearTimeout(timer);
  }, []);

  const currentlyLoading = isLoading || internalLoading;

  const toggleHelpful = (id: string) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <motion.section
      id="shopee-reviews-section"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="py-24 sm:py-32 bg-slate-950/50 backdrop-blur-xl text-white border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header with Verification Metrics */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-8 border-b border-slate-800 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium rounded-full">
              <ShoppingBag className="w-3.5 h-3.5 text-sky-400" />
              <span>Verified Customer Feedback</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Customer Reviews & Feedback
            </h2>
            <p className="text-sm text-slate-300">
              Verified business owners across cafés, clinics, salons, and hospitality in the Philippines.
            </p>
          </div>

          {/* Scorecard Badge */}
          <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-center pr-4 border-r border-slate-800">
              <div className="text-2xl font-bold text-white flex items-center justify-center gap-1.5">
                <span>4.9</span>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                Average Rating
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="text-slate-200 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>1,840+ Units Delivered</span>
              </div>
              <div className="text-slate-400 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Pre-Encoded & Tested</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Feedback Cards Grid or Skeletons */}
        {currentlyLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={`shopee-skeleton-${idx}`}
                className={`bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between space-y-6 ${
                  idx === 1 ? 'lg:col-span-2' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                    <div className="space-y-1.5">
                      <div className="h-4 w-28 bg-slate-800 rounded" />
                      <div className="h-3 w-40 bg-slate-800/60 rounded" />
                    </div>
                    <div className="h-3 w-16 bg-slate-800/60 rounded" />
                  </div>
                  <div className="h-4 w-20 bg-slate-800 rounded" />
                  <div className="h-5 w-3/4 bg-slate-800 rounded-md" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-800/70 rounded" />
                    <div className="h-3 w-11/12 bg-slate-800/60 rounded" />
                    <div className="h-3 w-4/5 bg-slate-800/50 rounded" />
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="h-3 w-32 bg-slate-800/60 rounded" />
                  <div className="h-6 w-16 bg-slate-800 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SHOPEE_REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`bg-slate-900/80 backdrop-blur-xl border border-slate-700/70 rounded-2xl p-6 flex flex-col justify-between hover:border-sky-400/60 hover:shadow-xl transition-all ${
                index === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="space-y-4">
                {/* Header: User & Rating */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">
                        {review.username}
                      </span>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-sky-500/20 border border-sky-500/30 text-sky-300 text-[8px] font-mono uppercase font-bold rounded">
                          <CheckCircle2 className="w-2.5 h-2.5 text-sky-400" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {review.businessType} • <span className="text-slate-300 font-medium">{review.location}</span>
                    </div>
                  </div>

                  {/* 5 Stars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FBBC05] text-[#FBBC05]" />
                    ))}
                  </div>
                </div>

                {/* Variant & Tagline */}
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-sky-300 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 inline-block font-semibold rounded mb-2">
                    Variant: {review.productVariant}
                  </div>
                  <h3 className="font-display text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <MessageSquareQuote className="w-4 h-4 text-slate-400 shrink-0" />
                    &ldquo;{review.tagline}&rdquo;
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed tracking-wide">
                    {review.reviewText}
                  </p>
                </div>
              </div>

              {/* Card Footer: Date & Helpful button */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                <span>{review.date}</span>
                <button
                  onClick={() => toggleHelpful(review.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-lg transition-colors cursor-pointer text-[10px] ${
                    likes[review.id]
                      ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>
                    Helpful ({review.helpfulCount + (likes[review.id] ? 1 : 0)})
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </motion.section>
  );
};
