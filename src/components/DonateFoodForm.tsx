import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { FoodCategory } from '../types';
import { 
  PlusCircle, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Image as ImageIcon, 
  Sparkles,
  ArrowRight,
  Utensils
} from 'lucide-react';

const SAMPLE_PHOTOS = [
  { label: 'Cooked Curry & Rice', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80' },
  { label: 'Fresh Bakery Breads', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80' },
  { label: 'Warm Buffet Trays', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80' },
  { label: 'Fresh Fruit Crates', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80' },
  { label: 'Sealed Meal Boxes', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80' }
];

export const DonateFoodForm: React.FC = () => {
  const { addDonation, setActiveTab, setCurrentRole } = useApp();

  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [quantityKg, setQuantityKg] = useState<number>(25);
  const [servings, setServings] = useState<number>(60);
  const [foodType, setFoodType] = useState<'Veg' | 'Non-Veg'>('Veg');
  const [prepTime, setPrepTime] = useState('17:30');
  const [bestBeforeHours, setBestBeforeHours] = useState(4);
  const [location, setLocation] = useState('Savedi Road, Ahilyanagar');
  const [selectedPhoto, setSelectedPhoto] = useState(SAMPLE_PHOTOS[0].url);
  const [additionalNotes] = useState('');

  const [checklist, setChecklist] = useState({
    hygienicPrep: true,
    properTemperature: true,
    safeTimeWindow: true,
    unservedSurplus: true,
  });

  const allSafetyChecked = Object.values(checklist).every(Boolean);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodName.trim()) {
      alert('Please enter food item name.');
      return;
    }

    if (!allSafetyChecked) {
      alert('Please confirm all FSSAI food safety declarations before posting.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDonation({
        donorId: 'donor-1',
        donorName: 'Hotel Green Park',
        donorOrg: 'Hotel Green Park',
        donorPhone: '+91 98220 12345',
        donorLocation: location,
        foodName,
        category,
        quantityKg,
        servings,
        foodType,
        photoUrl: selectedPhoto,
        preparedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + bestBeforeHours * 60 * 60 * 1000).toISOString(),
        pickupNotes: additionalNotes,
        dietaryTags: [foodType === 'Veg' ? 'Pure Veg' : 'Non-Veg', 'Freshly Prepared', 'Hygienic Containers'],
        safetyChecklist: checklist,
        isUrgent: bestBeforeHours <= 2,
      });

      setCurrentRole('donor');
      setActiveTab('home');
    } catch (err) {
      console.error('Error posting donation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Header Banner matching Website Hero */}
      <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#022c22] p-8 rounded-3xl border border-emerald-800/40 shadow-xl space-y-3 text-white">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>RESCUE SURPLUS FOOD</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Post Surplus Food Donation</h1>
        <p className="text-xs text-emerald-100 max-w-2xl font-medium">
          List leftover event catering, restaurant surplus, or mess food. Nearby NGOs and verified volunteers will receive instant geo-notifications to pick up and distribute it safely.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-8">
        
        <div className="space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Utensils className="w-5 h-5 text-emerald-600" />
            <span>1. Food Surplus Details</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Food Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">Food Item Name / Title *</label>
              <input
                type="text"
                placeholder="e.g. 50 kg Mixed Veg Biryani, Raita & Chapati"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Food Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600 transition-colors"
              >
                <option value="Cooked Meals">Cooked Meals (Rice, Curry, Roti)</option>
                <option value="Bakery & Bread">Bakery & Bread (Pav, Loaves, Cakes)</option>
                <option value="Fresh Produce">Fresh Produce (Fruits, Salads)</option>
                <option value="Packaged Goods">Packaged Goods & Snacks</option>
                <option value="Dairy & Beverages">Dairy & Beverages</option>
              </select>
            </div>

            {/* Food Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Dietary Classification</label>
              <div className="flex gap-3 pt-0.5">
                <button
                  type="button"
                  onClick={() => setFoodType('Veg')}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                    foodType === 'Veg'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🟢 Pure Veg
                </button>
                <button
                  type="button"
                  onClick={() => setFoodType('Non-Veg')}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                    foodType === 'Non-Veg'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🔴 Non-Veg
                </button>
              </div>
            </div>

            {/* Quantity kg */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Quantity (in kg)</label>
              <input
                type="number"
                min="1"
                max="500"
                value={quantityKg}
                onChange={(e) => {
                  const kg = Number(e.target.value);
                  setQuantityKg(kg);
                  setServings(Math.round(kg * 2.5));
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Servings count */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Estimated Servings / Meals</label>
              <input
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600"
              />
            </div>

          </div>
        </div>

        {/* 2. Timing & Location */}
        <div className="space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-5 h-5 text-teal-600" />
            <span>2. Time & Pickup Location</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Preparation Time</label>
              <input
                type="time"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Best Before Window</label>
              <select
                value={bestBeforeHours}
                onChange={(e) => setBestBeforeHours(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600"
              >
                <option value={2}>🚨 Urgent: 2 Hours</option>
                <option value={4}>4 Hours (Standard FSSAI Window)</option>
                <option value={6}>6 Hours (Thermal Storage)</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">Pickup Address / GPS Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

          </div>
        </div>

        {/* 3. Photo Selector */}
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <ImageIcon className="w-5 h-5 text-sky-600" />
            <span>3. Food Image Verification</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SAMPLE_PHOTOS.map((photo, i) => (
              <div
                key={i}
                onClick={() => setSelectedPhoto(photo.url)}
                className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all h-24 ${
                  selectedPhoto === photo.url ? 'border-emerald-600 scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-bold text-white leading-tight">{photo.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. FSSAI Safety Confirmation */}
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-amber-700">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>FSSAI MANDATORY FOOD SAFETY CONFIRMATION</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-lg bg-white border border-slate-200">
              <input
                type="checkbox"
                checked={checklist.hygienicPrep}
                onChange={(e) => setChecklist({ ...checklist, hygienicPrep: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-700">Food was prepared hygienically in clean facility</span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-lg bg-white border border-slate-200">
              <input
                type="checkbox"
                checked={checklist.properTemperature}
                onChange={(e) => setChecklist({ ...checklist, properTemperature: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-700">Food stored at safe temperatures (&gt;60°C or &lt;5°C)</span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-lg bg-white border border-slate-200">
              <input
                type="checkbox"
                checked={checklist.safeTimeWindow}
                onChange={(e) => setChecklist({ ...checklist, safeTimeWindow: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-700">Food is within safe consumption window (&lt;6 hours old)</span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-lg bg-white border border-slate-200">
              <input
                type="checkbox"
                checked={checklist.unservedSurplus}
                onChange={(e) => setChecklist({ ...checklist, unservedSurplus: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-700">Unserved surplus food (untouched by consumers)</span>
            </label>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-black text-xs bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSubmitting ? 'BROADCASTING SURPLUS DONATION...' : 'BROADCAST SURPLUS DONATION NOW'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </form>

    </div>
  );
};
