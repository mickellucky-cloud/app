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
    <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#0E141B] border-t sm:border border-[#D7E0EB] dark:border-[#242E3B] rounded-t-3xl sm:rounded-3xl p-5 text-[#0F172A] dark:text-[#EDF1F5] safe-area-bottom max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#242E3B] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Rewards Hub</h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">Daily tasks & mystery boxes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mystery Box Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#8B5CF6]/15 via-[#F8FAFC] to-[#EC4899]/10 dark:from-[#8B5CF6]/20 dark:via-[#141B24] dark:to-[#0A0E13] border border-[#8B5CF6]/30 text-center mb-5 relative overflow-hidden shadow-md">
          <div className="absolute top-2 right-3 px-2 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 text-[10px] font-bold">
            TIER 1 REWARD
          </div>

          <div className="flex justify-center mb-3">
            <OKNexusBadge3D size={64} />
          </div>

          <h4 className="font-bold text-base text-[#0F172A] dark:text-white mb-1">OKNexus Mystery Vault Box</h4>
          <p className="text-xs text-[#64748B] dark:text-[#8E98A6] mb-4 max-w-[240px] mx-auto">
            Log in daily to claim free OKN airdrops, trading fee vouchers, and surprise staking multipliers.
          </p>

          {openedBox ? (
            <div className="p-3 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] font-bold text-sm flex items-center justify-center gap-2 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>Unlocked +{rewardAmount} OKN (${(rewardAmount! * 4.85).toFixed(2)})</span>
            </div>
          ) : (
            <button
              onClick={handleOpenMysteryBox}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#EC4899] hover:opacity-95 font-bold text-white text-xs shadow-[0_4px_16px_rgba(245,158,11,0.35)] active:scale-95 transition-all"
            >
              Claim Free Mystery Box
            </button>
          )}
        </div>

        {/* Daily Tasks List */}
        <div className="space-y-2 text-xs">
          <h5 className="font-bold text-[#64748B] dark:text-[#8E98A6] uppercase tracking-wider text-[10px] mb-2">
            Active Challenges
          </h5>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B]">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-4 h-4 text-[#8B5CF6]" />
              <div>
                <div className="font-semibold text-[#0F172A] dark:text-white">Spot Trade Volume &gt; $100</div>
                <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">Earn 50 OKN voucher</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 text-[10px] font-bold">
              Progress: 85%
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B]">
            <div className="flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-[#F59E0B]" />
              <div>
                <div className="font-semibold text-[#0F172A] dark:text-white">Subscribe to Earn Vault</div>
                <div className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">+1.5% APY booster card</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-bold">
              Completed ✓
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
