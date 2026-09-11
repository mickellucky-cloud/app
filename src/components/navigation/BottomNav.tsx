import React from 'react';
import { motion } from 'motion/react';
import { MainTab } from '../../types';
import { Home, BarChart2, ArrowLeftRight, Coins, Wallet } from 'lucide-react';

interface BottomNavProps {
  activeTab: MainTab | 'p2p';
  onSelectTab: (tab: MainTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const navItems: { id: MainTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'market', label: 'Market', icon: BarChart2 },
    { id: 'trade', label: 'Trade', icon: ArrowLeftRight },
    { id: 'earn', label: 'Earn', icon: Coins },
    { id: 'assets', label: 'Assets', icon: Wallet },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0E141B]/95 backdrop-blur-xl border-t border-[#D7E0EB] dark:border-[#242E3B] shadow-[0_-4px_20px_-2px_rgba(15,23,42,0.05)] dark:shadow-none safe-area-bottom md:hidden transition-colors"
    >
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className="relative flex flex-col items-center justify-center py-1 px-3 min-w-[58px] transition-all duration-200 active:scale-95 group"
            >
              {/* Top sliding active indicator bar with OKNexus brand gradient */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator-bar"
                  className="absolute -top-2 w-8 h-0.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              {/* Active glow backing */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-glow"
                  className="absolute -top-1 w-8 h-8 rounded-full bg-[#8B5CF6]/15 dark:bg-[#8B5CF6]/25 blur-md pointer-events-none"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <div
                className={`relative flex items-center justify-center transition-colors duration-200 ${
                  isActive
                    ? 'text-[#8B5CF6] dark:text-[#8B5CF6] drop-shadow-sm dark:drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]'
                    : 'text-[#64748B] group-hover:text-[#0F172A] dark:text-[#8E98A6] dark:group-hover:text-[#EDF1F5]'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span
                className={`text-[11px] mt-1 tracking-tight transition-colors duration-200 ${
                  isActive
                    ? 'text-[#8B5CF6] dark:text-[#8B5CF6] font-bold'
                    : 'text-[#64748B] group-hover:text-[#0F172A] dark:text-[#8E98A6] dark:group-hover:text-[#EDF1F5] font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
