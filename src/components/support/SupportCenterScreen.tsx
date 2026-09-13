import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Headphones,
  ShieldCheck,
  Zap,
  HelpCircle,
  Clock,
  Send,
  Sparkles,
  Bot,
  User,
  ChevronRight,
  ChevronDown,
  Plus,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileText,
  Mail,
  ExternalLink,
  LifeBuoy,
  CreditCard,
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Copy,
  Check,
  Sliders,
  DollarSign,
  PhoneCall,
  Flame,
} from 'lucide-react';
import { SupportTicket, TicketPriority, TicketStatus, ThemeMode, ChatMessage } from '../../types';
import { INITIAL_SUPPORT_FAQS, NETWORK_STATUS_DATA } from '../../data/supportData';
import { SupportSkeleton } from '../skeletons/SupportSkeleton';

interface SupportCenterScreenProps {
  onBack: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenTrade: () => void;
  onOpenP2P: () => void;
  onOpenAiTrader: () => void;
  onOpenSecurity: () => void;
  userEmail?: string;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  isLoading?: boolean;
}

const DEFAULT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-94281',
    subject: 'USDT (TRC20) Deposit confirmation status',
    category: 'Deposit & Withdrawal',
    priority: 'high',
    status: 'in_progress',
    createdAt: 'Today, 14:22 UTC',
    updatedAt: '12m ago',
    description: 'Sent 1,500 USDT from external wallet. TxHash: 7a8f9c0e1d2c... Confirmations reached 12/12.',
    txHashOrOrderId: '7a8f9c0e1d2c3b4a5f6e7d8c9b0a1f2e',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'You',
        content: 'Hi, I sent 1,500 USDT via TRC20 20 minutes ago. The blockchain explorer shows confirmed, but balance is still updating.',
        timestamp: '14:22 UTC',
      },
      {
        id: 'msg-2',
        sender: 'agent',
        senderName: 'Alex M. (OKNexus Support)',
        content: 'Hello! Our node has verified your transaction. It is currently clearing internal AML node checks and will credit automatically within 3 minutes.',
        timestamp: '14:28 UTC',
      },
    ],
  },
  {
    id: 'tkt-2',
    ticketNumber: 'TKT-88104',
    subject: 'VIP Fee tier discount recalculation',
    category: 'Fees & VIP Program',
    priority: 'medium',
    status: 'resolved',
    createdAt: 'Yesterday, 09:15 UTC',
    updatedAt: 'Yesterday, 10:04 UTC',
    description: '30-day volume exceeded $100,000 USD. Requesting automated upgrade to VIP Tier 2.',
    messages: [
      {
        id: 'msg-3',
        sender: 'user',
        senderName: 'You',
        content: 'Can you please review my spot trade volume? I crossed 120,000 USDT yesterday.',
        timestamp: '09:15 UTC',
      },
      {
        id: 'msg-4',
        sender: 'agent',
        senderName: 'Sarah K. (VIP Desk)',
        content: 'Your account has been upgraded to VIP Tier 2 with Maker 0.06% / Taker 0.08%. Thank you for trading with OKNexus!',
        timestamp: '10:04 UTC',
      },
    ],
  },
];

