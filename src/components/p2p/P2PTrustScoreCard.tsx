import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Sliders,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  X,
  UserCheck,
  ThumbsUp,
  FileCheck
} from 'lucide-react';
import { P2PTrustScoreData } from '../../types';

interface P2PTrustScoreCardProps {
  ordersCount?: number;
  completionRate?: number;
  tradeVolume?: number;
  avgReleaseMin?: number;
  initialGovIdVerified?: boolean;
  initialBankVerified?: boolean;
  initial2faEnabled?: boolean;
  initialAddressVerified?: boolean;
  initialFeedbackScore?: number;
  onScoreChange?: (newScore: number) => void;
}

export const P2PTrustScoreCard: React.FC<P2PTrustScoreCardProps> = ({
  ordersCount = 2843,
  completionRate = 98.5,
  tradeVolume = 18450,
  avgReleaseMin = 2.4,
  initialGovIdVerified = true,
  initialBankVerified = true,
  initial2faEnabled = true,
  initialAddressVerified = true,
  initialFeedbackScore = 99.2,
  onScoreChange,
}) => {
  // State for interactive simulator
  const [showSimulator, setShowSimulator] = useState(false);
  const [showBreakdownDetails, setShowBreakdownDetails] = useState(false);

  // Simulated values with actuals as baseline
  const [simGovId, setSimGovId] = useState(initialGovIdVerified);
  const [simBank, setSimBank] = useState(initialBankVerified);
  const [sim2fa, setSim2fa] = useState(initial2faEnabled);
  const [simAddress, setSimAddress] = useState(initialAddressVerified);
  const [simFeedback, setSimFeedback] = useState(initialFeedbackScore);
  const [simVolume, setSimVolume] = useState(tradeVolume);
  const [simOrders, setSimOrders] = useState(ordersCount);
  const [simCompletion, setSimCompletion] = useState(completionRate);
  const [simDisputes, setSimDisputes] = useState(0);

  const isSimulated =
    simGovId !== initialGovIdVerified ||
    simBank !== initialBankVerified ||
    sim2fa !== initial2faEnabled ||
    simAddress !== initialAddressVerified ||
    simFeedback !== initialFeedbackScore ||
    simVolume !== tradeVolume ||
    simOrders !== ordersCount ||
    simCompletion !== completionRate ||
    simDisputes !== 0;

  const handleReset = () => {
    setSimGovId(initialGovIdVerified);
    setSimBank(initialBankVerified);
    setSim2fa(initial2faEnabled);
    setSimAddress(initialAddressVerified);
    setSimFeedback(initialFeedbackScore);
    setSimVolume(tradeVolume);
    setSimOrders(ordersCount);
    setSimCompletion(completionRate);
    setSimDisputes(0);
  };

  // -------------------------------------------------------------
  // Dynamic Mathematical Calculation of Trust Score (0-100)
  // -------------------------------------------------------------
  // Pillar 1: Trade History (Max 40 points)
  // - Completion Rate (Max 18 pts): (completion / 100) * 18
  // - Volume (Max 14 pts): logarithmic/stepped up to $25k+ USDT
  // - Orders Count (Max 8 pts): tiered scaling
  const completionPts = Math.min(18, Math.max(0, (simCompletion / 100) * 18));
  const volumePts = Math.min(14, Math.max(2, (Math.min(simVolume, 25000) / 25000) * 14));
  const ordersPts =
    simOrders >= 1000 ? 8 : simOrders >= 200 ? 6.5 : simOrders >= 50 ? 5 : simOrders >= 10 ? 3.5 : 1.5;
  const tradeHistoryScore = Math.min(40, completionPts + volumePts + ordersPts);

  // Pillar 2: Verified Identity Status (Max 35 points)
  // - National ID / Passport Level 2 KYC: 18 pts
  // - Bank Name Verification Match: 9 pts
  // - Two-Factor Authentication (2FA): 5 pts
  // - Address / Level 3 Verification: 3 pts
  const govIdPts = simGovId ? 18 : 0;
  const bankPts = simBank ? 9 : 0;
  const twoFaPts = sim2fa ? 5 : 0;
  const addressPts = simAddress ? 3 : 0;
  const identityScore = govIdPts + bankPts + twoFaPts + addressPts;

  // Pillar 3: Feedback Ratings & Reputation (Max 25 points)
  // - Positive Feedback Rating: (feedback / 100) * 15 (Max 15 pts)
  // - Zero Dispute Record: 6 pts (loses 3 pts per dispute)
  // - Avg Release Speed: 4 pts (<3m: 4 pts, <7m: 2.5 pts, >=7m: 1 pt)
  const feedbackPts = Math.min(15, Math.max(0, (simFeedback / 100) * 15));
  const disputePts = Math.max(0, 6 - simDisputes * 3);
  const speedPts = avgReleaseMin <= 3 ? 4 : avgReleaseMin <= 7 ? 2.5 : 1;
  const reputationScore = Math.min(25, feedbackPts + disputePts + speedPts);

  // Total Trust Score (0 - 100)
  const rawTotal = tradeHistoryScore + identityScore + reputationScore;
  const totalScore = Math.min(100, Math.max(0, Math.round(rawTotal * 10) / 10));
  const integerScore = Math.round(totalScore);

  // Determine Tier and Color Scheme
  // Tier thresholds:
  // 90 - 100: Exceptional Trust (Cyan)
  // 75 - 89: High Trust (Emerald)
  // 50 - 74: Moderate Trust (Amber)
  // 0 - 49: Low Trust / At Risk (Rose)
  let tier: P2PTrustScoreData['tier'] = 'Exceptional';
  let tierColor = '#06B6D4'; // Cyan
  let tierBg = 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300';
  let tierBadge = 'Tier 5 • Exceptional Trust';
  let tierDescription = 'Flawless institutional track record with verified KYC, zero disputes, and lightning settlement.';

  if (integerScore < 50) {
    tier = 'Low Trust';
    tierColor = '#F43F5E'; // Rose
    tierBg = 'bg-rose-500/15 border-rose-400/40 text-rose-300';
    tierBadge = 'Tier 1 • Low Trust / Restricted';
    tierDescription = 'Incomplete identity verification or limited trade history. Escrow limits apply.';
  } else if (integerScore < 75) {
    tier = 'Moderate Trust';
    tierColor = '#F59E0B'; // Amber
    tierBg = 'bg-amber-500/15 border-amber-400/40 text-amber-300';
    tierBadge = 'Tier 3 • Moderate Trust';
    tierDescription = 'Standard trader profile. Increasing trade volume and 2FA will boost your score.';
  } else if (integerScore < 90) {
    tier = 'High Trust';
    tierColor = '#10B981'; // Emerald
    tierBg = 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300';
    tierBadge = 'Tier 4 • High Trust';
    tierDescription = 'Trusted counterparty with verified ID and high order fulfillment rate.';
  }

  return (
    <div
      id="p2p-trust-score-card"
      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.08] shadow-xs dark:shadow-lg relative overflow-hidden space-y-4"
    >
      {/* Background Ambient Glow matching current tier */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: tierColor }}
      />

      {/* Header Bar with Score & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs transition-colors duration-500 shrink-0"
            style={{
              backgroundColor: `${tierColor}15`,
              borderColor: `${tierColor}40`,
              color: tierColor,
            }}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                P2P Trust & Reputation Score
              </h4>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-[9.5px] font-mono-num text-slate-600 dark:text-slate-300 font-medium">
                Live Algorithm
              </span>
              <div className="flex items-center gap-1.5 ml-0.5">
                <span
                  className="text-base font-extrabold font-mono-num tracking-tight"
                  style={{ color: tierColor }}
                >
                  {integerScore}
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">/100</span>
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide border shadow-xs ${tierBg}`}
                >
                  <Sparkles className="w-2.5 h-2.5 fill-current" />
                  <span>{tier.toUpperCase()}</span>
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Multi-factor trust rating derived from trade history, identity, & feedback
            </p>
          </div>
        </div>

        {/* Action Buttons: Simulator & Breakdown Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowSimulator(!showSimulator)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              showSimulator
                ? 'bg-purple-100 dark:bg-purple-600/25 border-purple-300 dark:border-purple-500 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'bg-slate-100 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.08]'
            }`}
            title="Open Trust Score Simulator to test score adjustments"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Simulator</span>
            {isSimulated && (
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowBreakdownDetails(!showBreakdownDetails)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all"
            title={showBreakdownDetails ? 'Collapse Details' : 'Expand Details'}
          >
            {showBreakdownDetails ? (
              <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* 3 CORE PILLARS SCORE BREAKDOWN MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Pillar 1: Trade History (Max 40) */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-1.5 hover:border-purple-300 dark:hover:border-white/15 transition-all shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
              <TrendingUp className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Trade History</span>
            </div>
            <span className="font-mono-num font-bold text-slate-900 dark:text-white">
              {Math.round(tradeHistoryScore * 10) / 10} <span className="text-slate-400 dark:text-slate-500 text-[10px]">/ 40</span>
            </span>
          </div>
          {/* Mini progress bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${(tradeHistoryScore / 40) * 100}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5 pt-0.5">
            <div className="flex justify-between">
              <span>Orders:</span>
              <span className="text-slate-800 dark:text-slate-200 font-mono-num">{simOrders.toLocaleString()} ({Math.round(ordersPts * 10) / 10}/8)</span>
            </div>
            <div className="flex justify-between">
              <span>Completion:</span>
              <span className="text-slate-800 dark:text-slate-200 font-mono-num">{simCompletion}% ({Math.round(completionPts * 10) / 10}/18)</span>
            </div>
            <div className="flex justify-between">
              <span>30d Volume:</span>
              <span className="text-slate-800 dark:text-slate-200 font-mono-num">${simVolume.toLocaleString()} ({Math.round(volumePts * 10) / 10}/14)</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Verified Identity (Max 35) */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-1.5 hover:border-cyan-300 dark:hover:border-white/15 transition-all shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
              <UserCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Verified Identity</span>
            </div>
            <span className="font-mono-num font-bold text-slate-900 dark:text-white">
              {identityScore} <span className="text-slate-400 dark:text-slate-500 text-[10px]">/ 35</span>
            </span>
          </div>
          {/* Mini progress bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${(identityScore / 35) * 100}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5 pt-0.5">
            <div className="flex justify-between items-center">
              <span>National ID (L2):</span>
              <span className={`font-mono-num font-medium flex items-center gap-0.5 ${simGovId ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {simGovId ? '18/18 ✓' : '0/18 ✕'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Bank Name Match:</span>
              <span className={`font-mono-num font-medium flex items-center gap-0.5 ${simBank ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {simBank ? '9/9 ✓' : '0/9 ✕'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>2FA Security:</span>
              <span className={`font-mono-num font-medium flex items-center gap-0.5 ${sim2fa ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {sim2fa ? '5/5 ✓' : '0/5 ✕'}
              </span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Feedback & Reputation (Max 25) */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-1.5 hover:border-emerald-300 dark:hover:border-white/15 transition-all shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Feedback & Speed</span>
            </div>
            <span className="font-mono-num font-bold text-slate-900 dark:text-white">
              {Math.round(reputationScore * 10) / 10} <span className="text-slate-400 dark:text-slate-500 text-[10px]">/ 25</span>
            </span>
          </div>
          {/* Mini progress bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${(reputationScore / 25) * 100}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5 pt-0.5">
            <div className="flex justify-between">
              <span>Positive Rating:</span>
              <span className="text-slate-800 dark:text-slate-200 font-mono-num">{simFeedback.toFixed(1)}% ({Math.round(feedbackPts * 10) / 10}/15)</span>
            </div>
            <div className="flex justify-between">
              <span>Disputes:</span>
              <span className={`font-mono-num ${simDisputes === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {simDisputes} disputes ({disputePts}/6)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Release Speed:</span>
              <span className="text-slate-800 dark:text-slate-200 font-mono-num">{avgReleaseMin}m avg ({speedPts}/4)</span>
            </div>
          </div>
        </div>
      </div>

      {/* EXPANDED BREAKDOWN AUDIT DETAILS */}
      {showBreakdownDetails && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-3 text-xs animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/[0.06]">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Mathematical Trust Score Formulation</span>
            </span>
            <span className="text-[11px] text-cyan-600 dark:text-cyan-300 font-mono-num font-semibold">
              Weight: 40% History • 35% KYC • 25% Feedback
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            <div className="space-y-1">
              <strong className="text-slate-900 dark:text-white">Why is this important?</strong>
              <p className="text-slate-500 dark:text-slate-400">
                Counterparties on the OKNexus P2P network prioritize traders with high Trust Scores (&ge;90). A higher score increases your order placement frequency, removes transaction hold times, and unlocks institutional merchant privileges.
              </p>
            </div>
            <div className="space-y-1">
              <strong className="text-slate-900 dark:text-white">How to reach 100 / 100:</strong>
              <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-0.5">
                <li>Maintain &ge;99% completion rate over at least 50 orders.</li>
                <li>Complete Tier 2 Govt ID, Bank Name matching, and 2FA.</li>
                <li>Release escrow within 3 minutes and resolve disputes amicably.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE TRUST SCORE SIMULATOR (SLIDERS & TOGGLES) */}
      {showSimulator && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-purple-50/50 dark:bg-gradient-to-br dark:from-purple-950/30 dark:via-[#0E1322] dark:to-cyan-950/25 border border-purple-200 dark:border-purple-500/30 space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-purple-200 dark:border-purple-500/20">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Interactive Trust Score Simulator</h5>
            </div>
            {isSimulated && (
              <button
                type="button"
                onClick={handleReset}
                className="px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-[10px] font-semibold hover:bg-rose-500/25 flex items-center gap-1 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Account Actuals</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* Simulation: Identity Controls */}
            <div className="space-y-2 p-2.5 rounded-lg bg-white dark:bg-white/[0.02] border border-purple-100 dark:border-white/[0.05]">
              <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-300">Identity & Security Credentials</span>
              <div className="space-y-1.5">
                <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                  <span className="text-slate-700 dark:text-slate-300 text-[11px]">Level 2 National ID (+18 pts)</span>
                  <input
                    type="checkbox"
                    checked={simGovId}
                    onChange={(e) => setSimGovId(e.target.checked)}
                    className="rounded accent-cyan-600 w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                  <span className="text-slate-700 dark:text-slate-300 text-[11px]">Bank Name Match (+9 pts)</span>
                  <input
                    type="checkbox"
                    checked={simBank}
                    onChange={(e) => setSimBank(e.target.checked)}
                    className="rounded accent-cyan-600 w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                  <span className="text-slate-700 dark:text-slate-300 text-[11px]">2FA Security Key (+5 pts)</span>
                  <input
                    type="checkbox"
                    checked={sim2fa}
                    onChange={(e) => setSim2fa(e.target.checked)}
                    className="rounded accent-cyan-600 w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                  <span className="text-slate-700 dark:text-slate-300 text-[11px]">Address Verification (+3 pts)</span>
                  <input
                    type="checkbox"
                    checked={simAddress}
                    onChange={(e) => setSimAddress(e.target.checked)}
                    className="rounded accent-cyan-600 w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Simulation: Trade Volume & Feedback Sliders */}
            <div className="space-y-3 p-2.5 rounded-lg bg-white dark:bg-white/[0.02] border border-purple-100 dark:border-white/[0.05]">
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">Volume & Feedback Simulation</span>

              {/* Feedback slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">Positive Feedback:</span>
                  <span className="font-mono-num font-bold text-slate-900 dark:text-white">{simFeedback.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={100}
                  step={0.2}
                  value={simFeedback}
                  onChange={(e) => setSimFeedback(Number(e.target.value))}
                  className="w-full accent-emerald-600 dark:accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
              </div>

              {/* Volume slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">30d Trading Volume:</span>
                  <span className="font-mono-num font-bold text-slate-900 dark:text-white">${simVolume.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={50000}
                  step={1000}
                  value={simVolume}
                  onChange={(e) => setSimVolume(Number(e.target.value))}
                  className="w-full accent-purple-600 dark:accent-purple-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
              </div>

              {/* Dispute count toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Dispute Penalty:</span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setSimDisputes(cnt)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono-num font-semibold transition-all ${
                        simDisputes === cnt
                          ? 'bg-rose-500/25 border border-rose-500 text-rose-600 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cnt} {cnt === 1 ? 'Dispute' : 'Disputes'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
