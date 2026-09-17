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

  const navItems: { id: P2PTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'p2p_market', label: 'P2P', icon: Users },
    { id: 'p2p_orders', label: 'Orders', icon: FileText },
    { id: 'p2p_ads', label: 'Ads', icon: Radio },
    { id: 'p2p_profile', label: 'Profile', icon: User },
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
    <div
      id="floating-p2p-liquid-nav-container"
      className="fixed left-0 right-0 z-40 flex justify-center px-3.5 pointer-events-none md:hidden"
      style={{
        bottom: 'max(0.5rem, calc(env(safe-area-inset-bottom, 0px) * 0.35 + 6px))',
      }}
    >
      <nav
        id="p2p-navigation-bar"
        ref={navRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="pointer-events-auto relative w-full max-w-[380px] rounded-[26px] select-none transition-transform duration-200"
      >
        {/* Layer 1: Liquid Refraction & Frosted Glass Substrate */}
        <div
          className="absolute inset-0 rounded-[26px] overflow-hidden transition-colors duration-300"
          style={{
            backdropFilter: 'url(#liquid-glass-lens) blur(22px) saturate(190%) contrast(104%)',
            WebkitBackdropFilter: 'blur(22px) saturate(190%) contrast(104%)',
          }}
        >
          {/* Liquid glass background gradient tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/60 to-white/75 dark:from-[#131B2A]/80 dark:via-[#0B0F17]/70 dark:to-[#070A10]/85" />

          {/* Specular fluid sheen */}
          <div className="absolute inset-0 bg-radial-[circle_at_50%_0%] from-white/30 dark:from-white/10 to-transparent pointer-events-none" />

          {/* Dynamic cursor/touch liquid spotlight refraction */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: spotlight.opacity,
              background: `radial-gradient(140px circle at ${spotlight.x}px ${spotlight.y}px, rgba(168, 85, 247, 0.22), rgba(236, 72, 153, 0.12), transparent 70%)`,
            }}
          />

          {/* Fluid Tap Ripple */}
          {ripple && (
            <motion.div
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute w-16 h-16 -ml-8 -mt-8 rounded-full bg-gradient-to-r from-purple-400/40 to-pink-400/30 blur-sm pointer-events-none"
              style={{ left: ripple.x, top: ripple.y }}
            />
          )}
        </div>

        {/* Layer 2: Liquid Glass Bevel Rim & Prismatic Borders */}
        <div className="absolute inset-0 rounded-[26px] pointer-events-none border border-white/50 dark:border-white/15 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.18),0_4px_16px_-4px_rgba(139,92,246,0.15)] dark:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.7),0_0_24px_-2px_rgba(139,92,246,0.25)]">
          {/* Top specular highlight arc */}
          <div className="absolute top-0 inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 dark:via-white/40 to-transparent rounded-full" />
          {/* Bottom ambient refraction tint */}
          <div className="absolute bottom-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-purple-400/30 dark:via-purple-500/20 to-transparent rounded-full" />
        </div>

        {/* Layer 3: Navigation Tab Items */}
        <div className="relative px-2 py-1.5 flex items-center justify-around z-10">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`p2p-nav-${item.id}`}
                onClick={(e) => handleTabClick(item.id, e)}
                className="relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[62px] rounded-2xl transition-transform duration-200 active:scale-90 group outline-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Fluid Mercury Active Pill Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="p2p-liquid-nav-active-pill"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-500/15 via-purple-600/20 to-purple-600/10 dark:from-purple-500/25 dark:via-purple-600/30 dark:to-purple-600/15 border border-purple-500/35 dark:border-purple-400/30 shadow-[0_2px_12px_rgba(139,92,246,0.25),inset_0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_16px_rgba(139,92,246,0.4),inset_0_1px_1px_rgba(255,255,255,0.25)]"
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 32,
                      mass: 0.8,
                    }}
                  >
                    {/* Top micro gloss highlight */}
                    <div className="absolute top-1 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/40 to-transparent rounded-full" />
                  </motion.div>
                )}

                {/* Icon with optical glow */}
                <div className="relative flex items-center justify-center">
                  {isActive && (
                    <motion.div
                      layoutId="p2p-liquid-nav-glow"
                      className="absolute w-8 h-8 rounded-full bg-purple-500/25 dark:bg-purple-500/40 blur-md pointer-events-none"
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 32,
                      }}
                    />
                  )}

                  <motion.div
                    animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className={`relative z-10 transition-colors duration-200 ${
                      isActive
                        ? 'text-purple-700 dark:text-purple-300 drop-shadow-[0_2px_8px_rgba(147,51,234,0.4)] dark:drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]'
                        : 'text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </motion.div>
                </div>

                {/* Tab Label */}
                <span
                  className={`relative z-10 text-[11px] mt-0.5 tracking-tight transition-all duration-200 ${
                    isActive
                      ? 'text-purple-700 dark:text-purple-200 font-bold drop-shadow-xs'
                      : 'text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200 font-medium'
                  }`}
                >
                  {item.label}
                </span>

                {/* Micro liquid bead indicator */}
                {isActive && (
                  <motion.div
                    layoutId="p2p-liquid-nav-bead"
                    className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
