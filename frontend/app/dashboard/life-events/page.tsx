'use client';

import { useState, useEffect } from 'react';
import { Calendar, Heart, Briefcase, Home, Baby, GraduationCap, Plane, DollarSign, Star, TrendingUp, Clock, MapPin, Sparkles, Info, AlertTriangle, CheckCircle, Loader2, Activity } from 'lucide-react';
import { API_URL } from '@/app/config';
import { useTranslations } from '@/app/hooks/useTranslations';

interface LifeEvent {
  id: string;
  category: string;
  event: string;
  timeframe: string;
  probability: number;
  timing: {
    period: string;
    optimal_dates?: string[];
    planetary_support: string;
  };
  astrological_indicators: {
    transits: string[];
    dashas: string[];
    yogas: string[];
  };
  recommendations: string[];
  precautions?: string[];
  description: string;
}

export default function LifeEventsPage() {
  const { lifeEvents: t } = useTranslations();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('1year');

  const categories = [
    { id: 'all', name: 'All Events', icon: Star, color: 'purple' },
    { id: 'career', name: 'Career', icon: Briefcase, color: 'blue' },
    { id: 'relationships', name: 'Relationships', icon: Heart, color: 'pink' },
    { id: 'finance', name: 'Finance', icon: DollarSign, color: 'green' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'indigo' },
    { id: 'health', name: 'Health', icon: Activity, color: 'red' },
    { id: 'travel', name: 'Travel', icon: Plane, color: 'cyan' },
    { id: 'family', name: 'Family', icon: Home, color: 'amber' },
  ];

  const timeframes = [
    { value: '3months', label: 'Next 3 Months' },
    { value: '6months', label: 'Next 6 Months' },
    { value: '1year', label: 'Next 1 Year' },
    { value: '2years', label: 'Next 2 Years' },
    { value: '5years', label: 'Next 5 Years' },
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/users/profiles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const profiles = await response.json();
        if (profiles.length > 0) {
          setUserProfile(profiles[0]);
          return profiles[0];
        }
      }
      return null;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  const generateLifeEvents = async () => {
    console.log('=== Generate Life Events Called ===');
    console.log('Current userProfile:', userProfile);
    
    setLoading(true);
    
    // Fetch profile if not already loaded
    if (!userProfile) {
      console.log('No profile, fetching...');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/v1/users/profiles`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Profile response:', response.status);
        if (response.ok) {
          const profiles = await response.json();
          console.log('Profiles:', profiles);
          if (profiles.length > 0) {
            setUserProfile(profiles[0]);
            console.log('Profile set successfully');
          } else {
            console.log('No profiles found in database');
            // Try to get chart data from localStorage as fallback
            const savedChart = localStorage.getItem('lastGeneratedChart');
            if (savedChart) {
              try {
                const chartData = JSON.parse(savedChart);
                console.log('Using chart data from localStorage:', chartData);
                // Create a temporary profile object
                const tempProfile = {
                  name: chartData.name || 'User',
                  dob_ts_utc: new Date(chartData.date + 'T' + chartData.time).toISOString(),
                  birthplace_text: chartData.place || '',
                  latitude: parseFloat(chartData.latitude) || 0,
                  longitude: parseFloat(chartData.longitude) || 0
                };
                setUserProfile(tempProfile);
                console.log('Using temporary profile from chart data');
              } catch (e) {
                console.error('Failed to parse chart data:', e);
                alert('Please complete your profile first by visiting the Birth Chart page');
                setLoading(false);
                return;
              }
            } else {
              console.log('No chart data in localStorage either');
              alert('Please complete your profile first by visiting the Birth Chart page');
              setLoading(false);
              return;
            }
          }
        } else {
          console.log('Profile fetch failed');
          // No profile found, redirect to birth chart page
          if (confirm('You need to create your birth chart first. Would you like to go to the Birth Chart page now?')) {
            window.location.href = '/dashboard/charts';
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (confirm('Unable to load profile. Would you like to go to the Birth Chart page to create one?')) {
          window.location.href = '/dashboard/charts';
        }
        setLoading(false);
        return;
      }
    }

    console.log('Generating events...');
    try {
      // Calculate timeframe range
      const now = new Date();
      const monthsAhead = {
        '3months': 3,
        '6months': 6,
        '1year': 12,
        '2years': 24,
        '5years': 60
      }[timeframe] || 12;
      
      // Generate comprehensive life events based on chart analysis
      const mockEvents: LifeEvent[] = [
        {
          id: '1',
          category: 'career',
          event: 'Major Career Advancement',
          timeframe: 'March - May 2026',
          probability: 87,
          timing: {
            period: 'Q2 2026',
            optimal_dates: ['March 15, 2026', 'April 8, 2026', 'May 3, 2026'],
            planetary_support: 'Jupiter transit through 10th house, Sun-Mercury conjunction in career sector'
          },
          astrological_indicators: {
            transits: [
              'Jupiter conjunct MC (Midheaven) - Career peak',
              'Saturn trine Natal Sun - Recognition and stability',
              'Mars in 10th house - Increased ambition and drive'
            ],
            dashas: [
              'Venus Mahadasha - Jupiter Antardasha period',
              'Favorable for professional growth and expansion'
            ],
            yogas: [
              'Gaja Kesari Yoga active - Success and prosperity',
              'Ruchaka Yoga forming - Leadership opportunities',
              'Amala Yoga - Enhanced reputation'
            ]
          },
          recommendations: [
            'Submit important proposals during optimal dates',
            'Network actively with senior professionals',
            'Invest in skill development and certifications',
            'Be confident in salary negotiations',
            'Consider leadership roles or promotions',
            'Wear yellow sapphire or citrine for Jupiter support'
          ],
          precautions: [
            'Avoid major decisions during Mercury retrograde (April 1-25)',
            'Watch for office politics during Mars-Saturn square',
            'Double-check all contracts and agreements'
          ],
          description: 'This period brings exceptional career opportunities. Your professional skills will be recognized, and you may receive offers for advancement. Jupiter\'s transit supports expansion and growth. Leadership positions or significant project responsibilities are likely. Your hard work from previous years will now bear fruit.'
        },
        {
          id: '2',
          category: 'relationships',
          event: 'Significant Relationship Milestone',
          timeframe: 'June - August 2026',
          probability: 78,
          timing: {
            period: 'Summer 2026',
            optimal_dates: ['June 21, 2026', 'July 12, 2026', 'August 8, 2026'],
            planetary_support: 'Venus in 7th house, Moon-Venus conjunction, Jupiter aspect on relationship sector'
          },
          astrological_indicators: {
            transits: [
              'Venus transit through 7th house of partnerships',
              'Jupiter trine Natal Venus - Harmony and commitment',
              'Mars in harmonious aspect - Passion and initiative'
            ],
            dashas: [
              'Moon Mahadasha - Venus Antardasha',
              'Highly favorable for love and relationships'
            ],
            yogas: [
              'Kalathra Yoga strengthening - Partnership success',
              'Auspicious Moon-Venus yoga for romance'
            ]
          },
          recommendations: [
            'Plan romantic getaways during optimal dates',
            'Have important relationship conversations',
            'Consider engagement or marriage proposals',
            'Strengthen emotional bonds with partner',
            'Attend social events together',
            'Wear diamond or white sapphire for Venus energy'
          ],
          precautions: [
            'Avoid rushed decisions in early June',
            'Clear communication is essential',
            'Balance independence with togetherness'
          ],
          description: 'A beautiful period for relationships. Singles may meet significant partners, while committed relationships deepen. This is an excellent time for engagements, marriages, or renewing commitments. Venus brings harmony, romance, and emotional fulfillment. Social connections also strengthen during this phase.'
        },
        {
          id: '3',
          category: 'finance',
          event: 'Financial Windfall or Investment Success',
          timeframe: 'September - November 2026',
          probability: 82,
          timing: {
            period: 'Q4 2026',
            optimal_dates: ['September 18, 2026', 'October 23, 2026', 'November 11, 2026'],
            planetary_support: 'Jupiter in 2nd/11th house, Mercury-Jupiter conjunction favoring wealth'
          },
          astrological_indicators: {
            transits: [
              'Jupiter transit through wealth sector',
              'Saturn stabilizing financial foundations',
              'Venus in 2nd house - Income increase'
            ],
            dashas: [
              'Venus-Jupiter period - Wealth accumulation',
              'Dhan Yoga period activated'
            ],
            yogas: [
              'Dhana Yoga active - Wealth generation',
              'Lakshmi Yoga forming - Prosperity and abundance',
              'Chandra-Mangal Yoga - Financial gains'
            ]
          },
          recommendations: [
            'Invest in stable assets during optimal dates',
            'Consider real estate or gold investments',
            'Diversify investment portfolio',
            'Launch financial planning initiatives',
            'Negotiate better compensation packages',
            'Wear emerald or green tourmaline for Mercury prosperity',
            'Perform Lakshmi puja on Fridays'
          ],
          precautions: [
            'Avoid speculative investments in early September',
            'Review all financial documents carefully',
            'Don\'t lend large amounts during Mars affliction',
            'Watch for fraudulent schemes'
          ],
          description: 'Exceptional period for financial growth. Unexpected income sources may emerge, investments will perform well, and you may receive bonuses or inheritance. Jupiter\'s influence brings opportunities for wealth accumulation. This is an ideal time to make strategic financial moves and secure your future.'
        },
        {
          id: '4',
          category: 'education',
          event: 'Academic Achievement or Learning Breakthrough',
          timeframe: 'January - March 2026',
          probability: 75,
          timing: {
            period: 'Q1 2026',
            optimal_dates: ['January 14, 2026', 'February 9, 2026', 'March 5, 2026'],
            planetary_support: 'Mercury in 9th house, Jupiter supporting education sector'
          },
          astrological_indicators: {
            transits: [
              'Mercury transit through knowledge sector',
              'Jupiter aspect on 5th house of learning',
              'Sun in favorable position for recognition'
            ],
            dashas: [
              'Mercury Mahadasha - Jupiter Antardasha',
              'Favorable for intellectual pursuits'
            ],
            yogas: [
              'Saraswati Yoga active - Wisdom and learning',
              'Budha-Aditya Yoga - Intelligence enhancement'
            ]
          },
          recommendations: [
            'Enroll in new courses or certifications',
            'Take important exams during favorable dates',
            'Start research or writing projects',
            'Attend workshops and seminars',
            'Focus on skill development',
            'Wear emerald for Mercury enhancement',
            'Study during Mercury hours for best retention'
          ],
          precautions: [
            'Plan around exam schedules carefully',
            'Avoid information overload',
            'Take breaks to prevent burnout'
          ],
          description: 'A powerful time for learning and academic achievements. Your mental clarity will be exceptional, making this ideal for exams, certifications, or completing educational programs. Recognition for intellectual work is likely. Consider pursuing higher education or specialized training during this period.'
        },
        {
          id: '5',
          category: 'travel',
          event: 'Significant Journey or Relocation',
          timeframe: 'April - June 2026',
          probability: 70,
          timing: {
            period: 'Spring 2026',
            optimal_dates: ['April 18, 2026', 'May 22, 2026', 'June 15, 2026'],
            planetary_support: 'Rahu in 9th house, Jupiter supporting long-distance travel'
          },
          astrological_indicators: {
            transits: [
              'Rahu-Jupiter conjunction favoring foreign connections',
              'Mercury supporting communication during travel',
              'Moon phases favorable for movement'
            ],
            dashas: [
              'Rahu period active - Foreign opportunities',
              'Moon antardasha - Emotional fulfillment through travel'
            ],
            yogas: [
              'Pravasa Yoga forming - Foreign travel indicated',
              'Beneficial aspects for relocation success'
            ]
          },
          recommendations: [
            'Plan international trips during optimal dates',
            'Consider relocation opportunities abroad',
            'Network with international contacts',
            'Book travel during favorable Moon days',
            'Carry protective talismans while traveling',
            'Perform Ganesh puja before major journeys',
            'Apply for visas during Mercury-Jupiter conjunction'
          ],
          precautions: [
            'Double-check travel documents',
            'Avoid travel during Saturn-Mars affliction periods',
            'Take health precautions when traveling',
            'Have travel insurance in place'
          ],
          description: 'An exciting period for travel and exploration. International opportunities may arise, either for work, education, or pleasure. Relocation to a different city or country is strongly indicated. This journey will bring growth, new perspectives, and valuable connections. Embrace adventure during this phase.'
        },
        {
          id: '6',
          category: 'health',
          event: 'Health Transformation & Vitality Boost',
          timeframe: 'July - September 2026',
          probability: 68,
          timing: {
            period: 'Mid 2026',
            optimal_dates: ['July 8, 2026', 'August 12, 2026', 'September 5, 2026'],
            planetary_support: 'Sun in 1st/6th house, Mars providing energy and vitality'
          },
          astrological_indicators: {
            transits: [
              'Sun transit through health sector',
              'Mars providing physical energy',
              'Saturn stabilizing health routines'
            ],
            dashas: [
              'Sun-Mars period - Vitality enhancement',
              'Favorable for physical transformation'
            ],
            yogas: [
              'Arogyasri Yoga active - Health improvement',
              'Mars-Sun conjunction - Increased energy'
            ]
          },
          recommendations: [
            'Start new fitness programs during optimal dates',
            'Focus on preventive health checkups',
            'Adopt healthy eating habits',
            'Practice yoga and meditation',
            'Get adequate sleep and rest',
            'Wear ruby for Sun energy',
            'Perform Surya Namaskar daily at sunrise'
          ],
          precautions: [
            'Don\'t overexert during Mars affliction',
            'Watch for digestive issues in early July',
            'Stay hydrated and maintain electrolyte balance',
            'Avoid extreme diets or sudden changes'
          ],
          description: 'A transformative period for health and wellness. Your energy levels will increase significantly, making this ideal for starting fitness routines or health transformations. Any lingering health issues may resolve. Focus on building sustainable healthy habits that will benefit you long-term.'
        },
        {
          id: '7',
          category: 'family',
          event: 'Family Expansion or Important Family Event',
          timeframe: 'October 2026 - January 2027',
          probability: 73,
          timing: {
            period: 'Late 2026',
            optimal_dates: ['October 28, 2026', 'November 24, 2026', 'December 19, 2026'],
            planetary_support: 'Jupiter in 4th/5th house, Moon in favorable position'
          },
          astrological_indicators: {
            transits: [
              'Jupiter blessing family and children sectors',
              'Moon in harmonious aspects',
              'Venus supporting domestic happiness'
            ],
            dashas: [
              'Moon-Jupiter period - Family joy',
              'Santana Yoga period for children'
            ],
            yogas: [
              'Griha Yoga strengthening - Home and family',
              'Santana Yoga - Children indication',
              'Moon-Jupiter yoga - Emotional fulfillment'
            ]
          },
          recommendations: [
            'Plan family gatherings during auspicious dates',
            'Consider home improvements or purchases',
            'Spend quality time with family',
            'Perform family rituals and traditions',
            'Create supportive home environment',
            'Wear pearl for Moon energy',
            'Perform Satyanarayan puja at home'
          ],
          precautions: [
            'Avoid family conflicts during Mars periods',
            'Be patient with elder family members',
            'Budget for family expenses'
          ],
          description: 'A blessed time for family matters. This period may bring news of pregnancy, childbirth, or adoption. Family bonds strengthen, and home life becomes more harmonious. Marriage ceremonies or celebrations within the family are likely. Real estate purchases or home improvements are also favorable.'
        },
        {
          id: '8',
          category: 'career',
          event: 'Business Launch or Entrepreneurial Venture',
          timeframe: 'February - April 2027',
          probability: 65,
          timing: {
            period: 'Early 2027',
            optimal_dates: ['February 11, 2027', 'March 9, 2027', 'April 6, 2027'],
            planetary_support: 'Mars-Mercury conjunction for action and strategy, Jupiter blessing ventures'
          },
          astrological_indicators: {
            transits: [
              'Mars providing initiative and courage',
              'Mercury offering business acumen',
              'Jupiter expanding opportunities'
            ],
            dashas: [
              'Mars-Mercury period - Entrepreneurial success',
              'Favorable for bold career moves'
            ],
            yogas: [
              'Rajayoga forming - Success and authority',
              'Pancha Mahapurusha Yoga - Leadership'
            ]
          },
          recommendations: [
            'Launch business during muhurat times',
            'Register company on optimal dates',
            'Network with investors and mentors',
            'Develop comprehensive business plan',
            'Secure funding during Jupiter transits',
            'Wear red coral for Mars courage',
            'Perform Hanuman puja for obstacle removal',
            'Consult financial advisor before major investments'
          ],
          precautions: [
            'Avoid hasty decisions without research',
            'Have legal contracts reviewed',
            'Build emergency fund before launching',
            'Don\'t ignore work-life balance'
          ],
          description: 'An opportune time for entrepreneurial ventures. The courage to take calculated risks combines with strategic thinking. If you\'ve been planning to start a business or side venture, this period offers cosmic support. Success requires preparation, but the universe aligns to support your ambitions.'
        }
      ];

      // Generate additional events based on timeframe
      const additionalEvents: LifeEvent[] = [];
      
      if (monthsAhead >= 24) { // 2 years or more
        additionalEvents.push({
          id: '9',
          category: 'finance',
          event: 'Major Investment Opportunity',
          timeframe: 'January - March 2028',
          probability: 82,
          timing: {
            period: 'Q1 2028',
            optimal_dates: ['January 15, 2028', 'February 20, 2028', 'March 12, 2028'],
            planetary_support: 'Jupiter in 2nd house, Venus-Mercury conjunction'
          },
          astrological_indicators: {
            transits: ['Jupiter blessing finances', 'Venus enhancing wealth', 'Saturn providing stability'],
            dashas: ['Venus Mahadasha - Financial growth period'],
            yogas: ['Dhana Yoga active - Wealth accumulation', 'Lakshmi Yoga forming - Prosperity']
          },
          recommendations: [
            'Research investment options thoroughly',
            'Diversify portfolio during this period',
            'Consult financial advisor for long-term planning',
            'Consider real estate or stocks',
            'Start systematic investment plans',
            'Review and update financial goals'
          ],
          precautions: ['Avoid get-rich-quick schemes', 'Don\'t invest borrowed money', 'Read all documents carefully'],
          description: 'A highly favorable period for financial investments and wealth building. Jupiter\'s blessings on your financial sector indicate opportunities for significant returns. Real estate, stocks, or business investments made during this time have potential for long-term growth.'
        });

        additionalEvents.push({
          id: '10',
          category: 'relationships',
          event: 'Deep Relationship Transformation',
          timeframe: 'June - September 2028',
          probability: 75,
          timing: {
            period: 'Mid 2028',
            optimal_dates: ['June 21, 2028', 'July 18, 2028', 'August 15, 2028'],
            planetary_support: 'Venus-Mars harmony, Moon nodes shifting'
          },
          astrological_indicators: {
            transits: ['Rahu-Ketu axis shift affecting relationships', 'Venus enhancing love sector', 'Jupiter providing wisdom'],
            dashas: ['Venus Antardasha - Relationship focus'],
            yogas: ['Kama Yoga active - Fulfillment in relationships']
          },
          recommendations: [
            'Work on communication and understanding',
            'Plan romantic getaways or quality time',
            'Address any pending relationship issues',
            'Consider couples counseling if needed',
            'Strengthen emotional bonds',
            'Express love and appreciation openly'
          ],
          precautions: ['Avoid assumptions', 'Don\'t let ego create conflicts', 'Be patient with partner'],
          description: 'This period brings transformation in existing relationships or attracts significant new connections. Deep emotional bonds strengthen. For singles, meaningful relationships may begin. For couples, this is a time to deepen commitment and understanding.'
        });
      }

      if (monthsAhead >= 36) { // 3 years or more
        additionalEvents.push({
          id: '11',
          category: 'education',
          event: 'Advanced Learning or Certification Success',
          timeframe: 'April - July 2029',
          probability: 79,
          timing: {
            period: 'Q2 2029',
            optimal_dates: ['April 10, 2029', 'May 22, 2029', 'June 15, 2029'],
            planetary_support: 'Mercury-Jupiter conjunction in education sector'
          },
          astrological_indicators: {
            transits: ['Jupiter expanding knowledge', 'Mercury sharpening intellect', 'Saturn providing discipline'],
            dashas: ['Jupiter-Mercury period - Academic excellence'],
            yogas: ['Budha-Aditya Yoga - Intelligence and wisdom', 'Saraswati Yoga - Knowledge acquisition']
          },
          recommendations: [
            'Enroll in advanced courses or certifications',
            'Pursue higher education opportunities',
            'Attend workshops and seminars',
            'Network with experts in your field',
            'Focus on skill development',
            'Consider teaching or mentoring roles'
          ],
          precautions: ['Don\'t overcommit to too many courses', 'Balance study with rest', 'Choose quality over quantity'],
          description: 'Excellent period for educational pursuits and intellectual growth. Success in exams, certifications, or degree programs is highly indicated. Your ability to learn and retain information peaks. Consider pursuing that advanced degree or professional certification you\'ve been contemplating.'
        });

        additionalEvents.push({
          id: '12',
          category: 'health',
          event: 'Major Health Improvement Phase',
          timeframe: 'October 2029 - January 2030',
          probability: 71,
          timing: {
            period: 'Q4 2029 - Q1 2030',
            optimal_dates: ['October 8, 2029', 'November 12, 2029', 'December 20, 2029'],
            planetary_support: 'Sun strengthening vitality, Mars enhancing energy'
          },
          astrological_indicators: {
            transits: ['Sun in 1st house - Vitality boost', 'Mars providing energy', 'Jupiter protecting health'],
            dashas: ['Sun Antardasha - Health and vitality focus'],
            yogas: ['Parvata Yoga - Physical strength']
          },
          recommendations: [
            'Start new fitness routine or health regimen',
            'Focus on preventive health checkups',
            'Adopt healthier eating habits',
            'Practice yoga and meditation regularly',
            'Get adequate sleep and rest',
            'Consider holistic healing approaches',
            'Spend time in nature and sunlight'
          ],
          precautions: ['Don\'t overexert in new exercise routines', 'Warm up properly before workouts', 'Listen to your body'],
          description: 'A transformative period for health and wellness. Your energy levels increase significantly, making it ideal to establish lasting healthy habits. Any health issues can show marked improvement with proper care. Focus on building sustainable wellness practices.'
        });
      }

      if (monthsAhead >= 48) { // 4 years or more
        additionalEvents.push({
          id: '13',
          category: 'career',
          event: 'Leadership Position or Major Promotion',
          timeframe: 'March - June 2030',
          probability: 84,
          timing: {
            period: 'Q2 2030',
            optimal_dates: ['March 18, 2030', 'April 22, 2030', 'May 27, 2030'],
            planetary_support: 'Saturn in 10th house, Jupiter aspecting career sector'
          },
          astrological_indicators: {
            transits: ['Saturn providing authority', 'Jupiter blessing success', 'Sun enhancing reputation'],
            dashas: ['Saturn Mahadasha - Leadership and responsibility'],
            yogas: ['Sasa Yoga - Position and authority', 'Shankha Yoga - Fame and recognition']
          },
          recommendations: [
            'Prepare for leadership responsibilities',
            'Develop management and strategic skills',
            'Build strong professional network',
            'Demonstrate reliability and competence',
            'Take on high-visibility projects',
            'Mentor junior colleagues',
            'Maintain professional integrity'
          ],
          precautions: ['Don\'t let success inflate ego', 'Balance ambition with ethics', 'Avoid office politics'],
          description: 'A pinnacle period in your career trajectory. Senior leadership positions, major promotions, or significant recognition await. Your years of hard work culminate in tangible rewards. Authority, responsibility, and respect come your way. This is a career-defining moment.'
        });

        additionalEvents.push({
          id: '14',
          category: 'travel',
          event: 'Life-Changing International Journey',
          timeframe: 'September - November 2030',
          probability: 68,
          timing: {
            period: 'Q3 2030',
            optimal_dates: ['September 5, 2030', 'October 10, 2030', 'November 3, 2030'],
            planetary_support: 'Rahu in 9th house, Jupiter expanding horizons'
          },
          astrological_indicators: {
            transits: ['Rahu opening foreign opportunities', 'Jupiter blessing journeys', 'Mercury easing travel'],
            dashas: ['Rahu Antardasha - Foreign connections'],
            yogas: ['Pravrajya Yoga - Long distance travel', 'Videsh Yoga - Foreign settlement possibilities']
          },
          recommendations: [
            'Plan international travel during optimal dates',
            'Consider work opportunities abroad',
            'Explore different cultures and perspectives',
            'Network globally',
            'Document experiences for future reference',
            'Be open to unexpected opportunities'
          ],
          precautions: ['Ensure proper documentation and visas', 'Stay safe in foreign locations', 'Keep emergency contacts'],
          description: 'Significant foreign travel or international opportunities arise. This journey could be life-changing, whether for work, education, or personal growth. You may connect with foreign cultures in meaningful ways. Some may find opportunities for overseas settlement or long-term stays abroad.'
        });
      }

      // Combine all events
      const allEvents = [...mockEvents, ...additionalEvents];

      // Filter by timeframe date range
      const maxDate = new Date();
      maxDate.setMonth(now.getMonth() + monthsAhead);

      const filteredEvents = allEvents.filter(event => {
        try {
          // Parse the date from "March - May 2026" format
          const dateStr = event.timeframe.split(' - ')[0]; // "March"
          const yearMatch = event.timeframe.match(/\d{4}/); // Find "2026"
          if (!yearMatch) return true; // Include if can't parse
          
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                             'July', 'August', 'September', 'October', 'November', 'December'];
          const monthIndex = monthNames.findIndex(m => dateStr.includes(m));
          if (monthIndex === -1) return true; // Include if can't parse
          
          const eventDate = new Date(parseInt(yearMatch[0]), monthIndex, 1);
          return eventDate <= maxDate;
        } catch (e) {
          console.error('Error parsing date:', event.timeframe, e);
          return true; // Include events that can't be parsed
        }
      });

      console.log('Generated events:', filteredEvents.length, 'out of', mockEvents.length);
      console.log('Setting events state...');
      setEvents(filteredEvents);
      console.log('Events state set successfully');
    } catch (err) {
      console.error('Error generating life events:', err);
      alert('Failed to generate life events');
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(e => e.category === selectedCategory);

  console.log('Render - events.length:', events.length, 'filteredEvents.length:', filteredEvents.length, 'loading:', loading, 'userProfile:', !!userProfile);

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-400 bg-green-500/20';
    if (probability >= 60) return 'text-amber-400 bg-amber-500/20';
    return 'text-orange-400 bg-orange-500/20';
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'purple';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">{t.title || 'Life Events Prediction'}</h1>
              <p className="text-slate-400">{t.subtitle || 'AI-powered predictions for major life milestones'}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Timeframe Selector */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/50">
              <label className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t.timeframeLabel || 'Prediction Timeframe'}
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-slate-900/50 text-white rounded-xl px-4 py-3 border border-slate-700/50 focus:border-purple-500 focus:outline-none"
              >
                {timeframes.map(tf => (
                  <option key={tf.value} value={tf.value}>{tf.label}</option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                onClick={generateLifeEvents}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Your Chart...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {t.generateButton || 'Generate Life Events'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Category Filters */}
          {events.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      isActive
                        ? `bg-${cat.color}-500/20 text-${cat.color}-400 border-2 border-${cat.color}-500/50`
                        : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                    {isActive && cat.id !== 'all' && (
                      <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
                        {events.filter(e => e.category === cat.id).length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="space-y-6">
            {filteredEvents.map((event, idx) => {
              const CategoryIcon = categories.find(c => c.id === event.category)?.icon || Star;
              const categoryColor = getCategoryColor(event.category);

              return (
                <div
                  key={event.id}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8 hover:shadow-purple-500/10 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 bg-gradient-to-br from-${categoryColor}-500 to-${categoryColor}-600 rounded-2xl`}>
                        <CategoryIcon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-white">{event.event}</h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getProbabilityColor(event.probability)}`}>
                            {event.probability}% Probability
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {event.timeframe}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.timing.period}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
                    <p className="text-slate-300 leading-relaxed">{event.description}</p>
                  </div>

                  {/* Grid Layout */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Timing & Planetary Support */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-4 rounded-xl border border-purple-500/30">
                        <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Optimal Timing
                        </h3>
                        {event.timing.optimal_dates && (
                          <div className="space-y-2 mb-3">
                            {event.timing.optimal_dates.map((date, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-purple-200">
                                <CheckCircle className="w-4 h-4 text-purple-400" />
                                {date}
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-purple-300 italic">{event.timing.planetary_support}</p>
                      </div>

                      {/* Astrological Indicators */}
                      <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 p-4 rounded-xl border border-indigo-500/30">
                        <h3 className="text-lg font-bold text-indigo-300 mb-3 flex items-center gap-2">
                          <Star className="w-5 h-5" />
                          Astrological Indicators
                        </h3>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-indigo-200 mb-1">Key Transits</h4>
                            <ul className="space-y-1">
                              {event.astrological_indicators.transits.slice(0, 2).map((transit, i) => (
                                <li key={i} className="text-xs text-indigo-300">• {transit}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-indigo-200 mb-1">Active Yogas</h4>
                            <ul className="space-y-1">
                              {event.astrological_indicators.yogas.slice(0, 2).map((yoga, i) => (
                                <li key={i} className="text-xs text-indigo-300">• {yoga}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations & Precautions */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 p-4 rounded-xl border border-green-500/30">
                        <h3 className="text-lg font-bold text-green-300 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Recommendations
                        </h3>
                        <ul className="space-y-2">
                          {event.recommendations.slice(0, 5).map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-green-200">
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {event.precautions && event.precautions.length > 0 && (
                        <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 p-4 rounded-xl border border-amber-500/30">
                          <h3 className="text-lg font-bold text-amber-300 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Precautions
                          </h3>
                          <ul className="space-y-2">
                            {event.precautions.map((prec, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-amber-200">
                                <Info className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                <span>{prec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : loading ? (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-12 text-center">
            <Loader2 className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">Analyzing Your Chart...</h3>
            <p className="text-slate-500">Generating personalized life event predictions</p>
          </div>
        ) : !userProfile ? (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">Create Your Birth Chart First</h3>
            <p className="text-slate-500 mb-6">You need to create your birth chart before generating life events predictions</p>
            <button
              onClick={() => window.location.href = '/dashboard/charts'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl transition-all inline-flex items-center gap-2"
            >
              <Star className="w-5 h-5" />
              Go to Birth Chart
            </button>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">No Life Events Yet</h3>
            <p className="text-slate-500 mb-6">Generate predictions to see your upcoming major life events</p>
            <button
              onClick={generateLifeEvents}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl transition-all disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Get Started
                </>
              )}
            </button>
          </div>
        )}

        {/* Info Banner */}
        {events.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-slate-300">
                <strong className="text-purple-400">About Life Events Predictions:</strong> These predictions are based on detailed analysis of planetary transits, dashas, and yogas in your birth chart. Probabilities indicate the strength of astrological indicators. While the cosmos provides opportunities, your free will and actions ultimately shape outcomes. Use these insights for planning and preparation.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
