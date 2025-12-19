'use client';

import { useState } from 'react';
import { Calculator, Hash, Star, Users, Sparkles, Loader2, Heart, Briefcase, TrendingUp, Target, Zap, Mountain, Award, Calendar, BookOpen, Compass, Crown, AlertCircle, Lightbulb } from 'lucide-react';
import { API_URL } from '@/app/config';

export default function NumerologyPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'cycles' | 'challenges' | 'compatibility'>('overview');

  // Calculate Pinnacles and Challenges
  const calculatePinnaclesAndChallenges = (birthDate: string) => {
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const reduceNumber = (num: number): number => {
      while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        num = num.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
      }
      return num;
    };

    // Pinnacles
    const pinnacle1 = reduceNumber(month + day);
    const pinnacle2 = reduceNumber(day + year);
    const pinnacle3 = reduceNumber(pinnacle1 + pinnacle2);
    const pinnacle4 = reduceNumber(month + year);

    // Life Path for age calculations
    const lifePath = reduceNumber(reduceNumber(day) + reduceNumber(month) + reduceNumber(year));
    
    // Pinnacle ages
    const pinnacle1End = 36 - lifePath;
    const pinnacle2End = pinnacle1End + 9;
    const pinnacle3End = pinnacle2End + 9;

    // Challenges
    const challenge1 = Math.abs(month - day);
    const challenge2 = Math.abs(day - year % 100);
    const challenge3 = Math.abs(challenge1 - challenge2);
    const challenge4 = Math.abs(month - year % 100);

    return {
      pinnacles: [
        { number: pinnacle1, age: `0-${pinnacle1End}`, period: 'First Pinnacle', description: 'Foundation years - learning and growth' },
        { number: pinnacle2, age: `${pinnacle1End + 1}-${pinnacle2End}`, period: 'Second Pinnacle', description: 'Productive years - career and relationships' },
        { number: pinnacle3, age: `${pinnacle2End + 1}-${pinnacle3End}`, period: 'Third Pinnacle', description: 'Mature years - wisdom and achievement' },
        { number: pinnacle4, age: `${pinnacle3End + 1}+`, period: 'Fourth Pinnacle', description: 'Final years - legacy and fulfillment' },
      ],
      challenges: [
        { number: challenge1, period: 'First Challenge', description: 'Early life obstacles to overcome' },
        { number: challenge2, period: 'Second Challenge', description: 'Mid-life challenges' },
        { number: challenge3, period: 'Main Challenge', description: 'Core life lesson' },
        { number: challenge4, period: 'Final Challenge', description: 'Later life challenges' },
      ],
      lifePath
    };
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.birthDate) {
      alert('Please enter both name and birth date');
      return;
    }
    
    try {
      setLoading(true);
      setResults(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/numerology-test?full_name=${encodeURIComponent(formData.name)}&birth_date=${formData.birthDate}&system=pythagorean`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        alert('Failed to calculate numerology');
      }
    } catch (err) {
      console.error('Error calculating numerology:', err);
      alert('Failed to calculate numerology. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDetailedNumberMeaning = (number: number, context: string) => {
    const meanings: { [key: number]: { [key: string]: { title: string, description: string, strengths: string[], challenges: string[], advice: string } } } = {
      1: {
        life_path: {
          title: '🌟 The Leader & Pioneer',
          description: 'You are born to lead and innovate. Your path is about developing independence, courage, and original thinking. You have natural leadership abilities and a strong drive to achieve. Your journey involves learning to stand on your own, trust your instincts, and pioneer new directions.',
          strengths: ['Natural leadership ability', 'Strong willpower and determination', 'Independent and self-reliant', 'Creative and original thinker', 'Courageous and pioneering spirit'],
          challenges: ['Can be overly dominant or aggressive', 'May struggle with collaboration', 'Tendency towards self-centeredness', 'Impatience with others', 'Difficulty accepting help'],
          advice: 'Balance your independence with teamwork. Your leadership shines brightest when you inspire others rather than dominate. Take calculated risks but remain humble. Your pioneering spirit can open doors for many.'
        },
        destiny: {
          title: '👑 Destined for Leadership',
          description: 'Your destiny is to be a trailblazer and inspire others through your achievements. You are meant to take charge, make important decisions, and create new pathways. Your name carries the energy of authority and innovation.',
          strengths: ['Executive abilities', 'Natural authority', 'Innovative mindset', 'Confidence in decision-making', 'Ability to motivate others'],
          challenges: ['Dealing with subordination', 'Sharing credit', 'Being patient with slower processes', 'Handling criticism'],
          advice: 'Embrace positions of authority but lead with compassion. Your destiny unfolds when you use your power to uplift others while achieving personal ambitions.'
        },
        soul: {
          title: '💫 Inner Drive for Achievement',
          description: 'Deep inside, you crave independence and recognition. Your soul desires to be first, to achieve, and to make a unique mark on the world. You have an inner fire that pushes you towards excellence and distinction.',
          strengths: ['Strong inner motivation', 'Clear sense of purpose', 'Self-confidence', 'Ambitious nature', 'Desire for excellence'],
          challenges: ['Inner restlessness', 'Fear of failure', 'Need for constant validation', 'Difficulty relaxing'],
          advice: 'Honor your need for achievement while finding inner peace. True success comes from within, not just external accomplishments.'
        },
        personality: {
          title: '✨ The Confident Presence',
          description: 'You project confidence, strength, and capability. Others see you as a leader and decision-maker. Your presence commands attention and respect.',
          strengths: ['Strong first impression', 'Appears confident and capable', 'Natural charisma', 'Inspiring presence'],
          challenges: ['May seem intimidating', 'Can appear too self-assured', 'Others might feel overshadowed'],
          advice: 'Use your commanding presence wisely. Show vulnerability occasionally to help others connect with you more deeply.'
        }
      },
      2: {
        life_path: {
          title: '🤝 The Diplomat & Peacemaker',
          description: 'Your life path is about cooperation, harmony, and partnership. You are here to bring people together, mediate conflicts, and create balance. Your sensitivity and intuition are your greatest gifts. You excel in situations requiring tact, diplomacy, and emotional intelligence.',
          strengths: ['Excellent mediator and peacemaker', 'Highly intuitive and sensitive', 'Natural cooperator', 'Patient and understanding', 'Great listener'],
          challenges: ['Overly sensitive to criticism', 'Difficulty making decisions alone', 'Tendency to avoid conflict', 'Can be too dependent on others', 'May suppress own needs'],
          advice: 'Your power lies in unity, not division. Trust your intuition and use your diplomatic skills to heal relationships. Learn to assert your needs while maintaining harmony.'
        },
        destiny: {
          title: '💝 Destined for Partnership',
          description: 'You are meant to work in partnership and bring people together. Your name vibration attracts situations requiring cooperation, diplomacy, and emotional sensitivity.',
          strengths: ['Natural partnership ability', 'Diplomatic skills', 'Emotional intelligence', 'Ability to see both sides'],
          challenges: ['Difficulty working alone', 'Over-compromise', 'Indecisiveness', 'Being taken for granted'],
          advice: 'Your destiny flourishes in collaboration. Choose partnerships wisely and maintain healthy boundaries.'
        },
        soul: {
          title: '❤️ Craving Connection',
          description: 'Your soul deeply desires love, companionship, and meaningful relationships. You need to feel connected and understood. Harmony and peace are essential to your inner well-being.',
          strengths: ['Deep capacity for love', 'Empathetic nature', 'Desire for harmony', 'Loyal and devoted'],
          challenges: ['Fear of loneliness', 'Over-dependence', 'Avoiding necessary conflicts', 'Losing self in relationships'],
          advice: 'Cultivate inner peace first. Your relationships thrive when you come from a place of wholeness, not neediness.'
        },
        personality: {
          title: '🌸 The Gentle Soul',
          description: 'Others perceive you as kind, gentle, and approachable. You have a calming presence that makes people feel safe and understood.',
          strengths: ['Warm and friendly demeanor', 'Non-threatening presence', 'Easy to approach', 'Trustworthy impression'],
          challenges: ['May seem too passive', 'Can be underestimated', 'Others might take advantage'],
          advice: 'Your gentle nature is a strength. Stand firm when needed while maintaining your compassionate essence.'
        }
      },
      3: {
        life_path: {
          title: '🎨 The Creative Communicator',
          description: 'Your path is one of self-expression, creativity, and joy. You are here to inspire others through your artistic abilities, words, and optimistic outlook. Your life is about spreading joy, beauty, and inspiration.',
          strengths: ['Highly creative and artistic', 'Excellent communicator', 'Natural entertainer', 'Optimistic and joyful', 'Inspiring to others'],
          challenges: ['Scattered energy', 'Difficulty focusing', 'Tendency to be superficial', 'Avoiding serious matters', 'Over-sensitivity to criticism'],
          advice: 'Channel your creative energy into meaningful projects. Your joy is contagious - use it to uplift others while staying grounded.'
        },
        destiny: {
          title: '🎭 Born to Express',
          description: 'Your destiny involves creative expression and communication. You are meant to bring beauty, joy, and inspiration into the world through your unique talents.',
          strengths: ['Artistic talents', 'Communication skills', 'Social abilities', 'Natural performer'],
          challenges: ['Staying focused', 'Taking things seriously', 'Completing projects', 'Managing finances'],
          advice: 'Your creative gifts are meant to be shared. Develop discipline to support your inspiration.'
        },
        soul: {
          title: '✨ Yearning for Expression',
          description: 'Your soul craves self-expression and creative freedom. You need outlets for your imagination and feelings. Joy and beauty feed your spirit.',
          strengths: ['Rich inner life', 'Creative imagination', 'Emotional depth', 'Love of beauty'],
          challenges: ['Inner restlessness', 'Mood fluctuations', 'Difficulty with routine', 'Need for constant stimulation'],
          advice: 'Honor your creative urges while building stability. Your inner child needs both freedom and structure.'
        },
        personality: {
          title: '🌟 The Charming Optimist',
          description: 'You radiate warmth, charm, and positivity. Others are drawn to your bright energy and creative spirit.',
          strengths: ['Magnetic personality', 'Positive energy', 'Entertaining', 'Uplifting presence'],
          challenges: ['May seem frivolous', 'Can appear unreliable', 'Others might not take you seriously'],
          advice: 'Your charm opens doors. Show your depth and reliability to earn lasting respect.'
        }
      },
      4: {
        life_path: {
          title: '🏗️ The Builder & Organizer',
          description: 'Your path is about creating solid foundations, establishing order, and building lasting structures. You are here to bring stability, practicality, and discipline to your endeavors. Your steady, methodical approach creates enduring value.',
          strengths: ['Practical and grounded', 'Excellent organizational skills', 'Disciplined and hardworking', 'Reliable and trustworthy', 'Attention to detail'],
          challenges: ['Rigidity and inflexibility', 'Resistance to change', 'Workaholism', 'Limited thinking', 'Difficulty with spontaneity'],
          advice: 'Your foundation-building skills are invaluable. Balance hard work with flexibility. Not everything needs to be perfect or controlled.'
        },
        destiny: {
          title: '🎯 Destined to Build',
          description: 'You are meant to create lasting structures, systems, and organizations. Your destiny involves bringing order, stability, and practical solutions to the world.',
          strengths: ['Management abilities', 'Systematic thinking', 'Practical wisdom', 'Reliability'],
          challenges: ['Resistance to new methods', 'Being too rigid', 'Overworking', 'Difficulty delegating'],
          advice: 'Build your legacy with wisdom and adaptability. True strength includes the ability to bend without breaking.'
        },
        soul: {
          title: '⚓ Craving Security',
          description: 'Your soul desires stability, security, and order. You need to feel grounded and in control. Structure and predictability bring you peace.',
          strengths: ['Inner stability', 'Strong values', 'Dedication', 'Sense of responsibility'],
          challenges: ['Fear of chaos', 'Need for excessive control', 'Difficulty with uncertainty', 'Inner rigidity'],
          advice: 'True security comes from inner strength, not external control. Practice trusting the process.'
        },
        personality: {
          title: '💼 The Dependable Professional',
          description: 'Others see you as reliable, practical, and trustworthy. You project an image of stability and competence.',
          strengths: ['Professional appearance', 'Dependable impression', 'Organized demeanor', 'Inspires confidence'],
          challenges: ['May seem boring or rigid', 'Can appear too serious', 'Others might find you inflexible'],
          advice: 'Your dependability is valuable. Show your fun side occasionally to become more approachable.'
        }
      },
      5: {
        life_path: {
          title: '🌍 The Freedom Seeker & Adventurer',
          description: 'Your path is about freedom, change, and diverse experiences. You are here to explore, adapt, and help others embrace transformation. Your versatility and love of variety drive you to constantly learn and grow.',
          strengths: ['Adaptable and versatile', 'Love of freedom and adventure', 'Quick learner', 'Excellent communicator', 'Progressive thinker'],
          challenges: ['Restlessness and inconsistency', 'Difficulty with commitment', 'Impulsiveness', 'Scattered focus', 'Avoiding responsibility'],
          advice: 'Your quest for freedom is valid, but true liberation includes responsibility. Ground your adventures with purpose.'
        },
        destiny: {
          title: '✈️ Destined for Adventure',
          description: 'You are meant to experience variety, change, and freedom. Your destiny involves breaking boundaries, exploring new frontiers, and helping others embrace change.',
          strengths: ['Adaptability', 'Communication skills', 'Progressive thinking', 'Ability to inspire change'],
          challenges: ['Commitment issues', 'Restlessness', 'Impulsive decisions', 'Lack of follow-through'],
          advice: 'Embrace change as your teacher. Your freedom expands when you master both movement and presence.'
        },
        soul: {
          title: '🦋 Yearning for Freedom',
          description: 'Your soul craves freedom, variety, and new experiences. You need space to explore and cannot tolerate restriction. Adventure feeds your spirit.',
          strengths: ['Adventurous spirit', 'Open-mindedness', 'Curiosity', 'Resilience'],
          challenges: ['Inner restlessness', 'Fear of commitment', 'Difficulty settling', 'Escapism tendencies'],
          advice: 'True freedom comes from inner liberation. External changes cannot satisfy an unfree mind.'
        },
        personality: {
          title: '⚡ The Dynamic Presence',
          description: 'You come across as exciting, unpredictable, and magnetic. Others are drawn to your energy and sense of adventure.',
          strengths: ['Exciting presence', 'Charismatic energy', 'Interesting conversationalist', 'Inspiring'],
          challenges: ['May seem unreliable', 'Can appear non-committal', 'Others might not trust you with serious matters'],
          advice: 'Your dynamism attracts opportunities. Show your reliable side to build lasting connections.'
        }
      },
      6: {
        life_path: {
          title: '💝 The Nurturer & Counselor',
          description: 'Your path is about love, responsibility, and service. You are here to create harmony, heal relationships, and provide guidance. Your caring nature and sense of duty drive you to make the world a better place.',
          strengths: ['Nurturing and compassionate', 'Strong sense of responsibility', 'Natural counselor', 'Creates harmony', 'Devoted to family and community'],
          challenges: ['Tendency to interfere', 'Difficulty saying no', 'Perfectionism', 'Martyrdom', 'Over-responsibility'],
          advice: 'Your caring heart is a gift. Remember that true service includes self-care. You cannot pour from an empty cup.'
        },
        destiny: {
          title: '🏡 Destined to Serve',
          description: 'You are meant to provide service, create beauty, and nurture others. Your destiny involves responsibility, teaching, and healing.',
          strengths: ['Counseling abilities', 'Teaching skills', 'Creating beauty', 'Service orientation'],
          challenges: ['Taking on too much', 'Perfectionist standards', 'Difficulty receiving', 'Sacrificing self'],
          advice: 'Your service is most powerful when you serve from abundance, not depletion. Practice receiving.'
        },
        soul: {
          title: '❤️‍🩹 Need to Nurture',
          description: 'Your soul craves giving love and creating harmony. You need to feel useful and appreciated. Caring for others fulfills your deepest needs.',
          strengths: ['Deep capacity to love', 'Desire to help', 'Empathetic nature', 'Need for beauty and harmony'],
          challenges: ['Co-dependency risks', 'Neglecting self', 'Approval-seeking', 'Difficulty with boundaries'],
          advice: 'Love yourself as deeply as you love others. Your worth is not dependent on what you do for others.'
        },
        personality: {
          title: '🌺 The Caring Presence',
          description: 'Others see you as caring, responsible, and trustworthy. You project warmth and make people feel safe.',
          strengths: ['Warm and welcoming', 'Trustworthy appearance', 'Nurturing presence', 'Approachable'],
          challenges: ['May be taken advantage of', 'Can seem too involved', 'Others might become dependent'],
          advice: 'Your caring nature attracts those in need. Maintain boundaries to avoid burnout.'
        }
      },
      7: {
        life_path: {
          title: '🔮 The Seeker & Mystic',
          description: 'Your path is about seeking truth, wisdom, and spiritual understanding. You are here to analyze, contemplate, and discover deeper meanings. Your journey involves developing your intuition and inner knowledge.',
          strengths: ['Analytical and perceptive', 'Strong intuition', 'Spiritual depth', 'Love of learning', 'Independent thinker'],
          challenges: ['Tendency towards isolation', 'Difficulty trusting others', 'Perfectionism', 'Overthinking', 'Emotional aloofness'],
          advice: 'Your quest for truth is noble. Balance solitude with connection. Share your wisdom to make it meaningful.'
        },
        destiny: {
          title: '📚 Destined for Wisdom',
          description: 'You are meant to seek knowledge, develop expertise, and share profound insights. Your destiny involves teaching, researching, or spiritual work.',
          strengths: ['Research abilities', 'Teaching potential', 'Spiritual gifts', 'Analytical skills'],
          challenges: ['Social isolation', 'Difficulty with practical matters', 'Perfectionist standards', 'Skepticism'],
          advice: 'Your wisdom deepens through both study and experience. Ground your insights in practical application.'
        },
        soul: {
          title: '🧘 Craving Understanding',
          description: 'Your soul yearns for knowledge, truth, and spiritual connection. You need solitude to process and understand life deeply.',
          strengths: ['Philosophical nature', 'Quest for truth', 'Spiritual awareness', 'Inner wisdom'],
          challenges: ['Loneliness', 'Difficulty connecting emotionally', 'Over-analysis', 'Spiritual bypassing'],
          advice: 'True wisdom integrates mind, heart, and spirit. Do not use knowledge to avoid feeling.'
        },
        personality: {
          title: '🎓 The Wise Observer',
          description: 'Others perceive you as intelligent, mysterious, and profound. You project an air of knowledge and depth.',
          strengths: ['Intelligent impression', 'Intriguing presence', 'Appears knowledgeable', 'Respectable'],
          challenges: ['May seem aloof or distant', 'Can appear judgmental', 'Others might find you intimidating'],
          advice: 'Your depth is attractive. Show your human side to help others feel comfortable approaching you.'
        }
      },
      8: {
        life_path: {
          title: '💼 The Powerhouse & Achiever',
          description: 'Your path is about mastering the material world, achieving success, and exercising authority. You are here to build empires, create abundance, and demonstrate what is possible through determination and vision.',
          strengths: ['Natural business sense', 'Leadership and authority', 'Ambitious and driven', 'Good judgment', 'Organized and efficient'],
          challenges: ['Materialism', 'Workaholism', 'Abuse of power', 'Difficulty with emotions', 'Impatience'],
          advice: 'Your power is meant to create positive change. Success with integrity creates lasting legacy. Balance ambition with compassion.'
        },
        destiny: {
          title: '👑 Destined for Power',
          description: 'You are meant to achieve material success, lead organizations, and make a significant impact. Your destiny involves authority, abundance, and influence.',
          strengths: ['Executive abilities', 'Financial acumen', 'Leadership skills', 'Strategic thinking'],
          challenges: ['Maintaining integrity', 'Balancing work and life', 'Avoiding manipulation', 'Sharing power'],
          advice: 'Your success inspires others. Lead with ethics and use your power to elevate those around you.'
        },
        soul: {
          title: '💎 Craving Achievement',
          description: 'Your soul desires recognition, achievement, and material success. You need to feel powerful and accomplished. Building and creating fulfills you.',
          strengths: ['Strong drive', 'Ambitious nature', 'Desire for excellence', 'Vision for success'],
          challenges: ['Never feeling enough', 'Defining self by achievements', 'Difficulty relaxing', 'Fear of failure'],
          advice: 'True power comes from inner confidence, not external achievements. Your worth is inherent.'
        },
        personality: {
          title: '🏆 The Authority Figure',
          description: 'Others see you as powerful, successful, and authoritative. You project confidence and capability.',
          strengths: ['Commanding presence', 'Appears successful', 'Inspires confidence', 'Professional image'],
          challenges: ['Can seem intimidating', 'May appear materialistic', 'Others might feel inadequate around you'],
          advice: 'Your powerful presence is an asset. Show humility and accessibility to build genuine connections.'
        }
      },
      9: {
        life_path: {
          title: '🌏 The Humanitarian & Healer',
          description: 'Your path is about compassion, service, and completion. You are here to help humanity, embrace diversity, and facilitate transformation. Your journey involves developing universal love and letting go.',
          strengths: ['Compassionate and humanitarian', 'Artistic and creative', 'Wise and understanding', 'Selfless service', 'Universal perspective'],
          challenges: ['Difficulty with boundaries', 'Emotional overwhelm', 'Martyrdom', 'Difficulty letting go', 'Living in the past'],
          advice: 'Your compassion can change the world. Practice discernment in your giving. Release what no longer serves.'
        },
        destiny: {
          title: '🕊️ Destined to Serve Humanity',
          description: 'You are meant to serve the greater good, heal others, and demonstrate universal love. Your destiny involves artistic expression, teaching, or humanitarian work.',
          strengths: ['Healing abilities', 'Artistic talents', 'Teaching skills', 'Humanitarian vision'],
          challenges: ['Personal relationships', 'Setting boundaries', 'Accepting endings', 'Avoiding martyrdom'],
          advice: 'Your service is most effective when grounded in self-love. Fill your cup first, then give.'
        },
        soul: {
          title: '💫 Yearning to Serve',
          description: 'Your soul craves meaning, purpose, and opportunities to help others. You need to feel your life makes a difference. Compassion and understanding feed your spirit.',
          strengths: ['Deep empathy', 'Desire to heal', 'Love for humanity', 'Spiritual awareness'],
          challenges: ['Emotional overload', 'Absorbing others pain', 'Difficulty with self-focus', 'Struggle with completion'],
          advice: 'Honor your compassionate nature while protecting your energy. You can only give what you have.'
        },
        personality: {
          title: '🌈 The Compassionate Sage',
          description: 'Others perceive you as wise, compassionate, and idealistic. You project an aura of understanding and acceptance.',
          strengths: ['Approachable and kind', 'Non-judgmental presence', 'Inspiring idealism', 'Wise appearance'],
          challenges: ['May be taken advantage of', 'Can seem impractical', 'Others might not take you seriously'],
          advice: 'Your compassion attracts those in need. Maintain boundaries to sustain your energy for service.'
        }
      }
    };

    const defaultMeaning = {
      title: '✨ Unique Vibration',
      description: 'This number carries special energy and significance in your numerology chart.',
      strengths: ['Unique qualities', 'Special abilities', 'Distinctive path'],
      challenges: ['Understanding your path', 'Developing your gifts'],
      advice: 'Explore the deeper meaning of this number in your life journey.'
    };

    return meanings[number]?.[context] || defaultMeaning;
  };

  const numerologyMeanings = [
    { number: 1, title: 'Number 1', meaning: 'Leadership and independence', icon: Star, color: 'from-red-500 to-orange-500' },
    { number: 2, title: 'Number 2', meaning: 'Cooperation and balance', icon: Users, color: 'from-orange-500 to-yellow-500' },
    { number: 3, title: 'Number 3', meaning: 'Creativity and expression', icon: Sparkles, color: 'from-yellow-500 to-green-500' },
    { number: 4, title: 'Number 4', meaning: 'Stability and foundation', icon: Briefcase, color: 'from-green-500 to-teal-500' },
    { number: 5, title: 'Number 5', meaning: 'Freedom and adventure', icon: TrendingUp, color: 'from-teal-500 to-blue-500' },
    { number: 6, title: 'Number 6', meaning: 'Harmony and responsibility', icon: Heart, color: 'from-blue-500 to-indigo-500' },
    { number: 7, title: 'Number 7', meaning: 'Wisdom and spirituality', icon: Star, color: 'from-indigo-500 to-purple-500' },
    { number: 8, title: 'Number 8', meaning: 'Power and abundance', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
    { number: 9, title: 'Number 9', meaning: 'Compassion and completion', icon: Heart, color: 'from-pink-500 to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 p-4 md:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Calculator className="w-10 h-10 text-purple-400" strokeWidth={2} />
            Advanced Numerology Analysis
          </h1>
          <p className="text-slate-400 mt-4 text-lg">Complete numerological profile with life cycles, pinnacles, and challenges</p>
        </div>

        {/* Tab Navigation */}
        {results && !results.error && (
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-2">
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: Star },
                { id: 'cycles', label: 'Life Cycles', icon: TrendingUp },
                { id: 'challenges', label: 'Pinnacles', icon: Mountain },
                { id: 'compatibility', label: 'Insights', icon: Compass },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Calculator Form */}
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Hash className="w-6 h-6 text-purple-400" />
            Calculate Your Numbers
          </h2>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-white placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                'Calculate'
              )}
            </button>
          </form>
        </div>

        {/* Results Display */}
        {results && !results.error && (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-400" />
                Your Numerology Profile
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Life Path Number */}
                {results.life_path && (
                  <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all hover:shadow-xl hover:shadow-purple-500/20 hover:scale-105">
                    <div className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wider">Life Path</div>
                    <div className="text-5xl font-bold text-purple-400 mb-3">{results.life_path.number}</div>
                    <div className="text-sm text-slate-300">{results.life_path.meaning}</div>
                  </div>
                )}
                
                {/* Expression Number */}
                {results.expression && (
                  <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 rounded-2xl p-6 border border-pink-500/30 hover:border-pink-400/50 transition-all hover:shadow-xl hover:shadow-pink-500/20 hover:scale-105">
                    <div className="text-sm font-semibold text-pink-300 mb-2 uppercase tracking-wider">Expression</div>
                    <div className="text-5xl font-bold text-pink-400 mb-3">{results.expression.number}</div>
                    <div className="text-sm text-slate-300">{results.expression.meaning}</div>
                  </div>
                )}
                
                {/* Soul Urge Number */}
                {results.soul_urge && (
                  <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105">
                    <div className="text-sm font-semibold text-blue-300 mb-2 uppercase tracking-wider">Soul Urge</div>
                    <div className="text-5xl font-bold text-blue-400 mb-3">{results.soul_urge.number}</div>
                    <div className="text-sm text-slate-300">{results.soul_urge.meaning}</div>
                  </div>
                )}
                
                {/* Personality Number */}
                {results.personality && (
                  <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-2xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all hover:shadow-xl hover:shadow-green-500/20 hover:scale-105">
                    <div className="text-sm font-semibold text-green-300 mb-2 uppercase tracking-wider">Personality</div>
                    <div className="text-5xl font-bold text-green-400 mb-3">{results.personality.number}</div>
                    <div className="text-sm text-slate-300">{results.personality.meaning}</div>
                  </div>
                )}
              </div>

              {/* Additional Numbers Row */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Maturity Number */}
                {results.maturity && (
                  <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 rounded-2xl p-6 border border-amber-500/30 hover:border-amber-400/50 transition-all hover:shadow-xl hover:shadow-amber-500/20 hover:scale-105">
                    <div className="text-sm font-semibold text-amber-300 mb-2 uppercase tracking-wider">Maturity Number</div>
                    <div className="text-5xl font-bold text-amber-400 mb-3">{results.maturity.number}</div>
                    <div className="text-sm text-slate-300">{results.maturity.meaning}</div>
                  </div>
                )}
                
                {/* Personal Year */}
                {results.personal_year && (
                  <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all hover:shadow-xl hover:shadow-cyan-500/20 hover:scale-105">
                    <div className="text-sm font-semibold text-cyan-300 mb-2 uppercase tracking-wider">Personal Year 2025</div>
                    <div className="text-5xl font-bold text-cyan-400 mb-3">{results.personal_year.number}</div>
                    <div className="text-sm text-slate-300">{results.personal_year.meaning}</div>
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Life Cycles Tab */}
            {activeTab === 'cycles' && formData.birthDate && (
              <div className="max-w-6xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                  9-Year Personal Cycle
                </h2>
                
                <div className="space-y-4">
                  {Array.from({ length: 9 }, (_, i) => {
                    const currentYear = new Date().getFullYear();
                    const year = currentYear - 4 + i;
                    const birthDate = new Date(formData.birthDate);
                    
                    const reduceToSingle = (num: number): number => {
                      while (num > 9) {
                        const digits = num.toString().split('');
                        num = digits.reduce((sum, digit) => sum + parseInt(digit), 0);
                      }
                      return num;
                    };
                    
                    const dayReduced = reduceToSingle(birthDate.getDate());
                    const monthReduced = reduceToSingle(birthDate.getMonth() + 1);
                    const yearReduced = reduceToSingle(year);
                    const personalYear = reduceToSingle(dayReduced + monthReduced + yearReduced);
                    
                    const isCurrent = year === currentYear;
                    
                    const yearMeanings: { [key: number]: { theme: string, focus: string, advice: string } } = {
                      1: { theme: 'New Beginnings', focus: 'Fresh starts, independence, leadership', advice: 'Take initiative and start new projects' },
                      2: { theme: 'Cooperation & Balance', focus: 'Partnerships, diplomacy, patience', advice: 'Focus on relationships and teamwork' },
                      3: { theme: 'Creative Expression', focus: 'Self-expression, joy, socializing', advice: 'Express yourself and enjoy life' },
                      4: { theme: 'Building Foundation', focus: 'Hard work, stability, organization', advice: 'Focus on practical matters and structure' },
                      5: { theme: 'Change & Freedom', focus: 'Adventure, versatility, progress', advice: 'Embrace change and new experiences' },
                      6: { theme: 'Love & Responsibility', focus: 'Family, home, service to others', advice: 'Nurture relationships and take care of others' },
                      7: { theme: 'Inner Wisdom', focus: 'Spirituality, introspection, analysis', advice: 'Seek knowledge and inner truth' },
                      8: { theme: 'Power & Achievement', focus: 'Success, authority, material abundance', advice: 'Focus on career and financial goals' },
                      9: { theme: 'Completion & Release', focus: 'Endings, humanitarianism, closure', advice: 'Let go and prepare for new cycles' }
                    };
                    
                    const yearInfo = yearMeanings[personalYear];
                    
                    return (
                      <div
                        key={year}
                        className={`relative flex items-center gap-6 p-6 rounded-2xl transition-all ${
                          isCurrent
                            ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-400/50 shadow-lg shadow-purple-500/30 scale-105'
                            : 'bg-slate-700/30 border border-slate-600/30 hover:border-slate-500/50'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-lg ${
                          isCurrent ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-slate-600/50 text-slate-300'
                        }`}>
                          {year}
                        </div>
                        
                        <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl ${
                          isCurrent ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg' : 'bg-slate-600/50 text-slate-200'
                        }`}>
                          {personalYear}
                        </div>
                        
                        <div className="flex-grow">
                          <div className={`text-lg font-bold mb-1 ${isCurrent ? 'text-purple-200' : 'text-slate-200'}`}>
                            {yearInfo.theme}
                            {isCurrent && <span className="ml-3 px-3 py-1 bg-purple-500/30 text-purple-200 text-sm rounded-full">Current Year</span>}
                          </div>
                          <div className={`text-sm mb-2 ${isCurrent ? 'text-purple-300' : 'text-slate-400'}`}>{yearInfo.focus}</div>
                          <div className={`text-xs italic ${isCurrent ? 'text-purple-400' : 'text-slate-500'}`}>💡 {yearInfo.advice}</div>
                        </div>
                        
                        <div className="flex-shrink-0 w-24">
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${isCurrent ? 'bg-gradient-to-r from-purple-500 to-pink-500' : year < currentYear ? 'bg-slate-500' : 'bg-slate-600'}`}
                              style={{ width: year < currentYear ? '100%' : year === currentYear ? '50%' : '0%' }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl">
                  <h3 className="text-lg font-bold text-purple-200 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Understanding Your 9-Year Cycle
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Life unfolds in 9-year cycles, each year carrying unique energies. Your Personal Year Number reveals themes and opportunities. 
                    Year 1 starts new cycles, while Year 9 completes them. Understanding these patterns helps you align actions with cosmic timing 
                    for maximum success and fulfillment.
                  </p>
                </div>

                {/* Life Graph Visualization */}
                <div className="mt-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-cyan-400" />
                    Life Energy Graph - 9-Year Wave Pattern
                  </h2>

                  {(() => {
                    const currentYear = new Date().getFullYear();
                    const birthDate = new Date(formData.birthDate);
                    const startYear = currentYear - 4;
                    
                    const reduceToSingle = (num: number): number => {
                      while (num > 9) {
                        const digits = num.toString().split('');
                        num = digits.reduce((sum, digit) => sum + parseInt(digit), 0);
                      }
                      return num;
                    };

                    const years = Array.from({ length: 9 }, (_, i) => {
                      const year = startYear + i;
                      const dayReduced = reduceToSingle(birthDate.getDate());
                      const monthReduced = reduceToSingle(birthDate.getMonth() + 1);
                      const yearReduced = reduceToSingle(year);
                      const personalYear = reduceToSingle(dayReduced + monthReduced + yearReduced);
                      return { year, personalYear, isCurrent: year === currentYear };
                    });

                    const maxValue = 9;
                    const graphHeight = 300;

                    return (
                      <div className="space-y-6">
                        {/* Graph */}
                        <div className="relative bg-slate-900/50 rounded-2xl p-8 border border-slate-700/30">
                          {/* Y-axis labels */}
                          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between py-8 text-xs text-slate-400">
                            {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(val => (
                              <div key={val} className="text-right pr-2">{val}</div>
                            ))}
                          </div>

                          {/* Graph area */}
                          <div className="ml-12 relative" style={{ height: `${graphHeight}px` }}>
                            {/* Horizontal grid lines */}
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(val => (
                              <div
                                key={val}
                                className="absolute left-0 right-0 border-t border-slate-700/30"
                                style={{ bottom: `${((val - 1) / (maxValue - 1)) * 100}%` }}
                              />
                            ))}

                            {/* Graph line and points */}
                            <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                              <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#a855f7" />
                                  <stop offset="50%" stopColor="#ec4899" />
                                  <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              
                              {/* Area under curve */}
                              <path
                                d={`
                                  M 0 ${graphHeight}
                                  ${years.map((item, idx) => {
                                    const x = (idx / (years.length - 1)) * 100;
                                    const y = graphHeight - ((item.personalYear - 1) / (maxValue - 1)) * graphHeight;
                                    return `${idx === 0 ? 'M' : 'L'} ${x}% ${y}`;
                                  }).join(' ')}
                                  L 100% ${graphHeight}
                                  Z
                                `}
                                fill="url(#areaGradient)"
                              />

                              {/* Line */}
                              <path
                                d={years.map((item, idx) => {
                                  const x = (idx / (years.length - 1)) * 100;
                                  const y = graphHeight - ((item.personalYear - 1) / (maxValue - 1)) * graphHeight;
                                  return `${idx === 0 ? 'M' : 'L'} ${x}% ${y}`;
                                }).join(' ')}
                                fill="none"
                                stroke="url(#lineGradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />

                              {/* Points */}
                              {years.map((item, idx) => {
                                const x = (idx / (years.length - 1)) * 100;
                                const y = graphHeight - ((item.personalYear - 1) / (maxValue - 1)) * graphHeight;
                                return (
                                  <g key={idx}>
                                    {item.isCurrent && (
                                      <circle
                                        cx={`${x}%`}
                                        cy={y}
                                        r="12"
                                        fill="#a855f7"
                                        opacity="0.2"
                                      >
                                        <animate
                                          attributeName="r"
                                          values="12;18;12"
                                          dur="2s"
                                          repeatCount="indefinite"
                                        />
                                      </circle>
                                    )}
                                    <circle
                                      cx={`${x}%`}
                                      cy={y}
                                      r={item.isCurrent ? "8" : "6"}
                                      fill={item.isCurrent ? "#a855f7" : "#64748b"}
                                      stroke={item.isCurrent ? "#fff" : "#475569"}
                                      strokeWidth="2"
                                      className="transition-all hover:r-10"
                                    />
                                    <text
                                      x={`${x}%`}
                                      y={y}
                                      dy="-15"
                                      textAnchor="middle"
                                      fill={item.isCurrent ? "#a855f7" : "#94a3b8"}
                                      fontSize="14"
                                      fontWeight={item.isCurrent ? "bold" : "normal"}
                                    >
                                      {item.personalYear}
                                    </text>
                                  </g>
                                );
                              })}
                            </svg>
                          </div>

                          {/* X-axis labels */}
                          <div className="ml-12 flex justify-between mt-4 text-xs text-slate-400">
                            {years.map((item, idx) => (
                              <div 
                                key={idx} 
                                className={`text-center ${item.isCurrent ? 'text-purple-400 font-bold' : ''}`}
                              >
                                {item.year}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-4 rounded-xl border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                              <span className="text-purple-300 font-semibold">Current Year</span>
                            </div>
                            <p className="text-slate-400 text-xs">Your active energy cycle</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 p-4 rounded-xl border border-cyan-500/30">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-cyan-400" />
                              <span className="text-cyan-300 font-semibold">Rising Energy</span>
                            </div>
                            <p className="text-slate-400 text-xs">Numbers 1-5: Building momentum</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 p-4 rounded-xl border border-amber-500/30">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="w-4 h-4 text-amber-400" />
                              <span className="text-amber-300 font-semibold">Peak & Release</span>
                            </div>
                            <p className="text-slate-400 text-xs">Numbers 6-9: Achievement & completion</p>
                          </div>
                        </div>

                        {/* Interpretation */}
                        <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-6">
                          <h3 className="text-lg font-bold text-indigo-300 mb-3 flex items-center gap-2">
                            <Compass className="w-5 h-5" />
                            Reading Your Life Graph
                          </h3>
                          <div className="space-y-3 text-sm text-slate-300">
                            <p>
                              <strong className="text-indigo-400">Wave Pattern:</strong> Your life energy flows in natural waves. 
                              Lower numbers (1-3) represent new beginnings and foundation building. Mid-range (4-6) brings stability and responsibility. 
                              Higher numbers (7-9) offer wisdom, achievement, and completion.
                            </p>
                            <p>
                              <strong className="text-indigo-400">Current Position:</strong> The highlighted point shows where you are now in your cycle. 
                              Look at the trajectory - are you ascending (building energy) or descending (releasing and completing)? 
                              This helps you understand whether to initiate or consolidate.
                            </p>
                            <p>
                              <strong className="text-indigo-400">Planning Ahead:</strong> Use future years to plan major life decisions. 
                              Year 1 is ideal for new ventures, Year 5 for changes, Year 8 for career moves, and Year 9 for letting go of what no longer serves you.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Pinnacles and Challenges Tab */}
            {activeTab === 'challenges' && formData.birthDate && (() => {
              const { pinnacles, challenges, lifePath } = calculatePinnaclesAndChallenges(formData.birthDate);
              const currentAge = new Date().getFullYear() - new Date(formData.birthDate).getFullYear();
              
              return (
                <div className="space-y-8">
                  {/* Pinnacles */}
                  <div className="max-w-6xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                      <Mountain className="w-8 h-8 text-purple-400" />
                      Life Pinnacles - Your Success Cycles
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {pinnacles.map((pinnacle, idx) => {
                        const ages = pinnacle.age.split('-');
                        const startAge = parseInt(ages[0]);
                        const endAge = ages[1] === '+' ? 999 : parseInt(ages[1]);
                        const isActive = currentAge >= startAge && currentAge <= endAge;
                        
                        const pinnacleColors = [
                          'from-blue-600/20 to-blue-800/20 border-blue-500/30',
                          'from-green-600/20 to-green-800/20 border-green-500/30',
                          'from-amber-600/20 to-amber-800/20 border-amber-500/30',
                          'from-purple-600/20 to-purple-800/20 border-purple-500/30'
                        ];
                        
                        return (
                          <div
                            key={idx}
                            className={`bg-gradient-to-br ${pinnacleColors[idx]} rounded-2xl p-6 border ${
                              isActive ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-500/30' : ''
                            } transition-all hover:scale-105`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{pinnacle.period}</div>
                                <div className="text-xs text-slate-400 mt-1">Ages {pinnacle.age}</div>
                              </div>
                              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                {pinnacle.number}
                              </div>
                            </div>
                            <div className="text-sm text-slate-300 mb-2">{pinnacle.description}</div>
                            {isActive && (
                              <div className="mt-3 px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full inline-block">
                                <Crown className="w-3 h-3 inline mr-1" />
                                Currently Active
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl">
                      <h3 className="text-lg font-bold text-blue-200 mb-3">About Pinnacles</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Pinnacles represent major life periods and the opportunities they bring. Each pinnacle offers unique lessons and growth potential. 
                        Your current age ({currentAge}) places you in a specific pinnacle cycle. Understanding this helps you maximize the energy available to you now.
                      </p>
                    </div>
                  </div>

                  {/* Challenges */}
                  <div className="max-w-6xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                      <Target className="w-8 h-8 text-pink-400" />
                      Life Challenges - Growth Opportunities
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {challenges.map((challenge, idx) => {
                        const challengeColors = [
                          'from-rose-600/20 to-rose-800/20 border-rose-500/30',
                          'from-orange-600/20 to-orange-800/20 border-orange-500/30',
                          'from-red-600/20 to-red-800/20 border-red-500/30',
                          'from-pink-600/20 to-pink-800/20 border-pink-500/30'
                        ];
                        
                        const challengeMeanings: { [key: number]: string } = {
                          0: 'No specific challenge - you have freedom to choose your path',
                          1: 'Learn independence and self-reliance',
                          2: 'Develop cooperation and overcome sensitivity',
                          3: 'Express yourself and avoid scattering energy',
                          4: 'Build discipline and overcome limitations',
                          5: 'Handle change and avoid impulsiveness',
                          6: 'Balance responsibility without being controlling',
                          7: 'Trust and open up emotionally',
                          8: 'Balance material and spiritual, avoid domination'
                        };
                        
                        return (
                          <div
                            key={idx}
                            className={`bg-gradient-to-br ${challengeColors[idx]} rounded-2xl p-6 border transition-all hover:scale-105`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{challenge.period}</div>
                              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                {challenge.number}
                              </div>
                            </div>
                            <div className="text-sm text-slate-300 mb-2">{challenge.description}</div>
                            <div className="text-xs text-slate-400 italic mt-3">
                              {challengeMeanings[challenge.number] || 'Work on overcoming obstacles in this area'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="p-6 bg-gradient-to-r from-pink-600/10 to-rose-600/10 border border-pink-500/20 rounded-2xl">
                      <h3 className="text-lg font-bold text-pink-200 mb-3">Understanding Challenges</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Challenges are not obstacles but opportunities for growth. They represent areas where you'll develop strength and wisdom. 
                        The Main Challenge (third) is your primary life lesson. Embrace these challenges to unlock your full potential.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Insights Tab - Comprehensive AI-Powered Analysis */}
            {activeTab === 'compatibility' && (
              <div className="max-w-6xl mx-auto space-y-8">
                {/* Life Path Deep Dive */}
                {results.life_path && (() => {
                  const analysis = getDetailedNumberMeaning(results.life_path.number, 'life_path');
                  return (
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                      <h2 className="text-3xl font-bold text-white mb-2">{analysis.title}</h2>
                      <p className="text-purple-300 mb-6">Life Path {results.life_path.number}</p>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-3">✨ Your Life Purpose</h3>
                          <p className="text-slate-300 leading-relaxed">{analysis.description}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-6 bg-gradient-to-br from-green-600/10 to-green-800/10 border border-green-500/20 rounded-2xl">
                            <h4 className="text-md font-bold text-green-200 mb-3 flex items-center gap-2">
                              💪 Your Strengths
                            </h4>
                            <ul className="space-y-2">
                              {analysis.strengths.map((strength: string, idx: number) => (
                                <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="text-green-400">✓</span>
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="p-6 bg-gradient-to-br from-amber-600/10 to-amber-800/10 border border-amber-500/20 rounded-2xl">
                            <h4 className="text-md font-bold text-amber-200 mb-3 flex items-center gap-2">
                              ⚠️ Growth Areas
                            </h4>
                            <ul className="space-y-2">
                              {analysis.challenges.map((challenge: string, idx: number) => (
                                <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="text-amber-400">•</span>
                                  <span>{challenge}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl">
                          <h4 className="text-md font-bold text-purple-200 mb-3 flex items-center gap-2">
                            💡 Wisdom & Guidance
                          </h4>
                          <p className="text-slate-300 text-sm leading-relaxed">{analysis.advice}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Expression Number Analysis */}
                {results.expression && (() => {
                  const analysis = getDetailedNumberMeaning(results.expression.number, 'destiny');
                  return (
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                      <h2 className="text-3xl font-bold text-white mb-2">{analysis.title}</h2>
                      <p className="text-pink-300 mb-6">Expression/Destiny Number {results.expression.number}</p>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-3">🎯 Your Destiny & Potential</h3>
                          <p className="text-slate-300 leading-relaxed">{analysis.description}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-6 bg-gradient-to-br from-green-600/10 to-green-800/10 border border-green-500/20 rounded-2xl">
                            <h4 className="text-md font-bold text-green-200 mb-3">Natural Abilities</h4>
                            <ul className="space-y-2">
                              {analysis.strengths.map((strength: string, idx: number) => (
                                <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="text-green-400">✓</span>
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="p-6 bg-gradient-to-br from-amber-600/10 to-amber-800/10 border border-amber-500/20 rounded-2xl">
                            <h4 className="text-md font-bold text-amber-200 mb-3">Obstacles to Master</h4>
                            <ul className="space-y-2">
                              {analysis.challenges.map((challenge: string, idx: number) => (
                                <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="text-amber-400">•</span>
                                  <span>{challenge}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="p-6 bg-gradient-to-r from-pink-600/10 to-rose-600/10 border border-pink-500/20 rounded-2xl">
                          <h4 className="text-md font-bold text-pink-200 mb-3">Path to Fulfillment</h4>
                          <p className="text-slate-300 text-sm leading-relaxed">{analysis.advice}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Soul Urge Deep Analysis */}
                {results.soul_urge && (() => {
                  const analysis = getDetailedNumberMeaning(results.soul_urge.number, 'soul');
                  return (
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                      <h2 className="text-3xl font-bold text-white mb-2">{analysis.title}</h2>
                      <p className="text-blue-300 mb-6">Soul Urge Number {results.soul_urge.number}</p>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-3">❤️ Your Heart's Deepest Desires</h3>
                          <p className="text-slate-300 leading-relaxed">{analysis.description}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-6 bg-gradient-to-br from-green-600/10 to-green-800/10 border border-green-500/20 rounded-2xl">
                            <h4 className="text-md font-bold text-green-200 mb-3">Inner Gifts</h4>
                            <ul className="space-y-2">
                              {analysis.strengths.map((strength: string, idx: number) => (
                                <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="text-green-400">✓</span>
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="p-6 bg-gradient-to-br from-amber-600/10 to-amber-800/10 border border-amber-500/20 rounded-2xl">
                            <h4 className="text-md font-bold text-amber-200 mb-3">Inner Struggles</h4>
                            <ul className="space-y-2">
                              {analysis.challenges.map((challenge: string, idx: number) => (
                                <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="text-amber-400">•</span>
                                  <span>{challenge}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="p-6 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl">
                          <h4 className="text-md font-bold text-blue-200 mb-3">Nurturing Your Soul</h4>
                          <p className="text-slate-300 text-sm leading-relaxed">{analysis.advice}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Personality Number Analysis */}
                {results.personality && (() => {
                  const analysis = getDetailedNumberMeaning(results.personality.number, 'personality');
                  return (
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                      <h2 className="text-3xl font-bold text-white mb-2">{analysis.title}</h2>
                      <p className="text-green-300 mb-6">Personality Number {results.personality.number}</p>
                      <p className="text-slate-300 text-lg leading-relaxed mb-6">{analysis.description}</p>

                      {/* Strengths and Challenges Grid */}
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Strengths */}
                        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 rounded-2xl border border-green-700/50">
                          <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Key Strengths
                          </h3>
                          <ul className="space-y-2">
                            {analysis.strengths.map((strength, idx) => (
                              <li key={idx} className="text-green-100 text-sm flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Challenges */}
                        <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 p-6 rounded-2xl border border-amber-700/50">
                          <h3 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Growth Areas
                          </h3>
                          <ul className="space-y-2">
                            {analysis.challenges.map((challenge, idx) => (
                              <li key={idx} className="text-amber-100 text-sm flex items-start gap-2">
                                <span className="text-amber-400 mt-1">!</span>
                                <span>{challenge}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Personalized Advice */}
                      <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-2xl border border-purple-700/50">
                        <h3 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5" />
                          Personalized Guidance
                        </h3>
                        <p className="text-purple-100 text-sm leading-relaxed">{analysis.advice}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Life Path Compatibility Guide */}
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <Heart className="w-8 h-8 text-pink-400" />
                    Number Compatibility Guide
                  </h2>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                      const compatibilityInfo: { [key: number]: { compatible: number[], challenging: number[], neutral: number[] } } = {
                        1: { compatible: [3, 5, 9], challenging: [4, 6, 8], neutral: [1, 2, 7] },
                        2: { compatible: [4, 6, 8], challenging: [1, 5, 9], neutral: [2, 3, 7] },
                        3: { compatible: [1, 5, 7], challenging: [4, 6], neutral: [2, 3, 8, 9] },
                        4: { compatible: [2, 6, 8], challenging: [1, 3, 5], neutral: [4, 7, 9] },
                        5: { compatible: [1, 3, 7], challenging: [2, 4, 6], neutral: [5, 8, 9] },
                        6: { compatible: [2, 4, 8], challenging: [1, 3, 5], neutral: [6, 7, 9] },
                        7: { compatible: [3, 5, 9], challenging: [2, 6, 8], neutral: [1, 4, 7] },
                        8: { compatible: [2, 4, 6], challenging: [1, 7, 9], neutral: [3, 5, 8] },
                        9: { compatible: [1, 3, 7], challenging: [2, 4, 5], neutral: [6, 8, 9] }
                      };
                      
                      const info = compatibilityInfo[num];
                      const isUserNumber = results.life_path?.number === num;
                      
                      return (
                        <div
                          key={num}
                          className={`p-4 rounded-xl border transition-all ${
                            isUserNumber
                              ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-purple-400 shadow-lg shadow-purple-500/20'
                              : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                              {num}
                            </div>
                            <div className="text-white font-semibold">Number {num}</div>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="text-green-400">✓ Best with:</span>
                              <span className="text-slate-300 ml-2">{info.compatible.join(', ')}</span>
                            </div>
                            <div>
                              <span className="text-red-400">⚠ Challenging:</span>
                              <span className="text-slate-300 ml-2">{info.challenging.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Life Chart - Moved to Cycles Tab */}
            {formData.birthDate && (
              <div className="max-w-6xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                  Life Chart - 9-Year Cycle
                </h2>
                
                <div className="space-y-4">
                  {Array.from({ length: 9 }, (_, i) => {
                    const currentYear = new Date().getFullYear();
                    const year = currentYear - 4 + i;
                    const birthDate = new Date(formData.birthDate);
                    
                    // Calculate personal year for each year
                    const reduceToSingle = (num: number): number => {
                      while (num > 9) {
                        const digits = num.toString().split('');
                        num = digits.reduce((sum, digit) => sum + parseInt(digit), 0);
                      }
                      return num;
                    };
                    
                    const dayReduced = reduceToSingle(birthDate.getDate());
                    const monthReduced = reduceToSingle(birthDate.getMonth() + 1);
                    const yearReduced = reduceToSingle(year);
                    const personalYear = reduceToSingle(dayReduced + monthReduced + yearReduced);
                    
                    const isCurrent = year === currentYear;
                    
                    const yearMeanings: { [key: number]: { theme: string, focus: string } } = {
                      1: { theme: 'New Beginnings', focus: 'Fresh starts, independence, leadership' },
                      2: { theme: 'Cooperation', focus: 'Partnerships, balance, patience' },
                      3: { theme: 'Creativity', focus: 'Self-expression, joy, socializing' },
                      4: { theme: 'Foundation', focus: 'Hard work, stability, organization' },
                      5: { theme: 'Change', focus: 'Freedom, adventure, versatility' },
                      6: { theme: 'Responsibility', focus: 'Family, home, service to others' },
                      7: { theme: 'Reflection', focus: 'Spirituality, introspection, wisdom' },
                      8: { theme: 'Achievement', focus: 'Success, power, material abundance' },
                      9: { theme: 'Completion', focus: 'Endings, humanitarianism, closure' }
                    };
                    
                    const yearInfo = yearMeanings[personalYear] || { theme: 'Cycle', focus: 'Personal growth' };
                    
                    return (
                      <div
                        key={year}
                        className={`relative flex items-center gap-6 p-6 rounded-2xl transition-all ${
                          isCurrent
                            ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-400/50 shadow-lg shadow-purple-500/30 scale-105'
                            : 'bg-slate-700/30 border border-slate-600/30 hover:border-slate-500/50'
                        }`}
                      >
                        {/* Year Badge */}
                        <div className={`flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-lg ${
                          isCurrent
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'bg-slate-600/50 text-slate-300'
                        }`}>
                          {year}
                        </div>
                        
                        {/* Personal Year Number */}
                        <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl ${
                          isCurrent
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg'
                            : 'bg-slate-600/50 text-slate-200'
                        }`}>
                          {personalYear}
                        </div>
                        
                        {/* Year Information */}
                        <div className="flex-grow">
                          <div className={`text-lg font-bold mb-1 ${isCurrent ? 'text-purple-200' : 'text-slate-200'}`}>
                            {yearInfo.theme}
                            {isCurrent && (
                              <span className="ml-3 px-3 py-1 bg-purple-500/30 text-purple-200 text-sm rounded-full">Current Year</span>
                            )}
                          </div>
                          <div className={`text-sm ${isCurrent ? 'text-purple-300' : 'text-slate-400'}`}>
                            {yearInfo.focus}
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="flex-shrink-0 w-24">
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                isCurrent
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                  : year < currentYear
                                  ? 'bg-slate-500'
                                  : 'bg-slate-600'
                              }`}
                              style={{ width: year < currentYear ? '100%' : year === currentYear ? '50%' : '0%' }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl">
                  <h3 className="text-lg font-bold text-purple-200 mb-3">Understanding Your 9-Year Cycle</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Your life unfolds in 9-year cycles, each year carrying unique energies and opportunities. 
                    The Personal Year Number reveals the main theme and focus for each year. Use this chart to 
                    understand past patterns, navigate the present, and plan for the future. The cycle repeats 
                    every 9 years, offering new lessons and growth opportunities at each stage.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Number Meanings Guide */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Number Meanings</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {numerologyMeanings.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.number}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:scale-105"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                      {item.number}
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm">{item.meaning}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
