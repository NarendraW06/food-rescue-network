import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartHandshake, 
  MapPin, 
  PlusCircle, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

export const HomePage: React.FC = () => {
  const { setActiveTab, setCurrentRole, donations, openDonationTracker } = useApp();

  const totalKg = donations.reduce((acc, d) => acc + d.quantityKg, 2850);
  const totalMeals = donations.reduce((acc, d) => acc + d.servings, 1420);
  const activePostings = donations.filter(d => d.status === 'Pending' || d.status === 'Accepted');

  return (
    <div className="space-y-16 animate-fadeIn pb-12">

      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80"
            alt="Community Meal Share"
            className="w-full h-full object-cover opacity-20 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl px-6 sm:px-12 py-16 sm:py-24 space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>FSSAI Compliant Food Redistribution Platform</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Good Food Should{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Never Go To Waste.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-medium leading-relaxed">
              Turn surplus food from hotels, banquets, messes & restaurants into fresh, warm meals for orphanages, shelters, and communities in need.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                setCurrentRole('donor');
                setActiveTab('donate');
              }}
              className="px-8 py-4 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5 stroke-[2.5]" />
              <span>Donate Food Surplus</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('ngo');
                setActiveTab('ngo-dash');
              }}
              className="px-8 py-4 rounded-2xl font-bold text-sm bg-slate-900/90 border border-slate-700 hover:border-emerald-400 text-white hover:bg-slate-800 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <HeartHandshake className="w-5 h-5 text-emerald-400" />
              <span>Find Food (NGOs)</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className="px-6 py-4 rounded-2xl font-bold text-sm bg-slate-950/80 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 flex items-center gap-2 transition-all"
            >
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Explore Live Map</span>
            </button>
          </div>

          {/* Dynamic Real-Time Stats Grid */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">{totalKg.toLocaleString()} KG</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Food Waste Saved</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-black text-teal-300">{totalMeals.toLocaleString()}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">People Fed</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-black text-cyan-300">86</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Active Donors</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">34</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Verified NGOs</p>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            SIMPLE 4-STEP RESCUE FLOW
          </span>
          <h2 className="text-3xl font-black text-white">How Food Waste Reduction Network Works</h2>
          <p className="text-sm text-slate-400">
            Connecting food businesses, recovery agencies, volunteers and beneficiaries through real-time technology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xl">
              01
            </div>
            <h3 className="font-extrabold text-white text-lg">Donate Surplus</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Donor posts available surplus food with location, meal count, photo, and food safety checklist.
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-1">
              <span>Post in under 60 sec</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xl">
              02
            </div>
            <h3 className="font-extrabold text-white text-lg">Instant Match</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nearby NGOs, orphanages & registered volunteers receive real-time location alerts to accept the donation.
            </p>
            <div className="pt-2 text-xs font-bold text-cyan-400 flex items-center gap-1">
              <span>GPS Geofenced alert</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xl">
              03
            </div>
            <h3 className="font-extrabold text-white text-lg">Coordinate Pickup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Volunteer or NGO collects food in insulated thermal containers with OTP safety verification.
            </p>
            <div className="pt-2 text-xs font-bold text-amber-400 flex items-center gap-1">
              <span>Secure OTP handover</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-xl">
              04
            </div>
            <h3 className="font-extrabold text-white text-lg">Deliver & Impact</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Warm meals reach beneficiaries. Digital record updates CO2 savings & unlocks donor milestone certificates!
            </p>
            <div className="pt-2 text-xs font-bold text-purple-400 flex items-center gap-1">
              <span>Verified distribution</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* Live Available Food Surplus Feed */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Available Surplus Food</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Real-time surplus listings awaiting NGO request or volunteer pickup</p>
          </div>

          <button
            onClick={() => setActiveTab('map')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All On Live Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePostings.slice(0, 3).map((donation) => (
            <div 
              key={donation.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden flex flex-col group"
            >
              <div className="relative h-48">
                <img
                  src={donation.photoUrl}
                  alt={donation.foodName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                {donation.isUrgent && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black bg-red-500 text-white shadow-lg animate-pulse">
                    🚨 URGENT RESCUE
                  </span>
                )}

                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-extrabold bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                  {donation.category}
                </span>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold text-white truncate">{donation.donorOrg}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    {donation.foodType}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-white text-base leading-snug line-clamp-2">
                    {donation.foodName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{donation.donorLocation}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">QUANTITY</span>
                    <span className="font-black text-white">{donation.quantityKg} KG ({donation.servings} Meals)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">EXPIRES IN</span>
                    <CountdownTimer expiresAt={donation.expiresAt} />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => openDonationTracker(donation)}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setCurrentRole('ngo');
                      setActiveTab('ngo-dash');
                    }}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    Claim Food
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FSSAI Guidance & Safety Banner */}
      <section className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>FSSAI & IFSA REGULATORY ALIGNMENT</span>
            </div>
            <h3 className="text-2xl font-black text-white">Safe Surplus Food Handling Protocol</h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Our platform adheres strictly to FSSAI guidelines for surplus food redistribution. Donors confirm temperature, hygiene, and safe consumption windows before food is assigned to verified recovery agencies.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('awareness')}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-2 shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Safety Guidelines</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Prepared in FSSAI Licensed Kitchen</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Maintained Hot (&gt;60°C) or Cold (&lt;5°C)</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Within 4-Hour Safe Time Limit</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Digital Proof & Handover OTP</span>
          </div>
        </div>
      </section>

    </div>
  );
};
