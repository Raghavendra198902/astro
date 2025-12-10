'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Share2, Calendar, MapPin, Clock } from 'lucide-react';

interface ChartData {
  id: string;
  profile_id: string;
  system: string;
  json_payload: {
    datetime_utc: string;
    latitude: number;
    longitude: number;
    planets: {
      [key: string]: {
        longitude: number;
        latitude: number;
        distance: number;
        speed: number;
        retrograde: boolean;
      } | null;
    };
    houses: number[];
    ascendant: number;
    mc: number;
    aspects?: Array<{
      planet1: string;
      planet2: string;
      aspect: string;
      angle: number;
      orb: number;
    }>;
    yogas?: Array<{
      name: string;
      description: string;
      category: string;
      strength: string;
      present: boolean;
    }>;
    shadbala?: {
      [planet: string]: {
        total: number;
        positional: number;
        directional: number;
        temporal: number;
        motional: number;
        natural: number;
        aspectual: number;
      };
    };
    panchang?: {
      tithi: string;
      nakshatra: string;
      yoga: string;
      karana: string;
    };
    moon_nakshatra?: {
      name: string;
      number: number;
      lord: string;
      pada: number;
    };
    vimshottari_dasha?: {
      current_mahadasha: any;
      current_antardasha: any;
    };
  };
  created_at: string;
}

interface ProfileData {
  id: string;
  name: string;
  dob_ts_utc: string;
  birthplace_text: string;
  timezone: string;
}

