import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  User, 
  Building2, 
  Utensils, 
  Camera, 
  Palette, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Download,
  Info,
  CheckCircle2
} from 'lucide-react';
import { ALL_WEBSITE_CREDENTIALS, DemoCredentialAccount } from '../data/credentialsData';
import { db } from '../services/databaseService';
import { UserProfile, AuthRoleType } from '../types';

interface CredentialsDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount?: (account: DemoCredentialAccount) => void;
  onShowToast: (msg: string) => void;
}

export const CredentialsDirectoryModal: React.FC<CredentialsDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  onShowToast
}) => {
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'customer' | 'vendor'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldId: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    onShowToast(`Copied ${label} to clipboard! 📋`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleShowPassword = (accId: string) => {
    setShowPasswordMap(prev => ({
      ...prev,
      [accId]: !prev[accId]
    }));
  };

  const handle1ClickSignIn = (acc: DemoCredentialAccount) => {
    const user = db.loginAsDemoRole(acc.demoKey);
    onShowToast(`Signed in successfully as ${acc.name} (${acc.roleLabel}) 🚀`);
    if (onSelectAccount) {
      onSelectAccount(acc);
    }
    onClose();
  };

  const filteredCredentials = ALL_WEBSITE_CREDENTIALS.filter(item => {
    const matchesRole = filterRole === 'all' || item.role === filterRole;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      item.name.toLowerCase().includes(q) || 
      item.email.toLowerCase().includes(q) || 
      item.roleLabel.toLowerCase().includes(q) ||
      (item.businessName && item.businessName.toLowerCase().includes(q)) ||
      item.location.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const handleDownloadCredentialsTxt = () => {
    let content = `====================================================\n`;
    content += `   ELYSIAN WEDLOCK - OFFICIAL DEMO CREDENTIALS REGISTRY\n`;
    content += `   All System IDs, Passwords & Role Access Keys\n`;
    content += `====================================================\n\n`;

    ALL_WEBSITE_CREDENTIALS.forEach((acc, idx) => {
      content += `[${idx + 1}] ROLE: ${acc.roleLabel.toUpperCase()}\n`;
      content += `Name: ${acc.name}\n`;
      if (acc.businessName) content += `Business: ${acc.businessName}\n`;
      content += `Email / ID: ${acc.email}\n`;
      content += `Password: ${acc.password}\n`;
      content += `Alt Quick Password: ${acc.altPassword || 'admin123'}\n`;
      content += `Location: ${acc.location}\n`;
      content += `Permissions:\n`;
      acc.permissions.forEach(p => {
        content += `  - ${p}\n`;
      });
      content += `\n----------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Elysian_Wedlock_All_IDs_and_Passwords.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Downloaded complete credentials sheet! 📄');
  };

  const getRoleIcon = (acc: DemoCredentialAccount) => {
    if (acc.role === 'admin') return <ShieldCheck className="w-4 h-4 text-amber-400" />;
    if (acc.role === 'customer') return <User className="w-4 h-4 text-emerald-600" />;
    if (acc.subRole === 'hall') return <Building2 className="w-4 h-4 text-amber-600" />;
    if (acc.subRole === 'caterer') return <Utensils className="w-4 h-4 text-rose-600" />;
    if (acc.subRole === 'photographer') return <Camera className="w-4 h-4 text-indigo-600" />;
    if (acc.subRole === 'decor') return <Palette className="w-4 h-4 text-purple-600" />;
    return <Sparkles className="w-4 h-4 text-[#C5A059]" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="credentials-directory-modal"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E5E0D5] overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-[#1A1A1A] text-white p-6 sm:p-7 relative border-b border-[#2C2A28] shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#8C6A24] text-white flex items-center justify-center shadow-lg ring-2 ring-[#C5A059]/30">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] px-2 py-0.5 bg-[#C5A059]/10 rounded border border-[#C5A059]/30">
                    Master Access Directory
                  </span>
                  <span className="text-[10px] text-stone-400">8 Pre-Seeded Profiles</span>
                </div>
                <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white mt-1">
                  All Website IDs & Passwords
                </h2>
                <p className="text-stone-300 text-xs mt-0.5">
                  Complete cheat sheet for Super Admin, Host/Couple clients, and all 4 Vendor sectors.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadCredentialsTxt}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer border border-white/10"
                title="Download Credentials Text File"
              >
                <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Export TXT</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="mt-4 p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>You can copy credentials to test standard login forms or click <strong>"1-Click Sign In"</strong> for instant auto-login.</span>
            </div>
            <button
              onClick={() => handle1ClickSignIn(ALL_WEBSITE_CREDENTIALS[0])}
              className="px-2.5 py-1 bg-amber-500 text-black text-[11px] font-bold rounded-lg hover:bg-amber-400 transition-all shrink-0 cursor-pointer shadow-xs"
            >
              Quick Super Admin Login
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-[#F9F7F2] border-b border-[#E5E0D5] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterRole === 'all' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'bg-white border border-[#E5E0D5] text-[#666666] hover:bg-stone-50'
              }`}
            >
              All Accounts ({ALL_WEBSITE_CREDENTIALS.length})
            </button>
            <button
              onClick={() => setFilterRole('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterRole === 'admin' ? 'bg-[#1A1A1A] text-[#C5A059] shadow-xs' : 'bg-white border border-[#E5E0D5] text-[#666666] hover:bg-stone-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin (1)</span>
            </button>
            <button
              onClick={() => setFilterRole('customer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterRole === 'customer' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-white border border-[#E5E0D5] text-[#666666] hover:bg-stone-50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Host / Clients (3)</span>
            </button>
            <button
              onClick={() => setFilterRole('vendor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterRole === 'vendor' ? 'bg-[#8C6A24] text-white shadow-xs' : 'bg-white border border-[#E5E0D5] text-[#666666] hover:bg-stone-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Vendors (4)</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, name, email..."
              className="w-full pl-8 pr-3 py-1.5 bg-white rounded-xl border border-[#E5E0D5] text-xs outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FDFCFB]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCredentials.map((acc) => {
              const isPasswordVisible = !!showPasswordMap[acc.id];
              return (
                <div 
                  key={acc.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col justify-between hover:shadow-md ${
                    acc.role === 'admin' ? 'border-[#C5A059] ring-1 ring-[#C5A059]/30 bg-gradient-to-br from-white to-[#FDFCF9]' : 'border-[#E5E0D5]'
                  }`}
                >
                  <div>
                    {/* Top Row: Role Badge & Location */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(acc)}
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${acc.badgeColor}`}>
                          {acc.roleLabel}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#888888] font-medium">{acc.location}</span>
                    </div>

                    {/* Name & Business */}
                    <div className="flex items-center gap-3 mb-3.5">
                      <img 
                        src={acc.avatarUrl} 
                        alt={acc.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover border border-[#E5E0D5] shadow-2xs shrink-0" 
                      />
                      <div className="min-w-0 flex-1">
                        <strong className="text-sm text-[#1A1A1A] block font-serif-luxury truncate">{acc.name}</strong>
                        {acc.businessName ? (
                          <span className="text-xs text-[#8C6A24] font-medium block truncate">{acc.businessName}</span>
                        ) : (
                          <span className="text-[11px] text-[#666666] block truncate">{acc.description}</span>
                        )}
                      </div>
                    </div>

                    {/* Credentials Box */}
                    <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5E0D5] space-y-2 mb-3 font-mono text-xs">
                      
                      {/* Email / ID */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-[#888888] block font-sans font-bold uppercase tracking-wider">User ID / Email:</span>
                          <span className="text-[#1A1A1A] font-bold text-xs truncate block select-all">{acc.email}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(acc.email, `${acc.id}-email`, 'Email')}
                          className="p-1.5 rounded-lg bg-white border border-[#E5E0D5] hover:bg-stone-100 text-[#666666] transition-colors cursor-pointer shrink-0"
                          title="Copy Email"
                        >
                          {copiedField === `${acc.id}-email` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Password */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E5E0D5]/60">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[#888888] font-sans font-bold uppercase tracking-wider">Password:</span>
                            {acc.altPassword && (
                              <span className="text-[9px] text-amber-700 bg-amber-100 px-1 rounded font-sans font-semibold">
                                Or: {acc.altPassword}
                              </span>
                            )}
                          </div>
                          <span className="text-[#1A1A1A] font-bold text-xs block select-all">
                            {isPasswordVisible ? acc.password : '••••••••••••'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleShowPassword(acc.id)}
                            className="p-1.5 rounded-lg bg-white border border-[#E5E0D5] hover:bg-stone-100 text-[#666666] transition-colors cursor-pointer"
                            title={isPasswordVisible ? "Hide Password" : "Show Password"}
                          >
                            {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(acc.password, `${acc.id}-pass`, 'Password')}
                            className="p-1.5 rounded-lg bg-white border border-[#E5E0D5] hover:bg-stone-100 text-[#666666] transition-colors cursor-pointer"
                            title="Copy Password"
                          >
                            {copiedField === `${acc.id}-pass` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Permissions list bullets */}
                    <div className="space-y-1 mb-4">
                      <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block">Access Permissions:</span>
                      <ul className="text-[11px] text-[#555555] space-y-0.5">
                        {acc.permissions.slice(0, 2).map((p, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-1.5">
                            <span className="text-[#C5A059] shrink-0 font-bold">•</span>
                            <span className="line-clamp-1">{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 1-Click Direct Sign In */}
                  <button
                    type="button"
                    onClick={() => handle1ClickSignIn(acc)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                      acc.role === 'admin'
                        ? 'bg-[#1A1A1A] hover:bg-black text-[#C5A059] ring-1 ring-[#C5A059]/50'
                        : acc.role === 'customer'
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        : 'bg-[#8C6A24] hover:bg-[#72541a] text-white'
                    }`}
                  >
                    <span>1-Click Sign In as {acc.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F9F7F2] border-t border-[#E5E0D5] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-[#666666]">
            All credentials work across standard email/password inputs and 1-click test switchers.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-[#1A1A1A] text-white text-xs font-bold hover:bg-black transition-all cursor-pointer"
          >
            Done / Close Directory
          </button>
        </div>

      </div>
    </div>
  );
};
