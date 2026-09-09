import React, { useState } from 'react';
import {
  Filter,
  ChevronDown,
  X,
  CheckCircle2,
  ArrowUpDown,
  Search,
  CreditCard,
  Globe,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import {
  FIAT_CURRENCIES,
  CRYPTO_ASSETS,
  PAYMENT_METHODS,
  getCurrencySymbol,
} from './p2pHelpers';

export type MarketSortOption =
  | 'price_asc'
  | 'price_desc'
  | 'completion_rate'
  | 'trade_volume'
  | 'fastest_release';

export type P2PSortOption = MarketSortOption;

interface P2PFilterSortBarProps {
  tradeSide: 'buy' | 'sell';
  onSelectTradeSide: (side: 'buy' | 'sell') => void;
  selectedCrypto: string;
  onSelectCrypto: (crypto: string) => void;
  selectedFiat: string;
  onSelectFiat: (fiat: string) => void;
  selectedPayment: string;
  onSelectPayment: (method: string) => void;
  filterAmount: string;
  onChangeFilterAmount: (val: string) => void;
  sortBy: MarketSortOption;
  onChangeSortBy: (sort: MarketSortOption) => void;
  verifiedOnly: boolean;
  onToggleVerifiedOnly: () => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
}

export const P2PFilterSortBar: React.FC<P2PFilterSortBarProps> = ({
  tradeSide,
  onSelectTradeSide,
  selectedCrypto,
  onSelectCrypto,
  selectedFiat,
  onSelectFiat,
  selectedPayment,
  onSelectPayment,
  filterAmount,
  onChangeFilterAmount,
  sortBy,
  onChangeSortBy,
  verifiedOnly,
  onToggleVerifiedOnly,
  onResetFilters,
  activeFiltersCount,
}) => {
  const [showFiatMenu, setShowFiatMenu] = useState(false);
  const [showPaymentMenu, setShowPaymentMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const selectedFiatObj = FIAT_CURRENCIES.find((f) => f.code === selectedFiat);

  const sortLabels: Record<MarketSortOption, string> = {
    price_asc: 'Price: Lowest First',
    price_desc: 'Price: Highest First',
    completion_rate: 'Highest Completion %',
    trade_volume: 'Highest Trade Volume',
    fastest_release: 'Fastest Release (<5m)',
  };

  return (
    <div id="p2p-market-filters-container" className="space-y-2.5">
      {/* Primary Row: Buy/Sell Switch, Crypto Pills & Primary Quick Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.07] shadow-2xs">
        {/* Left Section: Buy/Sell Mode & Crypto Asset Selector */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Buy / Sell switch */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-200/80 dark:bg-[#0E121E] border border-slate-200 dark:border-white/[0.08] w-48 sm:w-56 shrink-0">
            <button
              id="p2p-filter-toggle-buy"
              onClick={() => onSelectTradeSide('buy')}
              className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
                tradeSide === 'buy'
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_14px_rgba(16,185,129,0.35)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Buy Crypto
            </button>
            <button
              id="p2p-filter-toggle-sell"
              onClick={() => onSelectTradeSide('sell')}
              className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
                tradeSide === 'sell'
                  ? 'bg-rose-500 text-white shadow-[0_0_14px_rgba(244,63,94,0.35)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sell Crypto
            </button>
          </div>

          {/* Crypto Asset Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {CRYPTO_ASSETS.map((sym) => (
              <button
                key={sym}
                onClick={() => onSelectCrypto(sym)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedCrypto === sym
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#111624] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/40'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section: Fiat Currency, Payment Method, Sort & Verified Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar py-1">
          {/* Fiat Currency Selector Dropdown */}
          <div className="relative">
            <button
              id="p2p-currency-selector-btn"
              onClick={() => {
                setShowFiatMenu(!showFiatMenu);
                setShowPaymentMenu(false);
                setShowSortMenu(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111624] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white shadow-2xs hover:border-purple-400 transition-colors shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>
                {selectedFiat === 'ALL'
                  ? 'All Currencies'
                  : `${selectedFiatObj?.flag || ''} ${selectedFiat}`}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showFiatMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowFiatMenu(false)}
                />
                <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 z-50 w-52 p-2 rounded-2xl bg-white dark:bg-[#111625] border border-slate-200 dark:border-white/10 shadow-xl space-y-1 animate-fade-in">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Select Fiat Currency
                  </div>
                  <button
                    onClick={() => {
                      onSelectFiat('ALL');
                      setShowFiatMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedFiat === 'ALL'
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>All Fiat Currencies</span>
                    {selectedFiat === 'ALL' && <span className="text-purple-500">✓</span>}
                  </button>
                  {FIAT_CURRENCIES.map((f) => (
                    <button
                      key={f.code}
                      onClick={() => {
                        onSelectFiat(f.code);
                        setShowFiatMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedFiat === f.code
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{f.flag}</span>
                        <span>{f.code}</span>
                        <span className="text-[10px] text-slate-400">({f.name})</span>
                      </div>
                      {selectedFiat === f.code && (
                        <span className="text-purple-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Payment Method Selector Dropdown */}
          <div className="relative">
            <button
              id="p2p-payment-method-btn"
              onClick={() => {
                setShowPaymentMenu(!showPaymentMenu);
                setShowFiatMenu(false);
                setShowSortMenu(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors shrink-0 ${
                selectedPayment !== 'All'
                  ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-500/40 shadow-2xs'
                  : 'bg-white dark:bg-[#111624] text-slate-900 dark:text-white border-slate-200 dark:border-white/10 shadow-2xs hover:border-purple-400'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>
                {selectedPayment === 'All' ? 'All Payments' : selectedPayment}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showPaymentMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowPaymentMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 z-50 w-56 p-2 rounded-2xl bg-white dark:bg-[#111625] border border-slate-200 dark:border-white/10 shadow-xl space-y-1 animate-fade-in max-h-72 overflow-y-auto">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Payment Method
                  </div>
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method}
                      onClick={() => {
                        onSelectPayment(method);
                        setShowPaymentMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedPayment === method
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <span>{method}</span>
                      {selectedPayment === method && (
                        <span className="text-purple-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <button
              id="p2p-sort-by-btn"
              onClick={() => {
                setShowSortMenu(!showSortMenu);
                setShowFiatMenu(false);
                setShowPaymentMenu(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111624] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white shadow-2xs hover:border-purple-400 transition-colors shrink-0"
              title="Sort merchant listings"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline text-slate-500 dark:text-slate-400">Sort:</span>
              <span>{sortLabels[sortBy]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showSortMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSortMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 z-50 w-56 p-2 rounded-2xl bg-white dark:bg-[#111625] border border-slate-200 dark:border-white/10 shadow-xl space-y-1 animate-fade-in">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sort Merchants By
                  </div>
                  {(Object.keys(sortLabels) as MarketSortOption[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        onChangeSortBy(key);
                        setShowSortMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        sortBy === key
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <span>{sortLabels[key]}</span>
                      {sortBy === key && <span className="text-purple-500">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Toggle More Filters (Amount & Advanced) */}
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`p-1.5 rounded-xl border transition-colors shrink-0 ${
              showMoreFilters || filterAmount
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-white dark:bg-[#111624] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
            }`}
            title="Filter by amount & limits"
            aria-label="Filter by amount and limits"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Advanced Filters Row: Amount Search & Quick Verified Toggle */}
      {(showMoreFilters || filterAmount) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100/80 dark:bg-[#0B0E17] border border-slate-200 dark:border-white/[0.06] animate-fade-in text-xs">
          {/* Amount input filter */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">
              Target Amount ({selectedFiat === 'ALL' ? 'Fiat' : getCurrencySymbol(selectedFiat)}):
            </span>
            <div className="relative flex-1">
              <input
                type="number"
                placeholder={selectedFiat === 'ALL' ? 'e.g. 50000' : `Amount in ${selectedFiat}`}
                value={filterAmount}
                onChange={(e) => onChangeFilterAmount(e.target.value)}
                className="w-full px-3 py-1.5 pr-7 rounded-xl bg-white dark:bg-[#131826] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono-num placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
              />
              {filterAmount && (
                <button
                  onClick={() => onChangeFilterAmount('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Filter Verified Merchants Only Toggle */}
            <button
              id="p2p-filter-verified-only-btn"
              onClick={onToggleVerifiedOnly}
              className={`px-3 py-1.5 rounded-xl font-semibold border flex items-center gap-1.5 transition-all shrink-0 ${
                verifiedOnly
                  ? 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-400/50 shadow-2xs'
                  : 'bg-white dark:bg-[#111624] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  verifiedOnly
                    ? 'text-cyan-600 dark:text-cyan-400 fill-cyan-400/20'
                    : 'text-slate-400'
                }`}
              />
              <span>Verified Merchants Only</span>
              {verifiedOnly && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              )}
            </button>

            {/* Reset Filters button if active */}
            {activeFiltersCount > 0 && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 transition-colors font-medium"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Filter Chips Summary */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] pt-0.5">
          <span className="text-slate-400 font-medium">Active Filters:</span>
          {selectedFiat !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-semibold">
              Currency: {selectedFiat}
              <button onClick={() => onSelectFiat('ALL')} className="hover:text-purple-900">
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
          {selectedPayment !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-semibold">
              Payment: {selectedPayment}
              <button onClick={() => onSelectPayment('All')} className="hover:text-purple-900">
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
          {filterAmount && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-semibold">
              Amount: {filterAmount}
              <button onClick={() => onChangeFilterAmount('')} className="hover:text-purple-900">
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
          {verifiedOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 font-semibold">
              Verified Only
              <button onClick={onToggleVerifiedOnly} className="hover:text-cyan-900">
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
          <button
            onClick={onResetFilters}
            className="text-purple-600 dark:text-purple-400 hover:underline font-semibold ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
