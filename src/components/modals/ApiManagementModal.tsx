import React, { useState } from 'react';
import { X, Key, Plus, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ApiManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiManagementModal: React.FC<ApiManagementModalProps> = ({ isOpen, onClose }) => {
  const [keys, setKeys] = useState([
    {
      id: 'api-1',
      name: 'Trading Bot (Read/Write)',
      keyPrefix: 'okn_live_89a7••••••••',
      created: '2026-08-14',
      permissions: ['Read', 'Spot Trade'],
    },
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setKeys([
      ...keys,
      {
        id: `api-${Date.now()}`,
        name: newKeyName.trim(),
        keyPrefix: `okn_live_${Math.random().toString(36).substring(2, 6)}••••••••`,
        created: 'Just now',
        permissions: ['Read', 'Spot Trade'],
      },
    ]);
    setNewKeyName('');
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    setKeys(keys.filter((k) => k.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#0F1320] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 text-slate-100 safe-area-bottom max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">API Key Management</h3>
              <p className="text-[11px] text-slate-400">Automate spot orders & market data feed</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Keys */}
        <div className="space-y-2.5 mb-4">
          {keys.map((k) => (
            <div key={k.id} className="p-3.5 rounded-2xl bg-[#080B14] border border-white/[0.08] text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white text-sm">{k.name}</span>
                <button
                  onClick={() => handleDelete(k.id)}
                  className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                  title="Delete key"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="font-mono text-slate-400 text-[11px] mb-2">{k.keyPrefix}</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {k.permissions.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 text-[10px] font-semibold border border-purple-500/25"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {isCreating ? (
          <form onSubmit={handleCreate} className="p-3.5 rounded-2xl bg-[#080B14] border border-purple-500/30 mb-4 space-y-3">
            <input
              type="text"
              placeholder="Key Name (e.g., Python Bot 1)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#14192B] border border-white/10 text-xs text-white outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-sm"
              >
                Save Key
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-2 rounded-xl bg-white/10 text-slate-300 text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-3 rounded-2xl border border-dashed border-purple-500/40 text-purple-300 hover:bg-purple-500/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 mb-4"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New API Key</span>
          </button>
        )}

        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Never share your API Secret. IP whitelisting is enforced for withdrawals.</span>
        </div>
      </div>
    </div>
  );
};
