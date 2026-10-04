import React from 'react';
import { BookOpen } from 'lucide-react';

export const AwarenessPage: React.FC = () => {
  return (
    <div className="space-y-10 animate-fadeIn pb-12">
      
      {/* Header Banner matching Website Hero */}
      <div className="bg-gradient-to-r from-[#083344] via-[#047857] to-[#022c22] p-8 rounded-3xl border border-cyan-800/40 shadow-xl space-y-3 text-white">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black border border-cyan-400/30">
          <BookOpen className="w-3.5 h-3.5" />
          <span>FSSAI SAFETY & AWARENESS GUIDELINES</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Food Safety & Redistribution Manual</h1>
        <p className="text-xs text-cyan-100 max-w-2xl font-medium">
          Guidelines for hotels, caterers, NGOs, and volunteers based on the Indian Food Sharing Alliance (IFSA) regulations.
        </p>
      </div>

      {/* Articles Grid - Light Slate Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="text-xl font-black text-slate-900">Why Food Waste Matters</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            In India, millions of tons of fresh food are lost or wasted annually while millions suffer from undernourishment. Redistribution bridges this gap efficiently using tech-enabled location matching.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="text-xl font-black text-slate-900">How to Donate Surplus Safely</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ensure hot cooked food is maintained above 60°C or cooled rapidly below 5°C. Only unserved surplus food untouched by consumers can be redistributed.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="text-xl font-black text-slate-900">Thermal Storage & Transport</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Volunteers and recovery agencies use food-grade insulated thermal carriers. Food should reach beneficiaries within 4 hours of preparation.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            04
          </div>
          <h3 className="text-xl font-black text-slate-900">How Students Can Volunteer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            College students can register as certified Food Rescuers. Earn official Appreciation Certificates, track community service hours, and lead local rescue drives.
          </p>
        </div>

      </div>

    </div>
  );
};
