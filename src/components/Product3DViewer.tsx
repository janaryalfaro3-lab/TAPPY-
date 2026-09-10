import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Layers,
  Sparkles,
  Compass,
  Eye,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { ProductMockup } from './ProductMockup';

interface Product3DViewerProps {
  format: 'stand' | 'tag' | 'card' | 'sticker';
  name: string;
  size?: string;
  material?: string;
  chipType?: string;
  customBusinessName?: string;
  photoImage: string;
  className?: string;
}

type AnglePreset = 'front' | 'perspective' | 'side' | 'back' | 'top';

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  format,
  name,
  size = '90 × 110 mm',
  material = 'Crystal Acrylic',
  chipType = 'NTAG213 Contactless',
  customBusinessName,
  photoImage,
  className = '',
}) => {
  const [yaw, setYaw] = useState<number>(25); // Y-axis rotation (0 to 360)
  const [pitch, setPitch] = useState<number>(-8); // X-axis tilt (-35 to +35)
  const [zoom, setZoom] = useState<number>(1);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeAnglePreset, setActiveAnglePreset] = useState<AnglePreset>('perspective');
  const [showWireframe, setShowWireframe] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  // Auto-rotation loop
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;

    let lastTime = performance.now();
    const rotateLoop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      setYaw((prev) => (prev + delta * 24) % 360);
      animFrameId.current = requestAnimationFrame(rotateLoop);
    };

    animFrameId.current = requestAnimationFrame(rotateLoop);

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isAutoRotating, isDragging]);

  // Drag interaction (Mouse & Touch)
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const deltaX = clientX - lastMousePos.current.x;
      const deltaY = clientY - lastMousePos.current.y;
      lastMousePos.current = { x: clientX, y: clientY };

      setYaw((prev) => (prev + deltaX * 0.75 + 360) % 360);
      setPitch((prev) => Math.max(-32, Math.min(32, prev - deltaY * 0.5)));
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global event listeners for drag
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onMouseUp = () => handlePointerUp();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => handlePointerUp();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Set Preset Angles
  const applyPreset = (preset: AnglePreset) => {
    setActiveAnglePreset(preset);
    setIsAutoRotating(false);
    switch (preset) {
      case 'front':
        setYaw(0);
        setPitch(0);
        break;
      case 'perspective':
        setYaw(30);
        setPitch(-10);
        break;
      case 'side':
        setYaw(82);
        setPitch(-4);
        break;
      case 'back':
        setYaw(180);
        setPitch(0);
        break;
      case 'top':
        setYaw(15);
        setPitch(28);
        break;
    }
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.75, Math.min(1.4, Number((prev + delta).toFixed(2)))));
  };

  const resetCamera = () => {
    applyPreset('perspective');
    setZoom(1);
    setIsAutoRotating(true);
  };

  // Determine light glare offset from yaw angle
  const normalizedYaw = ((yaw % 360) + 360) % 360;
  const isBackFacing = normalizedYaw > 90 && normalizedYaw < 270;
  const glareX = Math.sin((normalizedYaw * Math.PI) / 180) * 80;

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-neutral-950 text-slate-100 overflow-hidden border border-stone-800 shadow-2xl flex flex-col justify-between select-none ${className}`}
      style={{ minHeight: 380 }}
    >
      {/* 3D Ambient Studio Lighting */}
      <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-sky-500/12 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.3)_0,transparent_75%)] pointer-events-none" />

      {/* Top Header Controls */}
      <div className="relative z-20 flex items-center justify-between p-3.5 sm:p-4 border-b border-stone-800/80 bg-stone-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-inner">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>3D Model Inspector</span>
              <span className="text-[10px] text-sky-400 font-mono font-medium px-1.5 py-0.2 rounded bg-sky-950/80 border border-sky-800">
                360° SPIN
              </span>
            </div>
            <div className="text-[10px] text-stone-400 flex items-center gap-2">
              <span>{material}</span>
              <span>•</span>
              <span className="font-mono">{size}</span>
            </div>
          </div>
        </div>

        {/* View Controls: Auto-spin toggle & Wireframe */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer border ${
              isAutoRotating
                ? 'bg-sky-500/20 text-sky-300 border-sky-400/40 shadow-xs'
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
            }`}
            title={isAutoRotating ? 'Pause rotation' : 'Start auto-spin'}
          >
            {isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="hidden sm:inline">{isAutoRotating ? 'Auto-Spinning' : 'Spin'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowWireframe(!showWireframe)}
            className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
              showWireframe
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
            }`}
            title="Toggle microchip & antenna wireframe"
          >
            <Cpu className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={resetCamera}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 transition-all cursor-pointer"
            title="Reset to perspective"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Viewport Stage */}
      <div
        className="relative flex-1 w-full flex items-center justify-center p-6 cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          if (e.touches.length > 0) {
            handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        style={{ perspective: 1100 }}
      >
        {/* Soft Circular Floor Contact Shadow */}
        <div
          className="absolute bottom-6 w-48 sm:w-60 h-10 bg-black/80 rounded-full blur-xl pointer-events-none transition-transform duration-75"
          style={{
            transform: `rotateX(75deg) translateZ(-50px) scale(${zoom * (1 + Math.abs(pitch) * 0.015)})`,
          }}
        />

        {/* 3D Physical Model Container */}
        <div
          className="relative transition-transform duration-75 ease-out"
          style={{
            transform: `scale(${zoom}) rotateX(${pitch}deg) rotateY(${yaw}deg)`,
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.85))',
          }}
        >
          {/* Dynamic Specular Light Sweep overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-xl z-30 transition-opacity duration-300"
            style={{
              background: `linear-gradient(${105 + yaw * 0.5}deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%)`,
              opacity: isBackFacing ? 0.2 : 0.7,
              transform: `translateZ(12px) translateX(${glareX}px)`,
            }}
          />

          {/* FRONT FACE: Custom Branding & Visual Face */}
          <div
            className="relative"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
          >
            <ProductMockup
              format={format}
              customBusinessName={customBusinessName}
            />

            {/* Simulated Acrylic Glass Thickness Edge (Extrusion Layer) */}
            {format === 'stand' && (
              <div
                className="absolute inset-0 rounded-2xl border-2 border-white/20 pointer-events-none"
                style={{
                  transform: 'translateZ(-8px)',
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(2px)',
                }}
              />
            )}
          </div>

          {/* BACK FACE: Revealed when rotated > 90° */}
          <div
            className="absolute inset-0 rounded-xl bg-stone-900 border border-stone-700 p-4 flex flex-col justify-between text-white"
            style={{
              transform: 'rotateY(180deg) translateZ(2px)',
              backfaceVisibility: 'hidden',
              background:
                format === 'card'
                  ? '#0d1117'
                  : format === 'sticker'
                  ? '#18181b'
                  : 'rgba(24, 24, 27, 0.95)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
            }}
          >
            {/* Embedded NFC Antenna Coil Graphic & Hardware Specs */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-[10px] font-mono text-sky-400 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-sky-400" />
                {chipType}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">
                13.56 MHz
              </span>
            </div>

            {/* Visual Copper Wire Spiral Antenna Coil */}
            <div className="flex-1 my-2 rounded-lg border border-dashed border-amber-500/40 bg-amber-950/10 flex flex-col items-center justify-center p-3 relative overflow-hidden">
              <div className="w-20 h-20 rounded-full border-2 border-amber-500/40 flex items-center justify-center animate-pulse">
                <div className="w-14 h-14 rounded-full border border-amber-500/50 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-md bg-amber-500/30 border border-amber-400 flex items-center justify-center text-[8px] font-bold text-amber-200">
                    NFC
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-amber-300/80 font-mono mt-2">
                High-Sensitivity Microchip
              </span>
            </div>

            {/* Rear Footing / 3M Adhesive Indicator */}
            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[9px] text-stone-400">
              <span>{format === 'sticker' ? '3M Waterproof Adhesive' : 'Industrial Durability'}</span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Passive Zero-Battery
              </span>
            </div>
          </div>

          {/* Wireframe Overlay Mode */}
          {showWireframe && (
            <div
              className="absolute inset-0 pointer-events-none rounded-xl border-2 border-amber-400/80 bg-amber-500/10 z-40 flex items-center justify-center text-amber-300 text-xs font-mono font-bold"
              style={{ transform: 'translateZ(15px)' }}
            >
              <div className="text-center space-y-1 bg-black/80 p-3 rounded-lg border border-amber-500/50 shadow-xl">
                <div>CHIP: NXP NTAG213</div>
                <div>CAPACITY: 144 BYTES</div>
                <div>READ DISTANCE: 2-4 CM</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Camera Angle Presets & Zoom Bar */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between p-3 border-t border-stone-800/80 bg-stone-900/70 backdrop-blur-md gap-3">
        {/* Angle Presets */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full text-xs">
          <span className="text-[11px] text-stone-400 font-medium mr-1 shrink-0">Angles:</span>
          {(
            [
              { id: 'front', label: 'Front (0°)' },
              { id: 'perspective', label: '3D Angle' },
              { id: 'side', label: 'Profile' },
              { id: 'back', label: 'Antenna / Rear' },
              { id: 'top', label: 'Tabletop' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => applyPreset(item.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeAnglePreset === item.id && !isAutoRotating
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Zoom Controls & Hint */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-800 rounded-lg p-0.5 border border-stone-700 text-stone-300">
            <button
              type="button"
              onClick={() => handleZoom(-0.1)}
              disabled={zoom <= 0.75}
              className="p-1 hover:bg-stone-700 rounded text-stone-300 disabled:opacity-30 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1.5 min-w-[36px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => handleZoom(0.1)}
              disabled={zoom >= 1.4}
              className="p-1 hover:bg-stone-700 rounded text-stone-300 disabled:opacity-30 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[11px] text-stone-400 hidden md:inline">
            Drag to rotate freely
          </span>
        </div>
      </div>
    </div>
  );
};
