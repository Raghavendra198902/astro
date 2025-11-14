'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Sparkles,
  Clock,
  Activity,
  Heart,
  DollarSign,
  Briefcase,
  Users,
  Home,
  Book,
  MapPin,
  Scale,
  Moon,
  Sun
} from 'lucide-react';

interface LifeEvent {
  age: number;
  year?: number;
  category: string;
  event_type: string;
  title: string;
  description: string;
  source?: string;
  probability?: number;
}

interface RiskPeriod {
  age_range: [number, number];
  risk_level: string;
  categories: string[];
  description: string;
  recommendations: string[];
}

interface PersonalityBlueprint {
  sun_sign: string;
  moon_sign: string;
  ascendant: string;
  life_path_number: number;
  expression_number: number;
  core_strengths: string[];
  key_challenges: string[];
  natural_talents: string[];
}

interface PredictionData {
  success: boolean;
  birth_date: string;
  current_age: number;
  prediction_span: string;
  past_events: LifeEvent[];
  future_events: LifeEvent[];
  risk_periods: RiskPeriod[];
  life_cycles: any;
  personality_blueprint: PersonalityBlueprint;
  accuracy_score: number;
  data_sources: any;
}

const categoryIcons: { [key: string]: React.ElementType } = {
  career: Briefcase,
  relationships: Heart,
  health: Activity,
  finance: DollarSign,
  education: Book,
  family: Home,
  spiritual: Sparkles,
  travel: MapPin,
  property: Home,
  legal: Scale,
  default: Target
};

const riskLevelColors: { [key: string]: string } = {
  low: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  critical: 'bg-red-100 text-red-800 border-red-300'
};

const eventTypeColors: { [key: string]: string } = {
  opportunity: 'bg-blue-50 border-blue-200',
  challenge: 'bg-orange-50 border-orange-200',
  neutral: 'bg-gray-50 border-gray-200',
  transformation: 'bg-purple-50 border-purple-200'
};

