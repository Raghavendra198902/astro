'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, Plus, Calendar, Download, Eye, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/contexts/language.context';
import { dashboardTranslations } from '@/lib/translations/dashboard.translations';

export default function ChartsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = dashboardTranslations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const charts = [
    {
      id: 1,
      name: 'Birth Chart - Vedic',
      type: 'Vedic (North Indian)',
      date: '2024-11-10',
      birthDate: '09/07/1978',
      location: 'Aurangabad, Maharashtra, India',
    },
    {
      id: 2,
      name: 'Transit Analysis',
      type: 'Western',
      date: '2024-11-08',
      birthDate: '09/07/1978',
      location: 'Aurangabad, Maharashtra, India',
    },
    {
      id: 3,
      name: 'Compatibility Report',
      type: 'Kundali Milan',
      date: '2024-11-05',
      birthDate: '09/07/1978',
      location: 'Aurangabad, Maharashtra, India',
    },
    {
      id: 4,
      name: 'Dasha Analysis',
      type: 'Vedic (South Indian)',
      date: '2024-11-01',
      birthDate: '09/07/1978',
      location: 'Aurangabad, Maharashtra, India',
    },
  ];

  // Filter charts based on search and filter type
  const filteredCharts = charts.filter(chart => {
    const matchesSearch = chart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chart.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chart.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'vedic' && chart.type.includes('Vedic')) ||
                         (filterType === 'western' && chart.type.includes('Western')) ||
                         (filterType === 'compatibility' && chart.type.includes('Kundali'));
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Premium Header with Animation */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 dark:from-violet-700 dark:via-purple-700 dark:to-indigo-800 p-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff33_1px,transparent_1px),linear-gradient(to_bottom,#ffffff33_1px,transparent_1px)] bg-[size:40px_40px] animate-[grid_20s_linear_infinite]"></div>
        </div>
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className={`transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center hover:rotate-12 hover:scale-110 transition-all duration-300">
                <BarChart3 className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl font-bold text-white">
                {t.myCharts || 'My Charts'}
              </h1>
            </div>
            <p className="text-white/80 text-lg ml-15">{t.viewManageCharts || 'View and manage all your astrological charts'}</p>
          </div>
          <Link
            href="/dashboard/charts/new"
            className={`group px-6 py-3.5 bg-white hover:bg-gray-50 text-violet-700 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2 ${mounted ? 'opacity-100 translate-x-0 animate-bounce-subtle' : 'opacity-0 translate-x-8'}`}
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            {t.generateNewChart || 'New Chart'}
          </Link>
        </div>
      </div>

      {/* Premium Search and Filter Bar with Animation */}
      <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-all duration-700 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Search className="w-5 h-5" strokeWidth={2} />
            </div>
            <input
              type="text"
              placeholder={t.searchCharts || 'Search charts...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              <Filter className="w-5 h-5" strokeWidth={2} />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 outline-none transition-all appearance-none cursor-pointer min-w-[200px] text-gray-900 dark:text-white font-medium"
            >
              <option value="all">All Charts</option>
              <option value="vedic">Vedic Charts</option>
              <option value="western">Western Charts</option>
              <option value="compatibility">Compatibility</option>
            </select>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-4 px-4 py-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg inline-block">
          <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
            Showing {filteredCharts.length} of {charts.length} charts
          </span>
        </div>
      </div>

      {/* Premium Charts Grid with Stagger Animation */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredCharts.map((chart, index) => (
          <div
            key={chart.id}
            style={{ animationDelay: `${(index + 3) * 100}ms` }}
            className={`group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:border-transparent hover:shadow-2xl hover:shadow-violet-500/10 dark:hover:shadow-violet-500/20 transition-all duration-500 overflow-hidden hover:-translate-y-2 cursor-pointer ${mounted ? 'opacity-100 translate-y-0 animate-fade-in-up' : 'opacity-0 translate-y-4'}`}
          >
            {/* Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">{chart.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-semibold group-hover:scale-110 transition-transform duration-300">
                        {chart.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span>{chart.date}</span>
                      <span className="text-gray-400">•</span>
                      <span>{chart.birthDate}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 flex items-start gap-1">
                      <span className="mt-0.5">📍</span>
                      {chart.location}
                    </p>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-violet-500/50">
                  <BarChart3 className="w-8 h-8 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                </div>
              </div>

              {/* Premium Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => router.push(`/dashboard/charts/${chart.id}`)}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/50 flex items-center justify-center gap-2 duration-300"
                >
                  <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  View
                </button>
                <button 
                  onClick={() => toast.success('PDF download started! 📄')}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-semibold transition-all hover:scale-105 duration-300 flex items-center justify-center gap-2"
                  aria-label="Download PDF"
                >
                  <Download className="w-4 h-4 hover:animate-bounce" />
                  PDF
                </button>
                <button 
                  onClick={() => toast.error('Chart deleted')}
                  className="px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl font-semibold transition-all hover:scale-105 duration-300 flex items-center justify-center"
                  aria-label="Delete chart"
                >
                  <Trash2 className="w-4 h-4 hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Empty State */}
      {filteredCharts.length === 0 && (
        <div className="relative overflow-hidden text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-3xl mb-6 shadow-lg">
              <Search className="w-12 h-12 text-violet-600 dark:text-violet-400" strokeWidth={2} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">No charts found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