export const SupportCenterScreen: React.FC<SupportCenterScreenProps> = ({
  onBack,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenTrade,
  onOpenP2P,
  onOpenAiTrader,
  onOpenSecurity,
  userEmail = 'mickel.lucky@gmail.com',
  theme = 'dark',
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');
  const [activeTab, setActiveTab] = useState<'help' | 'chat' | 'tickets'>('help');

  // Tickets state
  const [tickets, setTickets] = useState<SupportTicket[]>(DEFAULT_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New ticket form
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('Deposit & Withdrawal');
  const [newTicketPriority, setNewTicketPriority] = useState<TicketPriority>('medium');
  const [newTicketTxHash, setNewTicketTxHash] = useState('');
  const [newTicketDesc, setNewTicketDesc] = useState('');
  const [ticketSubmitSuccess, setTicketSubmitSuccess] = useState(false);

  // Live Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        'Hello! I am your 24/7 OKNexus Concierge. How can I assist your trading desk today? You can ask about deposits, trading fees, API security, or 2FA assistance.',
      timestamp: 'Just now',
      source: 'gemini-ai',
      suggestions: [
        'How long do TRC20 deposits take?',
        'What are my VIP trading fees?',
        'How do I set up Google 2FA?',
        'Report an uncredited transfer',
      ],
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Help Categories
  const categories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle, count: 24 },
    { id: 'deposit', name: 'Deposit & Withdrawal', icon: ArrowUpRight, count: 8 },
    { id: 'security', name: 'Security & 2FA', icon: Lock, count: 6 },
    { id: 'trading', name: 'Spot & Futures Trading', icon: Zap, count: 5 },
    { id: 'p2p', name: 'P2P Fiat Desk', icon: CreditCard, count: 4 },
    { id: 'fees', name: 'Fees & VIP Program', icon: DollarSign, count: 3 },
  ];

  // Quick Self-Service Solutions
  const quickSolutions = [
    {
      title: 'Missing Deposit Self-Recovery',
      desc: 'Retrieve uncredited crypto with your TxHash in < 60s',
      action: onOpenDeposit,
      icon: ArrowDownLeft,
      badge: 'Self-Service',
      color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Reset Google Authenticator / 2FA',
      desc: 'Verify KYC face scan to safely reset 2FA access',
      action: onOpenSecurity,
      icon: Lock,
      badge: 'Security',
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'P2P Order Dispute & Escrow',
      desc: 'Connect with a live arbitration officer for frozen transfers',
      action: onOpenP2P,
      icon: ShieldCheck,
      badge: '100% Escrow',
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Trading Fee Rate Inquiries',
      desc: 'View Maker/Taker breakdown and OKN fee discount activation',
      action: onOpenTrade,
      icon: DollarSign,
      badge: 'VIP Tier 2',
      color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
  ];

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return INITIAL_SUPPORT_FAQS.filter((faq) => {
      const matchCat =
        selectedCategory === 'all' || faq.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (isLoading) {
    return <SupportSkeleton onBack={onBack} />;
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Submit Ticket
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketDesc.trim()) return;

    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
      subject: newTicketSubject.trim(),
      category: newTicketCategory,
      priority: newTicketPriority,
      status: 'open',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      description: newTicketDesc.trim(),
      txHashOrOrderId: newTicketTxHash.trim() || undefined,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          senderName: 'You',
          content: newTicketDesc.trim(),
          timestamp: 'Just now',
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    setIsCreatingTicket(false);
    setNewTicketSubject('');
    setNewTicketDesc('');
    setNewTicketTxHash('');
    setTicketSubmitSuccess(true);
    setTimeout(() => setTicketSubmitSuccess(false), 5000);
  };

  // Chat Send
  const handleSendChat = (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyContent = `Thank you for your inquiry regarding: "${text}". Our system records your account (${userEmail}) as VIP Tier 2. `;
      let action: string | undefined = undefined;
      let actionLabel: string | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('deposit') || lower.includes('trc20') || lower.includes('erc20')) {
        replyContent +=
          'TRC20 deposits require 12 block confirmations (~1-3 minutes). ERC20 requires 12 confirmations (~2-5 minutes). If your transaction is already confirmed on TronScan or Etherscan, it will automatically register within moments.';
        action = 'open_deposit';
        actionLabel = 'Check Deposit Portal';
      } else if (lower.includes('fee') || lower.includes('rate') || lower.includes('vip')) {
        replyContent +=
          'Your VIP Tier 2 status grants a Spot Maker fee of 0.0600% and Taker fee of 0.0800%. Convert swaps are 100% fee-free (0.00%).';
        action = 'open_trade';
        actionLabel = 'View Spot Trade Rates';
      } else if (lower.includes('2fa') || lower.includes('authenticator') || lower.includes('security')) {
        replyContent +=
          'For your protection, changing or resetting 2FA initiates a 24-hour withdrawal security cooling period. You can manage Google Authenticator in Security settings.';
        action = 'open_security';
        actionLabel = 'Security Settings';
      } else {
        replyContent +=
          'I have logged your request in our VIP queue. A senior operations specialist is active on this thread. You may also submit a formal ticket for detailed blockchain trace verification.';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: 'Just now',
        source: 'gemini-ai',
        action,
        actionLabel,
      };

      setChatMessages((prev) => [...prev, botMsg]);
    }, 900);
  };

  const getPriorityBadge = (p: TicketPriority) => {
    switch (p) {
      case 'urgent':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'medium':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusBadge = (s: TicketStatus) => {
    switch (s) {
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'waiting_user':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    }
  };

  return (
    <div
      id="support-center-screen"
      className="min-h-screen bg-slate-50 dark:bg-[#07090E] text-[#0F172A] dark:text-[#EDF1F5] pb-24 transition-colors"
    >
      {/* Header Bar (Desktop only, MobileTopBar handles mobile) */}
      <header className="hidden md:block sticky top-0 z-30 bg-white/90 dark:bg-[#0A0E13]/90 backdrop-blur-md border-b border-[#D7E0EB] dark:border-[#1E2633] px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141B24] active:scale-95 transition-all"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
                  <span>OKNexus Customer Service</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h1>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#8E98A6] hidden sm:block">
                Exchange-grade support desk • 24/7/365 global assistance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Avg. Response: &lt; 2m</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5">
        {/* Hero Search Section */}
        <section className="mb-6 rounded-3xl bg-gradient-to-br from-purple-900/20 via-slate-900/10 to-indigo-900/20 p-5 sm:p-8 border border-purple-500/20 shadow-xs relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>24/7 AI-Assisted Help Center</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              How can we assist you today?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4">
              Search through hundreds of verified trading, deposit, security, and API guides.
            </p>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search issues (e.g., 'missing deposit', 'reset 2FA', 'maker fee')..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-[#0E141B] border border-slate-300 dark:border-[#242E3B] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-xs placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* View Switcher Tabs (Help & FAQ | 24/7 AI Concierge | Support Tickets) */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#D7E0EB] dark:border-[#1E2633] pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'help'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-[#141B24]'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Help Topics & FAQs</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 relative ${
              activeTab === 'chat'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-[#141B24]'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>Live AI Concierge</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'tickets'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-[#141B24]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Tickets ({tickets.length})</span>
          </button>
        </div>

        {/* TAB 1: HELP & FAQ */}
        {activeTab === 'help' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Quick Solutions Grid */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span>Quick Self-Service Solutions</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {quickSolutions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={item.action}
                    className="p-4 rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] hover:border-purple-500/50 dark:hover:bg-[#141B24] cursor-pointer active:scale-[0.99] transition-all group shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center ${item.color}`}
                        >
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.04] flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 gap-1">
                      <span>Launch Solution</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Help Topics Categories */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Browse By Category
              </h3>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white dark:bg-[#0E141B] border-[#D7E0EB] dark:border-[#1E2633] text-slate-700 dark:text-slate-300 hover:border-purple-400'
                      }`}
                    >
                      <cat.icon className="w-3.5 h-3.5" />
                      <span>{cat.name}</span>
                      <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-[#141B24] text-slate-500'}`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* FAQ Accordion Section */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Frequently Asked Questions ({filteredFaqs.length})
                </h3>
              </div>

              {filteredFaqs.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-[#0E141B] rounded-2xl border border-[#D7E0EB] dark:border-[#1E2633]">
                  <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching different keywords or switch to the Live AI Concierge tab.
                  </p>
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaqId(isExpanded ? null : faq.id)
                        }
                        className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-[#141B24]/50 transition-colors"
                      >
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-purple-600' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-white/[0.04] text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
                          <p className="whitespace-pre-line">{faq.answer}</p>
                          {faq.action && (
                            <button
                              onClick={() => {
                                if (faq.action === 'open_deposit') onOpenDeposit();
                                if (faq.action === 'open_trade') onOpenTrade();
                                if (faq.action === 'open_security') onOpenSecurity();
                                if (faq.action === 'open_ai_trader') onOpenAiTrader();
                                if (faq.action === 'open_p2p') onOpenP2P();
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800/40 hover:bg-purple-100 transition-colors"
                            >
                              <span>{faq.actionLabel || 'Proceed'}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </section>

            {/* Network Gas & Infrastructure Live Radar */}
            <section className="p-5 rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Blockchain Settlement Nodes Status
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400">Live 10s sync</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {NETWORK_STATUS_DATA.map((net, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-200/60 dark:border-white/[0.04]"
                  >
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {net.network}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {net.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Gas: {net.avgGas}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Information & Channels */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Email Support Desk
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    support@oknexus.exchange
                  </p>
                  <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 mt-1 block">
                    15-min SLA guarantee
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Security Hot Emergency
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Immediate account freeze hotline
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">
                    Zero-wait priority
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Service Hours
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    24 Hours / 7 Days / 365 Days
                  </p>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 mt-1 block">
                    Active global coverage
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: LIVE AI CONCIERGE CHAT */}
        {activeTab === 'chat' && (
          <div className="rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] overflow-hidden shadow-xs flex flex-col h-[650px] animate-in fade-in duration-200">
            {/* Chat Header */}
            <div className="p-4 border-b border-[#D7E0EB] dark:border-[#1E2633] bg-slate-50 dark:bg-[#141B24] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>OKNexus Concierge (AI + VIP Desk)</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Connected to Gemini Neural Protocol • VIP Priority
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  setChatMessages([
                    {
                      id: 'welcome-reset',
                      role: 'assistant',
                      content: 'Chat session refreshed. How may I assist your portfolio today?',
                      timestamp: 'Just now',
                      source: 'gemini-ai',
                    },
                  ])
                }
                className="text-xs text-slate-500 hover:text-purple-600 flex items-center gap-1"
                title="Reset Chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        isUser
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`max-w-[80%] space-y-2`}>
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-purple-600 text-white rounded-tr-none'
                            : 'bg-slate-100 dark:bg-[#141B24] text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/70 dark:border-white/[0.04]'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.content}</p>

                        {msg.action && (
                          <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
                            <button
                              onClick={() => {
                                if (msg.action === 'open_deposit') onOpenDeposit();
                                if (msg.action === 'open_trade') onOpenTrade();
                                if (msg.action === 'open_security') onOpenSecurity();
                              }}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-purple-500 transition-colors shadow-xs"
                            >
                              <span>{msg.actionLabel || 'Proceed'}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* AI Quick Suggestions */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendChat(sug)}
                              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 active:scale-95 transition-all text-left"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Bot className="w-4 h-4 text-purple-500 animate-spin" />
                  <span>OKNexus Concierge is formulating an answer...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-[#D7E0EB] dark:border-[#1E2633] bg-white dark:bg-[#0E141B] flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChat();
                }}
                placeholder="Type your question or issue description..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#141B24] border border-slate-200 dark:border-[#242E3B] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={!chatInput.trim()}
                className="p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: TICKETS & INQUIRIES */}
        {activeTab === 'tickets' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Header + Action */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ticket Submission & Resolution History
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track ongoing blockchain investigations, fee appeals, and security requests.
                </p>
              </div>

              <button
                onClick={() => setIsCreatingTicket(!isCreatingTicket)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isCreatingTicket ? 'Cancel' : 'Open New Ticket'}</span>
              </button>
            </div>

            {ticketSubmitSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Your ticket has been submitted. A specialist will review it within 15 minutes.</span>
              </div>
            )}

            {/* Create Ticket Form */}
            {isCreatingTicket && (
              <form
                onSubmit={handleCreateTicket}
                className="p-5 rounded-3xl bg-white dark:bg-[#0E141B] border border-purple-500/30 shadow-md space-y-4 animate-in slide-in-from-top-2 duration-150"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>Submit Formal Support Ticket</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">SLA: &lt; 15 mins</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Issue Category
                    </label>
                    <select
                      value={newTicketCategory}
                      onChange={(e) => setNewTicketCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-300 dark:border-[#242E3B] text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-purple-500"
                    >
                      <option>Deposit & Withdrawal</option>
                      <option>Spot & Futures Trading</option>
                      <option>Security & 2FA</option>
                      <option>P2P Fiat Trading</option>
                      <option>Fees & VIP Program</option>
                      <option>API Key & Webhook Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Priority Level
                    </label>
                    <select
                      value={newTicketPriority}
                      onChange={(e) => setNewTicketPriority(e.target.value as TicketPriority)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-300 dark:border-[#242E3B] text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-purple-500"
                    >
                      <option value="low">Low (General question)</option>
                      <option value="medium">Medium (Account/Fee question)</option>
                      <option value="high">High (Deposit delayed &gt; 30 mins)</option>
                      <option value="urgent">Urgent (Account compromise / security)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Subject Summary
                  </label>
                  <input
                    type="text"
                    required
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    placeholder="Brief description of the issue..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-300 dark:border-[#242E3B] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    TxHash / Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={newTicketTxHash}
                    onChange={(e) => setNewTicketTxHash(e.target.value)}
                    placeholder="e.g. 0x8f2d... or TRC20 hash"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-300 dark:border-[#242E3B] text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Detailed Explanation
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newTicketDesc}
                    onChange={(e) => setNewTicketDesc(e.target.value)}
                    placeholder="Provide full details including dates, amounts, and relevant context..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-300 dark:border-[#242E3B] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingTicket(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#141B24]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            )}

            {/* Tickets List */}
            <div className="space-y-3">
              {tickets.map((tkt) => (
                <div
                  key={tkt.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] hover:border-purple-500/40 transition-all shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-purple-600 dark:text-purple-400">
                        {tkt.ticketNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(tkt.status)}`}>
                        {tkt.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(tkt.priority)}`}>
                        {tkt.priority.toUpperCase()}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tkt.updatedAt}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {tkt.subject}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {tkt.description}
                  </p>

                  {tkt.txHashOrOrderId && (
                    <div className="mt-2 text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                      <span>Tx:</span>
                      <span className="truncate max-w-[200px]">{tkt.txHashOrOrderId}</span>
                      <button
                        onClick={() => handleCopy(tkt.txHashOrOrderId!, tkt.id)}
                        className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5"
                      >
                        {copiedId === tkt.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  )}

                  {/* Messages Thread preview */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{tkt.messages.length} messages in thread</span>
                    </span>

                    <button
                      onClick={() => {
                        setSelectedTicket(selectedTicket?.id === tkt.id ? null : tkt);
                      }}
                      className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <span>{selectedTicket?.id === tkt.id ? 'Hide Details' : 'View Thread'}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedTicket?.id === tkt.id ? 'rotate-90' : ''}`} />
                    </button>
                  </div>

                  {/* Expanded Thread */}
                  {selectedTicket?.id === tkt.id && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-white/[0.06] space-y-3">
                      {tkt.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`p-3 rounded-xl text-xs ${
                            m.sender === 'user'
                              ? 'bg-purple-50 dark:bg-purple-950/40 ml-4'
                              : 'bg-slate-100 dark:bg-[#141B24] mr-4'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                            <span className={m.sender === 'user' ? 'text-purple-700 dark:text-purple-300' : 'text-slate-700 dark:text-slate-300'}>
                              {m.senderName}
                            </span>
                            <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{m.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
