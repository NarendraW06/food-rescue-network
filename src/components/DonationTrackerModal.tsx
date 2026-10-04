import React from 'react';
import type { Donation } from '../types';
import { 
  X, 
  ShieldCheck, 
  KeyRound
} from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

interface Props {
  donation: Donation | null;
  onClose: () => void;
}

export const DonationTrackerModal: React.FC<Props> = ({ donation, onClose }) => {
  if (!donation) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              LIVE RESCUE TRACKER • #{donation.id}
            </span>
            <h2 className="text-2xl font-black text-white mt-2 leading-tight">{donation.foodName}</h2>
            <p className="text-xs text-slate-400 mt-1">{donation.donorOrg} • {donation.donorLocation}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Food Details Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-bold text-[10px] block uppercase">QUANTITY</span>
            <span className="font-black text-white">{donation.quantityKg} KG</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold text-[10px] block uppercase">EST. MEALS</span>
            <span className="font-black text-emerald-400">{donation.servings} Servings</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold text-[10px] block uppercase">DIETARY TYPE</span>
            <span className="font-bold text-white">{donation.foodType}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold text-[10px] block uppercase">REMAINING TIME</span>
            <CountdownTimer expiresAt={donation.expiresAt} />
          </div>
        </div>

        {/* Step-by-step Tracker Progress Bar */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Rescue Handover Progress</h3>

          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center mx-auto">✓</div>
              <span className="text-[10px] font-bold text-emerald-400 block">POSTED</span>
            </div>
            <div className="space-y-1">
              <div className={`w-8 h-8 rounded-full font-black flex items-center justify-center mx-auto ${
                donation.status !== 'Pending' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
              }`}>
                {donation.status !== 'Pending' ? '✓' : '2'}
              </div>
              <span className={`text-[10px] font-bold block ${donation.status !== 'Pending' ? 'text-emerald-400' : 'text-slate-500'}`}>
                ACCEPTED
              </span>
            </div>
            <div className="space-y-1">
              <div className={`w-8 h-8 rounded-full font-black flex items-center justify-center mx-auto ${
                donation.assignedVolunteerName ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
              }`}>
                {donation.assignedVolunteerName ? '✓' : '3'}
              </div>
              <span className={`text-[10px] font-bold block ${donation.assignedVolunteerName ? 'text-emerald-400' : 'text-slate-500'}`}>
                VOLUNTEER
              </span>
            </div>
            <div className="space-y-1">
              <div className={`w-8 h-8 rounded-full font-black flex items-center justify-center mx-auto ${
                donation.status === 'In Transit' || donation.status === 'Delivered' ? 'bg-emerald-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-500'
              }`}>
                {donation.status === 'In Transit' || donation.status === 'Delivered' ? '✓' : '4'}
              </div>
              <span className={`text-[10px] font-bold block ${
                donation.status === 'In Transit' || donation.status === 'Delivered' ? 'text-purple-400' : 'text-slate-500'
              }`}>
                PICKED UP
              </span>
            </div>
            <div className="space-y-1">
              <div className={`w-8 h-8 rounded-full font-black flex items-center justify-center mx-auto ${
                donation.status === 'Delivered' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
              }`}>
                {donation.status === 'Delivered' ? '🏁' : '5'}
              </div>
              <span className={`text-[10px] font-bold block ${donation.status === 'Delivered' ? 'text-emerald-400' : 'text-slate-500'}`}>
                DELIVERED
              </span>
            </div>
          </div>
        </div>

        {/* Security Codes */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-bold">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Pickup OTP: <strong className="text-amber-400">{donation.pickupOtp || '----'}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-bold">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>Delivery OTP: <strong className="text-cyan-400">{donation.deliveryOtp || '----'}</strong></span>
          </div>
        </div>

        {/* FSSAI Declaration Verified Badge */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>FSSAI Compliant: Food prepared hygienically in licensed facility and verified safe for consumption.</span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-colors"
        >
          Close Tracker
        </button>

      </div>
    </div>
  );
};
