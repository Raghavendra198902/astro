'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar,
  Clock,
  MapPin,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TrendingUp,
  Heart,
  Briefcase,
  DollarSign,
  Users,
  Home,
  GraduationCap,
  Sparkles,
  Shield,
  Zap,
  ChevronLeft,
  ChevronRight,
  Star,
  Globe,
  Info,
  Settings,
  BarChart3,
  List,
  CalendarDays
} from 'lucide-react';

interface LifeEventsFormData {
  // Birth Information
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
  
  // Prediction Range
  predictionType: 'specific_date' | 'range';
  specificDate: string;
  rangeType: '6_months' | '1_year' | '3_years' | '5_years' | 'custom';
  customStartDate: string;
  customEndDate: string;
  
  // Event Categories
  eventCategories: string[];
  
  // Prediction Methods
  predictionMethods: string[];
  
  // Detail Level
  detailLevel: 'timeline' | 'monthly' | 'weekly';
  
  // Visualization
  visualizationType: 'timeline' | 'calendar' | 'list' | 'graph';
  
  // Additional Options
  includeRemedies: boolean;
  includeLuckyDates: boolean;
  includeChallenges: boolean;
  language: 'en' | 'hi' | 'mr';
}

export default function AdvancedLifeEventsForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locationSearch, setLocationSearch] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [formData, setFormData] = useState<LifeEventsFormData>({
    fullName: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    latitude: null,
    longitude: null,
    timezone: 'Asia/Kolkata',
    predictionType: 'range',
    specificDate: '',
    rangeType: '1_year',
    customStartDate: '',
    customEndDate: '',
    eventCategories: ['career', 'relationships', 'health'],
    predictionMethods: ['transits', 'dasha'],
    detailLevel: 'monthly',
    visualizationType: 'timeline',
    includeRemedies: true,
    includeLuckyDates: true,
    includeChallenges: true,
    language: 'en',
  });

  const eventCategoryOptions = [
    { id: 'career', name: 'Career & Professional', icon: Briefcase, color: 'text-blue-500', desc: 'Job changes, promotions, business' },
    { id: 'relationships', name: 'Love & Relationships', icon: Heart, color: 'text-pink-500', desc: 'Romance, marriage, partnerships' },
    { id: 'health', name: 'Health & Wellness', icon: Heart, color: 'text-green-500', desc: 'Physical & mental wellbeing' },
    { id: 'financial', name: 'Finance & Wealth', icon: DollarSign, color: 'text-yellow-500', desc: 'Income, investments, property' },
    { id: 'education', name: 'Education & Learning', icon: GraduationCap, color: 'text-indigo-500', desc: 'Studies, courses, knowledge' },
    { id: 'family', name: 'Family & Home', icon: Home, color: 'text-purple-500', desc: 'Family matters, relocation' },
    { id: 'spiritual', name: 'Spiritual Growth', icon: Sparkles, color: 'text-violet-500', desc: 'Spiritual journey, awakening' },
    { id: 'social', name: 'Social & Network', icon: Users, color: 'text-cyan-500', desc: 'Friendships, connections' },
    { id: 'travel', name: 'Travel & Adventure', icon: Globe, color: 'text-teal-500', desc: 'Journeys, relocations, adventures' },
  ];

  const predictionMethodOptions = [
    { id: 'transits', name: 'Planetary Transits', desc: 'Current planetary movements', icon: Globe },
    { id: 'dasha', name: 'Dasha System', desc: 'Vedic planetary periods', icon: Clock },
    { id: 'solar_return', name: 'Solar Return', desc: 'Annual birthday chart', icon: Star },
    { id: 'progressions', name: 'Progressions', desc: 'Symbolic advancement', icon: TrendingUp },
  ];

  const timezones = [
    { value: 'Asia/Kolkata', label: 'IST (UTC+5:30)' },
    { value: 'America/New_York', label: 'EST (UTC-5:00)' },
    { value: 'America/Los_Angeles', label: 'PST (UTC-8:00)' },
    { value: 'Europe/London', label: 'GMT (UTC+0:00)' },
    { value: 'Europe/Paris', label: 'CET (UTC+1:00)' },
    { value: 'Asia/Dubai', label: 'GST (UTC+4:00)' },
    { value: 'Asia/Singapore', label: 'SGT (UTC+8:00)' },
    { value: 'Australia/Sydney', label: 'AEDT (UTC+11:00)' },
    { value: 'Pacific/Auckland', label: 'NZDT (UTC+13:00)' },
  ];

  // Mock location autocomplete
  useEffect(() => {
    if (locationSearch.length >= 2) {
      const timer = setTimeout(() => {
        const mockResults = [
          { name: 'Mumbai, Maharashtra, India', lat: 19.0760, lon: 72.8777, timezone: 'Asia/Kolkata' },
          { name: 'Delhi, India', lat: 28.7041, lon: 77.1025, timezone: 'Asia/Kolkata' },
          { name: 'Aurangabad, Maharashtra, India', lat: 19.8762, lon: 75.3433, timezone: 'Asia/Kolkata' },
          { name: 'Pune, Maharashtra, India', lat: 18.5204, lon: 73.8567, timezone: 'Asia/Kolkata' },
          { name: 'Bangalore, Karnataka, India', lat: 12.9716, lon: 77.5946, timezone: 'Asia/Kolkata' },
        ].filter(loc => loc.name.toLowerCase().includes(locationSearch.toLowerCase()));
        setLocationSuggestions(mockResults);
        setShowSuggestions(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  }, [locationSearch]);

  const selectLocation = (location: any) => {
    setFormData(prev => ({
      ...prev,
      birthPlace: location.name,
      latitude: location.lat,
      longitude: location.lon,
      timezone: location.timezone,
    }));
    setLocationSearch(location.name);
    setShowSuggestions(false);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.birthPlace;
      return newErrors;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
      if (!formData.birthTime) newErrors.birthTime = 'Birth time is required';
      if (!formData.birthPlace) newErrors.birthPlace = 'Birth place is required';
    }

    if (step === 2) {
      if (formData.predictionType === 'specific_date' && !formData.specificDate) {
        newErrors.specificDate = 'Please select a specific date';
      }
      if (formData.predictionType === 'range' && formData.rangeType === 'custom') {
        if (!formData.customStartDate) newErrors.customStartDate = 'Start date is required';
        if (!formData.customEndDate) newErrors.customEndDate = 'End date is required';
        if (formData.customStartDate && formData.customEndDate && 
            new Date(formData.customStartDate) >= new Date(formData.customEndDate)) {
          newErrors.customEndDate = 'End date must be after start date';
        }
      }
      if (formData.eventCategories.length === 0) {
        newErrors.eventCategories = 'Please select at least one event category';
      }
    }

    if (step === 3) {
      if (formData.predictionMethods.length === 0) {
        newErrors.predictionMethods = 'Please select at least one prediction method';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      router.push('/dashboard/life-events');
    } catch (error) {
      console.error('Life events prediction error:', error);
      setErrors({ submit: 'Failed to generate predictions. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEventCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      eventCategories: prev.eventCategories.includes(categoryId)
        ? prev.eventCategories.filter(id => id !== categoryId)
        : [...prev.eventCategories, categoryId]
    }));
  };

  const togglePredictionMethod = (methodId: string) => {
    setFormData(prev => ({
      ...prev,
      predictionMethods: prev.predictionMethods.includes(methodId)
        ? prev.predictionMethods.filter(id => id !== methodId)
        : [...prev.predictionMethods, methodId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Life Events Predictions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover what the stars have in store for your future
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep >= step
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500 border-blue-500 text-white'
                        : 'border-gray-300 text-gray-400 dark:border-gray-600'
                    }`}
                  >
                    {currentStep > step ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{step}</span>
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep >= step ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                  }`}>
                    {step === 1 ? 'Birth Info' : step === 2 ? 'Time Range' : 'Preferences'}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`h-0.5 flex-1 mx-2 ${
                    currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            {/* Step 1: Birth Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6 text-blue-500" />
                    Birth Information
                  </h2>

                  {/* Full Name */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all ${
                        errors.fullName ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Birth Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Birth Date *
                      </label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                        max={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all ${
                          errors.birthDate ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                        }`}
                      />
                      {errors.birthDate && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.birthDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Birth Time *
                      </label>
                      <input
                        type="time"
                        value={formData.birthTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all ${
                          errors.birthTime ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                        }`}
                      />
                      {errors.birthTime && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.birthTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Birth Place with Autocomplete */}
                  <div className="mb-6 relative">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Birth Place *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={locationSearch || formData.birthPlace}
                        onChange={(e) => {
                          setLocationSearch(e.target.value);
                          setFormData(prev => ({ ...prev, birthPlace: e.target.value }));
                        }}
                        placeholder="Search for your birth city..."
                        className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all ${
                          errors.birthPlace ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                        }`}
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    {/* Location Suggestions Dropdown */}
                    {showSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-auto">
                        {locationSuggestions.map((location, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectLocation(location)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                          >
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white text-sm">
                                  {location.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {location.lat.toFixed(4)}°, {location.lon.toFixed(4)}° • {location.timezone}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {formData.latitude && formData.longitude && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Location coordinates set: {formData.latitude.toFixed(4)}°, {formData.longitude.toFixed(4)}°
                      </div>
                    )}
                    
                    {errors.birthPlace && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.birthPlace}
                      </p>
                    )}
                  </div>

                  {/* Timezone */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Timezone *
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all"
                    >
                      {timezones.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Info Alert */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          Accurate Birth Details Required
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Precise birth information ensures more accurate life event predictions. Even small variations in time or location can affect the results.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Prediction Range & Categories */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <CalendarDays className="w-6 h-6 text-blue-500" />
                    Prediction Time Range
                  </h2>

                  {/* Prediction Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      What would you like to know? *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { value: 'specific_date', label: 'Specific Date', desc: 'Events on a particular day' },
                        { value: 'range', label: 'Time Range', desc: 'Events over a period' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, predictionType: option.value as any }))}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            formData.predictionType === option.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                          }`}
                        >
                          <div className="font-semibold text-gray-900 dark:text-white mb-1">
                            {option.label}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {option.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Specific Date Input */}
                  {formData.predictionType === 'specific_date' && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Select Date *
                      </label>
                      <input
                        type="date"
                        value={formData.specificDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, specificDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all ${
                          errors.specificDate ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                        }`}
                      />
                      {errors.specificDate && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.specificDate}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Range Selection */}
                  {formData.predictionType === 'range' && (
                    <>
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Select Time Range *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { value: '6_months', label: 'Next 6 Months' },
                            { value: '1_year', label: 'Next 1 Year' },
                            { value: '3_years', label: 'Next 3 Years' },
                            { value: '5_years', label: 'Next 5 Years' },
                            { value: 'custom', label: 'Custom Range' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, rangeType: option.value as any }))}
                              className={`p-3 rounded-xl border-2 transition-all text-sm font-semibold ${
                                formData.rangeType === option.value
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Date Range */}
                      {formData.rangeType === 'custom' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Start Date *
                            </label>
                            <input
                              type="date"
                              value={formData.customStartDate}
                              onChange={(e) => setFormData(prev => ({ ...prev, customStartDate: e.target.value }))}
                              min={new Date().toISOString().split('T')[0]}
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all ${
                                errors.customStartDate ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                              }`}
                            />
                            {errors.customStartDate && (
                              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.customStartDate}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              End Date *
                            </label>
                            <input
                              type="date"
                              value={formData.customEndDate}
                              onChange={(e) => setFormData(prev => ({ ...prev, customEndDate: e.target.value }))}
                              min={formData.customStartDate || new Date().toISOString().split('T')[0]}
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all ${
                                errors.customEndDate ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                              }`}
                            />
                            {errors.customEndDate && (
                              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.customEndDate}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Event Categories */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Event Categories * (Select at least one)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {eventCategoryOptions.map((category) => {
                        const Icon = category.icon;
                        const isSelected = formData.eventCategories.includes(category.id);
                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => toggleEventCategory(category.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Icon className={`w-6 h-6 ${isSelected ? category.color : 'text-gray-400'}`} />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1 flex items-center gap-2">
                                  {category.name}
                                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  {category.desc}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {errors.eventCategories && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.eventCategories}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Analysis Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-blue-500" />
                    Analysis Preferences
                  </h2>

                  {/* Prediction Methods */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Prediction Methods * (Select at least one)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {predictionMethodOptions.map((method) => {
                        const Icon = method.icon;
                        const isSelected = formData.predictionMethods.includes(method.id);
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => togglePredictionMethod(method.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${
                                isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                  {method.name}
                                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  {method.desc}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {errors.predictionMethods && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.predictionMethods}
                      </p>
                    )}
                  </div>

                  {/* Detail Level */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Detail Level *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: 'timeline', label: 'Timeline View', desc: 'Major events overview' },
                        { value: 'monthly', label: 'Monthly Detail', desc: 'Month-by-month breakdown' },
                        { value: 'weekly', label: 'Weekly Detail', desc: 'Week-by-week analysis' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, detailLevel: option.value as any }))}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            formData.detailLevel === option.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                          }`}
                        >
                          <div className="font-semibold text-gray-900 dark:text-white mb-1">
                            {option.label}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {option.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visualization Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Visualization Style
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'timeline', label: 'Timeline', icon: BarChart3 },
                        { value: 'calendar', label: 'Calendar', icon: Calendar },
                        { value: 'list', label: 'List', icon: List },
                        { value: 'graph', label: 'Graph', icon: TrendingUp },
                      ].map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, visualizationType: option.value as any }))}
                            className={`p-4 rounded-xl border-2 transition-all text-center ${
                              formData.visualizationType === option.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                            }`}
                          >
                            <Icon className={`w-6 h-6 mx-auto mb-2 ${
                              formData.visualizationType === option.value ? 'text-blue-500' : 'text-gray-400'
                            }`} />
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {option.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Additional Features
                    </label>
                    <div className="space-y-3">
                      {[
                        { key: 'includeRemedies', label: 'Include Remedies', desc: 'Suggested solutions for challenges' },
                        { key: 'includeLuckyDates', label: 'Lucky Dates & Times', desc: 'Auspicious periods for actions' },
                        { key: 'includeChallenges', label: 'Potential Challenges', desc: 'Warning about difficult periods' },
                      ].map((feature) => (
                        <button
                          key={feature.key}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, [feature.key]: !prev[feature.key as keyof LifeEventsFormData] }))}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            formData[feature.key as keyof LifeEventsFormData]
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                {feature.label}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {feature.desc}
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              formData[feature.key as keyof LifeEventsFormData]
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}>
                              {formData[feature.key as keyof LifeEventsFormData] && (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Report Language
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value as any }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="mr">मराठी (Marathi)</option>
                    </select>
                  </div>

                  {/* Prediction Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      Prediction Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Time Range:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white capitalize">
                          {formData.predictionType === 'specific_date' ? 'Specific Date' : formData.rangeType.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Categories:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                          {formData.eventCategories.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Methods:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                          {formData.predictionMethods.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Detail:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white capitalize">
                          {formData.detailLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Next Step
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Predictions
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Features Strip */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Sparkles, title: 'AI-Enhanced Predictions', desc: 'Advanced astrological analysis' },
            { icon: Shield, title: 'Secure & Confidential', desc: 'Your data is protected' },
            { icon: Zap, title: 'Instant Results', desc: 'Get predictions immediately' },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {feature.title}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {feature.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
