import React from 'react';
import { useApp } from '../context/AppContext';
import type { ActiveTabView, UserRole } from '../types';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Search, 
  HeartHandshake, 
  Package, 
  BarChart3, 
  Utensils,
  Leaf,
  MapPin,
  Truck,
  ShieldCheck,
  Award,
  Heart
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentRole, authUser, setIsFinancialModalOpen } = useApp();

  const role = authUser?.role || currentRole;

  const allNavItems: { id: ActiveTabView; label: string; icon: React.FC<{ className?: string }>; roles: UserRole[] }[] = [
    { id: 'donate', label: 'Post Surplus Food', icon: PlusCircle, roles: ['donor'] },
    { id: 'donor-dash', label: 'My Food Postings', icon: Package, roles: ['donor'] },
    
    { id: 'ngo-dash', label: 'Available Surplus Feed', icon: Search, roles: ['ngo'] },
    { id: 'directory', label: 'NGOs & Shelters', icon: HeartHandshake, roles: ['ngo', 'admin'] },

    { id: 'volunteer-dash', label: 'Active Pickups & Route', icon: Truck, roles: ['volunteer'] },

    { id: 'admin-dash', label: 'Control & Verification', icon: ShieldCheck, roles: ['admin'] },
    { id: 'home', label: 'Overview Analytics', icon: LayoutDashboard, roles: ['donor', 'admin'] },

    { id: 'map', label: 'Live Interactive Map', icon: MapPin, roles: ['donor', 'ngo', 'volunteer', 'admin'] },
    { id: 'impact', label: 'Impact & Certificates', icon: BarChart3, roles: ['donor', 'ngo', 'volunteer', 'admin'] },
    { id: 'certificates', label: 'Milestone Awards', icon: Award, roles: ['donor', 'ngo', 'volunteer', 'admin'] },
  ];

  const navItems = allNavItems.filter((item) => item.roles.includes(role));

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'donor':
        return { label: 'DONOR PORTAL', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'ngo':
        return { label: 'NGO PORTAL', bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
      case 'volunteer':
        return { label: 'VOLUNTEER PORTAL', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'admin':
        return { label: 'ADMIN PORTAL', bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      default:
        return { label: 'COMMUNITY PORTAL', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    }
  };

  const badge = getRoleBadge(role);

  return (
    <aside className="w-64 sm:w-72 bg-[#042f2e] text-slate-100 flex flex-col justify-between p-6 shrink-0 min-h-screen border-r border-emerald-950/80 select-none shadow-2xl">
      
      <div className="space-y-6">
        
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => setActiveTab(navItems[0]?.id || 'home')}
          className="flex items-center gap-3 cursor-pointer group pt-2"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-emerald-900/50">
            <Utensils className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <h1 className="font-black text-base text-white leading-snug tracking-tight">
              Food Waste <br />
              <span className="text-emerald-400">Reduction Network</span>
            </h1>
            <p className="text-[10px] text-emerald-300/80 font-medium tracking-wide mt-0.5">
              Good Food • Less Waste • A Better Tomorrow
            </p>
          </div>
        </div>

        {/* Portal Scoping Badge */}
        <div className="pt-2">
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${badge.bg}`}>
            {badge.label}
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-950/60 font-black tracking-wide border border-emerald-500/30'
                    : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400/80'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* Bottom Illustration & Financial Donate Button */}
      <div className="mt-8 space-y-3">
        <button
          onClick={() => setIsFinancialModalOpen(true)}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-950/80 flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all border border-emerald-300/40 cursor-pointer"
        >
          <Heart className="w-4 h-4 fill-slate-950 text-slate-950 animate-bounce" />
          <span>Donate Financially ₹</span>
        </button>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900/50 to-teal-950/80 border border-emerald-500/20 text-center relative overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner mb-1.5">
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <h4 className="font-black text-white text-[11px] leading-tight">Together We Can Reduce</h4>
          <p className="text-emerald-400 font-extrabold text-xs tracking-wide mt-0.5">Food Waste</p>
          <p className="text-[9px] text-emerald-200/70 font-medium italic pt-1 mt-1 border-t border-emerald-800/40">
            Share Food • Spread Happiness
          </p>
        </div>
      </div>

    </aside>
  );
};
