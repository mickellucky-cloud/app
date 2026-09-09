import React, { useState } from 'react';
import {
  Filter,
  ChevronDown,
  X,
  ArrowUpDown,
  Search,
  CreditCard,
  Globe,
  RotateCcw,
} from 'lucide-react';
import {
  FIAT_CURRENCIES,
  PAYMENT_METHODS,
} from './p2pHelpers';

export type OrderSortOption =
  | 'date_desc'
  | 'date_asc'
  | 'amount_desc'
  | 'amount_asc'
  | 'crypto_desc';

export type OrderStatusFilter =
  | 'all'
  | 'pending'
  | 'payment_submitted'
  | 'completed'
  | 'cancelled'
  | 'disputed';

interface P2POrdersFilterBarProps {
  statusFilter: OrderStatusFilter;
  onChangeStatusFilter: (status: OrderStatusFilter) => void;
  typeFilter: 'all' | 'buy' | 'sell';
  onChangeTypeFilter: (type: 'all' | 'buy' | 'sell') => void;
  currencyFilter: string;
  onChangeCurrencyFilter: (curr: string) => void;
  paymentFilter: string;
  onChangePaymentFilter: (pm: string) => void;
  searchQuery: string;
  onChangeSearchQuery: (q: string) => void;
  sortBy: OrderSortOption;
  onChangeSortBy: (sort: OrderSortOption) => void;
  totalOrdersCount: number;
  filteredOrdersCount: number;
  onResetFilters: () => void;
}

