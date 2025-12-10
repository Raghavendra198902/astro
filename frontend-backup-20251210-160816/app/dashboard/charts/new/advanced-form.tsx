'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, MapPin, Clock, Sparkles, ChevronRight, Loader2, 
  Globe, MapPinned, Star
} from 'lucide-react';
import { toast } from 'sonner';
import { chartsService } from '@/lib/api';

interface ChartFormData {
  name: string;
  birth_date: string;
  birth_time: string;
  latitude: number | string;
  longitude: number | string;
  timezone: string;
  birthplace?: string;
  system: 'vedic' | 'western';
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

export default function AdvancedChartForm() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<ChartFormData>({
    name: '',
    birth_date: '',
    birth_time: '',
    latitude: '',
    longitude: '',
    timezone: 'Asia/Kolkata',
    birthplace: '',
    system: 'vedic',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ChartFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: Partial<Record<keyof ChartFormData, string>> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.birth_date) newErrors.birth_date = 'Birth date is required';
    if (!formData.birth_time) newErrors.birth_time = 'Birth time is required';
    if (!formData.latitude) newErrors.latitude = 'Latitude is required';
    if (!formData.longitude) newErrors.longitude = 'Longitude is required';
    if (!formData.timezone) newErrors.timezone = 'Timezone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const chartData = {
        name: formData.name,
        birth_date: formData.birth_date,
        birth_time: formData.birth_time,
        latitude: parseFloat(formData.latitude.toString()),
        longitude: parseFloat(formData.longitude.toString()),
        timezone: formData.timezone,
        birthplace: formData.birthplace || undefined,
        system: formData.system,
      };

      await chartsService.createNatalChart(chartData);
      toast.success('Chart generated successfully!');
      router.push('/dashboard/charts');
    } catch (error: any) {
      console.error('Chart generation error:', error);
      toast.error(error.detail || 'Failed to generate chart');
    } finally {
      setLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(4),
            longitude: position.coords.longitude.toFixed(4),
          });
          toast.success('Location detected!');
        },
        (error) => {
          toast.error('Could not detect location');
        }
      );
    } else {
      toast.error('Geolocation not supported');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff33_1px,transparent_1px),linear-gradient(to_bottom,#ffffff33_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold text-white">Generate Natal Chart</h1>
          </div>
          <p className="text-white/80 text-lg ml-15">Create your personalized astrological birth chart</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
        {/* Chart Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Chart Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="My Birth Chart"
            className={`w-full px-4 py-3 bg-gray-50 border-2 ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all text-gray-900`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Birth Date & Time */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Birth Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              className={`w-full px-4 py-3 bg-gray-50 border-2 ${errors.birth_date ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all text-gray-900`}
            />
            {errors.birth_date && <p className="mt-1 text-sm text-red-500">{errors.birth_date}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Birth Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={formData.birth_time}
              onChange={(e) => setFormData({ ...formData, birth_time: e.target.value })}
              className={`w-full px-4 py-3 bg-gray-50 border-2 ${errors.birth_time ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all text-gray-900`}
            />
            {errors.birth_time && <p className="mt-1 text-sm text-red-500">{errors.birth_time}</p>}
          </div>
        </div>

        {/* Birth Place */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Birth Place (Optional)
          </label>
          <input
            type="text"
            value={formData.birthplace}
            onChange={(e) => setFormData({ ...formData, birthplace: e.target.value })}
            placeholder="Mumbai, India"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all text-gray-900"
          />
        </div>

        {/* Coordinates */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Latitude <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              placeholder="19.0760"
              className={`w-full px-4 py-3 bg-gray-50 border-2 ${errors.latitude ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all text-gray-900`}
            />
            {errors.latitude && <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Longitude <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              placeholder="72.8777"
              className={`w-full px-4 py-3 bg-gray-50 border-2 ${errors.longitude ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all text-gray-900`}
            />
            {errors.longitude && <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>}
          </div>
        </div>

        {/* Use Current Location Button */}
        <button
          type="button"
          onClick={useCurrentLocation}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors"
        >
          <MapPinned className="w-4 h-4" />
          Use Current Location
        </button>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Globe className="w-4 h-4 inline mr-1" />
            Timezone <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all text-gray-900"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label} ({tz.offset})
              </option>
            ))}
          </select>
        </div>

        {/* Chart System */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Star className="w-4 h-4 inline mr-1" />
            Chart System
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, system: 'vedic' })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.system === 'vedic'
                  ? 'border-violet-500 bg-violet-50 text-violet-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold mb-1">Vedic</div>
              <div className="text-xs">Indian/Hindu Astrology</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, system: 'western' })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.system === 'western'
                  ? 'border-violet-500 bg-violet-50 text-violet-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold mb-1">Western</div>
              <div className="text-xs">Tropical Astrology</div>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="group relative flex-1 py-3.5 rounded-xl font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:scale-105 transition-transform"></div>
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Chart
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
