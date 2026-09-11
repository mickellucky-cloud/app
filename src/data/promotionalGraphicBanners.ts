// High-resolution Graphic Flyers & Image Banners for OKNexus Carousel
// Each flyer is a complete standalone graphic artwork image rendered via <img> tags (no code-based fake cards)

export interface GraphicFlyerBanner {
  id: string;
  headline: string;
  tag: string;
  graphicUrl: string;
  actionType: 'ai_trader' | 'p2p' | 'earn' | 'markets' | 'polymarket' | 'deposit';
  ctaText: string;
  aspectRatio: string;
  altText: string;
}

export interface GraphicAnnouncement {
  id: string;
  title: string;
  category: 'NEW' | 'PROMO' | 'SECURITY' | 'LISTING';
  time: string;
  thumbnailUrl: string;
  actionType?: string;
}

const createSvgGraphicUrl = (svgContent: string): string => {
  const cleanSvg = svgContent.trim().replace(/\n\s+/g, ' ');
  try {
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(cleanSvg)))}`;
    }
  } catch (e) {
    // fallback to charset=utf-8 URI encoding
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cleanSvg)}`;
};

export const GRAPHIC_PROMOTIONAL_BANNERS: GraphicFlyerBanner[] = [
  {
    id: 'graphic-ai-trader',
    headline: 'AI Auto-Trader & Grid Pro 2.0',
    tag: 'NEW PROTOCOL',
    ctaText: 'Deploy AI Bot',
    actionType: 'ai_trader',
    aspectRatio: '16/6',
    altText: 'OKNexus AI Auto-Trader 24/7 Algorithmic Grid Bot Promo Flyer',
    graphicUrl: createSvgGraphicUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 450" width="1200" height="450">
        <defs>
          <linearGradient id="bgAI" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#19062E"/>
            <stop offset="40%" stop-color="#2D0B4E"/>
            <stop offset="80%" stop-color="#130826"/>
            <stop offset="100%" stop-color="#080314"/>
          </linearGradient>
          <linearGradient id="botGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E879F9"/>
            <stop offset="50%" stop-color="#A855F7"/>
            <stop offset="100%" stop-color="#3B82F6"/>
          </linearGradient>
          <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="50%" stop-color="#F3E8FF"/>
            <stop offset="100%" stop-color="#D8B4FE"/>
          </linearGradient>
          <pattern id="cyberGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 85, 247, 0.12)" stroke-width="1"/>
          </pattern>
        </defs>
        <!-- Background Canvas -->
        <rect width="1200" height="450" rx="24" fill="url(#bgAI)"/>
        <rect width="1200" height="450" rx="24" fill="url(#cyberGrid)"/>
        
        <!-- Glowing Cyber Blobs -->
        <circle cx="1020" cy="220" r="220" fill="#A855F7" opacity="0.28" filter="blur(80px)"/>
        <circle cx="920" cy="120" r="160" fill="#06B6D4" opacity="0.22" filter="blur(60px)"/>
        <circle cx="150" cy="380" r="180" fill="#9333EA" opacity="0.15" filter="blur(70px)"/>

        <!-- Left Content Area Typography & Graphic Badges -->
        <!-- Live Tag -->
        <rect x="60" y="55" width="160" height="34" rx="17" fill="#581C87" stroke="#A855F7" stroke-width="1.5"/>
        <circle cx="82" cy="72" r="5" fill="#4ADE80"/>
        <text x="96" y="77" fill="#F3E8FF" font-family="system-ui, sans-serif" font-size="13" font-weight="800" letter-spacing="1.5">AI GRID PRO</text>

        <rect x="235" y="55" width="180" height="34" rx="17" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
        <text x="252" y="77" fill="#E2E8F0" font-family="system-ui, sans-serif" font-size="12" font-weight="700">128.4% BACKTEST APY</text>

        <!-- Main Headline -->
        <text x="60" y="150" fill="url(#goldText)" font-family="system-ui, sans-serif" font-size="44" font-weight="900" letter-spacing="-1">24/7 AI AUTO-TRADER</text>
        <text x="60" y="200" fill="#C084FC" font-family="system-ui, sans-serif" font-size="26" font-weight="800">Autonomous Arbitrage & Grid Intelligence</text>
        
        <!-- Description -->
        <text x="60" y="248" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="16" font-weight="500">Zero coding required. Smart market maker liquidity capturing micro-spreads.</text>
        <text x="60" y="274" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="15" font-weight="400">Integrated risk guardrails with automatic stop-loss and trailing profit lock.</text>

        <!-- Stats Graphic Badges -->
        <g transform="translate(60, 310)">
          <rect width="170" height="70" rx="16" fill="rgba(30, 15, 60, 0.7)" stroke="#A855F7" stroke-width="1.5"/>
          <text x="20" y="32" fill="#E9D5FF" font-family="system-ui, sans-serif" font-size="11" font-weight="700">TOTAL VOLUME</text>
          <text x="20" y="58" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="22" font-weight="900">$184.2M</text>
        </g>
        <g transform="translate(245, 310)">
          <rect width="170" height="70" rx="16" fill="rgba(30, 15, 60, 0.7)" stroke="#A855F7" stroke-width="1.5"/>
          <text x="20" y="32" fill="#E9D5FF" font-family="system-ui, sans-serif" font-size="11" font-weight="700">WIN RATE</text>
          <text x="20" y="58" fill="#4ADE80" font-family="system-ui, sans-serif" font-size="22" font-weight="900">89.4%</text>
        </g>
        <g transform="translate(430, 310)">
          <rect width="170" height="70" rx="16" fill="rgba(30, 15, 60, 0.7)" stroke="#A855F7" stroke-width="1.5"/>
          <text x="20" y="32" fill="#E9D5FF" font-family="system-ui, sans-serif" font-size="11" font-weight="700">FEE DISCOUNT</text>
          <text x="20" y="58" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="22" font-weight="900">0% TAKER</text>
        </g>

        <!-- Right Side Graphic Illustration / 3D Cyber Bot & Candlesticks -->
        <g transform="translate(820, 70)">
          <!-- Glowing Hexagon Platform -->
          <polygon points="170,250 310,200 310,300 170,350 30,300 30,200" fill="url(#botGlow)" opacity="0.35"/>
          <polygon points="170,230 300,185 300,195 170,240 40,195 40,185" fill="#C084FC" opacity="0.7"/>

          <!-- 3D Cyber Bot Head -->
          <rect x="90" y="50" width="160" height="150" rx="36" fill="#130B24" stroke="url(#botGlow)" stroke-width="4"/>
          <!-- Cyber Visor -->
          <rect x="110" y="85" width="120" height="38" rx="14" fill="#0284C7"/>
          <line x1="120" y1="104" x2="220" y2="104" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
          <circle cx="170" cy="104" r="6" fill="#FFFFFF"/>
          
          <!-- Neural nodes -->
          <circle cx="120" cy="155" r="8" fill="#E879F9"/>
          <circle cx="170" cy="165" r="10" fill="#38BDF8"/>
          <circle cx="220" cy="155" r="8" fill="#4ADE80"/>
          <line x1="128" y1="155" x2="160" y2="165" stroke="#FFFFFF" stroke-width="2"/>
          <line x1="180" y1="165" x2="212" y2="155" stroke="#FFFFFF" stroke-width="2"/>

          <!-- Antenna -->
          <line x1="170" y1="50" x2="170" y2="20" stroke="#C084FC" stroke-width="4"/>
          <circle cx="170" cy="15" r="10" fill="#F43F5E"/>

          <!-- Candlestick Graphic Accents -->
          <rect x="15" y="100" width="14" height="65" rx="3" fill="#4ADE80"/>
          <line x1="22" y1="80" x2="22" y2="185" stroke="#4ADE80" stroke-width="2"/>

          <rect x="305" y="60" width="14" height="90" rx="3" fill="#38BDF8"/>
          <line x1="312" y1="40" x2="312" y2="175" stroke="#38BDF8" stroke-width="2"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'graphic-p2p-championship',
    headline: '50,000 USDT P2P Fiesta',
    tag: 'ZERO FEE CAMPAIGN',
    ctaText: 'Trade P2P Now',
    actionType: 'p2p',
    aspectRatio: '16/6',
    altText: 'OKNexus 50,000 USDT P2P Zero Fees Championship Graphic Banner',
    graphicUrl: createSvgGraphicUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 450" width="1200" height="450">
        <defs>
          <linearGradient id="bgP2P" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#271403"/>
            <stop offset="40%" stop-color="#3B2004"/>
            <stop offset="80%" stop-color="#180C02"/>
            <stop offset="100%" stop-color="#0A0601"/>
          </linearGradient>
          <linearGradient id="goldTrophy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FEF08A"/>
            <stop offset="40%" stop-color="#F59E0B"/>
            <stop offset="100%" stop-color="#B45309"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="450" rx="24" fill="url(#bgP2P)"/>
        
        <!-- Ambient Gold Flare -->
        <circle cx="980" cy="220" r="240" fill="#F59E0B" opacity="0.25" filter="blur(90px)"/>
        <circle cx="200" cy="100" r="140" fill="#D97706" opacity="0.15" filter="blur(60px)"/>

        <!-- Tags -->
        <rect x="60" y="55" width="190" height="34" rx="17" fill="#78350F" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="80" y="77" fill="#FEF08A" font-family="system-ui, sans-serif" font-size="12" font-weight="900" letter-spacing="1">GLOBAL P2P ARENA</text>

        <rect x="265" y="55" width="165" height="34" rx="17" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
        <text x="280" y="77" fill="#FDE68A" font-family="system-ui, sans-serif" font-size="12" font-weight="700">0% MAKER & TAKER</text>

        <!-- Main Headline -->
        <text x="60" y="150" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="44" font-weight="900">50,000 USDT REWARD POOL</text>
        <text x="60" y="200" fill="#FBBF24" font-family="system-ui, sans-serif" font-size="26" font-weight="800">Fast Escrow & 40+ Local Bank Rails</text>

        <text x="60" y="248" fill="#E2E8F0" font-family="system-ui, sans-serif" font-size="16" font-weight="500">Trade USD, EUR, GBP, NGN, BRL & INR directly with verified merchants.</text>
        <text x="60" y="274" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="15" font-weight="400">100% smart contract escrow guarantee with 2-minute average release.</text>

        <!-- Fiat currencies pill list -->
        <g transform="translate(60, 315)">
          <rect width="90" height="38" rx="19" fill="#451A03" stroke="#B45309" stroke-width="1"/>
          <text x="24" y="24" fill="#FEF08A" font-family="system-ui, sans-serif" font-size="13" font-weight="800">USD $</text>
        </g>
        <g transform="translate(160, 315)">
          <rect width="90" height="38" rx="19" fill="#451A03" stroke="#B45309" stroke-width="1"/>
          <text x="24" y="24" fill="#FEF08A" font-family="system-ui, sans-serif" font-size="13" font-weight="800">EUR €</text>
        </g>
        <g transform="translate(260, 315)">
          <rect width="90" height="38" rx="19" fill="#451A03" stroke="#B45309" stroke-width="1"/>
          <text x="24" y="24" fill="#FEF08A" font-family="system-ui, sans-serif" font-size="13" font-weight="800">GBP £</text>
        </g>
        <g transform="translate(360, 315)">
          <rect width="90" height="38" rx="19" fill="#451A03" stroke="#B45309" stroke-width="1"/>
          <text x="24" y="24" fill="#FEF08A" font-family="system-ui, sans-serif" font-size="13" font-weight="800">NGN ₦</text>
        </g>
        <g transform="translate(460, 315)">
          <rect width="90" height="38" rx="19" fill="#451A03" stroke="#B45309" stroke-width="1"/>
          <text x="24" y="24" fill="#FEF08A" font-family="system-ui, sans-serif" font-size="13" font-weight="800">BRL R$</text>
        </g>

        <!-- Right Side 3D Gold Trophy Artwork -->
        <g transform="translate(840, 60)">
          <!-- Trophy Base -->
          <rect x="80" y="280" width="160" height="30" rx="8" fill="#451A03" stroke="#F59E0B" stroke-width="2"/>
          <rect x="100" y="250" width="120" height="30" rx="4" fill="#78350F"/>
          <!-- Stem -->
          <path d="M140 200 L180 200 L170 250 L150 250 Z" fill="url(#goldTrophy)"/>
          <!-- Cup Body -->
          <path d="M100 80 Q160 210 220 80 Z" fill="url(#goldTrophy)"/>
          <ellipse cx="160" cy="80" rx="60" ry="18" fill="#FEF08A"/>
          <!-- Handles -->
          <path d="M105 100 C60 100 60 170 120 160" fill="none" stroke="#FBBF24" stroke-width="12" stroke-linecap="round"/>
          <path d="M215 100 C260 100 260 170 200 160" fill="none" stroke="#FBBF24" stroke-width="12" stroke-linecap="round"/>
          <!-- Star in Cup -->
          <polygon points="160,110 166,128 184,128 170,138 175,156 160,144 145,156 150,138 136,128 154,128" fill="#FFFFFF"/>
          
          <!-- Golden Coins Floating -->
          <circle cx="50" cy="90" r="28" fill="#FBBF24" stroke="#D97706" stroke-width="3"/>
          <text x="42" y="98" fill="#78350F" font-family="system-ui, sans-serif" font-size="22" font-weight="900">₮</text>

          <circle cx="270" cy="220" r="24" fill="#FBBF24" stroke="#D97706" stroke-width="3"/>
          <text x="263" y="228" fill="#78350F" font-family="system-ui, sans-serif" font-size="18" font-weight="900">₮</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'graphic-okn-vault',
    headline: '$OKN Vault & VIP Booster',
    tag: 'ECOSYSTEM STAKING',
    ctaText: 'Stake $OKN',
    actionType: 'earn',
    aspectRatio: '16/6',
    altText: 'OKNexus Token Staking Vault 28.5% APR Graphic Banner',
    graphicUrl: createSvgGraphicUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 450" width="1200" height="450">
        <defs>
          <linearGradient id="bgVault" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#04202C"/>
            <stop offset="40%" stop-color="#083344"/>
            <stop offset="80%" stop-color="#02141F"/>
            <stop offset="100%" stop-color="#010A10"/>
          </linearGradient>
          <linearGradient id="cyanVault" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#67E8F9"/>
            <stop offset="50%" stop-color="#06B6D4"/>
            <stop offset="100%" stop-color="#0E7490"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="450" rx="24" fill="url(#bgVault)"/>
        
        <!-- Glowing Cyan Matrix -->
        <circle cx="1000" cy="220" r="230" fill="#06B6D4" opacity="0.3" filter="blur(90px)"/>
        <circle cx="120" cy="380" r="160" fill="#0891B2" opacity="0.2" filter="blur(80px)"/>

        <!-- Tags -->
        <rect x="60" y="55" width="170" height="34" rx="17" fill="#164E63" stroke="#06B6D4" stroke-width="1.5"/>
        <text x="80" y="77" fill="#A5F3FC" font-family="system-ui, sans-serif" font-size="12" font-weight="900" letter-spacing="1">STAKING VAULT</text>

        <rect x="245" y="55" width="175" height="34" rx="17" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
        <text x="262" y="77" fill="#67E8F9" font-family="system-ui, sans-serif" font-size="12" font-weight="700">28.5% BOOSTED APY</text>

        <!-- Main Headline -->
        <text x="60" y="150" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="44" font-weight="900">$OKN GOVERNANCE VAULT</text>
        <text x="60" y="200" fill="#22D3EE" font-family="system-ui, sans-serif" font-size="26" font-weight="800">Stake Tokens • Unlock VIP Tier Rebates</text>

        <text x="60" y="248" fill="#E2E8F0" font-family="system-ui, sans-serif" font-size="16" font-weight="500">Multiply your daily staking rewards and save up to 40% on spot & futures maker fees.</text>
        <text x="60" y="274" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="15" font-weight="400">Guaranteed Launchpad allocations for every Tier 2+ staked member.</text>

        <!-- Benefit Badges -->
        <g transform="translate(60, 310)">
          <rect width="180" height="68" rx="16" fill="rgba(6, 40, 56, 0.8)" stroke="#0891B2" stroke-width="1.5"/>
          <text x="20" y="30" fill="#A5F3FC" font-family="system-ui, sans-serif" font-size="11" font-weight="700">VIP STATUS</text>
          <text x="20" y="56" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="900">INSTANT TIER 2</text>
        </g>
        <g transform="translate(255, 310)">
          <rect width="180" height="68" rx="16" fill="rgba(6, 40, 56, 0.8)" stroke="#0891B2" stroke-width="1.5"/>
          <text x="20" y="30" fill="#A5F3FC" font-family="system-ui, sans-serif" font-size="11" font-weight="700">COMPOUNDING</text>
          <text x="20" y="56" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="20" font-weight="900">EVERY 8 HOURS</text>
        </g>

        <!-- Right Side 3D Staking Vault Graphic Artwork -->
        <g transform="translate(830, 80)">
          <!-- Quantum Polyhedron Sphere -->
          <polygon points="160,30 270,95 270,225 160,290 50,225 50,95" fill="none" stroke="url(#cyanVault)" stroke-width="3"/>
          <polygon points="160,50 250,105 250,215 160,270 70,215 70,105" fill="#082F49" opacity="0.8" stroke="#38BDF8" stroke-width="2"/>
          <!-- Inner Energy Core -->
          <circle cx="160" cy="160" r="50" fill="url(#cyanVault)"/>
          <circle cx="160" cy="160" r="28" fill="#FFFFFF"/>
          
          <!-- Orbit Rings -->
          <ellipse cx="160" cy="160" rx="130" ry="45" fill="none" stroke="#67E8F9" stroke-width="2" transform="rotate(-30 160 160)"/>
          <circle cx="70" cy="100" r="10" fill="#FBBF24"/>
          <circle cx="250" cy="220" r="12" fill="#E879F9"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'graphic-futures-arena',
    headline: '500,000 USDT Futures Championship',
    tag: 'TRADING ARENA',
    ctaText: 'Enter Arena',
    actionType: 'markets',
    aspectRatio: '16/6',
    altText: 'OKNexus 500,000 USDT Futures Trading Championship Graphic Banner',
    graphicUrl: createSvgGraphicUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 450" width="1200" height="450">
        <defs>
          <linearGradient id="bgArena" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2D0612"/>
            <stop offset="40%" stop-color="#4C051E"/>
            <stop offset="80%" stop-color="#19020A"/>
            <stop offset="100%" stop-color="#0A0105"/>
          </linearGradient>
          <linearGradient id="fireFlame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FECDD3"/>
            <stop offset="40%" stop-color="#F43F5E"/>
            <stop offset="100%" stop-color="#9F1239"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="450" rx="24" fill="url(#bgArena)"/>
        
        <!-- Glowing Red/Pink Flare -->
        <circle cx="1020" cy="220" r="230" fill="#F43F5E" opacity="0.3" filter="blur(90px)"/>
        <circle cx="150" cy="100" r="140" fill="#BE123C" opacity="0.18" filter="blur(60px)"/>

        <!-- Tags -->
        <rect x="60" y="55" width="190" height="34" rx="17" fill="#881337" stroke="#F43F5E" stroke-width="1.5"/>
        <text x="80" y="77" fill="#FECDD3" font-family="system-ui, sans-serif" font-size="12" font-weight="900" letter-spacing="1">GLOBAL DERIVATIVES</text>

        <rect x="265" y="55" width="175" height="34" rx="17" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
        <text x="282" y="77" fill="#FDA4AF" font-family="system-ui, sans-serif" font-size="12" font-weight="700">DAILY LEADERBOARDS</text>

        <!-- Main Headline -->
        <text x="60" y="150" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="44" font-weight="900">500,000 USDT FUTURES ARENA</text>
        <text x="60" y="200" fill="#FB7185" font-family="system-ui, sans-serif" font-size="26" font-weight="800">Compete with Elite Traders • Zero-Slippage</text>

        <text x="60" y="248" fill="#E2E8F0" font-family="system-ui, sans-serif" font-size="16" font-weight="500">Trade BTC, ETH, SOL perpetuals with up to 100x leverage and sub-millisecond execution.</text>
        <text x="60" y="274" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="15" font-weight="400">Top 100 daily PnL gainers share prize pool with real-time on-chain audits.</text>

        <!-- Prize Pool Highlights -->
        <g transform="translate(60, 310)">
          <rect width="180" height="68" rx="16" fill="rgba(76, 5, 30, 0.8)" stroke="#E11D48" stroke-width="1.5"/>
          <text x="20" y="30" fill="#FECDD3" font-family="system-ui, sans-serif" font-size="11" font-weight="700">1ST PLACE</text>
          <text x="20" y="56" fill="#FDE047" font-family="system-ui, sans-serif" font-size="20" font-weight="900">120,000 USDT</text>
        </g>
        <g transform="translate(255, 310)">
          <rect width="180" height="68" rx="16" fill="rgba(76, 5, 30, 0.8)" stroke="#E11D48" stroke-width="1.5"/>
          <text x="20" y="30" fill="#FECDD3" font-family="system-ui, sans-serif" font-size="11" font-weight="700">LEVERAGE</text>
          <text x="20" y="56" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="900">UP TO 100X</text>
        </g>

        <!-- Right Side Candlestick Volcano Artwork -->
        <g transform="translate(850, 70)">
          <polygon points="150,20 220,160 80,160" fill="url(#fireFlame)"/>
          <polygon points="150,60 190,160 110,160" fill="#FDE047"/>
          <!-- Candlesticks surging -->
          <rect x="40" y="140" width="22" height="110" rx="4" fill="#10B981"/>
          <line x1="51" y1="120" x2="51" y2="270" stroke="#10B981" stroke-width="3"/>
          <rect x="80" y="100" width="22" height="150" rx="4" fill="#10B981"/>
          <line x1="91" y1="80" x2="91" y2="270" stroke="#10B981" stroke-width="3"/>
          <rect x="200" y="70" width="22" height="180" rx="4" fill="#10B981"/>
          <line x1="211" y1="50" x2="211" y2="270" stroke="#10B981" stroke-width="3"/>
          <rect x="240" y="30" width="22" height="220" rx="4" fill="#F43F5E"/>
          <line x1="251" y1="10" x2="251" y2="270" stroke="#F43F5E" stroke-width="3"/>
        </g>
      </svg>
    `),
  },
];

export const GRAPHIC_ANNOUNCEMENTS: GraphicAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Instant SEPA & Wire Fiat Ramp Now Live with 0% Deposit Fees',
    category: 'NEW',
    time: '1h ago',
    thumbnailUrl: createSvgGraphicUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
        <rect width="80" height="80" rx="16" fill="#042F2E"/>
        <circle cx="40" cy="40" r="26" fill="#0D9488"/>
        <text x="32" y="47" fill="#CCFBF1" font-family="sans-serif" font-size="22" font-weight="900">€</text>
      </svg>
    `),
  },
  {
    id: 'ann-2',
    title: 'Proof-of-Reserves Audited: 104.2% Clean Asset Backing',
    category: 'SECURITY',
    time: '3h ago',
    thumbnailUrl: createSvgGraphicUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
        <rect width="80" height="80" rx="16" fill="#1E1B4B"/>
        <polygon points="40,20 60,30 60,55 40,65 20,55 20,30" fill="#6366F1"/>
        <circle cx="40" cy="42" r="10" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: 'ann-3',
    title: 'Zero-Fee P2P Tuesdays: Free Escrow Settlement All Day',
    category: 'PROMO',
    time: '5h ago',
    thumbnailUrl: createSvgGraphicUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
        <rect width="80" height="80" rx="16" fill="#451A03"/>
        <circle cx="40" cy="40" r="26" fill="#F59E0B"/>
        <text x="32" y="48" fill="#78350F" font-family="sans-serif" font-size="24" font-weight="900">₮</text>
      </svg>
    `),
  },
  {
    id: 'ann-4',
    title: 'AI Auto-Trader V2 Algorithm Integrated with Deep Liquidity',
    category: 'LISTING',
    time: '8h ago',
    thumbnailUrl: createSvgGraphicUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
        <rect width="80" height="80" rx="16" fill="#3B0764"/>
        <rect x="22" y="24" width="36" height="32" rx="8" fill="#C084FC"/>
        <rect x="28" y="32" width="24" height="8" rx="3" fill="#1E1B4B"/>
      </svg>
    `),
  },
];
