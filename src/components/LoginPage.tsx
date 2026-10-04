import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';
import { 
  Building2, 
  HeartHandshake, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Mail, 
  Lock, 
  User as UserIcon, 
  UtensilsCrossed, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    registerWithEmail, 
    handleDemoLogin 
  } = useApp();

  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [role, setRole] = useState<UserRole>('donor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (tab === 'register') {
        await registerWithEmail(name || 'Food Rescue User', email || 'user@foodrescue.org', password || '123456', role);
      } else {
        await loginWithEmail(email || 'user@foodrescue.org', password || '123456', role);
      }
    } catch (err) {
      console.warn('Auth form error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle(role);
    } catch (err) {
      console.warn('Google sign-in click error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white font-sans animate-fadeIn">
      
      {/* Top Brand Bar */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <UtensilsCrossed className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="font-black text-base text-white leading-tight">Food Rescue Network</h1>
            <p className="text-[10px] text-emerald-400 font-bold tracking-wider">REAL-TIME FIRESTORE BACKEND</p>
          </div>
        </div>

        <button
          onClick={() => handleDemoLogin('donor')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 hover:border-emerald-500 text-emerald-400 transition-colors flex items-center gap-2"
        >
          <span>Instant Demo Login</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 space-y-8 shadow-2xl relative">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTHENTICATION PORTAL</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Welcome to Food Rescue</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Connect surplus food from events & restaurants directly to nearby NGOs and shelters in real-time.
            </p>
          </div>

          {/* Role Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 block text-center uppercase tracking-wider">
              1. Choose Your Role Persona:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('donor')}
                className={`p-3 rounded-2xl font-extrabold text-xs border flex flex-col items-center gap-1.5 transition-all ${
                  role === 'donor'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30 scale-105'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span>Donor</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('ngo')}
                className={`p-3 rounded-2xl font-extrabold text-xs border flex flex-col items-center gap-1.5 transition-all ${
                  role === 'ngo'
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/30 scale-105'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <HeartHandshake className="w-5 h-5" />
                <span>NGO / Shelter</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('volunteer')}
                className={`p-3 rounded-2xl font-extrabold text-xs border flex flex-col items-center gap-1.5 transition-all ${
                  role === 'volunteer'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30 scale-105'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Truck className="w-5 h-5" />
                <span>Volunteer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-3 rounded-2xl font-extrabold text-xs border flex flex-col items-center gap-1.5 transition-all ${
                  role === 'admin'
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30 scale-105'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('volunteer')}
                className="p-3 rounded-2xl font-extrabold text-xs border flex flex-col items-center gap-1.5 transition-all bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white col-span-2 sm:col-span-2"
              >
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <span>Student Community Member</span>
              </button>
            </div>
          </div>

          {/* Continue with Google Button */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-60 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? 'AUTHENTICATING...' : 'Continue with Google'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider absolute">
              OR SIGN IN WITH EMAIL
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Sign In vs Register Tabs */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setTab('signin')}
                className={`flex-1 py-2 rounded-lg font-extrabold transition-all ${
                  tab === 'signin' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`flex-1 py-2 rounded-lg font-extrabold transition-all ${
                  tab === 'register' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {tab === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Full Name / Organization Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Hotel Green Park / Sunrise NGO"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@organization.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'AUTHENTICATING...' : tab === 'signin' ? `ENTER WEBSITE AS ${role.toUpperCase()}` : `CREATE ${role.toUpperCase()} ACCOUNT`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-4 border-t border-slate-900 text-center text-xs text-slate-500">
        Food Rescue Network • Real-time Multi-User Persistence powered by Firebase Cloud Firestore & Node.js REST API
      </footer>

    </div>
  );
};
