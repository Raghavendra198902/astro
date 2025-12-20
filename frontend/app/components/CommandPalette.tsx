'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, X, LayoutDashboard, User, TrendingUp, Calendar, Heart,
  Users, BarChart3, Star, Globe, BookOpen, Settings, Zap,
  Plus, Eye, Download, FileText, Clock, Target, Award, Shield,
  CreditCard, MessageSquare, HelpCircle, Command, ArrowRight, Hash
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'navigation' | 'action' | 'chart' | 'recent' | 'help';
  icon: any;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Define all available commands
  const allCommands: CommandItem[] = useMemo(() => [
    // Navigation Commands
    {
      id: 'nav-dashboard',
      title: 'Dashboard',
      subtitle: 'Go to main dashboard',
      category: 'navigation',
      icon: LayoutDashboard,
      action: () => { router.push('/dashboard'); onClose(); },
      keywords: ['home', 'main', 'overview']
    },
    {
      id: 'nav-charts',
      title: 'Birth Charts',
      subtitle: 'View and manage charts',
      category: 'navigation',
      icon: User,
      action: () => { router.push('/dashboard/charts'); onClose(); },
      keywords: ['chart', 'birth', 'natal', 'horoscope']
    },
    {
      id: 'nav-predictions',
      title: 'Predictions',
      subtitle: 'Get astrological predictions',
      category: 'navigation',
      icon: TrendingUp,
      action: () => { router.push('/dashboard/predictions'); onClose(); },
      keywords: ['forecast', 'future', 'predictions']
    },
    {
      id: 'nav-panchang',
      title: 'Panchang',
      subtitle: 'Daily panchang & muhurta',
      category: 'navigation',
      icon: Calendar,
      action: () => { router.push('/dashboard/panchang'); onClose(); },
      keywords: ['calendar', 'daily', 'muhurta', 'tithi']
    },
    {
      id: 'nav-compatibility',
      title: 'Compatibility',
      subtitle: 'Relationship analysis',
      category: 'navigation',
      icon: Heart,
      action: () => { router.push('/dashboard/compatibility'); onClose(); },
      keywords: ['love', 'relationship', 'match', 'synastry']
    },
    {
      id: 'nav-consultations',
      title: 'Consultations',
      subtitle: 'Book astrologer consultations',
      category: 'navigation',
      icon: Users,
      action: () => { router.push('/dashboard/consultations'); onClose(); },
      keywords: ['book', 'appointment', 'astrologer', 'consultation']
    },
    {
      id: 'nav-numerology',
      title: 'Numerology',
      subtitle: 'Numerology analysis',
      category: 'navigation',
      icon: Hash,
      action: () => { router.push('/dashboard/numerology'); onClose(); },
      keywords: ['numbers', 'numerology', 'life path']
    },
    {
      id: 'nav-life-events',
      title: 'Life Events',
      subtitle: 'Track important events',
      category: 'navigation',
      icon: BarChart3,
      action: () => { router.push('/dashboard/life-events'); onClose(); },
      keywords: ['events', 'timeline', 'history']
    },
    {
      id: 'nav-face-reading',
      title: 'Face Reading',
      subtitle: 'AI-powered face analysis',
      category: 'navigation',
      icon: Globe,
      action: () => { router.push('/dashboard/face-reading'); onClose(); },
      keywords: ['ai', 'face', 'reading', 'analysis']
    },
    {
      id: 'nav-palmistry',
      title: 'Palmistry',
      subtitle: 'Palm reading analysis',
      category: 'navigation',
      icon: Target,
      action: () => { router.push('/dashboard/palmistry'); onClose(); },
      keywords: ['palm', 'hand', 'reading']
    },
    {
      id: 'nav-learning',
      title: 'Learning Center',
      subtitle: 'Learn astrology',
      category: 'navigation',
      icon: BookOpen,
      action: () => { router.push('/dashboard/learning'); onClose(); },
      keywords: ['learn', 'courses', 'education', 'tutorials']
    },
    {
      id: 'nav-settings',
      title: 'Settings',
      subtitle: 'Account & preferences',
      category: 'navigation',
      icon: Settings,
      action: () => { router.push('/dashboard/settings'); onClose(); },
      keywords: ['settings', 'preferences', 'account', 'profile']
    },

    // Action Commands
    {
      id: 'action-new-chart',
      title: 'Create New Chart',
      subtitle: 'Generate a new birth chart',
      category: 'action',
      icon: Plus,
      action: () => { router.push('/dashboard/charts'); onClose(); },
      keywords: ['new', 'create', 'generate', 'chart']
    },
    {
      id: 'action-get-predictions',
      title: 'Get Predictions',
      subtitle: 'Generate astrological predictions',
      category: 'action',
      icon: Zap,
      action: () => { router.push('/dashboard/predictions'); onClose(); },
      keywords: ['generate', 'predictions', 'forecast']
    },
    {
      id: 'action-check-compatibility',
      title: 'Check Compatibility',
      subtitle: 'Analyze relationship compatibility',
      category: 'action',
      icon: Heart,
      action: () => { router.push('/dashboard/compatibility'); onClose(); },
      keywords: ['check', 'analyze', 'compatibility', 'match']
    },
    {
      id: 'action-book-consultation',
      title: 'Book Consultation',
      subtitle: 'Schedule with an astrologer',
      category: 'action',
      icon: Calendar,
      action: () => { router.push('/dashboard/consultations'); onClose(); },
      keywords: ['book', 'schedule', 'appointment']
    },

    // Help Commands
    {
      id: 'help-support',
      title: 'Get Support',
      subtitle: 'Contact customer support',
      category: 'help',
      icon: HelpCircle,
      action: () => { router.push('/dashboard/settings'); onClose(); },
      keywords: ['help', 'support', 'contact', 'assistance']
    },
    {
      id: 'help-docs',
      title: 'Documentation',
      subtitle: 'View help documentation',
      category: 'help',
      icon: FileText,
      action: () => { router.push('/dashboard/learning'); onClose(); },
      keywords: ['docs', 'documentation', 'help', 'guide']
    },
    {
      id: 'help-keyboard',
      title: 'Keyboard Shortcuts',
      subtitle: 'View keyboard shortcuts',
      category: 'help',
      icon: Command,
      action: () => { 
        // Trigger keyboard shortcuts modal
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '?', shiftKey: true }));
        onClose();
      },
      keywords: ['keyboard', 'shortcuts', 'hotkeys']
    },
  ], [router, onClose]);

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search.trim()) return allCommands;

    const searchLower = search.toLowerCase();
    return allCommands.filter(cmd => {
      const titleMatch = cmd.title.toLowerCase().includes(searchLower);
      const subtitleMatch = cmd.subtitle?.toLowerCase().includes(searchLower);
      const keywordMatch = cmd.keywords?.some(k => k.toLowerCase().includes(searchLower));
      return titleMatch || subtitleMatch || keywordMatch;
    });
  }, [search, allCommands]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.children[selectedIndex] as HTMLElement;
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const categoryLabels = {
    navigation: 'Navigation',
    action: 'Quick Actions',
    chart: 'Your Charts',
    recent: 'Recent',
    help: 'Help & Support'
  };

  const categoryIcons = {
    navigation: LayoutDashboard,
    action: Zap,
    chart: User,
    recent: Clock,
    help: HelpCircle
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Command Palette Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 animate-slideDown">
        <div className="mx-4 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-700/50">
            <Search className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commands, pages, or actions..."
              className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-lg"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-400 border border-slate-600/50">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div
            ref={listRef}
            className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
          >
            {filteredCommands.length === 0 ? (
              <div className="p-12 text-center">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No results found for "{search}"</p>
                <p className="text-slate-500 text-sm mt-1">Try different keywords</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category} className="py-2">
                  {/* Category Header */}
                  <div className="px-4 py-2 flex items-center gap-2">
                    {(() => {
                      const Icon = categoryIcons[category as keyof typeof categoryIcons];
                      return <Icon className="w-4 h-4 text-slate-500" />;
                    })()}
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </span>
                  </div>

                  {/* Commands in Category */}
                  {commands.map((cmd, idx) => {
                    const globalIndex = filteredCommands.indexOf(cmd);
                    const isSelected = globalIndex === selectedIndex;
                    const Icon = cmd.icon;

                    return (
                      <button
                        key={cmd.id}
                        onClick={() => cmd.action()}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full px-4 py-3 flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-l-2 border-purple-500'
                            : 'hover:bg-white/5 border-l-2 border-transparent'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          isSelected
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-slate-700/50 text-slate-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className={`font-medium ${
                            isSelected ? 'text-white' : 'text-slate-200'
                          }`}>
                            {cmd.title}
                          </div>
                          {cmd.subtitle && (
                            <div className="text-xs text-slate-400 mt-0.5">
                              {cmd.subtitle}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <ArrowRight className="w-4 h-4 text-purple-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-700/50 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-slate-700/50 rounded border border-slate-600/50">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-slate-700/50 rounded border border-slate-600/50">↵</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-slate-700/50 rounded border border-slate-600/50">ESC</kbd>
                <span>Close</span>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              {filteredCommands.length} {filteredCommands.length === 1 ? 'result' : 'results'}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
