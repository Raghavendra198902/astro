'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, MapPin, Clock, Sparkles, ChevronRight, Loader2, 
  Globe, Zap, Search, MapPinned, Info, CheckCircle2,
  AlertCircle, Star, TrendingUp, Settings, X
} from 'lucide-react';
import { toast } from 'sonner';
import chartsApi from '@/lib/api/charts';
import { useLanguage } from '@/lib/contexts/language.context';
import { dashboardTranslations } from '@/lib/translations/dashboard.translations';

interface ChartFormData {
  // Basic Information
  name: string;
  fullName: string;
  gender: 'male' | 'female' | 'other';
  
  // Birth Details
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
  
  // Chart Configuration
  chartType: 'vedic' | 'western';
  chartStyle: 'north' | 'south' | 'east';
  houseSystem: 'whole_sign' | 'placidus' | 'koch' | 'equal';
  ayanamsa: 'lahiri' | 'raman' | 'krishnamurti' | 'ks';
  
  // Advanced Options
  includeDivisional: boolean;
  divisionalCharts: string[];
  includeDasha: boolean;
  includeTransits: boolean;
  includeYogas: boolean;
  
  // Analysis Preferences
  language: 'en' | 'hi' | 'mr';
  interpretationDepth: 'basic' | 'detailed' | 'comprehensive';
  focusAreas: string[];
}

const timezones = [
  { value: 'Asia/Kolkata', label: 'India (IST)', offset: '+05:30' },
  { value: 'America/New_York', label: 'New York (EST)', offset: '-05:00' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)', offset: '-08:00' },
  { value: 'Europe/London', label: 'London (GMT)', offset: '+00:00' },
  { value: 'Europe/Paris', label: 'Paris (CET)', offset: '+01:00' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: '+04:00' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: '+08:00' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)', offset: '+11:00' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZDT)', offset: '+13:00' },
];

const divisionalCharts = [
  { id: 'D1', name: 'Rashi (D1)', desc: 'Main Birth Chart' },
  { id: 'D2', name: 'Hora (D2)', desc: 'Wealth & Fortune' },
  { id: 'D3', name: 'Drekkana (D3)', desc: 'Siblings & Courage' },
  { id: 'D9', name: 'Navamsa (D9)', desc: 'Spouse & Dharma' },
  { id: 'D10', name: 'Dasamsa (D10)', desc: 'Career & Status' },
  { id: 'D12', name: 'Dwadasamsa (D12)', desc: 'Parents' },
  { id: 'D16', name: 'Shodasamsa (D16)', desc: 'Vehicles & Assets' },
  { id: 'D20', name: 'Vimsamsa (D20)', desc: 'Spiritual Progress' },
  { id: 'D24', name: 'Chaturvimsamsa (D24)', desc: 'Education' },
  { id: 'D27', name: 'Saptavimsamsa (D27)', desc: 'Strength & Weakness' },
  { id: 'D30', name: 'Trimsamsa (D30)', desc: 'Misfortunes' },
  { id: 'D40', name: 'Khavedamsa (D40)', desc: 'Auspicious Effects' },
  { id: 'D45', name: 'Akshavedamsa (D45)', desc: 'Character' },
  { id: 'D60', name: 'Shashtiamsa (D60)', desc: 'Past Life & Karma' },
];

const focusAreas = [
  { id: 'career', name: 'Career & Profession', icon: '💼' },
  { id: 'relationships', name: 'Love & Relationships', icon: '❤️' },
  { id: 'health', name: 'Health & Wellness', icon: '🏥' },
  { id: 'finance', name: 'Wealth & Finance', icon: '💰' },
  { id: 'education', name: 'Education & Learning', icon: '📚' },
  { id: 'spiritual', name: 'Spiritual Growth', icon: '🕉️' },
  { id: 'family', name: 'Family & Home', icon: '🏠' },
  { id: 'children', name: 'Children & Legacy', icon: '👶' },
];

