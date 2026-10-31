// src/components/ConnectModal.jsx
import React, { useState } from 'react';
import { X, Mail, Shield, ExternalLink, AlertTriangle, CheckCircle, Copy, Check } from 'lucide-react';
import { fetchGoogleAuthUrl } from '../api';

export function ConnectModal({ isOpen, onClose, onStartDemo, oauthConfigured }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleConnectGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGoogleAuthUrl();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err.message || 'Failed to start Google OAuth.');
      setLoading(false);
    }
  };

  const copyRedirectUri = () => {
    navigator.clipboard.writeText('http://localhost:3001/api/auth/google/callback');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0f1624] border border-cyan-500/40 rounded-2xl shadow-neon-cyan p-6 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950">
            <Mail className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h2 className="font-arcade text-xl font-bold text-white tracking-wide">
              CONNECT REAL GMAIL
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              OAuth 2.0 with minimal required permissions
            </p>
          </div>
        </div>

        {/* Permissions Scope Card */}
        <div className="bg-[#141e30] border border-slate-700/80 rounded-xl p-4 mb-5 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold font-mono">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Scope: gmail.modify</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Grants permission to remove the <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">INBOX</code> label (Archive), add Star, or move junk to Trash.
          </p>
          <ul className="text-slate-400 space-y-1 list-disc list-inside text-[11px]">
            <li>Does NOT read sensitive payment or passwords</li>
            <li>Zero emails stored on external databases</li>
            <li>Trash actions are recoverable for 30 days</li>
          </ul>
        </div>

        {/* OAuth Config Status */}
        {oauthConfigured ? (
          <div className="space-y-4">
            <button
              onClick={handleConnectGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-arcade font-bold tracking-wider text-base transition shadow-neon-emerald cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>CONNECTING TO GOOGLE...</span>
              ) : (
                <>
                  <Mail className="w-5 h-5 fill-current" />
                  <span>SIGN IN WITH GOOGLE</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center font-mono">
              Redirects to official Google OAuth consent screen.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-left">
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Google OAuth credentials not yet added to .env</span>
              </div>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                To test with a real Gmail account, add <code className="bg-amber-950/60 px-1 py-0.5 rounded text-white">GOOGLE_CLIENT_ID</code> and <code className="bg-amber-950/60 px-1 py-0.5 rounded text-white">GOOGLE_CLIENT_SECRET</code> to your <code className="text-white">.env</code> file.
              </p>
            </div>

            <div className="bg-slate-900/90 rounded-lg p-3 text-[11px] font-mono border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>Authorized redirect URI:</span>
                <button
                  onClick={copyRedirectUri}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-cyan-300 break-all select-all">
                http://localhost:3001/api/auth/google/callback
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  onStartDemo();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-arcade font-bold tracking-wider text-sm transition shadow-neon-cyan cursor-pointer"
              >
                <span>CONTINUE IN DEMO MODE (100% READY)</span>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

      </div>
    </div>
  );
}
