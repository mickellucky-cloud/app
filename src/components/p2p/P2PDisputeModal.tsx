import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  Upload,
  FileText,
  Clock,
  CheckCircle2,
  MessageSquare,
  Send,
  User,
  Shield,
  Gavel,
  Paperclip,
  Check,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { P2POrder, P2PDisputeInfo, P2PDisputeTimelineItem, P2PChatMessage } from '../../types';

interface P2PDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: P2POrder;
  userRole?: 'buyer' | 'seller';
  onUpdateOrderDispute?: (orderId: string, updatedDispute: P2PDisputeInfo) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'alert' | 'info') => void;
}

export const P2PDisputeModal: React.FC<P2PDisputeModalProps> = ({
  isOpen,
  onClose,
  order,
  userRole = 'buyer',
  onUpdateOrderDispute,
  onShowToast,
}) => {
  const role: 'buyer' | 'seller' = userRole === 'seller' ? 'seller' : 'buyer';

  // Dispute status flow: 'opened' | 'evidence_collection' | 'under_review' | 'decision_made' | 'resolved'
  const [disputeStatus, setDisputeStatus] = useState<
    'opened' | 'evidence_collection' | 'under_review' | 'decision_made' | 'resolved'
  >(order.dispute?.status || 'opened');

  // Form states for creating a new dispute
  const [selectedReason, setSelectedReason] = useState(
    order.dispute?.reason || (role === 'buyer'
      ? 'Payment sent but seller has not released crypto'
      : 'Buyer claimed payment sent but funds not received in bank account')
  );
  const [disputeDescription, setDisputeDescription] = useState(
    order.dispute?.description || ''
  );
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>(
    order.dispute?.evidenceBuyer || ['bank_transfer_receipt_ref_4821.jpg']
  );
  const [isUploading, setIsUploading] = useState(false);

  // Dispute chat messages
  const [chatInput, setChatInput] = useState('');
  const [disputeChat, setDisputeChat] = useState<P2PChatMessage[]>([
    {
      id: 'd-msg-1',
      sender: 'system',
      senderName: 'OKNexus Escrow System',
      text: `Escrow for order ${order.id} has been frozen. 24/7 Dispute Mediation Team #418 assigned.`,
      timestamp: '10 mins ago',
    },
    {
      id: 'd-msg-2',
      sender: 'arbiter',
      senderName: 'Senior Arbiter Sarah (VIP Support)',
      text: 'Hello both parties. Please provide official bank transfer statements showing reference memo, sender account name, and exact timestamp.',
      timestamp: '8 mins ago',
    },
    {
      id: 'd-msg-3',
      sender: userRole === 'buyer' ? 'buyer' : 'seller',
      senderName: userRole === 'buyer' ? 'You (Buyer)' : 'Merchant Alex',
      text: 'I sent the funds through instant mobile banking. Attaching the official e-receipt now.',
      timestamp: '5 mins ago',
    },
  ]);

  if (!isOpen) return null;

  const buyerReasons = [
    'Payment sent but seller has not released crypto',
    'Paid exact amount but seller claims non-receipt',
    'Seller provided invalid or third-party bank details',
    'Seller is unresponsive and payment window has lapsed',
    'Other payment discrepancy',
  ];

  const sellerReasons = [
    'Buyer claimed payment sent but funds not received in bank account',
    'Received incorrect / partial payment amount',
    'Received payment from an unverified third-party bank account',
    'Buyer uploaded fraudulent or altered payment receipt',
    'Other issue',
  ];

  const reasonsList = userRole === 'buyer' ? buyerReasons : sellerReasons;

  const handleAddMockFile = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newFile = `proof_statement_${Date.now().toString().slice(-4)}.pdf`;
      setEvidenceFiles((prev) => [...prev, newFile]);
      setIsUploading(false);
      onShowToast?.('Evidence Document Attached', `File ${newFile} uploaded to dispute vault.`, 'success');
    }, 600);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: P2PChatMessage = {
      id: `d-msg-${Date.now()}`,
      sender: role,
      senderName: role === 'buyer' ? 'You (Buyer)' : 'You (Seller)',
      text: chatInput.trim(),
      timestamp: 'Just now',
    };

    setDisputeChat((prev) => [...prev, newMsg]);
    setChatInput('');

    // Simulate Arbiter acknowledgement
    setTimeout(() => {
      setDisputeChat((prev) => [
        ...prev,
        {
          id: `arb-${Date.now()}`,
          sender: 'arbiter',
          senderName: 'Senior Arbiter Sarah',
          text: 'Thank you for providing the statement. Reviewing banking ledger clearance with clearing bank.',
          timestamp: 'Just now',
        },
      ]);
    }, 1500);
  };

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeDescription.trim()) {
      onShowToast?.('Details Required', 'Please provide a clear description of the dispute.', 'alert');
      return;
    }

    const newTimeline: P2PDisputeTimelineItem[] = [
      {
        id: 't-1',
        status: 'dispute_opened',
        title: 'Dispute Case Opened',
        description: `${role === 'buyer' ? 'Buyer' : 'Seller'} submitted complaint: "${selectedReason}"`,
        timestamp: 'Just now',
        actor: role,
      },
      {
        id: 't-2',
        status: 'evidence_collection',
        title: 'Evidence Collected',
        description: `${evidenceFiles.length} documentation files encrypted into dispute storage.`,
        timestamp: 'Just now',
        actor: role,
      },
      {
        id: 't-3',
        status: 'under_review',
        title: 'Senior Arbiter Assigned',
        description: 'OKNexus Arbitration Council reviewing bank statement logs.',
        timestamp: 'Just now',
        actor: 'arbiter',
      },
    ];

    const updatedDispute: P2PDisputeInfo = {
      id: order.dispute?.id || `DISP-${Math.floor(100000 + Math.random() * 900000)}`,
      orderId: order.id,
      openedBy: role,
      reason: selectedReason,
      description: disputeDescription,
      status: 'under_review',
      createdAt: new Date().toLocaleTimeString(),
      evidenceBuyer: role === 'buyer' ? evidenceFiles : order.dispute?.evidenceBuyer || [],
      evidenceSeller: role === 'seller' ? evidenceFiles : order.dispute?.evidenceSeller || [],
      timeline: newTimeline,
    };

    setDisputeStatus('under_review');
    onUpdateOrderDispute?.(order.id, updatedDispute);
    onShowToast?.('Dispute Submitted', 'Order state is frozen. Senior Arbiter Sarah is investigating.', 'info');
  };

  const handleSimulateResolution = (decision: 'release_to_buyer' | 'refund_to_seller') => {
    const isBuyerWin = decision === 'release_to_buyer';
    const resolution = {
      decision,
      reason: isBuyerWin
        ? 'Verified official bank transfer statement. Funds confirmed cleared into seller bank.'
        : 'Bank verification showed no matching fiat deposit received within authorized window.',
      releasedAmount: order.cryptoAmount,
      cryptoSymbol: order.cryptoSymbol,
      fiatAmount: order.fiatAmount,
      fiatCurrency: order.fiatCurrency,
      resolvedAt: new Date().toLocaleTimeString(),
      arbiterId: 'Arbiter #418 - Senior Financial Crimes Unit',
    };

    const updatedDispute: P2PDisputeInfo = {
      id: order.dispute?.id || `DISP-${Math.floor(100000 + Math.random() * 900000)}`,
      orderId: order.id,
      openedBy: role,
      reason: selectedReason,
      description: disputeDescription,
      status: 'resolved',
      createdAt: order.dispute?.createdAt || '15 mins ago',
      evidenceBuyer: evidenceFiles,
      evidenceSeller: ['merchant_bank_statement_log.pdf'],
      timeline: [
        ...(order.dispute?.timeline || []),
        {
          id: 't-resolved',
          status: 'resolved',
          title: 'Arbitration Decision Finalized',
          description: resolution.reason,
          timestamp: 'Just now',
          actor: 'arbiter',
        },
      ],
      resolution,
    };

    setDisputeStatus('resolved');
    onUpdateOrderDispute?.(order.id, updatedDispute);
    onShowToast?.(
      'Dispute Resolved',
      isBuyerWin
        ? `Crypto (${order.cryptoAmount} ${order.cryptoSymbol}) released to Buyer's wallet.`
        : `Crypto escrow refunded to Seller.`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in text-slate-100">
      <div className="w-full max-w-3xl bg-[#0A0D18] border border-rose-500/30 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#14080D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">P2P Dispute Arbitration Center</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                  Order Frozen
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Order ID: <span className="font-mono-num text-purple-300">{order.id}</span> • Viewing as{' '}
                <strong className="text-white capitalize">{userRole}</strong>
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

        {/* Order Freeze Alert Banner */}
        <div className="px-6 py-3 bg-rose-950/40 border-b border-rose-500/20 flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2.5 text-rose-300">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Escrow Protection Active:</strong> {order.cryptoAmount} {order.cryptoSymbol} (valued at ₦
              {order.fiatAmount.toLocaleString()}) is safely locked in OKNexus multisig vault until arbitration completes.
            </span>
          </div>

          {/* Simulate Arbiter Ruling (Demo Aid) */}
          <div className="hidden lg:flex items-center gap-1">
            <span className="text-[10px] text-slate-400">Arbiter Test Decision:</span>
            <button
              onClick={() => handleSimulateResolution('release_to_buyer')}
              className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30"
            >
              Rule for Buyer
            </button>
            <button
              onClick={() => handleSimulateResolution('refund_to_seller')}
              className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold border border-rose-500/30"
            >
              Rule for Seller
            </button>
          </div>
        </div>

        {/* Dispute Status Stepper */}
        <div className="px-6 py-3 border-b border-white/[0.06] bg-[#070A12] flex items-center justify-between text-xs overflow-x-auto no-scrollbar">
          {[
            { id: 'opened', label: 'Dispute Opened' },
            { id: 'evidence_collection', label: 'Evidence Upload' },
            { id: 'under_review', label: 'Under Review' },
            { id: 'decision_made', label: 'Decision Made' },
            { id: 'resolved', label: 'Resolved' },
          ].map((step, idx) => {
            const stepIndex = ['opened', 'evidence_collection', 'under_review', 'decision_made', 'resolved'].indexOf(
              disputeStatus
            );
            const isCompleted = idx <= stepIndex;
            const isCurrent = idx === stepIndex;

            return (
              <div key={step.id} className="flex items-center gap-2 whitespace-nowrap">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isCurrent
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-900/50'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/[0.06] text-slate-500'
                  }`}
                >
                  {isCompleted && !isCurrent ? '✓' : idx + 1}
                </div>
                <span className={`text-[11px] font-semibold ${isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                  {step.label}
                </span>
                {idx < 4 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
              </div>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* RESOLUTION CARD (if resolved) */}
          {disputeStatus === 'resolved' && order.dispute?.resolution && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0D2418] via-[#0A1A14] to-[#071012] border border-emerald-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <h4 className="font-extrabold text-base text-white">Final Arbitration Ruling</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono-num">
                  {order.dispute.resolution.resolvedAt}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Official Ruling:</span>
                  <span className="font-bold text-emerald-300 uppercase tracking-wide">
                    {order.dispute.resolution.decision === 'release_to_buyer' ? 'Release Escrow to Buyer' : 'Refund Escrow to Seller'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Amount Executed:</span>
                  <span className="font-mono-num font-extrabold text-white">
                    {order.cryptoAmount} {order.cryptoSymbol} (₦{order.fiatAmount.toLocaleString()})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Senior Arbiter:</span>
                  <span className="text-purple-300 font-medium">{order.dispute.resolution.arbiterId}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Justification:</strong> {order.dispute.resolution.reason}
              </p>
            </div>
          )}

          {/* MAIN DISPUTE FORM / EVIDENCE ZONE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column: Reason & Evidence Upload */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] space-y-3 text-xs">
                <h4 className="font-bold text-sm text-white">Dispute Reason & Claim</h4>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Select Disputed Issue:</label>
                  <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    disabled={disputeStatus === 'resolved'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white font-medium focus:outline-none focus:border-rose-500 text-xs"
                  >
                    {reasonsList.map((reason, idx) => (
                      <option key={idx} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Detailed Explanation:</label>
                  <textarea
                    value={disputeDescription}
                    onChange={(e) => setDisputeDescription(e.target.value)}
                    disabled={disputeStatus === 'resolved'}
                    rows={3}
                    placeholder="Provide step-by-step account of payment sent, reference memo, and bank confirmation..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-rose-500 resize-none text-xs"
                  />
                </div>
              </div>

              {/* Evidence Upload Zone */}
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-purple-400" /> Supporting Evidence
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono-num">{evidenceFiles.length} file(s) attached</span>
                </div>

                {/* Dropzone / Upload button */}
                {disputeStatus !== 'resolved' && (
                  <div
                    onClick={handleAddMockFile}
                    className="border-2 border-dashed border-white/15 hover:border-purple-500/50 rounded-xl p-4 text-center cursor-pointer transition-all bg-black/20 hover:bg-white/[0.02]"
                  >
                    <Upload className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <span className="font-bold text-slate-200 block">Click to Upload Banking Receipt / Proof</span>
                    <span className="text-[10px] text-slate-500">Supports PNG, JPG, PDF up to 25MB</span>
                  </div>
                )}

                {/* Attached Evidence List */}
                <div className="space-y-1.5">
                  {evidenceFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.06] flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2 text-slate-300 font-mono-num truncate">
                        <FileText className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span className="truncate">{file}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                        VERIFIED
                      </span>
                    </div>
                  ))}
                </div>

                {disputeStatus !== 'resolved' && disputeStatus !== 'under_review' && (
                  <button
                    onClick={handleSubmitDispute}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-white transition-all shadow-md active:scale-98 text-xs"
                  >
                    Submit Dispute to Arbiter &rarr;
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: In-Dispute Live Mediation Chat */}
            <div className="p-4 rounded-2xl bg-[#0D101C] border border-white/[0.07] flex flex-col h-[400px]">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06] mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-xs text-white">Arbiter Mediation Channel</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Chat Message Scroll Area */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                {disputeChat.map((msg) => {
                  const isSystem = msg.sender === 'system';
                  const isArbiter = msg.sender === 'arbiter';
                  const isMine = msg.sender === userRole;

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="p-2 rounded-xl bg-rose-950/20 border border-rose-500/20 text-center text-[10px] text-rose-300">
                        {msg.text}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-0.5 px-1 font-semibold flex items-center gap-1">
                        {isArbiter && <Shield className="w-3 h-3 text-purple-400 inline" />}
                        {msg.senderName} • {msg.timestamp}
                      </span>
                      <div
                        className={`p-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                          isArbiter
                            ? 'bg-purple-950/50 border border-purple-500/40 text-purple-100'
                            : isMine
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-900 border border-white/10 text-slate-200'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendChatMessage} className="pt-2.5 border-t border-white/[0.06] flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Send message to arbiter & counterparty..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors flex-shrink-0"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/[0.08] bg-[#0E1220]/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            Average OKNexus arbitration resolution turnaround: ~14 minutes
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
