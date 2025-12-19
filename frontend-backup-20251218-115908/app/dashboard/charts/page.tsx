'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Plus, 
  Calendar, 
  Download, 
  Eye, 
  Trash2, 
  Search, 
  Filter,
  Star,
  MapPin,
  Clock,
  User,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { API_URL } from '@/app/config';

interface Chart {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  location: string;
  system: 'vedic' | 'western';
  created_at: string;
}

export default function ChartsPage() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadCharts();
  }, []);

  const loadCharts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/charts/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setCharts(result.charts || []);
      }
    } catch (error) {
      console.error('Failed to load charts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (chartId: string) => {
    if (!confirm('Are you sure you want to delete this chart?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/v1/charts/${chartId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      loadCharts();
    } catch (error) {
      console.error('Failed to delete chart:', error);
    }
  };

  const filteredCharts = charts.filter(chart => {
    if (searchQuery && !chart.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterType !== 'all' && chart.system !== filterType) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Charts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 mb-8 shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff33_1px,transparent_1px),linear-gradient(to_bottom,#ffffff33_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>
          <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">My Charts <span className="text-yellow-300">(माझे कुंडली)</span></h1>
                  <p className="text-white/80 text-sm mt-1">View and manage all your astrological charts</p>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/charts/new"
              className="group px-6 py-3.5 bg-white hover:bg-gray-50 text-violet-700 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Create New Chart
            </Link>
          </div>

          {/* Stats */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-white" />
                <span className="text-white/70 text-sm">Total Charts</span>
              </div>
              <p className="text-3xl font-bold text-white">{charts.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-yellow-300" />
                <span className="text-white/70 text-sm">Vedic Charts</span>
              </div>
              <p className="text-3xl font-bold text-white">{charts.filter(c => c.system === 'vedic').length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-pink-300" />
                <span className="text-white/70 text-sm">Western Charts</span>
              </div>
              <p className="text-3xl font-bold text-white">{charts.filter(c => c.system === 'western').length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-white/70 text-sm">This Month</span>
              </div>
              <p className="text-3xl font-bold text-white">+{Math.floor(charts.length / 2)}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" strokeWidth={2} />
              </div>
              <input
                type="text"
                placeholder="Search charts by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Filter className="w-5 h-5" strokeWidth={2} />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-12 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition cursor-pointer appearance-none"
              >
                <option value="all" className="bg-slate-900">All Charts</option>
                <option value="vedic" className="bg-slate-900">Vedic Only</option>
                <option value="western" className="bg-slate-900">Western Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        {filteredCharts.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Charts Yet</h3>
            <p className="text-gray-400 mb-6">Create your first birth chart to get started</p>
            <Link
              href="/dashboard/charts/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition"
            >
              <Plus className="w-5 h-5" />
              Create First Chart
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharts.map((chart) => (
              <div
                key={chart.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group"
              >
                {/* Chart Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">{chart.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        chart.system === 'vedic' 
                          ? 'bg-orange-500/20 text-orange-300' 
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {chart.system === 'vedic' ? '🕉️ Vedic' : '⭐ Western'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chart Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">{chart.birth_date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4 text-pink-400" />
                    <span className="text-sm">{chart.birth_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">{chart.location}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <Link
                    href={`/dashboard/charts/${chart.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  <button
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(chart.id)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
