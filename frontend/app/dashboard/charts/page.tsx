'use client';

import { useState, useEffect } from 'react';
import { 
  Star, Calendar, MapPin, Clock, Sparkles, Download, Share2, 
  Info, ChevronRight, Loader2, User, Globe, Moon, Sun, Zap,
  Radio, Target, Compass, Eye, TrendingUp, Award, Search
} from 'lucide-react';
import { API_URL } from '@/app/config';
import { sendNotification } from '@/app/components/NotificationCenter';
import { useTranslations } from '@/app/hooks/useTranslations';

export default function ChartsPage() {
  const { charts } = useTranslations();
  const [loading, setLoading] = useState(false);
  const [chartGenerated, setChartGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState('chart');
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{left: string, top: string, delay: string, duration: string}>>([]);
  const [chartStyle, setChartStyle] = useState<'north' | 'south' | 'western'>('north');
  const [formData, setFormData] = useState({
    name: 'Raghavendra Deshpande',
    date: '1978-07-09',
    time: '14:45',
    place: 'Aurangabad, Maharashtra',
    latitude: '19.8762',
    longitude: '75.3433',
    chartType: 'rasi',
    timezone: 'Asia/Kolkata'
  });

  const chartTypes = [
    { id: 'rasi', name: 'Rasi (D1)', icon: Moon, color: 'orange', description: 'Main birth chart - Shows overall life path', category: 'vedic' },
    { id: 'navamsa', name: 'Navamsa (D9)', icon: Star, color: 'purple', description: 'Marriage & spiritual chart - 9th division', category: 'vedic' },
    { id: 'dashamsa', name: 'Dashamsa (D10)', icon: TrendingUp, color: 'blue', description: 'Career & profession - 10th division', category: 'vedic' },
    { id: 'dwadasamsa', name: 'Dwadasamsa (D12)', icon: User, color: 'green', description: 'Parents & ancestors - 12th division', category: 'vedic' },
    { id: 'trimsamsa', name: 'Trimsamsa (D30)', icon: Zap, color: 'red', description: 'Evil & misfortunes - 30th division', category: 'vedic' },
    { id: 'saptamsa', name: 'Saptamsa (D7)', icon: Globe, color: 'cyan', description: 'Children & progeny - 7th division', category: 'vedic' },
    { id: 'natal', name: 'Natal Chart', icon: Sun, color: 'yellow', description: 'Western birth chart with houses & aspects', category: 'western' },
    { id: 'solar', name: 'Solar Return', icon: Sparkles, color: 'orange', description: 'Annual birthday chart for the year ahead', category: 'western' },
    { id: 'progressed', name: 'Progressed Chart', icon: Clock, color: 'purple', description: 'Secondary progressions for evolution', category: 'western' },
    { id: 'composite', name: 'Composite', icon: Award, color: 'pink', description: 'Relationship chart - Midpoint synthesis', category: 'western' },
  ];

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    setMounted(true);
    setParticles([...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 10}s`
    })));

    // Animate elements on mount
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el, idx) => {
      setTimeout(() => {
        el.classList.add('opacity-100', 'translate-y-0');
      }, idx * 100);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper function to get zodiac sign from longitude
  const getZodiacSign = (longitude: number) => {
    const signs = [
      { name: 'Aries', marathi: 'मेष', short: 'Ari' },
      { name: 'Taurus', marathi: 'वृषभ', short: 'Tau' },
      { name: 'Gemini', marathi: 'मिथुन', short: 'Gem' },
      { name: 'Cancer', marathi: 'कर्क', short: 'Can' },
      { name: 'Leo', marathi: 'सिंह', short: 'Leo' },
      { name: 'Virgo', marathi: 'कन्या', short: 'Vir' },
      { name: 'Libra', marathi: 'तूळ', short: 'Lib' },
      { name: 'Scorpio', marathi: 'वृश्चिक', short: 'Sco' },
      { name: 'Sagittarius', marathi: 'धनु', short: 'Sag' },
      { name: 'Capricorn', marathi: 'मकर', short: 'Cap' },
      { name: 'Aquarius', marathi: 'कुंभ', short: 'Aqu' },
      { name: 'Pisces', marathi: 'मीन', short: 'Pis' }
    ];
    const signIndex = Math.floor(longitude / 30);
    const degree = longitude % 30;
    return { ...signs[signIndex], degree: Math.floor(degree), minutes: Math.floor((degree % 1) * 60) };
  };

  // Planet abbreviations for clean chart display
  const getPlanetAbbr = (name: string) => {
    const planets: any = {
      sun: { short: 'Su', color: '#fbbf24', marathi: 'सू' },
      moon: { short: 'Mo', color: '#94a3b8', marathi: 'चं' },
      mars: { short: 'Ma', color: '#ef4444', marathi: 'मं' },
      mercury: { short: 'Me', color: '#10b981', marathi: 'बु' },
      jupiter: { short: 'Ju', color: '#eab308', marathi: 'गु' },
      venus: { short: 'Ve', color: '#ec4899', marathi: 'शु' },
      saturn: { short: 'Sa', color: '#6366f1', marathi: 'श' },
      rahu: { short: 'Ra', color: '#8b5cf6', marathi: 'रा' },
      ketu: { short: 'Ke', color: '#f97316', marathi: 'के' }
    };
    return planets[name] || { short: name.substring(0, 2).toUpperCase(), color: '#fff', marathi: name.substring(0, 2) };
  };

  // Helper function to get house number for a planet based on North Indian chart
  const getHouseNumber = (planetLong: number, ascendantLong: number) => {
    // Calculate relative position from ascendant
    let diff = planetLong - ascendantLong;
    if (diff < 0) diff += 360;
    // Each house is 30 degrees
    const house = Math.floor(diff / 30) + 1;
    return house > 12 ? house - 12 : house;
  };

  // Helper function to get sign name from longitude (for South Indian chart)
  const getSignFromLongitude = (longitude: number) => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = Math.floor(longitude / 30) % 12;
    return signs[signIndex];
  };

  const handleGenerateChart = async () => {
    console.log('🔄 Generating chart with form data:', formData);
    setLoading(true);
    // Reset chart data and hide chart to force complete re-render
    setChartData(null);
    setChartGenerated(false);
    
    try {
      console.log('📡 Fetching from /api/v1/charts/generate...');
      const response = await fetch('/api/v1/charts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      console.log('📥 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        alert(`Failed to generate chart: ${response.status} - ${errorText}`);
        throw new Error(`Failed to generate chart: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Real chart data received:', data);
      console.log('Ascendant:', data.ascendant, '=', getZodiacSign(data.ascendant));
      console.log('Planets:', data.planets);
      
      // Save chart data to localStorage for life-events page
      localStorage.setItem('lastGeneratedChart', JSON.stringify(formData));
      console.log('💾 Saved chart data to localStorage');
      
      // Process planet positions by house
      console.log('🏠 Processing planets by house...');
      const planetsByHouse: any = {};
      Object.entries(data.planets).forEach(([name, planetData]: any) => {
        if (name === 'uranus' || name === 'neptune' || name === 'pluto') return; // Skip outer planets for Vedic
        const house = getHouseNumber(planetData.longitude, data.ascendant);
        if (!planetsByHouse[house]) planetsByHouse[house] = [];
        planetsByHouse[house].push({ name, ...planetData });
      });
      
      console.log('📊 Planets by house:', planetsByHouse);
      // Add timestamp to force re-render
      const newChartData = { ...data, planetsByHouse, timestamp: Date.now() };
      console.log('💾 Setting chart data with timestamp:', newChartData.timestamp);
      
      // Use setTimeout to ensure state updates happen in correct order
      setTimeout(() => {
        console.log('🎯 Setting chartData:', !!newChartData);
        console.log('🎯 Setting chartGenerated: true');
        setChartData(newChartData);
        setChartGenerated(true);
        console.log('✅ State updated - chart should now be visible');
        
        // Send notification
        sendNotification({
          type: 'chart',
          title: '⭐ Birth Chart Created!',
          message: `${formData.name}'s ${formData.chartType} birth chart has been successfully generated.`
        });
        
        // Scroll to chart section after state update
        setTimeout(() => {
          const chartSection = document.getElementById('chart-display-section');
          if (chartSection) {
            chartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log('📜 Scrolled to chart section');
          } else {
            console.warn('⚠️ Chart section not found in DOM');
          }
        }, 200);
      }, 100);
    } catch (error) {
      console.error('❌ Error generating chart:', error);
      alert('Failed to generate chart. Please check console for details.');
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  const handleLocationSearch = async () => {
    setSearchingLocation(true);
    // Simulate geocoding API call
    setTimeout(() => {
      if (formData.place) {
        setFormData({
          ...formData,
          latitude: '19.0760',
          longitude: '72.8777'
        });
      }
      setSearchingLocation(false);
    }, 1000);
  };

  const planets = [
    { name: 'Sun', degree: '15°23\'', sign: 'Sagittarius', house: '1st', color: '#f59e0b' },
    { name: 'Moon', degree: '28°45\'', sign: 'Cancer', house: '7th', color: '#94a3b8' },
    { name: 'Mars', degree: '12°08\'', sign: 'Aries', house: '4th', color: '#ef4444' },
    { name: 'Mercury', degree: '22°56\'', sign: 'Scorpio', house: '11th', color: '#10b981' },
    { name: 'Jupiter', degree: '09°34\'', sign: 'Pisces', house: '3rd', color: '#eab308' },
    { name: 'Venus', degree: '18°12\'', sign: 'Libra', house: '10th', color: '#ec4899' },
    { name: 'Saturn', degree: '05°47\'', sign: 'Aquarius', house: '2nd', color: '#6366f1' },
  ];

  const yogas = [
    { name: 'Raj Yoga', type: 'Benefic', strength: 85, description: 'Indicates royal status and power' },
    { name: 'Gajakesari Yoga', type: 'Benefic', strength: 78, description: 'Intelligence and wisdom' },
    { name: 'Dhana Yoga', type: 'Benefic', strength: 92, description: 'Wealth accumulation potential' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Floating cosmic particles - only render on client to avoid hydration mismatch */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-500 rounded-full animate-float opacity-30"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="relative group overflow-hidden bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 hover:scale-[1.02] transition-all duration-500 animate-slideInFromTop">
        {/* Animated cosmic grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Pulsing orbs */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="animate-slideInFromLeft space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-600 rounded-lg blur-lg opacity-50 animate-pulse"></div>
                <div className="relative p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                  <Compass className="w-6 h-6 text-white animate-spin-slow" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-purple-600/20 backdrop-blur-sm text-purple-300 text-xs font-black uppercase tracking-wider rounded-full border border-purple-500/30">
                  AI-Powered
                </span>
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-3 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
              {charts.title || 'Birth Chart Generator'}
            </h1>
            <p className="text-gray-300 text-xl font-medium max-w-2xl">
              {charts.subtitle || 'Unlock your cosmic blueprint with advanced Vedic & Western astrology powered by AI'}
            </p>
            
            {/* Feature badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <Radio className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300 font-semibold">{charts.realTimeCalc || 'Real-time Calculation'}</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300 font-semibold">{charts.accuracy || '99.9% Accuracy'}</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300 font-semibold">{charts.aiInsights || 'AI Insights'}</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block animate-slideInFromRight">
            <div className="relative">
              {/* Orbiting rings */}
              <div className="absolute inset-0 w-44 h-44 border-4 border-dashed border-purple-500/20 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-4 w-36 h-36 border-4 border-pink-500/30 rounded-full animate-spin-reverse"></div>
              <div className="absolute inset-8 w-28 h-28 border-4 border-dashed border-blue-500/20 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }}></div>
              
              {/* Center cosmic orb */}
              <div className="relative w-44 h-44 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative">
                  <Star className="w-20 h-20 text-white animate-pulse" />
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-spin-slow" />
                </div>
              </div>
              
              {/* Floating particles */}
              <div className="absolute top-0 left-0 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Type Selection Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
          <Compass className="w-8 h-8 text-purple-400" />
          <span>{charts.selectChartType || 'Select Chart Type'}</span>
        </h2>
        <div className="flex space-x-2">
          <span className="px-3 py-1.5 bg-orange-600/20 text-orange-400 text-sm font-semibold rounded-lg border border-orange-500/30">
            6 Vedic
          </span>
          <span className="px-3 py-1.5 bg-blue-600/20 text-blue-400 text-sm font-semibold rounded-lg border border-blue-500/30">
            4 Western
          </span>
        </div>
      </div>

      {/* Chart Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {chartTypes.map((chart, idx) => {
          const Icon = chart.icon;
          const isSelected = formData.chartType === chart.id;
          const colorClasses = {
            orange: 'from-orange-600/20 to-red-600/20 border-orange-500/50 shadow-orange-500/20',
            purple: 'from-purple-600/20 to-pink-600/20 border-purple-500/50 shadow-purple-500/20',
            blue: 'from-blue-600/20 to-cyan-600/20 border-blue-500/50 shadow-blue-500/20',
            green: 'from-green-600/20 to-emerald-600/20 border-green-500/50 shadow-green-500/20',
            red: 'from-red-600/20 to-rose-600/20 border-red-500/50 shadow-red-500/20',
            cyan: 'from-cyan-600/20 to-teal-600/20 border-cyan-500/50 shadow-cyan-500/20',
            yellow: 'from-yellow-600/20 to-amber-600/20 border-yellow-500/50 shadow-yellow-500/20',
            pink: 'from-pink-600/20 to-rose-600/20 border-pink-500/50 shadow-pink-500/20',
          };
          
          return (
            <button
              key={chart.id}
              onClick={() => setFormData({ ...formData, chartType: chart.id })}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden ${
                isSelected
                  ? `bg-gradient-to-br ${colorClasses[chart.color as keyof typeof colorClasses]} shadow-2xl`
                  : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-white/20'
              }`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {/* Animated background */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Category badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                  chart.category === 'vedic' 
                    ? 'bg-orange-600/30 text-orange-300 border border-orange-500/30' 
                    : 'bg-blue-600/30 text-blue-300 border border-blue-500/30'
                }`}>
                  {chart.category.toUpperCase()}
                </span>
              </div>
              
              <div className="relative text-center">
                <div className="relative inline-block mb-3">
                  <div className="absolute inset-0 bg-purple-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative p-3 bg-gradient-to-br from-purple-600/30 to-purple-700/30 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border border-purple-500/30">
                    <Icon className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                  {chart.name}
                </h3>
                
                <p className="text-gray-400 text-xs leading-relaxed">
                  {chart.description}
                </p>
                
                {isSelected && (
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase">Selected</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Old large cards - Remove them */}
      <div className="hidden grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setFormData({ ...formData, chartType: 'rasi' })}
          className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-slideInFromLeft overflow-hidden ${
            formData.chartType === 'rasi'
              ? 'bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/50 shadow-2xl shadow-orange-500/20'
              : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-orange-500/30'
          }`}
        >
          {/* Animated background */}
          {formData.chartType === 'vedic' && (
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-red-600/10 to-orange-600/10 animate-gradient bg-[length:200%_200%]"></div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {/* Floating ornaments */}
          <div className="absolute top-4 right-4 w-20 h-20 border-2 border-orange-500/20 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-red-500/20 rounded-full animate-spin-reverse"></div>
          
          <div className="relative flex items-start space-x-5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative p-4 bg-gradient-to-br from-orange-600/30 to-red-600/30 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border border-orange-500/30">
                <Moon className="w-10 h-10 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" />
              </div>
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-3xl font-black text-white group-hover:scale-105 transition-transform duration-300">
                  Vedic Chart
                </h3>
                {formData.chartType === 'vedic' && (
                  <div className="flex items-center space-x-1">
                    <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                    <span className="text-xs font-bold text-orange-400 uppercase">Active</span>
                  </div>
                )}
              </div>
              <p className="text-gray-300 text-base mb-4 font-medium">
                Traditional Indian astrology based on sidereal zodiac and Nakshatras
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-orange-600/30 text-orange-300 text-xs font-bold rounded-lg border border-orange-500/30 backdrop-blur-sm">
                  🌙 Rasi Chart
                </span>
                <span className="px-3 py-1.5 bg-red-600/30 text-red-300 text-xs font-bold rounded-lg border border-red-500/30 backdrop-blur-sm">
                  ⭐ Navamsa
                </span>
                <span className="px-3 py-1.5 bg-orange-600/30 text-orange-300 text-xs font-bold rounded-lg border border-orange-500/30 backdrop-blur-sm">
                  ⏰ Dashas
                </span>
              </div>
              
              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-orange-500/20 flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-gray-400">98% Accuracy</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-3 h-3 text-yellow-400" />
                  <span className="text-gray-400">5000+ Years Old</span>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Birth Details Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-slideInFromLeft">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
              <User className="w-6 h-6 text-purple-400" />
              <span>Birth Details</span>
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-400 mb-2">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                  />
                  <User className="absolute right-3 top-3.5 w-5 h-5 text-gray-600 group-focus-within:text-purple-400 transition-colors duration-300" />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                    <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-600 pointer-events-none group-focus-within:text-purple-400 transition-colors duration-300" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Time of Birth</label>
                  <div className="relative">
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                    <Clock className="absolute right-3 top-3.5 w-5 h-5 text-gray-600 pointer-events-none group-focus-within:text-purple-400 transition-colors duration-300" />
                  </div>
                </div>
              </div>

              {/* Place */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-400 mb-2">Place of Birth</label>
                <div className="relative">
                  <input
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    placeholder="Search city or location..."
                    className="w-full px-4 py-3 pr-24 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={handleLocationSearch}
                    disabled={searchingLocation || !formData.place}
                    className="absolute right-2 top-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    {searchingLocation ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-3 h-3" />
                        <span>Find</span>
                      </>
                    )}
                  </button>
                  <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-600 group-focus-within:text-purple-400 transition-colors duration-300" />
                </div>
                {formData.latitude && formData.longitude && (
                  <div className="mt-2 flex items-center space-x-2 text-xs text-green-400">
                    <Target className="w-3 h-3" />
                    <span>Location found: {formData.latitude}, {formData.longitude}</span>
                  </div>
                )}
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Latitude</label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="e.g., 19.0760"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="e.g., 72.8777"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateChart}
                disabled={loading || !formData.name || !formData.date || !formData.time}
                className="group/btn relative w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg overflow-hidden hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Generating Chart...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>Generate Birth Chart</span>
                      <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6 animate-slideInFromRight">
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Info className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Quick Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Accurate birth time is crucial for precise chart calculations</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>If you don't know your birth time, use 12:00 PM as an approximation</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-400 mt-1">•</span>
                <span><strong>Vedic:</strong> Rasi (D1) is the main chart, other divisional charts reveal specific life areas</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span><strong>Western:</strong> Natal chart shows birth moment, Solar Return for yearly forecast</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Choose chart type based on your question - each reveals different insights</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">What's Included</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <Moon className="w-4 h-4 text-orange-400" />
                <span>6 Vedic divisional charts (D1-D30)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-blue-400" />
                <span>4 Western chart types (Natal, Solar, etc.)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-purple-400" />
                <span>Complete planetary positions & aspects</span>
              </li>
              <li className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>AI-powered interpretations & yogas</span>
              </li>
              <li className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-green-400" />
                <span>Downloadable PDF reports</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* DEBUG: State indicator */}
      <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4 text-yellow-200">
        <p><strong>Debug Info:</strong></p>
        <p>chartGenerated: {String(chartGenerated)}</p>
        <p>chartData exists: {String(!!chartData)}</p>
        <p>chartData timestamp: {chartData?.timestamp || 'none'}</p>
      </div>

      {/* Chart Display (shown after generation) */}
      {chartGenerated && chartData && (
        <div id="chart-display-section" key={chartData.timestamp} className="space-y-6 animate-slideInFromBottom">
          {/* Chart Header */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative p-3 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Your Birth Chart</h2>
                  <p className="text-gray-400 mt-1">Generated on {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="group/btn px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 hover:scale-105">
                  <Share2 className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                  <span>Share</span>
                </button>
                <button className="group/btn relative px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold overflow-hidden hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <Download className="w-5 h-5 relative z-10 group-hover/btn:translate-y-1 transition-transform duration-300" />
                  <span className="relative z-10">Download PDF</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-white/10">
              {['Chart', 'Planets', 'Yogas', 'Insights'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-6 py-3 font-semibold transition-all duration-300 relative ${
                    activeTab === tab.toLowerCase()
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab}
                  {activeTab === tab.toLowerCase() && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Visualization */}
          {activeTab === 'chart' && (
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
              {/* Animated particles background */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-purple-500 rounded-full opacity-30 animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${8 + Math.random() * 12}s`
                    }}
                  />
                ))}
              </div>

              <div className="max-w-4xl mx-auto relative z-10">
                {/* Chart Title with glow effect */}
                <div className="text-center mb-8">
                  <div className="inline-block relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl opacity-40 animate-pulse"></div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent relative">
                      {formData.chartType === 'rasi' ? 'Rasi Chart (D1)' : 
                       formData.chartType === 'navamsa' ? 'Navamsa Chart (D9)' :
                       chartTypes.find(c => c.id === formData.chartType)?.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <p className="text-gray-400">
                        {['natal', 'solar', 'progressed', 'composite'].includes(formData.chartType) 
                          ? 'Western Circular Wheel' 
                          : 'North Indian Diamond'}
                      </p>
                    </div>
                    <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-pink-400" />
                      <p className="text-gray-400">
                        {['natal', 'solar', 'progressed', 'composite'].includes(formData.chartType)
                          ? 'Western Astrology'
                          : chartData ? 'Real Calculations' : 'Vedic Astrology'}
                      </p>
                    </div>
                  </div>
                  {chartData && (
                    <div className="mt-3 text-sm text-green-400 flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Using Swiss Ephemeris • Real Planetary Positions</span>
                    </div>
                  )}
                </div>

                {/* Chart Style Selector */}
                <div className="flex justify-center mb-8">
                  <div className="inline-flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 space-x-2">
                    <button
                      onClick={() => setChartStyle('north')}
                      className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                        chartStyle === 'north'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      North Indian
                    </button>
                    <button
                      onClick={() => setChartStyle('south')}
                      className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                        chartStyle === 'south'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      South Indian
                    </button>
                    <button
                      onClick={() => setChartStyle('western')}
                      className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                        chartStyle === 'western'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Western
                    </button>
                  </div>
                </div>

                {/* South Indian Chart */}
                {chartStyle === 'south' && chartData && (
                  <div className="relative w-full aspect-square max-w-2xl mx-auto bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-4 border-amber-900 shadow-2xl">
                    {(() => {
                      const housePlanets: Record<number, any[]> = {};
                      Object.entries(chartData.planetsByHouse || {}).forEach(([house, planets]: any) => {
                        housePlanets[parseInt(house)] = planets;
                      });

                      // South Indian chart - Fixed house positions in 4x4 grid
                      const housePositions = [
                        { house: 1, row: 2, col: 1 },  // Center-left (Lagna)
                        { house: 2, row: 2, col: 0 },  // Left side
                        { house: 3, row: 1, col: 0 },  // Top-left
                        { house: 4, row: 0, col: 1 },  // Top center-left
                        { house: 5, row: 0, col: 2 },  // Top center-right
                        { house: 6, row: 0, col: 3 },  // Top-right
                        { house: 7, row: 1, col: 3 },  // Right side top
                        { house: 8, row: 2, col: 3 },  // Right side
                        { house: 9, row: 3, col: 3 },  // Bottom-right
                        { house: 10, row: 3, col: 2 }, // Bottom center-right
                        { house: 11, row: 3, col: 1 }, // Bottom center-left
                        { house: 12, row: 3, col: 0 }, // Bottom-left
                      ];

                      const ascendantSign = getSignFromLongitude(chartData.ascendant);
                      const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                                     'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
                      const ascendantIndex = signs.indexOf(ascendantSign);

                      return (
                        <>
                          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                            {housePositions.map(({ house, row, col }) => {
                              const signIndex = (ascendantIndex + house - 1) % 12;
                              const sign = signs[signIndex];
                              const planets = housePlanets[house] || [];

                              return (
                                <div
                                  key={house}
                                  className="border-2 border-amber-900 flex items-center justify-center relative"
                                  style={{ gridRow: row + 1, gridColumn: col + 1 }}
                                >
                                  <div className="text-center p-2">
                                    <div className="absolute top-1 left-1 text-[10px] font-bold text-amber-950/50">
                                      {house}
                                    </div>
                                    {house === 1 && (
                                      <div className="text-[11px] font-black text-red-800 bg-red-100/60 px-1.5 rounded border border-red-400 mb-1">
                                        Lg
                                      </div>
                                    )}
                                    <div className="text-[13px] font-black text-amber-900 mb-1">
                                      {sign.substring(0, 3).toUpperCase()}
                                    </div>
                                    {planets.length > 0 && (
                                      <div className="flex flex-wrap gap-0.5 justify-center items-center">
                                        {planets.slice(0, 3).map((planet: any) => {
                                          const planetInfo = getPlanetAbbr(planet.name);
                                          return (
                                            <div
                                              key={planet.name}
                                              className="text-[10px] font-bold text-blue-900 bg-blue-100/80 px-1 rounded"
                                            >
                                              {planetInfo.short}
                                            </div>
                                          );
                                        })}
                                        {planets.length > 3 && (
                                          <div className="text-[8px] text-amber-800 font-bold">+{planets.length - 3}</div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            <div className="border-2 border-amber-900 bg-amber-100/30" style={{ gridRow: 2, gridColumn: 2 }}></div>
                            <div className="border-2 border-amber-900 bg-amber-100/30" style={{ gridRow: 2, gridColumn: 3 }}></div>
                            <div className="border-2 border-amber-900 bg-amber-100/30" style={{ gridRow: 3, gridColumn: 2 }}></div>
                          </div>
                          <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <line x1="0" y1="100%" x2="100%" y2="0" stroke="#78350f" strokeWidth="4" />
                          </svg>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-100 border-2 border-amber-800 rounded-full w-20 h-20 flex items-center justify-center shadow-lg z-10">
                            <div className="text-center">
                              <div className="text-[11px] font-black text-amber-950 leading-tight">SOUTH</div>
                              <div className="text-[9px] text-amber-800 font-semibold">INDIAN</div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* North Indian & Western Charts */}
                {chartStyle !== 'south' && (
                  <div className="relative w-full aspect-square max-w-2xl mx-auto perspective-1000">
                    {/* Outer glow rings */}
                    <div className="absolute -inset-8 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    
                    {/* Rotating outer ring */}
                    <div className="absolute -inset-2 border-2 border-dashed border-purple-500/20 rounded-full animate-spin-slow"></div>
                    
                    {/* Main chart container with 3D transform */}
                    <div className="relative w-full h-full transform-3d hover:scale-105 transition-transform duration-700">
                      {/* Outer Border with gradient - Shape based on chart style */}
                      <div className={`absolute inset-0 border-4 border-purple-500/60 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 backdrop-blur-xl shadow-2xl shadow-purple-500/20 ${
                        chartStyle === 'western'
                          ? 'rounded-full' 
                          : 'rotate-45 rounded-3xl'
                      }`}>
                        {/* Inner shadow for depth */}
                        <div className={`absolute inset-0 shadow-inner shadow-black/50 ${
                          chartStyle === 'western'
                            ? 'rounded-full' 
                            : 'rounded-3xl'
                        }`}></div>
                      </div>
                      
                      {/* SVG Chart with enhanced visuals */}
                      <svg key={chartData?.timestamp || 'default'} className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                      <defs>
                        {/* Gradient definitions */}
                        <linearGradient id="houseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6"/>
                          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6"/>
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                        <filter id="textGlow">
                          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {chartStyle === 'western' ? (
                        <>
                          {/* Western Circular Wheel Chart */}
                          {/* Outer circle */}
                          <circle cx="200" cy="200" r="180" fill="none" stroke="url(#houseGradient)" strokeWidth="3" filter="url(#glow)"/>
                          
                          {/* 12 House division lines radiating from center */}
                          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => {
                            const rad = (angle - 90) * Math.PI / 180;
                            const x1 = 200 + Math.cos(rad) * 90;
                            const y1 = 200 + Math.sin(rad) * 90;
                            const x2 = 200 + Math.cos(rad) * 180;
                            const y2 = 200 + Math.sin(rad) * 180;
                            return (
                              <line 
                                key={idx}
                                x1={x1} y1={y1} x2={x2} y2={y2} 
                                stroke="rgba(168, 85, 247, 0.4)" 
                                strokeWidth="2" 
                                filter="url(#glow)"
                              />
                            );
                          })}
                          
                          {/* Middle circle */}
                          <circle cx="200" cy="200" r="135" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1.5" filter="url(#glow)"/>
                          {/* Inner circle for planet ring */}
                          <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="2" filter="url(#glow)"/>
                          
                          {/* Zodiac signs on middle ring */}
                          {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((sign, idx) => {
                            const angle = (idx * 30 + 15 - 90) * Math.PI / 180;
                            const x = 200 + Math.cos(angle) * 168;
                            const y = 200 + Math.sin(angle) * 168;
                            return (
                              <text key={idx} x={x} y={y + 6} textAnchor="middle" fill="#ec4899" fontSize="20" fontWeight="bold" filter="url(#textGlow)">
                                {sign}
                              </text>
                            );
                          })}
                          
                          {/* Degree markings on outer ring */}
                          {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, idx) => {
                            const angle = (deg - 90) * Math.PI / 180;
                            const x = 200 + Math.cos(angle) * 188;
                            const y = 200 + Math.sin(angle) * 188;
                            return (
                              <text key={deg} x={x} y={y + 4} textAnchor="middle" fill="#8b5cf6" fontSize="10" fontWeight="600" opacity="0.7">
                                {deg}°
                              </text>
                            );
                          })}
                          
                          {/* House numbers on inner ring with enhanced styling */}
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map((house, idx) => {
                            const angle = (idx * 30 + 15 - 90) * Math.PI / 180;
                            const x = 200 + Math.cos(angle) * 112;
                            const y = 200 + Math.sin(angle) * 112;
                            const colors = ['#fbbf24','#ec4899','#10b981','#6366f1','#f97316','#8b5cf6','#eab308','#ef4444','#06b6d4','#a855f7','#14b8a6','#f59e0b'];
                            return (
                              <g key={house}>
                                <circle cx={x} cy={y} r="16" fill={`${colors[idx]}20`} stroke={colors[idx]} strokeWidth="2" filter="url(#glow)"/>
                                <text x={x} y={y + 5} textAnchor="middle" fill={colors[idx]} fontSize="13" fontWeight="bold" filter="url(#textGlow)">{house}</text>
                              </g>
                            );
                          })}
                          
                          {/* Aspect lines between planets */}
                          {chartData && chartData.planets && (() => {
                            const planetPositions: any[] = [];
                            Object.entries(chartData.planetsByHouse || {}).forEach(([house, planets]: any) => {
                              planets.forEach((planet: any) => {
                                const houseNum = parseInt(house);
                                const angle = ((houseNum - 1) * 30 + 15 - 90) * Math.PI / 180;
                                planetPositions.push({
                                  name: planet.name,
                                  x: 200 + Math.cos(angle) * 65,
                                  y: 200 + Math.sin(angle) * 65,
                                  longitude: planet.longitude
                                });
                              });
                            });
                            
                            const aspects: React.ReactElement[] = [];
                            for (let i = 0; i < planetPositions.length; i++) {
                              for (let j = i + 1; j < planetPositions.length; j++) {
                                const p1 = planetPositions[i];
                                const p2 = planetPositions[j];
                                let diff = Math.abs(p1.longitude - p2.longitude);
                                if (diff > 180) diff = 360 - diff;
                                
                                // Major aspects: conjunction(0), opposition(180), trine(120), square(90), sextile(60)
                                let aspectColor = '';
                                let opacity = 0;
                                if (Math.abs(diff - 0) < 8) { aspectColor = '#fbbf24'; opacity = 0.4; }
                                else if (Math.abs(diff - 180) < 8) { aspectColor = '#ef4444'; opacity = 0.3; }
                                else if (Math.abs(diff - 120) < 8) { aspectColor = '#10b981'; opacity = 0.25; }
                                else if (Math.abs(diff - 90) < 8) { aspectColor = '#ec4899'; opacity = 0.25; }
                                else if (Math.abs(diff - 60) < 8) { aspectColor = '#06b6d4'; opacity = 0.2; }
                                
                                if (aspectColor) {
                                  aspects.push(
                                    <line key={`${i}-${j}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} 
                                      stroke={aspectColor} strokeWidth="1.5" opacity={opacity} strokeDasharray="3,3" />
                                  );
                                }
                              }
                            }
                            return aspects;
                          })()}
                          
                          {/* Planets with enhanced details */}
                          {chartData && chartData.planetsByHouse && Object.entries(chartData.planetsByHouse).map(([house, planets]: any) => {
                            const houseNum = parseInt(house);
                            const angle = ((houseNum - 1) * 30 + 15 - 90) * Math.PI / 180;
                            const outerX = 200 + Math.cos(angle) * 65;
                            const outerY = 200 + Math.sin(angle) * 65;
                            
                            return planets.map((planet: any, idx: number) => {
                              const planetSymbols: any = {
                                sun: { symbol: '☉', color: '#fbbf24', name: 'Su' },
                                moon: { symbol: '☽', color: '#94a3b8', name: 'Mo' },
                                mars: { symbol: '♂', color: '#ef4444', name: 'Ma' },
                                mercury: { symbol: '☿', color: '#10b981', name: 'Me' },
                                jupiter: { symbol: '♃', color: '#eab308', name: 'Ju' },
                                venus: { symbol: '♀', color: '#ec4899', name: 'Ve' },
                                saturn: { symbol: '♄', color: '#6366f1', name: 'Sa' },
                                rahu: { symbol: '☊', color: '#8b5cf6', name: 'Ra' },
                                ketu: { symbol: '☋', color: '#f97316', name: 'Ke' }
                              };
                              const planetInfo = planetSymbols[planet.name] || { symbol: '●', color: '#fff', name: planet.name.substring(0,2) };
                              const sign = getZodiacSign(planet.longitude);
                              const offsetAngle = (idx - (planets.length - 1) / 2) * 0.15;
                              const finalAngle = angle + offsetAngle;
                              const x = 200 + Math.cos(finalAngle) * 65;
                              const y = 200 + Math.sin(finalAngle) * 65;
                              
                              return (
                                <g key={planet.name}>
                                  <circle cx={x} cy={y} r="20" fill={`${planetInfo.color}15`} stroke={planetInfo.color} strokeWidth="2" filter="url(#glow)"/>
                                  <text x={x} y={y - 4} textAnchor="middle" fill={planetInfo.color} fontSize="18" fontWeight="bold" filter="url(#textGlow)">
                                    {planetInfo.symbol}
                                  </text>
                                  <text x={x} y={y + 10} textAnchor="middle" fill="#cbd5e1" fontSize="8" fontWeight="600">
                                    {sign.degree}°{sign.name.substring(0,2)}
                                  </text>
                                </g>
                              );
                            });
                          })}
                          
                          {/* Transit Planets - shown in outer ring with different styling */}
                          {chartData && chartData.transits && chartData.transits.planets && (() => {
                            const transitPlanetsByHouse: any = {};
                            Object.entries(chartData.transits.planets).forEach(([name, planetData]: any) => {
                              if (name === 'uranus' || name === 'neptune' || name === 'pluto') return;
                              const house = getHouseNumber(planetData.longitude, chartData.ascendant);
                              if (!transitPlanetsByHouse[house]) transitPlanetsByHouse[house] = [];
                              transitPlanetsByHouse[house].push({ name, ...planetData });
                            });
                            
                            return Object.entries(transitPlanetsByHouse).map(([house, planets]: any) => {
                              const houseNum = parseInt(house);
                              const angle = ((houseNum - 1) * 30 + 15 - 90) * Math.PI / 180;
                              
                              return planets.map((planet: any, idx: number) => {
                                const planetSymbols: any = {
                                  sun: { symbol: '☉', color: '#fbbf24', name: 'Su' },
                                  moon: { symbol: '☽', color: '#94a3b8', name: 'Mo' },
                                  mars: { symbol: '♂', color: '#ef4444', name: 'Ma' },
                                  mercury: { symbol: '☿', color: '#10b981', name: 'Me' },
                                  jupiter: { symbol: '♃', color: '#eab308', name: 'Ju' },
                                  venus: { symbol: '♀', color: '#ec4899', name: 'Ve' },
                                  saturn: { symbol: '♄', color: '#6366f1', name: 'Sa' },
                                  rahu: { symbol: '☊', color: '#8b5cf6', name: 'Ra' },
                                  ketu: { symbol: '☋', color: '#f97316', name: 'Ke' }
                                };
                                const planetInfo = planetSymbols[planet.name] || { symbol: '●', color: '#fff', name: planet.name.substring(0,2) };
                                const sign = getZodiacSign(planet.longitude);
                                const offsetAngle = (idx - (planets.length - 1) / 2) * 0.1;
                                const finalAngle = angle + offsetAngle;
                                const x = 200 + Math.cos(finalAngle) * 150;
                                const y = 200 + Math.sin(finalAngle) * 150;
                                
                                return (
                                  <g key={`transit-${planet.name}`}>
                                    <circle cx={x} cy={y} r="12" fill="rgba(255,255,255,0.05)" stroke={planetInfo.color} strokeWidth="2" strokeDasharray="3,2" filter="url(#glow)"/>
                                    <text x={x} y={y + 4} textAnchor="middle" fill={planetInfo.color} fontSize="14" fontWeight="bold" filter="url(#textGlow)" opacity="0.8">
                                      {planetInfo.symbol}
                                    </text>
                                    <text x={x} y={y - 15} textAnchor="middle" fill="#10b981" fontSize="7" fontWeight="600">
                                      T
                                    </text>
                                  </g>
                                );
                              });
                            });
                          })()}
                        </>
                      ) : (
                        <>
                          {/* Traditional North Indian Diamond Chart - Simple Clean Format */}
                          {/* Outer diamond border - Simple thin lines */}
                          <line x1="200" y1="20" x2="380" y2="200" stroke="#8b7355" strokeWidth="2"/>
                          <line x1="380" y1="200" x2="200" y2="380" stroke="#8b7355" strokeWidth="2"/>
                          <line x1="200" y1="380" x2="20" y2="200" stroke="#8b7355" strokeWidth="2"/>
                          <line x1="20" y1="200" x2="200" y2="20" stroke="#8b7355" strokeWidth="2"/>
                      
                          {/* Inner division lines creating 12 houses */}
                          <line x1="20" y1="200" x2="380" y2="200" stroke="#8b7355" strokeWidth="1.5"/>
                          <line x1="200" y1="20" x2="200" y2="380" stroke="#8b7355" strokeWidth="1.5"/>
                          
                          {/* Inner triangular divisions */}
                          <line x1="200" y1="20" x2="110" y2="110" stroke="#8b7355" strokeWidth="1.5"/>
                          <line x1="20" y1="200" x2="110" y2="110" stroke="#8b7355" strokeWidth="1.5"/>
                          <line x1="200" y1="20" x2="290" y2="110" stroke="#8b7355" strokeWidth="1.5"/>
                          <line x1="380" y1="200" x2="290" y2="110" stroke="#8b7355" strokeWidth="1.5"/>
                          <line x1="380" y1="200" x2="290" y2="290" stroke="#8b7355" strokeWidth="1.5"/>
                          <line x1="200" y1="380" x2="290" y2="290" stroke="#8b7355" strokeWidth="1.5"/>
                          <line x1="20" y1="200" x2="110" y2="290" stroke="#8b7355" strokeWidth="1.5"/>
                          <line x1="200" y1="380" x2="110" y2="290" stroke="#8b7355" strokeWidth="1.5"/>
                      
                      {/* Simplified Traditional North Indian Chart - Clean Format */}
                      
                      {/* House 1 - Top center (Ascendant) */}
                      <text x="200" y="60" textAnchor="middle" fill="#000" fontSize="12" fontWeight="600">1</text>
                      {chartData && (
                        <>
                          <text x="200" y="80" textAnchor="middle" fill="#000" fontSize="13">
                            {getZodiacSign(chartData.ascendant).marathi}
                          </text>
                          {chartData.planets && Object.entries(chartData.planets).filter(([name, data]: any) => 
                            getHouseNumber(data.longitude, chartData.ascendant) === 1
                          ).map(([name, data]: any, idx: number) => {
                            const planet = getPlanetAbbr(name);
                            const motionColor = data.retrograde ? '#ef4444' : 
                                                data.motion_state === 'Very Fast' || data.motion_state === 'Fast' ? '#10b981' :
                                                data.motion_state === 'Very Slow' || data.motion_state === 'Slow' ? '#eab308' : '#6366f1';
                            return (
                              <g key={name}>
                                {/* Motion state line indicator */}
                                <line x1="185" y1={95 + idx * 16} x2="195" y2={95 + idx * 16} 
                                      stroke={motionColor} strokeWidth="2" opacity="0.8" />
                                {data.retrograde && (
                                  <text x="180" y={98 + idx * 16} textAnchor="end" fill="#ef4444" fontSize="10" fontWeight="bold">℞</text>
                                )}
                                <text x="200" y={98 + idx * 16} textAnchor="middle" fill="#000" fontSize="12">
                                  {planet.marathi}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      )}
                      
                      {/* House 2 - Top right */}
                      <text x="320" y="60" textAnchor="middle" fill="#000" fontSize="12" fontWeight="600">2</text>
                      {chartData && (
                        <>
                          <text x="320" y="80" textAnchor="middle" fill="#000" fontSize="13">
                            {getZodiacSign(chartData.houses[1]).marathi}
                          </text>
                          {chartData.planetsByHouse[2]?.map((planet: any, idx: number) => {
                            const planetInfo = getPlanetAbbr(planet.name);
                            const planetData = chartData.planets[planet.name];
                            const motionColor = planetData?.retrograde ? '#ef4444' : 
                                                planetData?.motion_state === 'Very Fast' || planetData?.motion_state === 'Fast' ? '#10b981' :
                                                planetData?.motion_state === 'Very Slow' || planetData?.motion_state === 'Slow' ? '#eab308' : '#6366f1';
                            return (
                              <g key={planet.name}>
                                <line x1="305" y1={95 + idx * 16} x2="315" y2={95 + idx * 16} 
                                      stroke={motionColor} strokeWidth="2" opacity="0.8" />
                                {planetData?.retrograde && (
                                  <text x="300" y={98 + idx * 16} textAnchor="end" fill="#ef4444" fontSize="10" fontWeight="bold">℞</text>
                                )}
                                <text x="320" y={98 + idx * 16} textAnchor="middle" fill="#000" fontSize="12">
                                  {planetInfo.marathi}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      )}
                      
                      {/* House 3 - Right center */}
                      <text x="345" y="205" textAnchor="middle" fill="#000" fontSize="12" fontWeight="600">3</text>
                      {chartData && (
                        <>
                          <text x="345" y="225" textAnchor="middle" fill="#000" fontSize="13">
                            {getZodiacSign(chartData.houses[2]).marathi}
                          </text>
                          {chartData.planetsByHouse[3]?.map((planet: any, idx: number) => {
                            const planetInfo = getPlanetAbbr(planet.name);
                            const planetData = chartData.planets[planet.name];
                            const motionColor = planetData?.retrograde ? '#ef4444' : 
                                                planetData?.motion_state === 'Very Fast' || planetData?.motion_state === 'Fast' ? '#10b981' :
                                                planetData?.motion_state === 'Very Slow' || planetData?.motion_state === 'Slow' ? '#eab308' : '#6366f1';
                            return (
                              <g key={planet.name}>
                                <line x1="330" y1={240 + idx * 16} x2="340" y2={240 + idx * 16} 
                                      stroke={motionColor} strokeWidth="2" opacity="0.8" />
                                {planetData?.retrograde && (
                                  <text x="325" y={243 + idx * 16} textAnchor="end" fill="#ef4444" fontSize="10" fontWeight="bold">℞</text>
                                )}
                                <text x="345" y={243 + idx * 16} textAnchor="middle" fill="#000" fontSize="12">
                                  {planetInfo.marathi}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      )}
                      
                      {/* House 4 - Bottom right (IC) */}
                      <text x="260" y="305" textAnchor="middle" fill="#000" fontSize="12" fontWeight="600">4</text>
                      {chartData && (
                        <>
                          <text x="260" y="325" textAnchor="middle" fill="#000" fontSize="13">
                            {getZodiacSign(chartData.houses[3]).marathi}
                          </text>
                          {chartData.planetsByHouse[4]?.map((planet: any, idx: number) => {
                            const planetInfo = getPlanetAbbr(planet.name);
                            const planetData = chartData.planets[planet.name];
                            const motionColor = planetData?.retrograde ? '#ef4444' : 
                                                planetData?.motion_state === 'Very Fast' || planetData?.motion_state === 'Fast' ? '#10b981' :
                                                planetData?.motion_state === 'Very Slow' || planetData?.motion_state === 'Slow' ? '#eab308' : '#6366f1';
                            return (
                              <g key={planet.name}>
                                <line x1="245" y1={340 + idx * 16} x2="255" y2={340 + idx * 16} 
                                      stroke={motionColor} strokeWidth="2" opacity="0.8" />
                                {planetData?.retrograde && (
                                  <text x="240" y={343 + idx * 16} textAnchor="end" fill="#ef4444" fontSize="10" fontWeight="bold">℞</text>
                                )}
                                <text x="260" y={343 + idx * 16} textAnchor="middle" fill="#000" fontSize="12">
                                  {planetInfo.marathi}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      )}
                      
                      {/* House 5 - Bottom center */}
                      <text x="200" y="360" textAnchor="middle" fill="#000" fontSize="12" fontWeight="600">5</text>
                      {chartData && (
                        <>
                          <text x="200" y="350" textAnchor="middle" fill="#000" fontSize="13">
                            {getZodiacSign(chartData.houses[4]).marathi}
                          </text>
                          {chartData.planetsByHouse[5]?.map((planet: any, idx: number) => {
                            const planetInfo = getPlanetAbbr(planet.name);
                            return (
                              <text key={planet.name} x="200" y={330 - idx * 16} textAnchor="middle" fill="#000" fontSize="12">
                                {planetInfo.marathi}
                              </text>
                            );
                          })}
                        </>
                      )}
                      
                      {/* House 6 - Bottom left */}
                      <text x="140" y="305" textAnchor="middle" fill="#000" fontSize="12" fontWeight="600">6</text>
                      {chartData && (
                        <>
                          <text x="140" y="325" textAnchor="middle" fill="#000" fontSize="13">
                            {getZodiacSign(chartData.houses[5]).marathi}
                          </text>
                          {chartData.planetsByHouse[6]?.map((planet: any, idx: number) => {
                            const planetInfo = getPlanetAbbr(planet.name);
                            const planetData = chartData.planets[planet.name];
                            const motionColor = planetData?.retrograde ? '#ef4444' : 
                                                planetData?.motion_state === 'Very Fast' || planetData?.motion_state === 'Fast' ? '#10b981' :
                                                planetData?.motion_state === 'Very Slow' || planetData?.motion_state === 'Slow' ? '#eab308' : '#6366f1';
                            return (
                              <g key={planet.name}>
                                <line x1="125" y1={340 + idx * 16} x2="135" y2={340 + idx * 16} 
                                      stroke={motionColor} strokeWidth="2" opacity="0.8" />
                                {planetData?.retrograde && (
                                  <text x="120" y={343 + idx * 16} textAnchor="end" fill="#ef4444" fontSize="10" fontWeight="bold">℞</text>
                                )}
                                <text x="140" y={343 + idx * 16} textAnchor="middle" fill="#000" fontSize="12">
                                  {planetInfo.marathi}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      )}
                      
                      {/* House 7 - Left center (Descendant) */}
                      <text x="55" y="205" textAnchor="middle" fill="#000" fontSize="12" fontWeight="600">7</text>
                      {chartData && (
                        <>
                          <text x="55" y="225" textAnchor="middle" fill="#000" fontSize="13">
                            {getZodiacSign(chartData.houses[6]).marathi}
                          </text>
                          {chartData.planetsByHouse[7]?.map((planet: any, idx: number) => {
                            const planetInfo = getPlanetAbbr(planet.name);
                            const planetData = chartData.planets[planet.name];
                            const motionColor = planetData?.retrograde ? '#ef4444' : 
                                                planetData?.motion_state === 'Very Fast' || planetData?.motion_state === 'Fast' ? '#10b981' :
                                                planetData?.motion_state === 'Very Slow' || planetData?.motion_state === 'Slow' ? '#eab308' : '#6366f1';
                            return (
                              <g key={planet.name}>
                                <line x1="40" y1={240 + idx * 16} x2="50" y2={240 + idx * 16} 
                                      stroke={motionColor} strokeWidth="2" opacity="0.8" />
                                {planetData?.retrograde && (
                                  <text x="35" y={243 + idx * 16} textAnchor="end" fill="#ef4444" fontSize="10" fontWeight="bold">℞</text>
                                )}
                                <text x="55" y={243 + idx * 16} textAnchor="middle" fill="#000" fontSize="12">
                                  {planetInfo.marathi}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      )}
                      
                      {/* House 8 - Top left */}
                      <text x="70" y="140" textAnchor="middle" fill="#000" fontSize="12" fontWeight="600">8</text>
                      {chartData && (
                        <>
                          <text x="70" y="160" textAnchor="middle" fill="#000" fontSize="13">
                            {getZodiacSign(chartData.houses[7]).marathi}
                          </text>
                          {chartData.planetsByHouse[8]?.map((planet: any, idx: number) => {
                            const planetInfo = getPlanetAbbr(planet.name);
                            const planetData = chartData.planets[planet.name];
                            const motionColor = planetData?.retrograde ? '#ef4444' : 
                                                planetData?.motion_state === 'Very Fast' || planetData?.motion_state === 'Fast' ? '#10b981' :
                                                planetData?.motion_state === 'Very Slow' || planetData?.motion_state === 'Slow' ? '#eab308' : '#6366f1';
                            return (
                              <g key={planet.name}>
                                <line x1="55" y1={175 + idx * 16} x2="65" y2={175 + idx * 16} 
                                      stroke={motionColor} strokeWidth="2" opacity="0.8" />
                                {planetData?.retrograde && (
                                  <text x="50" y={178 + idx * 16} textAnchor="end" fill="#ef4444" fontSize="10" fontWeight="bold">℞</text>
                                )}
                                <text x="70" y={178 + idx * 16} textAnchor="middle" fill="#000" fontSize="12">
                                  {planetInfo.marathi}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      )}
                      
                      {/* House 9 - Top left inner */}
                      <text x="130" y="95" textAnchor="middle" fill="#000" fontSize="12" fontWeight="600">9</text>
                      {chartData && (
                        <>
                          <text x="130" y="115" textAnchor="middle" fill="#000" fontSize="13">
                            {getZodiacSign(chartData.houses[8]).marathi}
                          </text>
                          {chartData.planetsByHouse[9]?.map((planet: any, idx: number) => {
                            const planetInfo = getPlanetAbbr(planet.name);
                            const planetData = chartData.planets[planet.name];
                            const motionColor = planetData?.retrograde ? '#ef4444' : 
                                                planetData?.motion_state === 'Very Fast' || planetData?.motion_state === 'Fast' ? '#10b981' :
                                                planetData?.motion_state === 'Very Slow' || planetData?.motion_state === 'Slow' ? '#eab308' : '#6366f1';
                            return (
                              <g key={planet.name}>
                                <line x1="115" y1={130 + idx * 16} x2="125" y2={130 + idx * 16} 
                                      stroke={motionColor} strokeWidth="2" opacity="0.8" />
                                {planetData?.retrograde && (
                                  <text x="110" y={133 + idx * 16} textAnchor="end" fill="#ef4444" fontSize="10" fontWeight="bold">℞</text>
                                )}
                                <text x="130" y={133 + idx * 16} textAnchor="middle" fill="#000" fontSize="12">
                                  {planetInfo.marathi}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      )}
                      
                      {/* House 10 - Top left triangle (MC) */}
                      <text x="80" y="60" textAnchor="middle" fill="#000" fontSize="12" fontWeight="600">10</text>
                      {chartData && (
                        <>
                          <text x="80" y="80" textAnchor="middle" fill="#000" fontSize="13">
                            {getZodiacSign(chartData.houses[9]).marathi}
                          </text>
                          {chartData.planetsByHouse[10]?.map((planet: any, idx: number) => {
                            const planetInfo = getPlanetAbbr(planet.name);
                            const planetData = chartData.planets[planet.name];
                            const motionColor = planetData?.retrograde ? '#ef4444' : 
                                                planetData?.motion_state === 'Very Fast' || planetData?.motion_state === 'Fast' ? '#10b981' :
                                                planetData?.motion_state === 'Very Slow' || planetData?.motion_state === 'Slow' ? '#eab308' : '#6366f1';
                            return (
                              <g key={planet.name}>
                                <line x1="65" y1={95 + idx * 16} x2="75" y2={95 + idx * 16} 
                                      stroke={motionColor} strokeWidth="2" opacity="0.8" />
                                {planetData?.retrograde && (
                                  <text x="60" y={98 + idx * 16} textAnchor="end" fill="#ef4444" fontSize="10" fontWeight="bold">℞</text>
                                )}
                                <text x="80" y={98 + idx * 16} textAnchor="middle" fill="#000" fontSize="12">
                                  {planetInfo.marathi}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      )}
                      
                      {/* House 11 - Top right small triangle */}
                      <text x="270" y="95" textAnchor="middle" fill="#000" fontSize="12" fontWeight="600">11</text>
                      {chartData && (
                        <>
                          <text x="270" y="115" textAnchor="middle" fill="#000" fontSize="13">
                            {getZodiacSign(chartData.houses[10]).marathi}
                          </text>
                          {chartData.planetsByHouse[11]?.map((planet: any, idx: number) => {
                            const planetInfo = getPlanetAbbr(planet.name);
                            const planetData = chartData.planets[planet.name];
                            const motionColor = planetData?.retrograde ? '#ef4444' : 
                                                planetData?.motion_state === 'Very Fast' || planetData?.motion_state === 'Fast' ? '#10b981' :
                                                planetData?.motion_state === 'Very Slow' || planetData?.motion_state === 'Slow' ? '#eab308' : '#6366f1';
                            return (
                              <g key={planet.name}>
                                <line x1="255" y1={130 + idx * 16} x2="265" y2={130 + idx * 16} 
                                      stroke={motionColor} strokeWidth="2" opacity="0.8" />
                                {planetData?.retrograde && (
                                  <text x="250" y={133 + idx * 16} textAnchor="end" fill="#ef4444" fontSize="10" fontWeight="bold">℞</text>
                                )}
                                <text x="270" y={133 + idx * 16} textAnchor="middle" fill="#000" fontSize="12">
                                  {planetInfo.marathi}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      )}
                      
                      {/* House 12 - Top right triangle */}
                      <text x="320" y="60" textAnchor="middle" fill="#000" fontSize="12" fontWeight="600">12</text>
                      {chartData && (
                        <>
                          <text x="320" y="80" textAnchor="middle" fill="#000" fontSize="13">
                            {getZodiacSign(chartData.houses[11]).marathi}
                          </text>
                          {chartData.planetsByHouse[12]?.map((planet: any, idx: number) => {
                            const planetInfo = getPlanetAbbr(planet.name);
                            const planetData = chartData.planets[planet.name];
                            const motionColor = planetData?.retrograde ? '#ef4444' : 
                                                planetData?.motion_state === 'Very Fast' || planetData?.motion_state === 'Fast' ? '#10b981' :
                                                planetData?.motion_state === 'Very Slow' || planetData?.motion_state === 'Slow' ? '#eab308' : '#6366f1';
                            return (
                              <g key={planet.name}>
                                <line x1="305" y1={95 + idx * 16} x2="315" y2={95 + idx * 16} 
                                      stroke={motionColor} strokeWidth="2" opacity="0.8" />
                                {planetData?.retrograde && (
                                  <text x="300" y={98 + idx * 16} textAnchor="end" fill="#ef4444" fontSize="10" fontWeight="bold">℞</text>
                                )}
                                <text x="320" y={98 + idx * 16} textAnchor="middle" fill="#000" fontSize="12">
                                  {planetInfo.marathi}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      )}
                        </>
                      )}
                    </svg>
                    
                    {/* Enhanced Center Label with animation */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-xl opacity-60 animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-purple-600/40 to-pink-600/40 backdrop-blur-lg px-6 py-3 rounded-xl border-2 border-purple-500/50 shadow-2xl">
                          <div className="flex items-center space-x-2 mb-1">
                            <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                            <p className="text-white font-bold text-base">Ascendant (लग्न)</p>
                            <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                          </div>
                          {chartData ? (
                            <p className="text-purple-200 text-sm font-semibold text-center">
                              {getZodiacSign(chartData.ascendant).name} ({getZodiacSign(chartData.ascendant).marathi})
                            </p>
                          ) : (
                            <p className="text-purple-200 text-sm font-semibold text-center">♐ Sagittarius (धनु)</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* Enhanced Legend with icons and animations */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="group p-4 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="relative">
                        <div className="w-4 h-4 bg-purple-500 rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="absolute inset-0 bg-purple-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <span className="text-white text-sm font-bold">Houses</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">12 divisions representing life areas and experiences</p>
                  </div>
                  
                  <div className="group p-4 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="relative">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="absolute inset-0 bg-yellow-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <span className="text-white text-sm font-bold">Planets</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">7 grahas (celestial bodies) influencing destiny</p>
                  </div>
                  
                  <div className="group p-4 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="relative">
                        <div className="w-4 h-4 bg-pink-500 rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="absolute inset-0 bg-pink-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <span className="text-white text-sm font-bold">Signs</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">Zodiac constellations shaping personality traits</p>
                  </div>
                  
                  <div className="group p-4 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="relative">
                        <div className="w-4 h-4 bg-green-500 rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <span className="text-white text-sm font-bold">Degrees</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">Exact planetary positions for precise analysis</p>
                  </div>
                </div>

                {/* Planetary Motion States Legend */}
                {chartData && (
                  <div className="mt-8 bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-purple-400" />
                      <span>Planetary Motion States (Gati)</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      <div className="p-3 bg-white/5 rounded-lg border border-red-500/30">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-bold text-red-400">Vakra</span>
                        </div>
                        <p className="text-[10px] text-gray-400">Retrograde</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-green-500/30">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-bold text-green-400">Druti</span>
                        </div>
                        <p className="text-[10px] text-gray-400">Fast</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-yellow-500/30">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-bold text-yellow-400">Manda</span>
                        </div>
                        <p className="text-[10px] text-gray-400">Slow</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-blue-500/30">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-bold text-blue-400">Sama</span>
                        </div>
                        <p className="text-[10px] text-gray-400">Normal</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-emerald-500/30">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-bold text-emerald-400">Ati Druti</span>
                        </div>
                        <p className="text-[10px] text-gray-400">Very Fast</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                      Motion states (Gati) indicate the speed and direction of planetary movement. 
                      <span className="text-purple-400 font-semibold"> Vakra (Retrograde)</span> planets appear to move backward, 
                      <span className="text-green-400 font-semibold"> Druti</span> indicates fast forward motion, 
                      <span className="text-yellow-400 font-semibold"> Manda</span> shows slow movement, and 
                      <span className="text-blue-400 font-semibold"> Sama</span> represents normal speed. 
                      These states significantly influence planetary strength and effects in Vedic astrology.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Planetary Positions */}
          {activeTab === 'planets' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {chartData && chartData.planets ? (
                Object.entries(chartData.planets).map(([name, data]: [string, any], idx) => {
                  const planetColors: any = {
                    sun: '#f59e0b', moon: '#94a3b8', mars: '#ef4444',
                    mercury: '#10b981', jupiter: '#eab308', venus: '#ec4899',
                    saturn: '#6366f1', rahu: '#8b5cf6', ketu: '#f97316'
                  };
                  const sign = getZodiacSign(data.longitude);
                  const house = getHouseNumber(data.longitude, chartData.ascendant);
                  const motionColor = data.retrograde ? '#ef4444' : 
                                      data.motion_state === 'Very Fast' || data.motion_state === 'Fast' ? '#10b981' :
                                      data.motion_state === 'Very Slow' || data.motion_state === 'Slow' ? '#eab308' : '#6366f1';
                  
                  return (
                    <div
                      key={name}
                      className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-white/20 hover:scale-105 transition-all duration-300 overflow-hidden"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-lg"
                              style={{ backgroundColor: planetColors[name] || '#6366f1' }}
                            >
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-white capitalize">{name}</h4>
                              <p className="text-sm text-gray-400">{sign.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-white">{sign.degree}°{sign.minutes}'</p>
                            <p className="text-xs text-gray-400">House {house}</p>
                          </div>
                        </div>
                        
                        {/* Motion State Indicator */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-2 h-2 rounded-full animate-pulse" 
                              style={{ backgroundColor: motionColor }}
                            ></div>
                            <span className="text-xs text-gray-400">Motion:</span>
                            <span className="text-xs font-semibold" style={{ color: motionColor }}>
                              {data.motion_state || 'Normal'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">Sanskrit:</span>
                            <span className="text-xs font-semibold text-purple-400">
                              {data.motion_sanskrit || 'Sama'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Speed indicator */}
                        <div className="mt-2 text-xs text-gray-500">
                          Speed: {Math.abs(data.speed).toFixed(4)}° /day
                          {data.retrograde && <span className="ml-2 text-red-400 font-bold">℞ Retrograde</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                planets.map((planet, idx) => (
                  <div
                    key={planet.name}
                    className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-white/20 hover:scale-105 transition-all duration-300 overflow-hidden"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-lg"
                          style={{ backgroundColor: planet.color }}
                        >
                          {planet.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">{planet.name}</h4>
                          <p className="text-sm text-gray-400">{planet.sign}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-white">{planet.degree}</p>
                        <p className="text-xs text-gray-400">House {planet.house}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Yogas */}
          {activeTab === 'yogas' && (
            <div className="space-y-4">
              {yogas.map((yoga, idx) => (
                <div
                  key={yoga.name}
                  className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-green-500/30 hover:scale-[1.02] transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="relative flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Award className="w-6 h-6 text-yellow-400" />
                        <h3 className="text-2xl font-bold text-white">{yoga.name}</h3>
                        <span className="px-3 py-1 bg-green-600/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                          {yoga.type}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{yoga.description}</p>
                      
                      {/* Strength bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400 font-semibold">Strength</span>
                          <span className="text-white font-bold">{yoga.strength}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-600 to-emerald-400 rounded-full transition-all duration-1000"
                            style={{ width: `${yoga.strength}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Insights */}
          {activeTab === 'insights' && (
            <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">AI-Powered Insights</h3>
              </div>
              
              <div className="space-y-6 text-gray-300">
                <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                  <h4 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span>Strengths</span>
                  </h4>
                  <p>Your chart shows strong leadership qualities with Sun in the ascendant. Jupiter's placement indicates wisdom and spiritual inclination.</p>
                </div>
                
                <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                  <h4 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span>Career Potential</span>
                  </h4>
                  <p>Multiple Raj Yogas suggest success in administrative or leadership roles. Mercury's position favors communication and business ventures.</p>
                </div>
                
                <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                  <h4 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
                    <Info className="w-5 h-5 text-purple-400" />
                    <span>Recommendations</span>
                  </h4>
                  <p>Focus on spiritual practices during Saturn's transit. Consider meditation and yoga for mental clarity. Favorable period for new beginnings ahead.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
