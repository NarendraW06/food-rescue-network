import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, 
  CheckCircle2, 
  Star, 
  KeyRound, 
  Navigation
} from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

export const VolunteerDashboard: React.FC = () => {
  const { donations, startPickup, completeDelivery } = useApp();

  const [otpInput, setOtpInput] = useState('');
  const [selectedOtpDonation, setSelectedOtpDonation] = useState<string | null>(null);
  const [otpError, setOtpError] = useState('');

  const assignedPickups = donations.filter(
    (d) => d.status === 'Accepted' || d.status === 'In Transit'
  );

  const handleVerifyDelivery = async (donationId: string) => {
    setOtpError('');
    const success = await completeDelivery(donationId, otpInput);
    if (!success) {
      setOtpError('Invalid Delivery OTP. Please enter the dynamic 4-digit OTP provided by the beneficiary.');
    } else {
      setOtpInput('');
      setSelectedOtpDonation(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header Banner matching Website Hero */}
      <div className="bg-gradient-to-r from-[#451a03] via-[#b45309] to-[#042f2e] p-8 rounded-3xl border border-amber-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-400/30">
            <Truck className="w-3.5 h-3.5" />
            <span>VOLUNTEER RESCUE AGENT</span>
          </div>
          <h1 className="text-3xl font-black text-white mt-2 tracking-tight">Rahul Patil (Volunteer #1042)</h1>
          <p className="text-xs text-amber-100 font-medium">Vehicle: Honda Activa Scooter • Savedi, Ahilyanagar Zone</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-amber-400/30 shadow-md">
          <div className="flex items-center gap-1.5 text-amber-300 font-black text-sm">
            <Star className="w-4 h-4 fill-amber-300" />
            <span>4.9 / 5.0</span>
          </div>
          <span className="text-amber-200/60">•</span>
          <span className="text-xs font-bold text-white">38 Completed Pickups</span>
        </div>
      </div>

      {/* Active Pickup & Route Flow */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-amber-600" />
          <span>Active Rescue Routes in Progress</span>
        </h2>

        {assignedPickups.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            No active pickups assigned. Select a pending surplus donation from the available feed to begin pickup!
          </div>
        ) : (
          assignedPickups.map((d) => (
            <div 
              key={d.id} 
              className="p-6 rounded-3xl bg-white border border-amber-300/80 space-y-6 shadow-xs hover:shadow-md transition-all relative"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <img src={d.photoUrl} alt={d.foodName} className="w-12 h-12 rounded-2xl object-cover" />
                  <div>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      PICKUP #{d.id}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1">{d.foodName}</h3>
                  </div>
                </div>

                <div className="text-xs text-slate-700 font-bold bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 flex items-center gap-2">
                  <span>Quantity: {d.quantityKg} kg ({d.servings} meals)</span>
                  <span>•</span>
                  <CountdownTimer expiresAt={d.expiresAt} />
                </div>
              </div>

              {/* Status Timeline */}
              <div className="grid grid-cols-5 gap-2 text-center text-xs pt-2">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center mx-auto shadow-xs">✓</div>
                  <span className="text-[10px] font-bold text-emerald-700 block">POSTED</span>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center mx-auto shadow-xs">✓</div>
                  <span className="text-[10px] font-bold text-emerald-700 block">ACCEPTED</span>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-black flex items-center justify-center mx-auto shadow-xs">✓</div>
                  <span className="text-[10px] font-bold text-amber-700 block">VOLUNTEER</span>
                </div>
                <div className="space-y-1">
                  <div className={`w-8 h-8 rounded-full font-black flex items-center justify-center mx-auto ${
                    d.status === 'In Transit' ? 'bg-purple-600 text-white animate-pulse shadow-xs' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {d.status === 'In Transit' ? '🚚' : '4'}
                  </div>
                  <span className={`text-[10px] font-bold block ${d.status === 'In Transit' ? 'text-purple-700' : 'text-slate-500'}`}>
                    IN TRANSIT
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 font-black flex items-center justify-center mx-auto">🏁</div>
                  <span className="text-[10px] font-bold text-slate-500 block">DELIVERED</span>
                </div>
              </div>

              {/* Pickup & Destination Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-500 font-bold text-[10px] block uppercase">PICKUP FROM (DONOR)</span>
                  <p className="font-extrabold text-slate-900">{d.donorOrg}</p>
                  <p className="text-slate-600">{d.donorLocation} • {d.donorPhone}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold text-[10px] block uppercase">DELIVER TO (RECIPIENT)</span>
                  <p className="font-extrabold text-cyan-700">{d.acceptedByNgoName || 'Sunrise Foundation NGO'}</p>
                  <p className="text-slate-600">MIDC Ahilyanagar Sector 4</p>
                </div>
              </div>

              {/* Handover OTP Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Pickup OTP: <strong className="text-amber-700 font-mono text-sm">{d.pickupOtp || '----'}</strong></span>
                  <span>•</span>
                  <span>Delivery Handover OTP: <strong className="text-cyan-700 font-mono text-sm">{d.deliveryOtp || '----'}</strong></span>
                </div>

                <div className="flex items-center gap-3">
                  {d.status === 'Accepted' && (
                    <button
                      onClick={async () => await startPickup(d.id, 'vol-1', 'Rahul Patil')}
                      className="px-5 py-2.5 rounded-full font-black text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md cursor-pointer"
                    >
                      Start Pickup & Navigation →
                    </button>
                  )}

                  {d.status === 'In Transit' && (
                    <button
                      onClick={() => setSelectedOtpDonation(d.id)}
                      className="px-5 py-2.5 rounded-full font-black text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Delivery & Verify OTP</span>
                    </button>
                  )}
                </div>
              </div>

              {/* OTP Verification Modal */}
              {selectedOtpDonation === d.id && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-900 flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-emerald-700" />
                      <span>Enter Beneficiary Delivery OTP</span>
                    </span>
                    <button onClick={() => setSelectedOtpDonation(null)} className="text-xs text-slate-500 hover:text-slate-900">Cancel</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 4-digit OTP"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-36 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-center font-mono font-black text-lg text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button
                      onClick={() => handleVerifyDelivery(d.id)}
                      className="px-6 py-2.5 rounded-xl font-black text-xs bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-xs cursor-pointer"
                    >
                      Confirm Handoff
                    </button>
                  </div>
                  {otpError && <p className="text-xs text-rose-600 font-bold">{otpError}</p>}
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
};
