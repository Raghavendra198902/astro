'use client';

import { useState } from 'react';
import { BookOpen, Video, FileText, Award, Clock, Star, Search, Filter, Play, Check, Lock, TrendingUp, Users, Target } from 'lucide-react';
import { useTranslations } from '@/app/hooks/useTranslations';

type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
type ContentType = 'course' | 'article' | 'video' | 'tutorial';

interface LearningResource {
  id: number;
  title: string;
  type: ContentType;
  level: CourseLevel;
  duration: string;
  description: string;
  thumbnail: string;
  instructor?: string;
  enrolled?: number;
  rating?: number;
  progress?: number;
  locked?: boolean;
  category: string;
}

const learningResources: LearningResource[] = [
  {
    id: 1,
    title: 'Introduction to Vedic Astrology',
    type: 'course',
    level: 'beginner',
    duration: '4 hours',
    description: 'Learn the fundamentals of Vedic astrology including planets, houses, and signs. Perfect for complete beginners.',
    thumbnail: '🔮',
    instructor: 'Dr. Sharma',
    enrolled: 1240,
    rating: 4.8,
    progress: 65,
    category: 'Foundations'
  },
  {
    id: 2,
    title: 'Understanding Birth Charts',
    type: 'course',
    level: 'beginner',
    duration: '3 hours',
    description: 'Master the art of reading and interpreting birth charts. Learn about ascendants, planetary positions, and aspects.',
    thumbnail: '📊',
    instructor: 'Swami Raj',
    enrolled: 980,
    rating: 4.9,
    progress: 30,
    category: 'Chart Reading'
  },
  {
    id: 3,
    title: 'Planetary Transits and Their Effects',
    type: 'video',
    level: 'intermediate',
    duration: '45 min',
    description: 'Understand how planetary movements affect your life and make accurate predictions based on transit patterns.',
    thumbnail: '🌍',
    instructor: 'Pandit Kumar',
    enrolled: 756,
    rating: 4.7,
    category: 'Predictive Astrology'
  },
  {
    id: 4,
    title: 'Numerology Basics: Life Path Numbers',
    type: 'article',
    level: 'beginner',
    duration: '15 min',
    description: 'Discover the meaning of life path numbers and how they influence personality and destiny.',
    thumbnail: '🔢',
    enrolled: 2100,
    rating: 4.6,
    category: 'Numerology'
  },
  {
    id: 5,
    title: 'Advanced Dasha Analysis',
    type: 'course',
    level: 'advanced',
    duration: '6 hours',
    description: 'Deep dive into Vimshottari Dasha system for timing life events with precision.',
    thumbnail: '⏰',
    instructor: 'Acharya Patel',
    enrolled: 445,
    rating: 4.9,
    locked: true,
    category: 'Advanced Techniques'
  },
  {
    id: 6,
    title: 'Compatibility Analysis Masterclass',
    type: 'course',
    level: 'intermediate',
    duration: '5 hours',
    description: 'Learn to analyze relationship compatibility using Vedic methods including Ashtakoot matching.',
    thumbnail: '💑',
    instructor: 'Dr. Sharma',
    enrolled: 823,
    rating: 4.8,
    progress: 10,
    category: 'Relationships'
  },
  {
    id: 7,
    title: 'Palmistry Fundamentals',
    type: 'tutorial',
    level: 'beginner',
    duration: '2 hours',
    description: 'Learn to read palms and understand the major lines, mounts, and what they reveal.',
    thumbnail: '🖐️',
    instructor: 'Master Singh',
    enrolled: 1567,
    rating: 4.5,
    category: 'Palmistry'
  },
  {
    id: 8,
    title: 'Face Reading: The Art of Physiognomy',
    type: 'video',
    level: 'intermediate',
    duration: '1 hour',
    description: 'Discover the ancient art of reading personality and destiny through facial features.',
    thumbnail: '👤',
    instructor: 'Guru Verma',
    enrolled: 634,
    rating: 4.4,
    category: 'Face Reading'
  },
  {
    id: 9,
    title: 'Remedial Measures in Astrology',
    type: 'article',
    level: 'intermediate',
    duration: '20 min',
    description: 'Learn about gemstones, mantras, and rituals to mitigate negative planetary influences.',
    thumbnail: '💎',
    enrolled: 1890,
    rating: 4.7,
    category: 'Remedies'
  },
  {
    id: 10,
    title: 'Yogas in Vedic Astrology',
    type: 'course',
    level: 'advanced',
    duration: '8 hours',
    description: 'Study the powerful yogas in Vedic astrology including Raj Yoga, Dhana Yoga, and more.',
    thumbnail: '🧘',
    instructor: 'Acharya Patel',
    enrolled: 512,
    rating: 5.0,
    locked: true,
    category: 'Advanced Techniques'
  },
  {
    id: 11,
    title: 'Panchang and Muhurat Selection',
    type: 'tutorial',
    level: 'intermediate',
    duration: '3 hours',
    description: 'Master the Panchang system and learn to select auspicious times for important events.',
    thumbnail: '📅',
    instructor: 'Swami Raj',
    enrolled: 678,
    rating: 4.6,
    category: 'Panchang'
  },
  {
    id: 12,
    title: 'Career Astrology: Finding Your Path',
    type: 'video',
    level: 'beginner',
    duration: '40 min',
    description: 'Use astrology to discover your ideal career path and timing for career changes.',
    thumbnail: '💼',
    instructor: 'Dr. Sharma',
    enrolled: 1423,
    rating: 4.8,
    category: 'Career'
  }
];

