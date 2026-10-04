import React, { useState } from 'react';
import type { ActivityLog } from '../types';
import { 
  X, 
  FileText, 
  Filter, 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  Truck, 
  HeartHandshake, 
  Utensils 
} from 'lucide-react';

interface Props {
  logs: ActivityLog[];
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityLogModal: React.FC<Props> = ({ logs, isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (selectedRole !== 'all' && log.role.toLowerCase() !== selectedRole.toLowerCase()) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.actorName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'donor':
        return <Utensils className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ngo':
        return <HeartHandshake className="w-3.5 h-3.5 text-cyan-400" />;
      case 'volunteer':
        return <Truck className="w-3.5 h-3.5 text-amber-400" />;
      case 'admin':
        return <UserCheck className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role.toLowerCase()) {
      case 'donor':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'ngo':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'volunteer':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'admin':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-black border border-purple-500/30">
              <FileText className="w-3.5 h-3.5" />
              <span>SYSTEM AUDIT & ACTIVITY LOGS</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2 leading-tight">Multi-Role Activity Log Trail</h2>
            <p className="text-xs text-slate-400 mt-1">Real-time audit history of events by Donors, NGOs, Volunteers, Admins, & Students</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-400 flex items-center gap-1.5 mr-2">
              <Filter className="w-3.5 h-3.5 text-purple-400" />
              Role Filter:
            </span>
            {['all', 'donor', 'ngo', 'volunteer', 'admin', 'student'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] border transition-all ${
                  selectedRole === r
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search activity logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-full sm:w-56"
          />
        </div>

        {/* Logs Table List */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 rounded-2xl bg-slate-950 border border-slate-800">
              No activity logs match the selected role filter.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div 
                key={log.id} 
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${getRoleBadgeClass(log.role)}`}>
                    {getRoleIcon(log.role)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-white text-sm">{log.actorName}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${getRoleBadgeClass(log.role)}`}>
                        {log.role}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-slate-300 font-medium">{log.details}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold shrink-0 self-end sm:self-center">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Showing {filteredLogs.length} activity audit log entries</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close Logs
          </button>
        </div>

      </div>
    </div>
  );
};
