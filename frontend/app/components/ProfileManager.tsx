'use client';

import { useState } from 'react';
import { X, Plus, User, Calendar, Clock, MapPin, Globe, Save, Trash2 } from 'lucide-react';
import { API_URL } from '@/app/config';

interface ProfileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: () => void;
}

export default function ProfileManager({ isOpen, onClose, onProfileCreated }: ProfileManagerProps) {
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    time_of_birth: '09:00:00',
    birthplace: '',
    latitude: '',
    longitude: '',
    timezone: 'Asia/Kolkata',
    tob_accuracy: 'APPROXIMATE',
    preferred_system: 'VEDIC',
    language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  const handleGeocodeLocation = async () => {
    if (!formData.birthplace.trim()) {
      setError('Please enter a birthplace first');
      return;
    }

    setLocationLoading(true);
    setError('');

    try {
      // Using Nominatim OpenStreetMap geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.birthplace)}&format=json&limit=1`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = data[0];
        setFormData(prev => ({
          ...prev,
          latitude: location.lat,
          longitude: location.lon
        }));
      } else {
        setError('Location not found. Please try a different query.');
      }
    } catch (err) {
      setError('Failed to geocode location. Please enter coordinates manually.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/v1/users/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          date_of_birth: formData.date_of_birth,
          time_of_birth: formData.time_of_birth,
          birthplace: formData.birthplace,
          latitude: parseFloat(formData.latitude) || 0,
          longitude: parseFloat(formData.longitude) || 0,
          timezone: formData.timezone,
          tob_accuracy: formData.tob_accuracy,
          preferred_system: formData.preferred_system,
          language: formData.language
        })
      });

      if (response.ok) {
        // Reset form
        setFormData({
          name: '',
          date_of_birth: '',
          time_of_birth: '09:00:00',
          birthplace: '',
          latitude: '',
          longitude: '',
          timezone: 'Asia/Kolkata',
          tob_accuracy: 'APPROXIMATE',
          preferred_system: 'VEDIC',
          language: 'en'
        });
        
        onProfileCreated();
        onClose();
      } else if (response.status === 401) {
        window.location.href = '/auth/login';
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        console.error('Profile creation error:', errorData);
        setError(typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail));
      }
    } catch (err: any) {
      console.error('Network error creating profile:', err);
      setError(`Network error: ${err.message || 'Please check your connection and try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold flex items-center">
              <User className="w-8 h-8 mr-3" />
              Create New Profile
            </h2>
            <p className="text-purple-100 mt-1">Add a family member or friend's birth details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-xl">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-gray-900"
              placeholder="Enter full name"
            />
          </div>

          {/* Date of Birth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={formData.date_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Time of Birth *
              </label>
              <input
                type="time"
                step="1"
                required
                value={formData.time_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, time_of_birth: e.target.value + ':00' }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-gray-900"
              />
            </div>
          </div>

          {/* Birthplace */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Birthplace *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                required
                value={formData.birthplace}
                onChange={(e) => setFormData(prev => ({ ...prev, birthplace: e.target.value }))}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-gray-900"
                placeholder="City, State, Country"
              />
              <button
                type="button"
                onClick={handleGeocodeLocation}
                disabled={locationLoading}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition font-semibold disabled:opacity-50"
              >
                {locationLoading ? '...' : <Globe className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-gray-900"
                placeholder="Auto-filled or manual"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-gray-900"
                placeholder="Auto-filled or manual"
              />
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-2" />
              Timezone
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-gray-900"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          {/* Time Accuracy */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Time Accuracy
            </label>
            <select
              value={formData.tob_accuracy}
              onChange={(e) => setFormData(prev => ({ ...prev, tob_accuracy: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-gray-900"
            >
              <option value="EXACT">Exact (from birth certificate)</option>
              <option value="APPROXIMATE">Approximate (remembered)</option>
              <option value="UNKNOWN">Unknown</option>
            </select>
          </div>

          {/* Chart System */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Chart System
              </label>
              <select
                value={formData.preferred_system}
                onChange={(e) => setFormData(prev => ({ ...prev, preferred_system: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-gray-900"
              >
                <option value="VEDIC">Vedic (Indian)</option>
                <option value="WESTERN">Western</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-gray-900"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Creating...' : 'Create Profile'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
