import React from 'react';

export type ProductFormat = 'stand' | 'tag' | 'card' | 'sticker';

interface ProductMockupProps {
  format: ProductFormat;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  customBusinessName?: string;
}

export const GoogleGLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      fill="#4285F4"
    />
    <path
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      fill="#34A853"
    />
    <path
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      fill="#FBBC05"
    />
    <path
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      fill="#EA4335"
    />
  </svg>
);

export const FiveStars: React.FC<{ size?: string }> = ({ size = 'w-3 h-3' }) => (
  <div className="flex items-center gap-0.5 text-[#FBBC05]">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`${size} text-[#FBBC05] shrink-0 drop-shadow-xs`}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export const PhoneNfcIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Smartphone Outline */}
    <rect x="14" y="6" width="20" height="36" rx="4" className="stroke-current" />
    <path d="M22 36h4" className="stroke-current" />
    {/* NFC Waves on left */}
    <path d="M8 18a10 10 0 0 0 0 12" className="stroke-current stroke-2" />
    <path d="M4 14a16 16 0 0 0 0 20" className="stroke-current stroke-2" />
    {/* NFC chip mini badge */}
    <rect x="18" y="14" width="12" height="12" rx="2" className="stroke-current stroke-[1.5]" />
    <text x="24" y="23" textAnchor="middle" fill="currentColor" stroke="none" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">NFC</text>
  </svg>
);

export const MiniQrCode: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 40 40" fill="currentColor" className={className}>
    {/* Top Left Finder */}
    <rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <rect x="5.5" y="5.5" width="5" height="5" />
    {/* Top Right Finder */}
    <rect x="26" y="2" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <rect x="29.5" y="5.5" width="5" height="5" />
    {/* Bottom Left Finder */}
    <rect x="2" y="26" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <rect x="5.5" y="29.5" width="5" height="5" />
    {/* QR Data Dots */}
    <rect x="17" y="3" width="3" height="3" />
    <rect x="21" y="7" width="3" height="3" />
    <rect x="17" y="11" width="3" height="3" />
    <rect x="3" y="17" width="3" height="3" />
    <rect x="7" y="21" width="3" height="3" />
    <rect x="17" y="17" width="6" height="6" />
    <rect x="26" y="17" width="3" height="3" />
    <rect x="34" y="21" width="4" height="3" />
    <rect x="17" y="26" width="3" height="5" />
    <rect x="21" y="33" width="5" height="4" />
    <rect x="29" y="27" width="4" height="3" />
    <rect x="34" y="33" width="4" height="4" />
  </svg>
);

