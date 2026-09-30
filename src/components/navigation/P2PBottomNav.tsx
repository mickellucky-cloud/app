import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { P2PTab } from '../../types';
import { Users, FileText, Radio, User } from 'lucide-react';

interface P2PBottomNavProps {
  activeTab: P2PTab;
  onSelectTab: (tab: P2PTab) => void;
}

export const P2PBottomNav: React.FC<P2PBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });
  const [ripple, setRipple] = useState<{ id: number; x: number; y: number } | null>(null);

  const navItems: {
    id: P2PTab;
    label: string;
    icon: React.FC<{ className?: string; fill?: string; strokeWidth?: number }>;
    fillOnActive?: boolean;
  }[] = [
    { id: 'p2p_market', label: 'P2P', icon: Users, fillOnActive: true },
    { id: 'p2p_orders', label: 'Orders', icon: FileText, fillOnActive: false },
    { id: 'p2p_ads', label: 'Ads', icon: Radio, fillOnActive: false },
    { id: 'p2p_profile', label: 'Profile', icon: User, fillOnActive: true },
  ];

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  const handleTabClick = (item: P2PTab, e: React.MouseEvent<HTMLButtonElement>) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      setRipple({
        id: Date.now(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setTimeout(() => setRipple(null), 600);
    }
    onSelectTab(item);
  };

  return (
    <>
      {/* Background Soft Ambient Scroll Fade Shield to prevent content peeking awkwardly behind the dock */}
      <div className="fixed inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#07090E] dark:via-[#07090E]/80 dark:to-transparent pointer-events-none z-30 md:hidden" />

      <div
        id="floating-p2p-liquid-nav-container"
        className="fixed left-0 right-0 z-40 flex justify-center px-3 pointer-events-none md:hidden"
        style={{
          bottom: 'max(0.5rem, calc(env(safe-area-inset-bottom, 0px) * 0.35 + 6px))',
        }}
      >
        <nav
          id="p2p-navigation-bar"
          ref={navRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="pointer-events-auto relative w-full max-w-[360px] h-[66px] rounded-full select-none transition-transform duration-200"
        >
          {/* Layer 1: Hardware-Accelerated Frosted Glass Substrate */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden transition-colors duration-300 glass-dock"
            style={{
              backdropFilter: 'blur(28px) saturate(190%) contrast(105%)',
              WebkitBackdropFilter: 'blur(28px) saturate(190%) contrast(105%)',
            }}
          >
            {/* Frosted Glass Gradient Tint: Kuda Deep Charcoal Glass in Dark Mode */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/84 to-white/92 dark:from-[#14151D]/92 dark:via-[#0F1017]/90 dark:to-[#0A0B10]/96" />

            {/* Top Specular Sheen Arc */}
            <div className="absolute inset-0 bg-radial-[circle_at_50%_0%] from-white/40 dark:from-white/12 to-transparent pointer-events-none" />

            {/* Dynamic Touch / Pointer Fluid Spotlight Refraction */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: spotlight.opacity,
                background: `radial-gradient(130px circle at ${spotlight.x}px ${spotlight.y}px, rgba(124, 58, 237, 0.18), transparent 70%)`,
              }}
            />

            {/* Fluid Tap Ripple */}
            {ripple && (
              <motion.div
                key={ripple.id}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="absolute w-16 h-16 -ml-8 -mt-8 rounded-full bg-purple-500/20 blur-sm pointer-events-none"
                style={{ left: ripple.x, top: ripple.y }}
              />
            )}
          </div>

          {/* Layer 2: Prismatic Glass Bevel Rim & Specular Borders */}
          <div className="absolute inset-0 rounded-full pointer-events-none border border-white/60 dark:border-white/[0.12] shadow-[0_16px_40px_-6px_rgba(15,23,42,0.14),inset_0_1px_1.5px_rgba(255,255,255,0.85)] dark:shadow-[0_20px_50px_-8px_rgba(0,0,0,0.85),inset_0_1px_1.5px_rgba(255,255,255,0.16)]">
            {/* Top specular highlight arc */}
            <div className="absolute top-0 inset-x-6 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 dark:via-white/40 to-transparent rounded-full" />
            {/* Bottom subtle ambient refraction */}
            <div className="absolute bottom-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent rounded-full" />
          </div>

          {/* Layer 3: Navigation Tab Items - Rigid 4-Column Grid with Kuda & OPay Optical Alignment */}
          <div className="relative grid grid-cols-4 h-full w-full px-1 items-center z-10">
            {navItems.map((item, index) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              const isFirst = index === 0;
              const isLast = index === navItems.length - 1;

              return (
                <button
                  key={item.id}
                  id={`p2p-nav-${item.id}`}
                  onClick={(e) => handleTabClick(item.id, e)}
                  className="relative flex flex-col items-center justify-center h-full w-full rounded-full transition-transform duration-150 active:scale-92 group outline-none cursor-pointer"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {/* Kuda-Style Elevated Active Capsule Pill - Hugs end caps seamlessly with zero dead gap */}
                  {isActive && (
                    <motion.div
                      layoutId="p2p-kuda-nav-active-pill"
                      className={`absolute inset-y-1.5 rounded-full bg-purple-500/12 dark:bg-white/[0.12] border border-purple-500/25 dark:border-white/[0.18] shadow-[0_2px_10px_rgba(124,58,237,0.15)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4),0_0_12px_rgba(124,58,237,0.2)] backdrop-blur-md pointer-events-none ${
                        isFirst ? 'left-1 right-0.5' : isLast ? 'left-0.5 right-1' : 'inset-x-1'
                      }`}
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 32,
                        mass: 0.8,
                      }}
                    >
                      {/* Top micro gloss highlight */}
                      <div className="absolute top-1 inset-x-3 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/50 to-transparent rounded-full" />
                    </motion.div>
                  )}

                  {/* Tab Content: Perfectly Aligned Icon & Label */}
                  <div className="relative flex flex-col items-center justify-center gap-1 z-10">
                    {/* Icon */}
                    <motion.div
                      animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className={`flex items-center justify-center w-6 h-6 transition-colors duration-200 ${
                        isActive
                          ? 'text-purple-600 dark:text-white'
                          : 'text-slate-600 group-hover:text-slate-900 dark:text-white/70 dark:group-hover:text-white'
                      }`}
                    >
                      <Icon
                        className="w-[22px] h-[22px]"
                        fill={isActive && item.fillOnActive ? 'currentColor' : 'none'}
                        strokeWidth={isActive ? 2.4 : 2}
                      />
                    </motion.div>

                    {/* Label */}
                    <span
                      className={`text-[11.5px] leading-none tracking-tight text-center truncate max-w-full px-1 transition-colors duration-200 ${
                        isActive
                          ? 'text-purple-600 dark:text-white font-semibold'
                          : 'text-slate-600 group-hover:text-slate-900 dark:text-white/70 dark:group-hover:text-white font-medium'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};
