'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar,
  Sun,
  Moon,
  Star,
  Clock,
  MapPin,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language.context';
import { dashboardTranslations } from '@/lib/translations/dashboard.translations';
import { toast } from 'sonner';

export default function PanchangPage() {
  const { language } = useLanguage();
  const t = dashboardTranslations[language];
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('Mumbai, India');
  const [latitude, setLatitude] = useState(19.076);
  const [longitude, setLongitude] = useState(72.8777);
  const [isLoading, setIsLoading] = useState(true);
  const [panchangData, setPanchangData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch real Panchang data from API (without authentication)
  useEffect(() => {
    const fetchPanchangData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const currentTime = new Date().toTimeString().split(' ')[0].substring(0, 5);
        
        // Use the test endpoint that doesn't require authentication
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await axios.get(`${API_BASE_URL}/api/v1/panchang-test`, {
          params: {
            date: selectedDate,
            time: currentTime,
            latitude: latitude,
            longitude: longitude
          }
        });
        
        setPanchangData(response.data);
      } catch (err: any) {
        console.error('Error fetching Panchang:', err);
        setError(err.message || 'Failed to load Panchang data');
        toast.error('Unable to load Panchang. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPanchangData();
  }, [selectedDate, latitude, longitude]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
                <Calendar className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                {t.dailyPanchang}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
                {t.panchangDescription}
              </p>
            </div>
          </div>

          {/* Date and Location Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t.selectDate}
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium shadow-sm hover:shadow-md transition-all focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t.enterLocation || 'Location'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t.enterLocation || 'Enter your location'}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium shadow-sm hover:shadow-md transition-all focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-12 h-12 text-orange-600 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading real Panchang data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
            <p className="text-gray-900 dark:text-white font-bold text-xl mb-2">Unable to load Panchang</p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && !error && panchangData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Panchang Elements Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-500 dark:to-pink-500 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sun className="h-6 w-6" />
                  {t.panchangElements}
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Tithi */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-1">
                        {t.tithi}
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {panchangData.tithi?.name || panchangData.tithi}
                      </div>
                      {panchangData.tithi?.paksha && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {panchangData.tithi.paksha} Paksha
                        </div>
                      )}
                    </div>
                    <Moon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>

                {/* Nakshatra */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide mb-1">
                        {t.nakshatra}
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {panchangData.nakshatra?.name || panchangData.nakshatra}
                      </div>
                      {panchangData.nakshatra?.pada && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Pada {panchangData.nakshatra.pada}
                        </div>
                      )}
                    </div>
                    <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>

                {/* Yoga */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
                  <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-1">
                    {t.yoga}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {panchangData.yoga?.name || panchangData.yoga}
                  </div>
                </div>

                {/* Karana */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800">
                  <div className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-1">
                    {t.karana}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {panchangData.karana?.name || panchangData.karana}
                  </div>
                </div>

                {/* Paksha */}
                {panchangData.tithi?.paksha && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border border-indigo-200 dark:border-indigo-800">
                    <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide mb-1">
                      Paksha
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {panchangData.tithi.paksha}
                    </div>
                  </div>
                )}

                {/* Vara */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border border-pink-200 dark:border-pink-800">
                  <div className="text-xs font-semibold text-pink-700 dark:text-pink-400 uppercase tracking-wide mb-1">
                    Vara (Day)
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {panchangData.vara?.weekday || panchangData.vara}
                  </div>
                </div>
              </div>
            </div>

            {/* Sun and Moon Timings Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-500 dark:to-orange-500 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="h-6 w-6" />
                  Sun & Moon Timings
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Sunrise & Sunset */}
                {(panchangData.sunrise || panchangData.sunset) && (
                  <div className="grid grid-cols-2 gap-4">
                    {panchangData.sunrise && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-800/20 border border-amber-200 dark:border-amber-800">
                        <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
                          Sunrise
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {panchangData.sunrise}
                        </div>
                      </div>
                    )}

                    {panchangData.sunset && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-800/20 border border-orange-200 dark:border-orange-800">
                        <div className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-1">
                          Sunset
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {panchangData.sunset}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Moonrise & Moonset */}
                {(panchangData.moonrise || panchangData.moonset) && (
                  <div className="grid grid-cols-2 gap-4">
                    {panchangData.moonrise && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-800/20 border border-blue-200 dark:border-blue-800">
                        <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-1">
                          Moonrise
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {panchangData.moonrise}
                        </div>
                      </div>
                    )}

                    {panchangData.moonset && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-800/20 border border-indigo-200 dark:border-indigo-800">
                        <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide mb-1">
                          Moonset
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {panchangData.moonset}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Current Time Display */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-6 w-6" />
                    <span className="text-sm font-semibold uppercase tracking-wide">
                      Current Time
                    </span>
                  </div>
                  <div className="text-3xl font-bold">
                    {new Date().toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </div>
                  <div className="text-sm opacity-90 mt-1">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                {/* Data Source Indicator */}
                <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold">Real-time data from Swiss Ephemeris calculations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
