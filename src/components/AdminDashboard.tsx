import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Search,
  PieChart,
  BarChart2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, verifyUserStatus } = useApp();

  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (userSearch.trim()) {
      return (
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.orgName?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
      );
    }
    return true;
  });

  const totalUsers = 1248;
  const totalDonors = 86;
  const totalNgos = 34;
  const totalVolunteers = 152;
  const totalDonationsCount = 642;
  const totalKgSaved = 2850;
  const totalPeopleHelped = 1420;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header Banner matching Website Hero */}
      <div className="bg-gradient-to-r from-[#3b0764] via-[#7e22ce] to-[#042f2e] p-8 rounded-3xl border border-purple-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black border border-purple-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CENTRAL PLATFORM GOVERNANCE</span>
          </div>
          <h1 className="text-3xl font-black text-white mt-2 tracking-tight">Food Waste Network Admin Command</h1>
          <p className="text-xs text-purple-100 font-medium">System Oversight • Verification • Impact Analytics</p>
        </div>
      </div>

      {/* Platform Statistics Grid - Light Slate Theme */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase">TOTAL USERS</span>
          <p className="text-2xl font-black text-slate-900">{totalUsers.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase">DONORS</span>
          <p className="text-2xl font-black text-emerald-600">{totalDonors}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase">NGOS</span>
          <p className="text-2xl font-black text-cyan-600">{totalNgos}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase">VOLUNTEERS</span>
          <p className="text-2xl font-black text-amber-600">{totalVolunteers}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase">DONATIONS</span>
          <p className="text-2xl font-black text-purple-600">{totalDonationsCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase">FOOD SAVED</span>
          <p className="text-2xl font-black text-teal-600">{totalKgSaved.toLocaleString()} kg</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase">PEOPLE HELPED</span>
          <p className="text-2xl font-black text-cyan-600">{totalPeopleHelped.toLocaleString()}</p>
        </div>

      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown Chart Simulation */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span>Food Categories Breakdown</span>
            </h3>
            <span className="text-xs text-slate-500">Total 2,850 kg</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Cooked Meals (Rice, Curry, Biryani)</span>
                <span className="text-emerald-700">45% (1,282 kg)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[45%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Bakery & Breads</span>
                <span className="text-teal-700">25% (712 kg)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full w-[25%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Fresh Produce & Fruits</span>
                <span className="text-cyan-700">18% (513 kg)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full w-[18%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Packaged & Dairy Goods</span>
                <span className="text-amber-700">12% (343 kg)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[12%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Fulfillment Rate Simulation */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-600" />
              <span>Platform Fulfillment & Rescue Velocity</span>
            </h3>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">96.8% Success Rate</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase">AVG MATCH TIME</span>
              <p className="text-2xl font-black text-cyan-700 mt-1">8.5 min</p>
              <p className="text-[11px] text-slate-500 mt-1">From post to NGO accept</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase">AVG PICKUP & DELIVERY</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">32 min</p>
              <p className="text-[11px] text-slate-500 mt-1">Total transit duration</p>
            </div>
          </div>
        </div>

      </div>

      {/* User Management Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-extrabold text-slate-900 text-lg">User Verification & Management</h3>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-500 font-semibold"
            >
              <option value="all">All Roles</option>
              <option value="donor">Donors</option>
              <option value="ngo">NGOs</option>
              <option value="volunteer">Volunteers</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">User / Organization</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Verification Status</th>
                <th className="p-3.5 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <p>{user.name}</p>
                      <p className="text-[10px] text-slate-500 font-normal">{user.orgName || user.location}</p>
                    </div>
                  </td>
                  <td className="p-3.5 capitalize font-bold text-slate-800">{user.role}</td>
                  <td className="p-3.5 text-slate-600">{user.phone}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      user.status === 'verified' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      user.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {user.status || 'verified'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => verifyUserStatus(user.id, 'verified')}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => verifyUserStatus(user.id, 'suspended')}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-100 text-rose-800 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                      >
                        Suspend
                      </button>
                    </div>
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
