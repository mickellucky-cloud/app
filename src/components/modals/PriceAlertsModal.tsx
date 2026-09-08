import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PriceAlert, MarketPair, PriceAlertDirection, PriceAlertFrequency } from '../../types';
import { CoinIcon } from '../common/CoinIcon';
import { Sparkline } from '../common/Sparkline';
import {
  X,
  Bell,
  BellRing,
  Plus,
  Trash2,
  Play,
  Pause,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Zap,
  Search,
  CheckCircle2,
  Clock,
  Edit2,
  ChevronDown,
} from 'lucide-react';

interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: PriceAlert[];
  marketPairs: MarketPair[];
  initialPair?: MarketPair;
  onCreateAlert: (alertData: Omit<PriceAlert, 'id' | 'createdAt' | 'status'>) => PriceAlert | void;
  onToggleStatus: (id: string) => void;
  onDeleteAlert: (id: string) => void;
  onEditAlert: (id: string, newTarget: number, newNotes?: string) => void;
  onTradePair: (symbol: string) => void;
  onSimulateTrigger: (alert: PriceAlert) => void;
  onSimulatePriceMove?: (symbol: string, pctDelta: number) => void;
}

export const PriceAlertsModal: React.FC<PriceAlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  marketPairs,
  initialPair,
  onCreateAlert,
  onToggleStatus,
  onDeleteAlert,
  onEditAlert,
  onTradePair,
  onSimulateTrigger,
  onSimulatePriceMove,
}) => {
  // Navigation / Filter State
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'triggered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for creating new alert
  const [selectedPairSymbol, setSelectedPairSymbol] = useState<string>(
    initialPair ? initialPair.symbol : marketPairs[0]?.symbol || 'BTC/USDT'
  );
  const [targetPriceInput, setTargetPriceInput] = useState<string>('');
  const [direction, setDirection] = useState<PriceAlertDirection>('above');
  const [frequency, setFrequency] = useState<PriceAlertFrequency>('once');
  const [notes, setNotes] = useState<string>('');
  const [isPairDropdownOpen, setIsPairDropdownOpen] = useState(false);

  // Edit Mode state
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);
  const [editPriceInput, setEditPriceInput] = useState<string>('');
  const [editNotesInput, setEditNotesInput] = useState<string>('');

  // Row Success Animation Highlight state
  const [highlightedAlertId, setHighlightedAlertId] = useState<string | null>(null);
  const [highlightReason, setHighlightReason] = useState<'created' | 'updated' | null>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerAlertHighlight = (id: string, reason: 'created' | 'updated') => {
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }
    setHighlightedAlertId(id);
    setHighlightReason(reason);
    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedAlertId(null);
      setHighlightReason(null);
    }, 3200);
  };

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  // Success Feedback
  const [formSuccessMsg, setFormSuccessMsg] = useState<string | null>(null);

  // Current market pair object
  const currentPair = useMemo(() => {
    return (
      marketPairs.find((p) => p.symbol === selectedPairSymbol) ||
      marketPairs[0] || {
        symbol: 'BTC/USDT',
        base: 'BTC',
        quote: 'USDT',
        name: 'Bitcoin',
        price: 67214.5,
        change24h: 2.14,
        high24h: 67890,
        low24h: 65420,
      }
    );
  }, [marketPairs, selectedPairSymbol]);

  // Set initial target price when pair changes or when opening create tab
  const handleSelectPair = (pair: MarketPair) => {
    setSelectedPairSymbol(pair.symbol);
    setIsPairDropdownOpen(false);
    // Suggest 5% above current price by default
    const suggested = (pair.price * 1.05).toFixed(pair.price >= 10 ? 2 : 4);
    setTargetPriceInput(suggested);
    setDirection('above');
  };

  // Sync when initialPair is provided
  React.useEffect(() => {
    if (initialPair) {
      setSelectedPairSymbol(initialPair.symbol);
      const suggested = (initialPair.price * 1.05).toFixed(initialPair.price >= 10 ? 2 : 4);
      setTargetPriceInput(suggested);
    }
  }, [initialPair]);

  // When target price input changes, smart-deduce direction
  const handlePriceInputChange = (val: string) => {
    setTargetPriceInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && currentPair) {
      if (num > currentPair.price) {
        setDirection('above');
      } else if (num < currentPair.price) {
        setDirection('below');
      }
    }
  };

  // Preset percentage handler
  const handleApplyPreset = (pct: number) => {
    if (!currentPair) return;
    const calculated = currentPair.price * (1 + pct / 100);
    setTargetPriceInput(
      calculated >= 10 ? calculated.toFixed(2) : calculated.toFixed(4)
    );
    setDirection(pct >= 0 ? 'above' : 'below');
  };

  // Preset 24h High/Low handler
  const handleApplyHighLow = (type: 'high' | 'low') => {
    if (!currentPair) return;
    const val = type === 'high' ? currentPair.high24h : currentPair.low24h;
    setTargetPriceInput(val >= 10 ? val.toFixed(2) : val.toFixed(4));
    setDirection(val >= currentPair.price ? 'above' : 'below');
  };

  // Submit Alert Creation
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(targetPriceInput);
    if (isNaN(numPrice) || numPrice <= 0) {
      alert('Please enter a valid target price.');
      return;
    }

    const created = onCreateAlert({
      symbol: currentPair.symbol,
      base: currentPair.base,
      quote: currentPair.quote,
      targetPrice: numPrice,
      direction,
      frequency,
      currentPriceAtCreation: currentPair.price,
      notes: notes.trim() || undefined,
    });

    const targetId = created ? created.id : alerts[0]?.id;

    // Switch to list view to highlight the new alert row
    setActiveTab('list');
    setFilterStatus('all');
    setSearchQuery('');
    setTargetPriceInput('');
    setNotes('');

    if (targetId) {
      triggerAlertHighlight(targetId, 'created');
    }
  };

  // Start editing alert
  const handleStartEdit = (alert: PriceAlert) => {
    setEditingAlertId(alert.id);
    setEditPriceInput(alert.targetPrice.toString());
    setEditNotesInput(alert.notes || '');
  };

  // Save edit
  const handleSaveEdit = (id: string) => {
    const num = parseFloat(editPriceInput);
    if (isNaN(num) || num <= 0) {
      alert('Invalid price.');
      return;
    }
    onEditAlert(id, num, editNotesInput.trim() || undefined);
    setEditingAlertId(null);
    triggerAlertHighlight(id, 'updated');
  };

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (filterStatus === 'active' && a.status !== 'active') return false;
      if (filterStatus === 'triggered' && a.status !== 'triggered') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.symbol.toLowerCase().includes(q) ||
          a.base.toLowerCase().includes(q) ||
          (a.notes && a.notes.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [alerts, filterStatus, searchQuery]);

  const activeCount = alerts.filter((a) => a.status === 'active').length;
  const triggeredCount = alerts.filter((a) => a.status === 'triggered').length;

  if (!isOpen) return null;

  return (
    <div
      id="price-alerts-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center p-0 sm:p-4 text-slate-100"
    >
      <div
        id="price-alerts-modal-content"
        className="w-full max-w-md bg-[#0D111E] border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl p-4 sm:p-5 safe-area-bottom max-h-[88vh] flex flex-col animate-slideUp shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/25 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-sm">
              <BellRing className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-tight">Price Alerts</h3>
                <span className="text-[10px] font-mono-num font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {activeCount} Active
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Real-time trigger alerts with in-app push notifications
              </p>
            </div>
          </div>

          <button
            id="close-price-alerts-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Toggle: Active Alerts vs Create Alert */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#090C14] border border-white/[0.06] mb-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Manage Alerts ({alerts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('create');
              if (!targetPriceInput && currentPair) {
                const s = (currentPair.price * 1.05).toFixed(currentPair.price >= 10 ? 2 : 4);
                setTargetPriceInput(s);
              }
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'create'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Set New Alert</span>
          </button>
        </div>

        {/* TAB 1: CREATE ALERT FORM */}
        {activeTab === 'create' && (
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5">
            {formSuccessMsg ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-white text-base">Alert Armed & Ready!</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">{formSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit} className="space-y-3">
                {/* Pair Selector */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Select Market Pair
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPairDropdownOpen(!isPairDropdownOpen)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#090C14] border border-white/10 hover:border-purple-500/50 transition-all text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <CoinIcon symbol={currentPair.base} size={24} />
                        <div>
                          <div className="font-bold text-xs text-white">
                            {currentPair.symbol}
                          </div>
                          <div className="text-[10px] text-slate-400">{currentPair.name}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="hidden xs:block pointer-events-none select-none">
                          <Sparkline
                            data={currentPair.sparkline}
                            isPositive={currentPair.change24h >= 0}
                            width={54}
                            height={22}
                          />
                        </div>
                        <div className="text-right">
                          <div className="font-mono-num font-bold text-xs text-white">
                            ${currentPair.price.toLocaleString()}
                          </div>
                          <div
                            className={`text-[10px] font-mono-num font-semibold ${
                              currentPair.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {currentPair.change24h >= 0 ? '+' : ''}
                            {currentPair.change24h}%
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </button>

                    {/* Pair Dropdown Menu */}
                    {isPairDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 z-30 bg-[#0F1424] border border-white/10 rounded-2xl p-2 shadow-2xl max-h-48 overflow-y-auto space-y-1">
                        {marketPairs.map((p) => (
                          <div
                            key={p.symbol}
                            onClick={() => handleSelectPair(p)}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.06] cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <CoinIcon symbol={p.base} size={20} />
                              <span className="font-bold text-xs text-white">{p.symbol}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="pointer-events-none select-none">
                                <Sparkline
                                  data={p.sparkline}
                                  isPositive={p.change24h >= 0}
                                  width={44}
                                  height={16}
                                />
                              </div>
                              <span className="font-mono-num text-xs text-slate-300">
                                ${p.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Target Price Input */}
                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="font-semibold text-slate-400">Target Price (USD)</span>
                    <span className="text-slate-400">
                      Current:{' '}
                      <span className="text-white font-mono-num font-bold">
                        ${currentPair.price.toLocaleString()}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center px-3 py-2.5 rounded-xl bg-[#090C14] border border-white/10 focus-within:border-purple-500/60 transition-all">
                    <span className="text-slate-400 font-mono-num font-bold text-sm mr-1.5">
                      $
                    </span>
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={targetPriceInput}
                      onChange={(e) => handlePriceInputChange(e.target.value)}
                      className="bg-transparent text-white font-mono-num text-base font-bold focus:outline-none w-full"
                    />
                    <span className="text-xs font-bold text-purple-400 whitespace-nowrap ml-2">
                      {currentPair.quote}
                    </span>
                  </div>

                  {/* Percentage Offset Preset Shortcuts */}
                  <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar py-0.5">
                    {[-10, -5, -2, 2, 5, 10].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleApplyPreset(pct)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono-num font-bold border transition-all whitespace-nowrap ${
                          pct > 0
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                        }`}
                      >
                        {pct > 0 ? `+${pct}%` : `${pct}%`}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleApplyHighLow('high')}
                      className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 whitespace-nowrap"
                    >
                      24h High
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyHighLow('low')}
                      className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 whitespace-nowrap"
                    >
                      24h Low
                    </button>
                  </div>
                </div>

                {/* Direction Trigger Condition */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Trigger Condition
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDirection('above')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                        direction === 'above'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                          : 'bg-[#090C14] border-white/[0.08] text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Rises Above (↗)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDirection('below')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                        direction === 'below'
                          ? 'bg-rose-500/15 border-rose-500 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                          : 'bg-[#090C14] border-white/[0.08] text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>Falls Below (↘)</span>
                    </button>
                  </div>
                </div>

                {/* Alert Frequency */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Alert Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFrequency('once')}
                      className={`p-2 rounded-xl text-xs font-medium border transition-all ${
                        frequency === 'once'
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                          : 'bg-[#090C14] border-white/[0.08] text-slate-400'
                      }`}
                    >
                      Only Once (Auto-Disable)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('recurring')}
                      className={`p-2 rounded-xl text-xs font-medium border transition-all ${
                        frequency === 'recurring'
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                          : 'bg-[#090C14] border-white/[0.08] text-slate-400'
                      }`}
                    >
                      Recurring (Every Cross)
                    </button>
                  </div>
                </div>

                {/* Optional Note */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Custom Note / Reason (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Resistance breakout, Take profit 1, DCA buy"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090C14] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                  />
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {['Take Profit', 'Buy the Dip', 'Breakout Level', 'Stop Loss Zone'].map(
                      (preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setNotes(preset)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]"
                        >
                          {preset}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  id="submit-create-alert-btn"
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white font-display font-bold text-sm shadow-[0_4px_20px_rgba(168,85,247,0.35)] active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <BellRing className="w-4 h-4" />
                  <span>Set Price Alert</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: MANAGE ACTIVE & TRIGGERED ALERTS */}
        {activeTab === 'list' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
            {/* Filter Bar & Search */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Filter pair or note..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-2.5 text-xs rounded-xl bg-[#090C14] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/40"
                />
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-1 bg-[#090C14] p-1 rounded-xl border border-white/[0.06] text-[10px]">
                {(['all', 'active', 'triggered'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-1 rounded-lg capitalize font-semibold transition-all ${
                      filterStatus === st
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'all'
                      ? `All (${alerts.length})`
                      : st === 'active'
                      ? `Active (${activeCount})`
                      : `Triggered (${triggeredCount})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredAlerts.length === 0 && (
              <div className="py-10 text-center space-y-2 border border-dashed border-white/10 rounded-2xl p-6 bg-[#090C14]/40">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
                  <Bell className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">No alerts found</h4>
                <p className="text-[11px] text-slate-400">
                  {filterStatus !== 'all'
                    ? `No ${filterStatus} alerts matching your filter.`
                    : 'You have not configured any price targets yet.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Your First Alert</span>
                </button>
              </div>
            )}

            {/* Alert Cards */}
            <div className="space-y-2.5">
              {filteredAlerts.map((alert) => {
                const pair =
                  marketPairs.find((p) => p.symbol === alert.symbol) || {
                    price: alert.currentPriceAtCreation,
                    change24h: 0,
                    sparkline: [
                      alert.currentPriceAtCreation * 0.99,
                      alert.currentPriceAtCreation * 1.01,
                    ],
                  };
                const livePrice = pair.price;
                const isAbove = alert.direction === 'above';
                const deltaPct =
                  ((livePrice - alert.targetPrice) / alert.targetPrice) * 100;
                const distancePct = Math.abs(deltaPct);

                // Progress to target
                const maxRange = Math.abs(alert.targetPrice - alert.currentPriceAtCreation);
                const currentDistance = Math.abs(livePrice - alert.targetPrice);
                const progressPct =
                  maxRange > 0
                    ? Math.max(0, Math.min(100, (1 - currentDistance / maxRange) * 100))
                    : 100;

                const isEditing = editingAlertId === alert.id;
                const isHighlighted = highlightedAlertId === alert.id;

                return (
                  <motion.div
                    key={alert.id}
                    id={`alert-card-${alert.id}`}
                    layout="position"
                    initial={isHighlighted ? { scale: 0.95, opacity: 0.85, y: -6 } : false}
                    animate={
                      isHighlighted
                        ? {
                            scale: [0.95, 1.025, 0.995, 1],
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 0.65,
                              ease: [0.16, 1, 0.3, 1],
                            },
                          }
                        : {
                            scale: 1,
                            opacity: 1,
                            y: 0,
                          }
                    }
                    className={`relative overflow-hidden p-3.5 rounded-2xl border transition-all duration-500 ${
                      isHighlighted
                        ? 'bg-gradient-to-r from-emerald-950/40 via-[#0B1122] to-[#0D1428] border-emerald-500/70 ring-2 ring-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,0.22)]'
                        : alert.status === 'triggered'
                        ? 'bg-[#101422] border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.08)]'
                        : alert.status === 'paused'
                        ? 'bg-[#080B12] border-white/[0.04] opacity-60'
                        : 'bg-[#090D1A] border-white/[0.08] hover:border-purple-500/30'
                    }`}
                  >
                    {/* Subtle Success Light Sweep Effect when row is activated or updated */}
                    {isHighlighted && (
                      <motion.div
                        initial={{ x: '-100%', opacity: 0.7 }}
                        animate={{ x: '220%', opacity: 0 }}
                        transition={{ duration: 0.85, ease: 'easeOut' }}
                        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent w-full z-10"
                      />
                    )}

                    {/* Top Row: Coin Info, Direction Badge, Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <CoinIcon symbol={alert.base} size={28} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white">
                              {alert.symbol}
                            </span>
                            <span
                              className={`text-[9px] font-mono-num font-bold px-1.5 py-0.2 rounded border flex items-center gap-0.5 ${
                                isAbove
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              }`}
                            >
                              {isAbove ? (
                                <TrendingUp className="w-2.5 h-2.5" />
                              ) : (
                                <TrendingDown className="w-2.5 h-2.5" />
                              )}
                              <span>{isAbove ? 'Rises Above' : 'Falls Below'}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="font-mono-num">
                              Live: ${livePrice.toLocaleString()}
                            </span>
                            <span>•</span>
                            <span className="font-mono-num">
                              {distancePct < 0.01
                                ? 'At Target!'
                                : `${distancePct.toFixed(2)}% away`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status and Frequency Pill or Success Morph Checkmark */}
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <AnimatePresence mode="wait">
                            {isHighlighted ? (
                              <motion.div
                                key={`success-pill-${alert.id}-${highlightReason}`}
                                initial={{ scale: 0.7, opacity: 0, y: -2 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, y: -2 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-[0_0_14px_rgba(16,185,129,0.35)] text-[10px] font-bold"
                              >
                                {/* Morphing checkmark SVG with stroke drawing animation */}
                                <svg
                                  className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <motion.circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="rgba(16, 185, 129, 0.2)"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                  />
                                  <motion.path
                                    d="M8 12.5L10.5 15L16 9"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.35, delay: 0.12, ease: 'easeOut' }}
                                  />
                                </svg>
                                <span>
                                  {highlightReason === 'created'
                                    ? 'Alert Set!'
                                    : 'Saved!'}
                                </span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key={`normal-status-${alert.id}-${alert.status}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-1"
                              >
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded capitalize ${
                                    alert.status === 'active'
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                      : alert.status === 'triggered'
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : 'bg-slate-800 text-slate-400 border border-white/10'
                                  }`}
                                >
                                  {alert.status}
                                </span>
                                <span className="text-[9px] text-slate-500 uppercase font-mono-num">
                                  {alert.frequency}
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <span className="text-[9px] text-slate-500 font-mono-num block mt-0.5">
                          {isHighlighted
                            ? highlightReason === 'created'
                              ? 'Active just now'
                              : 'Saved just now'
                            : alert.status === 'triggered' && alert.triggeredAt
                            ? `Triggered ${alert.triggeredAt}`
                            : alert.createdAt}
                        </span>
                      </div>
                    </div>

                    {/* Price & Target Row */}
                    {isEditing ? (
                      <div className="p-2.5 rounded-xl bg-[#0F1424] border border-purple-500/40 my-2 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-[10px] text-slate-400">Target Price:</label>
                          <input
                            type="number"
                            step="any"
                            value={editPriceInput}
                            onChange={(e) => setEditPriceInput(e.target.value)}
                            className="bg-[#090C14] border border-white/10 px-2 py-1 rounded text-xs font-mono-num text-white w-28 text-right font-bold focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-[10px] text-slate-400">Notes:</label>
                          <input
                            type="text"
                            value={editNotesInput}
                            onChange={(e) => setEditNotesInput(e.target.value)}
                            className="bg-[#090C14] border border-white/10 px-2 py-1 rounded text-xs text-white w-full focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingAlertId(null)}
                            className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(alert.id)}
                            className="text-[10px] px-2.5 py-1 rounded bg-purple-600 text-white font-bold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] my-1.5">
                        <div className="min-w-0 pr-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs text-slate-400 font-semibold">Target:</span>
                            {isHighlighted && highlightReason === 'updated' ? (
                              <motion.span
                                key={`target-price-${alert.id}-${alert.targetPrice}`}
                                initial={{ scale: 1.18, color: '#34d399' }}
                                animate={{ scale: 1, color: '#ffffff' }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="font-mono-num text-base font-extrabold tracking-tight inline-block"
                              >
                                ${alert.targetPrice.toLocaleString()}
                              </motion.span>
                            ) : (
                              <span className="font-mono-num text-base font-extrabold text-white tracking-tight">
                                ${alert.targetPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {alert.notes && (
                            <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20 inline-block mt-0.5 max-w-[150px] truncate">
                              📝 {alert.notes}
                            </span>
                          )}
                        </div>

                        {/* Mini Non-Interactive Sparkline Preview */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-right">
                            <div
                              className={`text-[10px] font-mono-num font-bold flex items-center justify-end ${
                                (pair.change24h ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {(pair.change24h ?? 0) >= 0 ? '+' : ''}
                              {(pair.change24h ?? 0).toFixed(2)}%
                            </div>
                            <div className="text-[9px] text-slate-400 font-medium">24h Trend</div>
                          </div>

                          <div
                            className="p-1 rounded-lg bg-[#06080F] border border-white/[0.06] flex items-center justify-center pointer-events-none select-none shadow-sm"
                            aria-hidden="true"
                            title="24h price trend with target level"
                          >
                            <Sparkline
                              data={
                                pair.sparkline && pair.sparkline.length > 1
                                  ? pair.sparkline
                                  : [livePrice * 0.99, livePrice * 1.01]
                              }
                              isPositive={(pair.change24h ?? 0) >= 0}
                              width={68}
                              height={26}
                              targetPrice={alert.targetPrice}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Proximity gauge bar */}
                    {alert.status === 'active' && (
                      <div className="my-1.5 space-y-1">
                        <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isAbove ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                            style={{ width: `${Math.max(5, progressPct)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Toolbar */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] mt-2">
                      <div className="flex items-center gap-1.5">
                        {/* Play/Pause Toggle */}
                        <button
                          type="button"
                          onClick={() => onToggleStatus(alert.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                            alert.status === 'active'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          }`}
                          title={alert.status === 'active' ? 'Pause alert' : 'Activate alert'}
                        >
                          {alert.status === 'active' ? (
                            <>
                              <Pause className="w-3 h-3" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" />
                              <span>Activate</span>
                            </>
                          )}
                        </button>

                        {/* Trade Pair Button */}
                        <button
                          type="button"
                          onClick={() => {
                            onTradePair(alert.symbol);
                            onClose();
                          }}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 active:scale-95 transition-all"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                          <span>Trade</span>
                        </button>

                        {/* Simulate Test Trigger */}
                        <button
                          type="button"
                          onClick={() => onSimulateTrigger(alert)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 active:scale-95 transition-all"
                          title="Trigger a test alert notification now"
                        >
                          <Zap className="w-3 h-3 text-cyan-400" />
                          <span>Test ⚡</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Edit Button */}
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(alert)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                            aria-label="Edit alert"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => onDeleteAlert(alert.id)}
                          className="p-1 rounded-lg text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          aria-label="Delete alert"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Interactive Market Movement Simulator */}
            {alerts.length > 0 && onSimulatePriceMove && (
              <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-purple-950/25 to-[#0F1424] border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[11px] font-bold text-white">
                      Market Price Simulator
                    </span>
                  </div>
                  <span className="text-[9px] text-purple-300 font-medium">
                    Test live detection
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 leading-snug">
                  Trigger market price movements to test automatic threshold detection and in-app toasts:
                </p>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => onSimulatePriceMove('BTC/USDT', 2.5)}
                    className="py-1.5 px-2 rounded-xl text-[10px] font-bold font-mono-num bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>BTC +2.5% Spike</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSimulatePriceMove('BTC/USDT', -2.5)}
                    className="py-1.5 px-2 rounded-xl text-[10px] font-bold font-mono-num bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    <TrendingDown className="w-3 h-3" />
                    <span>BTC -2.5% Dip</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
