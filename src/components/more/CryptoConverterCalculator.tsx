import React, { useState, useMemo } from 'react';
import {
  ArrowDownUp,
  Copy,
  Check,
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  Calculator,
  Sliders,
  DollarSign,
  ChevronDown,
  X,
} from 'lucide-react';
import { MarketPair } from '../../types';
import { INITIAL_MARKET_PAIRS } from '../../data/mockData';
import { CoinIcon } from '../common/CoinIcon';

export interface CurrencyItem {
  code: string;
  name: string;
  type: 'crypto' | 'fiat';
  symbol: string;
  usdRate: number; // Value of 1 Unit in USD
  change24h?: number;
  flagOrIcon?: string;
}

// Fiat currencies with baseline USD pegged rates
const FIAT_CURRENCIES: CurrencyItem[] = [
  { code: 'USD', name: 'United States Dollar', type: 'fiat', symbol: '$', usdRate: 1.0, flagOrIcon: '🇺🇸' },
  { code: 'EUR', name: 'Euro', type: 'fiat', symbol: '€', usdRate: 1.085, flagOrIcon: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', type: 'fiat', symbol: '£', usdRate: 1.295, flagOrIcon: '🇬🇧' },
  { code: 'NGN', name: 'Nigerian Naira', type: 'fiat', symbol: '₦', usdRate: 0.0006173, flagOrIcon: '🇳🇬' }, // ~1620 NGN per USD
  { code: 'KES', name: 'Kenyan Shilling', type: 'fiat', symbol: 'KSh', usdRate: 0.007722, flagOrIcon: '🇰🇪' }, // ~129.5 KES per USD
  { code: 'GHS', name: 'Ghanaian Cedi', type: 'fiat', symbol: 'GH₵', usdRate: 0.06329, flagOrIcon: '🇬🇭' }, // ~15.8 GHS per USD
  { code: 'ZAR', name: 'South African Rand', type: 'fiat', symbol: 'R', usdRate: 0.05494, flagOrIcon: '🇿🇦' }, // ~18.2 ZAR per USD
  { code: 'CAD', name: 'Canadian Dollar', type: 'fiat', symbol: 'C$', usdRate: 0.7246, flagOrIcon: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', type: 'fiat', symbol: 'A$', usdRate: 0.6578, flagOrIcon: '🇦🇺' },
  { code: 'JPY', name: 'Japanese Yen', type: 'fiat', symbol: '¥', usdRate: 0.006472, flagOrIcon: '🇯🇵' },
  { code: 'AED', name: 'UAE Dirham', type: 'fiat', symbol: 'AED', usdRate: 0.2723, flagOrIcon: '🇦🇪' },
  { code: 'INR', name: 'Indian Rupee', type: 'fiat', symbol: '₹', usdRate: 0.01192, flagOrIcon: '🇮🇳' },
  { code: 'BRL', name: 'Brazilian Real', type: 'fiat', symbol: 'R$', usdRate: 0.1802, flagOrIcon: '🇧🇷' },
];

interface CryptoConverterCalculatorProps {
  marketPairs?: MarketPair[];
  onNavigateTrade?: () => void;
  onNavigateP2P?: () => void;
  onOpenConvert?: () => void;
}

export const CryptoConverterCalculator: React.FC<CryptoConverterCalculatorProps> = ({
  marketPairs = INITIAL_MARKET_PAIRS,
  onNavigateTrade,
  onNavigateP2P,
  onOpenConvert,
}) => {
  // Amount entered in 'from' input
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [fromCurrencyCode, setFromCurrencyCode] = useState<string>('BTC');
  const [toCurrencyCode, setToCurrencyCode] = useState<string>('USD');

  // Currency selector modal state
  const [selectorTarget, setSelectorTarget] = useState<'from' | 'to' | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'crypto' | 'fiat'>('all');

  // Feedback states
  const [isCopied, setIsCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Build unified list of currencies with live rates from marketPairs
  const currencies: CurrencyItem[] = useMemo(() => {
    // Extract crypto from marketPairs
    const cryptoItems: CurrencyItem[] = [
      {
        code: 'USDT',
        name: 'Tether USD',
        type: 'crypto',
        symbol: '₮',
        usdRate: 1.0,
        change24h: 0.01,
      },
    ];

    marketPairs.forEach((pair) => {
      // If pair quotes in USDT, base price is roughly its USD price
      if (pair.quote === 'USDT' && !cryptoItems.some((c) => c.code === pair.base)) {
        cryptoItems.push({
          code: pair.base,
          name: pair.name,
          type: 'crypto',
          symbol: pair.base,
          usdRate: pair.price,
          change24h: pair.change24h,
        });
      }
    });

    return [...cryptoItems, ...FIAT_CURRENCIES];
  }, [marketPairs]);

  // Lookup selected currency items
  const fromCurrency = useMemo(
    () => currencies.find((c) => c.code === fromCurrencyCode) || currencies[0],
    [currencies, fromCurrencyCode]
  );

  const toCurrency = useMemo(
    () => currencies.find((c) => c.code === toCurrencyCode) || currencies[1],
    [currencies, toCurrencyCode]
  );

  // Conversion math:
  // 1 unit of fromCurrency = fromCurrency.usdRate USD
  // 1 USD = (1 / toCurrency.usdRate) units of toCurrency
  // calculatedTo = fromAmount * fromCurrency.usdRate / toCurrency.usdRate
  const numericFromAmount = parseFloat(fromAmount) || 0;
  const unitRate = fromCurrency.usdRate / toCurrency.usdRate;
  const inverseUnitRate = toCurrency.usdRate / fromCurrency.usdRate;
  const calculatedTo = numericFromAmount * unitRate;

  // Format display string
  const formatValue = (num: number, currencyType: 'crypto' | 'fiat') => {
    if (isNaN(num) || num === 0) return '0.00';
    if (currencyType === 'fiat') {
      if (num >= 1000) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    }
    // Crypto
    if (num < 0.000001) return num.toFixed(8);
    if (num < 0.001) return num.toFixed(6);
    if (num < 1) return num.toFixed(4);
    if (num >= 10000) {
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    }
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  };

  // Quick swap handler
  const handleSwap = () => {
    setFromCurrencyCode(toCurrencyCode);
    setToCurrencyCode(fromCurrencyCode);
  };

  // Copy result to clipboard
  const handleCopy = () => {
    const textToCopy = `${numericFromAmount} ${fromCurrency.code} = ${formatValue(
      calculatedTo,
      toCurrency.type
    )} ${toCurrency.code} (Rate: 1 ${fromCurrency.code} = ${formatValue(unitRate, toCurrency.type)} ${toCurrency.code})`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Simulate refresh effect
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Quick amount presets depending on 'from' currency type
  const presets = useMemo(() => {
    if (fromCurrency.type === 'fiat') {
      if (fromCurrency.code === 'NGN') return ['5,000', '20,000', '50,000', '100,000', '500,000'];
      return ['50', '100', '250', '500', '1,000', '5,000'];
    }
    if (fromCurrency.code === 'BTC') return ['0.01', '0.05', '0.1', '0.5', '1'];
    if (fromCurrency.code === 'ETH') return ['0.1', '0.5', '1', '2', '5'];
    if (fromCurrency.code === 'SOL') return ['1', '5', '10', '25', '50'];
    if (fromCurrency.code === 'USDT') return ['100', '250', '500', '1,000', '2,500'];
    return ['1', '10', '50', '100', '500'];
  }, [fromCurrency]);

  // Filtered currencies for modal selector
  const filteredCurrencies = useMemo(() => {
    const q = searchFilter.toLowerCase().trim();
    return currencies.filter((c) => {
      const matchesSearch =
        c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (activeTab === 'all') return true;
      return c.type === activeTab;
    });
  }, [currencies, searchFilter, activeTab]);

  // Featured live ticker pairs
  const quickPairs = [
    { from: 'BTC', to: 'USD', label: 'BTC / USD' },
    { from: 'ETH', to: 'USD', label: 'ETH / USD' },
    { from: 'SOL', to: 'USDT', label: 'SOL / USDT' },
    { from: 'USDT', to: 'NGN', label: 'USDT / NGN' },
    { from: 'OKN', to: 'USDT', label: 'OKN / USDT' },
    { from: 'EUR', to: 'BTC', label: 'EUR / BTC' },
  ];

  return (
    <div
      id="crypto-converter-calculator"
      className="rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200/90 dark:border-white/[0.08] p-5 sm:p-7 shadow-xs relative overflow-hidden transition-all"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/[0.04] dark:bg-purple-600/[0.07] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/[0.03] dark:bg-emerald-600/[0.05] rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 shadow-2xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Live Crypto & Fiat Converter
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Rates
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Calculate instant cross-currency values for spot trading, P2P fiat arbitrage, and wallet swaps.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            id="converter-refresh-btn"
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.06] dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 transition-colors"
            title="Refresh Live Rates"
            aria-label="Refresh Live Rates"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-purple-600' : ''}`} />
          </button>
          <button
            type="button"
            id="converter-copy-btn"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.06] dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 text-xs font-bold transition-colors shadow-2xs"
            title="Copy Calculation Result"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Calculator Body */}
      <div className="relative z-10 pt-5 space-y-4">
        {/* Converter Inputs Dual Block */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] items-center gap-3">
          {/* FROM Input Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E1322] border border-slate-200/80 dark:border-white/[0.08] focus-within:border-purple-500/80 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
              <span>You Convert (From)</span>
              <span className="font-mono text-[11px]">
                1 {fromCurrency.code} ≈ ${fromCurrency.usdRate.toLocaleString('en-US', { maximumFractionDigits: 4 })} USD
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <input
                id="converter-from-input"
                type="number"
                step="any"
                min="0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />

              {/* Currency Selector Button */}
              <button
                type="button"
                id="converter-from-currency-select"
                onClick={() => {
                  setSelectorTarget('from');
                  setSearchFilter('');
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#151C2C] hover:bg-slate-100 dark:hover:bg-[#1A2338] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs shrink-0 shadow-2xs transition-colors"
              >
                {fromCurrency.type === 'crypto' ? (
                  <CoinIcon symbol={fromCurrency.code} size={22} />
                ) : (
                  <span className="text-base leading-none">{fromCurrency.flagOrIcon}</span>
                )}
                <span className="font-bold">{fromCurrency.code}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Swap Trigger Button */}
          <div className="flex justify-center -my-1 lg:my-0">
            <button
              type="button"
              id="converter-swap-btn"
              onClick={handleSwap}
              className="w-11 h-11 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ring-4 ring-white dark:ring-[#0B0F19]"
              title="Invert / Swap Currencies"
              aria-label="Invert / Swap Currencies"
            >
              <ArrowDownUp className="w-4 h-4" />
            </button>
          </div>

          {/* TO Result Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E1322] border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
              <span>You Receive (Calculated)</span>
              <span className="font-mono text-[11px]">
                1 {toCurrency.code} ≈ ${toCurrency.usdRate.toLocaleString('en-US', { maximumFractionDigits: 4 })} USD
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="w-full text-xl sm:text-2xl font-black font-mono text-purple-600 dark:text-purple-400 truncate select-all">
                {formatValue(calculatedTo, toCurrency.type)}
              </div>

              {/* Currency Selector Button */}
              <button
                type="button"
                id="converter-to-currency-select"
                onClick={() => {
                  setSelectorTarget('to');
                  setSearchFilter('');
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#151C2C] hover:bg-slate-100 dark:hover:bg-[#1A2338] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs shrink-0 shadow-2xs transition-colors"
              >
                {toCurrency.type === 'crypto' ? (
                  <CoinIcon symbol={toCurrency.code} size={22} />
                ) : (
                  <span className="text-base leading-none">{toCurrency.flagOrIcon}</span>
                )}
                <span className="font-bold">{toCurrency.code}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Amount Presets Strip */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1">
            Quick Values:
          </span>
          {presets.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setFromAmount(val.replace(/,/g, ''))}
              className="px-2.5 py-1 rounded-xl text-xs font-mono font-semibold bg-slate-100 hover:bg-purple-100 dark:bg-white/[0.05] dark:hover:bg-purple-900/30 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 border border-slate-200/80 dark:border-white/10 transition-colors"
            >
              {val} {fromCurrency.code}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setFromAmount('1')}
            className="px-2.5 py-1 rounded-xl text-xs font-mono font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Reset (1)
          </button>
        </div>

        {/* Rate Exchange Formula & Dynamic Details Bar */}
        <div className="p-3.5 rounded-2xl bg-purple-500/[0.06] dark:bg-purple-950/25 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <div className="space-y-0.5">
              <div className="font-mono font-bold text-slate-900 dark:text-white">
                1 {fromCurrency.code} = {formatValue(unitRate, toCurrency.type)} {toCurrency.code}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Inverse: 1 {toCurrency.code} = {formatValue(inverseUnitRate, fromCurrency.type)} {fromCurrency.code}
              </div>
            </div>
          </div>

          {/* Direct Trading / P2P Action Shortcut */}
          <div className="flex items-center gap-2 shrink-0">
            {fromCurrency.type === 'fiat' || toCurrency.type === 'fiat' ? (
              onNavigateP2P && (
                <button
                  type="button"
                  onClick={onNavigateP2P}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <span>Trade on P2P</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )
            ) : (
              <div className="flex items-center gap-1.5">
                {onOpenConvert && (
                  <button
                    type="button"
                    onClick={onOpenConvert}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Instant Swap</span>
                  </button>
                )}
                {onNavigateTrade && (
                  <button
                    type="button"
                    onClick={onNavigateTrade}
                    className="px-3 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-white/[0.08] dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Spot Market</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Featured Live Converter Quick Pairs Strip */}
        <div className="pt-2">
          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Popular Cross-Currency Pairs
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {quickPairs.map((pair) => (
              <button
                key={pair.label}
                type="button"
                onClick={() => {
                  setFromCurrencyCode(pair.from);
                  setToCurrencyCode(pair.to);
                }}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  fromCurrencyCode === pair.from && toCurrencyCode === pair.to
                    ? 'bg-purple-500/15 border-purple-500/40 text-purple-700 dark:text-purple-300'
                    : 'bg-slate-50 dark:bg-[#0E1322] border-slate-200/80 dark:border-white/[0.06] hover:border-purple-500/30 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-mono font-bold text-xs">{pair.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Click to Calculate
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Currency Picker Modal */}
      {selectorTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0E141B] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.08]">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Select {selectorTarget === 'from' ? 'Source (From)' : 'Target (To)'} Currency
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose from live cryptocurrencies or major world fiat currencies
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectorTarget(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search by name, symbol (e.g. BTC, USD, Naira, Euro)..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#141B24] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                autoFocus
              />
            </div>

            {/* Tabs: All / Crypto / Fiat */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#141B24]">
              {(['all', 'crypto', 'fiat'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Currencies List */}
            <div className="overflow-y-auto no-scrollbar flex-1 space-y-1 pr-1 max-h-[360px]">
              {filteredCurrencies.map((c) => {
                const isSelected =
                  selectorTarget === 'from'
                    ? fromCurrencyCode === c.code
                    : toCurrencyCode === c.code;

                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      if (selectorTarget === 'from') {
                        setFromCurrencyCode(c.code);
                      } else {
                        setToCurrencyCode(c.code);
                      }
                      setSelectorTarget(null);
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between gap-3 text-left transition-all ${
                      isSelected
                        ? 'bg-purple-500/15 border border-purple-500/40 text-purple-700 dark:text-purple-300'
                        : 'hover:bg-slate-50 dark:hover:bg-white/[0.04] text-slate-900 dark:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {c.type === 'crypto' ? (
                        <CoinIcon symbol={c.code} size={32} />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-lg">
                          {c.flagOrIcon}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>{c.name}</span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded-sm bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                            {c.code}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {c.type === 'crypto' ? 'Cryptocurrency' : 'Fiat Currency'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-xs">
                        ${c.usdRate.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                      </div>
                      {c.change24h !== undefined && (
                        <div
                          className={`text-[10px] font-mono font-semibold flex items-center justify-end gap-0.5 ${
                            c.change24h >= 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {c.change24h >= 0 ? '+' : ''}
                          {c.change24h}%
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              {filteredCurrencies.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                  <p>No currencies match "{searchFilter}"</p>
                  <p className="text-[11px] text-slate-500">Try searching for BTC, USD, EUR, etc.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
