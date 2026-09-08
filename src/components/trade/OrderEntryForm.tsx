import React, { useState, useEffect } from 'react';
import { MarketPair, OpenOrder } from '../../types';
import {
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Percent,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { playBiometricChime } from '../../utils/audio';

interface OrderEntryFormProps {
  pair: MarketPair;
  availableUsdt: number;
  availableCrypto: number;
  externalPrice: number | null;
  onOrderPlaced: (order: OpenOrder, msg: string) => void;
  onOpenDeposit: () => void;
  className?: string;
}

export const OrderEntryForm: React.FC<OrderEntryFormProps> = ({
  pair,
  availableUsdt,
  availableCrypto,
  externalPrice,
  onOrderPlaced,
  onOpenDeposit,
  className = '',
}) => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market' | 'stop_limit'>('limit');
  const [priceInput, setPriceInput] = useState(pair.price.toString());
  const [triggerPriceInput, setTriggerPriceInput] = useState((pair.price * 0.98).toFixed(2));
  const [amountInput, setAmountInput] = useState('');
  const [percentage, setPercentage] = useState<number>(0);
  const [showTPSL, setShowTPSL] = useState(false);
  const [tpPrice, setTpPrice] = useState('');
  const [slPrice, setSlPrice] = useState('');
  const [postOnly, setPostOnly] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  // Sync external price when clicked in the orderbook
  useEffect(() => {
    if (externalPrice !== null && externalPrice > 0) {
      setPriceInput(externalPrice.toString());
    }
  }, [externalPrice]);

  // Sync if pair changes
  useEffect(() => {
    setPriceInput(pair.price.toString());
    setTriggerPriceInput((pair.price * 0.98).toFixed(2));
    setAmountInput('');
    setPercentage(0);
  }, [pair.symbol, pair.price]);

  const numericPrice = orderType === 'market' ? pair.price : parseFloat(priceInput) || 0;
  const numericAmount = parseFloat(amountInput) || 0;
  const totalValue = numericPrice * numericAmount;

  // Fee calculation (0.08% maker / 0.10% taker)
  const feeRate = orderType === 'market' ? 0.001 : 0.0008;
  const estFee = totalValue * feeRate;

  // Balance
  const maxAvailable = side === 'buy' ? availableUsdt : availableCrypto;

  // Step price +/-
  const handleStepPrice = (direction: 'up' | 'down') => {
    const step = numericPrice >= 1000 ? 5 : numericPrice >= 10 ? 0.5 : 0.01;
    const next = direction === 'up' ? numericPrice + step : Math.max(0.0001, numericPrice - step);
    setPriceInput(next >= 1 ? next.toFixed(2) : next.toFixed(4));
  };

  // Percentage slider & buttons
  const handlePercentageSelect = (pct: number) => {
    setPercentage(pct);
    if (side === 'buy') {
      const budget = availableUsdt * (pct / 100);
      if (numericPrice > 0) {
        const amt = budget / numericPrice;
        setAmountInput(amt < 1 ? amt.toFixed(4) : amt.toFixed(2));
      }
    } else {
      const amt = availableCrypto * (pct / 100);
      setAmountInput(amt < 1 ? amt.toFixed(4) : amt.toFixed(2));
    }
  };

  // Submit Order
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (numericAmount <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid order amount.' });
      return;
    }

    if (side === 'buy' && totalValue > availableUsdt) {
      setFeedback({
        type: 'error',
        message: `Insufficient USDT balance. Needed: $${totalValue.toFixed(2)}, Available: $${availableUsdt.toFixed(2)}`,
      });
      return;
    }

    if (side === 'sell' && numericAmount > availableCrypto) {
      setFeedback({
        type: 'error',
        message: `Insufficient ${pair.base} balance. Needed: ${numericAmount}, Available: ${availableCrypto.toFixed(4)}`,
      });
      return;
    }

    // Play subtle audio confirmation
    playBiometricChime(true);

    const newOrder: OpenOrder = {
      id: `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      symbol: pair.symbol,
      side,
      type: orderType,
      price: numericPrice,
      amount: numericAmount,
      filled: orderType === 'market' ? numericAmount : 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: orderType === 'market' ? 'completed' : 'open',
    };

    const successMsg =
      orderType === 'market'
        ? `Filled: ${numericAmount} ${pair.base} at market avg $${numericPrice.toFixed(2)}`
        : `Limit ${side.toUpperCase()} placed: ${numericAmount} ${pair.base} @ $${numericPrice.toFixed(2)}`;

    onOrderPlaced(newOrder, successMsg);
    setFeedback({ type: 'success', message: successMsg });

    setAmountInput('');
    setPercentage(0);

    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  return (
    <div
      id="order-entry-form"
      className={`rounded-2xl bg-[#090C14] border border-white/[0.08] p-3.5 shadow-xl backdrop-blur-md ${className}`}
    >
      {/* Side Toggle: Buy vs Sell */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#06080E] border border-white/[0.06] mb-3">
        <button
          type="button"
          onClick={() => {
            setSide('buy');
            setAmountInput('');
            setPercentage(0);
          }}
          className={`py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            side === 'buy'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold shadow-[0_0_16px_rgba(16,185,129,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Buy {pair.base}
        </button>
        <button
          type="button"
          onClick={() => {
            setSide('sell');
            setAmountInput('');
            setPercentage(0);
          }}
          className={`py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            side === 'sell'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold shadow-[0_0_16px_rgba(244,63,94,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Sell {pair.base}
        </button>
      </div>

      {/* Order Type Chips */}
      <div className="flex items-center gap-1.5 mb-3 text-xs">
        {(['limit', 'market', 'stop_limit'] as const).map((ot) => (
          <button
            key={ot}
            type="button"
            onClick={() => setOrderType(ot)}
            className={`px-2.5 py-1 rounded-lg capitalize font-medium text-[11px] transition-all ${
              orderType === ot
                ? 'bg-purple-600/35 text-purple-200 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                : 'bg-white/[0.03] text-slate-400 hover:text-white'
            }`}
          >
            {ot.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Available Balance Strip */}
      <div className="flex items-center justify-between text-[11px] font-mono-num mb-2 text-slate-400 px-1">
        <span>Available:</span>
        <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
          {side === 'buy' ? (
            <>
              <span>{availableUsdt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT</span>
              <button
                type="button"
                onClick={onOpenDeposit}
                className="w-4 h-4 rounded-full bg-purple-500/25 text-purple-300 hover:bg-purple-500/40 flex items-center justify-center transition-colors"
                title="Deposit USDT"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </>
          ) : (
            <span>{availableCrypto.toFixed(4)} {pair.base}</span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Trigger Price (Stop Limit only) */}
        {orderType === 'stop_limit' && (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#06080E] border border-white/10 focus-within:border-purple-500/50">
            <span className="text-xs text-slate-400 font-medium">Trigger Price</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                value={triggerPriceInput}
                onChange={(e) => setTriggerPriceInput(e.target.value)}
                className="bg-transparent text-right font-mono-num text-xs font-bold text-white focus:outline-none w-28"
                placeholder="0.00"
              />
              <span className="text-[11px] font-semibold text-slate-400">USDT</span>
            </div>
          </div>
        )}

        {/* Price Input with +/- stepper */}
        {orderType !== 'market' ? (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#06080E] border border-white/10 focus-within:border-purple-500/50">
            <span className="text-xs text-slate-400 font-medium">Order Price</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleStepPrice('down')}
                className="p-1 rounded bg-white/[0.06] hover:bg-white/10 text-slate-300 transition-colors"
                title="Decrease price"
              >
                <Minus className="w-3 h-3" />
              </button>
              <input
                type="number"
                step="any"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="bg-transparent text-right font-mono-num text-xs font-bold text-white focus:outline-none w-24"
                placeholder="0.00"
              />
              <span className="text-[11px] font-semibold text-slate-400">USDT</span>
              <button
                type="button"
                onClick={() => handleStepPrice('up')}
                className="p-1 rounded bg-white/[0.06] hover:bg-white/10 text-slate-300 transition-colors"
                title="Increase price"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#06080E] border border-white/10 text-xs">
            <span className="text-slate-400">Order Price</span>
            <span className="font-semibold text-emerald-400 font-mono-num flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Best Market Execution
            </span>
          </div>
        )}

        {/* Amount Input */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#06080E] border border-white/10 focus-within:border-purple-500/50">
          <span className="text-xs text-slate-400 font-medium">Amount</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              value={amountInput}
              onChange={(e) => {
                setAmountInput(e.target.value);
                setPercentage(0);
              }}
              className="bg-transparent text-right font-mono-num text-xs font-bold text-white focus:outline-none w-28"
              placeholder="0.00"
            />
            <span className="text-[11px] font-semibold text-slate-400">{pair.base}</span>
          </div>
        </div>

        {/* Percentage Slider */}
        <div className="pt-1 px-1">
          <div className="relative mb-1 flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={percentage}
              onChange={(e) => handlePercentageSelect(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
          {/* Percentage Quick Chips */}
          <div className="grid grid-cols-4 gap-1.5">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentageSelect(pct)}
                className={`py-1 rounded-lg text-[10px] font-mono-num font-bold transition-all ${
                  percentage === pct
                    ? 'bg-purple-600/40 text-purple-200 border border-purple-500/40'
                    : 'bg-[#101422] border border-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                {pct === 100 ? 'MAX' : `${pct}%`}
              </button>
            ))}
          </div>
        </div>

        {/* TP/SL Expander */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowTPSL(!showTPSL)}
            className="flex items-center justify-between w-full text-[11px] text-slate-400 hover:text-slate-200 py-1"
          >
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>TP / SL (Take Profit & Stop Loss)</span>
            </span>
            {showTPSL ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showTPSL && (
            <div className="grid grid-cols-2 gap-2 mt-1.5 p-2 rounded-xl bg-[#06080E] border border-white/[0.06]">
              <div>
                <label className="text-[10px] text-emerald-400 font-semibold block mb-0.5">Take Profit (USDT)</label>
                <input
                  type="number"
                  placeholder={(numericPrice * 1.05).toFixed(2)}
                  value={tpPrice}
                  onChange={(e) => setTpPrice(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-lg px-2 py-1 text-[11px] font-mono-num text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-rose-400 font-semibold block mb-0.5">Stop Loss (USDT)</label>
                <input
                  type="number"
                  placeholder={(numericPrice * 0.95).toFixed(2)}
                  value={slPrice}
                  onChange={(e) => setSlPrice(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-lg px-2 py-1 text-[11px] font-mono-num text-white focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Order Breakdown / Total Strip */}
        <div className="p-2.5 rounded-xl bg-[#06080E] border border-white/[0.06] text-xs font-mono-num space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Order Value</span>
            <span className="font-bold text-white">
              {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Est. Fee (VIP0)</span>
            <span>{estFee.toFixed(3)} USDT (0.08%)</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id={`btn-place-spot-order`}
          className={`w-full py-3 rounded-xl font-display font-bold text-sm transition-all active:scale-[0.98] shadow-lg ${
            side === 'buy'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:brightness-105'
              : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_4px_20px_rgba(244,63,94,0.35)] hover:brightness-105'
          }`}
        >
          {side === 'buy' ? `Buy ${pair.base}` : `Sell ${pair.base}`}
        </button>
      </form>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`mt-2.5 p-2 rounded-xl border flex items-center gap-2 text-xs animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="flex-1">{feedback.message}</span>
        </div>
      )}
    </div>
  );
};
