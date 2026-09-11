import React, { useState, useMemo } from 'react';
import { OpenOrder, MarketPair } from '../../types';
import {
  Trash2,
  CheckCircle2,
  Clock,
  Wallet,
  XCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  SlidersHorizontal,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface OrdersHistoryPanelProps {
  pair: MarketPair;
  openOrders: OpenOrder[];
  historyOrders: OpenOrder[];
  availableCrypto: number;
  availableUsdt: number;
  onCancelOrder: (id: string) => void;
  onCancelAllOrders: () => void;
  className?: string;
}

type PanelTab = 'orders' | 'open' | 'history' | 'assets';
type SortField = 'time' | 'price' | 'amount' | 'status';
type SortDirection = 'desc' | 'asc';
type StatusFilter = 'all' | 'open' | 'executed' | 'cancelled';

export const OrdersHistoryPanel: React.FC<OrdersHistoryPanelProps> = ({
  pair,
  openOrders,
  historyOrders,
  availableCrypto,
  availableUsdt,
  onCancelOrder,
  onCancelAllOrders,
  className = '',
}) => {
  const [tab, setTab] = useState<PanelTab>('orders');
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const cryptoUsdValue = availableCrypto * pair.price;

  // Combine open and history orders for the unified Orders tab
  const allOrders = useMemo(() => {
    return [...openOrders, ...historyOrders];
  }, [openOrders, historyOrders]);

  const openCount = openOrders.length;
  const executedCount = historyOrders.filter((o) => o.status === 'completed').length;
  const cancelledCount = historyOrders.filter((o) => o.status === 'cancelled').length;

  // Filtered and sorted orders for the Orders tab
  const processedOrders = useMemo(() => {
    let list = [...allOrders];

    // Filter by status
    if (statusFilter === 'open') {
      list = list.filter((o) => o.status === 'open' || o.status === 'partial');
    } else if (statusFilter === 'executed') {
      list = list.filter((o) => o.status === 'completed');
    } else if (statusFilter === 'cancelled') {
      list = list.filter((o) => o.status === 'cancelled');
    }

    // Sort list
    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'time') {
        // Compare time strings (e.g., '14:20:10')
        comparison = a.time.localeCompare(b.time);
      } else if (sortField === 'price') {
        comparison = a.price - b.price;
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortField === 'status') {
        const priority: Record<string, number> = {
          open: 4,
          partial: 3,
          completed: 2,
          cancelled: 1,
        };
        comparison = (priority[a.status] || 0) - (priority[b.status] || 0);
      }

      return sortDir === 'desc' ? -comparison : comparison;
    });

    return list;
  }, [allOrders, statusFilter, sortField, sortDir]);

  const handleToggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const handleCopyOrderId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText?.(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Helper to render status badge with visual indicator
  const renderStatusBadge = (order: OpenOrder) => {
    const fillPct = order.amount > 0 ? Math.round((order.filled / order.amount) * 100) : 0;

    switch (order.status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>OPEN</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span>PARTIAL {fillPct}%</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>EXECUTED</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-500/30">
            <XCircle className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span>CANCELLED</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="orders-history-panel"
      className={`rounded-2xl bg-slate-50 dark:bg-[#090C14] border border-slate-200 dark:border-white/[0.08] p-3 shadow-xs dark:shadow-xl transition-all ${className}`}
    >
      {/* Top Tab Bar: Orders, Open Orders, History, Pair Assets */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-2 mb-2.5">
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold overflow-x-auto no-scrollbar py-0.5">
          {/* Main Unified Orders Tab */}
          <button
            id="tab-all-orders"
            type="button"
            onClick={() => setTab('orders')}
            className={`flex items-center gap-1.5 pb-1 relative whitespace-nowrap transition-colors ${
              tab === 'orders' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Orders</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono-num font-bold ${
                allOrders.length > 0 ? 'bg-purple-100 text-purple-700 dark:bg-purple-600/40 dark:text-purple-200' : 'bg-slate-200 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400'
              }`}
            >
              {allOrders.length}
            </span>
            {tab === 'orders' && (
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-purple-600 dark:bg-purple-500 rounded-full" />
            )}
          </button>

          {/* Open Orders Tab */}
          <button
            id="tab-open-orders"
            type="button"
            onClick={() => setTab('open')}
            className={`flex items-center gap-1.5 pb-1 relative whitespace-nowrap transition-colors ${
              tab === 'open' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Open</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono-num font-bold ${
                openCount > 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300' : 'bg-slate-200 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400'
              }`}
            >
              {openCount}
            </span>
            {tab === 'open' && (
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-amber-500 rounded-full" />
            )}
          </button>

          {/* History Tab */}
          <button
            id="tab-history-orders"
            type="button"
            onClick={() => setTab('history')}
            className={`flex items-center gap-1.5 pb-1 relative whitespace-nowrap transition-colors ${
              tab === 'history' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>History</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono-num font-bold bg-slate-200 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400">
              {historyOrders.length}
            </span>
            {tab === 'history' && (
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-purple-600 dark:bg-purple-500 rounded-full" />
            )}
          </button>

          {/* Pair Assets Tab */}
          <button
            id="tab-pair-assets"
            type="button"
            onClick={() => setTab('assets')}
            className={`flex items-center gap-1.5 pb-1 relative whitespace-nowrap transition-colors ${
              tab === 'assets' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Assets</span>
            {tab === 'assets' && (
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-amber-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Cancel All Action (when active tab has open orders) */}
        {(tab === 'open' || tab === 'orders') && openOrders.length > 0 && (
          <button
            id="cancel-all-orders-btn"
            type="button"
            onClick={onCancelAllOrders}
            className="flex items-center gap-1 text-[11px] font-medium text-rose-400 hover:text-rose-300 transition-colors ml-2 px-2 py-0.5 rounded-md hover:bg-rose-500/10 active:scale-95"
            title="Cancel all open orders"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Cancel All</span>
            <span className="sm:hidden">All</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT: UNIFIED ORDERS TAB (SORTABLE & CONCISE FOR MOBILE) */}
      {/* ========================================================================= */}
      {tab === 'orders' && (
        <div className="space-y-2.5">
          {/* Controls Bar: Filter Pills & Sort Buttons in a compact mobile toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200 dark:border-white/[0.04]">
            {/* Quick Status Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono-num transition-all ${
                  statusFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-200/80 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({allOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('open')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono-num transition-all ${
                  statusFilter === 'open'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-200/80 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Open ({openCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('executed')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono-num transition-all ${
                  statusFilter === 'executed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-200/80 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Executed ({executedCount})
              </button>
              {cancelledCount > 0 && (
                <button
                  type="button"
                  onClick={() => setStatusFilter('cancelled')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono-num transition-all ${
                    statusFilter === 'cancelled'
                      ? 'bg-slate-600 text-white shadow-xs'
                      : 'bg-slate-200/80 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Cancelled ({cancelledCount})
                </button>
              )}
            </div>

            {/* Sort Toolbar: Time, Price, Amount, Status */}
            <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 overflow-x-auto no-scrollbar">
              <span className="text-slate-500 font-medium flex items-center gap-0.5 mr-0.5">
                <SlidersHorizontal className="w-2.5 h-2.5" />
                <span className="hidden xs:inline">Sort:</span>
              </span>

              {(['time', 'price', 'amount', 'status'] as SortField[]).map((field) => {
                const isActive = sortField === field;
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => handleToggleSort(field)}
                    className={`flex items-center gap-0.5 px-2 py-0.5 rounded-md font-medium capitalize transition-all ${
                      isActive
                        ? 'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-500/25 dark:text-purple-200 dark:border-purple-500/40 font-semibold'
                        : 'bg-slate-100 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <span>{field}</span>
                    {isActive ? (
                      sortDir === 'desc' ? (
                        <ArrowDown className="w-2.5 h-2.5 text-purple-600 dark:text-purple-300" />
                      ) : (
                        <ArrowUp className="w-2.5 h-2.5 text-purple-600 dark:text-purple-300" />
                      )
                    ) : (
                      <ArrowUpDown className="w-2.5 h-2.5 text-slate-400 dark:text-slate-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Orders List */}
          {processedOrders.length === 0 ? (
            <div className="py-8 px-4 text-center rounded-xl bg-slate-100 dark:bg-[#06080E] border border-slate-200 dark:border-white/[0.04]">
              <Clock className="w-6 h-6 text-slate-400 dark:text-slate-600 mx-auto mb-1.5" />
              <p className="text-xs text-slate-800 dark:text-slate-300 font-semibold">No orders found</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {statusFilter === 'all'
                  ? `No trading activity recorded for ${pair.symbol}.`
                  : `No ${statusFilter} orders match this filter.`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {processedOrders.map((ord) => {
                const fillPct = ord.amount > 0 ? (ord.filled / ord.amount) * 100 : 0;
                const totalValue = ord.price * ord.amount;
                const isOpen = ord.status === 'open' || ord.status === 'partial';
                const isExpanded = expandedOrderId === ord.id;

                return (
                  <div
                    key={ord.id}
                    className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-[#06080E] border border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/10 transition-all text-xs shadow-xs"
                  >
                    {/* Top Row: Side, Symbol, Type, Status Indicator, Time */}
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Side Badge */}
                        <span
                          className={`font-bold px-1.5 py-0.2 rounded text-[10px] uppercase tracking-wider ${
                            ord.side === 'buy'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                              : 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                          }`}
                        >
                          {ord.side}
                        </span>

                        <span className="font-bold text-slate-900 dark:text-white tracking-tight">{ord.symbol}</span>

                        <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-mono-num px-1 py-0.2 rounded bg-slate-100 dark:bg-white/[0.04]">
                          {ord.type}
                        </span>

                        {/* Status Indicator */}
                        {renderStatusBadge(ord)}
                      </div>

                      {/* Timestamp & Expand trigger */}
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-mono-num shrink-0">
                        <span>{ord.time}</span>
                        <button
                          type="button"
                          onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                          className="p-0.5 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Middle Row: Price, Filled/Amount, Total USD */}
                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono-num text-slate-700 dark:text-slate-300 pt-0.5">
                      <div>
                        <span className="text-slate-500 text-[9px] uppercase tracking-wider block">Price</span>
                        <span className="font-semibold text-slate-900 dark:text-white">${ord.price.toFixed(2)}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 text-[9px] uppercase tracking-wider block">
                          {ord.status === 'completed' ? 'Executed' : 'Filled / Amount'}
                        </span>
                        <span className="font-semibold">
                          {ord.status === 'completed' ? (
                            <span>
                              {ord.amount} {pair.base}
                            </span>
                          ) : (
                            <span>
                              {ord.filled} / {ord.amount}
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-500 text-[9px] uppercase tracking-wider block">Total (USDT)</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">${totalValue.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Fill Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-full h-1 overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          ord.status === 'completed'
                            ? 'bg-emerald-500'
                            : ord.status === 'cancelled'
                            ? 'bg-slate-400 dark:bg-slate-600'
                            : 'bg-purple-600 dark:bg-purple-500'
                        }`}
                        style={{
                          width: `${ord.status === 'completed' ? 100 : Math.max(fillPct > 0 ? fillPct : 0, 4)}%`,
                        }}
                      />
                    </div>

                    {/* Compact Actions & Info Strip */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200 dark:border-white/[0.04] text-[10px]">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono">
                        <span>ID:</span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyOrderId(ord.id, e)}
                          className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                          title="Copy Order ID"
                        >
                          <span>{ord.id}</span>
                          {copiedId === ord.id ? (
                            <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500" />
                          )}
                        </button>
                      </div>

                      {/* Right Action: Cancel button for open orders, or completion indicator */}
                      {isOpen ? (
                        <button
                          type="button"
                          onClick={() => onCancelOrder(ord.id)}
                          className="px-2.5 py-1 rounded-md bg-rose-100 border border-rose-300 text-rose-700 dark:bg-rose-500/15 dark:border-rose-500/30 dark:text-rose-300 text-[11px] font-semibold hover:bg-rose-200 dark:hover:bg-rose-500/25 active:scale-95 transition-all"
                        >
                          Cancel Order
                        </button>
                      ) : ord.status === 'completed' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <span>100% Filled</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">Cancelled</span>
                      )}
                    </div>

                    {/* Expandable Pro Details on Click */}
                    {isExpanded && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/[0.06] grid grid-cols-2 gap-2 text-[10px] font-mono-num text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.02] p-2 rounded-lg">
                        <div>
                          <span className="text-slate-500 block">Avg Execution:</span>
                          <span className="text-slate-800 dark:text-slate-200 font-semibold">
                            ${ord.status === 'completed' ? ord.price.toFixed(2) : '--'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Estimated Fee:</span>
                          <span className="text-slate-800 dark:text-slate-200 font-semibold">
                            ${(totalValue * 0.001).toFixed(3)} (0.1%)
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Role / Type:</span>
                          <span className="text-slate-800 dark:text-slate-200 font-semibold uppercase">
                            {ord.type === 'limit' ? 'Maker (Limit)' : 'Taker (Market)'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Filled Ratio:</span>
                          <span className="text-slate-800 dark:text-slate-200 font-semibold">{fillPct.toFixed(1)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: OPEN ORDERS (DEDICATED VIEW) */}
      {/* ========================================================================= */}
      {tab === 'open' && (
        <div className="space-y-2">
          {openOrders.length === 0 ? (
            <div className="py-6 px-4 text-center rounded-xl bg-slate-100 dark:bg-[#06080E] border border-slate-200 dark:border-white/[0.04]">
              <Clock className="w-6 h-6 text-slate-400 dark:text-slate-600 mx-auto mb-1.5" />
              <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">No open orders for {pair.symbol}</p>
              <span className="text-[11px] text-slate-500">
                Place a limit or stop order above to manage pending trades.
              </span>
            </div>
          ) : (
            openOrders.map((ord) => {
              const fillPct = ord.amount > 0 ? (ord.filled / ord.amount) * 100 : 0;
              return (
                <div
                  key={ord.id}
                  className="p-3 rounded-xl bg-white dark:bg-[#06080E] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-xs shadow-xs"
                >
                  <div className="space-y-1 flex-1 pr-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-bold px-1.5 py-0.2 rounded text-[10px] uppercase ${
                          ord.side === 'buy'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'
                            : 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30'
                        }`}
                      >
                        {ord.side}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{ord.symbol}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono-num">{ord.type}</span>
                      {renderStatusBadge(ord)}
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-auto font-mono-num">{ord.time}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-num text-slate-700 dark:text-slate-300">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Price</span>
                        <span className="font-semibold text-slate-900 dark:text-white">${ord.price.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Amount</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {ord.amount} {pair.base}
                        </span>
                      </div>
                    </div>

                    {/* Fill Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 overflow-hidden mt-1">
                      <div
                        className="bg-purple-600 dark:bg-purple-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.max(5, fillPct)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onCancelOrder(ord.id)}
                    className="px-2.5 py-1 rounded-lg bg-rose-100 border border-rose-300 text-rose-700 dark:bg-rose-500/15 dark:border-rose-500/30 dark:text-rose-400 text-[11px] font-semibold hover:bg-rose-200 dark:hover:bg-rose-500/25 active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: ORDER HISTORY (DEDICATED VIEW) */}
      {/* ========================================================================= */}
      {tab === 'history' && (
        <div className="space-y-2">
          {historyOrders.length === 0 ? (
            <div className="py-6 px-4 text-center rounded-xl bg-slate-100 dark:bg-[#06080E] border border-slate-200 dark:border-white/[0.04]">
              <CheckCircle2 className="w-6 h-6 text-slate-400 dark:text-slate-600 mx-auto mb-1.5" />
              <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">No order history yet</p>
            </div>
          ) : (
            historyOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-2.5 rounded-xl bg-white dark:bg-[#06080E] border border-slate-200 dark:border-white/[0.06] text-xs font-mono-num shadow-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-bold text-[10px] uppercase ${
                        ord.side === 'buy' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {ord.side}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{ord.symbol}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">({ord.type})</span>
                  </div>
                  {renderStatusBadge(ord)}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
                  <span>Price: <strong className="text-slate-900 dark:text-white">${ord.price.toFixed(2)}</strong></span>
                  <span>
                    Amount: <strong className="text-slate-900 dark:text-white">{ord.amount} {pair.base}</strong>
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 text-right mt-0.5">{ord.time}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: PAIR ASSETS */}
      {/* ========================================================================= */}
      {tab === 'assets' && (
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-white dark:bg-[#06080E] border border-slate-200 dark:border-white/[0.06] shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mb-0.5">{pair.base} Available</span>
            <div className="font-mono-num font-bold text-base text-slate-900 dark:text-white">{availableCrypto.toFixed(4)}</div>
            <span className="text-[10px] font-mono-num text-slate-500 dark:text-slate-400">≈ ${cryptoUsdValue.toFixed(2)} USD</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#06080E] border border-slate-200 dark:border-white/[0.06] shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mb-0.5">USDT Available</span>
            <div className="font-mono-num font-bold text-base text-slate-900 dark:text-white">
              ${availableUsdt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] font-mono-num text-slate-500 dark:text-slate-400">Total Liquidity</span>
          </div>
        </div>
      )}
    </div>
  );
};

