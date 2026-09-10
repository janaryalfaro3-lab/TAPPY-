/**
 * High-Resolution Branded Placeholder Assets for TAPPY NFC Products
 * Generates razor-sharp, studio-styled SVG data URIs with consistent 800x600 dimensions,
 * luxury dark studio lighting, gold review stars, and precise hardware silhouettes
 * for Stand (TMY-1), Tag (TMY-2), Card (TMY-3), and Sticker (TMY-4).
 */

export type NfcProductFormat = 'stand' | 'tag' | 'card' | 'sticker';

interface PlaceholderOptions {
  name?: string;
  size?: string;
  businessName?: string;
}

/**
 * Creates an SVG data URI for the specified product format
 */
export function generateProductPlaceholderSvg(
  format: NfcProductFormat,
  options: PlaceholderOptions = {}
): string {
  const width = 800;
  const height = 600;

  // Format-specific metadata
  const config = {
    stand: {
      code: 'TMY-1',
      title: options.name || 'TMY-1 Premium Stand',
      subtitle: options.size || '90 × 110 mm · Crystal Acrylic',
      chip: 'NTAG213 High-Speed NFC + Dynamic QR',
      renderProduct: `
        <!-- Countertop Stand Reflection Base -->
        <ellipse cx="400" cy="510" rx="220" ry="24" fill="url(#tableReflection)" />
        <ellipse cx="400" cy="500" rx="190" ry="14" fill="#000" opacity="0.6" filter="url(#dropShadow)" />

        <!-- Acrylic Stand Base Foot -->
        <path d="M 280 480 L 520 480 L 540 500 L 260 500 Z" fill="url(#acrylicBaseGrad)" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />

        <!-- Stand Body (Upright Beveled Acrylic) -->
        <g filter="url(#glow)">
          <!-- Outer clear bevel -->
          <rect x="270" y="140" width="260" height="340" rx="22" fill="url(#acrylicBodyGrad)" stroke="url(#glassBorder)" stroke-width="2.5" />
          
          <!-- Inner Face -->
          <rect x="282" y="152" width="236" height="316" rx="16" fill="#0f172a" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
          
          <!-- Specular Diagonal Highlight -->
          <path d="M 282 152 L 420 152 L 310 468 L 282 468 Z" fill="url(#specularSheen)" opacity="0.4" />
          
          <!-- Google G Logo -->
          <circle cx="400" cy="225" r="32" fill="#1e293b" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
          <path d="M 400 210 L 416 210 A 15 15 0 0 1 416 238 L 400 238 L 400 225 L 413 225" stroke="#38bdf8" stroke-width="4" fill="none" stroke-linecap="round" />
          <circle cx="400" cy="225" r="7" fill="#38bdf8" />
          
          <!-- Review Call to Action -->
          <text x="400" y="280" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#f8fafc" text-anchor="middle" letter-spacing="0.5">
            REVIEW US ON GOOGLE
          </text>
          
          <!-- 5 Gold Stars -->
          <g transform="translate(305, 295)">
            <polygon points="19,1 24,14 38,14 27,23 31,37 19,28 7,37 11,23 0,14 14,14" fill="#fbbf24" filter="url(#starGlow)" />
            <polygon points="57,1 62,14 76,14 65,23 69,37 57,28 45,37 49,23 38,14 52,14" fill="#fbbf24" filter="url(#starGlow)" />
            <polygon points="95,1 100,14 114,14 103,23 107,37 95,28 83,37 87,23 76,14 90,14" fill="#fbbf24" filter="url(#starGlow)" />
            <polygon points="133,1 138,14 152,14 141,23 145,37 133,28 121,37 125,23 114,14 128,14" fill="#fbbf24" filter="url(#starGlow)" />
            <polygon points="171,1 176,14 190,14 179,23 183,37 171,28 159,37 163,23 152,14 166,14" fill="#fbbf24" filter="url(#starGlow)" />
          </g>

          <!-- Tap Phone or Scan QR Instruction -->
          <rect x="315" y="350" width="170" height="34" rx="8" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" stroke-width="1.2" />
          <text x="400" y="372" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#38bdf8" text-anchor="middle" letter-spacing="0.8">
            TAP PHONE HERE
          </text>
          
          <!-- NFC Wave Waves -->
          <path d="M 380 415 A 12 12 0 0 1 400 405 A 12 12 0 0 1 420 415" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
          <path d="M 372 422 A 20 20 0 0 1 400 408 A 20 20 0 0 1 428 422" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" />
          <circle cx="400" cy="430" r="3.5" fill="#38bdf8" />
          
          <text x="400" y="450" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" font-weight="600" fill="#64748b" text-anchor="middle" letter-spacing="1">
            POWERED BY TAPPY NFC
          </text>
        </g>
      `,
    },
    tag: {
      code: 'TMY-2',
      title: options.name || 'TMY-2 Mini Stand (Acrylic Tag)',
      subtitle: options.size || '40 × 40 mm · Crystal Acrylic Block',
      chip: 'NTAG213 NFC Micro-Chip + QR Core',
      renderProduct: `
        <!-- Table Drop Shadow -->
        <ellipse cx="400" cy="480" rx="160" ry="18" fill="#000" opacity="0.65" filter="url(#dropShadow)" />

        <!-- 40x40mm Square Acrylic Tag Body -->
        <g filter="url(#glow)">
          <!-- Outer Glass Border -->
          <rect x="290" y="170" width="220" height="220" rx="28" fill="url(#acrylicBodyGrad)" stroke="url(#glassBorder)" stroke-width="3" />
          
          <!-- Inner Acrylic Facet -->
          <rect x="304" y="184" width="192" height="192" rx="20" fill="#090d16" stroke="rgba(255,255,255,0.15)" stroke-width="1.2" />

          <!-- Specular Sheen -->
          <path d="M 304 184 L 410 184 L 320 376 L 304 376 Z" fill="url(#specularSheen)" opacity="0.45" />

          <!-- Google G Mini Logo -->
          <circle cx="400" cy="242" r="24" fill="#1e293b" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
          <text x="400" y="250" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" fill="#38bdf8" text-anchor="middle">
            G
          </text>

          <!-- 5 Mini Gold Stars -->
          <g transform="translate(340, 278) scale(0.65)">
            <polygon points="19,1 24,14 38,14 27,23 31,37 19,28 7,37 11,23 0,14 14,14" fill="#fbbf24" />
            <polygon points="57,1 62,14 76,14 65,23 69,37 57,28 45,37 49,23 38,14 52,14" fill="#fbbf24" />
            <polygon points="95,1 100,14 114,14 103,23 107,37 95,28 83,37 87,23 76,14 90,14" fill="#fbbf24" />
            <polygon points="133,1 138,14 152,14 141,23 145,37 133,28 121,37 125,23 114,14 128,14" fill="#fbbf24" />
            <polygon points="171,1 176,14 190,14 179,23 183,37 171,28 159,37 163,23 152,14 166,14" fill="#fbbf24" />
          </g>

          <!-- NFC Wave Symbol -->
          <path d="M 386 322 A 8 8 0 0 1 400 316 A 8 8 0 0 1 414 322" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
          <path d="M 378 330 A 16 16 0 0 1 400 320 A 16 16 0 0 1 422 330" fill="none" stroke="#0ea5e9" stroke-width="1.8" stroke-linecap="round" />
          <circle cx="400" cy="336" r="2.5" fill="#38bdf8" />

          <!-- Tiny Tag Label -->
          <text x="400" y="358" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="700" fill="#94a3b8" text-anchor="middle" letter-spacing="1">
            TAP TO REVIEW
          </text>
        </g>
      `,
    },
    card: {
      code: 'TMY-3',
      title: options.name || 'TMY-3 NFC Card (Matte PVC)',
      subtitle: options.size || '85.6 × 54 mm · ISO Standard PVC',
      chip: 'Integrated NTAG213 Dual Antenna Layer',
      renderProduct: `
        <!-- Floating Card Shadow -->
        <ellipse cx="400" cy="485" rx="200" ry="22" fill="#000" opacity="0.7" filter="url(#dropShadow)" />

        <!-- 85.6 x 54mm Matte PVC Card (Isometric angle tilt) -->
        <g filter="url(#glow)">
          <!-- Card Base -->
          <rect x="250" y="180" width="300" height="190" rx="14" fill="url(#pvcCardGrad)" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" />
          
          <!-- Carbon Texture Pattern overlay -->
          <rect x="250" y="180" width="300" height="190" rx="14" fill="url(#gridDots)" opacity="0.15" />

          <!-- Metallic NFC Chip Graphic on Top Left -->
          <rect x="285" y="220" width="38" height="30" rx="4" fill="url(#goldChipGrad)" stroke="#d97706" stroke-width="1" />
          <line x1="285" y1="235" x2="323" y2="235" stroke="#92400e" stroke-width="1" />
          <line x1="304" y1="220" x2="304" y2="250" stroke="#92400e" stroke-width="1" />
          
          <!-- Contactless Wave next to chip -->
          <path d="M 334 227 A 8 8 0 0 1 334 243" fill="none" stroke="#f8fafc" stroke-width="2" stroke-linecap="round" />
          <path d="M 339 223 A 14 14 0 0 1 339 247" fill="none" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />
          <path d="M 344 219 A 20 20 0 0 1 344 251" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" />

          <!-- Google Review Logo Badge on Right -->
          <text x="515" y="235" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#ffffff" text-anchor="end">
            Google Reviews
          </text>
          
          <!-- 5 Gold Stars on Card -->
          <g transform="translate(425, 245) scale(0.5)">
            <polygon points="19,1 24,14 38,14 27,23 31,37 19,28 7,37 11,23 0,14 14,14" fill="#fbbf24" />
            <polygon points="57,1 62,14 76,14 65,23 69,37 57,28 45,37 49,23 38,14 52,14" fill="#fbbf24" />
            <polygon points="95,1 100,14 114,14 103,23 107,37 95,28 83,37 87,23 76,14 90,14" fill="#fbbf24" />
            <polygon points="133,1 138,14 152,14 141,23 145,37 133,28 121,37 125,23 114,14 128,14" fill="#fbbf24" />
            <polygon points="171,1 176,14 190,14 179,23 183,37 171,28 159,37 163,23 152,14 166,14" fill="#fbbf24" />
          </g>

          <!-- Card Bottom Band -->
          <line x1="250" y1="320" x2="550" y2="320" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
          <text x="285" y="345" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#38bdf8" letter-spacing="1">
            CONTACTLESS TAP CARD
          </text>
          <text x="515" y="345" font-family="monospace" font-size="10" fill="#64748b" text-anchor="end">
            NTAG213 · 144 BYTES
          </text>
        </g>
      `,
    },
    sticker: {
      code: 'TMY-4',
      title: options.name || 'TMY-4 NFC Tag (Adhesive PVC)',
      subtitle: options.size || '40 × 40 mm · 3M Heavy-Duty Backing',
      chip: 'Industrial Coated NFC Coil for Walls & Desks',
      renderProduct: `
        <!-- Circular Sticker Shadow -->
        <ellipse cx="400" cy="475" rx="140" ry="20" fill="#000" opacity="0.65" filter="url(#dropShadow)" />

        <!-- 40mm Circular Adhesive Tag -->
        <g filter="url(#glow)">
          <!-- Peel Layer outline -->
          <circle cx="400" cy="290" r="120" fill="url(#stickerBodyGrad)" stroke="rgba(255,255,255,0.22)" stroke-width="2" />
          
          <!-- Concentric NFC Antenna Ring Graphic -->
          <circle cx="400" cy="290" r="108" fill="none" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1.5" stroke-dasharray="4 3" />
          <circle cx="400" cy="290" r="98" fill="none" stroke="rgba(56, 189, 248, 0.15)" stroke-width="1" />
          
          <!-- Inner Disc -->
          <circle cx="400" cy="290" r="86" fill="#090d16" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

          <!-- Center Google G Logo -->
          <circle cx="400" cy="245" r="22" fill="#1e293b" stroke="rgba(255,255,255,0.18)" stroke-width="1" />
          <text x="400" y="253" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" fill="#38bdf8" text-anchor="middle">
            G
          </text>

          <!-- 5 Gold Stars Arc -->
          <g transform="translate(345, 275) scale(0.6)">
            <polygon points="19,1 24,14 38,14 27,23 31,37 19,28 7,37 11,23 0,14 14,14" fill="#fbbf24" />
            <polygon points="57,1 62,14 76,14 65,23 69,37 57,28 45,37 49,23 38,14 52,14" fill="#fbbf24" />
            <polygon points="95,1 100,14 114,14 103,23 107,37 95,28 83,37 87,23 76,14 90,14" fill="#fbbf24" />
            <polygon points="133,1 138,14 152,14 141,23 145,37 133,28 121,37 125,23 114,14 128,14" fill="#fbbf24" />
            <polygon points="171,1 176,14 190,14 179,23 183,37 171,28 159,37 163,23 152,14 166,14" fill="#fbbf24" />
          </g>

          <!-- Tap Waves -->
          <path d="M 386 318 A 8 8 0 0 1 400 312 A 8 8 0 0 1 414 318" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
          <path d="M 378 326 A 16 16 0 0 1 400 316 A 16 16 0 0 1 422 326" fill="none" stroke="#0ea5e9" stroke-width="1.8" stroke-linecap="round" />
          <circle cx="400" cy="332" r="2.5" fill="#38bdf8" />

          <text x="400" y="352" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="700" fill="#94a3b8" text-anchor="middle" letter-spacing="1">
            TAP OR SCAN
          </text>
        </g>
      `,
    },
  }[format];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <!-- Background Studio Radial Gradient -->
      <radialGradient id="bgGrad" cx="50%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="45%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#020617" />
      </radialGradient>

      <!-- Glass & Acrylic Linear Gradients -->
      <linearGradient id="acrylicBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155" stop-opacity="0.9" />
        <stop offset="50%" stop-color="#1e293b" stop-opacity="0.95" />
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.98" />
      </linearGradient>

      <linearGradient id="glassBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6" />
        <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.1" />
      </linearGradient>

      <linearGradient id="acrylicBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#475569" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>

      <linearGradient id="specularSheen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
        <stop offset="30%" stop-color="#ffffff" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>

      <linearGradient id="pvcCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>

      <linearGradient id="stickerBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>

      <linearGradient id="goldChipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fbbf24" />
        <stop offset="50%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#d97706" />
      </linearGradient>

      <radialGradient id="tableReflection" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25" />
        <stop offset="60%" stop-color="#0284c7" stop-opacity="0.08" />
        <stop offset="100%" stop-color="transparent" />
      </radialGradient>

      <!-- Dot Pattern for Studio Tech Backdrop -->
      <pattern id="gridDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#334155" opacity="0.3" />
      </pattern>

      <!-- Glow and Shadows Filters -->
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="12" />
        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.6 0" />
        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
      </filter>

      <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
        <feFlood flood-color="#38bdf8" flood-opacity="0.15" result="flood" />
        <feComposite in="flood" in2="blur" operator="in" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
        <feFlood flood-color="#f59e0b" flood-opacity="0.35" />
        <feComposite operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Studio Dark Background Canvas -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
    <rect width="${width}" height="${height}" fill="url(#gridDots)" />

    <!-- Studio Top Pedestal Spotlight -->
    <ellipse cx="400" cy="50" rx="360" ry="120" fill="#38bdf8" opacity="0.06" filter="url(#dropShadow)" />

    <!-- Top Left Studio Badge -->
    <rect x="36" y="32" width="90" height="26" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1" />
    <text x="81" y="49" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#38bdf8" text-anchor="middle" letter-spacing="1">
      ${config.code}
    </text>

    <!-- Top Right Pre-calibrated NFC Badge -->
    <rect x="610" y="32" width="154" height="26" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1" />
    <circle cx="624" cy="45" r="4" fill="#10b981" />
    <text x="690" y="49" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10.5" font-weight="600" fill="#e2e8f0" text-anchor="middle">
      PRE-PROGRAMMED
    </text>

    <!-- The 3D Product Hardware Render -->
    ${config.renderProduct}

    <!-- Bottom Info Overlay Card -->
    <rect x="180" y="530" width="440" height="42" rx="10" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1" />
    <text x="400" y="548" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#f8fafc" text-anchor="middle">
      ${config.title}
    </text>
    <text x="400" y="563" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="500" fill="#94a3b8" text-anchor="middle">
      ${config.subtitle} · ${config.chip}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Pre-generated placeholder data URIs for instantaneous rendering
 */
export const BRANDED_PLACEHOLDERS: Record<NfcProductFormat, string> = {
  stand: generateProductPlaceholderSvg('stand'),
  tag: generateProductPlaceholderSvg('tag'),
  card: generateProductPlaceholderSvg('card'),
  sticker: generateProductPlaceholderSvg('sticker'),
};

/**
 * Lookup placeholder by product format or item code
 */
export function getBrandedPlaceholder(
  format?: string,
  name?: string,
  size?: string
): string {
  const norm = (format || '').toLowerCase();
  if (norm.includes('tag') || norm.includes('mini')) {
    return generateProductPlaceholderSvg('tag', { name, size });
  }
  if (norm.includes('card') || norm.includes('pvc')) {
    return generateProductPlaceholderSvg('card', { name, size });
  }
  if (norm.includes('sticker')) {
    return generateProductPlaceholderSvg('sticker', { name, size });
  }
  return generateProductPlaceholderSvg('stand', { name, size });
}
