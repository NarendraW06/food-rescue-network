import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Search, 
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

export const DirectoryPage: React.FC = () => {
  const { ngos, setActiveTab, setCurrentRole } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredNgos = ngos.filter((n) => {
    if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
    if (search.trim()) {
      return (
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.location.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header Banner matching Website Hero */}
      <div className="bg-gradient-to-r from-[#083344] via-[#047857] to-[#022c22] p-8 rounded-3xl border border-cyan-800/40 shadow-xl space-y-3 text-white">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black border border-cyan-400/30">
          <Users className="w-3.5 h-3.5" />
          <span>VERIFIED COMMUNITY BENEFICIARIES</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">NGO, Orphanage & Shelter Directory</h1>
        <p className="text-xs text-cyan-100 max-w-2xl font-medium">
          Centralized directory of verified non-profit partners, orphanages, old-age homes, and community kitchens across Ahilyanagar, Nashik & Niphad.
        </p>
      </div>

      {/* Filter & Search Bar - Light Theme */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by NGO name, city or region..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 w-64 font-medium"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Beneficiaries</option>
            <option value="NGO">NGOs & Food Banks</option>
            <option value="Orphanage">Orphanages & Children Homes</option>
            <option value="Old Age Home">Old Age Homes</option>
            <option value="Community Kitchen">Community Kitchens</option>
          </select>
        </div>

        <span className="text-slate-500 font-semibold">{filteredNgos.length} verified centers listed</span>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNgos.map((ngo) => (
          <div 
            key={ngo.id} 
            className="rounded-3xl bg-white border border-slate-200/80 hover:border-cyan-500/50 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
          >
            <div className="relative h-44">
              <img src={ngo.image} alt={ngo.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black bg-cyan-600 text-white shadow-md">
                {ngo.category}
              </span>

              {ngo.verified && (
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">{ngo.name}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ngo.location}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-slate-500 text-[10px] font-bold block uppercase">CAPACITY</span>
                  <span className="font-black text-slate-900">{ngo.capacity} Residents</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-bold block uppercase">DAILY REQUIREMENT</span>
                  <span className="font-black text-cyan-700">{ngo.mealsNeededPerDay} Meals / Day</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ngo.contactPhone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ngo.contactEmail}</span>
                </p>
              </div>

              <button
                onClick={() => {
                  setCurrentRole('donor');
                  setActiveTab('donate');
                }}
                className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Coordinate Food Donation</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
