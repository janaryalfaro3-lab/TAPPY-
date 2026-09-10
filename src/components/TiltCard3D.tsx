import React, { createContext, useContext, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'motion/react';

interface TiltContextType {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  isHovered: MotionValue<number>;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
}

export const TiltContext = createContext<TiltContextType | null>(null);

export const useTiltContext = () => useContext(TiltContext);

interface TiltParallaxProps {
  children: React.ReactNode;
  offset?: number; // max pixels to shift (e.g. 8 to 14px)
  depth?: number; // translateZ in pixels (e.g. 25px)
  className?: string;
  id?: string;
}

/**
 * Parallax layer component that sits inside TiltCard3D.
 * Translates opposite/with mouse coordinates in real time with spring physics,
 * making items appear to float relative to the card backing.
 */
export const TiltParallax: React.FC<TiltParallaxProps> = ({
  children,
  offset = 8,
  depth = 25,
  className = '',
  id,
}) => {
  const context = useTiltContext();

  const shiftX = useTransform(
    context ? context.parallaxX : useMotionValue(0),
    [-1, 1],
    [-offset, offset]
  );
  const shiftY = useTransform(
    context ? context.parallaxY : useMotionValue(0),
    [-1, 1],
    [-offset, offset]
  );

  return (
    <motion.div
      id={id}
      style={{
        x: shiftX,
        y: shiftY,
        z: depth,
        transformStyle: 'preserve-3d',
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max degrees tilt, default 7
  perspective?: number; // CSS perspective, default 1000
  glare?: boolean;
  scale?: number; // hover scale, default 1.018
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  id?: string;
}

/**
 * High-performance 3D Tilt Card powered by Framer Motion physics springs.
 * Complements CSS 3D perspective transforms to create a responsive,
 * tangible 'tactile' feeling when users hover over individual hardware items.
 */
export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  children,
  className = '',
  maxTilt = 7,
  perspective = 1000,
  glare = true,
  scale = 1.018,
  onClick,
  id,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Framer motion values for normalized pointer coordinates (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isHovered = useMotionValue(0);

  // Spring physics configuration for responsive, organic dampening
  const springConfig = { damping: 24, stiffness: 220, mass: 0.6 };

  // Calculate rotation angles with spring dampening
  const rawRotateX = useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rawRotateY = useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const rotateX = useSpring(rawRotateX, springConfig);
  const rotateY = useSpring(rawRotateY, springConfig);

  // Parallax shifts for child layers
  const rawParallaxX = useTransform(x, [-0.5, 0.5], [-1, 1]);
  const rawParallaxY = useTransform(y, [-0.5, 0.5], [-1, 1]);
  const parallaxX = useSpring(rawParallaxX, springConfig);
  const parallaxY = useSpring(rawParallaxY, springConfig);

  // Subtle spring-based elevation scale
  const rawScale = useTransform(isHovered, [0, 1], [1, scale]);
  const animatedScale = useSpring(rawScale, { damping: 20, stiffness: 260 });

  // Dynamic glare position & intensity
  const glareOpacity = useSpring(useTransform(isHovered, [0, 1], [0, 0.65]), {
    damping: 20,
    stiffness: 200,
  });

  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Relative mouse position from center (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseX);
    y.set(mouseY);
    isHovered.set(1);
  };

  const handleMouseEnter = () => {
    isHovered.set(1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    isHovered.set(0);
  };

  return (
    <TiltContext.Provider
      value={{
        mouseX: x,
        mouseY: y,
        isHovered,
        parallaxX,
        parallaxY,
      }}
    >
      <motion.div
        id={id}
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective,
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
          scale: animatedScale,
        }}
        className={`relative will-change-transform select-none ${className}`}
      >
        {/* Dynamic Framer Motion Glare / Sheen Layer */}
        {glare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl z-30 transition-opacity duration-300"
            style={{
              opacity: glareOpacity,
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle 280px at ${gx} ${gy}, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 80%)`
              ),
            }}
          />
        )}

        {/* Card Content with 3D Depth Layering */}
        <div className="w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {children}
        </div>
      </motion.div>
    </TiltContext.Provider>
  );
};

