import React, { useEffect, useState } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const progress = Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      id="scroll-progress-container"
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-[3px] bg-zinc-200/40 backdrop-blur-xs"
      aria-hidden="true"
    >
      <div
        id="scroll-progress-indicator"
        className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-teal-400 transition-[width] duration-150 ease-out relative shadow-[0_0_12px_rgba(14,165,233,0.8)]"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Subtle glowing beacon at the leading edge */}
        {scrollProgress > 1 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#0284C7] ring-2 ring-sky-400/80 -mr-1" />
        )}
      </div>
    </div>
  );
};