const categories = ['All', 'Foundations', 'Chart Reading', 'Predictive Astrology', 'Numerology', 'Advanced Techniques', 'Relationships', 'Palmistry', 'Face Reading', 'Remedies', 'Panchang', 'Career'];

export default function LearningPage() {
  const { learning: t } = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter resources
  const filteredResources = learningResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || resource.level === selectedLevel;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesType && matchesCategory;
  });

  // Stats
  const totalCourses = learningResources.filter(r => r.type === 'course').length;
  const inProgress = learningResources.filter(r => r.progress && r.progress > 0).length;
  const totalHours = learningResources.reduce((acc, r) => {
    const hours = parseFloat(r.duration);
    return acc + (isNaN(hours) ? 0 : hours);
  }, 0);

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'course': return <BookOpen className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'article': return <FileText className="w-5 h-5" />;
      case 'tutorial': return <Target className="w-5 h-5" />;
    }
  };

  const getLevelBadge = (level: CourseLevel) => {
    const colors = {
      beginner: 'bg-green-500/20 text-green-300 border-green-500/30',
      intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      advanced: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[level];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                {t.title || 'Learning Center'}
              </h1>
              <p className="text-gray-400 mt-1">{t.subtitle || 'Master the ancient arts of astrology and divination'}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Courses</p>
                  <p className="text-3xl font-bold text-white mt-1">{totalCourses}</p>
                </div>
                <BookOpen className="w-12 h-12 text-purple-400" />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">In Progress</p>
                  <p className="text-3xl font-bold text-white mt-1">{inProgress}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-400" />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Hours</p>
                  <p className="text-3xl font-bold text-white mt-1">{Math.round(totalHours)}</p>
                </div>
                <Clock className="w-12 h-12 text-blue-400" />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Students</p>
                  <p className="text-3xl font-bold text-white mt-1">5.2K</p>
                </div>
                <Users className="w-12 h-12 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, articles, videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Level Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as CourseLevel | 'all')}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ContentType | 'all')}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                <option value="all">All Types</option>
                <option value="course">Courses</option>
                <option value="video">Videos</option>
                <option value="article">Articles</option>
                <option value="tutorial">Tutorials</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Learning Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all group"
              >
                {/* Thumbnail */}
                <div className="relative h-40 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                  <div className="text-6xl">{resource.thumbnail}</div>
                  {resource.locked && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <Lock className="w-12 h-12 text-white mx-auto mb-2" />
                        <p className="text-white text-sm">Pro Plan Required</p>
                      </div>
                    </div>
                  )}
                  {resource.progress !== undefined && resource.progress > 0 && !resource.locked && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
                        style={{ width: `${resource.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Type and Level */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-purple-400">
                      {getTypeIcon(resource.type)}
                      <span className="text-sm capitalize">{resource.type}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getLevelBadge(resource.level)}`}>
                      {resource.level}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {resource.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    {resource.instructor && (
                      <div className="flex items-center text-sm text-gray-400">
                        <Award className="w-4 h-4 mr-2 text-purple-400" />
                        {resource.instructor}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-2 text-purple-400" />
                      {resource.duration}
                    </div>
                    {resource.enrolled && (
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="w-4 h-4 mr-2 text-purple-400" />
                        {resource.enrolled.toLocaleString()} enrolled
                      </div>
                    )}
                  </div>

                  {/* Rating and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    {resource.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-semibold">{resource.rating}</span>
                      </div>
                    )}
                    
                    <button
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                        resource.locked
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : resource.progress && resource.progress > 0
                          ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                      disabled={resource.locked}
                    >
                      {resource.locked ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span className="text-sm">Locked</span>
                        </>
                      ) : resource.progress && resource.progress > 0 ? (
                        <>
                          <Play className="w-4 h-4" />
                          <span className="text-sm">Continue</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span className="text-sm">Start</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Progress */}
                  {resource.progress !== undefined && resource.progress > 0 && !resource.locked && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Progress</span>
                        <span className="text-xs text-white font-semibold">{resource.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all"
                          style={{ width: `${resource.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No resources found matching your criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLevel('all');
                setSelectedType('all');
                setSelectedCategory('All');
              }}
              className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Upgrade CTA */}
        <div className="mt-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Unlock All Premium Courses</h2>
              <p className="text-gray-300 mb-4">
                Get unlimited access to all courses, advanced tutorials, and exclusive content with Pro plan
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  Access to all advanced courses and masterclasses
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  Downloadable course materials and certificates
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  Priority support from expert instructors
                </li>
              </ul>
              <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                Upgrade to Pro
              </button>
            </div>
            <div className="hidden lg:block text-8xl ml-8">
              🎓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
