'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Sparkles,
  Star,
  Check,
  AlertCircle,
  Search
} from 'lucide-react';
import { API_URL } from '@/app/config';

export default function NewChartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    birth_time: '',
    latitude: '',
    longitude: '',
    location: '',
    timezone: 'Asia/Kolkata',
    system: 'vedic' as 'vedic' | 'western',
    house_system: 'placidus',
    ayanamsha: 'lahiri'
  });
  const [locationSearch, setLocationSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Step 1: Create profile
      const profileResponse = await fetch(`${API_URL}/api/v1/users/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          date_of_birth: formData.birth_date,
          time_of_birth: formData.birth_time + ':00', // Add seconds
          tob_accuracy: 'approximate',
          birthplace: formData.location,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          timezone: formData.timezone,
          preferred_system: formData.system,
          language: 'en'
        })
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        let errorMsg = 'Unknown error';
        if (typeof errorData.detail === 'string') {
          errorMsg = errorData.detail;
        } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
          errorMsg = errorData.detail[0]?.msg || 'Validation error';
        }
        alert(`Failed to create profile: ${errorMsg}`);
        return;
      }

      const profileData = await profileResponse.json();
      console.log('Profile created:', profileData);

      // Step 2: Create chart using the profile_id
      const chartResponse = await fetch(`${API_URL}/api/v1/charts/natal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profile_id: profileData.id,
          system: formData.system,
          options: {
            house_system: formData.house_system,
            ayanamsha: formData.ayanamsha
          }
        })
      });

      if (chartResponse.ok) {
        const chartResult = await chartResponse.json();
        router.push(`/dashboard/charts/${chartResult.id}`);
      } else {
        const errorData = await chartResponse.json();
        let errorMsg = 'Unknown error';
        if (typeof errorData.detail === 'string') {
          errorMsg = errorData.detail;
        } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
          errorMsg = errorData.detail[0]?.msg || 'Validation error';
        }
        alert(`Failed to create chart: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error creating chart:', error);
      alert('Error creating chart');
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = async (query: string) => {
    if (query.length < 3) return;
    
    try {
      // Using OpenStreetMap Nominatim API for location search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Location search error:', error);
    }
  };

  const selectLocation = (location: any) => {
    setFormData({
      ...formData,
      location: location.display_name,
      latitude: location.lat,
      longitude: location.lon
    });
    setSearchResults([]);
    setLocationSearch('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/charts"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Charts
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Create New Chart <span className="text-purple-400">(नवीन कुंडली)</span></h1>
              <p className="text-gray-400 mt-1">Generate your personalized birth chart</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Personal Info', icon: User },
              { num: 2, label: 'Birth Details', icon: Calendar },
              { num: 3, label: 'Location', icon: MapPin },
              { num: 4, label: 'Chart Type', icon: Star }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step >= s.num 
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50' 
                      : 'bg-white/10 border-2 border-white/20'
                  }`}>
                    {step > s.num ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <s.icon className={`w-6 h-6 ${step >= s.num ? 'text-white' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <span className={`text-xs mt-2 ${step >= s.num ? 'text-white font-semibold' : 'text-gray-500'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                    step > s.num ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-purple-400" />
                    Personal Information
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-300">
                    <p className="font-semibold mb-1">Privacy Note</p>
                    <p className="text-blue-300/80">Your personal information is encrypted and stored securely. We never share your data with third parties.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Birth Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-purple-400" />
                    Birth Details
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Birth Date <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.birth_date}
                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Birth Time <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        required
                        value={formData.birth_time}
                        onChange={(e) => setFormData({ ...formData, birth_time: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-300">
                    <p className="font-semibold mb-1">Accurate Time is Important</p>
                    <p className="text-yellow-300/80">For precise chart calculations, please provide your exact birth time. If unknown, use 12:00 PM as an approximate time.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-purple-400" />
                    Birth Location
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Search Location <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => {
                        setLocationSearch(e.target.value);
                        searchLocation(e.target.value);
                      }}
                      placeholder="Search for city or location..."
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 bg-slate-800 border border-white/20 rounded-xl overflow-hidden">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => selectLocation(result)}
                          className="w-full px-4 py-3 text-left hover:bg-white/10 transition flex items-center gap-2 border-b border-white/10 last:border-b-0"
                        >
                          <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          <span className="text-white text-sm">{result.display_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {formData.location && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-green-400 mb-1">Selected Location</p>
                        <p className="text-sm text-white">{formData.location}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span>Lat: {parseFloat(formData.latitude).toFixed(4)}</span>
                          <span>Lon: {parseFloat(formData.longitude).toFixed(4)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Timezone
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition cursor-pointer"
                    >
                      <option value="Asia/Kolkata" className="bg-slate-900">Asia/Kolkata (IST)</option>
                      <option value="America/New_York" className="bg-slate-900">America/New_York (EST)</option>
                      <option value="Europe/London" className="bg-slate-900">Europe/London (GMT)</option>
                      <option value="Asia/Dubai" className="bg-slate-900">Asia/Dubai (GST)</option>
                      <option value="Australia/Sydney" className="bg-slate-900">Australia/Sydney (AEDT)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Chart Type */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6 text-purple-400" />
                    Chart System & Settings
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Chart System <span className="text-red-400">*</span>
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, system: 'vedic' })}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                        formData.system === 'vedic'
                          ? 'bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-orange-500 shadow-lg shadow-orange-500/30'
                          : 'bg-white/5 border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="text-4xl mb-3">🕉️</div>
                      <h3 className="text-xl font-bold text-white mb-2">Vedic (Jyotish)</h3>
                      <p className="text-sm text-gray-400">Traditional Indian astrology using sidereal zodiac</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, system: 'western' })}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                        formData.system === 'western'
                          ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500 shadow-lg shadow-blue-500/30'
                          : 'bg-white/5 border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="text-4xl mb-3">⭐</div>
                      <h3 className="text-xl font-bold text-white mb-2">Western</h3>
                      <p className="text-sm text-gray-400">Modern astrology using tropical zodiac</p>
                    </button>
                  </div>
                </div>

                {formData.system === 'vedic' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ayanamsha
                    </label>
                    <select
                      value={formData.ayanamsha}
                      onChange={(e) => setFormData({ ...formData, ayanamsha: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition cursor-pointer"
                    >
                      <option value="lahiri" className="bg-slate-900">Lahiri (Most Popular)</option>
                      <option value="raman" className="bg-slate-900">Raman</option>
                      <option value="krishnamurti" className="bg-slate-900">Krishnamurti (KP)</option>
                      <option value="yukteshwar" className="bg-slate-900">Yukteshwar</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    House System
                  </label>
                  <select
                    value={formData.house_system}
                    onChange={(e) => setFormData({ ...formData, house_system: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition cursor-pointer"
                  >
                    <option value="placidus" className="bg-slate-900">Placidus (Default)</option>
                    <option value="whole_sign" className="bg-slate-900">Whole Sign</option>
                    <option value="koch" className="bg-slate-900">Koch</option>
                    <option value="equal" className="bg-slate-900">Equal House</option>
                  </select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition"
                >
                  Previous
                </button>
              )}
              
              <div className="flex-1" />

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !formData.name) ||
                    (step === 2 && (!formData.birth_date || !formData.birth_time)) ||
                    (step === 3 && !formData.location)
                  }
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Generating Chart...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Chart
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
