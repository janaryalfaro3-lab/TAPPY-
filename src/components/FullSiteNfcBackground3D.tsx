import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Radio, Sparkles, Eye, EyeOff, Cpu, Wifi } from 'lucide-react';

interface FullSiteNfcBackground3DProps {
  intensity?: 'ambient' | 'vibrant';
}

export const FullSiteNfcBackground3D: React.FC<FullSiteNfcBackground3DProps> = ({
  intensity = 'ambient',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [themeMode, setThemeMode] = useState<'hologram' | 'obsidian' | 'cyber'>('hologram');
  const [show3dHud, setShow3dHud] = useState(true);
  const [rfPulseActive, setRfPulseActive] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    // Subtle scene fog for infinite 3D depth
    scene.fog = new THREE.FogExp2(0x090d16, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // --- 2. Dynamic Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const cyanSpot = new THREE.PointLight(0x0ea5e9, 3.5, 25);
    cyanSpot.position.set(6, 6, 4);
    scene.add(cyanSpot);

    const indigoSpot = new THREE.PointLight(0x6366f1, 3.0, 25);
    indigoSpot.position.set(-6, -4, 3);
    scene.add(indigoSpot);

    const goldPulse = new THREE.PointLight(0xf59e0b, 2.5, 15);
    goldPulse.position.set(0, 0, 2);
    scene.add(goldPulse);

    // --- 3. Master 3D Objects Collection ---

    // A. Main Floating NFC Business Card & Antenna Array
    const mainCardGroup = new THREE.Group();
    scene.add(mainCardGroup);

    // Card Body
    const cardW = 3.6;
    const cardH = 2.25;
    const cardR = 0.16;
    const cardThick = 0.06;

    const cardShape = new THREE.Shape();
    cardShape.moveTo(-cardW / 2 + cardR, -cardH / 2);
    cardShape.lineTo(cardW / 2 - cardR, -cardH / 2);
    cardShape.quadraticCurveTo(cardW / 2, -cardH / 2, cardW / 2, -cardH / 2 + cardR);
    cardShape.lineTo(cardW / 2, cardH / 2 - cardR);
    cardShape.quadraticCurveTo(cardW / 2, cardH / 2, cardW / 2 - cardR, cardH / 2);
    cardShape.lineTo(-cardW / 2 + cardR, cardH / 2);
    cardShape.quadraticCurveTo(-cardW / 2, cardH / 2, -cardW / 2, cardH / 2 - cardR);
    cardShape.lineTo(-cardW / 2, -cardH / 2 + cardR);
    cardShape.quadraticCurveTo(-cardW / 2, -cardH / 2, -cardW / 2 + cardR, -cardH / 2);

    const cardGeo = new THREE.ExtrudeGeometry(cardShape, {
      depth: cardThick,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    });
    cardGeo.center();

    const cardMat = new THREE.MeshPhysicalMaterial({
      color: themeMode === 'obsidian' ? 0x030712 : themeMode === 'cyber' ? 0x022c22 : 0x0b1329,
      roughness: 0.1,
      metalness: 0.3,
      transmission: 0.7,
      opacity: 0.9,
      transparent: true,
      ior: 1.5,
      reflectivity: 0.95,
      clearcoat: 1.0,
    });

    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    mainCardGroup.add(cardMesh);

    // Copper Antenna Coils (NFC induction loops)
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.45,
    });

    for (let i = 0; i < 4; i++) {
      const margin = 0.16 + i * 0.09;
      const cW = cardW - margin * 2;
      const cH = cardH - margin * 2;
      const cR = Math.max(0.04, cardR - margin * 0.3);

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

      const pts = coilPath.getPoints(40);
      const pts3D = pts.map((p) => new THREE.Vector3(p.x, p.y, 0));
      const curve = new THREE.CatmullRomCurve3(pts3D, true);
      const tubeGeo = new THREE.TubeGeometry(curve, 50, 0.015, 6, true);
      const tubeMesh = new THREE.Mesh(tubeGeo, copperMat);
      tubeMesh.position.z = cardThick / 2 + 0.02;
      mainCardGroup.add(tubeMesh);
    }

    // Silicon NTAG213 Microchip Die
    const chipGeo = new THREE.BoxGeometry(0.4, 0.4, 0.04);
    const chipMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.7,
    });
    const chipMesh = new THREE.Mesh(chipGeo, chipMat);
    chipMesh.position.set(-0.85, 0.3, cardThick / 2 + 0.03);
    mainCardGroup.add(chipMesh);

    // NFC Radio-Wave Contactless Arcs on Card
    const arcMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
    });
    for (let a = 1; a <= 3; a++) {
      const arcCurve = new THREE.EllipseCurve(0, 0, 0.18 + a * 0.14, 0.18 + a * 0.14, -Math.PI / 3, Math.PI / 3, false, 0);
      const arcPts = arcCurve.getPoints(24).map((p) => new THREE.Vector3(p.x, p.y, 0));
      const arcSpline = new THREE.CatmullRomCurve3(arcPts);
      const arcGeo = new THREE.TubeGeometry(arcSpline, 24, 0.018, 5, false);
      const arcMesh = new THREE.Mesh(arcGeo, arcMat);
      arcMesh.position.set(0.65, 0, cardThick / 2 + 0.03);
      mainCardGroup.add(arcMesh);
    }

    mainCardGroup.position.set(2.8, 0.2, -0.5);
    mainCardGroup.rotation.set(0.2, -0.4, 0.05);

    // B. Secondary 3D Floating Standee & Tag in Background
    // 3D Acrylic Standee
    const standGroup = new THREE.Group();
    const standBodyGeo = new THREE.BoxGeometry(1.6, 2.2, 0.08);
    const standMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      roughness: 0.05,
      transmission: 0.9,
      opacity: 0.85,
      transparent: true,
      ior: 1.5,
    });
    const standBody = new THREE.Mesh(standBodyGeo, standMat);
    standGroup.add(standBody);

    // Stand Base
    const standBaseGeo = new THREE.BoxGeometry(1.8, 0.12, 0.9);
    const standBase = new THREE.Mesh(standBaseGeo, standMat);
    standBase.position.y = -1.1;
    standGroup.add(standBase);

    standGroup.position.set(-4.5, -1.8, -2.5);
    standGroup.rotation.set(0.15, 0.35, -0.1);
    scene.add(standGroup);

    // 3D Circular NFC Keychain / Tag
    const tagGroup = new THREE.Group();
    const tagGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.08, 32);
    const tagMat = new THREE.MeshPhysicalMaterial({
      color: 0x6366f1,
      roughness: 0.15,
      transmission: 0.75,
      opacity: 0.85,
      transparent: true,
    });
    const tagMesh = new THREE.Mesh(tagGeo, tagMat);
    tagMesh.rotation.x = Math.PI / 2;
    tagGroup.add(tagMesh);

    // Tag Loop ring
    const tagLoopGeo = new THREE.TorusGeometry(0.9, 0.02, 16, 32);
    const tagLoop = new THREE.Mesh(tagLoopGeo, copperMat);
    tagGroup.add(tagLoop);

    tagGroup.position.set(-3.2, 2.8, -1.8);
    tagGroup.rotation.set(0.4, -0.2, 0.2);
    scene.add(tagGroup);

    // C. 3D Electromagnetic Wave Rings (13.56 MHz Pulsing Field)
    const waveGroup = new THREE.Group();
    const ringCount = 7;
    const waveRings: THREE.Mesh[] = [];

    for (let r = 0; r < ringCount; r++) {
      const ringGeo = new THREE.TorusGeometry(1.5 + r * 0.8, 0.02, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r % 2 === 0 ? 0x38bdf8 : 0x818cf8,
        transparent: true,
        opacity: 0.4,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.5;
      waveGroup.add(ringMesh);
      waveRings.push(ringMesh);
    }
    waveGroup.position.set(1.5, 0, -1);
    scene.add(waveGroup);

    // D. Global 3D Particle Constellation (NFC Bytes & 5-Star Nodes)
    const particleCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const pVelocities: { x: number; y: number; z: number }[] = [];

    const colCyan = new THREE.Color(0x38bdf8);
    const colIndigo = new THREE.Color(0x818cf8);
    const colGold = new THREE.Color(0xfacc15);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 10;
      pPositions[i * 3] = x;
      pPositions[i * 3 + 1] = y;
      pPositions[i * 3 + 2] = z;

      const c = i % 4 === 0 ? colGold : i % 2 === 0 ? colCyan : colIndigo;
      pColors[i * 3] = c.r;
      pColors[i * 3 + 1] = c.g;
      pColors[i * 3 + 2] = c.b;

      pVelocities.push({
        x: (Math.random() - 0.5) * 0.004,
        y: (Math.random() - 0.5) * 0.004 + 0.001,
        z: (Math.random() - 0.5) * 0.003,
      });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    // Particle sprite
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.8)');
      grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const pTex = new THREE.CanvasTexture(pCanvas);

    const pMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      map: pTex,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // --- 4. Interactive Mouse, Scroll & Parallax Handlers ---
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let targetCameraZ = 9;
    let scrollProgress = 0;

    const handlePointerMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollProgress = window.scrollY / maxScroll;
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    };

    window.addEventListener('resize', handleResize);

    // --- 5. Main 3D Animation Loop ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera adapts to scroll progression across sections
      targetCameraY = -scrollProgress * 4.5 + mouseY * 0.4;
      targetCameraX = Math.sin(scrollProgress * Math.PI * 2) * 1.5 + mouseX * 0.6;
      targetCameraZ = 9 - Math.sin(scrollProgress * Math.PI) * 2.5;

      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
      camera.lookAt(0, targetCameraY * 0.7, 0);

      // Card animation (hovering + rotating gently)
      mainCardGroup.rotation.y = -0.4 + Math.sin(elapsed * 0.8) * 0.15 + mouseX * 0.25;
      mainCardGroup.rotation.x = 0.2 + Math.cos(elapsed * 0.9) * 0.1 - mouseY * 0.2;
      mainCardGroup.position.y = Math.sin(elapsed * 1.2) * 0.25 - scrollProgress * 2;

      // Stand & Tag orbit subtly
      standGroup.rotation.y = 0.35 + Math.sin(elapsed * 0.5) * 0.2;
      standGroup.position.y = -1.8 + Math.cos(elapsed * 0.7) * 0.2 - scrollProgress * 3;

      tagGroup.rotation.z = elapsed * 0.3;
      tagGroup.position.y = 2.8 + Math.sin(elapsed * 0.9) * 0.3 - scrollProgress * 2.5;

      // 13.56 MHz RF Waves expansion animation
      if (rfPulseActive) {
        waveRings.forEach((ring, idx) => {
          const speed = 1.0;
          const cycle = (elapsed * speed + idx * 0.45) % 3;
          const scale = 0.5 + cycle * 0.75;
          ring.scale.set(scale, scale, scale);

          const rMat = ring.material as THREE.MeshBasicMaterial;
          rMat.opacity = Math.max(0, (1 - cycle / 3) * 0.45);
        });
      }

      // Lights pulsing
      chipMat.emissiveIntensity = 0.5 + Math.sin(elapsed * 3.5) * 0.35;
      goldPulse.intensity = 2.0 + Math.sin(elapsed * 2) * 1.0;

      // Particles gentle drift
      const posArray = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const vel = pVelocities[i];
        posArray[i * 3] += vel.x;
        posArray[i * 3 + 1] += vel.y;
        posArray[i * 3 + 2] += vel.z;

        if (posArray[i * 3 + 1] > 9) posArray[i * 3 + 1] = -9;
        if (posArray[i * 3] > 12) posArray[i * 3] = -12;
        if (posArray[i * 3] < -12) posArray[i * 3] = 12;
      }
      pGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Geometry & material disposal
      cardGeo.dispose();
      cardMat.dispose();
      standBodyGeo.dispose();
      standBaseGeo.dispose();
      standMat.dispose();
      tagGeo.dispose();
      tagLoopGeo.dispose();
      tagMat.dispose();
      chipGeo.dispose();
      chipMat.dispose();
      copperMat.dispose();
      arcMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      pTex.dispose();
      waveRings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [themeMode, rfPulseActive]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
      {/* ThreeJS WebGL Canvas */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Global 3D Ambient Atmospheric Mesh Overlays */}
      <div className="absolute inset-0 bg-radial-mesh opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-slate-950/80 pointer-events-none" />

      {/* Floating 3D NFC HUD Controller (Bottom Left Corner) */}
      <div className="fixed bottom-5 left-5 z-40 pointer-events-auto flex items-center gap-2">
        {show3dHud ? (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-2xl flex items-center gap-3 text-xs font-mono text-slate-300 ring-1 ring-white/10 animate-fade-in">
            <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
              </span>
              <span className="font-bold text-white uppercase tracking-wider text-[11px] hidden sm:inline">
                Full 3D NFC Field
              </span>
              <span className="text-sky-400 font-semibold text-[10px]">13.56 MHz</span>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setThemeMode('hologram')}
                title="Holographic Sapphire NFC"
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
                  themeMode === 'hologram'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Holo
              </button>
              <button
                onClick={() => setThemeMode('obsidian')}
                title="Obsidian Stealth NFC"
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
                  themeMode === 'obsidian'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Stealth
              </button>
              <button
                onClick={() => setThemeMode('cyber')}
                title="Emerald Cyber NFC"
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
                  themeMode === 'cyber'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Cyber
              </button>
            </div>

            <button
              onClick={() => setShow3dHud(false)}
              className="p-1 text-slate-500 hover:text-slate-300 transition-colors rounded-lg ml-1"
              title="Minimize HUD"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShow3dHud(true)}
            className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-xl text-sky-400 hover:text-white shadow-xl ring-1 ring-white/10 flex items-center gap-1.5 text-[11px] font-mono font-bold"
            title="Expand 3D NFC HUD"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">3D NFC Active</span>
          </button>
        )}
      </div>
    </div>
  );
};
