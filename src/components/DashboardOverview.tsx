import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PlusCircle, 
  ArrowRight, 
  TrendingUp, 
  Utensils, 
  Users, 
  Building2, 
  Leaf, 
  MapPin, 
  HeartHandshake, 
  Search, 
  Sparkles,
  Quote,
  Heart
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet SVG DivIcons
const createPinIcon = (color: string, iconSymbol: string) => {
  const html = `
    <div class="w-7 h-7 rounded-full ${color} text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-white">
      ${iconSymbol}
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-map-pin',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const donorPin = createPinIcon('bg-emerald-600', '🟢');
const ngoPin = createPinIcon('bg-sky-600', '🔵');
const oldAgePin = createPinIcon('bg-amber-500', '🟠');
const communityPin = createPinIcon('bg-purple-600', '🟣');

export const DashboardOverview: React.FC = () => {
  const { 
    setActiveTab, 
    setCurrentRole, 
    searchQuery, 
    setSearchQuery, 
    donations, 
    ngos, 
    openDonationTracker,
    setIsFinancialModalOpen
  } = useApp();

  const [chartRange, setChartRange] = useState('This Week');

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
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* 1. Top Hero Banner ("From Surplus to Support") */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#022c22] border border-emerald-800/40 shadow-xl min-h-[200px] flex items-center p-8 sm:p-10">
        
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1600&auto=format&fit=crop&q=80"
            alt="Warm Food Bowl"
            className="w-full h-full object-cover opacity-25 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#022c22] via-[#064e3b]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            From Surplus to Support
          </h1>
          <p className="text-sm text-emerald-100 font-medium leading-relaxed">
            Connecting Food Donors with Those in Need
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setCurrentRole('donor');
                setActiveTab('donate');
              }}
              className="px-6 py-3 rounded-full font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-emerald-950 shadow-lg hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Donate Surplus Food</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFinancialModalOpen(true)}
              className="px-6 py-3 rounded-full font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-xs hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              title="Donate Financially to NGO Meals & Get 80G Tax Exemption Receipt"
            >
              <Heart className="w-4 h-4 fill-emerald-300 text-emerald-300" />
              <span>Donate Financially ₹</span>
            </button>
          </div>
        </div>

        {/* Decorative handwriting badge on right */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-end opacity-90">
          <div className="border-2 border-emerald-400/60 rounded-3xl p-4 rotate-3 backdrop-blur-xs bg-emerald-950/40">
            <p className="font-serif italic text-xl text-emerald-300 font-extrabold tracking-wide">
              Less Waste
            </p>
            <p className="font-serif italic text-2xl text-white font-black">
              More Smiles ♡
            </p>
          </div>
        </div>

      </div>

      {/* Dynamic Search Results Box on Home Page */}
      {searchQuery.trim().length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-emerald-300 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-600" />
              <h3 className="font-black text-slate-900 text-lg">Search Results for "{searchQuery}"</h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {filteredDonations.length + filteredNgos.length} Matches Found
              </span>
            </div>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Clear Search
            </button>
          </div>

          {filteredDonations.length === 0 && filteredNgos.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 italic">
              No food donations or NGO beneficiaries matched "{searchQuery}". Try searching for "Biryani", "Hotel", "Ahilyanagar", or "Orphanage".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDonations.map(d => (
                <div 
                  key={d.id} 
                  onClick={() => openDonationTracker(d)}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-400 hover:bg-emerald-50/30 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img src={d.photoUrl} alt={d.foodName} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                        SURPLUS FOOD #{d.id}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm mt-0.5">{d.foodName}</h4>
                      <p className="text-xs text-slate-500">{d.donorOrg} • {d.quantityKg} kg ({d.servings} meals)</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 underline">Track →</span>
                </div>
              ))}

              {filteredNgos.map(n => (
                <div 
                  key={n.id}
                  onClick={() => setActiveTab('directory')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-cyan-400 hover:bg-cyan-50/30 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img src={n.image} alt={n.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <span className="text-[10px] font-black text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full uppercase">
                        {n.category}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm mt-0.5">{n.name}</h4>
                      <p className="text-xs text-slate-500">{n.location} • {n.capacity} Capacity</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-cyan-600 underline">View Directory →</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Top 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Food Donated */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500">Total Food Donated</span>
            <p className="text-2xl font-black text-slate-900">2,850 kg</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>↑ 12% Last 7 days</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
            <Utensils className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: People Helped */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500">People Helped</span>
            <p className="text-2xl font-black text-slate-900">1,420</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>↑ 18% Last 7 days</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-100/70 text-sky-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Active Donors */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500">Active Donors</span>
            <p className="text-2xl font-black text-slate-900">86</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                ↑ 10%
              </span>
              <span className="text-[10px] text-slate-400 truncate">Hotels, Restos, Hostels</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Food Waste Reduced */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500">Food Waste Reduced</span>
            <p className="text-2xl font-black text-slate-900">2,850 kg</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>↑ 12% Last 7 days</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 3. Middle Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Food Donation Overview Bar Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Food Donation Overview</h3>
            <select
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 focus:outline-none"
            >
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          {/* Bar Chart Simulation */}
          <div className="pt-4 h-48 flex items-end justify-between gap-2 border-b border-slate-100 pb-2">
            {[
              { day: 'Mon', val: 210, h: '45%' },
              { day: 'Tue', val: 260, h: '55%' },
              { day: 'Wed', val: 330, h: '72%' },
              { day: 'Thu', val: 250, h: '52%' },
              { day: 'Fri', val: 290, h: '62%' },
              { day: 'Sat', val: 370, h: '82%' },
              { day: 'Sun', val: 440, h: '96%' },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div 
                  style={{ height: bar.h }}
                  className="w-full rounded-t-lg bg-emerald-600 group-hover:bg-emerald-500 transition-colors"
                />
                <span className="text-[11px] font-bold text-slate-500">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Food Donors by Type (Donut Chart) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">Food Donors by Type</h3>

          <div className="flex items-center gap-4 pt-2">
            {/* SVG Donut Chart */}
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 stroke-current"
                  strokeWidth="4"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-800 stroke-current"
                  strokeWidth="4"
                  strokeDasharray="28, 100"
                  strokeDashoffset="0"
                  fill="none"
                />
                <path
                  className="text-emerald-500 stroke-current"
                  strokeWidth="4"
                  strokeDasharray="22, 100"
                  strokeDashoffset="-28"
                  fill="none"
                />
                <path
                  className="text-amber-400 stroke-current"
                  strokeWidth="4"
                  strokeDasharray="18, 100"
                  strokeDashoffset="-50"
                  fill="none"
                />
                <path
                  className="text-orange-500 stroke-current"
                  strokeWidth="4"
                  strokeDasharray="12, 100"
                  strokeDashoffset="-68"
                  fill="none"
                />
                <path
                  className="text-purple-600 stroke-current"
                  strokeWidth="4"
                  strokeDasharray="8, 100"
                  strokeDashoffset="-80"
                  fill="none"
                />
                <path
                  className="text-slate-300 stroke-current"
                  strokeWidth="4"
                  strokeDasharray="12, 100"
                  strokeDashoffset="-88"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Donors</span>
                <span className="text-xl font-black text-slate-900 leading-none">86</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="flex-1 space-y-1.5 text-[11px] font-semibold text-slate-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-800" />Hotels</span>
                <span className="font-bold text-slate-900">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Restaurants</span>
                <span className="font-bold text-slate-900">22%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" />Hostels & Mess</span>
                <span className="font-bold text-slate-900">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" />Canteens</span>
                <span className="font-bold text-slate-900">12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" />Event Halls</span>
                <span className="font-bold text-slate-900">8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" />Others</span>
                <span className="font-bold text-slate-900">12%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 3: Nearby Food & NGOs (Interactive Leaflet Map) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Nearby Food & NGOs</span>
            </h3>
            <button 
              onClick={() => setActiveTab('map')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              View All
            </button>
          </div>

          {/* Leaflet Map Widget */}
          <div className="h-44 rounded-xl overflow-hidden border border-slate-200 relative">
            <MapContainer
              center={[19.8910, 74.4790]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <Marker position={[19.8950, 74.4780]} icon={donorPin}>
                <Popup>Hotel Green Park (Surplus Food Available)</Popup>
              </Marker>
              <Marker position={[19.8910, 74.4790]} icon={ngoPin}>
                <Popup>Sanjivani College of Engineering (NGO Partner)</Popup>
              </Marker>
              <Marker position={[19.8920, 74.4820]} icon={oldAgePin}>
                <Popup>Sanjivani Hostel Mess</Popup>
              </Marker>
              <Marker position={[19.8990, 74.4720]} icon={communityPin}>
                <Popup>Local Community Distribution Point</Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-bold text-slate-600">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-600" />Food Donors</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-600" />NGOs / Orphanages</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />Old Age Homes</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-600" />Local Communities</span>
          </div>
        </div>

      </div>

      {/* 4. Bottom Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Recent Food Donations */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Recent Food Donations</h3>
            <button onClick={() => setActiveTab('map')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">View All</button>
          </div>

          <div className="divide-y divide-slate-100">
            
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Hotel Green Park</h4>
                  <p className="text-[11px] text-slate-500">50 kg - Mixed Food • Today, 3:45 PM</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Available
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Sahyadri Restaurant</h4>
                  <p className="text-[11px] text-slate-500">30 kg - Rice & Sabzi • Today, 1:20 PM</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Available
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Sanjivani Hostel Mess</h4>
                  <p className="text-[11px] text-slate-500">25 kg - Roti & Sabzi • Today, 11:10 AM</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Available
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">City Event Hall</h4>
                  <p className="text-[11px] text-slate-500">100 kg - Meals • Yesterday, 6:30 PM</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Available
              </span>
            </div>

          </div>
        </div>

        {/* Widget 2: Impact */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Impact</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                🍃
              </div>
              <div>
                <p className="font-black text-slate-900 text-base">2,850 kg</p>
                <p className="text-[10px] font-bold text-slate-500">Food Saved</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                👥
              </div>
              <div>
                <p className="font-black text-slate-900 text-base">1,420</p>
                <p className="text-[10px] font-bold text-slate-500">People Fed</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                🌎
              </div>
              <div>
                <p className="font-black text-slate-900 text-base">7.5 tons</p>
                <p className="text-[10px] font-bold text-slate-500">CO₂ Reduced</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                ❤️
              </div>
              <div>
                <p className="font-black text-slate-900 text-base">86</p>
                <p className="text-[10px] font-bold text-slate-500">Active Donors</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-800">
            <Leaf className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-extrabold">Every donation counts!</p>
              <p className="text-[11px] text-emerald-700">Let's build a hunger-free and waste-free community.</p>
            </div>
          </div>
        </div>

        {/* Widget 3: Quick Actions & Quote */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">Quick Actions</h3>

          <div className="space-y-2.5">
            <button
              onClick={() => {
                setCurrentRole('donor');
                setActiveTab('donate');
              }}
              className="w-full py-3 px-4 rounded-xl font-extrabold text-xs bg-emerald-800 hover:bg-emerald-700 text-white transition-colors flex items-center justify-between shadow-xs"
            >
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                <span>Donate Surplus Food</span>
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('ngo-dash')}
              className="w-full py-3 px-4 rounded-xl font-extrabold text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-700" />
                <span>Find Food Near You</span>
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className="w-full py-3 px-4 rounded-xl font-extrabold text-xs bg-sky-100 hover:bg-sky-200 text-sky-900 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-sky-700" />
                <span>Partner with Us (NGO)</span>
              </span>
              <ArrowRight className="w-4 h-4 text-sky-700" />
            </button>
          </div>

          {/* Quote Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1 relative">
            <Quote className="w-5 h-5 text-slate-300 absolute top-3 right-3" />
            <p className="text-[11px] font-bold text-slate-700 italic leading-relaxed pr-4">
              “Food waste is not just a loss of food, it's a loss of opportunity to help someone in need.”
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
