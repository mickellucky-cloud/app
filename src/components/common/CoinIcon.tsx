import React from 'react';
import { OKNexusLogo } from './OKNexusLogo';
import {
  TokenALGO,
  TokenFIL,
  TokenICP,
  TokenKAS,
  TokenFET,
  TokenRUNE,
  TokenSEI,
  TokenSTX,
  TokenIMX,
  TokenHBAR,
  TokenBCH,
  TokenXLM,
  TokenETC,
  TokenVET,
  TokenSAND,
  TokenMANA,
  TokenAXS,
  TokenGALA,
  TokenGRT,
  TokenMKR,
  TokenSNX,
  TokenCRV,
  TokenLDO,
  TokenAPT,
  TokenFTM,
} from '@web3icons/react';

interface CoinIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

// Additional token components map from @web3icons/react
const EXTENDED_WEB3_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ALGO: TokenALGO,
  FIL: TokenFIL,
  ICP: TokenICP,
  KAS: TokenKAS,
  FET: TokenFET,
  RUNE: TokenRUNE,
  SEI: TokenSEI,
  STX: TokenSTX,
  IMX: TokenIMX,
  HBAR: TokenHBAR,
  BCH: TokenBCH,
  XLM: TokenXLM,
  ETC: TokenETC,
  VET: TokenVET,
  SAND: TokenSAND,
  MANA: TokenMANA,
  AXS: TokenAXS,
  GALA: TokenGALA,
  GRT: TokenGRT,
  MKR: TokenMKR,
  SNX: TokenSNX,
  CRV: TokenCRV,
  LDO: TokenLDO,
  APT: TokenAPT,
  FTM: TokenFTM,
};

