import React, { useState } from 'react';
import { X, Lock, Mail, User, Heart, Sparkles, Check, Phone, Calendar, DollarSign } from 'lucide-react';
import { db, DEFAULT_USER } from '../services/databaseService';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: UserProfile) => void;
  onSuccessLogin?: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess, onSuccessLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [weddingDate, setWeddingDate] = useState('2026-11-18');
  const [targetBudget, setTargetBudget] = useState(45000);
  const [error, setError] = useState('');

  const triggerAuthCallback = (u: UserProfile) => {
    if (onAuthSuccess) onAuthSuccess(u);
    if (onSuccessLogin) onSuccessLogin(u);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }

    if (mode === 'login') {
      const user = db.login(email, password);
      triggerAuthCallback(user);
      onClose();
    } else {
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: name || email.split('@')[0],
        partnerName,
        email,
        phone: phone || '+1 (555) 000-0000',
        role: 'customer',
        weddingDate,
        targetBudget,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date().toISOString(),
      };
      db.setCurrentUser(newUser);
      triggerAuthCallback(newUser);
      onClose();
    }
  };

  const handleQuickDemoLogin = (profileType: 'priya' | 'sarah') => {
    if (profileType === 'priya') {
      db.setCurrentUser(DEFAULT_USER);
      triggerAuthCallback(DEFAULT_USER);
    } else {
      const sarahUser: UserProfile = {
        id: 'usr_sarah_david_99',
        name: 'Sarah & David Goldstein',
        partnerName: 'David Goldstein',
        email: 'sarah.goldstein@elysianweddings.com',
        phone: '+1 (555) 789-2244',
        role: 'customer',
        weddingDate: '2026-12-05',
        targetBudget: 60000,
        location: 'Bayfront & Harbor Estates',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        createdAt: '2026-02-01T10:00:00Z',
      };
      db.setCurrentUser(sarahUser);
      triggerAuthCallback(sarahUser);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="auth-modal-container"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5E0D5] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#1A1A1A] text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C5A059] flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider block">
                  Elysian Wedlock VIP Portal
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  {mode === 'login' ? 'Welcome Back' : 'Create Wedding Account'}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-stone-300 text-xs mt-2">
            Access your saved favorite vendors, live vendor chat messages, and confirmed wedding reservations.
          </p>
        </div>

        {/* Quick 1-Click Demo Profiles */}
        <div className="p-4 bg-[#F9F7F2] border-b border-[#E5E0D5] space-y-2">
          <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block">
            Instant Demo Sign-In (1-Click)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('priya')}
              className="p-2 bg-white rounded-xl border border-[#E5E0D5] hover:border-[#C5A059] text-left transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#C5A059]/20 text-[#8C6A24] flex items-center justify-center text-[10px] font-bold">
                  P&M
                </div>
                <div className="truncate">
                  <strong className="text-xs text-[#1A1A1A] block group-hover:text-[#8C6A24] truncate">
                    Priya & Michael
                  </strong>
                  <span className="text-[10px] text-[#666666]">Nov 18, 2026</span>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('sarah')}
              className="p-2 bg-white rounded-xl border border-[#E5E0D5] hover:border-[#C5A059] text-left transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#246A42]/20 text-[#246A42] flex items-center justify-center text-[10px] font-bold">
                  S&D
                </div>
                <div className="truncate">
                  <strong className="text-xs text-[#1A1A1A] block group-hover:text-[#246A42] truncate">
                    Sarah & David
                  </strong>
                  <span className="text-[10px] text-[#666666]">Dec 5, 2026</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E5E0D5] bg-white">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold text-center transition-all cursor-pointer ${
              mode === 'login'
                ? 'text-[#1A1A1A] border-b-2 border-[#C5A059] bg-[#F7F3EB]/40'
                : 'text-[#666666] hover:text-[#1A1A1A]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold text-center transition-all cursor-pointer ${
              mode === 'signup'
                ? 'text-[#1A1A1A] border-b-2 border-[#C5A059] bg-[#F7F3EB]/40'
                : 'text-[#666666] hover:text-[#1A1A1A]'
            }`}
          >
            New Couple Registration
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#666666] flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#888888]" /> Primary Couple Name(s) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya & Michael Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#666666] flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[#888888]" /> Partner Name
                  </label>
                  <input
                    type="text"
                    placeholder="Michael"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#666666] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#888888]" /> Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#666666] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#888888]" /> Wedding Date
                  </label>
                  <input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#666666] flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-[#888888]" /> Target Budget ($)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(Number(e.target.value))}
                    className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#666666] flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#888888]" /> Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="bride_groom@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#666666] flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#888888]" /> Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full py-3 px-4 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-2"
          >
            <Check className="w-4 h-4" />
            <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Complete Registration & Open Dashboard'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
