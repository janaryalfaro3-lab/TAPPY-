import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Radio, Zap, Sparkles, Layers, RefreshCw } from 'lucide-react';

interface NfcBackground3DProps {
  className?: string;
  showControls?: boolean;
}

export const NfcBackground3D: React.FC<NfcBackground3DProps> = ({
  className = '',
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState<'hologram' | 'acrylic' | 'copper'>('hologram');
  const [isPulsing, setIsPulsing] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight1.position.set(5, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 1.8);
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x06b6d4, 3, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // --- Master Group for Card & NFC Assembly ---
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    // 1. 3D Rounded Card Body Geometry (Using ExtrudeGeometry)
    const cardWidth = 3.6;
    const cardHeight = 2.25;
    const radius = 0.16;
    const thickness = 0.08;

    const shape = new THREE.Shape();
    shape.moveTo(-cardWidth / 2 + radius, -cardHeight / 2);
    shape.lineTo(cardWidth / 2 - radius, -cardHeight / 2);
    shape.quadraticCurveTo(cardWidth / 2, -cardHeight / 2, cardWidth / 2, -cardHeight / 2 + radius);
    shape.lineTo(cardWidth / 2, cardHeight / 2 - radius);
    shape.quadraticCurveTo(cardWidth / 2, cardHeight / 2, cardWidth / 2 - radius, cardHeight / 2);
    shape.lineTo(-cardWidth / 2 + radius, cardHeight / 2);
    shape.quadraticCurveTo(-cardWidth / 2, cardHeight / 2, -cardWidth / 2, cardHeight / 2 - radius);
    shape.lineTo(-cardWidth / 2, -cardHeight / 2 + radius);
    shape.quadraticCurveTo(-cardWidth / 2, -cardHeight / 2, -cardWidth / 2 + radius, -cardHeight / 2);

    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };

    const cardGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    cardGeometry.center();

    // Material presets based on activePreset
    let cardColor = 0x0f172a;
    let cardTransmission = 0.65;
    let cardRoughness = 0.12;
    let cardMetalness = 0.2;
    let cardOpacity = 0.88;

    if (activePreset === 'acrylic') {
      cardColor = 0xf8fafc;
      cardTransmission = 0.92;
      cardRoughness = 0.05;
      cardMetalness = 0.05;
      cardOpacity = 0.95;
    } else if (activePreset === 'copper') {
      cardColor = 0x18181b;
      cardTransmission = 0.15;
      cardRoughness = 0.35;
      cardMetalness = 0.85;
      cardOpacity = 0.98;
    }

    const cardMaterial = new THREE.MeshPhysicalMaterial({
      color: cardColor,
      roughness: cardRoughness,
      metalness: cardMetalness,
      transmission: cardTransmission,
      opacity: cardOpacity,
      transparent: true,
      ior: 1.52,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });

    const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
    cardGroup.add(cardMesh);

    // 2. Copper NFC Antenna Coils (Concentric 3D Wire Traces)
    const coilGroup = new THREE.Group();
    const copperMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
    });

    const numCoils = 4;
    for (let i = 0; i < numCoils; i++) {
      const margin = 0.15 + i * 0.09;
      const cW = cardWidth - margin * 2;
      const cH = cardHeight - margin * 2;
      const cR = Math.max(0.04, radius - margin * 0.3);

      const coilPath = new THREE.Path();
      coilPath.moveTo(-cW / 2 + cR, -cH / 2);
      coilPath.lineTo(cW / 2 - cR, -cH / 2);
      coilPath.quadraticCurveTo(cW / 2, -cH / 2, cW / 2, -cH / 2 + cR);
      coilPath.lineTo(cW / 2, cH / 2 - cR);
      coilPath.quadraticCurveTo(cW / 2, cH / 2, cW / 2 - cR, cH / 2);
      coilPath.lineTo(-cW / 2 + cR, cH / 2);
      coilPath.quadraticCurveTo(-cW / 2, cH / 2, -cW / 2, cH / 2 - cR);
      coilPath.lineTo(-cW / 2, -cH / 2 + cR);
      coilPath.quadraticCurveTo(-cW / 2, -cH / 2, -cW / 2 + cR, -cH / 2);

      const points = coilPath.getPoints(50);
      const points3D = points.map((p) => new THREE.Vector3(p.x, p.y, 0));
      const curve = new THREE.CatmullRomCurve3(points3D, true);
      const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.014, 6, true);
      const tubeMesh = new THREE.Mesh(tubeGeo, copperMaterial);
      tubeMesh.position.z = thickness / 2 + 0.02;
      coilGroup.add(tubeMesh);

      // Backside coil too
      const tubeMeshBack = tubeMesh.clone();
      tubeMeshBack.position.z = -(thickness / 2 + 0.02);
      coilGroup.add(tubeMeshBack);
    }
    cardGroup.add(coilGroup);

    // 3. Central Silicon Microchip (NTAG213 Micro-Die)
    const chipGeo = new THREE.BoxGeometry(0.38, 0.38, 0.04);
    const chipMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.3,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
    });
    const chip = new THREE.Mesh(chipGeo, chipMat);
    chip.position.set(-0.9, 0.3, thickness / 2 + 0.03);
    cardGroup.add(chip);

    // Chip Gold Contact Pins
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 1.0,
      roughness: 0.1,
    });
    for (let p = -1; p <= 1; p += 2) {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.01), pinMat);
      pin.position.set(-0.9 + p * 0.12, 0.3, thickness / 2 + 0.055);
      cardGroup.add(pin);
    }

    // 4. NFC Contactless Waves Logo (3 Arc Lines)
    const wavesGroup = new THREE.Group();
    const waveMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.7,
    });

    for (let w = 1; w <= 3; w++) {
      const r = 0.2 + w * 0.14;
      const arcCurve = new THREE.EllipseCurve(
        0,
        0,
        r,
        r,
        -Math.PI / 3,
        Math.PI / 3,
        false,
        0
      );
      const arcPoints = arcCurve.getPoints(24);
      const arcPoints3D = arcPoints.map((pt) => new THREE.Vector3(pt.x, pt.y, 0));
      const arcSpline = new THREE.CatmullRomCurve3(arcPoints3D);
      const waveTubeGeo = new THREE.TubeGeometry(arcSpline, 32, 0.018, 6, false);
      const waveMesh = new THREE.Mesh(waveTubeGeo, waveMat);
      waveMesh.position.set(0.6, 0, thickness / 2 + 0.03);
      wavesGroup.add(waveMesh);
    }
    cardGroup.add(wavesGroup);

    // 5. 3D Pulsing Radio Frequency (RF) Toroidal Wave Rings
    const rfRingsGroup = new THREE.Group();
    const ringCount = 5;
    const ringMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < ringCount; i++) {
      const ringGeo = new THREE.TorusGeometry(1.2 + i * 0.65, 0.022, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x0ea5e9 : 0x6366f1,
        transparent: true,
        opacity: 0.5,
        wireframe: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.8;
      rfRingsGroup.add(ringMesh);
      ringMeshes.push(ringMesh);
    }
    scene.add(rfRingsGroup);

    // 6. Floating 3D RF Data Particle Cloud & Review Star Nodes
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    const pColor1 = new THREE.Color(0x38bdf8);
    const pColor2 = new THREE.Color(0x818cf8);
    const pColor3 = new THREE.Color(0x34d399);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 6;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const chosenColor = i % 3 === 0 ? pColor1 : i % 3 === 1 ? pColor2 : pColor3;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.006,
        y: (Math.random() - 0.5) * 0.006 + 0.002,
        z: (Math.random() - 0.5) * 0.004,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle sprite using canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(56,189,248,0.8)');
      gradient.addColorStop(1, 'rgba(14,165,233,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTex = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      map: particleTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Interactive Mouse / Pointer State ---
    let targetRotX = 0.15;
    let targetRotY = -0.25;
    let currentRotX = 0.15;
    let currentRotY = -0.25;
    let isHovering = false;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      targetRotY = normX * 0.8;
      targetRotX = -normY * 0.6;
      isHovering = true;
    };

    const handlePointerLeave = () => {
      targetRotX = 0.12;
      targetRotY = -0.2;
      isHovering = false;
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove, { passive: true });
    container.addEventListener('mouseleave', handlePointerLeave);

    // --- Resize Handling with ResizeObserver ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // --- Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp card rotation
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      cardGroup.rotation.x = currentRotX + Math.sin(elapsedTime * 1.2) * 0.06;
      cardGroup.rotation.y = currentRotY + Math.cos(elapsedTime * 1.4) * 0.08;
      cardGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Pulse chip emissive intensity
      chipMat.emissiveIntensity = 0.4 + Math.sin(elapsedTime * 4) * 0.35;
      pointLight.intensity = 2.5 + Math.sin(elapsedTime * 3) * 1.2;

      // Rotate and expand RF electromagnetic wave rings
      rfRingsGroup.rotation.z = elapsedTime * 0.25;
      rfRingsGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.2;

      ringMeshes.forEach((mesh, idx) => {
        const speed = 1.2;
        const phase = (elapsedTime * speed + idx * 0.6) % 3;
        const scale = 0.6 + phase * 0.8;
        mesh.scale.set(scale, scale, scale);

        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, (1 - phase / 3) * 0.55);
      });

      // Animate particles
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const vel = particleVelocities[i];
        posArray[i * 3] += vel.x;
        posArray[i * 3 + 1] += vel.y;
        posArray[i * 3 + 2] += vel.z;

        if (posArray[i * 3 + 1] > 4) posArray[i * 3 + 1] = -4;
        if (posArray[i * 3] > 6) posArray[i * 3] = -6;
        if (posArray[i * 3] < -6) posArray[i * 3] = 6;
      }
      posAttr.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries & materials
      cardGeometry.dispose();
      cardMaterial.dispose();
      chipGeo.dispose();
      chipMat.dispose();
      pinMat.dispose();
      copperMaterial.dispose();
      waveMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTex.dispose();
      ringMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [activePreset, isPulsing, wireframeMode]);

  return (
    <div className={`relative w-full h-full min-h-[420px] overflow-hidden ${className}`}>
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        title="Interactive 3D NFC Card - Drag or move mouse to rotate in 3D"
      />

      {/* 3D HUD Badges & Interactive Mode Controller */}
      {showControls && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-xl flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping mr-1" />
            <span className="font-bold text-white uppercase tracking-wider hidden sm:inline">
              3D NFC Field:
            </span>
            <span className="text-sky-400 font-semibold">13.56 MHz</span>
          </div>

          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1.5 shadow-xl flex items-center gap-1">
            <button
              onClick={() => setActivePreset('hologram')}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase transition-all ${
                activePreset === 'hologram'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Holo
            </button>
            <button
              onClick={() => setActivePreset('acrylic')}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase transition-all ${
                activePreset === 'acrylic'
                  ? 'bg-indigo-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Acrylic
            </button>
            <button
              onClick={() => setActivePreset('copper')}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase transition-all ${
                activePreset === 'copper'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Copper
            </button>
          </div>
        </div>
      )}

      {/* Floating 3D Interaction Hint */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200/90 text-slate-800 px-3 py-1.5 rounded-full shadow-md text-[11px] font-mono font-semibold">
        <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
        <span>3D Interactive NFC Model · Move cursor or touch to rotate</span>
      </div>
    </div>
  );
};
