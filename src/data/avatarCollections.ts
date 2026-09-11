export interface AvatarPreset {
  id: string;
  name: string;
  collection: 'nft' | 'okn';
  collectionName: string;
  url: string;
  badge?: string;
  rarity?: string;
}

// Crisp, high-fidelity SVG avatar data URLs for instant offline rendering
const createSvgAvatarUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
};

export const POPULAR_NFT_AVATARS: AvatarPreset[] = [
  {
    id: 'bayc-8817',
    name: 'Bored Ape #8817',
    collection: 'nft',
    collectionName: 'Bored Ape Yacht Club',
    badge: 'BAYC',
    rarity: 'Top 0.1% Rare',
    url: createSvgAvatarUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <radialGradient id="bg8817" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FEF08A"/>
            <stop offset="100%" stop-color="#EAB308"/>
          </radialGradient>
          <linearGradient id="fur8817" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FBBF24"/>
            <stop offset="100%" stop-color="#B45309"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="60" fill="url(#bg8817)"/>
        <!-- Ape silhouette & features -->
        <circle cx="60" cy="62" r="38" fill="url(#fur8817)"/>
        <!-- Muzzle -->
        <ellipse cx="60" cy="74" rx="24" ry="18" fill="#FDE68A"/>
        <circle cx="53" cy="70" r="2.5" fill="#78350F"/>
        <circle cx="67" cy="70" r="2.5" fill="#78350F"/>
        <!-- Bored Mouth -->
        <path d="M48 81 Q60 76 72 81" stroke="#78350F" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Eyes -->
        <circle cx="48" cy="52" r="8" fill="#FFFFFF"/>
        <circle cx="72" cy="52" r="8" fill="#FFFFFF"/>
        <circle cx="49" cy="53" r="4.5" fill="#1E293B"/>
        <circle cx="73" cy="53" r="4.5" fill="#1E293B"/>
        <!-- Drooping eyelids for bored look -->
        <path d="M40 48 Q48 56 56 48" fill="url(#fur8817)"/>
        <path d="M64 48 Q72 56 80 48" fill="url(#fur8817)"/>
        <!-- Captain Hat -->
        <path d="M34 40 C34 26 86 26 86 40 Z" fill="#1E1B4B"/>
        <rect x="30" y="38" width="60" height="6" rx="3" fill="#0F172A"/>
        <circle cx="60" cy="33" r="4" fill="#F59E0B"/>
        <!-- Gold Earring -->
        <circle cx="24" cy="64" r="5" fill="none" stroke="#FBBF24" stroke-width="2.5"/>
      </svg>
    `),
  },
  {
    id: 'pudgy-4210',
    name: 'Pudgy Penguin #4210',
    collection: 'nft',
    collectionName: 'Pudgy Penguins',
    badge: 'PUDGY',
    rarity: 'Grail Crown',
    url: createSvgAvatarUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <radialGradient id="bg4210" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#E0F2FE"/>
            <stop offset="100%" stop-color="#7DD3FC"/>
          </radialGradient>
        </defs>
        <rect width="120" height="120" rx="60" fill="url(#bg4210)"/>
        <!-- Penguin body -->
        <ellipse cx="60" cy="68" rx="36" ry="34" fill="#0F172A"/>
        <ellipse cx="60" cy="72" rx="25" ry="24" fill="#FFFFFF"/>
        <!-- Cute Eyes -->
        <ellipse cx="48" cy="54" rx="5" ry="6" fill="#0284C7"/>
        <circle cx="49" cy="52" r="2" fill="#FFFFFF"/>
        <ellipse cx="72" cy="54" rx="5" ry="6" fill="#0284C7"/>
        <circle cx="73" cy="52" r="2" fill="#FFFFFF"/>
        <!-- Beak -->
        <path d="M52 62 Q60 67 68 62 Q60 72 52 62 Z" fill="#F97316"/>
        <!-- Cozy Scarf -->
        <path d="M36 76 Q60 86 84 76 Q60 92 36 76 Z" fill="#EC4899"/>
        <rect x="64" y="78" width="10" height="20" rx="2" fill="#EC4899"/>
        <!-- Gold Crown -->
        <polygon points="44,38 48,22 55,32 60,18 65,32 72,22 76,38" fill="#FBBF24" stroke="#D97706" stroke-width="1.5"/>
      </svg>
    `),
  },
  {
    id: 'azuki-9201',
    name: 'Azuki #9201',
    collection: 'nft',
    collectionName: 'Azuki',
    badge: 'AZUKI',
    rarity: 'Spirit Red',
    url: createSvgAvatarUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <linearGradient id="bg9201" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFE4E6"/>
            <stop offset="100%" stop-color="#FDA4AF"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="60" fill="url(#bg9201)"/>
        <!-- Face base -->
        <ellipse cx="60" cy="65" rx="28" ry="32" fill="#FFE4D6"/>
        <!-- Red Anime Hair Spikes -->
        <path d="M28 65 Q35 25 60 22 Q85 25 92 65 Q85 38 72 32 Q60 30 48 35 Q35 44 28 65 Z" fill="#E11D48"/>
        <!-- Eye & Brow -->
        <line x1="42" y1="52" x2="56" y2="54" stroke="#881337" stroke-width="2.5" stroke-linecap="round"/>
        <ellipse cx="49" cy="60" rx="4" ry="5" fill="#E11D48"/>
        <circle cx="50" cy="58" r="1.5" fill="#FFFFFF"/>
        <line x1="64" y1="54" x2="78" y2="52" stroke="#881337" stroke-width="2.5" stroke-linecap="round"/>
        <ellipse cx="71" cy="60" rx="4" ry="5" fill="#E11D48"/>
        <circle cx="72" cy="58" r="1.5" fill="#FFFFFF"/>
        <!-- Katana Hilt on back -->
        <rect x="82" y="18" width="6" height="34" rx="2" transform="rotate(32 82 18)" fill="#0F172A"/>
        <rect x="76" y="32" width="18" height="4" rx="1" transform="rotate(32 82 18)" fill="#D97706"/>
        <!-- Minimalist mouth -->
        <line x1="56" y1="80" x2="64" y2="80" stroke="#9F1239" stroke-width="2" stroke-linecap="round"/>
        <!-- Samurai Earring -->
        <rect x="33" y="70" width="3" height="10" fill="#E11D48" rx="1"/>
      </svg>
    `),
  },
  {
    id: 'cyberkongz-104',
    name: 'CyberKongz #104',
    collection: 'nft',
    collectionName: 'CyberKongz',
    badge: 'KONGZ',
    rarity: 'Cyber Mech',
    url: createSvgAvatarUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <linearGradient id="bg104" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1E1B4B"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="60" fill="url(#bg104)"/>
        <!-- Gorilla head -->
        <rect x="34" y="36" width="52" height="58" rx="18" fill="#334155"/>
        <circle cx="34" cy="58" r="8" fill="#1E293B"/>
        <circle cx="86" cy="58" r="8" fill="#1E293B"/>
        <!-- Muzzle -->
        <rect x="42" y="58" width="36" height="30" rx="12" fill="#475569"/>
        <circle cx="52" cy="68" r="3" fill="#0F172A"/>
        <circle cx="68" cy="68" r="3" fill="#0F172A"/>
        <!-- Glowing Cyber Eyes -->
        <rect x="44" y="46" width="12" height="6" rx="2" fill="#10B981"/>
        <rect x="64" y="46" width="12" height="6" rx="2" fill="#06B6D4"/>
        <!-- Cyber Headgear antenna -->
        <rect x="58" y="20" width="4" height="16" fill="#F59E0B"/>
        <circle cx="60" cy="18" r="4" fill="#EF4444"/>
      </svg>
    `),
  },
  {
    id: 'cryptopunk-3100',
    name: 'CryptoPunk #3100',
    collection: 'nft',
    collectionName: 'CryptoPunks',
    badge: 'PUNKS',
    rarity: 'Alien 1/9',
    url: createSvgAvatarUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <rect width="120" height="120" rx="60" fill="#6366F1"/>
        <!-- Pixelated Alien Face -->
        <rect x="40" y="32" width="40" height="52" fill="#C7D2FE"/>
        <!-- Alien blue skin -->
        <rect x="44" y="28" width="32" height="8" fill="#A5B4FC"/>
        <!-- Pixel eyes -->
        <rect x="46" y="48" width="8" height="8" fill="#FFFFFF"/>
        <rect x="50" y="50" width="4" height="4" fill="#1E1B4B"/>
        <rect x="66" y="48" width="8" height="8" fill="#FFFFFF"/>
        <rect x="70" y="50" width="4" height="4" fill="#1E1B4B"/>
        <!-- White/Blue Headband -->
        <rect x="36" y="38" width="48" height="8" fill="#FFFFFF"/>
        <rect x="44" y="40" width="32" height="4" fill="#3B82F6"/>
        <!-- Mouth -->
        <rect x="52" y="70" width="16" height="4" fill="#6366F1"/>
      </svg>
    `),
  },
  {
    id: 'clonex-4510',
    name: 'CloneX #4510',
    collection: 'nft',
    collectionName: 'CloneX (RTFKT)',
    badge: 'CLONEX',
    rarity: 'Murakami Drip',
    url: createSvgAvatarUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <linearGradient id="bg4510" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F43F5E"/>
            <stop offset="100%" stop-color="#8B5CF6"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="60" fill="url(#bg4510)"/>
        <!-- Cyber Avatar face -->
        <ellipse cx="60" cy="65" rx="26" ry="30" fill="#F1F5F9"/>
        <!-- Neon Cyber Visor -->
        <path d="M34 50 Q60 45 86 50 Q86 64 60 62 Q34 64 34 50 Z" fill="#06B6D4"/>
        <line x1="38" y1="56" x2="82" y2="56" stroke="#FFFFFF" stroke-width="2"/>
        <!-- Metallic Neck & Torso -->
        <rect x="50" y="88" width="20" height="20" fill="#94A3B8"/>
        <!-- Cyber ear pods -->
        <rect x="30" y="54" width="6" height="14" rx="3" fill="#D946EF"/>
        <rect x="84" y="54" width="6" height="14" rx="3" fill="#D946EF"/>
      </svg>
    `),
  },
];