export default function LifeEventsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [currentAge, setCurrentAge] = useState(30);
  const [predictionYears, setPredictionYears] = useState(10);
  const [showMultiSource, setShowMultiSource] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'risks' | 'personality'>('timeline');

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = showMultiSource 
        ? `/api/v1/predictions-test/multisource?current_age=${currentAge}`
        : `/api/v1/predictions-test/demo?current_age=${currentAge}&prediction_years=${predictionYears}`;
      
      const response = await fetch(`http://192.168.11.134:8000${endpoint}`);
      const data = await response.json();
      
      if (data.success) {
        setPredictionData(data);
      } else {
        setError(data.error || 'Failed to fetch prediction');
      }
    } catch (err) {
      setError('Network error: Could not connect to prediction service');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category] || categoryIcons.default;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="w-8 h-8 text-purple-500" />
            Life Events Prediction
          </h1>
          <p className="text-gray-600 mt-1">
            Discover your past patterns and future possibilities
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Prediction Settings</h2>
        <p className="text-sm text-gray-600 mb-4">Adjust parameters to generate your life events timeline</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Age</label>
            <input
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(parseInt(e.target.value) || 30)}
              min={1}
              max={150}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Prediction Years: {predictionYears} years
            </label>
            <input
              type="range"
              value={predictionYears}
              onChange={(e) => setPredictionYears(parseInt(e.target.value))}
              min={1}
              max={50}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchPrediction}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
          >
            {loading ? 'Generating Prediction...' : 'Generate Prediction'}
          </button>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMultiSource}
              onChange={(e) => setShowMultiSource(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Multi-Source Fusion</span>
          </label>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {predictionData && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Past Events</p>
                  <p className="text-2xl font-bold">{predictionData.past_events?.length || 0}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Future Events</p>
                  <p className="text-2xl font-bold">{predictionData.future_events?.length || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Risk Periods</p>
                  <p className="text-2xl font-bold">{predictionData.risk_periods?.length || 0}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold">{predictionData.accuracy_score || 0}%</p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b flex">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'timeline'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-600'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab('risks')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'risks'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-600'
                }`}
              >
                Risk Periods
              </button>
              <button
                onClick={() => setActiveTab('personality')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'personality'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-600'
                }`}
              >
                Personality
              </button>
            </div>

            <div className="p-6">
              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Life Events Timeline</h3>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        Past: {predictionData.past_events?.length || 0}
                      </span>
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                        Future: {predictionData.future_events?.length || 0}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[...(predictionData.past_events || []), ...(predictionData.future_events || [])]
                      .sort((a, b) => a.age - b.age)
                      .slice(0, 30)
                      .map((event, idx) => {
                        const isPast = event.age <= predictionData.current_age;
                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg border-2 ${eventTypeColors[event.event_type]} ${
                              isPast ? 'opacity-70' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${
                                isPast ? 'bg-blue-100' : 'bg-green-100'
                              }`}>
                                {getCategoryIcon(event.category)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">Age {event.age}</span>
                                  {event.year && (
                                    <span className="text-xs text-gray-500">({event.year})</span>
                                  )}
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                    {event.category}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-xs ${
                                    isPast ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                                  }`}>
                                    {isPast ? 'Past' : 'Future'}
                                  </span>
                                </div>
                                <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                                <p className="text-xs text-gray-600">{event.description}</p>
                                {event.probability && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <span className="text-xs text-gray-500">Probability:</span>
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                                      <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${event.probability * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium">
                                      {Math.round(event.probability * 100)}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Risk Periods Tab */}
              {activeTab === 'risks' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Risk Periods
                  </h3>
                  
                  {(predictionData.risk_periods || []).map((risk, idx) => (
                    <div key={idx} className={`border-2 rounded-lg p-4 ${riskLevelColors[risk.risk_level]}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">
                          Age {risk.age_range[0]} - {risk.age_range[1]}
                        </h4>
                        <span className="px-3 py-1 rounded-full text-xs font-medium">
                          {risk.risk_level.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm mb-3">{risk.description}</p>
                      
                      <div className="mb-3">
                        <p className="text-xs font-semibold mb-2">Categories:</p>
                        <div className="flex flex-wrap gap-2">
                          {risk.categories.map((cat, i) => (
                            <span key={i} className="px-2 py-1 bg-white rounded text-xs">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {risk.recommendations?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold mb-2">Recommendations:</p>
                          <ul className="space-y-1">
                            {risk.recommendations.map((rec, i) => (
                              <li key={i} className="text-xs flex items-start gap-2">
                                <span className="text-blue-500">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Personality Tab */}
              {activeTab === 'personality' && predictionData.personality_blueprint && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      Personality Blueprint
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Your core astrological and numerological profile
                    </p>
                  </div>

                  {/* Astrological Signs */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg border">
                      <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                      <p className="text-xs text-gray-600">Sun Sign</p>
                      <p className="font-semibold">{predictionData.personality_blueprint.sun_sign}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border">
                      <Moon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                      <p className="text-xs text-gray-600">Moon Sign</p>
                      <p className="font-semibold">{predictionData.personality_blueprint.moon_sign}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border">
                      <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-500" />
                      <p className="text-xs text-gray-600">Ascendant</p>
                      <p className="font-semibold">{predictionData.personality_blueprint.ascendant}</p>
                    </div>
                  </div>

                  {/* Numerology */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg border">
                      <p className="text-xs text-gray-600 mb-1">Life Path Number</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {predictionData.personality_blueprint.life_path_number}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border">
                      <p className="text-xs text-gray-600 mb-1">Expression Number</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {predictionData.personality_blueprint.expression_number}
                      </p>
                    </div>
                  </div>

                  {/* Strengths */}
                  {predictionData.personality_blueprint.core_strengths?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Core Strengths:</p>
                      <div className="flex flex-wrap gap-2">
                        {predictionData.personality_blueprint.core_strengths.map((strength, i) => (
                          <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Challenges */}
                  {predictionData.personality_blueprint.key_challenges?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Key Challenges:</p>
                      <div className="flex flex-wrap gap-2">
                        {predictionData.personality_blueprint.key_challenges.map((challenge, i) => (
                          <span key={i} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                            {challenge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Talents */}
                  {predictionData.personality_blueprint.natural_talents?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Natural Talents:</p>
                      <div className="flex flex-wrap gap-2">
                        {predictionData.personality_blueprint.natural_talents.map((talent, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {talent}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
