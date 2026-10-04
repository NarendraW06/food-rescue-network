import React, { useState } from 'react';
import type { UserRole } from '../types';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Sparkles, 
  Building2, 
  HeartHandshake, 
  Truck, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginWithGoogle: (role: UserRole) => Promise<void>;
  onLoginWithEmail: (email: string, pass: string, role: UserRole) => Promise<void>;
  onRegisterWithEmail: (name: string, email: string, pass: string, role: UserRole) => Promise<void>;
  onDemoLogin: (role: UserRole) => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onLoginWithGoogle,
  onLoginWithEmail,
  onRegisterWithEmail,
  onDemoLogin
}) => {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [role, setRole] = useState<UserRole>('donor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (tab === 'register' && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    try {
      if (tab === 'register') {
        await onRegisterWithEmail(name, email, password, role);
      } else {
        await onLoginWithEmail(email, password, role);
      }
      onClose();
    } catch (err: any) {
      console.warn('Auth error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      await onLoginWithGoogle(role);
      onClose();
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      setErrorMsg(err.message || 'Google sign in encountered an issue. Used demo fallback.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Header & Close */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FOOD RESCUE NETWORK AUTHENTICATION</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2">
              {tab === 'signin' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Sign in to rescue food, accept surplus, or track delivery
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona Role Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 block">Select Your Operating Role:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('donor')}
              className={`p-2.5 rounded-xl font-extrabold text-xs border flex items-center gap-2 transition-all ${
                role === 'donor'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Donor</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('ngo')}
              className={`p-2.5 rounded-xl font-extrabold text-xs border flex items-center gap-2 transition-all ${
                role === 'ngo'
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>NGO / Shelter</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('volunteer')}
              className={`p-2.5 rounded-xl font-extrabold text-xs border flex items-center gap-2 transition-all ${
                role === 'volunteer'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Volunteer</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`p-2.5 rounded-xl font-extrabold text-xs border flex items-center gap-2 transition-all ${
                role === 'admin'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Continue with Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-60"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider absolute">
            OR EMAIL SIGN IN
          </span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Tabs */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setTab('signin')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                tab === 'signin' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                tab === 'register' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Name input for registration */}
          {tab === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Patil / Hotel Green Park"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@organization.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-lg transition-all"
          >
            {isLoading ? 'AUTHENTICATING...' : tab === 'signin' ? `SIGN IN AS ${role.toUpperCase()}` : `CREATE ${role.toUpperCase()} ACCOUNT`}
          </button>
        </form>

        {/* Demo Fast Login Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Testing presentation?</span>
          <button
            onClick={() => {
              onDemoLogin(role);
              onClose();
            }}
            className="text-emerald-400 font-bold hover:underline"
          >
            Instant Demo Sign-In →
          </button>
        </div>

      </div>
    </div>
  );
};
