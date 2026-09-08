import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Send,
  MessageSquare,
  Building,
  User,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  XCircle,
  FileText,
  CreditCard,
  Lock,
} from 'lucide-react';
import { P2POrder, P2PChatMessage, P2PDisputeInfo } from '../../types';

interface P2POrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: P2POrder;
  onUpdateOrder: (updatedOrder: P2POrder) => void;
  onOpenDispute: (order: P2POrder) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'alert' | 'info') => void;
}

export const P2POrderDetailsModal: React.FC<P2POrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateOrder,
  onOpenDispute,
  onShowToast,
}) => {
  // Countdown timer in seconds (15 minutes default = 900 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(
    order.status === 'pending' ? 882 : 0
  );

  // Copy helpers
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<P2PChatMessage[]>(
    order.chatMessages || [
      {
        id: 'msg-0',
        sender: 'system',
        senderName: 'OKNexus Escrow Protocol',
        text: `Escrow initiated. ${order.cryptoAmount} ${order.cryptoSymbol} is safely reserved in smart escrow. Please transfer exact fiat amount within 15 minutes.`,
        timestamp: '1 min ago',
      },
      {
        id: 'msg-1',
        sender: 'seller',
        senderName: order.merchantName,
        text: 'Hello! Please make sure to not write any crypto terms in the bank narration. Awaiting your transfer.',
        timestamp: '1 min ago',
      },
    ]
  );

  // Buyer "I Have Paid" modal confirmation
  const [showPaidConfirmModal, setShowPaidConfirmModal] = useState(false);
  const [hasPaidCheckbox, setHasPaidCheckbox] = useState(false);

  // Seller "Release Crypto" modal confirmation
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [release2faCode, setRelease2faCode] = useState('');

  // Cancel order modal confirmation
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Changed mind');

  // Countdown effect
  useEffect(() => {
    if (order.status !== 'pending' || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [order.status, secondsRemaining]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    onShowToast?.('Copied to Clipboard', `${fieldName} copied successfully.`, 'info');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: P2PChatMessage = {
      id: `chat-${Date.now()}`,
      sender: order.type === 'buy' ? 'buyer' : 'seller',
      senderName: order.type === 'buy' ? 'You (Buyer)' : 'You (Seller)',
      text: chatInput.trim(),
      timestamp: 'Just now',
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    setChatInput('');
    onUpdateOrder({ ...order, chatMessages: updated });

    // Simulate counterparty reply if buyer just claimed paid
    if (chatInput.toLowerCase().includes('paid') || chatInput.toLowerCase().includes('sent')) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            sender: 'seller',
            senderName: order.merchantName,
            text: 'Got it! Checking banking mobile application right now. Will release in 1-2 minutes.',
            timestamp: 'Just now',
          },
        ]);
      }, 1500);
    }
  };

  const handleConfirmPaid = () => {
    setShowPaidConfirmModal(false);
    const updatedOrder: P2POrder = {
      ...order,
      status: 'payment_submitted',
      timeline: [
        ...(order.timeline || []),
        {
          id: `t-${Date.now()}`,
          status: 'payment_submitted',
          title: 'Payment Sent by Buyer',
          description: 'Buyer confirmed sending fiat funds to seller bank account.',
          timestamp: 'Just now',
          actor: 'buyer',
        },
      ],
      chatMessages: [
        ...messages,
        {
          id: `sys-${Date.now()}`,
          sender: 'system',
          senderName: 'OKNexus Escrow Protocol',
          text: 'Buyer marked payment as completed. Seller is notified to verify bank receipt and release assets.',
          timestamp: 'Just now',
        },
      ],
    };
    setMessages(updatedOrder.chatMessages || []);
    onUpdateOrder(updatedOrder);
    onShowToast?.('Payment Submitted', 'Seller has been notified to verify your payment.', 'success');
  };

  const handleReleaseCrypto = () => {
    setShowReleaseModal(false);
    const updatedOrder: P2POrder = {
      ...order,
      status: 'completed',
      timeline: [
        ...(order.timeline || []),
        {
          id: `t-${Date.now()}`,
          status: 'completed',
          title: 'Escrow Released & Order Completed',
          description: 'Seller confirmed fiat receipt and unlocked cryptocurrency to buyer.',
          timestamp: 'Just now',
          actor: 'seller',
        },
      ],
      chatMessages: [
        ...messages,
        {
          id: `sys-${Date.now()}`,
          sender: 'system',
          senderName: 'OKNexus Escrow Protocol',
          text: `Payment verified! ${order.cryptoAmount} ${order.cryptoSymbol} has been credited to buyer wallet. Order finalized.`,
          timestamp: 'Just now',
        },
      ],
    };
    setMessages(updatedOrder.chatMessages || []);
    onUpdateOrder(updatedOrder);
    onShowToast?.('Crypto Released!', `${order.cryptoAmount} ${order.cryptoSymbol} has been transferred.`, 'success');
  };

  const handleCancelOrder = () => {
    setShowCancelModal(false);
    const updatedOrder: P2POrder = {
      ...order,
      status: 'cancelled',
      timeline: [
        ...(order.timeline || []),
        {
          id: `t-${Date.now()}`,
          status: 'cancelled',
          title: 'Order Cancelled',
          description: `Cancelled by user: ${cancelReason}`,
          timestamp: 'Just now',
          actor: order.type === 'buy' ? 'buyer' : 'seller',
        },
      ],
    };
    onUpdateOrder(updatedOrder);
    onShowToast?.('Order Cancelled', 'The order has been cancelled and escrow unlocked.', 'info');
  };

  // Mock seller payment details (or user's payment details if selling)
  const paymentDetails = order.paymentDetails || {
    bankName: 'Kuda Microfinance Bank',
    accountNumber: '2008492019',
    accountName: order.merchantName || 'Alex Chen Global Traders Ltd',
    referenceMemo: `OKN-${order.id.slice(0, 6).toUpperCase()}`,
  };

  // Status mapping
  const statusSteps = [
    { key: 'pending', label: 'Pending Payment' },
    { key: 'payment_submitted', label: 'Payment Submitted' },
    { key: 'payment_verification', label: 'Payment Verification' },
    { key: 'completed', label: 'Crypto Released & Completed' },
  ];

  const currentStepIndex =
    order.status === 'completed'
      ? 3
      : order.status === 'payment_verification'
      ? 2
      : order.status === 'payment_submitted'
      ? 1
      : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in text-slate-100">
      <div className="w-full max-w-4xl bg-[#090C16] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0E1222]/80">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-md ${
                order.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {order.type.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {order.type === 'buy' ? 'Buy' : 'Sell'} {order.cryptoSymbol} Order
                </h3>
                <span className="font-mono-num text-xs text-purple-300 font-bold">#{order.id}</span>
                {order.status === 'disputed' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    DISPUTED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Created {order.createdAt} • Counterparty: <strong className="text-white">{order.merchantName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Stepper Banner */}
        <div className="px-6 py-3.5 bg-[#0C101E] border-b border-white/[0.06] flex items-center justify-between overflow-x-auto no-scrollbar gap-4 text-xs">
          <div className="flex items-center gap-2">
            {statusSteps.map((step, idx) => {
              const isDone = currentStepIndex > idx || order.status === 'completed';
              const isCurrent = currentStepIndex === idx && order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'disputed';

              return (
                <div key={step.key} className="flex items-center gap-2 whitespace-nowrap">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isCurrent
                        ? 'bg-purple-600 text-white shadow-md'
                        : isDone
                        ? 'bg-emerald-500 text-slate-950 font-extrabold'
                        : 'bg-white/[0.06] text-slate-500'
                    }`}
                  >
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${
                      isCurrent ? 'text-purple-300' : isDone ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                  {idx < statusSteps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
                </div>
              );
            })}
          </div>

          {/* Countdown Timer */}
          {order.status === 'pending' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono-num font-bold text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeFormatted}</span>
            </div>
          )}
        </div>

        {/* Content Body: Two columns (Left: Details & Payment; Right: Chat & Actions) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Order Stats & Payment Instructions */}
          <div className="lg:col-span-7 space-y-4">
            {/* Amount Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121628] via-[#0E1220] to-[#0A0D18] border border-purple-500/20 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Total Amount to Pay</span>
                <span className="text-xl font-extrabold text-white font-mono-num">
                  ₦{order.fiatAmount.toLocaleString()} {order.fiatCurrency}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.08] text-xs font-mono-num">
                <div className="p-2 rounded-xl bg-black/40">
                  <span className="text-[10px] text-slate-400 block">Crypto Receiving</span>
                  <span className="font-bold text-emerald-400">
                    {order.cryptoAmount} {order.cryptoSymbol}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-black/40">
                  <span className="text-[10px] text-slate-400 block">Unit Price</span>
                  <span className="font-bold text-slate-200">₦{order.unitPrice.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40">
                  <span className="text-[10px] text-slate-400 block">Trading Fee</span>
                  <span className="font-bold text-purple-300">0.00% (Free)</span>
                </div>
              </div>
            </div>

            {/* Payment Instructions Card */}
            <div className="p-4 rounded-2xl bg-[#0D101C] border border-white/[0.07] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-400" />
                  <h4 className="font-bold text-sm text-white">Seller Bank Details</h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Bank Name */}
                <div className="p-2.5 rounded-xl bg-[#080A14] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Bank Name</span>
                    <span className="font-bold text-white">{paymentDetails.bankName}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(paymentDetails.bankName, 'Bank Name')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedField === 'Bank Name' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Account Number */}
                <div className="p-2.5 rounded-xl bg-[#080A14] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Account Number</span>
                    <span className="font-bold text-base text-purple-300 font-mono-num">{paymentDetails.accountNumber}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(paymentDetails.accountNumber, 'Account Number')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs font-bold transition-colors"
                  >
                    {copiedField === 'Account Number' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'Account Number' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Beneficiary Name */}
                <div className="p-2.5 rounded-xl bg-[#080A14] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Account Holder Name</span>
                    <span className="font-bold text-white">{paymentDetails.accountName}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(paymentDetails.accountName, 'Beneficiary Name')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedField === 'Beneficiary Name' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Reference Code / Memo */}
                <div className="p-2.5 rounded-xl bg-[#080A14] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Payment Reference / Remarks</span>
                    <span className="font-bold text-amber-300 font-mono-num">{paymentDetails.referenceMemo}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(paymentDetails.referenceMemo, 'Reference Memo')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedField === 'Reference Memo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Crucial Security Notice */}
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Security Warning:</strong> Do <em>NOT</em> include words like "Crypto", "USDT", "BTC", or "OKNexus" in your bank transfer narration, to prevent automated bank account freezes.
                </span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Buyer: I Have Paid button */}
              {order.type === 'buy' && order.status === 'pending' && (
                <button
                  onClick={() => setShowPaidConfirmModal(true)}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Have Paid (Transferred ₦{order.fiatAmount.toLocaleString()})</span>
                </button>
              )}

              {/* Seller: Release Crypto button */}
              {order.type === 'sell' && (order.status === 'pending' || order.status === 'payment_submitted') && (
                <button
                  onClick={() => setShowReleaseModal(true)}
                  className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm shadow-lg shadow-purple-600/30 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Payment Received & Release Crypto</span>
                </button>
              )}

              {/* Cancel Order (if pending) */}
              {order.status === 'pending' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs transition-colors"
                >
                  Cancel Order
                </button>
              )}

              {/* Open Dispute Button */}
              {order.status !== 'cancelled' && order.status !== 'completed' && (
                <button
                  onClick={() => onOpenDispute(order)}
                  className="py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{order.status === 'disputed' ? 'View Active Dispute' : 'Open Dispute'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: In-Order Live Counterparty Chat */}
          <div className="lg:col-span-5 p-4 rounded-2xl bg-[#0D101C] border border-white/[0.07] flex flex-col h-[520px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white flex items-center gap-1">
                    {order.merchantName}
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  </h4>
                  <span className="text-[10px] text-slate-400">Verified Merchant (100% completion)</span>
                </div>
              </div>

              <span className="text-[10px] text-slate-500 font-mono-num">Encrypted P2P</span>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
              {messages.map((msg) => {
                const isSystem = msg.sender === 'system';
                const isMine =
                  (order.type === 'buy' && msg.sender === 'buyer') ||
                  (order.type === 'sell' && msg.sender === 'seller');

                if (isSystem) {
                  return (
                    <div key={msg.id} className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05] text-[11px] text-purple-300 leading-relaxed text-center">
                      {msg.text}
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-slate-400 mb-0.5 px-1 font-semibold">
                      {msg.senderName} • {msg.timestamp}
                    </span>
                    <div
                      className={`p-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        isMine ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-900 border border-white/10 text-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick reply chips */}
            <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
              <button
                type="button"
                onClick={() => setChatInput('Payment has been sent from my bank account.')}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 whitespace-nowrap"
              >
                Payment sent
              </button>
              <button
                type="button"
                onClick={() => setChatInput('Checking my banking app now.')}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 whitespace-nowrap"
              >
                Checking app
              </button>
              <button
                type="button"
                onClick={() => setChatInput('Funds received, releasing crypto now!')}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 whitespace-nowrap"
              >
                Releasing now
              </button>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message to counterparty..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Modal Dialog: "I Have Paid" Confirmation */}
        {showPaidConfirmModal && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0F1322] border border-white/15 rounded-3xl p-6 space-y-4 text-xs shadow-2xl">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Payment Confirmation
                </h4>
                <button onClick={() => setShowPaidConfirmModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-slate-300 leading-relaxed">
                Please confirm that you have completed the fiat transfer of{' '}
                <strong className="text-white">
                  ₦{order.fiatAmount.toLocaleString()} {order.fiatCurrency}
                </strong>{' '}
                to <strong>{paymentDetails.accountName}</strong>.
              </p>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPaidCheckbox}
                  onChange={(e) => setHasPaidCheckbox(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-0"
                />
                <span className="text-slate-300 leading-normal">
                  I have transferred funds from a bank account registered under my legal name, and I have not mentioned any crypto terms in the narration.
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowPaidConfirmModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPaid}
                  disabled={!hasPaidCheckbox}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-extrabold shadow-md transition-all"
                >
                  Confirm Payment &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Dialog: Seller "Release Crypto" Confirmation */}
        {showReleaseModal && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0F1322] border border-white/15 rounded-3xl p-6 space-y-4 text-xs shadow-2xl">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-400" /> Release Escrow Assets
                </h4>
                <button onClick={() => setShowReleaseModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 leading-relaxed">
                <strong>Attention:</strong> Confirm in your official banking mobile app that you have received{' '}
                <strong>₦{order.fiatAmount.toLocaleString()}</strong> before proceeding. This release is irreversible.
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Enter 2FA Security Code to Release:</label>
                <input
                  type="text"
                  maxLength={6}
                  value={release2faCode}
                  onChange={(e) => setRelease2faCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit Google Authenticator code"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono-num text-center tracking-widest text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowReleaseModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReleaseCrypto}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold shadow-md transition-all"
                >
                  Release {order.cryptoAmount} {order.cryptoSymbol} &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Dialog: Cancel Order Confirmation */}
        {showCancelModal && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0F1322] border border-white/15 rounded-3xl p-6 space-y-4 text-xs shadow-2xl">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-base text-white">Cancel P2P Order</h4>
                <button onClick={() => setShowCancelModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-slate-300 leading-relaxed">
                If you have already paid the seller, please DO NOT cancel this order. If you cancel after paying, you may lose your funds.
              </p>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Reason for Cancellation:</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Changed mind">Changed my mind / No longer need crypto</option>
                  <option value="Payment issue">Unable to complete bank transfer</option>
                  <option value="Seller unresponsive">Seller is not responding</option>
                  <option value="Incorrect details">Incorrect payment details provided</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 font-semibold"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