export const ProductMockup: React.FC<ProductMockupProps> = ({
  format,
  className = '',
  size = 'md',
  customBusinessName,
}) => {
  // Render based on product format

  // 1. Acrylic Google Review Standee (90 x 110 mm)
  if (format === 'stand') {
    return (
      <div className={`relative flex flex-col items-center justify-end select-none ${className}`}>
        {/* Crystal Acrylic Outer Bevel Frame */}
        <div className="relative p-2 pb-0 bg-white/10 rounded-t-sm shadow-[0_12px_36px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.6),inset_0_-1px_2px_rgba(0,0,0,0.4)] backdrop-blur-xs border border-white/30 border-b-0">
          {/* Acrylic Gloss Reflection Stripe */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none z-20" />
          <div className="absolute top-0 right-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none z-20" />

          {/* Internal Printed Card (Dual Tone: Black Top + Wave + White Bottom) */}
          <div className="w-44 sm:w-48 md:w-52 aspect-[9/11] bg-black relative overflow-hidden flex flex-col justify-between shadow-inner">
            {/* Top Half: Jet Black (#000000) */}
            <div className="p-3.5 pt-4 flex items-start gap-2.5 z-10">
              <GoogleGLogo className="w-8 h-8 shrink-0 drop-shadow-md" />
              <div className="text-left space-y-0.5">
                <div className="text-[10px] text-white/90 font-sans tracking-wide leading-tight">
                  review us
                </div>
                <div className="text-[13px] font-bold text-white tracking-tight leading-tight">
                  {customBusinessName || 'on Google'}
                </div>
                <FiveStars size="w-3 h-3" />
              </div>
            </div>

            {/* Organic Smooth Wave Vector Divider */}
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-end">
              <svg
                viewBox="0 0 200 240"
                className="w-full h-full preserve-3d"
                fill="none"
                preserveAspectRatio="none"
              >
                {/* Crisp White Wave Bottom Half */}
                <path
                  d="M 0 105 Q 60 70 120 110 T 200 95 L 200 240 L 0 240 Z"
                  fill="#FFFFFF"
                />
              </svg>
            </div>

            {/* Bottom Half Content (Sitting on Crisp White) */}
            <div className="relative z-10 p-3 pt-6 text-[#0A0A0A] flex flex-col justify-between flex-1">
              <div className="mt-auto grid grid-cols-5 items-center gap-1 text-center">
                {/* Left: Tap Phone */}
                <div className="col-span-2 flex flex-col items-center">
                  <span className="text-[8px] font-semibold text-[#111111] leading-tight mb-1">
                    Tap your phone
                  </span>
                  <div className="text-[#0A0A0A]">
                    <PhoneNfcIcon className="w-7 h-7" />
                  </div>
                </div>

                {/* Center: or */}
                <div className="col-span-1 text-[9px] font-medium text-[#666666]">
                  or
                </div>

                {/* Right: Scan QR */}
                <div className="col-span-2 flex flex-col items-center">
                  <span className="text-[8px] font-semibold text-[#111111] leading-tight mb-1">
                    Scan QR code
                  </span>
                  <div className="text-[#0A0A0A] bg-white p-0.5 border border-black/10 shadow-xs">
                    <MiniQrCode className="w-7 h-7" />
                  </div>
                </div>
              </div>

              {/* Bottom Brand Stamp */}
              <div className="text-center pt-2">
                <span className="text-[8px] font-sans font-bold tracking-wider text-[#1A1A1A]">
                  tappy™
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Crystal Clear Acrylic Stand Base */}
        <div className="w-52 sm:w-56 md:w-60 h-4 sm:h-5 bg-gradient-to-b from-white/30 via-white/10 to-black/60 border border-white/40 shadow-[0_10px_25px_rgba(0,0,0,0.9)] relative flex items-center justify-center">
          <div className="w-3/4 h-[1px] bg-white/60 mx-auto" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    );
  }

  // 2. Acrylic NFC Tag (Square - 40 x 40 mm)
  if (format === 'tag') {
    return (
      <div className={`relative flex flex-col items-center justify-end select-none ${className}`}>
        {/* Crystal Acrylic Frame (Square) */}
        <div className="relative p-1.5 pb-0 bg-white/10 rounded-t-sm shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.6)] backdrop-blur-xs border border-white/30 border-b-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none z-20" />

          {/* Internal Printed Square Card */}
          <div className="w-36 sm:w-40 aspect-square bg-black relative overflow-hidden flex flex-col justify-between shadow-inner">
            {/* Top Half: Jet Black */}
            <div className="p-2.5 pt-3 flex items-start gap-2 z-10">
              <GoogleGLogo className="w-6 h-6 shrink-0 drop-shadow-md" />
              <div className="text-left space-y-0.5">
                <div className="text-[8px] text-white/90 font-sans leading-none">
                  review us
                </div>
                <div className="text-[10px] font-bold text-white tracking-tight leading-tight">
                  on Google
                </div>
                <FiveStars size="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Organic Smooth Wave Vector Divider */}
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-end">
              <svg
                viewBox="0 0 160 160"
                className="w-full h-full"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0 70 Q 50 48 95 75 T 160 65 L 160 160 L 0 160 Z"
                  fill="#FFFFFF"
                />
              </svg>
            </div>

            {/* Bottom Half Content (Crisp White) */}
            <div className="relative z-10 p-2 pt-3 text-[#0A0A0A] flex flex-col justify-between flex-1">
              <div className="mt-auto grid grid-cols-5 items-center gap-0.5 text-center">
                <div className="col-span-2 flex flex-col items-center">
                  <span className="text-[7px] font-semibold text-[#111111] leading-none mb-0.5">
                    Tap phone
                  </span>
                  <PhoneNfcIcon className="w-5 h-5 text-[#0A0A0A]" />
                </div>
                <div className="col-span-1 text-[7px] font-medium text-[#666666]">
                  or
                </div>
                <div className="col-span-2 flex flex-col items-center">
                  <span className="text-[7px] font-semibold text-[#111111] leading-none mb-0.5">
                    Scan QR
                  </span>
                  <MiniQrCode className="w-5 h-5 text-[#0A0A0A]" />
                </div>
              </div>

              <div className="text-center pt-1">
                <span className="text-[7px] font-sans font-bold text-[#1A1A1A]">
                  tappy™
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Square Acrylic Base */}
        <div className="w-42 sm:w-46 h-3.5 bg-gradient-to-b from-white/30 via-white/10 to-black/60 border border-white/40 shadow-[0_8px_20px_rgba(0,0,0,0.9)] relative flex items-center justify-center">
          <div className="w-3/4 h-[1px] bg-white/60 mx-auto" />
        </div>
      </div>
    );
  }

  // 3. PVC NFC Business Card (85.6 x 54 mm)
  if (format === 'card') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        {/* PVC Card Body with Rounded Corners */}
        <div className="w-48 sm:w-56 md:w-60 aspect-[85.6/54] bg-black rounded-xl border border-white/20 shadow-[0_14px_35px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col justify-between group">
          {/* Subtle Matte PVC Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-20" />

          {/* Top Half: Jet Black */}
          <div className="p-3 pt-3.5 flex items-start gap-2.5 z-10">
            <GoogleGLogo className="w-7 h-7 shrink-0 drop-shadow-md" />
            <div className="text-left space-y-0.5">
              <div className="text-[9px] text-white/90 font-sans leading-none">
                review us
              </div>
              <div className="text-[12px] font-bold text-white tracking-tight leading-tight">
                on Google
              </div>
              <FiveStars size="w-2.5 h-2.5" />
            </div>
          </div>

          {/* Organic Smooth Wave Vector Divider */}
          <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-end">
            <svg
              viewBox="0 0 200 126"
              className="w-full h-full"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 52 Q 60 34 115 56 T 200 48 L 200 126 L 0 126 Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>

          {/* Bottom Half Content (Crisp White) */}
          <div className="relative z-10 p-2.5 pt-2 text-[#0A0A0A] flex flex-col justify-between flex-1">
            <div className="mt-auto grid grid-cols-5 items-center gap-1 text-center">
              <div className="col-span-2 flex flex-col items-center">
                <span className="text-[7.5px] font-semibold text-[#111111] leading-none mb-0.5">
                  Tap your phone
                </span>
                <PhoneNfcIcon className="w-5 h-5 text-[#0A0A0A]" />
              </div>
              <div className="col-span-1 text-[8px] font-medium text-[#666666]">
                or
              </div>
              <div className="col-span-2 flex flex-col items-center">
                <span className="text-[7.5px] font-semibold text-[#111111] leading-none mb-0.5">
                  Scan QR code
                </span>
                <MiniQrCode className="w-5 h-5 text-[#0A0A0A]" />
              </div>
            </div>

            <div className="text-center pt-1">
              <span className="text-[7px] font-sans font-bold text-[#1A1A1A]">
                tappy™
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. PVC NFC Sticker (Round - 40 x 40 mm)
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Circular Round PVC Sticker with 3M Border */}
      <div className="w-36 sm:w-42 aspect-square rounded-full bg-black border-2 border-white/25 shadow-[0_12px_32px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col justify-between">
        {/* Subtle Matte Sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-20 rounded-full" />

        {/* Top Half: Jet Black inside circle */}
        <div className="p-3 pt-3.5 flex flex-col items-center text-center z-10 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <GoogleGLogo className="w-6 h-6 shrink-0 drop-shadow-md" />
            <div className="text-left">
              <div className="text-[7.5px] text-white/90 font-sans leading-none">
                review us
              </div>
              <div className="text-[10px] font-bold text-white tracking-tight leading-tight">
                on Google
              </div>
            </div>
          </div>
          <FiveStars size="w-2 h-2" />
        </div>

        {/* Organic Smooth Wave Vector Divider for Circle */}
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-end">
          <svg
            viewBox="0 0 160 160"
            className="w-full h-full"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 78 Q 50 56 100 84 T 160 72 L 160 160 L 0 160 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>

        {/* Bottom Half Content (Crisp White) */}
        <div className="relative z-10 p-2.5 pb-2 text-[#0A0A0A] flex flex-col justify-between flex-1">
          <div className="mt-auto grid grid-cols-5 items-center gap-0.5 text-center px-2">
            <div className="col-span-2 flex flex-col items-center">
              <span className="text-[6.5px] font-semibold text-[#111111] leading-none mb-0.5">
                Tap phone
              </span>
              <PhoneNfcIcon className="w-4 h-4 text-[#0A0A0A]" />
            </div>
            <div className="col-span-1 text-[7px] font-medium text-[#666666]">
              or
            </div>
            <div className="col-span-2 flex flex-col items-center">
              <span className="text-[6.5px] font-semibold text-[#111111] leading-none mb-0.5">
                Scan QR
              </span>
              <MiniQrCode className="w-4 h-4 text-[#0A0A0A]" />
            </div>
          </div>

          <div className="text-center pt-0.5">
            <span className="text-[6.5px] font-sans font-bold text-[#1A1A1A]">
              tappy™
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
