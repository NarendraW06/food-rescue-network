import React from 'react';
import { 
  TrendingUp, 
  Leaf, 
  Droplet, 
  Users, 
  Sparkles
} from 'lucide-react';

export const ImpactPage: React.FC = () => {
  return (
    <div className="space-y-10 animate-fadeIn pb-12">
      
      {/* Header Banner matching Website Hero */}
      <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#022c22] p-8 rounded-3xl border border-emerald-800/40 shadow-xl space-y-3 text-white">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ENVIRONMENTAL & SOCIAL METRICS</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Food Waste Network Cumulative Impact</h1>
        <p className="text-xs text-emerald-100 max-w-2xl font-medium">
          Real-time measurement of food waste diverted from landfill sites, carbon emission reduction, water savings, and community meal security.
        </p>
      </div>

      {/* Macro Impact Metrics - Light Slate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>FOOD SAVED</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-4xl font-black text-emerald-600">12,850 KG</p>
          <p className="text-xs font-semibold text-slate-500">12.8 Metric Tons Diverted</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>PEOPLE FED</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-4xl font-black text-teal-600">32,125</p>
          <p className="text-xs font-semibold text-slate-500">Meals Served to Communities</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>CO2 OFFSET</span>
            <TrendingUp className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-4xl font-black text-cyan-600">24.5 TONS</p>
          <p className="text-xs font-semibold text-slate-500">Methane Gas Prevented</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>WATER SAVED</span>
            <Droplet className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-4xl font-black text-blue-600">18.2M L</p>
          <p className="text-xs font-semibold text-slate-500">Liters Embedded Water</p>
        </div>

      </div>

      {/* Environmental Equivalent Cards */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="text-xl font-black text-slate-900">What Does 12.8 Tons of Saved Food Mean?</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
            <span className="text-2xl">🚗</span>
            <h4 className="font-extrabold text-slate-900 text-base">62 Passenger Vehicles</h4>
            <p className="text-xs text-slate-600">Equivalent to taking 62 cars off the road for a full month in carbon emissions.</p>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
            <span className="text-2xl">🌳</span>
            <h4 className="font-extrabold text-slate-900 text-base">1,150 Trees Planted</h4>
            <p className="text-xs text-slate-600">Environmental equivalent to carbon sequestered by 1,150 mature trees annually.</p>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
            <span className="text-2xl">⚡</span>
            <h4 className="font-extrabold text-slate-900 text-base">38,000 kWh Energy</h4>
            <p className="text-xs text-slate-600">Embedded energy preserved that would have been wasted in agriculture & transport.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