export const OKN_OFFICIAL_AVATARS: AvatarPreset[] = [
  {
    id: 'okn-genesis-gold',
    name: 'OKN Genesis Gold',
    collection: 'okn',
    collectionName: 'OKNexus Official',
    badge: 'VIP 3',
    rarity: 'Founder Edition',
    url: createSvgAvatarUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <radialGradient id="oknGoldBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FDE047"/>
            <stop offset="70%" stop-color="#CA8A04"/>
            <stop offset="100%" stop-color="#713F12"/>
          </radialGradient>
          <linearGradient id="oknGoldCore" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="50%" stop-color="#FEF08A"/>
            <stop offset="100%" stop-color="#EAB308"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="60" fill="#0A0D16"/>
        <circle cx="60" cy="60" r="54" fill="none" stroke="url(#oknGoldBg)" stroke-width="3"/>
        <!-- 3D Polyhedron / OKNexus Golden Sigil -->
        <polygon points="60,22 92,42 92,78 60,98 28,78 28,42" fill="#171C2E" stroke="#EAB308" stroke-width="2"/>
        <polygon points="60,22 60,60 92,78" fill="url(#oknGoldCore)" opacity="0.8"/>
        <polygon points="60,60 28,78 28,42" fill="#CA8A04" opacity="0.9"/>
        <polygon points="60,22 28,42 60,60" fill="#FDE047" opacity="0.95"/>
        <circle cx="60" cy="60" r="10" fill="#FFFFFF" filter="drop-shadow(0 0 6px #FDE047)"/>
        <!-- Star sparkles -->
        <circle cx="34" cy="30" r="2" fill="#FEF08A"/>
        <circle cx="86" cy="30" r="2" fill="#FEF08A"/>
        <circle cx="60" cy="104" r="2.5" fill="#FEF08A"/>
      </svg>
    `),
  },
  {
    id: 'okn-cyber-samurai',
    name: 'Cyber Samurai',
    collection: 'okn',
    collectionName: 'OKNexus Official',
    badge: 'PRO',
    rarity: 'Neon Warrior',
    url: createSvgAvatarUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <linearGradient id="samuraiBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4C1D95"/>
            <stop offset="50%" stop-color="#1E1B4B"/>
            <stop offset="100%" stop-color="#090D1A"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="60" fill="url(#samuraiBg)"/>
        <!-- Samurai Cyber Mask -->
        <polygon points="60,24 88,48 80,90 60,102 40,90 32,48" fill="#18132C" stroke="#A855F7" stroke-width="2.5"/>
        <!-- Visor Horns -->
        <path d="M42 38 L30 18 L48 28 Z" fill="#C084FC"/>
        <path d="M78 38 L90 18 L72 28 Z" fill="#C084FC"/>
        <!-- Glowing Red/Cyan Eyes -->
        <polygon points="46,56 56,58 54,64 44,62" fill="#F43F5E"/>
        <polygon points="74,56 64,58 66,64 76,62" fill="#06B6D4"/>
        <!-- Mouth Grill -->
        <line x1="50" y1="78" x2="70" y2="78" stroke="#A855F7" stroke-width="2"/>
        <line x1="52" y1="84" x2="68" y2="84" stroke="#A855F7" stroke-width="2"/>
      </svg>
    `),
  },
  {
    id: 'okn-quantum-hologram',
    name: 'Quantum Hologram',
    collection: 'okn',
    collectionName: 'OKNexus Official',
    badge: 'CORE',
    rarity: 'Matrix Orb',
    url: createSvgAvatarUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <radialGradient id="holoBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#06B6D4"/>
            <stop offset="60%" stop-color="#083344"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
        </defs>
        <rect width="120" height="120" rx="60" fill="url(#holoBg)"/>
        <!-- Concentric Quantum Rings -->
        <ellipse cx="60" cy="60" rx="42" ry="20" fill="none" stroke="#22D3EE" stroke-width="2" transform="rotate(25 60 60)"/>
        <ellipse cx="60" cy="60" rx="42" ry="20" fill="none" stroke="#67E8F9" stroke-width="2" transform="rotate(-25 60 60)"/>
        <ellipse cx="60" cy="60" rx="36" ry="36" fill="none" stroke="#A5F3FC" stroke-width="1.5" stroke-dasharray="6,4"/>
        <!-- Central AI Singularity -->
        <circle cx="60" cy="60" r="14" fill="#FFFFFF"/>
        <circle cx="60" cy="60" r="8" fill="#0891B2"/>
      </svg>
    `),
  },
  {
    id: 'okn-void-runner',
    name: 'Void Runner',
    collection: 'okn',
    collectionName: 'OKNexus Official',
    badge: 'ELITE',
    rarity: 'Obsidian Phantom',
    url: createSvgAvatarUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <linearGradient id="voidBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="100%" stop-color="#000000"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="60" fill="url(#voidBg)"/>
        <!-- Hooded Silhouette -->
        <path d="M30 110 C30 65 40 32 60 30 C80 32 90 65 90 110 Z" fill="#1E293B"/>
        <path d="M38 110 C38 72 45 42 60 40 C75 42 82 72 82 110 Z" fill="#0A0F1D"/>
        <!-- Glowing Amethyst Eyes inside the void -->
        <ellipse cx="52" cy="66" rx="4" ry="2" fill="#E879F9" transform="rotate(-10 52 66)"/>
        <ellipse cx="68" cy="66" rx="4" ry="2" fill="#E879F9" transform="rotate(10 68 66)"/>
      </svg>
    `),
  },
];
