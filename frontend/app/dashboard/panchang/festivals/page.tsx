'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, PartyPopper, Star, Search, Filter, Clock, MapPin, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock festival data - in production, this would come from the backend API
const mockFestivals = [
  { id: 1, name: 'Makar Sankranti', date: '2025-01-14', type: 'Solar', significance: 'Harvest Festival', description: 'Marks the transition of the Sun into Capricorn', location: 'Pan-India', muhurat: '07:15 AM' },
  { id: 2, name: 'Vasant Panchami', date: '2025-02-03', type: 'Lunar', significance: 'Spring Festival', description: 'Celebrates the arrival of spring and Goddess Saraswati', location: 'North India', muhurat: '06:30 AM' },
  { id: 3, name: 'Maha Shivaratri', date: '2025-02-26', type: 'Lunar', significance: 'Lord Shiva', description: 'Great Night of Lord Shiva', location: 'Pan-India', muhurat: '12:00 AM' },
  { id: 4, name: 'Holi', date: '2025-03-14', type: 'Lunar', significance: 'Color Festival', description: 'Festival of colors celebrating spring', location: 'Pan-India', muhurat: '06:15 AM' },
  { id: 5, name: 'Ugadi / Gudi Padwa', date: '2025-03-30', type: 'Lunar', significance: 'New Year', description: 'Hindu New Year celebrated in Karnataka, Maharashtra', location: 'South/West India', muhurat: '06:00 AM' },
  { id: 6, name: 'Ram Navami', date: '2025-04-06', type: 'Lunar', significance: 'Lord Rama', description: 'Birth anniversary of Lord Rama', location: 'Pan-India', muhurat: '11:00 AM' },
  { id: 7, name: 'Akshaya Tritiya', date: '2025-04-30', type: 'Lunar', significance: 'Auspicious Day', description: 'Considered highly auspicious for new beginnings', location: 'Pan-India', muhurat: '06:00 AM - 06:00 PM' },
  { id: 8, name: 'Buddha Purnima', date: '2025-05-12', type: 'Lunar', significance: 'Buddha', description: 'Birth anniversary of Gautama Buddha', location: 'Pan-India', muhurat: '05:30 AM' },
  { id: 9, name: 'Jagannath Rath Yatra', date: '2025-06-29', type: 'Lunar', significance: 'Lord Jagannath', description: 'Grand chariot festival', location: 'Puri, Odisha', muhurat: '02:00 PM' },
  { id: 10, name: 'Guru Purnima', date: '2025-07-10', type: 'Lunar', significance: 'Teachers', description: 'Day to honor spiritual teachers', location: 'Pan-India', muhurat: '06:00 AM' },
  { id: 11, name: 'Raksha Bandhan', date: '2025-08-09', type: 'Lunar', significance: 'Sibling Bond', description: 'Celebrates brother-sister relationship', location: 'Pan-India', muhurat: '09:00 AM - 09:00 PM' },
  { id: 12, name: 'Janmashtami', date: '2025-08-16', type: 'Lunar', significance: 'Lord Krishna', description: 'Birth anniversary of Lord Krishna', location: 'Pan-India', muhurat: '12:00 AM' },
  { id: 13, name: 'Ganesh Chaturthi', date: '2025-08-27', type: 'Lunar', significance: 'Lord Ganesha', description: 'Birth of Lord Ganesha', location: 'Pan-India', muhurat: '11:00 AM' },
  { id: 14, name: 'Navratri (Starts)', date: '2025-09-22', type: 'Lunar', significance: 'Goddess Durga', description: 'Nine nights dedicated to Goddess Durga', location: 'Pan-India', muhurat: '06:00 AM' },
  { id: 15, name: 'Dussehra', date: '2025-10-02', type: 'Lunar', significance: 'Victory', description: 'Victory of good over evil', location: 'Pan-India', muhurat: '02:00 PM' },
  { id: 16, name: 'Karwa Chauth', date: '2025-10-17', type: 'Lunar', significance: 'Marriage', description: 'Fasting for husband\'s long life', location: 'North India', muhurat: '06:30 PM' },
  { id: 17, name: 'Dhan Teras', date: '2025-10-29', type: 'Lunar', significance: 'Wealth', description: 'First day of Diwali, worship of wealth', location: 'Pan-India', muhurat: '06:00 PM' },
  { id: 18, name: 'Diwali', date: '2025-10-31', type: 'Lunar', significance: 'Light Festival', description: 'Festival of lights celebrating victory of light', location: 'Pan-India', muhurat: '06:00 PM' },
  { id: 19, name: 'Govardhan Puja', date: '2025-11-01', type: 'Lunar', significance: 'Lord Krishna', description: 'Day after Diwali, worship of Govardhan Hill', location: 'Pan-India', muhurat: '06:00 AM' },
  { id: 20, name: 'Bhai Dooj', date: '2025-11-02', type: 'Lunar', significance: 'Sibling Bond', description: 'Similar to Raksha Bandhan', location: 'Pan-India', muhurat: '01:00 PM' },
  { id: 21, name: 'Chhath Puja', date: '2025-11-06', type: 'Solar', significance: 'Sun God', description: 'Worship of Sun God', location: 'Bihar, UP', muhurat: '06:00 AM' },
  { id: 22, name: 'Guru Nanak Jayanti', date: '2025-11-15', type: 'Lunar', significance: 'Sikh Guru', description: 'Birth anniversary of Guru Nanak Dev', location: 'Pan-India', muhurat: '04:00 AM' },
  { id: 23, name: 'Vivah Panchami', date: '2025-12-05', type: 'Lunar', significance: 'Marriage', description: 'Wedding anniversary of Lord Rama and Sita', location: 'Pan-India', muhurat: '11:00 AM' },
  { id: 24, name: 'Gita Jayanti', date: '2025-12-11', type: 'Lunar', significance: 'Scripture', description: 'Day when Bhagavad Gita was revealed', location: 'Pan-India', muhurat: '06:00 AM' },
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function FestivalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear] = useState(2025);

  // Filter festivals
  const filteredFestivals = mockFestivals.filter(festival => {
    const matchesSearch = festival.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         festival.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth = selectedMonth === null || new Date(festival.date).getMonth() === selectedMonth;
    const matchesType = selectedType === null || festival.type === selectedType;
    return matchesSearch && matchesMonth && matchesType;
  });

  // Group festivals by month
  const festivalsByMonth = filteredFestivals.reduce((acc, festival) => {
    const month = new Date(festival.date).getMonth();
    if (!acc[month]) acc[month] = [];
    acc[month].push(festival);
    return acc;
  }, {} as Record<number, typeof mockFestivals>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/panchang"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Panchang
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
                <PartyPopper className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  Hindu Festivals Calendar 2025
                </h1>
                <p className="text-gray-400 mt-1">Discover auspicious dates and celebrations throughout the year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search festivals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Month Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedMonth ?? ''}
                onChange={(e) => setSelectedMonth(e.target.value === '' ? null : parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                <option value="">All Months</option>
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Star className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedType ?? ''}
                onChange={(e) => setSelectedType(e.target.value === '' ? null : e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                <option value="">All Types</option>
                <option value="Lunar">Lunar Festival</option>
                <option value="Solar">Solar Festival</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedMonth !== null || selectedType !== null) && (
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-gray-400">Active filters:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedMonth !== null && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  {months[selectedMonth]}
                </span>
              )}
              {selectedType && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  {selectedType}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMonth(null);
                  setSelectedType(null);
                }}
                className="text-sm text-purple-400 hover:text-purple-300 ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Festivals</p>
                <p className="text-3xl font-bold text-white mt-1">{filteredFestivals.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-purple-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Lunar Festivals</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {filteredFestivals.filter(f => f.type === 'Lunar').length}
                </p>
              </div>
              <Star className="w-12 h-12 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Solar Festivals</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {filteredFestivals.filter(f => f.type === 'Solar').length}
                </p>
              </div>
              <Sparkles className="w-12 h-12 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Festivals List by Month */}
        {Object.keys(festivalsByMonth).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(festivalsByMonth)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([month, festivals]) => (
                <div key={month}>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Calendar className="w-6 h-6 mr-3 text-purple-400" />
                    {months[parseInt(month)]} {currentYear}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {festivals.map((festival) => (
                      <div
                        key={festival.id}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1">{festival.name}</h3>
                            <div className="flex items-center space-x-3 text-sm text-gray-400">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(festival.date).toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                festival.type === 'Lunar' 
                                  ? 'bg-yellow-500/20 text-yellow-300' 
                                  : 'bg-orange-500/20 text-orange-300'
                              }`}>
                                {festival.type}
                              </span>
                            </div>
                          </div>
                          <PartyPopper className="w-8 h-8 text-purple-400 flex-shrink-0" />
                        </div>

                        <p className="text-gray-300 mb-4">{festival.description}</p>

                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                            <span className="text-gray-400">Significance:</span>
                            <span className="text-white ml-2">{festival.significance}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                            <span className="text-gray-400">Region:</span>
                            <span className="text-white ml-2">{festival.location}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                            <span className="text-gray-400">Muhurat:</span>
                            <span className="text-white ml-2">{festival.muhurat}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No festivals found matching your filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedMonth(null);
                setSelectedType(null);
              }}
              className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Note */}
        <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
          <h3 className="text-lg font-bold text-blue-300 mb-2 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Important Note
          </h3>
          <p className="text-blue-200 text-sm">
            Festival dates are calculated based on lunar calendar and may vary by 1-2 days based on your location. 
            Muhurat timings are approximate and should be confirmed with a local astrologer for precise rituals. 
            For personalized muhurat calculation, visit the <Link href="/dashboard/panchang" className="underline">Panchang page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
