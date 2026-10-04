import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import type { Donation } from '../types';
import { 
  Filter, 
  Clock, 
  Sparkles
} from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

import 'leaflet/dist/leaflet.css';

// Helper function to safely create DivIcon in browser environment
const createCustomIcon = (color: string, iconSymbol: string, pulsing: boolean = false) => {
  try {
    const pulsingCss = pulsing ? 'animate-pulse' : '';
    const html = `
      <div class="relative flex items-center justify-center">
        ${pulsing ? `<span class="absolute w-8 h-8 rounded-full bg-red-500 opacity-75 animate-ping"></span>` : ''}
        <div class="w-8 h-8 rounded-full ${color} text-white flex items-center justify-center font-bold text-xs shadow-xl border-2 border-slate-950 ${pulsingCss}">
          ${iconSymbol}
        </div>
      </div>
    `;
    return L.divIcon({
      html,
      className: 'custom-leaflet-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18],
    });
  } catch (e) {
    return new L.Icon.Default();
  }
};

// Recenter Map Helper Component
const RecenterMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (map && lat && lng) {
      map.flyTo([lat, lng], 13);
    }
  }, [lat, lng, map]);
  return null;
};

export const LiveFoodMap: React.FC = () => {
  const { donations, ngos, volunteers, acceptDonation, openDonationTracker, setCurrentRole, setActiveTab } = useApp();

  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterFoodType, setFilterFoodType] = useState<string>('all');
  const [showUrgentOnly, setShowUrgentOnly] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 19.1025, lng: 74.7350 });

  // Lazily instantiate custom Leaflet icons safely inside React hook
  const foodIcon = useMemo(() => createCustomIcon('bg-emerald-500', '🍱'), []);
  const urgentFoodIcon = useMemo(() => createCustomIcon('bg-red-500', '🚨', true), []);
  const ngoIcon = useMemo(() => createCustomIcon('bg-cyan-500', '🏠'), []);
  const orphanageIcon = useMemo(() => createCustomIcon('bg-purple-500', '👶'), []);
  const volunteerIcon = useMemo(() => createCustomIcon('bg-amber-500', '🚲'), []);

  // Filtered Donations
  const filteredDonations = donations.filter((d) => {
    if (filterCategory !== 'all' && d.category !== filterCategory) return false;
    if (filterFoodType !== 'all' && d.foodType !== filterFoodType) return false;
    if (showUrgentOnly && !d.isUrgent && d.status === 'Pending') return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Map Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>REAL-TIME GPS FOOD RESCUE NETWORK</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-2">Live Interactive Surplus Map</h1>
          <p className="text-xs text-slate-400">
            Geolocated markers for available surplus food, NGO shelters, active volunteers, and urgent rescues.
          </p>
        </div>

        {/* Legend Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            🟢 Food Available ({donations.filter(d => d.status === 'Pending').length})
          </span>
          <span className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30 flex items-center gap-1.5 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            🔴 Urgent (&lt;2h Expiry)
          </span>
          <span className="px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            🔵 Verified NGO ({ngos.length})
          </span>
          <span className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            🟠 Active Volunteer ({volunteers.length})
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400 font-bold">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Filter Markers:</span>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            <option value="Cooked Meals">Cooked Meals</option>
            <option value="Bakery & Bread">Bakery & Bread</option>
            <option value="Fresh Produce">Fresh Produce</option>
            <option value="Packaged Goods">Packaged Goods</option>
          </select>

          <select
            value={filterFoodType}
            onChange={(e) => setFilterFoodType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Veg & Non-Veg</option>
            <option value="Veg">Pure Veg 🟢</option>
            <option value="Non-Veg">Non-Veg 🔴</option>
          </select>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300">
            <input
              type="checkbox"
              checked={showUrgentOnly}
              onChange={(e) => setShowUrgentOnly(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span>Show Urgent Rescues Only</span>
          </label>
        </div>

        <div className="text-slate-400 text-xs font-semibold">
          Showing {filteredDonations.length} Active Surplus Postings
        </div>
      </div>

      {/* Main Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Leaflet Map Container */}
        <div className="lg:col-span-2 h-[550px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative bg-slate-950">
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%', minHeight: '500px', background: '#020617' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <RecenterMap lat={mapCenter.lat} lng={mapCenter.lng} />

            {/* Donation Markers */}
            {filteredDonations.map((d) => (
              <Marker
                key={d.id}
                position={[d.lat || 19.1025, d.lng || 74.7350]}
                icon={d.isUrgent ? urgentFoodIcon : foodIcon}
                eventHandlers={{
                  click: () => setSelectedDonation(d),
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 space-y-2 max-w-xs text-slate-950">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-emerald-700">{d.donorOrg}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 font-bold text-emerald-800">{d.foodType}</span>
                    </div>

                    <h4 className="font-bold text-sm leading-tight text-slate-900">{d.foodName}</h4>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p>📦 <strong>Quantity:</strong> {d.quantityKg} kg ({d.servings} meals)</p>
                      <p>📍 <strong>Location:</strong> {d.donorLocation}</p>
                      <p>⏳ <strong>Status:</strong> <span className="font-bold text-emerald-600">{d.status}</span></p>
                    </div>

                    <button
                      onClick={() => openDonationTracker(d)}
                      className="w-full mt-2 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                    >
                      View Rescue Details & Track →
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* NGO Markers */}
            {ngos.map((ngo) => (
              <Marker
                key={ngo.id}
                position={[ngo.lat || 19.1100, ngo.lng || 74.7280]}
                icon={ngo.category === 'Orphanage' ? orphanageIcon : ngoIcon}
              >
                <Popup>
                  <div className="p-2 space-y-1 text-slate-950">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">{ngo.category}</span>
                    <h4 className="font-black text-sm">{ngo.name}</h4>
                    <p className="text-xs text-slate-600">Capacity: {ngo.capacity} residents</p>
                    <p className="text-xs text-slate-600">Demand: {ngo.mealsNeededPerDay} meals/day</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Volunteer Markers */}
            {volunteers.map((vol) => (
              <Marker
                key={vol.id}
                position={[vol.lat || 19.1050, vol.lng || 74.7300]}
                icon={volunteerIcon}
              >
                <Popup>
                  <div className="p-2 space-y-1 text-slate-950">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">🚲 Volunteer</span>
                    <h4 className="font-black text-sm">{vol.name}</h4>
                    <p className="text-xs text-slate-600">Status: {vol.status}</p>
                    <p className="text-xs text-slate-600">Vehicle: {vol.vehicle}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

          </MapContainer>
        </div>

        {/* Sidebar Listings synced with Map */}
        <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Nearby Surplus Listings</h3>
            <span className="text-xs text-slate-400 font-semibold">{filteredDonations.length} total</span>
          </div>

          {filteredDonations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 rounded-3xl bg-slate-900 border border-slate-800">
              No matching donations found for current filter.
            </div>
          ) : (
            filteredDonations.map((d) => (
              <div
                key={d.id}
                onClick={() => {
                  setSelectedDonation(d);
                  if (d.lat && d.lng) setMapCenter({ lat: d.lat, lng: d.lng });
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  selectedDonation?.id === d.id
                    ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-white text-sm hover:text-emerald-400 transition-colors line-clamp-1">
                      {d.foodName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{d.donorOrg}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    d.status === 'Pending' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {d.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-b border-slate-800/80 py-2">
                  <span>📦 {d.quantityKg} kg ({d.servings} meals)</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <CountdownTimer expiresAt={d.expiresAt} />
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      acceptDonation(d.id, 'ngo-1', 'Sunrise Foundation NGO');
                      setCurrentRole('ngo');
                      setActiveTab('ngo-dash');
                    }}
                    disabled={d.status !== 'Pending'}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 transition-colors"
                  >
                    {d.status === 'Pending' ? 'Accept Donation' : 'Claimed'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDonationTracker(d);
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                  >
                    Track
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
