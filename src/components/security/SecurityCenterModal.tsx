import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Key,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  Monitor,
  Laptop,
  Globe,
  Clock,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { UserDeviceSession, UserLoginRecord } from '../../types';

interface SecurityCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onShowToast?: (title: string, message: string, type?: 'success' | 'alert' | 'info') => void;
}

export const SecurityCenterModal: React.FC<SecurityCenterModalProps> = ({
  isOpen,
  onClose,
  userEmail = 'mickel.lucky@gmail.com',
  onShowToast,
}) => {
  // Navigation tabs within Security Center
  const [activeTab, setActiveTab] = useState<'overview' | '2fa' | 'password' | 'sessions' | 'anti_phishing' | 'withdrawal' | 'backup_codes'>('overview');

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [twoFactorSecretKey] = useState('JBSWY3DPEHPK3PXP');
  const [totpInputCode, setTotpInputCode] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  // Backup codes state
  const [backupCodes, setBackupCodes] = useState<string[]>([
    '8921-4402',
    '3190-7814',
    '6542-1983',
    '9012-3341',
    '7741-2094',
    '5189-6632',
    '4490-8120',
    '1298-5034',
  ]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  // Anti-phishing code
  const [antiPhishingCode, setAntiPhishingCode] = useState('OKN-SECURE-99');
  const [newAntiPhishingInput, setNewAntiPhishingInput] = useState('');
  const [isEditingAntiPhishing, setIsEditingAntiPhishing] = useState(false);

  // Withdrawal security
  const [whitelistOnlyWithdrawals, setWhitelistOnlyWithdrawals] = useState(true);
  const [lock24hOnSecurityChange, setLock24hOnSecurityChange] = useState(true);

  // New device alerts
  const [newDeviceAlerts, setNewDeviceAlerts] = useState(true);

  // Active Sessions
  const [sessions, setSessions] = useState<UserDeviceSession[]>([
    {
      id: 'sess-1',
      deviceName: 'MacBook Pro 16" (M3 Max)',
      browser: 'Chrome 128.0',
      os: 'macOS Sonoma',
      location: 'London, United Kingdom',
      ipAddress: '194.26.29.112',
      lastActive: 'Active now',
      isCurrent: true,
      status: 'active',
    },
    {
      id: 'sess-2',
      deviceName: 'iPhone 15 Pro Max',
      browser: 'OKNexus Mobile App 3.4.1',
      os: 'iOS 17.5',
      location: 'London, United Kingdom',
      ipAddress: '194.26.29.112',
      lastActive: '2 hours ago',
      isCurrent: false,
      status: 'active',
    },
    {
      id: 'sess-3',
      deviceName: 'iPad Pro 12.9"',
      browser: 'Safari 17.2',
      os: 'iPadOS',
      location: 'Manchester, United Kingdom',
      ipAddress: '86.14.103.88',
      lastActive: '3 days ago',
      isCurrent: false,
      status: 'active',
    },
  ]);

  // Login History
  const [loginHistory] = useState<UserLoginRecord[]>([
    {
      id: 'log-1',
      deviceName: 'MacBook Pro 16" (Chrome)',
      location: 'London, UK',
      ipAddress: '194.26.29.112',
      timestamp: 'Today, 11:42 AM',
      status: 'success',
    },
    {
      id: 'log-2',
      deviceName: 'iPhone 15 Pro (App)',
      location: 'London, UK',
      ipAddress: '194.26.29.112',
      timestamp: 'Yesterday, 08:15 PM',
      status: 'success',
    },
    {
      id: 'log-3',
      deviceName: 'Unknown Device (Firefox)',
      location: 'Frankfurt, Germany',
      ipAddress: '45.138.74.20',
      timestamp: 'Sep 05, 03:22 AM',
      status: 'blocked',
    },
    {
      id: 'log-4',
      deviceName: 'iPad Pro (Safari)',
      location: 'Manchester, UK',
      ipAddress: '86.14.103.88',
      timestamp: 'Sep 03, 02:40 PM',
      status: 'success',
    },
  ]);

  if (!isOpen) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(twoFactorSecretKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    onShowToast?.('Secret Key Copied', 'Paste this secret key into Google Authenticator or 1Password.', 'info');
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedBackupCodes(true);
    setTimeout(() => setCopiedBackupCodes(false), 2000);
    onShowToast?.('Backup Codes Copied', 'Store these codes in a safe offline location.', 'success');
  };

  const handleRegenerateBackupCodes = () => {
    const newCodes = Array.from({ length: 8 }, () =>
      `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
    );
    setBackupCodes(newCodes);
    setShowRegenerateConfirm(false);
    onShowToast?.('Backup Codes Regenerated', 'Old recovery codes have been permanently invalidated.', 'success');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      onShowToast?.('Validation Error', 'Please enter your current and new password.', 'alert');
      return;
    }
    if (newPassword !== confirmPassword) {
      onShowToast?.('Mismatch', 'New password and confirmation do not match.', 'alert');
      return;
    }
    if (newPassword.length < 8) {
      onShowToast?.('Too Weak', 'Password must be at least 8 characters long.', 'alert');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setActiveTab('overview');
    onShowToast?.('Password Updated', 'Your login password was changed. Active 24h withdrawal security rule triggered.', 'success');
  };

  const handleSaveAntiPhishing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAntiPhishingInput.trim()) return;
    setAntiPhishingCode(newAntiPhishingInput.trim().toUpperCase());
    setIsEditingAntiPhishing(false);
    setNewAntiPhishingInput('');
    onShowToast?.('Anti-Phishing Code Updated', 'Your official emails from OKNexus will now display this code.', 'success');
  };

  const handleTerminateSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    onShowToast?.('Session Terminated', 'The device was signed out and its access token was revoked.', 'info');
  };

  const handleTerminateAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    onShowToast?.('All Other Sessions Revoked', 'Signed out from 2 remote devices.', 'success');
  };

  // Security score calculation
  const securityItems = [
    twoFactorEnabled,
    backupCodes.length > 0,
    antiPhishingCode.length > 0,
    whitelistOnlyWithdrawals,
    newDeviceAlerts,
    lock24hOnSecurityChange,
  ];
  const securityScore = Math.round((securityItems.filter(Boolean).length / securityItems.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0B0E18] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0E1220]/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">Security Center</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Level: Advanced
                </span>
              </div>
              <p className="text-xs text-slate-400">Manage 2FA, authenticator keys, sessions, and withdrawal safeguards</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Score Banner */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-purple-950/40 via-[#120F24] to-[#0A1020] border-b border-white/[0.06] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="3" className="text-white/10" fill="transparent" />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-emerald-400"
                  fill="transparent"
                  strokeDasharray="113"
                  strokeDashoffset={113 - (113 * securityScore) / 100}
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-white font-mono-num">{securityScore}%</span>
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Account Protection Rating:</span>
                <span className="text-emerald-400 font-extrabold">Excellent</span>
              </div>
              <p className="text-[11px] text-slate-400">All vital defenses are active. Your funds in escrow and spot vaults are safeguarded.</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-[11px] text-slate-300">
              UID: 8829410
            </span>
          </div>
        </div>

        {/* Sub-nav tabs */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b border-white/[0.06] overflow-x-auto no-scrollbar text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'overview' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('2fa')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === '2fa' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Google Authenticator (2FA)
          </button>
          <button
            onClick={() => setActiveTab('backup_codes')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'backup_codes' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Backup Codes
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'password' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Login Password
          </button>
          <button
            onClick={() => setActiveTab('anti_phishing')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'anti_phishing' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Anti-Phishing
          </button>
          <button
            onClick={() => setActiveTab('withdrawal')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'withdrawal' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Withdrawal Guard
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'sessions' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Sessions & Logs
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              {/* 2FA Card */}
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Two-Factor Authentication (2FA)</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Enabled
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Used for withdrawals, API keys, and sensitive security updates.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('2fa')}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap"
                >
                  Manage &rarr;
                </button>
              </div>

              {/* Backup Codes Card */}
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Emergency Recovery Codes</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {backupCodes.length} Available
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Single-use emergency codes when your authenticator device is lost.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('backup_codes')}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap"
                >
                  View Codes &rarr;
                </button>
              </div>

              {/* Login Password Card */}
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Login Password</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-extrabold bg-slate-800 text-slate-300">
                        Changed 45d ago
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">High-entropy alphanumeric password with symbol salt.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('password')}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap"
                >
                  Change &rarr;
                </button>
              </div>

              {/* Anti-Phishing Card */}
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Anti-Phishing Code</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-mono-num font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {antiPhishingCode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Included in all official OKNexus security notifications.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('anti_phishing')}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap"
                >
                  Configure &rarr;
                </button>
              </div>

              {/* Quick Session Summary */}
              <div className="p-4 rounded-2xl bg-[#0B0E18] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="w-4 h-4 text-purple-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Active Sessions ({sessions.length} Devices)</span>
                    <span className="text-[11px] text-slate-400">Current device: London, UK (Chrome on macOS)</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('sessions')}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300"
                >
                  Manage Sessions
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE AUTHENTICATOR (2FA) */}
          {activeTab === '2fa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-white block mb-0.5">Two-Factor Authentication Status</span>
                  2FA adds an extra layer of defense when signing in, withdrawing crypto, or creating P2P merchant orders.
                </div>
              </div>

              {/* Status Switch Card */}
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span>Google Authenticator (TOTP)</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">Compatible with Google Authenticator, Authy, and 1Password</span>
                </div>

                <button
                  onClick={() => {
                    if (twoFactorEnabled) {
                      setTwoFactorEnabled(false);
                      onShowToast?.('2FA Disabled', 'Two-factor authentication has been turned off.', 'alert');
                    } else {
                      setShowTwoFactorSetup(true);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    twoFactorEnabled
                      ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                      : 'bg-purple-600 text-white hover:bg-purple-500'
                  }`}
                >
                  {twoFactorEnabled ? 'Disable 2FA' : 'Set Up 2FA'}
                </button>
              </div>

              {/* QR Code & Pairing Section (Setup or View) */}
              {(showTwoFactorSetup || twoFactorEnabled) && (
                <div className="p-5 rounded-2xl bg-[#090C16] border border-white/10 space-y-4">
                  <h4 className="font-bold text-xs uppercase text-slate-300 tracking-wider">Authenticator Pairing Instructions</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                    {/* Stylized QR Code Component */}
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-md border border-slate-200">
                      <div className="w-36 h-36 bg-white p-1 flex flex-col items-center justify-center relative">
                        {/* High-fidelity SVG QR Representation */}
                        <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                          <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                          <rect x="11" y="11" width="13" height="13" />
                          <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                          <rect x="76" y="11" width="13" height="13" />
                          <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                          <rect x="11" y="76" width="13" height="13" />
                          {/* Grid matrix dots */}
                          <rect x="36" y="8" width="6" height="6" />
                          <rect x="48" y="8" width="6" height="6" />
                          <rect x="42" y="20" width="6" height="6" />
                          <rect x="56" y="22" width="6" height="6" />
                          <rect x="8" y="38" width="6" height="6" />
                          <rect x="22" y="44" width="6" height="6" />
                          <rect x="38" y="38" width="10" height="10" />
                          <rect x="52" y="42" width="6" height="6" />
                          <rect x="72" y="38" width="6" height="6" />
                          <rect x="84" y="48" width="6" height="6" />
                          <rect x="38" y="70" width="6" height="6" />
                          <rect x="52" y="76" width="8" height="8" />
                          <rect x="72" y="70" width="12" height="6" />
                          <rect x="86" y="80" width="6" height="6" />
                        </svg>
                      </div>
                      <span className="text-[10px] text-slate-700 font-bold mt-2">Scan in Google Authenticator</span>
                    </div>

                    {/* Manual Key & Backup Step */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 block mb-1">Manual Setup Key:</span>
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-white/10 font-mono-num text-sm text-purple-300">
                          <span className="flex-1 select-all">{twoFactorSecretKey}</span>
                          <button
                            onClick={handleCopyKey}
                            className="p-1 rounded bg-white/[0.08] hover:bg-white/15 text-white transition-colors"
                            title="Copy setup key"
                          >
                            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 leading-relaxed">
                        ⚠️ <strong>Important:</strong> Save this setup key on paper or password manager. If you change or lose your phone, this key allows immediate restoration.
                      </div>
                    </div>
                  </div>

                  {/* Verification Code Confirmation Step */}
                  <div className="pt-3 border-t border-white/[0.08]">
                    <span className="text-xs font-bold text-white block mb-1.5">Verify 6-Digit Code to Confirm:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={totpInputCode}
                        onChange={(e) => setTotpInputCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 481920"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white font-mono-num text-base tracking-widest text-center w-36 focus:outline-none focus:border-purple-500"
                      />
                      <button
                        onClick={() => {
                          if (totpInputCode.length === 6) {
                            setTwoFactorEnabled(true);
                            setShowTwoFactorSetup(false);
                            setTotpInputCode('');
                            onShowToast?.('2FA Verified & Active', 'Your Google Authenticator pairing is confirmed and active.', 'success');
                          } else {
                            onShowToast?.('Invalid Code', 'Please enter a 6-digit TOTP code.', 'alert');
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
                      >
                        Confirm Pairing
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BACKUP CODES */}
          {activeTab === 'backup_codes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">Emergency Recovery Codes</h4>
                  <span className="text-xs text-amber-400 font-bold">{backupCodes.length} remaining</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Each backup code can be used once to access your OKNexus account if you lose your phone or cannot receive 2FA prompts.
                </p>
              </div>

              {/* Codes Grid */}
              <div className="p-4 rounded-2xl bg-[#090C16] border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <button
                    onClick={() => setShowBackupCodes(!showBackupCodes)}
                    className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    {showBackupCodes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{showBackupCodes ? 'Hide Codes' : 'Reveal Backup Codes'}</span>
                  </button>

                  <button
                    onClick={handleCopyBackupCodes}
                    className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    {copiedBackupCodes ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy All</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-center font-mono-num text-xs font-bold text-purple-300 select-all"
                    >
                      {showBackupCodes ? code : '••••-••••'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Regenerate Action */}
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-rose-300 block">Regenerate Recovery Codes</span>
                    <span className="text-[11px] text-slate-400">Invalidates all current backup codes immediately.</span>
                  </div>

                  {!showRegenerateConfirm ? (
                    <button
                      onClick={() => setShowRegenerateConfirm(true)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 transition-colors"
                    >
                      Regenerate
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRegenerateBackupCodes}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setShowRegenerateConfirm(false)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LOGIN PASSWORD */}
          {activeTab === 'password' && (
            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] space-y-1">
                <h4 className="font-bold text-sm text-white">Update Login Password</h4>
                <p className="text-xs text-slate-400">
                  Changing your password triggers an automatic 24-hour lock on withdrawals to protect your wallet from takeover.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPass1 ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass1(!showPass1)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      {showPass1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPass2 ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters with numbers & symbols"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass2(!showPass2)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      {showPass2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  Update Password
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: ANTI-PHISHING CODE */}
          {activeTab === 'anti_phishing' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">Anti-Phishing Verification</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  When enabled, all official emails and security alerts from OKNexus will display your unique anti-phishing code in the header to guarantee authenticity.
                </p>
              </div>

              {/* Current Anti-phishing code display */}
              <div className="p-4 rounded-2xl bg-[#090C16] border border-white/10 space-y-3">
                <span className="text-xs text-slate-400 block font-semibold">Current Active Code:</span>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/10">
                  <span className="font-mono-num font-extrabold text-base text-cyan-400 tracking-wider">
                    {antiPhishingCode}
                  </span>
                  <button
                    onClick={() => setIsEditingAntiPhishing(true)}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300"
                  >
                    Edit Code
                  </button>
                </div>
              </div>

              {/* Edit form */}
              {isEditingAntiPhishing && (
                <form onSubmit={handleSaveAntiPhishing} className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                  <span className="text-xs font-bold text-white block">Enter New Anti-Phishing Code (4–16 Characters):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={16}
                      value={newAntiPhishingInput}
                      onChange={(e) => setNewAntiPhishingInput(e.target.value.toUpperCase())}
                      placeholder="e.g. SAFE-NEXUS-2026"
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white font-mono-num text-xs uppercase flex-1 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingAntiPhishing(false)}
                      className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Email Sample Preview */}
              <div className="p-4 rounded-2xl bg-[#080A12] border border-white/[0.06] space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Preview in Official OKNexus Email:</span>
                <div className="p-3 rounded-xl bg-[#0D101E] border border-white/[0.08] space-y-1.5">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
                    <span className="font-bold text-white">OKNexus Security Dispatch</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono-num text-[10px] font-bold">
                      Anti-Phishing: {antiPhishingCode}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Dear Trader, your withdrawal request for 1,000 USDT has been successfully broadcast to Tron Network...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: WITHDRAWAL SECURITY */}
          {activeTab === 'withdrawal' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] space-y-1">
                <h4 className="font-bold text-sm text-white">Withdrawal Safeguards</h4>
                <p className="text-xs text-slate-400">
                  Protect your assets with whitelisted target addresses and mandatory cooldown periods on credential changes.
                </p>
              </div>

              {/* Whitelist Only Withdrawals */}
              <div className="p-4 rounded-2xl bg-[#090C16] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-white">Whitelist-Only Address Book</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${whitelistOnlyWithdrawals ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {whitelistOnlyWithdrawals ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Withdrawals can ONLY be sent to pre-approved addresses saved in your whitelist.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setWhitelistOnlyWithdrawals(!whitelistOnlyWithdrawals);
                    onShowToast?.(
                      'Whitelist Policy Updated',
                      whitelistOnlyWithdrawals ? 'Address whitelist disabled.' : 'Withdrawals locked to whitelisted addresses only.',
                      'info'
                    );
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    whitelistOnlyWithdrawals ? 'bg-purple-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      whitelistOnlyWithdrawals ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 24-Hour Cooldown On Security Changes */}
              <div className="p-4 rounded-2xl bg-[#090C16] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-white">24h Withdrawal Lock on Security Modifications</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      ENFORCED
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Modifying password, resetting 2FA, or changing registered email locks withdrawals for 24 hours.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setLock24hOnSecurityChange(!lock24hOnSecurityChange);
                    onShowToast?.('Lock Policy Updated', '24h security lock preference updated.', 'info');
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    lock24hOnSecurityChange ? 'bg-purple-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      lock24hOnSecurityChange ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* New Device Alerts */}
              <div className="p-4 rounded-2xl bg-[#090C16] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-white">New-Device Login Alerts</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      ACTIVE
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Sends instant SMS and email notifications whenever an unrecognized browser or IP signs in.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNewDeviceAlerts(!newDeviceAlerts);
                    onShowToast?.('Alerts Updated', 'New device notification preferences updated.', 'info');
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    newDeviceAlerts ? 'bg-purple-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      newDeviceAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: SESSIONS & LOGIN HISTORY */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              {/* Active Sessions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">Active Device Sessions ({sessions.length})</h4>
                  {sessions.length > 1 && (
                    <button
                      onClick={handleTerminateAllOtherSessions}
                      className="text-xs font-bold text-rose-400 hover:text-rose-300"
                    >
                      Terminate All Other Sessions
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                        session.isCurrent
                          ? 'bg-purple-950/20 border-purple-500/30'
                          : 'bg-[#0F1322] border-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-slate-300 flex-shrink-0">
                          {session.deviceName.includes('iPhone') || session.deviceName.includes('iPad') ? (
                            <Smartphone className="w-4 h-4" />
                          ) : (
                            <Laptop className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{session.deviceName}</span>
                            {session.isCurrent && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-extrabold text-[9px]">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{session.location}</span>
                            <span>•</span>
                            <span className="font-mono-num">{session.ipAddress}</span>
                            <span>•</span>
                            <span className="text-purple-300">{session.lastActive}</span>
                          </div>
                        </div>
                      </div>

                      {!session.isCurrent && (
                        <button
                          onClick={() => handleTerminateSession(session.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-[11px] font-bold border border-rose-500/30 transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Login History Table */}
              <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                <h4 className="font-bold text-sm text-white">Recent Login Activity</h4>
                <div className="space-y-1.5">
                  {loginHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[#090C16] border border-white/[0.06] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.status === 'success'
                              ? 'bg-emerald-400'
                              : item.status === 'blocked'
                              ? 'bg-rose-400'
                              : 'bg-amber-400'
                          }`}
                        />
                        <div>
                          <span className="font-bold text-slate-200 block">{item.deviceName}</span>
                          <span className="text-[11px] text-slate-400">
                            {item.location} ({item.ipAddress})
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                            item.status === 'success'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-rose-500/15 text-rose-400'
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-mono-num mt-0.5">{item.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/[0.08] bg-[#0E1220]/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>256-bit HSM Vault Protection Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
