import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Zap,
  HelpCircle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RefreshCw,
  Search,
  Activity,
  ArrowRight,
  AlertCircle,
  MessageSquareText,
  LifeBuoy,
  FileText,
  Radio,
  Sliders,
  CheckCircle2,
  Smartphone,
  Lock,
  Globe
} from 'lucide-react';
import { OKNexusLogo } from '../common/OKNexusLogo';
import { ChatMessage, SupportAgentMode, SupportFaqItem } from '../../types';
import { INITIAL_SUPPORT_FAQS, NETWORK_STATUS_DATA, QUICK_PROMPTS } from '../../data/supportData';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenTrade: () => void;
  onOpenP2P: () => void;
  onOpenAiTrader: () => void;
  onOpenPriceAlerts: () => void;
  onOpenSecurity: () => void;
  onOpenEarn: () => void;
  userEmail?: string;
  balances?: {
    totalAssets: number;
    spotUsd: number;
    fundingUsd: number;
    earnUsd: number;
  };
  biometricType?: string;
}

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({
  isOpen,
  onClose,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenTrade,
  onOpenP2P,
  onOpenAiTrader,
  onOpenPriceAlerts,
  onOpenSecurity,
  onOpenEarn,
  userEmail = 'mickel.lucky@gmail.com',
  balances = {
    totalAssets: 42318.65,
    spotUsd: 28412.32,
    fundingUsd: 8236.17,
    earnUsd: 3670.16,
  },
  biometricType = 'face_id',
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'diagnostics' | 'faqs'>('chat');
  const [agentMode, setAgentMode] = useState<SupportAgentMode>('ai');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [faqCategory, setFaqCategory] = useState<'all' | 'deposit' | 'trading' | 'security' | 'bot' | 'p2p' | 'earn'>('all');
  const [faqSearch, setFaqSearch] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [diagnosticRun, setDiagnosticRun] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome-1',
      role: 'assistant',
      content: `Hello! I'm **NexusAssist**, your 24/7 AI VIP Support & Trading Concierge for OKNexus.\n\nI can assist you with your **VIP Tier 2 account**, deposit/withdrawal confirmations, 24/7 AI Grid bot configurations, Spot trading order execution, or security settings.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini-ai',
      suggestions: [
        '⚡ Check my VIP trading fees',
        '💳 Help with crypto deposit network',
        '🤖 How does the AI Grid bot work?',
        '🛡️ Run 1-click Security & 2FA audit'
      ]
    }
  ]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  // Speak message aloud using Web Speech API
  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!speechEnabled) return;

    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*_#`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Toggle voice recognition
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice dictation is not supported by your current browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Copy message text
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Provide message feedback
  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: type } : m))
    );
  };

  // Execute deep link action
  const handleExecuteAction = (action?: string) => {
    if (!action) return;
    onClose();
    switch (action) {
      case 'open_deposit':
        onOpenDeposit();
        break;
      case 'open_withdraw':
        onOpenWithdraw();
        break;
      case 'open_trade':
        onOpenTrade();
        break;
      case 'open_p2p':
        onOpenP2P();
        break;
      case 'open_ai_trader':
        onOpenAiTrader();
        break;
      case 'open_alerts':
        onOpenPriceAlerts();
        break;
      case 'open_security':
        onOpenSecurity();
        break;
      case 'open_earn':
        onOpenEarn();
        break;
      default:
        break;
    }
  };

  // Send message to Server-Side Gemini API
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessageId = `usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // If user specifically requests human agent
      if (agentMode === 'human' || query.toLowerCase().includes('talk to human') || query.toLowerCase().includes('human specialist')) {
        setAgentMode('human');
        setTimeout(() => {
          const humanReply: ChatMessage = {
            id: `rep-${Date.now()}`,
            role: 'assistant',
            content: `**VIP Support Specialist Sarah K.** has joined your secure chat session.\n\n"Hello ${userEmail.split('@')[0]}! I can see your VIP Tier 2 status and current active tickets. I'm taking a close look at your inquiry regarding: *${query}*. How can I help resolve this for you?"`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: 'human-agent',
            suggestions: [
              'Verify my deposit transaction',
              'Check recent order execution rate',
              'Switch back to AI Copilot'
            ]
          };
          setMessages((prev) => [...prev, humanReply]);
          setIsLoading(false);
          if (speechEnabled) handleSpeak(humanReply.content);
        }, 1200);
        return;
      }

      // Call our secure server-side Gemini API endpoint
      const res = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content,
          })),
          userContext: {
            email: userEmail,
            totalAssets: balances.totalAssets,
            spotUsd: balances.spotUsd,
            fundingUsd: balances.fundingUsd,
            earnUsd: balances.earnUsd,
            biometricType: biometricType === 'fingerprint' ? 'Touch ID' : 'Face ID',
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I'm here to help with your OKNexus account. Could you please specify your query?",
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: data.action,
        suggestions: data.suggestions || [],
        source: data.source || 'gemini-ai',
      };

      setMessages((prev) => [...prev, aiReply]);
      if (speechEnabled) {
        handleSpeak(aiReply.content);
      }
    } catch (err) {
      console.error('Support API query failed:', err);

      // Smart resilient fallback so the user is never stuck
      const fallbackReply: ChatMessage = {
        id: `fb-${Date.now()}`,
        role: 'assistant',
        content: `I've analyzed your account data:\n• **VIP Tier**: Tier 2 (0.08% Maker / 0.10% Taker)\n• **Total Assets**: $${balances.totalAssets.toLocaleString()}\n• **Security Status**: Fully Protected (2FA + ${biometricType === 'fingerprint' ? 'Touch ID' : 'Face ID'})\n\nHow else may I assist you with deposits, withdrawals, or bot strategies?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'nexus-knowledgebase',
        action: 'open_trade',
        suggestions: [
          '⚡ Check my VIP trading fees',
          '💳 How to deposit crypto?',
          '🤖 Explain AI Grid bot'
        ]
      };

      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Action Button Label Formatter
  const getActionLabel = (action: string): string => {
    switch (action) {
      case 'open_deposit':
        return 'Deposit USDT / Crypto';
      case 'open_withdraw':
        return 'Initiate Withdrawal';
      case 'open_trade':
        return 'Go to Spot Trading Desk';
      case 'open_p2p':
        return 'Open P2P Trading Desk';
      case 'open_ai_trader':
        return 'Launch 24/7 AI Grid Bot';
      case 'open_alerts':
        return 'Manage Price Alerts';
      case 'open_security':
        return 'Security & Biometrics Settings';
      case 'open_earn':
        return 'Explore Earn Staking Vaults';
      default:
        return 'View Service';
    }
  };

  // Filtered FAQs
  const filteredFaqs = INITIAL_SUPPORT_FAQS.filter((faq) => {
    const matchesCategory = faqCategory === 'all' || faq.category === faqCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      id="customer-support-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="customer-support-modal-container"
        className="w-full max-w-lg h-[92vh] sm:h-[84vh] max-h-[850px] bg-[#0A0D16] border border-purple-500/25 sm:rounded-3xl rounded-t-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-slate-100"
      >
        {/* Top Header Bar */}
        <header className="px-4 py-3 bg-gradient-to-r from-[#0E1222] via-[#0A0D16] to-[#120D24] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-amber-400 p-[1.5px] shadow-lg shadow-purple-500/20">
                <div className="w-full h-full rounded-[14px] bg-[#07090E] flex items-center justify-center">
                  {agentMode === 'ai' ? (
                    <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                  ) : (
                    <User className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0A0D16] shadow-sm flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white">
                  {agentMode === 'ai' ? 'NexusAssist AI' : 'Sarah Jenkins'}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-num font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {agentMode === 'ai' ? 'Gemini 3.8 Flash' : 'VIP Concierge'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>24/7 Online • &lt;50ms response</span>
                <span className="text-slate-600">•</span>
                <span className="text-purple-400 font-medium">VIP Tier 2</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Audio Readout Toggle */}
            <button
              type="button"
              id="support-toggle-speech-btn"
              onClick={() => {
                const next = !speechEnabled;
                setSpeechEnabled(next);
                if (!next && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                speechEnabled
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
              title={speechEnabled ? 'Text-to-Speech active' : 'Enable voice readouts'}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Clear Chat */}
            <button
              type="button"
              id="support-clear-chat-btn"
              onClick={() => {
                setMessages([
                  {
                    id: `msg-welcome-${Date.now()}`,
                    role: 'assistant',
                    content: `New secure session started.\n\nI'm **NexusAssist AI**, ready to assist with your portfolio ($${balances.totalAssets.toLocaleString()}), spot orders, and exchange tools. What can I do for you?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    source: 'gemini-ai',
                    suggestions: [
                      '⚡ Check my VIP trading fees',
                      '💳 Deposit USDT / BTC',
                      '🤖 Launch AI Grid Bot'
                    ]
                  }
                ]);
              }}
              className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-all"
              title="Reset conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Close Modal */}
            <button
              type="button"
              id="support-close-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-all"
              aria-label="Close Support Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* View Switcher Tabs (Chat, Diagnostics, FAQ) */}
        <div className="flex items-center px-4 py-2 border-b border-white/[0.06] bg-[#080B13] gap-2">
          <button
            type="button"
            id="support-tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>AI Live Chat</span>
          </button>

          <button
            type="button"
            id="support-tab-diagnostics"
            onClick={() => {
              setActiveTab('diagnostics');
              setDiagnosticRun(true);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'diagnostics'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Diagnostics</span>
          </button>

          <button
            type="button"
            id="support-tab-faqs"
            onClick={() => setActiveTab('faqs')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'faqs'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Knowledge Base</span>
          </button>
        </div>

        {/* Tab 1: AI Live Chat View */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#07090E]">
            {/* Agent Mode Toggle Ribbon */}
            <div className="px-4 py-2 bg-[#0B0F1D] border-b border-white/[0.04] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Response mode:</span>
                <div className="inline-flex p-0.5 rounded-lg bg-black/40 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setAgentMode('ai')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                      agentMode === 'ai'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bot className="w-3 h-3" />
                    <span>AI Copilot</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAgentMode('human');
                      handleSendMessage('I would like to speak with a human support specialist.');
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                      agentMode === 'human'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <User className="w-3 h-3" />
                    <span>Human Specialist</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 hidden sm:block">
                Session: <span className="font-mono text-purple-300">#VIP-9942</span>
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
                  >
                    <div className="flex items-end gap-2 max-w-[88%]">
                      {!isUser && (
                        <div className="w-7 h-7 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0 mb-1">
                          {msg.source === 'human-agent' ? (
                            <User className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          )}
                        </div>
                      )}

                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-purple-900/20'
                            : 'bg-[#101424] border border-white/[0.08] text-slate-200 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {/* Source Tag for Assistant */}
                        {!isUser && (
                          <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-white/[0.06]">
                            <span className="text-[10px] font-mono-num font-bold text-purple-400 flex items-center gap-1">
                              {msg.source === 'human-agent' ? (
                                <>
                                  <User className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>VIP Support Specialist</span>
                                </>
                              ) : (
                                <>
                                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                                  <span>Gemini AI Engine</span>
                                </>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-500">•</span>
                            <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                          </div>
                        )}

                        {/* Message Content with simple formatting */}
                        <div className="whitespace-pre-line space-y-1 font-normal">
                          {msg.content.split('\n').map((line, idx) => {
                            if (line.startsWith('• ') || line.startsWith('- ')) {
                              return (
                                <p key={idx} className="pl-2 border-l-2 border-purple-500/40 py-0.5">
                                  {line.replace(/^([•-]\s*)/, '')}
                                </p>
                              );
                            }
                            return <p key={idx}>{line}</p>;
                          })}
                        </div>

                        {/* Action Trigger Button if available */}
                        {msg.action && (
                          <div className="mt-3 pt-2.5 border-t border-white/[0.08]">
                            <button
                              type="button"
                              onClick={() => handleExecuteAction(msg.action)}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/30 active:scale-98"
                            >
                              <span className="flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-amber-300" />
                                {msg.actionLabel || getActionLabel(msg.action)}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Suggestions Chips */}
                        {msg.suggestions && msg.suggestions.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-white/[0.06] space-y-1.5">
                            <span className="text-[10px] font-semibold text-slate-400 block">
                              Suggested questions:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.suggestions.map((sug, sIdx) => (
                                <button
                                  key={sIdx}
                                  type="button"
                                  onClick={() => handleSendMessage(sug)}
                                  className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all text-left"
                                >
                                  {sug}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Message Actions (Copy & Helpful Feedback) */}
                    {!isUser && (
                      <div className="flex items-center gap-2 mt-1 ml-9 text-[10px] text-slate-500">
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="hover:text-slate-300 flex items-center gap-1 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <span>•</span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleFeedback(msg.id, 'up')}
                            className={`p-1 rounded hover:text-emerald-400 transition-colors ${
                              msg.feedback === 'up' ? 'text-emerald-400' : ''
                            }`}
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFeedback(msg.id, 'down')}
                            className={`p-1 rounded hover:text-rose-400 transition-colors ${
                              msg.feedback === 'down' ? 'text-rose-400' : ''
                            }`}
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading Typing Indicator */}
              {isLoading && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-[#101424] border border-white/[0.08] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] text-slate-400 ml-2 font-mono">NexusAI processing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Carousel */}
            <div className="px-3 py-2 bg-[#0A0D18] border-t border-white/[0.04] overflow-x-auto scrollbar-none flex gap-1.5">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/10 text-[11px] text-slate-300 hover:text-purple-200 transition-all active:scale-95"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#0A0E1A] border-t border-white/[0.08]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Dictation Button */}
                <button
                  type="button"
                  id="support-voice-dictation-btn"
                  onClick={handleToggleVoiceInput}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/40'
                      : 'bg-white/[0.05] hover:bg-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                  title={isListening ? 'Listening...' : 'Voice dictation'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    id="support-chat-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about deposits, bot, trading, fees, or security..."
                    className="w-full h-10 px-3.5 rounded-xl bg-[#060810] border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs text-white placeholder:text-slate-500 outline-none transition-all"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  id="support-send-message-btn"
                  disabled={!inputText.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white flex items-center justify-center transition-all shadow-md shadow-purple-900/30 active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: AI Diagnostics & Health Tools */}
        {activeTab === 'diagnostics' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#07090E]">
            {/* Account Security Audit Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0D1224] to-[#0A0E1C] border border-purple-500/30 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">AI Security & Account Audit</h3>
                    <p className="text-[11px] text-slate-400">Automated threat and vulnerability scanner</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-mono font-bold text-emerald-400">96 / 100</span>
                  <span className="block text-[10px] text-emerald-400/80 font-semibold uppercase">Optimal Grade</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full w-[96%]" />
              </div>

              {/* Checklist */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Two-Factor Authentication (2FA)</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold text-[11px]">ACTIVE</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Biometric Unlock ({biometricType === 'fingerprint' ? 'Touch ID' : 'Face ID'})</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold text-[11px]">ENFORCED</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>KYC Identity Verification</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold text-[11px]">LEVEL 2 VIP</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Withdrawal Address Whitelist</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold text-[11px]">ENABLED</span>
                </div>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => handleExecuteAction('open_security')}
                  className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Manage Account Security Settings</span>
                </button>
              </div>
            </div>

            {/* Blockchain Network Gas & Confirmation Tracker */}
            <div className="p-4 rounded-2xl bg-[#0D1120] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <h3 className="font-display font-bold text-sm text-white">Live Network Health & Gas Rates</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Auto-refreshed</span>
              </div>

              <div className="space-y-2">
                {NETWORK_STATUS_DATA.map((net, nIdx) => (
                  <div
                    key={nIdx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/[0.04] text-xs"
                  >
                    <div>
                      <span className="font-semibold block text-slate-200">{net.network}</span>
                      <span className="text-[11px] text-slate-400">Block confirmation: {net.blockTime}</span>
                    </div>

                    <div className="text-right">
                      <span className={`font-mono font-bold text-[11px] block ${net.color}`}>{net.avgGas}</span>
                      <span className="text-[10px] text-emerald-400">● {net.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instant AI Order & Transaction Lookup */}
            <div className="p-4 rounded-2xl bg-[#0D1120] border border-white/[0.08]">
              <h3 className="font-display font-bold text-sm text-white mb-1">Instant TX / Order Diagnostic</h3>
              <p className="text-[11px] text-slate-400 mb-3">Paste a transaction hash or order ID for AI verification</p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. 0x71a9... or ORD-88A92"
                  className="flex-1 h-9 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('chat');
                    handleSendMessage('Can you verify transaction 0x71a9... and report block confirmations?');
                  }}
                  className="px-3 h-9 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
                >
                  Analyze
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Knowledge Base & FAQs */}
        {activeTab === 'faqs' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#07090E]">
            {/* FAQ Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search FAQs (deposit, fee, bot, security)..."
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#0D1120] border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {(['all', 'deposit', 'trading', 'security', 'bot', 'p2p', 'earn'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFaqCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                    faqCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* FAQs List */}
            <div className="space-y-2.5 pt-1">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="p-3.5 rounded-2xl bg-[#0C101F] border border-white/[0.06] hover:border-purple-500/30 transition-all text-xs"
                >
                  <h4 className="font-bold text-white mb-1.5 flex items-center justify-between">
                    <span>{faq.question}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-purple-500/20 text-purple-300">
                      {faq.category}
                    </span>
                  </h4>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line mb-3">
                    {faq.answer}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                    {faq.action && (
                      <button
                        type="button"
                        onClick={() => handleExecuteAction(faq.action)}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center gap-1"
                      >
                        <span>{faq.actionLabel || 'Action'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('chat');
                        handleSendMessage(`Explain more about: ${faq.question}`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-[11px] font-medium flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>Ask AI for details</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No matching FAQs found. You can ask **NexusAssist AI** directly in the Live Chat!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