export const P2POrdersFilterBar: React.FC<P2POrdersFilterBarProps> = ({
  statusFilter,
  onChangeStatusFilter,
  typeFilter,
  onChangeTypeFilter,
  currencyFilter,
  onChangeCurrencyFilter,
  paymentFilter,
  onChangePaymentFilter,
  searchQuery,
  onChangeSearchQuery,
  sortBy,
  onChangeSortBy,
  totalOrdersCount,
  filteredOrdersCount,
  onResetFilters,
}) => {
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showPaymentMenu, setShowPaymentMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortLabels: Record<OrderSortOption, string> = {
    date_desc: 'Newest First',
    date_asc: 'Oldest First',
    amount_desc: 'Fiat Amount (High → Low)',
    amount_asc: 'Fiat Amount (Low → High)',
    crypto_desc: 'Crypto Amount (High → Low)',
  };

  const hasActiveFilters =
    statusFilter !== 'all' ||
    typeFilter !== 'all' ||
    currencyFilter !== 'ALL' ||
    paymentFilter !== 'All' ||
    Boolean(searchQuery.trim()) ||
    sortBy !== 'date_desc';

  return (
    <div id="p2p-orders-filter-system" className="space-y-3">
      {/* Primary Row: Status Tabs & Order Type Switcher */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {(
            [
              { id: 'all', label: 'All Orders' },
              { id: 'pending', label: 'Pending Payment' },
              { id: 'payment_submitted', label: 'Payment Sent' },
              { id: 'completed', label: 'Completed' },
              { id: 'disputed', label: 'Disputed' },
              { id: 'cancelled', label: 'Cancelled' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeStatusFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === item.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#111624] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Order Type Pill (All / Buy / Sell) */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#0E121E] border border-slate-200 dark:border-white/[0.08] w-52 shrink-0 self-end md:self-auto">
          {(['all', 'buy', 'sell'] as const).map((t) => (
            <button
              key={t}
              onClick={() => onChangeTypeFilter(t)}
              className={`py-1 text-xs font-bold rounded-lg uppercase transition-all ${
                typeFilter === t
                  ? t === 'buy'
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : t === 'sell'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-white dark:bg-[#1E2538] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Row: Payment Method, Currency Type, Search & Sort Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#0D111A] border border-slate-200 dark:border-white/[0.07] text-xs shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* Search box for order ID or merchant */}
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Order # or Trader..."
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white dark:bg-[#111624] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onChangeSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Payment Method Filter Dropdown */}
          <div className="relative">
            <button
              id="orders-payment-filter-btn"
              onClick={() => {
                setShowPaymentMenu(!showPaymentMenu);
                setShowCurrencyMenu(false);
                setShowSortMenu(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold transition-colors shrink-0 ${
                paymentFilter !== 'All'
                  ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-500/40 shadow-2xs'
                  : 'bg-white dark:bg-[#111624] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-purple-400'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Payment: {paymentFilter}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showPaymentMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowPaymentMenu(false)}
                />
                <div className="absolute left-0 top-full mt-1.5 z-50 w-52 p-2 rounded-2xl bg-white dark:bg-[#111625] border border-slate-200 dark:border-white/10 shadow-xl space-y-1 animate-fade-in max-h-64 overflow-y-auto">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Filter by Payment Method
                  </div>
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      key={pm}
                      onClick={() => {
                        onChangePaymentFilter(pm);
                        setShowPaymentMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        paymentFilter === pm
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <span>{pm}</span>
                      {paymentFilter === pm && <span className="text-purple-500">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Currency Type Filter Dropdown */}
          <div className="relative">
            <button
              id="orders-currency-filter-btn"
              onClick={() => {
                setShowCurrencyMenu(!showCurrencyMenu);
                setShowPaymentMenu(false);
                setShowSortMenu(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold transition-colors shrink-0 ${
                currencyFilter !== 'ALL'
                  ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-500/40 shadow-2xs'
                  : 'bg-white dark:bg-[#111624] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-purple-400'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Currency: {currencyFilter === 'ALL' ? 'All' : currencyFilter}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showCurrencyMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowCurrencyMenu(false)}
                />
                <div className="absolute left-0 top-full mt-1.5 z-50 w-52 p-2 rounded-2xl bg-white dark:bg-[#111625] border border-slate-200 dark:border-white/10 shadow-xl space-y-1 animate-fade-in">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Filter by Currency
                  </div>
                  <button
                    onClick={() => {
                      onChangeCurrencyFilter('ALL');
                      setShowCurrencyMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      currencyFilter === 'ALL'
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>All Currencies</span>
                    {currencyFilter === 'ALL' && <span className="text-purple-500">✓</span>}
                  </button>
                  {FIAT_CURRENCIES.map((fc) => (
                    <button
                      key={fc.code}
                      onClick={() => {
                        onChangeCurrencyFilter(fc.code);
                        setShowCurrencyMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        currencyFilter === fc.code
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{fc.flag}</span>
                        <span>{fc.code}</span>
                        <span className="text-[10px] text-slate-400">({fc.name})</span>
                      </div>
                      {currencyFilter === fc.code && <span className="text-purple-500">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Section: Sort By Orders & Results Counter */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <button
              id="orders-sort-btn"
              onClick={() => {
                setShowSortMenu(!showSortMenu);
                setShowCurrencyMenu(false);
                setShowPaymentMenu(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111624] border border-slate-200 dark:border-white/10 font-semibold text-slate-800 dark:text-slate-200 hover:border-purple-400 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort: {sortLabels[sortBy]}</span>
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
                    Sort Orders By
                  </div>
                  {(Object.keys(sortLabels) as OrderSortOption[]).map((sk) => (
                    <button
                      key={sk}
                      onClick={() => {
                        onChangeSortBy(sk);
                        setShowSortMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        sortBy === sk
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <span>{sortLabels[sk]}</span>
                      {sortBy === sk && <span className="text-purple-500">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Reset Filters button if any active */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              title="Reset order filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Orders Count & Status Bar */}
      <div className="flex items-center justify-between text-xs px-1 text-slate-500 dark:text-slate-400">
        <div>
          Showing <strong className="text-slate-900 dark:text-white font-mono-num">{filteredOrdersCount}</strong> of{' '}
          <span className="font-mono-num">{totalOrdersCount}</span> orders
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400 font-medium">
            <span>Filtered view active</span>
          </div>
        )}
      </div>
    </div>
  );
};
