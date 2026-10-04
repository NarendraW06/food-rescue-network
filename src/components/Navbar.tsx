import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';
import { 
  HeartHandshake, 
  MapPin, 
  PlusCircle, 
  Building2, 
  Truck, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  Bell, 
  Search, 
  CheckCircle2, 
  Users,
  ChevronDown,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    activeTab, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery, 
    notifications,
    markNotificationRead,
    clearAllNotifications,
    donations,
    ngos,
    openDonationTracker
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setShowRoleMenu(false);
    
    if (role === 'donor') setActiveTab('donor-dash');
    else if (role === 'ngo') setActiveTab('ngo-dash');
    else if (role === 'volunteer') setActiveTab('volunteer-dash');
    else if (role === 'admin') setActiveTab('admin-dash');
  };

  const filteredDonations = searchQuery.trim() 
    ? donations.filter(d => {
        if (!d) return false;
        const q = searchQuery.toLowerCase().trim();
        return (
          (d.foodName || '').toLowerCase().includes(q) || 
          (d.donorOrg || '').toLowerCase().includes(q) ||
          (d.donorLocation || '').toLowerCase().includes(q) ||
          (d.category || '').toLowerCase().includes(q) ||
          (d.foodType || '').toLowerCase().includes(q)
        );
      })
    : [];

  const filteredNgos = searchQuery.trim()
    ? ngos.filter(n => {
        if (!n) return false;
        const q = searchQuery.toLowerCase().trim();
        return (
          (n.name || '').toLowerCase().includes(q) || 
          (n.location || '').toLowerCase().includes(q) ||
          (n.category || '').toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-emerald-400">
                  FOOD WASTE
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  NETWORK
                </span>
              </div>
              <p className="text-[11px] font-medium text-emerald-400/90 tracking-wide hidden sm:block">
                “Good Food Should Never Go to Waste.”
              </p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search food, donors, NGOs, cities..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {showSearchResults && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                <div className="p-3 text-xs font-bold text-slate-400 border-b border-slate-800 flex justify-between items-center">
                  <span>SEARCH RESULTS</span>
                  <button onClick={() => setShowSearchResults(false)} className="hover:text-white">Close</button>
                </div>

                {filteredDonations.length === 0 && filteredNgos.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No matching food surplus or NGO found for "{searchQuery}"
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/50">
                    {filteredDonations.map(d => (
                      <div 
                        key={d.id} 
                        onClick={() => {
                          openDonationTracker(d);
                          setShowSearchResults(false);
                        }}
                        className="p-3 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={d.photoUrl} alt={d.foodName} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">{d.foodName}</p>
                            <p className="text-[11px] text-slate-400">{d.donorOrg} • {d.quantityKg} kg ({d.servings} meals)</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {d.status}
                        </span>
                      </div>
                    ))}

                    {filteredNgos.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => {
                          setActiveTab('directory');
                          setShowSearchResults(false);
                        }}
                        className="p-3 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={n.image} alt={n.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">{n.name}</p>
                            <p className="text-[11px] text-slate-400">{n.category} • {n.location}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                          {n.capacity} Capacity
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Controls & Role Switcher */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => setActiveTab('donate')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Donate Food</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white font-black text-[10px] flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Popup Modal */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-sm text-white">Live Alert Notifications</span>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] font-semibold text-slate-400 hover:text-red-400 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No notifications right now
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.donationId) {
                              const targetDonation = donations.find(d => d.id === n.donationId);
                              if (targetDonation) openDonationTracker(targetDonation);
                            }
                          }}
                          className={`p-3.5 hover:bg-slate-800/80 cursor-pointer transition-colors ${
                            !n.read ? 'bg-emerald-500/5 border-l-2 border-emerald-500' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-white">{n.title}</h4>
                            <span className="text-[10px] text-slate-500 whitespace-nowrap">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 transition-all group"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-extrabold text-white group-hover:text-emerald-300 capitalize">
                  {currentRole === 'donor' && '🏢 Donor'}
                  {currentRole === 'ngo' && '🤝 NGO / Shelter'}
                  {currentRole === 'volunteer' && '🚲 Volunteer'}
                  {currentRole === 'admin' && '🛡️ Admin'}
                  {currentRole === 'guest' && '🌐 Guest'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </button>

              {/* Role Select Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                  <div className="px-3 py-2 text-[10px] font-black text-slate-400 tracking-wider">
                    SWITCH DEMO ROLE
                  </div>
                  <button
                    onClick={() => handleRoleChange('donor')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${
                      currentRole === 'donor' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>🏢 Donor (Hotel / Caterer)</span>
                    {currentRole === 'donor' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('ngo')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${
                      currentRole === 'ngo' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>🤝 NGO / Orphanage</span>
                    {currentRole === 'ngo' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('volunteer')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${
                      currentRole === 'volunteer' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>🚲 Volunteer Rescuer</span>
                    {currentRole === 'volunteer' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${
                      currentRole === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>🛡️ Platform Admin</span>
                    {currentRole === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Primary Sub-Navigation Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2.5 border-t border-slate-900 scrollbar-none">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'home' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'map' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Live Food Map</span>
          </button>
          <button
            onClick={() => setActiveTab('donate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'donate' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Donate Food
          </button>

          {/* Role Dashboard shortcuts */}
          <button
            onClick={() => setActiveTab('donor-dash')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-colors ${
              activeTab === 'donor-dash' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Donor Dash</span>
          </button>
          <button
            onClick={() => setActiveTab('ngo-dash')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-colors ${
              activeTab === 'ngo-dash' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>NGO Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('volunteer-dash')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-colors ${
              activeTab === 'volunteer-dash' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Volunteer Queue</span>
          </button>
          <button
            onClick={() => setActiveTab('admin-dash')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-colors ${
              activeTab === 'admin-dash' ? 'bg-purple-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-colors ${
              activeTab === 'directory' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Directory</span>
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'impact' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Impact & Metrics
          </button>
          <button
            onClick={() => setActiveTab('awareness')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-colors ${
              activeTab === 'awareness' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>FSSAI Safety</span>
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-colors ${
              activeTab === 'certificates' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Rewards</span>
          </button>
        </nav>

      </div>
    </header>
  );
};