export const CoinIcon: React.FC<CoinIconProps> = ({
  symbol,
  size = 36,
  className = '',
}) => {
  const s = (symbol || '').toUpperCase().trim();

  // 1. OKNexus Native Token
  if (s === 'OKN') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#1C1233] to-[#0D0819] border border-purple-500/40 shadow-sm shrink-0 overflow-hidden ${className}`}
        style={{ width: size, height: size }}
      >
        <OKNexusLogo size={size * 0.72} />
      </div>
    );
  }

  // 2. Bitcoin (BTC) - Official Foundation Vector Logo
  if (s === 'BTC') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#F7931A" />
        <path
          fill="#FFFFFF"
          fillRule="nonzero"
          d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.977.243 4.118.696 3.61 2.733z"
        />
      </svg>
    );
  }

  // 3. Ethereum (ETH) - Official Multi-faceted Vector Diamond
  if (s === 'ETH') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#627EEA" />
        <g fill="#FFFFFF" fillRule="nonzero">
          <path fillOpacity="0.6" d="M16.498 4v8.87l7.497 3.35z" />
          <path d="M16.498 4L9 16.22l7.498-3.35z" />
          <path fillOpacity="0.6" d="M16.498 21.968v6.027L24 17.616z" />
          <path d="M16.498 27.995v-6.028L9 17.616z" />
          <path fillOpacity="0.2" d="M16.498 20.573l7.497-4.353-7.497-3.348z" />
          <path fillOpacity="0.6" d="M9 16.22l7.498 4.353v-7.701z" />
        </g>
      </svg>
    );
  }

  // 4. Tether (USDT) - Official Vector Emblem
  if (s === 'USDT') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#26A17B" />
        <path
          fill="#FFFFFF"
          d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-1.01-6.79-2.02 0-1.012 2.902-1.85 6.79-2.022v3.013c.254.016.97.051 1.99.051 1.233 0 1.81-.039 1.923-.051v-3.013c3.883.172 6.779 1.01 6.779 2.022 0 1.01-2.896 1.849-6.779 2.02m0-4.316V9.972h5.367V6.999H8.674v2.973H14.04v3.095c-4.437.21-7.78 1.237-7.78 2.484 0 1.246 3.343 2.274 7.78 2.484v8.038h3.882v-8.04c4.432-.21 7.768-1.238 7.768-2.482 0-1.247-3.336-2.275-7.768-2.484"
        />
      </svg>
    );
  }

  // 5. USD Coin (USDC) - Official Center / Circle Vector Emblem
  if (s === 'USDC') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#2775CA" />
        <g fill="#FFFFFF">
          <path d="M19.167 17.667c0-1.634-.967-2.183-2.9-2.4-1.367-.183-1.667-.55-1.667-1.217 0-.717.567-1.167 1.633-1.167 1.017 0 1.55.384 1.8 1.067a.417.417 0 0 0 .383.267h1.05a.415.415 0 0 0 .4-.45c-.267-1.2-1.2-2.034-2.616-2.2v-1.8a.417.417 0 0 0-.417-.417h-.833a.417.417 0 0 0-.417.417v1.75c-1.6.217-2.6 1.25-2.6 2.583 0 1.584.983 2.167 2.917 2.384 1.35.183 1.65.6 1.65 1.266 0 .8-.75 1.284-1.8 1.284-1.383 0-1.933-.517-2.117-1.3a.412.412 0 0 0-.4-.317h-1.116a.417.417 0 0 0-.417.467c.284 1.383 1.267 2.25 2.85 2.45v1.8c0 .233.184.417.417.417h.833a.417.417 0 0 0 .417-.417v-1.783c1.7-.267 2.783-1.334 2.783-2.684z" />
          <path d="M12.183 24.3c-4.583-1.683-7.016-6.8-5.333-11.383 1.15-3.134 3.9-5.267 7.15-5.584.233-.016.417-.216.417-.45v-1.15a.417.417 0 0 0-.434-.416C8.367 5.75 3.983 10.5 4.383 16.117c.367 5.083 4.417 9.133 9.5 9.5 3.367.25 6.45-1.1 8.534-3.417a.417.417 0 0 0-.034-.583l-.85-.817a.42.42 0 0 0-.583.033c-2.184 2.217-5.584 2.95-8.767 1.467z" />
          <path d="M26.25 15.883c-.367-5.083-4.417-9.133-9.5-9.5-3.367-.25-6.45 1.1-8.533 3.417a.417.417 0 0 0 .033.583l.85.817a.42.42 0 0 0 .583-.033c2.184-2.217 5.584-2.95 8.767-1.467 4.584 1.683 7.017 6.8 5.334 11.383-1.15 3.134-3.9 5.267-7.15 5.584a.417.417 0 0 0-.417.45v1.15a.417.417 0 0 0 .433.416c5.617-.433 10-5.183 9.6-10.8z" />
        </g>
      </svg>
    );
  }

  // 6. Solana (SOL) - Official Foundation Gradient Speed Stripes
  if (s === 'SOL') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <defs>
          <linearGradient id="solana-gradient-official" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00FFA3" />
            <stop offset="100%" stopColor="#DC1FFF" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="16" fill="#14141E" />
        <g fill="url(#solana-gradient-official)">
          <path d="M8.2 21.6c.2-.2.5-.3.8-.3h14.5c.5 0 .8.6.4 1l-2.9 2.9c-.2.2-.5.3-.8.3H5.7c-.5 0-.8-.6-.4-1l2.9-2.9z" />
          <path d="M8.2 6.5c.2-.2.5-.3.8-.3h14.5c.5 0 .8.6.4 1L21 10.1c-.2.2-.5.3-.8.3H5.7c-.5 0-.8-.6-.4-1l2.9-2.9z" />
          <path d="M23.8 14.1c-.2-.2-.5-.3-.8-.3H8.5c-.5 0-.8.6-.4 1l2.9 2.9c.2.2.5.3.8.3h14.5c.5 0 .8-.6.4-1l-2.9-2.9z" />
        </g>
      </svg>
    );
  }

  // 7. BNB (BNB Chain / Binance) - Official Geometric Diamond Cluster
  if (s === 'BNB') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
        <path
          fill="#FFFFFF"
          d="M16 6.5l3.1 3.1-4.8 4.8 4.8 4.8-3.1 3.1-7.9-7.9L16 6.5zm0 19l-3.1-3.1 4.8-4.8-4.8-4.8 3.1-3.1 7.9 7.9-7.9 7.9zm-6.5-9.5l3.1-3.1 3.1 3.1-3.1 3.1-3.1-3.1zm13 0l-3.1-3.1 3.1-3.1 3.1 3.1-3.1 3.1zm-6.5 0l-1.6-1.6 1.6-1.6 1.6 1.6-1.6 1.6z"
        />
      </svg>
    );
  }

  // 8. XRP (Ripple) - Official Flowing Chevrons
  if (s === 'XRP') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#23292F" />
        <path
          fill="#FFFFFF"
          d="M23.95 8.12h2.51l-7.58 7.53 2.11 2.1 5.47-5.43v-4.2H23.95zm-15.9 0H5.54l7.58 7.53-2.11 2.1-5.47-5.43v-4.2h2.51zm0 15.76H5.54l7.58-7.53-2.11-2.1-5.47 5.43v4.2h2.51zm15.9 0h2.51l-7.58-7.53 2.11-2.1 5.47 5.43v4.2H23.95z"
        />
      </svg>
    );
  }

  // 9. Dogecoin (DOGE) - Official Golden Emblem
  if (s === 'DOGE') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#C2A633" />
        <path
          fill="#FFFFFF"
          d="M12.5 8h4.8c4.2 0 6.7 2.6 6.7 6.6 0 4.1-2.6 6.7-6.9 6.7h-4.6V8zm3.2 2.6v3.8h3.3v2h-3.3v4.1h1.3c2.4 0 4-1.4 4-4.2 0-2.6-1.5-3.9-3.8-3.9h-1.5v-1.8zM9.5 14.4h6.2v2H9.5v-2z"
        />
      </svg>
    );
  }

  // 10. Cardano (ADA) - Official Constellation Pattern
  if (s === 'ADA') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#0033AD" />
        <circle cx="16" cy="16" r="2.4" fill="#FFFFFF" />
        <circle cx="16" cy="10.2" r="1.4" fill="#FFFFFF" />
        <circle cx="16" cy="21.8" r="1.4" fill="#FFFFFF" />
        <circle cx="10.2" cy="16" r="1.4" fill="#FFFFFF" />
        <circle cx="21.8" cy="16" r="1.4" fill="#FFFFFF" />
        <circle cx="11.9" cy="11.9" r="1.3" fill="#FFFFFF" />
        <circle cx="20.1" cy="11.9" r="1.3" fill="#FFFFFF" />
        <circle cx="11.9" cy="20.1" r="1.3" fill="#FFFFFF" />
        <circle cx="20.1" cy="20.1" r="1.3" fill="#FFFFFF" />
        <circle cx="16" cy="6.2" r="0.9" fill="#FFFFFF" fillOpacity="0.8" />
        <circle cx="16" cy="25.8" r="0.9" fill="#FFFFFF" fillOpacity="0.8" />
        <circle cx="6.2" cy="16" r="0.9" fill="#FFFFFF" fillOpacity="0.8" />
        <circle cx="25.8" cy="16" r="0.9" fill="#FFFFFF" fillOpacity="0.8" />
      </svg>
    );
  }

  // 11. TRON (TRX) - Official 3D Wireframe Prism
  if (s === 'TRX') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#EF0027" />
        <path
          fill="#FFFFFF"
          d="M7.5 9.2l12.8-3.5 4.2 13.9-17 4.2V9.2zm1.6 1.8v10.4l13.1-3.2-3.3-10.7-9.8 3.5zm2.7 1.8l6.2-2.2 2.1 6.8-8.3 2.1V12.8z"
        />
      </svg>
    );
  }

  // 12. Avalanche (AVAX) - Official Twin Peaks
  if (s === 'AVAX') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#E84142" />
        <path
          fill="#FFFFFF"
          d="M17.8 7.3c-.8-1.4-2.8-1.4-3.6 0L5.3 22.8c-.8 1.4.2 3.2 1.8 3.2h5.5c.8 0 1.6-.4 2-1.2l1.4-2.4c.4-.7 1.2-1.2 2-1.2h2.8c.8 0 1.6.4 2 1.2l1.4 2.4c.4.7 1.2 1.2 2 1.2h.5c1.6 0 2.6-1.8 1.8-3.2L17.8 7.3zm-1.8 5l4.8 8.4h-9.6l4.8-8.4zm8.7 8.4l1.6 2.8c.4.7.4 1.5 0 2.2-.4.7-1.2 1.2-2 1.2h-2.1c-.8 0-1.6-.4-2-1.2l-1.6-2.8c-.4-.7-.4-1.5 0-2.2.4-.7 1.2-1.2 2-1.2h2.1c.8 0 1.6.5 2 1.2z"
        />
      </svg>
    );
  }

  // 13. Chainlink (LINK) - Official Hexagonal Link
  if (s === 'LINK') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#375BD2" />
        <path
          fill="#FFFFFF"
          d="M16 7l-7.8 4.5v9L16 25l7.8-4.5v-9L16 7zm5.2 12l-5.2 3-5.2-3v-6l5.2-3 5.2 3v6z"
        />
      </svg>
    );
  }

  // 14. NEAR Protocol (NEAR) - Official Stepped 'N'
  if (s === 'NEAR') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#000000" />
        <path
          fill="#00EC97"
          d="M19.426 5.92 15.665 11.5c-.257.385.244.835.604.52l3.279-3.214c.096-.084.238-.026.238.116v10.06c0 .135-.18.193-.258.097L8.754 5.682A1.85 1.85 0 0 0 7.295 5C6.138 5 5 5.585 5 6.922v14.15a1.922 1.922 0 0 0 3.555 1.002l3.754-5.58c.257-.385-.238-.835-.598-.52l-3.259 3.278c-.096.084-.238.026-.238-.115V9.102c0-.142.18-.193.257-.097L19.226 22.32c.36.443.9.681 1.46.681C21.849 23 23 22.422 23 21.078V6.928a1.929 1.929 0 0 0-3.574-1.002z"
        />
      </svg>
    );
  }

  // 15. Sui (SUI) - Official Water Drop Chevron
  if (s === 'SUI') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#4DA2FF" />
        <path
          fill="#FFFFFF"
          d="M16 6.5c-1.5 2.5-6.5 9-6.5 13.5 0 3.6 2.9 6.5 6.5 6.5s6.5-2.9 6.5-6.5c0-4.5-5-11-6.5-13.5zm0 17.5c-2.2 0-4-1.8-4-4 0-2.3 2.5-6 4-8 1.5 2 4 5.7 4 8 0 2.2-1.8 4-4 4z"
        />
      </svg>
    );
  }

  // 16. Arbitrum (ARB) - Official Blue Bridge
  if (s === 'ARB') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#28A0F0" />
        <path
          fill="#FFFFFF"
          d="M16 6.8l7.5 13.5-2.8 1.6-4.7-8.5-4.7 8.5-2.8-1.6L16 6.8zm-4.7 13.5l4.7-8.4 4.7 8.4h-9.4z"
        />
      </svg>
    );
  }

  // 17. Pepe (PEPE) - Official Frog Emblem
  if (s === 'PEPE') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#43A047" />
        <path
          fill="#FFFFFF"
          d="M8.5 14c0-3.5 3.5-6 7.5-6s7.5 2.5 7.5 6c0 1.5-.5 3-1.5 4-1 1-2.5 2-6 2s-5-1-6-2c-1-1-1.5-2.5-1.5-4zm4-1.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm7 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-9 7.5c2 2 5 2.5 5.5 2.5s3.5-.5 5.5-2.5c.5-.5.2-1.5-.5-1.5h-10c-.7 0-1 1-.5 1.5z"
        />
      </svg>
    );
  }

  // 18. Injective (INJ) - Official Vortex
  if (s === 'INJ') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#0C1425" />
        <path
          fill="#00F2FE"
          d="M16 7c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61l2.12-2.12C10.41 18.42 10 17.26 10 16c0-3.31 2.69-6 6-6s6 2.69 6 6c0 1.26-.41 2.42-1.09 3.49l2.12 2.12C24.26 20.07 25 18.12 25 16c0-4.97-4.03-9-9-9zm0 6c-1.66 0-3 1.34-3 3 0 .74.27 1.41.72 1.93l4.21-4.21C17.41 13.27 16.74 13 16 13zm1.28 2.07l-4.21 4.21c.52.45 1.19.72 1.93.72 1.66 0 3-1.34 3-3 0-.74-.27-1.41-.72-1.93z"
        />
      </svg>
    );
  }

  // 19. Celestia (TIA) - Official Constellation
  if (s === 'TIA') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#7B2BF9" />
        <path
          fill="#FFFFFF"
          d="M16 7c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 3.5c3.04 0 5.5 2.46 5.5 5.5 0 1.7-.77 3.22-1.98 4.24l-7.76-7.76C12.78 11.27 14.3 10.5 16 10.5zm0 11c-3.04 0-5.5-2.46-5.5-5.5 0-1.7.77-3.22 1.98-4.24l7.76 7.76C19.22 20.73 17.7 21.5 16 21.5z"
        />
      </svg>
    );
  }

  // 20. Polkadot (DOT) - Official Dots Pattern
  if (s === 'DOT') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#E6007A" />
        <circle cx="16" cy="16" r="4.8" fill="#FFFFFF" />
        <circle cx="16" cy="7.2" r="2.2" fill="#FFFFFF" />
        <circle cx="16" cy="24.8" r="2.2" fill="#FFFFFF" />
        <circle cx="7.2" cy="16" r="2.2" fill="#FFFFFF" />
        <circle cx="24.8" cy="16" r="2.2" fill="#FFFFFF" />
      </svg>
    );
  }

  // 21. Polygon (MATIC / POL) - Official Infinity Prism
  if (s === 'MATIC' || s === 'POL') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#8247E5" />
        <path
          fill="#FFFFFF"
          d="M21.2 13.7c-.5-.3-1.1-.3-1.6 0l-2.4 1.4-1.6.9-2.4 1.4c-.5.3-1.1.3-1.6 0l-1.9-1.1c-.5-.3-.8-.8-.8-1.4v-2.2c0-.6.3-1.1.8-1.4l1.9-1.1c.5-.3 1.1-.3 1.6 0l1.9 1.1c.5.3.8.8.8 1.4v1.1l1.6-.9v-1.1c0-1.2-.6-2.2-1.6-2.8L16.1 7c-1-.6-2.2-.6-3.2 0L11 8.1c-1 .6-1.6 1.6-1.6 2.8v2.2c0 1.2.6 2.2 1.6 2.8l1.9 1.1c.5.3 1.1.3 1.6 0l2.4-1.4 1.6-.9 2.4-1.4c.5-.3 1.1-.3 1.6 0l1.9 1.1c.5.3.8.8.8 1.4v2.2c0 .6-.3 1.1-.8 1.4l-1.9 1.1c-.5.3-1.1.3-1.6 0l-1.9-1.1c-.5-.3-.8-.8-.8-1.4v-1.1l-1.6.9v1.1c0 1.2.6 2.2 1.6 2.8l1.9 1.1c1 .6 2.2.6 3.2 0l1.9-1.1c1-.6 1.6-1.6 1.6-2.8v-2.2c0-1.2-.6-2.2-1.6-2.8l-1.9-1.1z"
        />
      </svg>
    );
  }

  // 22. Toncoin (TON) - Official Diamond Crystal
  if (s === 'TON') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#0098EA" />
        <path
          fill="#FFFFFF"
          d="M16 7l9 5.5L16 25 7 12.5 16 7zm0 2.8L9.8 14 16 22.2 22.2 14 16 9.8zm0 2.5l3.8 2.2H12.2l3.8-2.2z"
        />
      </svg>
    );
  }

  // 23. Shiba Inu (SHIB) - Official Emblem
  if (s === 'SHIB') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#FFA409" />
        <path
          fill="#FFFFFF"
          d="M16 8l-3.5 4.5h7L16 8zm-4.5 5.5L7 16l4.5 6.5L16 25l4.5-2.5L25 16l-4.5-2.5h-9zm4.5 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
        />
      </svg>
    );
  }

  // 24. Litecoin (LTC) - Official Slanted Ł
  if (s === 'LTC') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#345D9D" />
        <path
          fill="#FFFFFF"
          d="M15.3 8h3.4l-2.4 9.2 3.8-1.2-.5 2-3.8 1.2-1.2 4.8h8v2.4H12.5l3.2-12.4-3.6 1.2.6-2 3.5-1.2L17.5 8h-2.2z"
        />
      </svg>
    );
  }

  // 25. Uniswap (UNI) - Official Unicorn
  if (s === 'UNI') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#FF007A" />
        <path
          fill="#FFFFFF"
          d="M21.5 9c-.5 0-2.5 1-4 2.5-1.2 1.2-2 2.7-2.5 4-.5-1.5-1.5-3-3-4-1.2-.8-3-1.5-4-1.5.5 1.5 1.5 3 2.5 4.2 1.5 1.8 3.5 3.3 5.5 4.3 0 1-.2 2-.8 2.8 1.5-.5 2.8-1.5 3.8-2.8 1.8-2.3 2.5-5.5 2.5-9.5z"
        />
      </svg>
    );
  }

  // 26. Dai (DAI) - Official Double-bar D
  if (s === 'DAI') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#F5AC37" />
        <path
          fill="#FFFFFF"
          d="M11 8h5.8c3.5 0 6.2 2.4 6.2 6 0 1.2-.3 2.3-.9 3.2h2.9v1.8h-3.6c-1 1.6-2.7 2.6-4.6 2.6v2.4H15v-2.4h-4v-1.8h4V17h-4v-1.8h4v-5.4h-4V8zm5.8 9c2.4 0 4.2-1.5 4.2-4.2s-1.8-4.2-4.2-4.2H13v8.4h3.8z"
        />
      </svg>
    );
  }

  // 27. Aave (AAVE) - Official Emblem
  if (s === 'AAVE') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#B6509E" />
        <path
          fill="#FFFFFF"
          d="M16 8l-6 16h3.2l1.6-4.5h6.4l1.6 4.5H26L20 8h-4zm0 4.8l2.3 6.4h-4.6L16 12.8z"
        />
      </svg>
    );
  }

  // 28. Optimism (OP) - Official Emblem
  if (s === 'OP') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#FF0420" />
        <path
          fill="#FFFFFF"
          d="M9.5 11c-2.5 0-4.5 2.2-4.5 5s2 5 4.5 5 4.5-2.2 4.5-5-2-5-4.5-5zm0 7.5c-1.2 0-2.2-1.1-2.2-2.5s1-2.5 2.2-2.5 2.2 1.1 2.2 2.5-1 2.5-2.2 2.5zm9-7.5h-3.8v10h2.4v-3.2h1.4c2.5 0 4.5-1.5 4.5-3.4 0-2-2-3.4-4.5-3.4zm0 4.6h-1.4V13h1.4c1.1 0 2 .6 2 1.3s-.9 1.3-2 1.3z"
        />
      </svg>
    );
  }

  // 29. Cosmos (ATOM) - Official Atom Ring
  if (s === 'ATOM') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="16" fill="#2E3148" />
        <circle cx="16" cy="16" r="2.5" fill="#FFFFFF" />
        <ellipse cx="16" cy="16" rx="8.5" ry="3.5" fill="none" stroke="#FFFFFF" strokeWidth="1.2" transform="rotate(30 16 16)" />
        <ellipse cx="16" cy="16" rx="8.5" ry="3.5" fill="none" stroke="#FFFFFF" strokeWidth="1.2" transform="rotate(90 16 16)" />
        <ellipse cx="16" cy="16" rx="8.5" ry="3.5" fill="none" stroke="#FFFFFF" strokeWidth="1.2" transform="rotate(150 16 16)" />
      </svg>
    );
  }

  // 30. Check if token is in extended Web3Icons collection
  const Web3Component = EXTENDED_WEB3_ICONS[s];
  if (Web3Component) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full bg-[#181E2E] border border-slate-700/60 shadow-xs shrink-0 overflow-hidden ${className}`}
        style={{ width: size, height: size }}
      >
        <Web3Component size={Math.round(size * 0.7)} />
      </div>
    );
  }

  // 31. Fallback for any unknown symbol: High quality exchange token pill
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 text-white font-bold tracking-tight shadow-sm shrink-0 overflow-hidden ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(9, Math.round(size * 0.38)) }}
    >
      {s.slice(0, 3)}
    </div>
  );
};
