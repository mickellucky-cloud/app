import React from 'react';
import { OKNexusLogo } from './OKNexusLogo';

interface CoinIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

export const CoinIcon: React.FC<CoinIconProps> = ({
  symbol,
  size = 36,
  className = '',
}) => {
  const s = symbol.toUpperCase();

  if (s === 'OKN') {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-[#18112C] border border-purple-500/40 shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <OKNexusLogo size={size * 0.7} />
      </div>
    );
  }

  if (s === 'BTC') {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-[#F7931A] text-white font-bold font-display shadow-sm ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.52 }}
      >
        ₿
      </div>
    );
  }

  if (s === 'ETH') {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-[#2C324D] border border-slate-700 text-white shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 256 417" fill="none">
          <path d="M127.961 0L125.166 9.5V285.168L127.961 287.958L255.923 212.32L127.961 0Z" fill="#8A92B2" />
          <path d="M127.962 0L0 212.32L127.962 287.958V154.122V0Z" fill="#62688F" />
          <path d="M127.961 312.187L126.386 314.107V414.65L127.961 417.001L255.999 236.586L127.961 312.187Z" fill="#8A92B2" />
          <path d="M127.962 417V312.187L0 236.586L127.962 417Z" fill="#62688F" />
          <path d="M127.961 287.958L255.923 212.32L127.961 154.122V287.958Z" fill="#454A75" />
          <path d="M0 212.32L127.962 287.958V154.122L0 212.32Z" fill="#393C60" />
        </svg>
      </div>
    );
  }

  if (s === 'USDT') {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-[#009393] text-white font-bold shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize: size * 0.55 }}>₮</span>
      </div>
    );
  }

  if (s === 'SOL') {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gradient-to-tr from-[#9945FF] to-[#14F195] text-black font-extrabold shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 397 311" fill="none">
          <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="#000" />
          <path d="M64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="#000" />
          <path d="M333.3 120.9c-2.4-2.4-5.7-3.8-9.2-3.8H6.7c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="#000" />
        </svg>
      </div>
    );
  }

  if (s === 'BNB') {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-[#F3BA2F] text-black font-bold shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 120 120" fill="currentColor">
          <path d="M60 17l18 18-18 18-18-18 18-18zm-29 29l18 18-18 18-18-18 18-18zm58 0l18 18-18 18-18-18 18-18zm-29 29l18 18-18 18-18-18 18-18z" />
        </svg>
      </div>
    );
  }

  if (s === 'DOGE') {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-[#C3A634] text-white font-bold font-display shadow-sm ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.55 }}
      >
        Ð
      </div>
    );
  }

  if (s === 'XRP') {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-[#23292F] border border-slate-700 text-white font-bold shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize: size * 0.45 }}>✕</span>
      </div>
    );
  }

  if (s === 'ADA') {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-[#0033AD] text-white font-bold shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize: size * 0.45 }}>₳</span>
      </div>
    );
  }

  // Generic fallback
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {s.slice(0, 3)}
    </div>
  );
};
