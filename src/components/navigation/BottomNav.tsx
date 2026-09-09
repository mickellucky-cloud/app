import React from 'react';
import { MainTab } from '../../types';
import { Home, BarChart2, ArrowLeftRight, Percent, Wallet } from 'lucide-react';

interface BottomNavProps {
  activeTab: MainTab;
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
    { id: 'earn', label: 'Earn', icon: Percent },
    { id: 'assets', label: 'Assets', icon: Wallet },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#090C14]/92 backdrop-blur-xl border-t border-slate-200 dark:border-white/[0.07] shadow-lg dark:shadow-none safe-area-bottom md:hidden"
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
              {/* Active glow backing */}
              {isActive && (
                <div className="absolute -top-1 w-8 h-8 rounded-full bg-purple-500/15 dark:bg-purple-600/20 blur-md pointer-events-none" />
              )}

              <div
                className={`relative flex items-center justify-center transition-colors duration-200 ${
                  isActive
                    ? 'text-purple-600 dark:text-fuchsia-400 drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]'
                    : 'text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span
                className={`text-[11px] font-medium mt-1 tracking-tight transition-colors duration-200 ${
                  isActive
                    ? 'text-purple-700 dark:text-fuchsia-400 font-bold'
                    : 'text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-300'
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
