import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, RotateCw, Layers, ZoomIn } from 'lucide-react';
import { ProductMockup } from './ProductMockup';
import { ProgressiveImage } from './ProgressiveImage';

interface Product3DStageProps {
  format: 'stand' | 'tag' | 'card' | 'sticker';
  name: string;
  image: string;
  size?: string;
  material?: string;
  className?: string;
  customBusinessName?: string;
}

export const Product3DStage: React.FC<Product3DStageProps> = ({
  format,
  name,
  image,
  size,
  material,
  className = '',
  customBusinessName,
}) => {
  const [rotateX, setRotateX] = useState(-6);
  const [rotateY, setRotateY] = useState(14);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'3d' | 'photo'>('3d');
  const stageRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      setRotateY((prev) => Math.max(-40, Math.min(40, prev + deltaX * 0.4)));
      setRotateX((prev) => Math.max(-30, Math.min(30, prev - deltaY * 0.4)));
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const reset3D = () => {
    setRotateX(-6);
    setRotateY(14);
  };

  return (
    <div
      ref={stageRef}
      className={`relative w-full rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 flex flex-col items-center justify-between overflow-hidden shadow-2xl border border-slate-800 ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* 3D Ambient Lighting Effect */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-sky-500/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -bottom-10 inset-x-0 h-32 bg-gradient-to-t from-sky-500/10 to-transparent pointer-events-none" />

      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between z-20 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-[11px] font-semibold text-sky-400">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>Interactive 3D Stage</span>
          </span>
          {size && (
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              {size}
            </span>
          )}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('3d')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer font-medium ${
              activeTab === '3d'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Rotate
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer font-medium ${
              activeTab === 'photo'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Real Studio Photo
          </button>
        </div>
      </div>

      {/* Center Display Area */}
      <div className="relative w-full flex-1 min-h-[300px] sm:min-h-[340px] flex items-center justify-center select-none">
        {activeTab === '3d' ? (
          <div
            onMouseDown={handleMouseDown}
            className={`cursor-grab active:cursor-grabbing relative flex flex-col items-center justify-center p-8 transition-transform duration-75`}
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* 3D Depth Shadow on Floor */}
            <div
              className="absolute -bottom-8 w-44 sm:w-56 h-10 bg-black/60 rounded-full blur-xl pointer-events-none"
              style={{
                transform: `rotateX(80deg) translateZ(-40px) scale(${1 + Math.abs(rotateY) * 0.01})`,
              }}
            />

            {/* The 3D Mockup with tactile acrylic depth */}
            <div
              style={{
                transform: 'translateZ(30px)',
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))',
              }}
            >
              <ProductMockup
                format={format}
                customBusinessName={customBusinessName}
              />
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-sm aspect-[4/3] rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-black">
            <ProgressiveImage
              src={image}
              alt={name}
              aspectRatio="aspect-[4/3]"
              objectFit="contain"
              priority={true}
              className="w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Bottom Hint and Reset Bar */}
      <div className="w-full flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 z-20">
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span>{activeTab === '3d' ? 'Drag horizontally or vertically to tilt in 3D' : 'High-definition physical studio cut'}</span>
        </span>

        {activeTab === '3d' && (
          <button
            type="button"
            onClick={reset3D}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3 h-3" />
            <span>Reset View</span>
          </button>
        )}
      </div>
    </div>
  );
};
