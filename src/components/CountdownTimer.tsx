import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldCheck, AlertOctagon } from 'lucide-react';
import type { DonationStatus } from '../types';

interface CountdownTimerProps {
  expiresAt: string;
  postedAt?: string;
  status?: DonationStatus;
  compact?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  expiresAt,
  status = 'Pending',
  compact = false,
}) => {
  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);

  useEffect(() => {
    const updateTimer = () => {
      const target = new Date(expiresAt).getTime();
      const now = Date.now();
      const diff = target - now;
      setTimeLeftMs(diff > 0 ? diff : 0);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (status === 'Delivered') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Delivered & Rescued ✅</span>
      </div>
    );
  }

  if (status === 'Expired' || timeLeftMs <= 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
        <AlertOctagon className="w-3.5 h-3.5 text-slate-400" />
        <span>Window Expired</span>
      </div>
    );
  }

  const hoursLeft = timeLeftMs / (1000 * 60 * 60);

  let theme = {
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    icon: Clock,
  };

  if (hoursLeft <= 1.5) {
    theme = {
      bg: 'bg-rose-500/20',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
      icon: AlertTriangle,
    };
  } else if (hoursLeft <= 3) {
    theme = {
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      icon: Clock,
    };
  }

  const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const IconComp = theme.icon;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${theme.bg} ${theme.text} border ${theme.border}`}>
        <IconComp className="w-3.5 h-3.5 animate-pulse" />
        <span>{formattedTime}</span>
      </div>
    );
  }

  return (
    <div className={`px-2.5 py-1 rounded-xl border ${theme.border} ${theme.bg} backdrop-blur-sm transition-all duration-300 inline-flex items-center gap-2`}>
      <IconComp className={`w-3.5 h-3.5 ${theme.text}`} />
      <span className={`text-xs font-mono font-black ${theme.text}`}>
        {formattedTime}
      </span>
    </div>
  );
};
