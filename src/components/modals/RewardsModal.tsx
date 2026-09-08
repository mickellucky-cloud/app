import React, { useState } from 'react';
import { X, Gift, Sparkles, CheckCircle2, Trophy, Coins } from 'lucide-react';
import { OKNexusBadge3D } from '../common/OKNexusLogo';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({ isOpen, onClose }) => {
  const [openedBox, setOpenedBox] = useState(false);
  const [rewardAmount, setRewardAmount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleOpenMysteryBox = () => {
    if (openedBox) return;
    const randomReward = Math.floor(Math.random() * 25) + 15; // 15 to 40 OKN
    setRewardAmount(randomReward);
    setOpenedBox(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#0F1320] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 text-slate-100 safe-area-bottom max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Rewards Hub</h3>
              <p className="text-[11px] text-slate-400">Daily tasks & mystery boxes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mystery Box Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#2D1B4E] via-[#161226] to-[#0A0D18] border border-purple-500/40 text-center mb-5 relative overflow-hidden shadow-lg">
          <div className="absolute top-2 right-3 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
            TIER 1 REWARD
          </div>

          <div className="flex justify-center mb-3">
            <OKNexusBadge3D size={64} />
          </div>

          <h4 className="font-bold text-base text-white mb-1">OKNexus Mystery Vault Box</h4>
          <p className="text-xs text-slate-300 mb-4 max-w-[240px] mx-auto">
            Log in daily to claim free OKN airdrops, trading fee vouchers, and surprise staking multipliers.
          </p>

          {openedBox ? (
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center justify-center gap-2 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Unlocked +{rewardAmount} OKN ($ {(rewardAmount! * 4.85).toFixed(2)})</span>
            </div>
          ) : (
            <button
              onClick={handleOpenMysteryBox}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-fuchsia-600 hover:opacity-95 font-bold text-white text-xs shadow-[0_4px_16px_rgba(245,158,11,0.35)] active:scale-95 transition-all"
            >
              🎁 Claim Free Mystery Box
            </button>
          )}
        </div>

        {/* Daily Tasks List */}
        <div className="space-y-2 text-xs">
          <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">
            Active Challenges
          </h5>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#090C16] border border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-4 h-4 text-purple-400" />
              <div>
                <div className="font-semibold text-white">Spot Trade Volume &gt; $100</div>
                <div className="text-[10px] text-slate-400">Earn 50 OKN voucher</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
              Progress: 85%
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#090C16] border border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-amber-400" />
              <div>
                <div className="font-semibold text-white">Subscribe to Earn Vault</div>
                <div className="text-[10px] text-slate-400">+1.5% APY booster card</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              Completed ✓
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
