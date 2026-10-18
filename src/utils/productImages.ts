// High-fidelity dynamic SVG product visualizer ensuring 100% reliability and zero broken images.
// Renders authentic studio product compositions matching selected colorways and finishes.

export function getProductSvg(
  type: string,
  primaryColor: string,
  secondaryColor?: string,
  variantIndex: number = 0
): string {
  const sec = secondaryColor || '#2B2B2B';
  const bgLight = '#F4EFEB';
  const bgDark = '#EBE4DB';

  let innerSvg = '';

  switch (type) {
    case 'smartwatch':
      innerSvg = `
        <defs>
          <linearGradient id="screen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#121820" />
            <stop offset="100%" stop-color="#050709" />
          </linearGradient>
          <filter id="watchShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" flood-opacity="0.18" flood-color="#0F172A" />
          </filter>
        </defs>
        <!-- Strap -->
        <rect x="145" y="40" width="110" height="320" rx="20" fill="${primaryColor}" filter="url(#watchShadow)" />
        <rect x="150" y="50" width="100" height="300" rx="14" fill="${primaryColor}" opacity="0.9" />
        <!-- Watch Body -->
        <rect x="125" y="110" width="150" height="180" rx="42" fill="#1C2028" filter="url(#watchShadow)" stroke="${primaryColor}" stroke-width="3" />
        <!-- Screen Glass -->
        <rect x="135" y="120" width="130" height="160" rx="34" fill="url(#screen)" />
        <!-- Display Elements -->
        <text x="200" y="185" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="44" fill="#FFFFFF" text-anchor="middle">10:42</text>
        <text x="200" y="215" font-family="Plus Jakarta Sans, sans-serif" font-weight="500" font-size="14" fill="#10B981" text-anchor="middle">7,420 STEPS</text>
        <circle cx="165" cy="245" r="5" fill="#EF4444" />
        <text x="180" y="249" font-family="Plus Jakarta Sans, sans-serif" font-size="12" fill="#94A3B8">72 BPM</text>
        <!-- Crown Button -->
        <rect x="275" y="150" width="10" height="30" rx="4" fill="${primaryColor}" />
      `;
      break;

    case 'backpack':
      innerSvg = `
        <defs>
          <filter id="packShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="20" flood-opacity="0.22" flood-color="#1E293B" />
          </filter>
          <linearGradient id="packGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${primaryColor}" />
            <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0.82" />
          </linearGradient>
        </defs>
        <!-- Top Handle -->
        <path d="M 160 90 C 160 55, 240 55, 240 90" fill="none" stroke="#262626" stroke-width="12" stroke-linecap="round" />
        <!-- Main Body -->
        <path d="M 120 130 C 120 80, 280 80, 280 130 L 295 330 C 295 355, 275 365, 200 365 C 125 365, 105 355, 105 330 Z" fill="url(#packGrad)" filter="url(#packShadow)" />
        <!-- Front Pocket -->
        <rect x="130" y="220" width="140" height="115" rx="18" fill="${primaryColor}" stroke="#1F2937" stroke-opacity="0.2" stroke-width="2" />
        <!-- Zipper Tracks -->
        <path d="M 140 215 L 260 215" stroke="#111827" stroke-width="4" stroke-dasharray="3,2" />
        <path d="M 130 145 C 170 135, 230 135, 270 145" stroke="#111827" stroke-width="4" stroke-dasharray="4,2" fill="none" />
        <!-- Brand Patch -->
        <rect x="175" y="285" width="50" height="16" rx="3" fill="#18181B" />
        <text x="200" y="297" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="8" fill="#F4EFEB" text-anchor="middle" letter-spacing="1">AURA</text>
      `;
      break;

    case 'headphones':
      innerSvg = `
        <defs>
          <filter id="headShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="18" flood-opacity="0.2" flood-color="#0F172A" />
          </filter>
        </defs>
        <!-- Headband Arc -->
        <path d="M 120 200 C 120 80, 280 80, 280 200" fill="none" stroke="${sec}" stroke-width="20" stroke-linecap="round" filter="url(#headShadow)" />
        <path d="M 130 170 C 140 100, 260 100, 270 170" fill="none" stroke="${primaryColor}" stroke-width="12" stroke-linecap="round" />
        <!-- Left Ear Cup -->
        <rect x="90" y="180" width="50" height="95" rx="25" fill="${primaryColor}" filter="url(#headShadow)" stroke="#262626" stroke-width="3" />
        <rect x="125" y="190" width="16" height="75" rx="8" fill="#18181B" />
        <!-- Right Ear Cup -->
        <rect x="260" y="180" width="50" height="95" rx="25" fill="${primaryColor}" filter="url(#headShadow)" stroke="#262626" stroke-width="3" />
        <rect x="259" y="190" width="16" height="75" rx="8" fill="#18181B" />
        <!-- Swivel metal hinge -->
        <circle cx="115" cy="180" r="10" fill="#CBD5E1" />
        <circle cx="285" cy="180" r="10" fill="#CBD5E1" />
      `;
      break;

    case 'perfume':
      innerSvg = `
        <defs>
          <linearGradient id="perfumeGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.95" />
            <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0.75" />
          </linearGradient>
          <filter id="bottleShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="20" stdDeviation="22" flood-opacity="0.25" flood-color="#000000" />
          </filter>
        </defs>
        <!-- Cap -->
        <rect x="165" y="90" width="70" height="45" rx="4" fill="#18181B" filter="url(#bottleShadow)" />
        <rect x="180" y="135" width="40" height="15" fill="#C29B38" />
        <!-- Glass Body -->
        <rect x="125" y="150" width="150" height="180" rx="8" fill="url(#perfumeGlass)" filter="url(#bottleShadow)" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="2" />
        <!-- Minimalist Label -->
        <rect x="145" y="200" width="110" height="70" rx="2" fill="#FAF9F5" />
        <text x="200" y="228" font-family="Playfair Display, serif" font-weight="700" font-size="14" fill="#0F172A" text-anchor="middle" letter-spacing="2">BLEU ROYALE</text>
        <text x="200" y="246" font-family="Plus Jakarta Sans, sans-serif" font-weight="500" font-size="9" fill="#64748B" text-anchor="middle" letter-spacing="1">EAU DE PARFUM</text>
        <text x="200" y="259" font-family="Plus Jakarta Sans, sans-serif" font-size="8" fill="#94A3B8" text-anchor="middle">100 ML · 3.4 FL. OZ</text>
      `;
      break;

    case 'lamp':
      innerSvg = `
        <defs>
          <radialGradient id="moonGlow" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="65%" stop-color="${primaryColor}" />
            <stop offset="100%" stop-color="#B48243" />
          </radialGradient>
          <filter id="lampGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="25" flood-color="${primaryColor}" flood-opacity="0.45" />
          </filter>
        </defs>
        <!-- Glowing Orb -->
        <circle cx="200" cy="180" r="85" fill="url(#moonGlow)" filter="url(#lampGlow)" />
        <!-- Craters detail -->
        <circle cx="170" cy="160" r="14" fill="#DDAA55" opacity="0.2" />
        <circle cx="225" cy="210" r="22" fill="#DDAA55" opacity="0.15" />
        <circle cx="230" cy="150" r="10" fill="#DDAA55" opacity="0.18" />
        <!-- Wooden Geometric Stand -->
        <polygon points="150,230 180,290 190,290 170,240" fill="#8B4513" />
        <polygon points="250,230 220,290 210,290 230,240" fill="#A0522D" />
        <polygon points="175,290 225,290 200,320" fill="#6F370F" />
      `;
      break;

    case 'earbuds':
      innerSvg = `
        <defs>
          <filter id="caseShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="18" flood-opacity="0.15" flood-color="#0F172A" />
          </filter>
        </defs>
        <!-- Charging Case Body -->
        <rect x="135" y="150" width="130" height="135" rx="42" fill="${primaryColor}" filter="url(#caseShadow)" stroke="#E2E8F0" stroke-width="1.5" />
        <path d="M 135 195 L 265 195" stroke="#94A3B8" stroke-width="1.5" />
        <!-- Indicator LED -->
        <circle cx="200" cy="225" r="3.5" fill="#10B981" />
        <!-- Earbud Left sticking out -->
        <ellipse cx="175" cy="130" rx="16" ry="24" fill="${primaryColor}" filter="url(#caseShadow)" />
        <rect x="171" y="140" width="8" height="26" rx="4" fill="${primaryColor}" />
        <!-- Earbud Right sticking out -->
        <ellipse cx="225" cy="130" rx="16" ry="24" fill="${primaryColor}" filter="url(#caseShadow)" />
        <rect x="221" y="140" width="8" height="26" rx="4" fill="${primaryColor}" />
      `;
      break;

    case 'sunglasses':
      innerSvg = `
        <defs>
          <filter id="glassesShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="14" flood-opacity="0.2" flood-color="#0F172A" />
          </filter>
        </defs>
        <!-- Frame Bridge -->
        <path d="M 180 190 Q 200 180 220 190" fill="none" stroke="${primaryColor}" stroke-width="7" stroke-linecap="round" />
        <path d="M 185 200 Q 200 195 215 200" fill="none" stroke="#D4AF37" stroke-width="3" />
        <!-- Left Rim & Lens -->
        <rect x="100" y="170" width="85" height="65" rx="20" fill="#1E293B" stroke="${primaryColor}" stroke-width="8" filter="url(#glassesShadow)" />
        <path d="M 115 180 L 165 180" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="3" stroke-linecap="round" />
        <!-- Right Rim & Lens -->
        <rect x="215" y="170" width="85" height="65" rx="20" fill="#1E293B" stroke="${primaryColor}" stroke-width="8" filter="url(#glassesShadow)" />
        <path d="M 230 180 L 280 180" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="3" stroke-linecap="round" />
        <!-- Temples hint -->
        <path d="M 100 180 Q 70 170 60 160" stroke="${primaryColor}" stroke-width="6" fill="none" stroke-linecap="round" />
        <path d="M 300 180 Q 330 170 340 160" stroke="${primaryColor}" stroke-width="6" fill="none" stroke-linecap="round" />
      `;
      break;

    case 'sneakers':
      innerSvg = `
        <defs>
          <filter id="shoeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="14" stdDeviation="16" flood-opacity="0.2" flood-color="#0F172A" />
          </filter>
        </defs>
        <!-- Sole -->
        <path d="M 90 260 Q 200 275 320 255 L 315 285 Q 200 300 85 280 Z" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2" filter="url(#shoeShadow)" />
        <!-- Upper -->
        <path d="M 90 260 C 95 220, 140 210, 180 200 C 220 180, 240 150, 260 155 C 275 160, 280 210, 310 230 L 320 255 Z" fill="${primaryColor}" filter="url(#shoeShadow)" stroke="#1E293B" stroke-opacity="0.1" stroke-width="2" />
        <!-- Laces & Eyelets -->
        <path d="M 200 200 L 235 185" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" />
        <path d="M 210 215 L 245 198" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" />
        <path d="M 220 230 L 255 212" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" />
        <!-- Heel Counter -->
        <path d="M 90 260 Q 85 230 100 220" stroke="#CBD5E1" stroke-width="4" fill="none" />
      `;
      break;

    case 'waterbottle':
      innerSvg = `
        <defs>
          <filter id="bottleShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="20" flood-opacity="0.2" flood-color="#0F172A" />
          </filter>
          <linearGradient id="metalCylinder" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.85" />
            <stop offset="35%" stop-color="#FFFFFF" stop-opacity="0.4" />
            <stop offset="100%" stop-color="${primaryColor}" />
          </linearGradient>
        </defs>
        <!-- Loop Cap -->
        <path d="M 180 80 C 180 60, 220 60, 220 80" fill="none" stroke="#18181B" stroke-width="8" stroke-linecap="round" />
        <rect x="180" y="80" width="40" height="25" rx="5" fill="#18181B" />
        <!-- Bottle Neck -->
        <rect x="185" y="105" width="30" height="20" fill="${primaryColor}" stroke="#1E293B" stroke-width="1" />
        <!-- Main Flask Body -->
        <path d="M 160 145 C 160 125, 240 125, 240 145 L 240 330 C 240 345, 160 345, 160 330 Z" fill="${primaryColor}" filter="url(#bottleShadow)" />
        <path d="M 160 145 C 160 125, 240 125, 240 145 L 240 330 C 240 345, 160 345, 160 330 Z" fill="url(#metalCylinder)" />
        <!-- Minimal Branding text vertical -->
        <text x="200" y="240" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="11" fill="#1E293B" text-anchor="middle" letter-spacing="3" transform="rotate(-90 200 240)">AURA</text>
      `;
      break;

    case 'serum':
      innerSvg = `
        <defs>
          <filter id="serumShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="18" flood-opacity="0.22" flood-color="#0F172A" />
          </filter>
        </defs>
        <!-- Rubber Bulb -->
        <path d="M 185 90 C 185 70, 215 70, 215 90 Z" fill="#18181B" />
        <rect x="180" y="90" width="40" height="15" rx="3" fill="#D4AF37" />
        <!-- Glass Dropper Neck -->
        <rect x="188" y="105" width="24" height="20" fill="#2E2E2E" />
        <!-- Amber Glass Bottle Body -->
        <rect x="150" y="125" width="100" height="175" rx="16" fill="${primaryColor}" filter="url(#serumShadow)" />
        <!-- Label -->
        <rect x="160" y="160" width="80" height="90" rx="3" fill="#FAF9F5" />
        <text x="200" y="185" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="10" fill="#0F172A" text-anchor="middle" letter-spacing="1">BOTANICAL</text>
        <text x="200" y="200" font-family="Plus Jakarta Sans, sans-serif" font-size="8" fill="#B45309" text-anchor="middle">VITAMIN C + E</text>
        <line x1="175" y1="210" x2="225" y2="210" stroke="#E2E8F0" stroke-width="1" />
        <text x="200" y="225" font-family="Plus Jakarta Sans, sans-serif" font-size="7" fill="#64748B" text-anchor="middle">FACIAL SERUM</text>
        <text x="200" y="238" font-family="Plus Jakarta Sans, sans-serif" font-size="7" fill="#94A3B8" text-anchor="middle">30 ML / 1 FL OZ</text>
      `;
      break;

    case 'dumbbells':
      innerSvg = `
        <defs>
          <filter id="weightShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" flood-opacity="0.25" flood-color="#0F172A" />
          </filter>
        </defs>
        <!-- Bar handle -->
        <rect x="150" y="190" width="100" height="20" rx="4" fill="#94A3B8" stroke="#64748B" stroke-width="2" />
        <!-- Left Weight Hex Head -->
        <polygon points="130,140 160,170 160,230 130,260 100,230 100,170" fill="${primaryColor}" filter="url(#weightShadow)" />
        <text x="130" y="205" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="12" fill="#FFFFFF" text-anchor="middle">10 KG</text>
        <!-- Right Weight Hex Head -->
        <polygon points="270,140 300,170 300,230 270,260 240,230 240,170" fill="${primaryColor}" filter="url(#weightShadow)" />
        <text x="270" y="205" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="12" fill="#FFFFFF" text-anchor="middle">10 KG</text>
      `;
      break;

    case 'teddy':
      innerSvg = `
        <defs>
          <filter id="bearShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="14" stdDeviation="16" flood-opacity="0.18" flood-color="#78350F" />
          </filter>
        </defs>
        <!-- Ears -->
        <circle cx="150" cy="140" r="26" fill="${primaryColor}" />
        <circle cx="150" cy="140" r="14" fill="#FED7AA" />
        <circle cx="250" cy="140" r="26" fill="${primaryColor}" />
        <circle cx="250" cy="140" r="14" fill="#FED7AA" />
        <!-- Head -->
        <circle cx="200" cy="180" r="55" fill="${primaryColor}" filter="url(#bearShadow)" />
        <!-- Snout -->
        <ellipse cx="200" cy="195" rx="22" ry="18" fill="#FED7AA" />
        <circle cx="200" cy="190" r="7" fill="#451A03" />
        <path d="M 200 197 L 200 205 M 194 204 Q 200 208 206 204" stroke="#451A03" stroke-width="2" fill="none" />
        <!-- Eyes -->
        <circle cx="182" cy="175" r="5" fill="#1C1917" />
        <circle cx="218" cy="175" r="5" fill="#1C1917" />
        <!-- Body -->
        <ellipse cx="200" cy="275" rx="60" ry="55" fill="${primaryColor}" filter="url(#bearShadow)" />
        <ellipse cx="200" cy="275" rx="36" ry="34" fill="#FED7AA" />
        <!-- Bow -->
        <polygon points="185,225 200,232 185,240" fill="#EF4444" />
        <polygon points="215,225 200,232 215,240" fill="#EF4444" />
        <circle cx="200" cy="232" r="4" fill="#DC2626" />
      `;
      break;

    default:
      innerSvg = `
        <rect x="140" y="140" width="120" height="120" rx="24" fill="${primaryColor}" filter="url(#shadow)" />
        <circle cx="200" cy="200" r="30" fill="#FFFFFF" opacity="0.3" />
      `;
  }

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <radialGradient id="podiumGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
          <stop offset="100%" stop-color="${bgLight}" stop-opacity="0.3" />
        </radialGradient>
      </defs>
      <!-- Background Canvas Studio Tone -->
      <rect width="100%" height="100%" fill="${bgLight}" />
      <!-- Subtle soft studio shadow / pedestal floor -->
      <ellipse cx="200" cy="335" rx="140" ry="24" fill="${bgDark}" opacity="0.8" />
      <ellipse cx="200" cy="330" rx="110" ry="16" fill="#000000" opacity="0.06" />
      ${innerSvg}
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}
