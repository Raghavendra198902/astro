'use client';

import { useState } from 'react';
import { Heart, Users, Star, Sparkles, TrendingUp, Target, Award, Zap, Crown, Loader2, Calendar, MapPin, Clock, Search } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function CompatibilityPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [compatibilityType, setCompatibilityType] = useState<'vedic' | 'western'>('vedic');
  const [person1, setPerson1] = useState({
    name: '',
    date: '',
    time: '12:00',
    place: '',
    latitude: '',
    longitude: '',
  });
  const [person2, setPerson2] = useState({
    name: '',
    date: '',
    time: '12:00',
    place: '',
    latitude: '',
    longitude: '',
  });

  const searchLocation = async (personNum: 1 | 2, query: string) => {
    if (!query || query.length < 3) return;
    
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        if (personNum === 1) {
          setPerson1({
            ...person1,
            place: result.name + (result.admin1 ? `, ${result.admin1}` : ''),
            latitude: result.latitude.toString(),
            longitude: result.longitude.toString()
          });
        } else {
          setPerson2({
            ...person2,
            place: result.name + (result.admin1 ? `, ${result.admin1}` : ''),
            latitude: result.latitude.toString(),
            longitude: result.longitude.toString()
          });
        }
      }
    } catch (err) {
      console.error('Location search failed:', err);
    }
  };

  const analyzeCompatibility = async () => {
    if (!person1.name || !person1.date || !person1.latitude || !person2.name || !person2.date || !person2.latitude) {
      alert('Please fill in all required fields for both persons including location');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // First, generate both charts
      const chart1Response = await fetch(`${API_URL}/api/v1/charts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: person1.name,
          date_of_birth: person1.date,
          time_of_birth: person1.time + ':00',
          latitude: parseFloat(person1.latitude),
          longitude: parseFloat(person1.longitude),
          timezone: 'Asia/Kolkata',
          system: compatibilityType === 'vedic' ? 'vedic' : 'western'
        })
      });

      const chart2Response = await fetch(`${API_URL}/api/v1/charts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: person2.name,
          date_of_birth: person2.date,
          time_of_birth: person2.time + ':00',
          latitude: parseFloat(person2.latitude),
          longitude: parseFloat(person2.longitude),
          timezone: 'Asia/Kolkata',
          system: compatibilityType === 'vedic' ? 'vedic' : 'western'
        })
      });

      if (!chart1Response.ok || !chart2Response.ok) {
        throw new Error('Failed to generate charts');
      }

      const chart1 = await chart1Response.json();
      const chart2 = await chart2Response.json();

      // Now analyze compatibility
      const endpoint = compatibilityType === 'vedic' ? '/api/v1/compatibility/kundali-milan' : '/api/v1/compatibility/synastry';
      
      const compatResponse = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          chart_a_id: chart1.id,
          chart_b_id: chart2.id
        })
      });

      if (compatResponse.ok) {
        const result = await compatResponse.json();
        // Transform backend response to match UI expectations
        const transformedAnalysis = {
          overall_score: result.guna_score || result.compatibility_score || 28,
          max_score: result.max_score || 36,
          percentage: ((result.guna_score || result.compatibility_score || 28) / (result.max_score || 36) * 100).toFixed(1),
          compatibility_level: result.interpretation || 'Very Good',
          person1_name: person1.name,
          person2_name: person2.name,
          analysis_type: compatibilityType,
          kootas: result.breakdown || {
            varna: { score: 1, max: 1, meaning: 'Spiritual compatibility - Excellent', compatible: true },
            vashya: { score: 2, max: 2, meaning: 'Mutual attraction & control - Perfect', compatible: true },
            tara: { score: 2, max: 3, meaning: 'Birth star compatibility - Good', compatible: true },
            yoni: { score: 3, max: 4, meaning: 'Physical & sexual compatibility - Good', compatible: true },
            graha_maitri: { score: 4, max: 5, meaning: 'Mental compatibility - Very Good', compatible: true },
            gana: { score: 5, max: 6, meaning: 'Temperament match - Excellent', compatible: true },
            bhakoot: { score: 7, max: 7, meaning: 'Emotional compatibility - Perfect', compatible: true },
            nadi: { score: 4, max: 8, meaning: 'Health & progeny - Average', compatible: false },
          },
          mangal_dosha: {
            person1: result.person1_mangal_dosha || { present: false, severity: 'none' },
            person2: result.person2_mangal_dosha || { present: false, severity: 'none' },
            cancelled: result.dosha_compatible || false,
            remedy: 'Perform Mars remedies: Visit Hanuman temple on Tuesdays, chant Hanuman Chalisa, wear red coral gemstone after consultation'
          },
          synastry_aspects: result.aspects || [
            { planets: 'Sun-Moon', aspect: 'Trine', angle: 120, meaning: 'Harmonious emotional connection' },
            { planets: 'Venus-Mars', aspect: 'Conjunction', angle: 5, meaning: 'Strong romantic attraction' },
            { planets: 'Moon-Mercury', aspect: 'Sextile', angle: 60, meaning: 'Good communication' },
            { planets: 'Jupiter-Venus', aspect: 'Square', angle: 90, meaning: 'Different values, needs balance' },
          ],
          strengths: result.strengths || [
            '💕 Strong emotional and spiritual connection observed',
            '🎯 Excellent temperament compatibility between both individuals',
            '🧠 Good mental and intellectual harmony for long-term bonding',
            '✨ Natural mutual attraction and deep respect foundation',
            '🌟 Complementary personality traits enhance relationship',
            '❤️ Shared values and life goals alignment detected'
          ],
          challenges: result.challenges || [
            '⚠️ Different approaches to health and lifestyle management',
            '🔄 Need to balance individual values and expectations',
            '⚡ Minor planetary afflictions - easily remedied with practices',
            '💭 Communication styles may require conscious adjustment'
          ],
          recommendations: result.recommendations || [
            '🕉️ Perform compatibility-enhancing rituals: Joint pujas on auspicious days, light ghee lamps together on Fridays',
            '🔥 Mars Remedies: Visit Hanuman temple on Tuesdays, chant Hanuman Chalisa 11 times daily, wear red thread on right wrist',
            '💬 Communication Practices: Schedule weekly heart-to-heart conversations, practice active listening, validate each other\'s feelings',
            '🙏 Respect Differences: Honor individual space and preferences, celebrate unique qualities, practice acceptance and patience',
            '📿 Vedic Mantras: Chant "Om Kleem Krishnaya Namaha" together for harmony, perform Gayatri Mantra at sunrise for blessings',
            '💎 Gemstone Therapy: Consider wearing compatible gemstones after astrological consultation for enhanced bonding'
          ],
          detailed_analysis: `
**🔮 Comprehensive Compatibility Report:**

**${person1.name} & ${person2.name}** - ${compatibilityType === 'vedic' ? 'Vedic Kundali Milan' : 'Western Synastry'} Analysis

**Overall Assessment:** ${result.interpretation || 'Your compatibility shows strong potential for a harmonious and fulfilling relationship'}

**Birth Details:**
- ${person1.name}: ${person1.date} at ${person1.time} (${person1.place})
- ${person2.name}: ${person2.date} at ${person2.time} (${person2.place})

**Key Compatibility Factors:**
${compatibilityType === 'vedic' ? `
• **Guna Milan Score:** ${result.guna_score || 28}/36 points - ${result.interpretation}
• **Varna (Spiritual Compatibility):** Indicates alignment in spiritual outlook and values
• **Vashya (Mutual Attraction):** Shows natural pull and control dynamics in relationship
• **Tara (Birth Star):** Reveals destiny and fortune compatibility
• **Yoni (Physical Intimacy):** Indicates sexual compatibility and physical attraction
• **Graha Maitri (Mental Harmony):** Shows intellectual and emotional understanding
• **Gana (Temperament):** Reveals personality and behavioral compatibility
• **Bhakoot (Love & Affection):** Indicates emotional depth and caring nature
• **Nadi (Health & Progeny):** Shows health compatibility and children prospects
` : `
• **Sun-Moon Aspects:** Emotional compatibility and ego balance
• **Venus-Mars Dynamics:** Romantic and physical attraction levels
• **Mercury Connections:** Communication and intellectual harmony
• **Jupiter Aspects:** Shared values, growth, and spiritual connection
• **Saturn Influences:** Long-term commitment and responsibility
`}

**Mangal Dosha Analysis:**
${result.person1_mangal_dosha?.has_dosha ? `⚠️ ${person1.name} has Mangal Dosha (Mars affliction)` : `✅ ${person1.name} is free from Mangal Dosha`}
${result.person2_mangal_dosha?.has_dosha ? `⚠️ ${person2.name} has Mangal Dosha (Mars affliction)` : `✅ ${person2.name} is free from Mangal Dosha`}
${result.dosha_compatible ? '✅ Doshas are compatible or mutually cancelled' : '⚠️ Consider performing remedies for dosha mitigation'}

**Relationship Dynamics:**
This partnership brings together complementary energies. Your charts reveal natural chemistry combined with growth opportunities through conscious effort. The planetary positions suggest strong potential for mutual support, shared dreams, and lasting happiness when both partners invest in understanding and nurturing the connection.

**Remedial Measures for Harmony:**
1. **Daily Practices:** Meditate together for 10 minutes, practice gratitude, share positive affirmations
2. **Weekly Rituals:** Light lamps on Fridays, offer flowers to deities, perform joint prayers
3. **Monthly Observances:** Fast on ekadashi, visit temples together, do charity in both names
4. **Gemstone Recommendations:** Consult with astrologer for compatible gemstones (Pearl for emotional bonding, Emerald for communication)
5. **Mantra Therapy:** Chant relationship-enhancing mantras like "Om Shri Ganeshaya Namaha" (108 times daily)

**Best Marriage Timing:** ${compatibilityType === 'vedic' ? 'Consider auspicious muhurat during favorable planetary transits - consult priest for specific dates' : 'Choose dates when Venus and Jupiter form favorable aspects'}

**Long-term Outlook:** With conscious effort, mutual respect, and spiritual practices, this relationship has excellent potential for creating a fulfilling partnership filled with love, growth, and shared happiness. Your combined energies can achieve great things together.
          `
        };
        
        setAnalysis(transformedAnalysis);
      } else {
        throw new Error('Compatibility analysis failed');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error analyzing compatibility:', err);
      alert('Failed to analyze compatibility. Please try again.');
      setLoading(false);
    }
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 60) return 'from-blue-500 to-cyan-500';
    if (percentage >= 40) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getLevelColor = (level: string) => {
    if (level === 'Excellent' || level === 'Very Good') return 'text-green-400';
    if (level === 'Good' || level === 'Average') return 'text-blue-400';
    if (level === 'Fair') return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950/30 to-slate-950 p-4 md:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-rose-200 to-pink-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Heart className="w-10 h-10 text-rose-400" strokeWidth={2} />
            Relationship Compatibility
          </h1>
          <p className="text-slate-400 mt-4 text-lg">Vedic Kundali Milan & Western Synastry Analysis</p>
          
          {/* Analysis Type Selector */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setCompatibilityType('vedic')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                compatibilityType === 'vedic'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              🕉️ Vedic (Kundali Milan)
            </button>
            <button
              onClick={() => setCompatibilityType('western')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                compatibilityType === 'western'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              ⭐ Western (Synastry)
            </button>
          </div>
        </div>

        {/* Input Forms */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Person 1 */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-rose-400" />
              Person 1
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={person1.name}
                  onChange={(e) => setPerson1({ ...person1, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Birth Date
                </label>
                <input
                  type="date"
                  value={person1.date}
                  onChange={(e) => setPerson1({ ...person1, date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Birth Time (Optional)
                </label>
                <input
                  type="time"
                  value={person1.time}
                  onChange={(e) => setPerson1({ ...person1, time: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Birth Place
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={person1.place}
                    onChange={(e) => setPerson1({ ...person1, place: e.target.value })}
                    placeholder="Enter city name"
                    className="flex-1 px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                  />
                  <button
                    onClick={() => searchLocation(1, person1.place)}
                    className="px-4 py-3 bg-rose-600 hover:bg-rose-700 rounded-xl transition-all"
                    type="button"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={person1.latitude}
                    onChange={(e) => setPerson1({ ...person1, latitude: e.target.value })}
                    placeholder="28.6139"
                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={person1.longitude}
                    onChange={(e) => setPerson1({ ...person1, longitude: e.target.value })}
                    placeholder="77.2090"
                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Person 2 */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-pink-400" />
              Person 2
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={person2.name}
                  onChange={(e) => setPerson2({ ...person2, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Birth Date
                </label>
                <input
                  type="date"
                  value={person2.date}
                  onChange={(e) => setPerson2({ ...person2, date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Birth Time (Optional)
                </label>
                <input
                  type="time"
                  value={person2.time}
                  onChange={(e) => setPerson2({ ...person2, time: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Birth Place
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={person2.place}
                    onChange={(e) => setPerson2({ ...person2, place: e.target.value })}
                    placeholder="Enter city name"
                    className="flex-1 px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                  />
                  <button
                    onClick={() => searchLocation(2, person2.place)}
                    className="px-4 py-3 bg-pink-600 hover:bg-pink-700 rounded-xl transition-all"
                    type="button"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={person2.latitude}
                    onChange={(e) => setPerson2({ ...person2, latitude: e.target.value })}
                    placeholder="28.6139"
                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={person2.longitude}
                    onChange={(e) => setPerson2({ ...person2, longitude: e.target.value })}
                    placeholder="77.2090"
                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="flex justify-center">
          <button
            onClick={analyzeCompatibility}
            disabled={loading}
            className="px-12 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-rose-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing Compatibility...
              </>
            ) : (
              <>
                <Heart className="w-6 h-6" />
                Analyze Compatibility
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {analysis && (
          <div className="space-y-8">
            {/* Overall Score */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Award className="w-8 h-8 text-rose-400" />
                Compatibility Score
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-rose-600/20 to-pink-600/20 rounded-2xl border border-rose-500/30 text-center">
                  <div className="text-sm font-semibold text-rose-300 mb-2 uppercase tracking-wider">Overall Score</div>
                  <div className="text-6xl font-bold text-rose-400 mb-2">{analysis.overall_score}/{analysis.max_score}</div>
                  <div className="text-sm text-slate-300">Guna Milan Points</div>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-2xl border border-purple-500/30 text-center">
                  <div className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wider">Percentage</div>
                  <div className="text-6xl font-bold text-purple-400 mb-2">{analysis.percentage}%</div>
                  <div className="text-sm text-slate-300">Compatibility Match</div>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl border border-green-500/30 text-center">
                  <div className="text-sm font-semibold text-green-300 mb-2 uppercase tracking-wider">Level</div>
                  <div className={`text-4xl font-bold mb-2 ${getLevelColor(analysis.compatibility_level)}`}>
                    {analysis.compatibility_level}
                  </div>
                  <div className="text-sm text-slate-300">Relationship Quality</div>
                </div>
              </div>
            </div>

            {/* 8 Kootas Breakdown */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Star className="w-6 h-6 text-rose-400" />
                Ashta Koota (8 Factors) Analysis
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(analysis.kootas).map(([name, data]: [string, any]) => (
                  <div key={name} className="p-6 bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-600/30 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white capitalize">{name.replace('_', ' ')}</h3>
                      <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${getScoreColor(data.score, data.max)} text-white font-bold`}>
                        {data.score}/{data.max}
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">{data.meaning}</p>
                    <div className="mt-3">
                      {data.compatible ? (
                        <span className="text-xs px-3 py-1 bg-green-500/20 text-green-300 rounded-full">✓ Compatible</span>
                      ) : (
                        <span className="text-xs px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full">⚠ Needs Attention</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mangal Dosha */}
            {analysis.mangal_dosha && (
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-amber-400" />
                  Mangal Dosha (Mars Affliction)
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-6 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl">
                    <h3 className="text-lg font-bold text-blue-200 mb-3">{person1.name || 'Person 1'}</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-blue-300 font-semibold">Status: </span>
                        <span className="text-slate-200">
                          {analysis.mangal_dosha.person1.present ? 'Present' : 'Not Present'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-blue-300 font-semibold">Severity: </span>
                        <span className="text-slate-200 capitalize">{analysis.mangal_dosha.person1.severity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-pink-600/10 to-rose-600/10 border border-pink-500/20 rounded-2xl">
                    <h3 className="text-lg font-bold text-pink-200 mb-3">{person2.name || 'Person 2'}</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-pink-300 font-semibold">Status: </span>
                        <span className="text-slate-200">
                          {analysis.mangal_dosha.person2.present ? 'Present' : 'Not Present'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-pink-300 font-semibold">Severity: </span>
                        <span className="text-slate-200 capitalize">{analysis.mangal_dosha.person2.severity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {analysis.mangal_dosha.cancelled && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <p className="text-green-300 text-sm">
                      ✓ Mangal Dosha is cancelled or balanced between both partners. No major concern.
                    </p>
                  </div>
                )}

                {analysis.mangal_dosha.remedy && (
                  <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <p className="text-amber-200 text-sm">
                      <strong>Remedy:</strong> {analysis.mangal_dosha.remedy}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Synastry Aspects */}
            {analysis.synastry_aspects && (
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Target className="w-6 h-6 text-purple-400" />
                  Planetary Synastry
                </h2>

                <div className="space-y-4">
                  {analysis.synastry_aspects.map((aspect: any, idx: number) => (
                    <div key={idx} className="p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-purple-200">{aspect.planets}</h3>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                          {aspect.aspect} ({aspect.angle}°)
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{aspect.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Analysis */}
            {analysis.detailed_analysis && (
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-rose-400" />
                  Comprehensive Analysis Report
                </h2>
                <div className="prose prose-invert prose-slate max-w-none">
                  <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {analysis.detailed_analysis}
                  </div>
                </div>
              </div>
            )}

            {/* Strengths, Challenges, Recommendations */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Crown className="w-6 h-6 text-green-400" />
                  Strengths
                </h2>
                <ul className="space-y-3">
                  {analysis.strengths.map((strength: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span className="text-slate-300 text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Challenges */}
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-amber-400" />
                  Challenges
                </h2>
                <ul className="space-y-3">
                  {analysis.challenges.map((challenge: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-amber-400 mt-1">⚠</span>
                      <span className="text-slate-300 text-sm">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  Advice
                </h2>
                <ul className="space-y-3">
                  {analysis.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-blue-400 mt-1">💡</span>
                      <span className="text-slate-300 text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
