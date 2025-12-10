'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, Plus, Calendar, Download, Eye, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { chartsService, ChartResponse } from '@/lib/api';

export default function ChartsPage() {
  const router = useRouter();
  const [charts, setCharts] = useState<ChartResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadCharts();
  }, []);

  const loadCharts = async () => {
    try {
      const data = await chartsService.listCharts();
      setCharts(data);
    } catch (error: any) {
      toast.error(error.detail || 'Failed to load charts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (chartId: string) => {
    if (!confirm('Are you sure you want to delete this chart?')) return;
    
    try {
      await chartsService.deleteChart(chartId);
      toast.success('Chart deleted successfully');
      loadCharts();
    } catch (error: any) {
      toast.error(error.detail || 'Failed to delete chart');
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff33_1px,transparent_1px),linear-gradient(to_bottom,#ffffff33_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl font-bold text-white">My Charts</h1>
            </div>
            <p className="text-white/80 text-lg ml-15">View and manage all your astrological charts</p>
          </div>
          <Link
            href="/dashboard/charts/new"
            className="group px-6 py-3.5 bg-white hover:bg-gray-50 text-violet-700 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            New Chart
          </Link>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" strokeWidth={2} />
            </div>
            <input
              type="text"
              placeholder="Search charts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <label htmlFor="chart-filter" className="sr-only">Filter charts by type</label>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              <Filter className="w-5 h-5" strokeWidth={2} />
            </div>
            <select
              id="chart-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 outline-none transition-all appearance-none cursor-pointer min-w-[200px] text-gray-900 dark:text-white font-medium"
              aria-label="Filter charts by type"
            >
              <option value="all">All Charts</option>
              <option value="vedic">Vedic Charts</option>
              <option value="western">Western Charts</option>
            </select>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-4 px-4 py-2 bg-violet-50 rounded-lg inline-block">
          <span className="text-sm font-semibold text-violet-700">
            Showing {filteredCharts.length} of {charts.length} charts
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      {filteredCharts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No charts found</h3>
          <p className="text-gray-600 mb-6">Create your first astrological chart to get started</p>
          <Link
            href="/dashboard/charts/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Chart
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCharts.map((chart) => (
            <div
              key={chart.chart_id}
              className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:border-violet-500 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 overflow-hidden hover:-translate-y-2 cursor-pointer"
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-violet-600 transition-colors duration-300">
                      {chart.name || `${chart.system} Chart`}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold">
                          {chart.system}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(chart.birth_date).toLocaleDateString()}</span>
                        <span className="text-gray-400">•</span>
                        <span>{chart.birth_time}</span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-start gap-1">
                        <span className="mt-0.5">📍</span>
                        {chart.birthplace || `${chart.latitude}, ${chart.longitude}`}
                      </p>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                    <BarChart3 className="w-8 h-8 text-violet-600" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => router.push(`/dashboard/charts/${chart.chart_id}`)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 duration-300"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button 
                    onClick={() => handleDelete(chart.chart_id)}
                    className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold transition-all hover:scale-105 duration-300 flex items-center justify-center"
                    aria-label="Delete chart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
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
