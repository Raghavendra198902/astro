'use client';

import { useState } from 'react';
import { X, MapPin, Calendar, Clock, User } from 'lucide-react';
import { API_URL } from '@/app/config';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function ProfileCompletionModal({ isOpen, onClose, onComplete }: ProfileCompletionModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    latitude: 0,
    longitude: 0,
    timezone: 'UTC',
    preferred_system: 'vedic',
    tob_accuracy: 'exact'
  });

  const [locationSearch, setLocationSearch] = useState('');
  const [locationResults, setLocationResults] = useState<any[]>([]);

  if (!isOpen) return null;

  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setLocationResults([]);
      return;
    }

    try {
      // Use a geocoding service (example with OpenStreetMap Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setLocationResults(data);
    } catch (error) {
      console.error('Location search failed:', error);
    }
  };

  const selectLocation = (location: any) => {
    setFormData({
      ...formData,
      birthPlace: location.display_name,
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon)
    });
    setLocationSearch(location.display_name);
    setLocationResults([]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Create or update profile
      const response = await fetch(`${API_URL}/api/v1/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          birth_date: formData.birthDate,
          birth_time: formData.birthTime,
          birth_place: formData.birthPlace,
          latitude: formData.latitude,
          longitude: formData.longitude,
          timezone: formData.timezone,
          preferred_system: formData.preferred_system,
          tob_accuracy: formData.tob_accuracy
        })
      });

      if (response.ok) {
        onComplete();
      } else {
        const data = await response.json();
        // Handle Pydantic validation errors
        let errorMessage = 'Failed to save profile';
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail) && data.detail.length > 0) {
          errorMessage = data.detail[0]?.msg || 'Validation error';
        }
        setError(errorMessage);
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
            <p className="text-gray-400 text-sm mt-1">We need your birth details for accurate predictions</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step
                    ? 'w-12 bg-gradient-to-r from-purple-600 to-pink-600'
                    : s < step
                    ? 'w-8 bg-purple-600'
                    : 'w-8 bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Preferred System
                  </label>
                  <select
                    value={formData.preferred_system}
                    onChange={(e) => setFormData({ ...formData, preferred_system: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="vedic">Vedic</option>
                    <option value="western">Western</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="en">English</option>
                    <option value="mr">Marathi</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.name}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Birth Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Birth Details</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Time of Birth
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter exact time if known</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Time Accuracy
                </label>
                <select
                  value={formData.tob_accuracy}
                  onChange={(e) => setFormData({ ...formData, tob_accuracy: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="exact">Exact (from certificate)</option>
                  <option value="approximate">Approximate (±1 hour)</option>
                  <option value="unknown">Unknown (use noon)</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.birthDate || !formData.birthTime}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Birth Place */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Birth Location</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Search Birth Place
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      searchLocation(e.target.value);
                    }}
                    placeholder="Mumbai, Maharashtra, India"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Location Results */}
                {locationResults.length > 0 && (
                  <div className="mt-2 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    {locationResults.map((location, index) => (
                      <button
                        key={index}
                        onClick={() => selectLocation(location)}
                        className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
                      >
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{location.display_name}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {formData.birthPlace && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <p className="text-sm text-purple-300 mb-1">Selected Location:</p>
                  <p className="text-white font-semibold">{formData.birthPlace}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Coordinates: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !formData.birthPlace}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Complete Profile'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Skip Option */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Skip for now (you can add this later in settings)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