export default function AdvancedChartForm() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = dashboardTranslations[language];
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [searchingLocation, setSearchingLocation] = useState(false);
  
  const [formData, setFormData] = useState<ChartFormData>({
    name: '',
    fullName: '',
    gender: 'male',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    latitude: null,
    longitude: null,
    timezone: 'Asia/Kolkata',
    chartType: 'vedic',
    chartStyle: 'north',
    houseSystem: 'whole_sign',
    ayanamsa: 'lahiri',
    includeDivisional: true,
    divisionalCharts: ['D9', 'D10'],
    includeDasha: true,
    includeTransits: true,
    includeYogas: true,
    language: 'en',
    interpretationDepth: 'detailed',
    focusAreas: ['career', 'relationships'],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ChartFormData, string>>>({});

  // Simulate location search (in production, use Google Places API or similar)
  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    setSearchingLocation(true);
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        { name: 'Mumbai, Maharashtra, India', lat: 19.0760, lon: 72.8777, timezone: 'Asia/Kolkata' },
        { name: 'Delhi, India', lat: 28.7041, lon: 77.1025, timezone: 'Asia/Kolkata' },
        { name: 'Aurangabad, Maharashtra, India', lat: 19.8762, lon: 75.3433, timezone: 'Asia/Kolkata' },
        { name: 'Pune, Maharashtra, India', lat: 18.5204, lon: 73.8567, timezone: 'Asia/Kolkata' },
        { name: 'Bangalore, Karnataka, India', lat: 12.9716, lon: 77.5946, timezone: 'Asia/Kolkata' },
      ].filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()));
      
      setLocationSuggestions(mockResults);
      setSearchingLocation(false);
    }, 500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationSearch) {
        searchLocation(locationSearch);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [locationSearch]);

  const selectLocation = (location: any) => {
    setFormData({
      ...formData,
      birthPlace: location.name,
      latitude: location.lat,
      longitude: location.lon,
      timezone: location.timezone,
    });
    setLocationSearch('');
    setLocationSuggestions([]);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof ChartFormData, string>> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
      if (!formData.birthTime) newErrors.birthTime = 'Birth time is required';
      if (!formData.birthPlace) newErrors.birthPlace = 'Birth place is required';
      if (!formData.latitude || !formData.longitude) newErrors.birthPlace = 'Please select a location from suggestions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Create chart with backend API
      const chartData = await chartsApi.createChart({
        name: formData.name || `${formData.fullName}'s Birth Chart`,
        birth_date: formData.birthDate,
        birth_time: formData.birthTime,
        birth_place: formData.birthPlace,
        latitude: formData.latitude!,
        longitude: formData.longitude!,
        timezone: formData.timezone,
        chart_type: formData.chartType,
        house_system: formData.houseSystem,
      });
      
      toast.success('🎉 Chart generated successfully!');
      router.push(`/dashboard/charts/${chartData.id}`);
    } catch (error: any) {
      console.error('Error generating chart:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate chart');
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-4 transition-colors"
        >
          ← Back to Charts
        </button>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Generate Birth Chart
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create a comprehensive astrological chart with AI-powered interpretations
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                s < step ? 'bg-violet-600 border-violet-600 text-white' :
                s === step ? 'bg-violet-600 border-violet-600 text-white scale-110' :
                'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
              }`}>
                {s < step ? <CheckCircle2 className="w-6 h-6" /> : s}
              </div>
              {s < totalSteps && (
                <div className={`w-20 sm:w-32 lg:w-48 h-1 mx-2 rounded-full transition-all ${
                  s < step ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className={step >= 1 ? 'text-violet-600 font-semibold' : 'text-gray-500'}>Birth Details</span>
          <span className={step >= 2 ? 'text-violet-600 font-semibold' : 'text-gray-500'}>Chart Settings</span>
          <span className={step >= 3 ? 'text-violet-600 font-semibold' : 'text-gray-500'}>Preferences</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Birth Details */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Birth Information</h2>
                <p className="text-gray-600 dark:text-gray-400">Enter accurate birth details for precise chart calculation</p>
              </div>
            </div>

            {/* Chart Name & Full Name Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Chart Name (Optional)
                </label>
                <div className="relative">
                  <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    placeholder="e.g., My Birth Chart"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 outline-none transition-all text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Enter full name as per birth certificate"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-4 py-3.5 bg-white dark:bg-gray-900 border-2 rounded-xl focus:ring-4 outline-none transition-all text-gray-900 dark:text-white ${
                    errors.fullName 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 dark:border-gray-600 focus:border-violet-500 dark:focus:border-violet-400 focus:ring-violet-100 dark:focus:ring-violet-900/20'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.fullName}
                  </p>
                )}
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'male', label: 'Male', icon: '👨' },
                  { value: 'female', label: 'Female', icon: '👩' },
                  { value: 'other', label: 'Other', icon: '⚧' },
                ].map((gender) => (
                  <label
                    key={gender.value}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.gender === gender.value
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender.value}
                      checked={formData.gender === gender.value}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-3xl mb-2">{gender.icon}</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{gender.label}</div>
                    </div>
                    {formData.gender === gender.value && (
                      <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-violet-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Birth Date & Time Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Birth Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    id="birthDate"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border-2 rounded-xl focus:ring-4 outline-none transition-all text-gray-900 dark:text-white ${
                      errors.birthDate
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-200 dark:border-gray-600 focus:border-violet-500 dark:focus:border-violet-400 focus:ring-violet-100 dark:focus:ring-violet-900/20'
                    }`}
                  />
                </div>
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.birthDate}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="birthTime" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Birth Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="time"
                    id="birthTime"
                    value={formData.birthTime}
                    onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border-2 rounded-xl focus:ring-4 outline-none transition-all text-gray-900 dark:text-white ${
                      errors.birthTime
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-200 dark:border-gray-600 focus:border-violet-500 dark:focus:border-violet-400 focus:ring-violet-100 dark:focus:ring-violet-900/20'
                    }`}
                  />
                </div>
                {errors.birthTime && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.birthTime}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Use 24-hour format (e.g., 14:30 for 2:30 PM)
                </p>
              </div>
            </div>

            {/* Birth Place with Autocomplete */}
            <div>
              <label htmlFor="birthPlace" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Birth Place <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="text"
                  id="birthPlace"
                  placeholder="Search for city, state, country..."
                  value={locationSearch || formData.birthPlace}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    if (!e.target.value) {
                      setFormData({ ...formData, birthPlace: '', latitude: null, longitude: null });
                    }
                  }}
                  className={`w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border-2 rounded-xl focus:ring-4 outline-none transition-all text-gray-900 dark:text-white ${
                    errors.birthPlace
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-200 dark:border-gray-600 focus:border-violet-500 dark:focus:border-violet-400 focus:ring-violet-100 dark:focus:ring-violet-900/20'
                  }`}
                />
                {searchingLocation && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                )}
                
                {/* Location Suggestions Dropdown */}
                {locationSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                    {locationSuggestions.map((location, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectLocation(location)}
                        className="w-full px-4 py-3 text-left hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <MapPinned className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{location.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {location.lat.toFixed(4)}°, {location.lon.toFixed(4)}° • {location.timezone}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {formData.latitude && formData.longitude && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Location confirmed: {formData.latitude.toFixed(4)}°, {formData.longitude.toFixed(4)}°</span>
                </div>
              )}
              
              {errors.birthPlace && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.birthPlace}
                </p>
              )}
            </div>

            {/* Timezone Selection */}
            <div>
              <label htmlFor="timezone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 outline-none transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label} ({tz.offset})
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Timezone is auto-selected based on birth place
              </p>
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-300">
                  <p className="font-semibold mb-1">Accuracy Matters</p>
                  <p>For precise astrological calculations, please ensure all birth details are accurate. Even a few minutes difference can significantly impact chart interpretations.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Chart Configuration */}
        {step === 2 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Chart Configuration</h2>
                <p className="text-gray-600 dark:text-gray-400">Customize your chart calculation settings</p>
              </div>
            </div>

            {/* Chart Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Chart System
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { 
                    value: 'vedic', 
                    label: 'Vedic (Sidereal)', 
                    icon: '🕉️',
                    desc: 'Based on fixed stars, includes Nakshatras & Dashas'
                  },
                  { 
                    value: 'western', 
                    label: 'Western (Tropical)', 
                    icon: '⭐',
                    desc: 'Based on seasons, includes modern aspects'
                  },
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                      formData.chartType === type.value
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg'
                        : 'border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="chartType"
                      value={type.value}
                      checked={formData.chartType === type.value}
                      onChange={(e) => setFormData({ ...formData, chartType: e.target.value as any })}
                      className="sr-only"
                    />
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{type.icon}</span>
                        <span className="font-bold text-gray-900 dark:text-white">{type.label}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{type.desc}</p>
                    </div>
                    {formData.chartType === type.value && (
                      <CheckCircle2 className="absolute top-3 right-3 w-6 h-6 text-violet-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Vedic-specific options */}
            {formData.chartType === 'vedic' && (
              <>
                {/* Chart Style */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Chart Style (Visualization)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'north', label: 'North Indian', icon: '🔲' },
                      { value: 'south', label: 'South Indian', icon: '🔶' },
                      { value: 'east', label: 'East Indian', icon: '⭕' },
                    ].map((style) => (
                      <label
                        key={style.value}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.chartStyle === style.value
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-violet-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="chartStyle"
                          value={style.value}
                          checked={formData.chartStyle === style.value}
                          onChange={(e) => setFormData({ ...formData, chartStyle: e.target.value as any })}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-3xl mb-2">{style.icon}</div>
                          <div className="font-semibold text-sm text-gray-900 dark:text-white">{style.label}</div>
                        </div>
                        {formData.chartStyle === style.value && (
                          <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-violet-600" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Ayanamsa Selection */}
                <div>
                  <label htmlFor="ayanamsa" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ayanamsa (Precession Calculation)
                  </label>
                  <select
                    id="ayanamsa"
                    value={formData.ayanamsa}
                    onChange={(e) => setFormData({ ...formData, ayanamsa: e.target.value as any })}
                    className="w-full px-4 py-3.5 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 outline-none transition-all text-gray-900 dark:text-white"
                  >
                    <option value="lahiri">Lahiri (Most Popular)</option>
                    <option value="raman">Raman (Traditional)</option>
                    <option value="krishnamurti">Krishnamurti (KP System)</option>
                    <option value="ks">KS Krishnamurthi</option>
                  </select>
                </div>

                {/* Divisional Charts */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Divisional Charts (Vargas)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.includeDivisional}
                        onChange={(e) => setFormData({ ...formData, includeDivisional: e.target.checked })}
                        className="w-5 h-5 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Include in analysis</span>
                    </label>
                  </div>
                  
                  {formData.includeDivisional && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      {divisionalCharts.map((chart) => (
                        <label
                          key={chart.id}
                          className="flex items-start gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={formData.divisionalCharts.includes(chart.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ 
                                  ...formData, 
                                  divisionalCharts: [...formData.divisionalCharts, chart.id] 
                                });
                              } else {
                                setFormData({ 
                                  ...formData, 
                                  divisionalCharts: formData.divisionalCharts.filter(id => id !== chart.id) 
                                });
                              }
                            }}
                            className="mt-1 w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                          />
                          <div className="text-sm">
                            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400">
                              {chart.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{chart.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* House System (for Western) */}
            {formData.chartType === 'western' && (
              <div>
                <label htmlFor="houseSystem" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  House System
                </label>
                <select
                  id="houseSystem"
                  value={formData.houseSystem}
                  onChange={(e) => setFormData({ ...formData, houseSystem: e.target.value as any })}
                  className="w-full px-4 py-3.5 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 outline-none transition-all text-gray-900 dark:text-white"
                >
                  <option value="placidus">Placidus (Most Popular)</option>
                  <option value="whole_sign">Whole Sign</option>
                  <option value="koch">Koch</option>
                  <option value="equal">Equal House</option>
                </select>
              </div>
            )}

            {/* Additional Features */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Additional Features
              </label>
              <div className="space-y-3">
                {[
                  { 
                    key: 'includeDasha', 
                    label: 'Dasha Periods', 
                    desc: 'Planetary periods and sub-periods (Vimshottari)' 
                  },
                  { 
                    key: 'includeTransits', 
                    label: 'Current Transits', 
                    desc: 'Real-time planetary movements and their effects' 
                  },
                  { 
                    key: 'includeYogas', 
                    label: 'Yogas Analysis', 
                    desc: 'Special planetary combinations and their meanings' 
                  },
                ].map((feature) => (
                  <label
                    key={feature.key}
                    className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData[feature.key as keyof ChartFormData] as boolean}
                      onChange={(e) => setFormData({ ...formData, [feature.key]: e.target.checked })}
                      className="mt-1 w-5 h-5 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{feature.label}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Analysis Preferences */}
        {step === 3 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis Preferences</h2>
                <p className="text-gray-600 dark:text-gray-400">Customize your interpretation and focus areas</p>
              </div>
            </div>

            {/* Interpretation Depth */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Interpretation Depth
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { 
                    value: 'basic', 
                    label: 'Basic', 
                    icon: '📊',
                    desc: 'Quick overview with key insights' 
                  },
                  { 
                    value: 'detailed', 
                    label: 'Detailed', 
                    icon: '📈',
                    desc: 'Comprehensive analysis with remedies' 
                  },
                  { 
                    value: 'comprehensive', 
                    label: 'Comprehensive', 
                    icon: '📚',
                    desc: 'In-depth report with predictions' 
                  },
                ].map((depth) => (
                  <label
                    key={depth.value}
                    className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                      formData.interpretationDepth === depth.value
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg'
                        : 'border-gray-200 dark:border-gray-600 hover:border-violet-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="interpretationDepth"
                      value={depth.value}
                      checked={formData.interpretationDepth === depth.value}
                      onChange={(e) => setFormData({ ...formData, interpretationDepth: e.target.value as any })}
                      className="sr-only"
                    />
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{depth.icon}</span>
                        <span className="font-bold text-gray-900 dark:text-white">{depth.label}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{depth.desc}</p>
                    </div>
                    {formData.interpretationDepth === depth.value && (
                      <CheckCircle2 className="absolute top-3 right-3 w-6 h-6 text-violet-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Focus Areas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Focus Areas (Select areas you want detailed analysis on)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {focusAreas.map((area) => (
                  <label
                    key={area.id}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                      formData.focusAreas.includes(area.id)
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-violet-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.focusAreas.includes(area.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ 
                            ...formData, 
                            focusAreas: [...formData.focusAreas, area.id] 
                          });
                        } else {
                          setFormData({ 
                            ...formData, 
                            focusAreas: formData.focusAreas.filter(id => id !== area.id) 
                          });
                        }
                      }}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-3xl mb-2">{area.icon}</div>
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">{area.name}</div>
                    </div>
                    {formData.focusAreas.includes(area.id) && (
                      <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-violet-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Report Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Report Language
              </label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
                className="w-full px-4 py-3.5 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 outline-none transition-all text-gray-900 dark:text-white"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            {/* Summary Box */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-2 border-violet-200 dark:border-violet-800 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Chart Summary</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Full Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formData.fullName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Birth Date & Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formData.birthDate ? new Date(formData.birthDate).toLocaleDateString() : 'Not provided'} at {formData.birthTime || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Birth Place</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formData.birthPlace || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Chart Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">
                    {formData.chartType} {formData.chartType === 'vedic' && `(${formData.chartStyle} style)`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Analysis Depth</p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">{formData.interpretationDepth}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Focus Areas</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formData.focusAreas.length} selected</p>
                </div>
              </div>
            </div>

            {/* AI Interpretation Info */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4">
              <div className="flex gap-3">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div className="text-sm text-purple-900 dark:text-purple-300">
                  <p className="font-semibold mb-2">✨ AI-Powered Analysis</p>
                  <p>Your chart will be analyzed by advanced AI models trained on thousands of years of astrological wisdom. You'll receive personalized insights, predictions, and remedial suggestions tailored to your specific planetary positions.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              disabled={loading}
              className="px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              ← Previous
            </button>
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={loading}
              className="ml-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[200px] justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Generate Chart
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Features Strip */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: '🤖', title: 'AI-Powered', desc: 'Advanced machine learning for accurate predictions' },
          { icon: '🔒', title: 'Secure & Private', desc: 'Your data is encrypted and never shared' },
          { icon: '⚡', title: 'Instant Results', desc: 'Get your complete chart analysis in seconds' },
        ].map((feature, index) => (
          <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
