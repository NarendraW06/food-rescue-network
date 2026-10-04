import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Utensils, 
  Users, 
  TrendingUp, 
  PlusCircle, 
  Clock,
  Heart
} from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

export const DonorDashboard: React.FC = () => {
  const { donations, setActiveTab, openDonationTracker, setIsFinancialModalOpen } = useApp();

  const donorDonations = donations.filter(d => d.donorId === 'donor-1' || d.donorOrg.includes('Hotel Green Park') || d.donorOrg.includes('Sahyadri'));
  const totalKg = donorDonations.reduce((acc, d) => acc + d.quantityKg, 2850);
  const totalMeals = donorDonations.reduce((acc, d) => acc + d.servings, 1420);
  const activeCount = donorDonations.filter(d => d.status === 'Pending' || d.status === 'Accepted' || d.status === 'In Transit').length;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header Banner matching Website Emerald Hero */}
      <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#022c22] p-8 rounded-3xl border border-emerald-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>DONOR MANAGEMENT PORTAL</span>
          </div>
          <h1 className="text-3xl font-black text-white mt-2 tracking-tight">Hotel Green Park Dashboard</h1>
          <p className="text-xs text-emerald-100 font-medium">Verified Food Donor • Ahilyanagar Central</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsFinancialModalOpen(true)}
            className="px-5 py-3.5 rounded-full font-extrabold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
            title="Donate Financially to NGO Meals & Get 80G Tax Exemption Receipt"
          >
            <Heart className="w-4 h-4 fill-emerald-300 text-emerald-300" />
            <span>Donate Financially ₹</span>
          </button>
          <button
            onClick={() => setActiveTab('donate')}
            className="px-6 py-3.5 rounded-full font-black text-xs bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>+ Post New Surplus</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid - Light Slate Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>TOTAL FOOD DONATED</span>
            <Utensils className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{totalKg.toLocaleString()} KG</p>
          <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12.4% vs last month</span>
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>PEOPLE FED</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{totalMeals.toLocaleString()}</p>
          <p className="text-[11px] font-semibold text-teal-600">Est. 1,420 warm meals distributed</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>TOTAL DONATIONS</span>
            <Building2 className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">86</p>
          <p className="text-[11px] font-semibold text-slate-500">100% verified distribution</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>ACTIVE RESCUES</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-600">{activeCount}</p>
          <p className="text-[11px] font-semibold text-amber-600">Currently in progress</p>
        </div>

      </div>

      {/* Donation Trend Bar Simulation */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Weekly Donation Output (KG Saved)</h3>
            <p className="text-xs text-slate-500">Daily food waste redirected from landfills</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            This Week: 380 KG
          </span>
        </div>

        {/* Visual Bar Chart */}
        <div className="grid grid-cols-7 gap-3 pt-4 items-end h-40">
          {[
            { day: 'MON', val: 40, h: '40%' },
            { day: 'TUE', val: 65, h: '65%' },
            { day: 'WED', val: 80, h: '80%' },
            { day: 'THU', val: 50, h: '50%' },
            { day: 'FRI', val: 95, h: '95%' },
            { day: 'SAT', val: 120, h: '100%' },
            { day: 'SUN', val: 110, h: '90%' },
          ].map((bar, i) => (
            <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {bar.val}kg
              </span>
              <div 
                style={{ height: bar.h }} 
                className="w-full rounded-2xl bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400 group-hover:brightness-110 transition-all shadow-md shadow-emerald-500/10" 
              />
              <span className="text-[11px] font-bold text-slate-600">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Donations Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-lg">Your Recent Food Postings</h3>
          <span className="text-xs text-slate-500 font-semibold">{donorDonations.length} postings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Donation ID & Food</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Quantity / Servings</th>
                <th className="p-3.5">Expiry Window</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {donorDonations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 flex items-center gap-3">
                    <img src={d.photoUrl} alt={d.foodName} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="line-clamp-1">{d.foodName}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">{d.id}</p>
                    </div>
                  </td>
                  <td className="p-3.5">{d.category}</td>
                  <td className="p-3.5 font-bold text-slate-800">{d.quantityKg} kg ({d.servings} meals)</td>
                  <td className="p-3.5">
                    <CountdownTimer expiresAt={d.expiresAt} />
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      d.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      d.status === 'Accepted' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' :
                      d.status === 'In Transit' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => openDonationTracker(d)}
                      className="px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 transition-colors border border-slate-200 cursor-pointer"
                    >
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
