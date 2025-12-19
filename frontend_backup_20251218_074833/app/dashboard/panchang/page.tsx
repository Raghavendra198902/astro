'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Sun,
  Moon,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sunrise,
  Sunset,
  CloudSun,
  Sparkles,
  Info,
  Download,
  Share2
} from 'lucide-react';
import { API_URL } from '@/app/config';

interface PanchangData {
  panchang: {
    tithi: { name: string; endTime: string; deity: string };
    nakshatra: { name: string; endTime: string; deity: string };
    yoga: { name: string; endTime: string; quality: string };
    karana: { name: string; endTime: string; nature: string };
    paksha: { name: string; phase: string };
  };
  sunMoon: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moonPhase: string;
    moonSign: string;
  };
  auspiciousTimes: Array<{ name: string; time: string; quality: string }>;
  inauspiciousTimes: Array<{ name: string; time: string; warning: string }>;
}

export default function PanchangPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [location, setLocation] = useState('Mumbai, India');
  const [latitude] = useState(19.0760);
  const [longitude] = useState(72.8777);
  const [loading, setLoading] = useState(true);
  const [panchangData, setPanchangData] = useState<PanchangData | null>(null);
  const [festivals, setFestivals] = useState([
    { name: 'Gita Jayanti', date: 'Dec 11', description: 'Day Krishna taught Bhagavad Gita' },
    { name: 'Pausha Putrada Ekadashi', date: 'Dec 26', description: "Fasting for children's welfare" },
  ]);

  // Fetch Panchang data from backend
  useEffect(() => {
    fetchPanchangData();
  }, [selectedDate]);

  const fetchPanchangData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      const response = await fetch(
        `${API_URL}/api/v1/panchang/?date_str=${dateStr}&latitude=${latitude}&longitude=${longitude}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        setPanchangData(result.data);
      } else {
        console.error('Failed to fetch panchang data');
      }
    } catch (error) {
      console.error('Error fetching panchang:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  if (loading || !panchangData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Panchang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 via-red-500 to-yellow-600 rounded-xl shadow-lg shadow-orange-500/50">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div>Hindu Panchang <span className="text-orange-400">(पंचांग)</span></div>
                  <p className="text-sm font-normal text-gray-400 mt-1">Hindu Vedic Calendar & Auspicious Timings</p>
                </div>
              </h1>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white rounded-lg font-medium transition">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download PDF</span>
              </button>
            </div>
          </div>

          {/* Date Selector */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => changeDate(-1)}
                  className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{formatDate(selectedDate)}</p>
                  <p className="text-sm text-gray-400 mt-1">Vikram Samvat 2082, Margashirsha (Agrahayana)</p>
                </div>
                <button
                  onClick={() => changeDate(1)}
                  className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition"
              >
                Today
              </button>
            </div>

            {/* Location */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span className="text-sm">{location}</span>
                <button className="text-xs text-purple-400 hover:text-purple-300 ml-2">Change</button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Panchang Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Five Elements */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-orange-400 animate-pulse" />
                Panchang Elements <span className="text-orange-400">(पंचांग घटक)</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Tithi */}
                <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl p-4 hover:border-orange-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-orange-400">Tithi</h3>
                      <p className="text-xs text-gray-500">(तिथी - Lunar Day)</p>
                    </div>
                    <Moon className="w-5 h-5 text-orange-400" />
                  </div>
                  <p className="text-xl font-bold text-white mb-1">{panchangData.panchang.tithi.name}</p>
                  <p className="text-xs text-gray-400">⏰ Ends: {panchangData.panchang.tithi.endTime}</p>
                  <p className="text-xs text-purple-400 mt-2">🙏 Deity (देवता): {panchangData.panchang.tithi.deity}</p>
                </div>

                {/* Nakshatra */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-blue-400">Nakshatra</h3>
                      <p className="text-xs text-gray-500">(नक्षत्र - Star)</p>
                    </div>
                    <Star className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-xl font-bold text-white mb-1">{panchangData.panchang.nakshatra.name}</p>
                  <p className="text-xs text-gray-400">⏰ Ends: {panchangData.panchang.nakshatra.endTime}</p>
                  <p className="text-xs text-purple-400 mt-2">🙏 Deity (देवता): {panchangData.panchang.nakshatra.deity}</p>
                </div>

                {/* Yoga */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-purple-400">Yoga</h3>
                      <p className="text-xs text-gray-500">(योग)</p>
                    </div>
                    <CloudSun className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-xl font-bold text-white mb-1">{panchangData.panchang.yoga.name}</p>
                  <p className="text-xs text-gray-400">⏰ Ends: {panchangData.panchang.yoga.endTime}</p>
                  <p className={`text-xs mt-2 font-medium ${panchangData.panchang.yoga.quality === 'Auspicious' ? 'text-green-400' : 'text-red-400'}`}>✨ {panchangData.panchang.yoga.quality}</p>
                </div>

                {/* Karana */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-green-400">Karana</h3>
                      <p className="text-xs text-gray-500">(करण - Half Day)</p>
                    </div>
                    <Clock className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-xl font-bold text-white mb-1">{panchangData.panchang.karana.name}</p>
                  <p className="text-xs text-gray-400">⏰ Ends: {panchangData.panchang.karana.endTime}</p>
                  <p className="text-xs text-purple-400 mt-2">🔄 Nature (स्वभाव): {panchangData.panchang.karana.nature}</p>
                </div>
              </div>

              {/* Paksha */}
              <div className="mt-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-indigo-400 mb-1">Paksha <span className="text-gray-500">(पक्ष - Lunar Fortnight)</span></h3>
                    <p className="text-2xl font-bold text-white">{panchangData.panchang.paksha.name}</p>
                    <p className="text-xs text-purple-400 mt-1">🌙 {panchangData.panchang.paksha.phase}</p>
                  </div>
                  <Moon className="w-10 h-10 text-indigo-400" />
                </div>
              </div>
            </div>

            {/* Day Timeline Visualization */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-400" />
                Day Timeline <span className="text-blue-400">(दिवस वेळापत्रक)</span>
              </h2>
              
              {/* Timeline Graph */}
              <div className="relative h-32 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-4 overflow-hidden">
                {/* Sunrise to Sunset gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-orange-400/20 to-indigo-950 opacity-30"></div>
                
                {/* Time markers */}
                <div className="relative h-full flex items-center">
                  <div className="w-full relative">
                    {/* Timeline base */}
                    <div className="h-2 bg-gradient-to-r from-blue-500 via-yellow-400 to-purple-500 rounded-full"></div>
                    
                    {/* Sunrise marker */}
                    <div className="absolute left-0 -top-8">
                      <div className="flex flex-col items-center">
                        <Sunrise className="w-6 h-6 text-orange-400 mb-1" />
                        <span className="text-xs text-orange-300 font-semibold">{panchangData.sunMoon.sunrise}</span>
                      </div>
                    </div>
                    
                    {/* Noon marker */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-8">
                      <div className="flex flex-col items-center">
                        <Sun className="w-6 h-6 text-yellow-400 mb-1 animate-pulse" />
                        <span className="text-xs text-yellow-300 font-semibold">12:00 PM</span>
                      </div>
                    </div>
                    
                    {/* Sunset marker */}
                    <div className="absolute right-0 -top-8">
                      <div className="flex flex-col items-center">
                        <Sunset className="w-6 h-6 text-indigo-400 mb-1" />
                        <span className="text-xs text-indigo-300 font-semibold">{panchangData.sunMoon.sunset}</span>
                      </div>
                    </div>

                    {/* Moon phase indicator */}
                    <div className="absolute left-1/4 top-6">
                      <div className="flex flex-col items-center">
                        <Moon className="w-5 h-5 text-blue-300" />
                        <span className="text-[10px] text-blue-300 mt-1">{panchangData.sunMoon.moonPhase}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day/Night Duration */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-300">Day Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-white">~11h 0m</p>
                  <p className="text-xs text-gray-400 mt-1">Daylight hours</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-semibold text-indigo-300">Night Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-white">~13h 0m</p>
                  <p className="text-xs text-gray-400 mt-1">Night hours</p>
                </div>
              </div>
            </div>

            {/* Auspicious Times */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Sun className="w-6 h-6 text-green-400 animate-pulse" />
                Auspicious Timings <span className="text-green-400">(शुभ मुहूर्त)</span>
              </h2>
              <div className="space-y-3">
                {panchangData.auspiciousTimes.map((time, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 hover:scale-[1.02]">
                    <div>
                      <p className="font-semibold text-white">{time.name}</p>
                      <p className="text-sm text-gray-400 mt-1">{time.quality}</p>
                    </div>
                    <p className="text-sm font-medium text-green-400">{time.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lunar Cycle Visualization */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Moon className="w-6 h-6 text-purple-400" />
                Lunar Cycle <span className="text-purple-400">(चंद्र चक्र)</span>
              </h2>
              
              {/* Moon Phase Circle */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 mb-4">
                  {/* Outer glow */}
                  <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse"></div>
                  
                  {/* Moon circle */}
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30 flex items-center justify-center overflow-hidden">
                    {/* Moon phase shadow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <Moon className="w-16 h-16 text-purple-300 z-10" />
                  </div>
                </div>
                
                <p className="text-xl font-bold text-white mb-1">{panchangData.sunMoon.moonPhase}</p>
                <p className="text-sm text-purple-400">in {panchangData.sunMoon.moonSign}</p>
              </div>

              {/* Lunar month progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Paksha Progress</span>
                  <span className="text-white font-semibold">{panchangData.panchang.paksha.name}</span>
                </div>
                <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 w-[65%] rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white drop-shadow-lg">65%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">Moving towards {panchangData.panchang.paksha.name === 'Shukla Paksha' ? 'Full Moon' : 'New Moon'}</p>
              </div>

              {/* Tithi Progress Bar */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Tithi Progress</span>
                  <span className="text-white font-semibold">{panchangData.panchang.tithi.name}</span>
                </div>
                <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 w-[45%] rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white drop-shadow-lg">45%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">Ends at {panchangData.panchang.tithi.endTime}</p>
              </div>
            </div>

            {/* Inauspicious Times */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-red-400 animate-pulse" />
                Inauspicious Timings <span className="text-red-400">(अशुभ काळ)</span>
              </h2>
              <div className="space-y-3">
                {panchangData.inauspiciousTimes.map((time, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
                    <div>
                      <p className="font-semibold text-white">{time.name}</p>
                      <p className="text-sm text-gray-400 mt-1">{time.warning}</p>
                    </div>
                    <p className="text-sm font-medium text-red-400">{time.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sun & Moon */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-yellow-400" />
                Sun & Moon <span className="text-yellow-400 text-sm">(सूर्य आणि चंद्र)</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sunrise className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-gray-300">Sunrise</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{panchangData.sunMoon.sunrise}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-indigo-500/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sunset className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm text-gray-300">Sunset</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{panchangData.sunMoon.sunset}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Moonrise</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{panchangData.sunMoon.moonrise}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Moonset</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{panchangData.sunMoon.moonset}</span>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Moon Phase</p>
                    <p className="text-lg font-bold text-white">{panchangData.sunMoon.moonPhase}</p>
                    <p className="text-sm text-purple-400 mt-2">in {panchangData.sunMoon.moonSign}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Celestial Positions Wheel */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-cyan-400" />
                Celestial Positions <span className="text-cyan-400 text-sm">(ग्रह स्थिती)</span>
              </h2>
              
              {/* Zodiac Wheel Visualization */}
              <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-4">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30 animate-spin-slow"></div>
                
                {/* Middle ring */}
                <div className="absolute inset-4 rounded-full border-2 border-purple-500/30 animate-spin-reverse"></div>
                
                {/* Inner circle */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-slate-800 via-purple-900/30 to-slate-800 border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <Star className="w-8 h-8 text-cyan-400 mx-auto mb-1 animate-pulse" />
                    <p className="text-xs text-cyan-300 font-semibold">Moon in</p>
                    <p className="text-sm text-white font-bold">{panchangData.sunMoon.moonSign}</p>
                  </div>
                </div>
                
                {/* Zodiac markers */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse"></div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-cyan-500/10 rounded">
                  <span className="text-gray-400">Nakshatra</span>
                  <span className="text-cyan-300 font-semibold">{panchangData.panchang.nakshatra.name}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-purple-500/10 rounded">
                  <span className="text-gray-400">Moon Sign (राशी)</span>
                  <span className="text-purple-300 font-semibold">{panchangData.sunMoon.moonSign}</span>
                </div>
              </div>
            </div>

            {/* Upcoming Festivals */}
            <div className="bg-gradient-to-br from-orange-600 to-yellow-700 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Upcoming Festivals
              </h3>
              <div className="space-y-3">
                {festivals.map((festival, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold">{festival.name}</p>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">{festival.date}</span>
                    </div>
                    <p className="text-xs text-white/80">{festival.description}</p>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/panchang/festivals" className="block mt-4 text-center text-sm font-medium hover:underline">
                View All Festivals →
              </Link>
            </div>

            {/* Quick Info */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">About Panchang</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Panchang is the Hindu Vedic calendar that provides information about five attributes of the day - Tithi, Nakshatra, Yoga, Karana, and Var (weekday). It helps in determining auspicious times for various activities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