export default function ChartDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chartId = params.id as string;

  const [chart, setChart] = useState<ChartData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartStyle, setChartStyle] = useState<'north-indian' | 'south-indian' | 'western'>('north-indian');

  useEffect(() => {
    fetchChartDetails();
  }, [chartId]);

  const fetchChartDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/charts/${chartId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChart(data);
        
        // Fetch profile data
        const profileResponse = await fetch(`http://localhost:8000/api/v1/users/profiles`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (profileResponse.ok) {
          const profiles = await profileResponse.json();
          const matchingProfile = profiles.find((p: ProfileData) => p.id === data.profile_id);
          if (matchingProfile) {
            setProfile(matchingProfile);
          }
        }
      } else {
        alert('Failed to load chart');
        router.push('/dashboard/charts');
      }
    } catch (error) {
      console.error('Error fetching chart:', error);
      alert('Error loading chart');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSignFromLongitude = (longitude: number): { sign: string; degree: number } => {
    if (longitude === undefined || longitude === null || isNaN(longitude)) {
      return { sign: 'Unknown', degree: 0 };
    }
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = Math.floor(longitude / 30);
    const degree = longitude % 30;
    return {
      sign: signs[signIndex] || 'Unknown',
      degree: degree
    };
  };

  const getHouseForPlanet = (planetLongitude: number, houses: number[]): number => {
    // Find which house the planet is in
    for (let i = 0; i < 12; i++) {
      const currentHouse = houses[i];
      const nextHouse = houses[(i + 1) % 12];
      
      // Handle wrap-around at 360/0 degrees
      if (nextHouse > currentHouse) {
        if (planetLongitude >= currentHouse && planetLongitude < nextHouse) {
          return i + 1;
        }
      } else {
        // Wraps around 0
        if (planetLongitude >= currentHouse || planetLongitude < nextHouse) {
          return i + 1;
        }
      }
    }
    return 1; // Default to first house
  };

  const getNakshatraName = (longitude: number): string => {
    const nakshatras = [
      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
      'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
      'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
      'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
      'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];
    const nakshatraIndex = Math.floor(longitude / 13.333333);
    return nakshatras[nakshatraIndex % 27];
  };

  const getPlanetEmoji = (planet: string) => {
    const emojis: { [key: string]: string } = {
      'Sun': '☉',
      'Moon': '☽',
      'Mars': '♂',
      'Mercury': '☿',
      'Jupiter': '♃',
      'Venus': '♀',
      'Saturn': '♄',
      'Rahu': '☊',
      'Ketu': '☋',
      'Uranus': '♅',
      'Neptune': '♆',
      'Pluto': '♇'
    };
    return emojis[planet] || '●';
  };

  const getZodiacEmoji = (sign: string) => {
    const emojis: { [key: string]: string } = {
      'Aries': '♈',
      'Taurus': '♉',
      'Gemini': '♊',
      'Cancer': '♋',
      'Leo': '♌',
      'Virgo': '♍',
      'Libra': '♎',
      'Scorpio': '♏',
      'Sagittarius': '♐',
      'Capricorn': '♑',
      'Aquarius': '♒',
      'Pisces': '♓'
    };
    return emojis[sign] || sign;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading chart...</div>
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">Chart not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 p-4 md:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard/charts')}
              className="group p-3 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl hover:from-slate-700/60 hover:to-slate-800/60 rounded-xl transition-all duration-300 hover:scale-105 border border-slate-700/50 shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                {profile?.name || 'Birth Chart'}
              </h1>
              <p className="text-slate-400 mt-2 flex items-center gap-2">
                <span className="text-2xl">{chart.system === 'vedic' ? '🕉️' : '⭐'}</span>
                <span className="font-medium">{chart.system === 'vedic' ? 'Vedic Jyotish' : 'Western Astrology'}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {/* Chart Style Dropdown */}
            <select
              value={chartStyle}
              onChange={(e) => setChartStyle(e.target.value as 'north-indian' | 'south-indian' | 'western')}
              className="px-4 py-2.5 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-xl transition-all duration-300 border border-slate-700/50 shadow-lg hover:shadow-purple-500/20 text-white font-medium cursor-pointer hover:from-slate-700/60 hover:to-slate-800/60"
            >
              <option value="north-indian">North Indian Chart</option>
              <option value="south-indian">South Indian Chart</option>
              <option value="western">Western Wheel</option>
            </select>
            
            <button className="px-5 py-2.5 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl hover:from-slate-700/60 hover:to-slate-800/60 rounded-xl transition-all duration-300 flex items-center gap-2 border border-slate-700/50 shadow-lg hover:shadow-purple-500/20 hover:scale-105">
              <Share2 className="w-4 h-4 text-purple-400" />
              <span className="text-white font-medium">Share</span>
            </button>
            <button className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105">
              <Download className="w-4 h-4" />
              <span className="font-medium">Download PDF</span>
            </button>
          </div>
        </div>

        {/* Birth Info Card */}
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-slate-700/50 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-600/10 to-purple-800/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1">Birth Date & Time</p>
                <p className="text-white font-semibold text-lg">{formatDate(chart.json_payload.datetime_utc)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-pink-600/10 to-pink-800/10 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
              <div className="p-3 bg-pink-500/20 rounded-lg">
                <MapPin className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <p className="text-pink-300 text-xs font-semibold uppercase tracking-wider mb-1">Birth Place</p>
                <p className="text-white font-semibold text-lg">{profile?.birthplace_text || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-800/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">Timezone</p>
                <p className="text-white font-semibold text-lg">{profile?.timezone || 'UTC'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-slate-800/50">
          {['overview', 'planets', 'houses', 'aspects', 'yogas', 'dashas', 'shadbala'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                  : 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl text-slate-400 hover:text-white hover:from-slate-700/40 hover:to-slate-800/40 border border-slate-700/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-700/50 shadow-2xl">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-8">Chart Overview</h2>
              
              {/* Ascendant & Key Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group p-6 bg-gradient-to-br from-purple-600/20 via-purple-700/20 to-purple-800/20 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02]">
                  <div className="text-sm text-purple-300 font-semibold uppercase tracking-wider mb-3">Ascendant (Lagna)</div>
                  <div className="text-3xl font-bold text-white">
                    {(() => {
                      const asc = getSignFromLongitude(chart.json_payload.ascendant);
                      return `${getZodiacEmoji(asc.sign)} ${asc.sign} ${asc.degree.toFixed(2)}°`;
                    })()}
                  </div>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-pink-600/20 via-pink-700/20 to-pink-800/20 rounded-2xl border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20 hover:scale-[1.02]">
                  <div className="text-sm text-pink-300 font-semibold uppercase tracking-wider mb-3">Midheaven (MC)</div>
                  <div className="text-3xl font-bold text-white">
                    {(() => {
                      const mc = getSignFromLongitude(chart.json_payload.mc);
                      return `${getZodiacEmoji(mc.sign)} ${mc.sign} ${mc.degree.toFixed(2)}°`;
                    })()}
                  </div>
                </div>
              </div>

              {/* Moon Nakshatra */}
              {chart.json_payload.moon_nakshatra && (
                <div className="p-6 bg-gradient-to-br from-blue-600/20 via-blue-700/20 to-blue-800/20 rounded-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
                  <div className="text-sm text-blue-300 font-semibold uppercase tracking-wider mb-3">Moon Nakshatra</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {chart.json_payload.moon_nakshatra.name}
                      </div>
                      <div className="text-sm text-slate-300 mt-1">
                        Lord: {chart.json_payload.moon_nakshatra.lord} • Pada: {chart.json_payload.moon_nakshatra.pada}
                      </div>
                    </div>
                    <div className="text-3xl">☽</div>
                  </div>
                </div>
              )}

              {/* Panchang */}
              {chart.json_payload.panchang && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div className="text-xs text-slate-400 mb-1">Tithi</div>
                    <div className="text-white font-medium">
                      {typeof chart.json_payload.panchang.tithi === 'object' 
                        ? chart.json_payload.panchang.tithi.name 
                        : chart.json_payload.panchang.tithi}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div className="text-xs text-slate-400 mb-1">Nakshatra</div>
                    <div className="text-white font-medium">
                      {typeof chart.json_payload.panchang.nakshatra === 'object' 
                        ? chart.json_payload.panchang.nakshatra.name 
                        : chart.json_payload.panchang.nakshatra}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div className="text-xs text-slate-400 mb-1">Yoga</div>
                    <div className="text-white font-medium">
                      {typeof chart.json_payload.panchang.yoga === 'object' 
                        ? chart.json_payload.panchang.yoga.name 
                        : chart.json_payload.panchang.yoga}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div className="text-xs text-slate-400 mb-1">Karana</div>
                    <div className="text-white font-medium">
                      {typeof chart.json_payload.panchang.karana === 'object' 
                        ? chart.json_payload.panchang.karana.name 
                        : chart.json_payload.panchang.karana}
                    </div>
                  </div>
                </div>
              )}

              {/* Chart Wheel - Dynamic based on selection */}
              <div>
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6">
                  {chartStyle === 'north-indian' && 'Birth Chart (North Indian)'}
                  {chartStyle === 'south-indian' && 'Birth Chart (South Indian)'}
                  {chartStyle === 'western' && 'Birth Chart (Western Wheel)'}
                </h3>
                <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-3xl border border-slate-700/50 shadow-2xl">
                  
                  {/* North Indian Chart */}
                  {chartStyle === 'north-indian' && (
                  <div className="relative w-full aspect-square bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-4 border-amber-900 shadow-lg">
                    {/* Calculate planets in houses */}
                    {(() => {
                      const housePlanets: Record<number, string[]> = {};
                      Object.entries(chart.json_payload.planets || {}).forEach(([name, data]: [string, any]) => {
                        const house = getHouseForPlanet(data.longitude, chart.json_payload.houses);
                        if (!housePlanets[house]) housePlanets[house] = [];
                        housePlanets[house].push(name);
                      });

                      // North Indian chart house positions - exact traditional layout
                      // The chart is a square divided into 12 triangular sections
                      const positions = [
                        { house: 1, top: '0%', left: '50%', width: '25%', height: '25%', transform: 'translate(-50%, 0)' },
                        { house: 2, top: '0%', left: '75%', width: '25%', height: '25%', transform: 'translate(-50%, 0)' },
                        { house: 3, top: '25%', left: '75%', width: '25%', height: '25%', transform: 'translate(0, -50%)' },
                        { house: 4, top: '50%', left: '75%', width: '25%', height: '25%', transform: 'translate(0, -50%)' },
                        { house: 5, top: '75%', left: '75%', width: '25%', height: '25%', transform: 'translate(0, -50%)' },
                        { house: 6, top: '75%', left: '50%', width: '25%', height: '25%', transform: 'translate(-50%, 0)' },
                        { house: 7, top: '75%', left: '25%', width: '25%', height: '25%', transform: 'translate(-50%, 0)' },
                        { house: 8, top: '75%', left: '0%', width: '25%', height: '25%', transform: 'translate(0, -50%)' },
                        { house: 9, top: '50%', left: '0%', width: '25%', height: '25%', transform: 'translate(0, -50%)' },
                        { house: 10, top: '25%', left: '0%', width: '25%', height: '25%', transform: 'translate(0, -50%)' },
                        { house: 11, top: '0%', left: '25%', width: '25%', height: '25%', transform: 'translate(-50%, 0)' },
                        { house: 12, top: '0%', left: '0%', width: '25%', height: '25%', transform: 'translate(-50%, 0)' },
                      ];

                      // Planet abbreviations
                      const planetAbbr: Record<string, string> = {
                        sun: 'Su', moon: 'Mo', mercury: 'Me', venus: 'Ve',
                        mars: 'Ma', jupiter: 'Ju', saturn: 'Sa',
                        rahu: 'Ra', ketu: 'Ke', uranus: 'Ur', neptune: 'Ne', pluto: 'Pl'
                      };

                      return (
                        <>
                          {/* Grid lines - creating the traditional diamond pattern */}
                          <div className="absolute inset-0">
                            {/* Outer border already exists */}
                            {/* Horizontal lines */}
                            <div className="absolute left-0 w-full border-t-2 border-amber-900" style={{ top: '25%' }}></div>
                            <div className="absolute left-0 w-full border-t-2 border-amber-900" style={{ top: '50%' }}></div>
                            <div className="absolute left-0 w-full border-t-2 border-amber-900" style={{ top: '75%' }}></div>
                            {/* Vertical lines */}
                            <div className="absolute top-0 h-full border-l-2 border-amber-900" style={{ left: '25%' }}></div>
                            <div className="absolute top-0 h-full border-l-2 border-amber-900" style={{ left: '50%' }}></div>
                            <div className="absolute top-0 h-full border-l-2 border-amber-900" style={{ left: '75%' }}></div>
                            {/* Diagonal lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'none' }}>
                              <line x1="0" y1="0" x2="100%" y2="100%" stroke="#78350f" strokeWidth="2" />
                              <line x1="100%" y1="0" x2="0" y2="100%" stroke="#78350f" strokeWidth="2" />
                            </svg>
                          </div>

                          {/* Houses with planets */}
                          {positions.map(({ house, top, left, width, height, transform }) => {
                            const houseCusp = chart.json_payload.houses[house - 1];
                            const { sign } = getSignFromLongitude(houseCusp);
                            const planets = housePlanets[house] || [];

                            return (
                              <div
                                key={house}
                                className="absolute flex items-center justify-center"
                                style={{ top, left, width, height, transform }}
                              >
                                <div className="relative w-full h-full flex items-center justify-center p-2">
                                  <div className="text-center">
                                    {/* House number */}
                                    <div className="text-[10px] font-bold text-amber-900 mb-1">{house}</div>
                                    
                                    {/* Lagna marker */}
                                    {house === 1 && (
                                      <div className="text-[9px] font-bold text-red-700 mb-1">Lagna</div>
                                    )}
                                    
                                    {/* Planets */}
                                    {planets.length > 0 && (
                                      <div className="flex flex-wrap gap-1 justify-center">
                                        {planets.map(planet => (
                                          <div 
                                            key={planet}
                                            className="text-[10px] font-bold text-blue-800"
                                            title={`${planet.charAt(0).toUpperCase() + planet.slice(1)}`}
                                          >
                                            {planetAbbr[planet]}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      );
                    })()}
                  </div>
                  )}
                  
                  {/* South Indian Chart */}
                  {chartStyle === 'south-indian' && (
                    <div className="relative w-full aspect-square bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-4 border-amber-900 shadow-lg">
                      {(() => {
                        const housePlanets: Record<number, string[]> = {};
                        Object.entries(chart.json_payload.planets || {}).forEach(([name, data]: [string, any]) => {
                          const house = getHouseForPlanet(data.longitude, chart.json_payload.houses);
                          if (!housePlanets[house]) housePlanets[house] = [];
                          housePlanets[house].push(name);
                        });

                        // South Indian chart - Fixed house positions in 4x4 grid
                        // Houses are in fixed positions, signs rotate based on ascendant
                        const housePositions = [
                          { house: 1, row: 3, col: 1 }, // Bottom-left to top-right diagonal
                          { house: 2, row: 2, col: 0 },
                          { house: 3, row: 1, col: 0 },
                          { house: 4, row: 0, col: 1 },
                          { house: 5, row: 0, col: 2 },
                          { house: 6, row: 0, col: 3 },
                          { house: 7, row: 1, col: 3 },
                          { house: 8, row: 2, col: 3 },
                          { house: 9, row: 3, col: 3 },
                          { house: 10, row: 3, col: 2 },
                          { house: 11, row: 3, col: 1 },
                          { house: 12, row: 2, col: 1 },
                        ];

                        // Get ascendant sign to determine sign rotation
                        const ascendantSign = getSignFromLongitude(chart.json_payload.ascendant).sign;
                        const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                                      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
                        const ascendantIndex = signs.indexOf(ascendantSign);

                        // Planet abbreviations
                        const planetAbbr: Record<string, string> = {
                          sun: 'Su', moon: 'Mo', mercury: 'Me', venus: 'Ve',
                          mars: 'Ma', jupiter: 'Ju', saturn: 'Sa',
                          rahu: 'Ra', ketu: 'Ke', uranus: 'Ur', neptune: 'Ne', pluto: 'Pl'
                        };

                        return (
                          <>
                            {/* Grid structure */}
                            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                              {housePositions.map(({ house, row, col }) => {
                                // Calculate which sign is in this house
                                const signIndex = (ascendantIndex + house - 1) % 12;
                                const sign = signs[signIndex];
                                const planets = housePlanets[house] || [];

                                return (
                                  <div
                                    key={house}
                                    className="border-2 border-amber-900 flex items-center justify-center relative"
                                    style={{
                                      gridRow: row + 1,
                                      gridColumn: col + 1,
                                    }}
                                  >
                                    <div className="text-center p-2">
                                      {/* House number in corner */}
                                      <div className="absolute top-1 left-1 text-[8px] font-bold text-amber-950/50">
                                        {house}
                                      </div>

                                      {/* Lagna indicator */}
                                      {house === 1 && (
                                        <div className="text-[9px] font-black text-red-800 bg-red-100/60 px-1 rounded border border-red-400 mb-1">
                                          Lg
                                        </div>
                                      )}

                                      {/* Sign name */}
                                      <div className="text-[11px] font-black text-amber-900 mb-1">
                                        {sign.substring(0, 3).toUpperCase()}
                                      </div>

                                      {/* Planets in this house */}
                                      {planets.length > 0 && (
                                        <div className="flex flex-wrap gap-0.5 justify-center items-center">
                                          {planets.slice(0, 3).map(planet => {
                                            const planetData = chart.json_payload.planets[planet];
                                            const isRetrograde = planetData?.retrograde;
                                            return (
                                              <div
                                                key={planet}
                                                className="text-[9px] font-bold text-blue-900 bg-blue-100/80 px-1 rounded"
                                                title={`${planet.charAt(0).toUpperCase() + planet.slice(1)}${isRetrograde ? ' (R)' : ''}`}
                                              >
                                                {planetAbbr[planet]}
                                                {isRetrograde && <span className="text-red-600 text-[7px]">℞</span>}
                                              </div>
                                            );
                                          })}
                                          {planets.length > 3 && (
                                            <div className="text-[7px] text-amber-800 font-bold">+{planets.length - 3}</div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Center diagonal boxes (empty decorative) */}
                              <div className="border-2 border-amber-900 bg-amber-100/30" style={{ gridRow: 2, gridColumn: 2 }}></div>
                              <div className="border-2 border-amber-900 bg-amber-100/30" style={{ gridRow: 2, gridColumn: 3 }}></div>
                              <div className="border-2 border-amber-900 bg-amber-100/30" style={{ gridRow: 3, gridColumn: 2 }}></div>
                            </div>

                            {/* Diagonal line from bottom-left to top-right */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                              <line x1="0" y1="100%" x2="100%" y2="0" stroke="#78350f" strokeWidth="3" />
                            </svg>

                            {/* Center label */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-100 border-2 border-amber-800 rounded-full w-16 h-16 flex items-center justify-center shadow-lg z-10">
                              <div className="text-center">
                                <div className="text-[9px] font-black text-amber-950 leading-tight">SOUTH</div>
                                <div className="text-[7px] text-amber-800 font-semibold">INDIAN</div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                  
                  {/* Western Wheel Chart */}
                  {chartStyle === 'western' && (
                    <div className="relative w-full aspect-square">
                      {/* Zodiac Wheel */}
                      <svg viewBox="0 0 400 400" className="w-full h-full">
                        {/* Outer circle */}
                        <circle cx="200" cy="200" r="190" fill="none" stroke="#7c3aed" strokeWidth="3" />
                        <circle cx="200" cy="200" r="160" fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.5" />
                        <circle cx="200" cy="200" r="130" fill="none" stroke="#c4b5fd" strokeWidth="1" opacity="0.3" />
                        
                        {/* Inner center circle */}
                        <circle cx="200" cy="200" r="40" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />
                        
                        {/* 12 Zodiac signs around the wheel */}
                        {Array.from({ length: 12 }, (_, i) => {
                          const angle = (i * 30 - 90) * (Math.PI / 180); // Start from top, go clockwise
                          const x = 200 + 175 * Math.cos(angle);
                          const y = 200 + 175 * Math.sin(angle);
                          const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                                         'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
                          const signEmojis = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
                          
                          return (
                            <g key={i}>
                              {/* Dividing lines */}
                              <line 
                                x1="200" 
                                y1="200" 
                                x2={200 + 190 * Math.cos(angle)} 
                                y2={200 + 190 * Math.sin(angle)} 
                                stroke="#7c3aed" 
                                strokeWidth="1" 
                                opacity="0.3"
                              />
                              {/* Sign symbols */}
                              <text 
                                x={x} 
                                y={y} 
                                fill="#a78bfa" 
                                fontSize="18" 
                                fontWeight="bold"
                                textAnchor="middle" 
                                dominantBaseline="middle"
                              >
                                {signEmojis[i]}
                              </text>
                              {/* Sign names */}
                              <text 
                                x={200 + 145 * Math.cos(angle)} 
                                y={200 + 145 * Math.sin(angle)} 
                                fill="#c4b5fd" 
                                fontSize="10" 
                                textAnchor="middle" 
                                dominantBaseline="middle"
                              >
                                {signs[i].substring(0, 3)}
                              </text>
                            </g>
                          );
                        })}
                        
                        {/* Plot planets */}
                        {Object.entries(chart.json_payload.planets).map(([planet, data]) => {
                          if (!data) return null;
                          
                          // Convert longitude to angle (0° = Aries start = top of wheel, clockwise)
                          const planetAngle = (data.longitude - 90) * (Math.PI / 180);
                          const radius = 110; // Distance from center
                          const x = 200 + radius * Math.cos(planetAngle);
                          const y = 200 + radius * Math.sin(planetAngle);
                          
                          const planetEmojis: Record<string, string> = {
                            sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
                            mars: '♂', jupiter: '♃', saturn: '♄',
                            uranus: '♅', neptune: '♆', pluto: '♇',
                            rahu: '☊', ketu: '☋'
                          };
                          
                          return (
                            <g key={planet}>
                              {/* Planet line from center */}
                              <line 
                                x1="200" 
                                y1="200" 
                                x2={x} 
                                y2={y} 
                                stroke="#fbbf24" 
                                strokeWidth="1.5" 
                                opacity="0.5"
                              />
                              {/* Planet circle background */}
                              <circle 
                                cx={x} 
                                cy={y} 
                                r="12" 
                                fill="#1e1b4b" 
                                stroke="#fbbf24" 
                                strokeWidth="2"
                              />
                              {/* Planet symbol */}
                              <text 
                                x={x} 
                                y={y} 
                                fill="#fbbf24" 
                                fontSize="14" 
                                fontWeight="bold"
                                textAnchor="middle" 
                                dominantBaseline="middle"
                                title={`${planet}: ${data.longitude.toFixed(2)}°`}
                              >
                                {planetEmojis[planet] || planet.charAt(0).toUpperCase()}
                              </text>
                              {/* Retrograde indicator */}
                              {data.retrograde && (
                                <text 
                                  x={x + 15} 
                                  y={y - 10} 
                                  fill="#ef4444" 
                                  fontSize="10" 
                                  fontWeight="bold"
                                >
                                  R
                                </text>
                              )}
                            </g>
                          );
                        })}
                        
                        {/* Ascendant marker (horizon line) */}
                        <g>
                          <line 
                            x1="40" 
                            y1="200" 
                            x2="360" 
                            y2="200" 
                            stroke="#22d3ee" 
                            strokeWidth="2" 
                            strokeDasharray="5,5"
                          />
                          <text 
                            x="370" 
                            y="200" 
                            fill="#22d3ee" 
                            fontSize="12" 
                            fontWeight="bold"
                            dominantBaseline="middle"
                          >
                            ASC
                          </text>
                        </g>
                        
                        {/* MC marker (vertical line) */}
                        <g>
                          <line 
                            x1="200" 
                            y1="40" 
                            x2="200" 
                            y2="360" 
                            stroke="#a78bfa" 
                            strokeWidth="2" 
                            strokeDasharray="5,5" 
                            opacity="0.5"
                          />
                          <text 
                            x="200" 
                            y="30" 
                            fill="#a78bfa" 
                            fontSize="12" 
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            MC
                          </text>
                        </g>
                        
                        {/* Center label */}
                        <text 
                          x="200" 
                          y="200" 
                          fill="#e9d5ff" 
                          fontSize="10" 
                          fontWeight="bold"
                          textAnchor="middle" 
                          dominantBaseline="middle"
                        >
                          NATAL
                        </text>
                      </svg>
                      
                      {/* Legend below chart */}
                      <div className="mt-4 p-4 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <div className="font-semibold text-cyan-400 mb-2">Chart Elements</div>
                            <div className="text-slate-400 space-y-1">
                              <div>• ASC line = Ascendant (Rising Sign)</div>
                              <div>• MC line = Midheaven</div>
                              <div>• Yellow = Planets</div>
                              <div>• R = Retrograde</div>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-purple-400 mb-2">Reading Guide</div>
                            <div className="text-slate-400 space-y-1">
                              <div>• Signs go clockwise from Aries</div>
                              <div>• Planets shown at exact degrees</div>
                              <div>• Inner rings show houses</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Professional Legend and Chart Details */}
                  <div className="mt-8 space-y-4">
                    {/* Main Chart Info - Big 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                        <div className="text-xs text-purple-300 font-semibold uppercase tracking-wider mb-2">Ascendant (Lagna)</div>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getZodiacEmoji(getSignFromLongitude(chart.json_payload.ascendant).sign)}</span>
                          <div>
                            <div className="text-white font-bold text-xl">{getSignFromLongitude(chart.json_payload.ascendant).sign}</div>
                            <div className="text-slate-400 text-sm">{getSignFromLongitude(chart.json_payload.ascendant).degree.toFixed(2)}°</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-br from-pink-600/20 to-pink-800/20 backdrop-blur-sm rounded-xl border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20">
                        <div className="text-xs text-pink-300 font-semibold uppercase tracking-wider mb-2">Moon Sign (Rashi)</div>
                        <div className="flex items-center gap-3">
                          {chart.json_payload.planets.moon && (
                            <>
                              <span className="text-3xl">{getZodiacEmoji(getSignFromLongitude(chart.json_payload.planets.moon.longitude).sign)}</span>
                              <div>
                                <div className="text-white font-bold text-xl">{getSignFromLongitude(chart.json_payload.planets.moon.longitude).sign}</div>
                                <div className="text-slate-400 text-sm">{getSignFromLongitude(chart.json_payload.planets.moon.longitude).degree.toFixed(2)}°</div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                        <div className="text-xs text-blue-300 font-semibold uppercase tracking-wider mb-2">Sun Sign (Surya)</div>
                        <div className="flex items-center gap-3">
                          {chart.json_payload.planets.sun && (
                            <>
                              <span className="text-3xl">{getZodiacEmoji(getSignFromLongitude(chart.json_payload.planets.sun.longitude).sign)}</span>
                              <div>
                                <div className="text-white font-bold text-xl">{getSignFromLongitude(chart.json_payload.planets.sun.longitude).sign}</div>
                                <div className="text-slate-400 text-sm">{getSignFromLongitude(chart.json_payload.planets.sun.longitude).degree.toFixed(2)}°</div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Professional Reading Instructions */}
                    <div className="p-5 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-600/50">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">📖</span>
                        <div className="flex-1">
                          <div className="font-bold text-white text-lg mb-3">Chart Reading Guide</div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="font-semibold text-purple-300 mb-2">🏠 House System</div>
                              <ul className="text-xs text-slate-400 space-y-1">
                                <li>• Start from "Lg" (Lagna/Ascendant)</li>
                                <li>• Count counterclockwise: 1→2→3...</li>
                                <li>• Each house represents life areas</li>
                              </ul>
                            </div>
                            <div>
                              <div className="font-semibold text-pink-300 mb-2">🪐 Planet Codes</div>
                              <ul className="text-xs text-slate-400 space-y-1">
                                <li>• Su=Sun, Mo=Moon, Me=Mercury</li>
                                <li>• Ve=Venus, Ma=Mars, Ju=Jupiter</li>
                                <li>• Sa=Saturn, Ra=Rahu, Ke=Ketu</li>
                                <li>• ℞ symbol = Retrograde motion</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'planets' && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-8">Planetary Positions</h2>
              <div className="grid gap-4">
                {Object.entries(chart.json_payload.planets).map(([planet, data]) => {
                  if (!data) return null;
                  const signData = getSignFromLongitude(data.longitude);
                  const house = getHouseForPlanet(data.longitude, chart.json_payload.houses);
                  const nakshatra = chart.system === 'vedic' ? getNakshatraName(data.longitude) : null;
                  
                  return (
                    <div
                      key={planet}
                      className="group bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm rounded-2xl p-5 hover:from-slate-600/40 hover:to-slate-700/40 transition-all duration-300 border border-slate-600/50 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{getPlanetEmoji(planet)}</div>
                          <div>
                            <div className="text-white font-semibold text-lg flex items-center gap-2">
                              {planet.charAt(0).toUpperCase() + planet.slice(1)}
                              {data.retrograde && <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full font-bold">R</span>}
                            </div>
                            {nakshatra && (
                              <div className="text-sm text-purple-300">Nakshatra: {nakshatra}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">
                            {getZodiacEmoji(signData.sign)} {signData.sign} {signData.degree.toFixed(2)}°
                          </div>
                          <div className="text-sm text-slate-400">House {house}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'houses' && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-8">House Cusps</h2>
              <div className="grid gap-4">
                {chart.json_payload.houses.map((houseLongitude, index) => {
                  const houseSign = getSignFromLongitude(houseLongitude);
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm rounded-2xl p-5 hover:from-slate-600/40 hover:to-slate-700/40 transition-all duration-300 border border-slate-600/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-white font-semibold text-lg">House {index + 1}</div>
                        <div className="text-white font-bold text-lg">
                          {getZodiacEmoji(houseSign.sign)} {houseSign.sign} {houseSign.degree.toFixed(2)}°
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'yogas' && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-8">Yogas & Combinations</h2>
              {chart.json_payload.yogas && chart.json_payload.yogas.length > 0 ? (
                <div className="grid gap-5">
                  {chart.json_payload.yogas.map((yoga, idx) => {
                    if (!yoga || !yoga.name) return null;
                    return (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-purple-600/20 via-purple-700/15 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-white font-bold text-xl flex items-center gap-2">
                          <span className="text-2xl">✨</span> {yoga.name}
                        </div>
                        <div className="flex gap-2">
                          {yoga.category && (
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                            {yoga.category}
                          </span>
                          )}
                          {yoga.strength && (
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            yoga.strength === 'strong' 
                              ? 'bg-green-500/20 text-green-300'
                              : yoga.strength === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {yoga.strength}
                          </span>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{yoga.description || 'No description available'}</p>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">✨</div>
                  <p className="text-slate-400 text-lg">No yogas detected in this chart</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'aspects' && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-8">Planetary Aspects</h2>
              {chart.json_payload.aspects && chart.json_payload.aspects.length > 0 ? (
                <div className="grid gap-4">
                  {chart.json_payload.aspects.map((aspect, idx) => {
                    if (!aspect || !aspect.planet1 || !aspect.planet2) return null;
                    return (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-600/50 hover:from-slate-600/40 hover:to-slate-700/40 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{getPlanetEmoji(aspect.planet1)}</div>
                          <div className="text-slate-400">→</div>
                          <div className="text-xl">{getPlanetEmoji(aspect.planet2)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">
                            {aspect.planet1.charAt(0).toUpperCase() + aspect.planet1.slice(1)} {aspect.aspect} {aspect.planet2.charAt(0).toUpperCase() + aspect.planet2.slice(1)}
                          </div>
                          <div className="text-sm text-slate-400">
                            {aspect.angle?.toFixed(1) || 0}° (orb: {aspect.orb?.toFixed(1) || 0}°)
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🌠</div>
                  <p className="text-slate-400 text-lg">No aspects found in this chart</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'dashas' && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-8">Vimshottari Dasha</h2>
              {chart.json_payload.vimshottari_dasha ? (
                <div className="space-y-6">
                  {chart.json_payload.vimshottari_dasha.current_mahadasha && (
                    <div className="p-6 bg-gradient-to-br from-purple-600/20 via-purple-700/20 to-purple-800/20 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                      <div className="text-sm text-purple-300 font-semibold uppercase tracking-wider mb-3">Current Mahadasha</div>
                      <div className="text-2xl font-bold text-white mb-3">
                        {chart.json_payload.vimshottari_dasha.current_mahadasha.lord}
                      </div>
                      <div className="text-sm text-slate-300">
                        {new Date(chart.json_payload.vimshottari_dasha.current_mahadasha.start_date).toLocaleDateString()} - {new Date(chart.json_payload.vimshottari_dasha.current_mahadasha.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  
                  {chart.json_payload.vimshottari_dasha.current_antardasha && (
                    <div className="p-6 bg-gradient-to-br from-pink-600/20 via-pink-700/20 to-pink-800/20 rounded-2xl border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20">
                      <div className="text-sm text-pink-300 font-semibold uppercase tracking-wider mb-3">Current Antardasha</div>
                      <div className="text-2xl font-bold text-white mb-3">
                        {chart.json_payload.vimshottari_dasha.current_antardasha.lord}
                      </div>
                      <div className="text-sm text-slate-300">
                        {new Date(chart.json_payload.vimshottari_dasha.current_antardasha.start_date).toLocaleDateString()} - {new Date(chart.json_payload.vimshottari_dasha.current_antardasha.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-slate-400 text-lg">Dasha calculations not available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'shadbala' && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-8">Shadbala (Planetary Strength)</h2>
              {chart.json_payload.shadbala ? (
                <div className="grid gap-5">
                  {Object.entries(chart.json_payload.shadbala).map(([planet, strengths]: [string, any]) => (
                    <div
                      key={planet}
                      className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 hover:from-slate-600/40 hover:to-slate-700/40 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
                    >
                      <div className="flex items-center gap-4 mb-5">
                        <div className="text-3xl">{getPlanetEmoji(planet)}</div>
                        <div>
                          <div className="text-white font-bold text-xl">
                            {planet.charAt(0).toUpperCase() + planet.slice(1)}
                          </div>
                          <div className="text-sm text-purple-300 font-semibold">
                            Total: {strengths.total?.toFixed(2) || 'N/A'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700/50">
                          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Positional</div>
                          <div className="text-white font-bold text-lg">{strengths.positional?.toFixed(2) || 'N/A'}</div>
                        </div>
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="text-xs text-slate-400">Directional</div>
                          <div className="text-white font-medium">{strengths.directional?.toFixed(2) || 'N/A'}</div>
                        </div>
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="text-xs text-slate-400">Temporal</div>
                          <div className="text-white font-medium">{strengths.temporal?.toFixed(2) || 'N/A'}</div>
                        </div>
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="text-xs text-slate-400">Motional</div>
                          <div className="text-white font-medium">{strengths.motional?.toFixed(2) || 'N/A'}</div>
                        </div>
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="text-xs text-slate-400">Natural</div>
                          <div className="text-white font-medium">{strengths.natural?.toFixed(2) || 'N/A'}</div>
                        </div>
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="text-xs text-slate-400">Aspectual</div>
                          <div className="text-white font-medium">{strengths.aspectual?.toFixed(2) || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">⚖️</div>
                  <p className="text-slate-400 text-lg">Shadbala calculations not available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
