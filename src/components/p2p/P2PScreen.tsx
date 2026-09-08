import React, { useState } from 'react';
import { P2PTab, P2PMerchant, P2POrder, P2PAd, P2PDisputeInfo } from '../../types';
import { P2PBottomNav } from '../navigation/P2PBottomNav';
import { P2POrderDetailsModal } from './P2POrderDetailsModal';
import { P2PDisputeModal } from './P2PDisputeModal';
import {
  ArrowLeft,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Filter,
  ChevronRight,
  Plus,
  Clock,
  CreditCard,
  UserCheck,
  HelpCircle,
  FileText,
  Radio,
  X,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';

interface P2PScreenProps {
  merchants: P2PMerchant[];
  orders: P2POrder[];
  ads: P2PAd[];
  onExitP2P: () => void;
  onPlaceP2POrder: (order: P2POrder) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'alert' | 'info') => void;
}

export const P2PScreen: React.FC<P2PScreenProps> = ({
  merchants,
  orders,
  ads,
  onExitP2P,
  onPlaceP2POrder,
  onShowToast,
}) => {
  const [activeP2PTab, setActiveP2PTab] = useState<P2PTab>('p2p_market');
  const [tradeSide, setTradeSide] = useState<'buy' | 'sell'>('buy');
  const [selectedCurrency, setSelectedCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [filterPayment, setFilterPayment] = useState<string>('All');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'payment_submitted' | 'completed' | 'cancelled' | 'disputed'>('all');

  // Active Orders & Ads Local State
  const [localOrders, setLocalOrders] = useState<P2POrder[]>(orders);
  const [localAds, setLocalAds] = useState<P2PAd[]>(ads);

  // Selected Order for Dedicated Order Details Modal
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<P2POrder | null>(null);

  // Selected Order for Dedicated Dispute Modal
  const [selectedOrderForDispute, setSelectedOrderForDispute] = useState<P2POrder | null>(null);

  // Trade Modal
  const [activeMerchant, setActiveMerchant] = useState<P2PMerchant | null>(null);
  const [fiatAmountInput, setFiatAmountInput] = useState('');
  const [tradeSuccess, setTradeSuccess] = useState(false);

  // New Ad Modal (Seller Flow)
  const [showCreateAdModal, setShowCreateAdModal] = useState(false);
  const [adSide, setAdSide] = useState<'buy' | 'sell'>('sell');
  const [adCryptoSymbol, setAdCryptoSymbol] = useState<'USDT' | 'BTC' | 'ETH'>('USDT');
  const [adPrice, setAdPrice] = useState('1585.00');
  const [adAmount, setAdAmount] = useState('1000');
  const [adMinLimit, setAdMinLimit] = useState('10000');
  const [adMaxLimit, setAdMaxLimit] = useState('1500000');
  const [adPaymentMethod, setAdPaymentMethod] = useState('Bank Transfer');

  const filteredMerchants = merchants.filter((m) => {
    if (filterPayment !== 'All') {
      return m.paymentMethods.includes(filterPayment);
    }
    return true;
  });

  const handleOpenTrade = (m: P2PMerchant) => {
    setActiveMerchant(m);
    setFiatAmountInput('');
    setTradeSuccess(false);
  };

  const handleConfirmP2PTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMerchant) return;
    const fiatVal = parseFloat(fiatAmountInput) || 0;
    if (fiatVal < activeMerchant.minLimit || fiatVal > activeMerchant.maxLimit) {
      alert(`Amount must be between ₦${activeMerchant.minLimit.toLocaleString()} and ₦${activeMerchant.maxLimit.toLocaleString()}`);
      return;
    }

    const cryptoVal = fiatVal / activeMerchant.pricePerUnit;
    const newOrder: P2POrder = {
      id: `P2P-${Math.floor(10000 + Math.random() * 90000)}`,
      type: tradeSide,
      merchantName: activeMerchant.name,
      cryptoAmount: parseFloat(cryptoVal.toFixed(2)),
      cryptoSymbol: activeMerchant.cryptoSymbol,
      fiatAmount: fiatVal,
      fiatCurrency: activeMerchant.fiatCurrency,
      unitPrice: activeMerchant.pricePerUnit,
      paymentMethod: activeMerchant.paymentMethods[0] || 'Bank Transfer',
      status: 'pending',
      createdAt: 'Just now',
      paymentDetails: {
        bankName: activeMerchant.paymentMethods.includes('Kuda') ? 'Kuda Microfinance Bank' : 'Access Bank Plc',
        accountNumber: '2008492019',
        accountName: activeMerchant.name,
        referenceMemo: `OKN-${Math.floor(100000 + Math.random() * 900000)}`,
      },
      timeline: [
        {
          id: `t-created-${Date.now()}`,
          status: 'pending',
          title: 'Escrow Order Initialized',
          description: `${parseFloat(cryptoVal.toFixed(2))} ${activeMerchant.cryptoSymbol} is safely reserved in smart escrow.`,
          timestamp: 'Just now',
          actor: 'buyer',
        },
      ],
      chatMessages: [
        {
          id: `msg-sys-${Date.now()}`,
          sender: 'system',
          senderName: 'OKNexus Escrow Protocol',
          text: `Escrow order created. Transfer exactly ₦${fiatVal.toLocaleString()} to the seller bank account within 15 minutes.`,
          timestamp: 'Just now',
        },
        {
          id: `msg-seller-${Date.now()}`,
          sender: 'seller',
          senderName: activeMerchant.name,
          text: 'Hello! I am active. Once you complete the bank transfer, tap "I Have Paid" and I will release immediately.',
          timestamp: 'Just now',
        },
      ],
    };

    setLocalOrders((prev) => [newOrder, ...prev]);
    onPlaceP2POrder(newOrder);
    setTradeSuccess(true);
    setTimeout(() => {
      setTradeSuccess(false);
      setActiveMerchant(null);
      setActiveP2PTab('p2p_orders');
      setSelectedOrderForDetails(newOrder);
      onShowToast?.('Order Created & Escrow Locked', `Order #${newOrder.id} active. Opening order details...`, 'success');
    }, 1000);
  };

  return (
    <div id="p2p-full-screen" className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-3 border-b border-white/[0.06] flex items-center justify-between bg-[#090C14]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            id="p2p-back-btn"
            onClick={onExitP2P}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white active:scale-95 transition-all text-xs font-semibold"
            aria-label="Back to main exchange"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit P2P</span>
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold font-display text-white tracking-tight flex items-center gap-2">
              P2P Express Marketplace
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                0% FEES
              </span>
            </h1>
          </div>
        </div>

        {/* Desktop / Tablet Nav Tabs */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-semibold">
          {[
            { id: 'p2p_market', label: 'P2P Market' },
            { id: 'p2p_orders', label: 'My Orders' },
            { id: 'p2p_ads', label: 'My Ads' },
            { id: 'p2p_profile', label: 'User Center' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveP2PTab(item.id as P2PTab)}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeP2PTab === item.id
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveP2PTab('p2p_profile')}
            className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </button>
          <button
            onClick={() => setActiveP2PTab('p2p_profile')}
            className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body per Tab */}
      <main className="flex-1 pb-28 md:pb-12 pt-4 px-4 sm:px-6 lg:px-8 max-w-md md:max-w-4xl lg:max-w-7xl mx-auto w-full">
        {/* TAB 1: P2P MARKETPLACE */}
        {activeP2PTab === 'p2p_market' && (
          <div className="space-y-4">
            {/* Top Bar: Buy/Sell Switch & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#0D111A] border border-white/[0.07]">
              {/* Buy / Sell switch */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#0E121E] border border-white/[0.08] sm:w-60">
                <button
                  id="p2p-toggle-buy"
                  onClick={() => setTradeSide('buy')}
                  className={`py-2 rounded-lg font-bold text-xs transition-all ${
                    tradeSide === 'buy'
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_16px_rgba(16,185,129,0.35)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Buy Crypto
                </button>
                <button
                  id="p2p-toggle-sell"
                  onClick={() => setTradeSide('sell')}
                  className={`py-2 rounded-lg font-bold text-xs transition-all ${
                    tradeSide === 'sell'
                      ? 'bg-rose-500 text-white shadow-[0_0_16px_rgba(244,63,94,0.35)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sell Crypto
                </button>
              </div>

              {/* Currency & Filter pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <div className="px-3 py-1.5 rounded-xl bg-[#111624] border border-white/10 text-xs font-bold text-white flex items-center gap-1">
                  USDT <span>⌄</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#111624] border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-1">
                  ₦ NGN <span>⌄</span>
                </div>
                <button
                  onClick={() => setFilterPayment(filterPayment === 'All' ? 'Bank Transfer' : 'All')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    filterPayment !== 'All'
                      ? 'bg-purple-600/30 text-purple-200 border-purple-500/50'
                      : 'bg-[#111624] text-slate-300 border-white/10'
                  }`}
                >
                  Payment: {filterPayment} <span>⌄</span>
                </button>
              </div>
            </div>

            {/* Merchant Listings as Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredMerchants.map((m) => (
                <div
                  key={m.id}
                  id={`p2p-merchant-${m.name}`}
                  className="rounded-2xl bg-[#0D111A] border border-white/[0.07] p-3.5 space-y-2.5 shadow-sm"
                >
                  {/* Merchant Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs">
                        ₿
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white">{m.name}</span>
                          {m.isVerified && (
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[9px] font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {m.ordersCount.toLocaleString()} orders | {m.completionRate}% completion
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono-num text-sm font-extrabold text-white">
                        ₦{m.pricePerUnit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-slate-400">per USDT</div>
                    </div>
                  </div>

                  {/* Limits & Availability */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-num text-slate-300 py-1 border-t border-white/[0.04]">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Available</span>
                      <span>{m.availableCrypto.toLocaleString()} USDT</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Limit</span>
                      <span>₦{m.minLimit.toLocaleString()} - ₦{m.maxLimit.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Payment Methods & Action Button */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {m.paymentMethods.map((pm) => (
                        <span
                          key={pm}
                          className="px-2 py-0.5 rounded-md bg-[#131929] border border-white/[0.06] text-[10px] text-slate-300 flex items-center gap-1"
                        >
                          <CreditCard className="w-2.5 h-2.5 text-slate-400" />
                          {pm}
                        </span>
                      ))}
                    </div>

                    <button
                      id={`p2p-btn-${tradeSide}-${m.id}`}
                      onClick={() => handleOpenTrade(m)}
                      className={`px-4 py-1.5 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all ${
                        tradeSide === 'buy'
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                          : 'bg-rose-500 hover:bg-rose-400 text-white'
                      }`}
                    >
                      {tradeSide === 'buy' ? 'Buy' : 'Sell'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: P2P ORDERS */}
        {activeP2PTab === 'p2p_orders' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">P2P Orders</h2>
              <span className="text-xs text-slate-400 font-mono-num">
                {localOrders.length} Total Orders
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-2 text-xs overflow-x-auto no-scrollbar">
              {(['all', 'pending', 'payment_submitted', 'completed', 'cancelled', 'disputed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`capitalize px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                    orderFilter === st
                      ? 'bg-purple-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {st === 'payment_submitted' ? 'Payment Sent' : st}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {localOrders
                .filter((o) => {
                  if (orderFilter === 'all') return true;
                  if (orderFilter === 'disputed') return o.status === 'disputed';
                  return o.status === orderFilter;
                })
                .map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderForDetails(order)}
                    className="p-4 rounded-2xl bg-[#0D111A] border border-white/[0.07] hover:border-purple-500/40 hover:bg-[#111624] transition-all cursor-pointer space-y-2.5 group shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-extrabold text-xs px-2 py-0.5 rounded-lg ${
                            order.type === 'buy'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {order.type.toUpperCase()} {order.cryptoSymbol}
                        </span>
                        <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                          {order.merchantName}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg border ${
                          order.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : order.status === 'disputed'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : order.status === 'payment_submitted'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : order.status === 'cancelled'
                            ? 'bg-slate-800 text-slate-400 border-white/5'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {order.status === 'payment_submitted' ? 'PAID' : order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono-num">
                      <span className="text-slate-400">Total Fiat</span>
                      <span className="font-extrabold text-white text-sm">
                        ₦{order.fiatAmount.toLocaleString()} {order.fiatCurrency}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono-num">
                      <span className="text-slate-400">Crypto Amount</span>
                      <span className="font-bold text-emerald-400">
                        {order.cryptoAmount} {order.cryptoSymbol}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/[0.04]">
                      <span>ID: #{order.id} • {order.createdAt}</span>
                      <span className="text-purple-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Order Details &rarr;
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {localOrders.length === 0 && (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <FileText className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-xs">No orders found in this category.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: P2P ADS */}
        {activeP2PTab === 'p2p_ads' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">My P2P Ads (Merchant Flow)</h2>
              <button
                onClick={() => setShowCreateAdModal(true)}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs active:scale-95 transition-all shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                Post New Ad
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {localAds.map((ad) => (
                <div
                  key={ad.id}
                  className="p-3.5 rounded-2xl bg-[#0D111A] border border-white/[0.07] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          ad.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {ad.type.toUpperCase()}
                      </span>
                      <span className="font-bold text-xs text-white">{ad.cryptoSymbol}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      {ad.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs font-mono-num">
                    <span className="text-slate-400">Unit Price</span>
                    <span className="font-bold text-white">₦{ad.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono-num">
                    <span className="text-slate-400">Available</span>
                    <span className="text-slate-300">{ad.available} {ad.cryptoSymbol}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono-num">
                    <span className="text-slate-400">Limit</span>
                    <span className="text-slate-300">₦{ad.minLimit.toLocaleString()} - ₦{ad.maxLimit.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: P2P PROFILE */}
        {activeP2PTab === 'p2p_profile' && (
          <div className="space-y-4">
            {/* Merchant Profile Header Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#161224] to-[#0D111A] border border-purple-500/30 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#F7931A] text-white flex items-center justify-center font-bold text-xl shadow-md">
                  ₿
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base text-white">CryptoKing</h3>
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Verified Merchant</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-white/[0.06] text-center font-mono-num">
                <div>
                  <div className="text-sm font-bold text-white">2,843</div>
                  <div className="text-[10px] text-slate-400">Orders</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-400">98.5%</div>
                  <div className="text-[10px] text-slate-400">Completion</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-200">5 min</div>
                  <div className="text-[10px] text-slate-400">Avg. Release</div>
                </div>
              </div>
            </div>

            {/* Menu List */}
            <div className="rounded-2xl bg-[#0D111A] border border-white/[0.07] divide-y divide-white/[0.05]">
              <button
                onClick={() => setActiveP2PTab('p2p_orders')}
                className="w-full flex items-center justify-between p-3.5 text-xs text-left hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-semibold text-white">My Orders</div>
                    <div className="text-[10px] text-slate-400">View all transaction history</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveP2PTab('p2p_ads')}
                className="w-full flex items-center justify-between p-3.5 text-xs text-left hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-semibold text-white">My Ads</div>
                    <div className="text-[10px] text-slate-400">Manage your advertisement posts</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <div className="flex items-center justify-between p-3.5 text-xs">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-semibold text-white">Payment Methods</div>
                    <div className="text-[10px] text-slate-400">Bank accounts & cards (2 Linked)</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="flex items-center justify-between p-3.5 text-xs">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-white">Verification</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">Tier 3 Verified (Unlimited)</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="flex items-center justify-between p-3.5 text-xs">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-white">Help & Escrow Support</div>
                    <div className="text-[10px] text-slate-400">24/7 Dispute resolution</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* P2P Dedicated Bottom Nav */}
      <P2PBottomNav
        activeTab={activeP2PTab}
        onSelectTab={(t) => setActiveP2PTab(t)}
      />

      {/* Trade Execution Modal */}
      {activeMerchant && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#0F1320] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <div>
                <h3 className="font-bold text-sm text-white">
                  {tradeSide === 'buy' ? 'Buy USDT' : 'Sell USDT'} with {activeMerchant.name}
                </h3>
                <span className="text-xs font-mono-num text-emerald-400 font-bold">
                  ₦{activeMerchant.pricePerUnit.toLocaleString()} / USDT
                </span>
              </div>
              <button
                onClick={() => setActiveMerchant(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {tradeSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-white text-base">Escrow Order Created!</h4>
                <p className="text-xs text-slate-400">
                  Funds locked safely in OKNexus Escrow. Redirecting to order details...
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmP2PTrade} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Enter Fiat Amount (₦ NGN)
                  </label>
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#090C14] border border-white/10 focus-within:border-emerald-500/50">
                    <input
                      type="number"
                      placeholder={`₦${activeMerchant.minLimit.toLocaleString()} - ₦${activeMerchant.maxLimit.toLocaleString()}`}
                      value={fiatAmountInput}
                      onChange={(e) => setFiatAmountInput(e.target.value)}
                      className="bg-transparent text-white font-mono-num text-sm font-bold focus:outline-none w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setFiatAmountInput(activeMerchant.minLimit.toString())}
                      className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/20"
                    >
                      MIN
                    </button>
                  </div>
                </div>

                {/* Calculation preview */}
                <div className="p-3 rounded-xl bg-[#090C14] border border-white/[0.06] space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>You will receive approx.</span>
                    <span className="text-emerald-400 font-mono-num font-bold">
                      {fiatAmountInput
                        ? (parseFloat(fiatAmountInput) / activeMerchant.pricePerUnit).toFixed(2)
                        : '0.00'}{' '}
                      USDT
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Payment Time Limit</span>
                    <span className="text-white font-medium">15 Minutes</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Escrow Guarantee</span>
                    <span className="text-emerald-400 font-medium">100% Protected</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.35)] active:scale-98 transition-all"
                >
                  Confirm & Lock Escrow
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Post Ad Modal (Production Seller Flow) */}
      {showCreateAdModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0F1322] border border-white/10 rounded-3xl p-6 space-y-4 animate-fade-in text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="font-extrabold text-base text-white">Create P2P Merchant Advertisement</h3>
                <span className="text-[10px] text-purple-400 font-semibold">Seller & Liquidity Provider Protocol</span>
              </div>
              <button onClick={() => setShowCreateAdModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Buy or Sell choice */}
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Ad Type</label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setAdSide('buy')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      adSide === 'buy' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    I Want to Buy (Buyer Ad)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdSide('sell')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      adSide === 'sell' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    I Want to Sell (Seller Ad)
                  </button>
                </div>
              </div>

              {/* Crypto Asset choice */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Cryptocurrency</label>
                  <select
                    value={adCryptoSymbol}
                    onChange={(e) => setAdCryptoSymbol(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold focus:outline-none focus:border-purple-500"
                  >
                    <option value="USDT">USDT - Tether USD</option>
                    <option value="BTC">BTC - Bitcoin</option>
                    <option value="ETH">ETH - Ethereum</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Fixed Price (₦ NGN / {adCryptoSymbol})</label>
                  <input
                    type="number"
                    value={adPrice}
                    onChange={(e) => setAdPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold font-mono-num focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Amount and Limits */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Total Available</label>
                  <input
                    type="number"
                    value={adAmount}
                    onChange={(e) => setAdAmount(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold font-mono-num focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Min Limit (₦)</label>
                  <input
                    type="number"
                    value={adMinLimit}
                    onChange={(e) => setAdMinLimit(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold font-mono-num focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Max Limit (₦)</label>
                  <input
                    type="number"
                    value={adMaxLimit}
                    onChange={(e) => setAdMaxLimit(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold font-mono-num focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Payment Method Accepted</label>
                <select
                  value={adPaymentMethod}
                  onChange={(e) => setAdPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-semibold focus:outline-none focus:border-purple-500"
                >
                  <option value="Bank Transfer">Bank Transfer (Instant Electronic Funds)</option>
                  <option value="Kuda Bank">Kuda Microfinance Bank</option>
                  <option value="OPay">OPay Digital Services</option>
                  <option value="Chipper Cash">Chipper Cash</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateAdModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newAdItem: P2PAd = {
                      id: `AD-${Math.floor(1000 + Math.random() * 9000)}`,
                      type: adSide,
                      cryptoSymbol: adCryptoSymbol,
                      fiatCurrency: 'NGN',
                      price: parseFloat(adPrice) || 1585,
                      available: parseFloat(adAmount) || 1000,
                      minLimit: parseFloat(adMinLimit) || 10000,
                      maxLimit: parseFloat(adMaxLimit) || 1500000,
                      paymentMethods: [adPaymentMethod],
                      status: 'active',
                    };
                    setLocalAds((prev) => [newAdItem, ...prev]);
                    setShowCreateAdModal(false);
                    onShowToast?.('Ad Published', `Your ${adSide.toUpperCase()} ad for ${adCryptoSymbol} is now live on OKNexus Marketplace.`, 'success');
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md transition-all"
                >
                  Publish Advertisement &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* P2P Dedicated Order Details Modal */}
      {selectedOrderForDetails && (
        <P2POrderDetailsModal
          isOpen={Boolean(selectedOrderForDetails)}
          onClose={() => setSelectedOrderForDetails(null)}
          order={selectedOrderForDetails}
          onUpdateOrder={(updatedOrder) => {
            setSelectedOrderForDetails(updatedOrder);
            setLocalOrders((prev) =>
              prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
            );
          }}
          onOpenDispute={(orderToDispute) => {
            setSelectedOrderForDispute(orderToDispute);
          }}
          onShowToast={onShowToast}
        />
      )}

      {/* P2P Dedicated Dispute Arbitration Center Modal */}
      {selectedOrderForDispute && (
        <P2PDisputeModal
          isOpen={Boolean(selectedOrderForDispute)}
          onClose={() => setSelectedOrderForDispute(null)}
          order={selectedOrderForDispute}
          userRole={selectedOrderForDispute.type === 'buy' ? 'buyer' : 'seller'}
          onUpdateOrderDispute={(orderId, updatedDispute) => {
            const isResolved = updatedDispute.status === 'resolved';
            const updated: P2POrder = {
              ...selectedOrderForDispute,
              status: isResolved ? 'completed' : 'disputed',
              dispute: updatedDispute,
            };
            setSelectedOrderForDispute(updated);
            if (selectedOrderForDetails?.id === orderId) {
              setSelectedOrderForDetails(updated);
            }
            setLocalOrders((prev) =>
              prev.map((o) => (o.id === orderId ? updated : o))
            );
          }}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
