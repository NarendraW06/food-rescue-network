import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartHandshake, 
  MapPin, 
  Filter, 
  Utensils, 
  Users
} from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

export const NGODashboard: React.FC = () => {
  const { donations, acceptDonation, openDonationTracker, setCurrentRole, setActiveTab } = useApp();

  const [filterType, setFilterType] = useState('all');
  const [filterDistance, setFilterDistance] = useState('all');
  const [urgentOnly, setUrgentOnly] = useState(false);

  const availableDonations = donations.filter((d) => {
    if (filterType !== 'all' && d.foodType !== filterType) return false;
    if (urgentOnly && !d.isUrgent) return false;
    return true;
  });

  const acceptedByNgo = donations.filter(d => d.acceptedByNgoId === 'ngo-1' || d.status === 'Accepted' || d.status === 'In Transit');

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header Banner matching Website Hero */}
      <div className="bg-gradient-to-r from-[#083344] via-[#0e7490] to-[#042f2e] p-8 rounded-3xl border border-cyan-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black border border-cyan-400/30">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>NGO & RECOVERY AGENCY PORTAL</span>
          </div>
          <h1 className="text-3xl font-black text-white mt-2 tracking-tight">Sunrise Foundation NGO Dashboard</h1>
          <p className="text-xs text-cyan-100 font-medium">Verified Recipient • Serves 120 Residents Daily • MIDC Ahilyanagar</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('map')}
            className="px-5 py-3 rounded-full font-bold text-xs bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-slate-950" />
            <span>Live Map View</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid - Light Slate Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>AVAILABLE SURPLUS</span>
            <Utensils className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-600">{availableDonations.length}</p>
          <p className="text-[11px] font-semibold text-slate-500">Listings ready for claim</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>REQUESTS SENT / ACCEPTED</span>
            <HeartHandshake className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{acceptedByNgo.length + 28}</p>
          <p className="text-[11px] font-semibold text-cyan-600">98.5% fulfillment rate</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>FOOD RECEIVED</span>
            <Utensils className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">1,250 KG</p>
          <p className="text-[11px] font-semibold text-teal-600">Total rescued surplus</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>PEOPLE SERVED</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-600">720</p>
          <p className="text-[11px] font-semibold text-amber-600">Orphans & residents fed</p>
        </div>

      </div>

      {/* Filter Control Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <Filter className="w-4 h-4 text-cyan-600" />
              <span>Filter Available Food:</span>
            </div>

            <select
              value={filterDistance}
              onChange={(e) => setFilterDistance(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Distance: All Ranges</option>
              <option value="2">0 – 2.5 km (Nearby)</option>
              <option value="5">0 – 5.0 km (Citywide)</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Food Type: All</option>
              <option value="Veg">Pure Veg 🟢</option>
              <option value="Non-Veg">Non-Veg 🔴</option>
            </select>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={urgentOnly}
                onChange={(e) => setUrgentOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-50 border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span>Urgent (&lt;2h Expiry)</span>
            </label>
          </div>

          <span className="text-slate-500 font-semibold">{availableDonations.length} surplus offers available</span>
        </div>
      </div>

      {/* Available Food Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">Available Food Postings Near You</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableDonations.map((d) => (
            <div 
              key={d.id} 
              className="rounded-3xl bg-white border border-slate-200/80 hover:border-cyan-500/50 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
            >
              <div className="relative h-44">
                <img src={d.photoUrl} alt={d.foodName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black bg-cyan-500 text-slate-950 shadow-lg">
                  📍 ~2.4 km away
                </span>

                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-extrabold bg-white/90 text-emerald-700 border border-emerald-200 shadow-xs">
                  {d.foodType}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">{d.foodName}</h4>
                  <p className="text-xs text-slate-500 mt-1">{d.donorOrg} • {d.donorLocation}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">QUANTITY</span>
                    <span className="font-black text-slate-900">{d.quantityKg} KG ({d.servings} meals)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">EXPIRES IN</span>
                    <CountdownTimer expiresAt={d.expiresAt} />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openDonationTracker(d)}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200 cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={async () => {
                      await acceptDonation(d.id, 'ngo-1', 'Sunrise Foundation NGO');
                      setCurrentRole('volunteer');
                      setActiveTab('volunteer-dash');
                    }}
                    disabled={d.status !== 'Pending'}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50 transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
                  >
                    {d.status === 'Pending' ? 'Request Food' : 'Claimed ✓'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
