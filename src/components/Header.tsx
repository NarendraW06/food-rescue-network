import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Bell, 
  X,
  FileText,
  LogOut,
  ShieldCheck,
  Building2,
  HeartHandshake,
  Truck,
  Heart
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentRole, 
    searchQuery, 
    setSearchQuery, 
    notifications, 
    markNotificationRead,
    clearAllNotifications,
    donations,
    ngos,
    openDonationTracker,
    setActiveTab,
    users,
    setIsLogModalOpen,
    setIsFinancialModalOpen,
    authUser,
    logout
  } = useApp();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearchDrop, setShowSearchDrop] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeUser = authUser || users.find(u => u.role === currentRole) || users[0];
  const role = authUser?.role || currentRole;

  const getRoleIcon = (r: string) => {
    switch (r) {
      case 'donor':
        return <Building2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'ngo':
        return <HeartHandshake className="w-3.5 h-3.5 text-cyan-600" />;
      case 'volunteer':
        return <Truck className="w-3.5 h-3.5 text-amber-600" />;
      case 'admin':
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-emerald-600" />;
    }
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
    <header className="h-20 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between gap-6 sticky top-0 z-40 shadow-xs">
      
      {/* Global Search Bar */}
      <div className="relative flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search for food, donors, NGOs, or locations..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDrop(true);
            }}
            onFocus={() => setShowSearchDrop(true)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-100/80 border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setShowSearchDrop(false); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchDrop && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
            <div className="p-3 text-[11px] font-bold text-slate-400 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <span>MATCHING RESULTS</span>
              <button onClick={() => setShowSearchDrop(false)} className="hover:text-slate-700">Close</button>
            </div>

            {filteredDonations.length === 0 && filteredNgos.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No matching surplus food or NGO found for "{searchQuery}"
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredDonations.map(d => (
                  <div 
                    key={d.id} 
                    onClick={() => {
                      openDonationTracker(d);
                      setShowSearchDrop(false);
                    }}
                    className="p-3 hover:bg-emerald-50/50 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={d.photoUrl} alt={d.foodName} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">{d.foodName}</p>
                        <p className="text-[11px] text-slate-500">{d.donorOrg} • {d.quantityKg} kg ({d.servings} meals)</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {d.status}
                    </span>
                  </div>
                ))}

                {filteredNgos.map(n => (
                  <div 
                    key={n.id}
                    onClick={() => {
                      setActiveTab('directory');
                      setShowSearchDrop(false);
                    }}
                    className="p-3 hover:bg-cyan-50/50 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={n.image} alt={n.name} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-cyan-700 transition-colors">{n.name}</p>
                        <p className="text-[11px] text-slate-500">{n.category} • {n.location}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                      {n.capacity} Capacity
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Header User Controls */}
      <div className="flex items-center gap-3">
        
        {/* Financial Donate Button */}
        <button
          onClick={() => setIsFinancialModalOpen(true)}
          className="px-3.5 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs border border-emerald-500/80 transition-all shadow-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
          title="Donate Financially to NGO Meals & Get 80G Tax Exemption Receipt"
        >
          <Heart className="w-4 h-4 fill-emerald-200 text-emerald-200 animate-pulse" />
          <span className="hidden sm:inline">Fund NGO Meals ₹</span>
        </button>

        {/* Audit Logs Button */}
        <button
          onClick={() => setIsLogModalOpen(true)}
          className="px-3.5 py-2 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 font-extrabold text-xs border border-purple-200/80 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          title="View System Audit Logs"
        >
          <FileText className="w-4 h-4 text-purple-600" />
          <span className="hidden md:inline">Audit Logs</span>
        </button>

        {/* Notification Bell Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2.5 rounded-full bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white font-black text-[9px] flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <span className="font-bold text-xs text-slate-800">Notifications</span>
                {notifications.length > 0 && (
                  <button onClick={clearAllNotifications} className="text-[11px] font-semibold text-slate-500 hover:text-red-600">
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">No new alerts</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.donationId) {
                          const d = donations.find(x => x.id === n.donationId);
                          if (d) openDonationTracker(d);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-emerald-50/50' : ''}`}
                    >
                      <p className="text-xs font-bold text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Sign Out Button */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
          <div className="flex items-center gap-2.5">
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
            />
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                {getRoleIcon(role)}
                <p className="text-xs font-extrabold text-slate-900 leading-tight">{activeUser.name}</p>
              </div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mt-0.5">
                {role} account
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs border border-rose-200/80 transition-colors flex items-center gap-1.5"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

      </div>

    </header>
  );
};
