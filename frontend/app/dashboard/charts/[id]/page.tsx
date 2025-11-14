'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Share2, Calendar, MapPin, Clock, Sparkles, Loader2, Star, Moon, Sun, Zap, Eye, TrendingUp, Heart, Award, Shield, Target, Globe, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { ChartData } from '@/lib/api/charts';
import { useLanguage } from '@/lib/contexts/language.context';

// Language translations
const translations: Record<string, any> = {
  en: {
    backToCharts: 'Back to Charts',
    birthChart: 'Birth Chart',
    share: 'Share',
    downloadPDF: 'Download PDF',
    birthDetails: 'Birth Details',
    vedicSystem: 'Vedic System',
    dateOfBirth: 'Date of Birth',
    timeOfBirth: 'Time of Birth',
    placeOfBirth: 'Place of Birth',
    chartType: 'Chart Type',
    currentTransits: 'Current Transits',
    realTimePositions: 'Real-time planetary positions',
    viewTransitChart: 'View Transit Chart',
    chartVisualization: 'Chart Visualization',
    northIndianStyle: 'North Indian Vedic Style',
    export: 'Export',
    detailedPositions: 'Detailed Planetary Positions',
    completePlanetaryData: 'Complete planetary data with degrees, signs, houses, and nakshatras',
    planet: 'Planet',
    sign: 'Sign',
    degree: 'Degree',
    house: 'House',
    nakshatra: 'Nakshatra',
    pada: 'Pada',
    lord: 'Lord',
    motion: 'Motion',
    direct: 'Direct',
    retrograde: 'Retrograde',
    ascendant: 'Ascendant',
    libra: 'Libra',
    houseCusps: 'House Cusps & Sign Distribution',
    zodiacElementBreakdown: 'Zodiac element breakdown across your houses',
    statistics: 'Statistics',
    planetaryStrength: 'Planetary Strength',
    dominantElement: 'Dominant Element',
    retrogradePlanets: 'Retrograde Planets',
    yogas: 'Yogas',
    houseAnalysis: 'House-by-House Analysis',
    nakshatraAnalysis: 'Nakshatra Analysis',
    clickForMoreInfo: 'Click for more information',
    showMore: 'Show More',
    showLess: 'Show Less',
    d1Chart: 'D1 - Birth Chart (Rashi)',
    d9Chart: 'D9 - Navamsa (Marriage & Dharma)',
    d10Chart: 'D10 - Dasamsa (Career & Status)',
    d12Chart: 'D12 - Dwadasamsa (Parents & Ancestors)',
    d60Chart: 'D60 - Shastiamsa (Karma & Past Life)',
    doubleClickForDetails: 'Double-click any planet or house for detailed information',
    chartTypes: 'Chart Types',
    vimshottariDasha: 'Vimshottari Dasha System',
    planetaryPeriods: 'Planetary Periods & Sub-Periods',
    currentDasha: 'Current Dasha',
    mahaLevel: 'Maha Dasha',
    antarLevel: 'Antar Dasha',
    pratyantarLevel: 'Pratyantara Dasha',
    remainingPeriod: 'Remaining Period',
    startDate: 'Start Date',
    endDate: 'End Date',
    years: 'years',
    months: 'months',
    days: 'days',
    dashaTimeline: 'Dasha Timeline',
    upcomingPeriods: 'Upcoming Periods',
    pastPeriods: 'Past Periods',
    sunSign: 'Sun Sign',
    moonSign: 'Moon Sign',
    tithi: 'Tithi',
    karana: 'Karana',
    loading: 'Loading chart data...',
    chartNotFound: 'Chart Not Found',
    unableToLoad: 'Unable to load chart data',
    backToChartsButton: 'Back to Charts',
    transitImpactAnalysis: 'Transit Impact Analysis',
    speed: 'Speed',
    effect: 'Effect',
    empty: 'Empty',
    more: 'more',
    transitingYour: 'transiting your',
    bringsDeepTransformation: 'brings deep transformation and hidden knowledge',
    encouragesDisciplinedCreativity: 'encourages disciplined creativity',
    amplifiesSocialConnections: 'amplifies social connections and gains through networks',
    currentPeriodInterpretation: 'Current Period Interpretation',
    activeNow: 'ACTIVE NOW',
    now: 'NOW',
    subPeriodsWithin: 'Sub-Periods within',
    current: 'Current',
    progress: 'Progress',
    duration: 'Duration',
    activePlanetaryPeriod: 'Active planetary period',
    transformationPeriod: 'Transformation period',
    creativityDiscipline: 'Creativity discipline',
    serviceChallenges: 'Service challenges',
    learningEnergy: 'Learning energy',
    socialGains: 'Social gains',
    careerCommunication: 'Career communication',
    houseNumber: (n: number) => `${n}th House`,
    // Planet names
    jupiter: 'Jupiter',
    saturn: 'Saturn',
    rahu: 'Rahu',
    mars: 'Mars',
    venus: 'Venus',
    mercury: 'Mercury',
    sun: 'Sun',
    moon: 'Moon',
    ketu: 'Ketu',
    // Sign names
    aries: 'Aries',
    taurus: 'Taurus',
    gemini: 'Gemini',
    cancer: 'Cancer',
    leo: 'Leo',
    virgo: 'Virgo',
    scorpio: 'Scorpio',
    sagittarius: 'Sagittarius',
    capricorn: 'Capricorn',
    aquarius: 'Aquarius',
    pisces: 'Pisces',
    lunarMansion: 'Lunar Mansion',
    // House Cusps labels
    signLabel: 'Sign',
    cuspLabel: 'Cusp',
    lordLabel: 'Lord',
    elementLabel: 'Element',
    qualityLabel: 'Quality',
    // Elements
    fire: 'Fire',
    earth: 'Earth',
    air: 'Air',
    water: 'Water',
    // Qualities
    cardinal: 'Cardinal',
    fixed: 'Fixed',
    mutable: 'Mutable',
    // Element groups
    fireSigns: 'Fire Signs',
    earthSigns: 'Earth Signs',
    airSigns: 'Air Signs',
    waterSigns: 'Water Signs',
    energyActive: 'Energy: Active, Dynamic',
    energyPractical: 'Energy: Practical, Grounded',
    energyMental: 'Energy: Mental, Social',
    energyEmotional: 'Energy: Emotional, Intuitive',
    // Divisional Charts
    divisionalCharts: 'Divisional Charts (Vargas)',
    advancedChartDivisions: 'Advanced chart divisions for deeper analysis',
    viewAllDivisions: 'View All 16 Divisions',
    navamsa: 'D9 - Navamsa',
    dasamsa: 'D10 - Dasamsa',
    dwadasamsa: 'D12 - Dwadasamsa',
    trimsamsa: 'D30 - Trimsamsa',
    marriageDestiny: 'Marriage & Destiny',
    careerStatus: 'Career & Status',
    parentsAncestors: 'Parents & Ancestors',
    misfortunesEvils: 'Misfortunes & Evils',
    // Statistics labels
    planetsLabel: 'PLANETS',
    directLabel: 'DIRECT',
    retrogradeLabel: 'RETROGRADE',
    housesLabel: 'HOUSES',
    nakshartrasLabel: 'NAKSHATRAS',
    totalCelestialBodies: 'Total celestial bodies',
    forwardMotionPlanets: 'Forward motion planets',
    backwardMotionPlanets: 'Backward motion planets',
    lifeAreasDivisions: 'Life areas/divisions',
    lunarMansionsSystem: 'Lunar mansions system',
    // Planetary Strength
    planetaryStrengthAnalysis: 'Planetary Strength Analysis',
    shadbalaStatus: 'Shadbala & Dignity Status',
    shadbalScore: 'Shadbala Score',
    dignityLabel: 'Dignity',
    houseLabel: 'House',
    nakshatraLabel: 'Nakshatra',
    // Strength badges
    veryStrong: 'Very Strong',
    strong: 'Strong',
    moderate: 'Moderate',
    weak: 'Weak',
    // Dignity states
    exaltedIn10th: 'Exalted in 10th',
    ownSign: 'Own Sign',
    neutral: 'Neutral',
    friendSign: 'Friend\'s Sign',
    enemySign: 'Enemy\'s Sign',
    shadowy: 'Shadowy',
    // Strength guide
    strengthClassificationGuide: 'Strength Classification Guide',
    // Planetary Aspects
    planetaryAspectsRelationships: 'Planetary Aspects & Relationships',
    vedicAspectsDrishti: 'Vedic aspects (Drishti) and planetary connections',
    majorAspectsDrishti: 'Major Aspects (Drishti)',
    naturalRelationships: 'Natural Relationships',
    aspect5th: '5th Aspect',
    aspect3rd: '3rd Aspect',
    aspect8th: '8th Aspect',
    conjunction: 'Conjunction',
    friends: 'Friends',
    enemies: 'Enemies',
    none: 'None',
    // Special Combinations
    specialPlanetaryCombinations: 'Special Planetary Combinations Detected',
    gajaKesariYoga: 'Gaja Kesari Yoga',
    budhAdityaYoga: 'Budh Aditya Yoga',
    chandraMangalYoga: 'Chandra Mangal Yoga',
    planetsLabel2: 'Planets',
    wisdomProsperityFame: 'Wisdom, prosperity, fame',
    intelligenceCommunication: 'Intelligence, communication',
    wealthPropertyGains: 'Wealth, property gains',
    // Nakshatra Analysis
    nakshatraAnalysisTitle: 'Nakshatra Analysis',
    lunarMansionsInfluence: 'Lunar mansions and their influence',
    inNakshatra: 'in',
    deity: 'Deity',
    symbol: 'Symbol',
    degreeLabel: 'Degree',
    quality: 'Quality',
    // Deity names
    nagas: 'Nagas',
    bhaga: 'Bhaga',
    savitar: 'Savitar',
    rudra: 'Rudra',
    pitris: 'Pitris',
    // Symbol descriptions
    coiledSerpent: 'Coiled Serpent',
    frontLegsOfBed: 'Front Legs of Bed',
    hand: 'Hand',
    teardrop: 'Teardrop',
    throne: 'Throne',
    // Quality descriptions
    embracingClinging: 'Embracing, Clinging',
    enjoymentPleasure: 'Enjoyment, Pleasure',
    skillCraftsmanship: 'Skill, Craftsmanship',
    // Nakshatra Significance
    nakshatraSignificance: 'Nakshatra Significance',
    nakshatraDescription: 'Nakshatras are the 27 lunar mansions in Vedic astrology, each spanning 13°20\' of the zodiac. They provide deep insights into personality traits, karmic patterns, and life purpose. The nakshatra placement of planets reveals the subtle energies and psychological patterns influencing different areas of life. Each nakshatra has a ruling deity, symbol, and specific qualities that color the expression of planets placed within it.',
    // Tab names
    overview: 'Overview',
    detailedAnalysis: 'Detailed Analysis',
    yogasCombinations: 'Yogas & Combinations',
    dashasPeriods: 'Dashas & Periods',
    // Chart Overview
    chartOverview: 'Chart Overview',
    quickInsights: 'Quick insights and key highlights from your birth chart',
    sunSignAnalysis: 'Sun Sign Analysis',
    moonSignAnalysis: 'Moon Sign Analysis',
    signColon: 'Sign',
    houseColon: 'House',
    nakshatraColon: 'Nakshatra',
    career: 'Career',
    gains: 'Gains',
    // Nakshatra names
    ashwini: 'Ashwini',
    bharani: 'Bharani',
    krittika: 'Krittika',
    rohini: 'Rohini',
    mrigashira: 'Mrigashira',
    ardra: 'Ardra',
    punarvasu: 'Punarvasu',
    pushya: 'Pushya',
    ashlesha: 'Ashlesha',
    magha: 'Magha',
    purvaPhalguni: 'Purva Phalguni',
    uttaraPhalguni: 'Uttara Phalguni',
    hasta: 'Hasta',
    chitra: 'Chitra',
    swati: 'Swati',
    vishakha: 'Vishakha',
    anuradha: 'Anuradha',
    jyeshtha: 'Jyeshtha',
    mula: 'Mula',
    purvaAshadha: 'Purva Ashadha',
    uttaraAshadha: 'Uttara Ashadha',
    shravana: 'Shravana',
    dhanishta: 'Dhanishta',
    shatabhisha: 'Shatabhisha',
    purvaBhadrapada: 'Purva Bhadrapada',
    uttaraBhadrapada: 'Uttara Bhadrapada',
    revati: 'Revati'
  },
  hi: {
    backToCharts: 'चार्ट पर वापस जाएं',
    birthChart: 'जन्म कुंडली',
    share: 'साझा करें',
    downloadPDF: 'पीडीएफ डाउनलोड करें',
    birthDetails: 'जन्म विवरण',
    vedicSystem: 'वैदिक प्रणाली',
    dateOfBirth: 'जन्म तिथि',
    timeOfBirth: 'जन्म समय',
    placeOfBirth: 'जन्म स्थान',
    chartType: 'चार्ट प्रकार',
    currentTransits: 'वर्तमान गोचर',
    realTimePositions: 'वास्तविक समय ग्रह स्थिति',
    viewTransitChart: 'गोचर चार्ट देखें',
    chartVisualization: 'चार्ट दृश्य',
    northIndianStyle: 'उत्तर भारतीय वैदिक शैली',
    export: 'निर्यात',
    detailedPositions: 'विस्तृत ग्रह स्थिति',
    completePlanetaryData: 'डिग्री, राशि, भाव और नक्षत्र के साथ पूर्ण ग्रह डेटा',
    planet: 'ग्रह',
    sign: 'राशि',
    degree: 'अंश',
    house: 'भाव',
    nakshatra: 'नक्षत्र',
    pada: 'पाद',
    lord: 'स्वामी',
    motion: 'गति',
    direct: 'अनुलोम',
    retrograde: 'वक्री',
    ascendant: 'लग्न',
    libra: 'तुला',
    houseCusps: 'भाव कुस्प और राशि वितरण',
    zodiacElementBreakdown: 'आपके भावों में राशि तत्व विभाजन',
    statistics: 'सांख्यिकी',
    planetaryStrength: 'ग्रह शक्ति',
    dominantElement: 'प्रधान तत्व',
    retrogradePlanets: 'वक्री ग्रह',
    yogas: 'योग',
    houseAnalysis: 'भाव-दर-भाव विश्लेषण',
    nakshatraAnalysis: 'नक्षत्र विश्लेषण',
    clickForMoreInfo: 'अधिक जानकारी के लिए क्लिक करें',
    showMore: 'और दिखाएं',
    showLess: 'कम दिखाएं',
    d1Chart: 'D1 - जन्म कुंडली (राशि)',
    d9Chart: 'D9 - नवांश (विवाह और धर्म)',
    d10Chart: 'D10 - दशांश (करियर और स्थिति)',
    d12Chart: 'D12 - द्वादशांश (माता-पिता और पूर्वज)',
    d60Chart: 'D60 - षष्ट्यांश (कर्म और पूर्व जन्म)',
    doubleClickForDetails: 'विस्तृत जानकारी के लिए किसी भी ग्रह या भाव पर डबल-क्लिक करें',
    chartTypes: 'चार्ट प्रकार',
    vimshottariDasha: 'विंशोत्तरी दशा प्रणाली',
    planetaryPeriods: 'ग्रह काल और उप-काल',
    currentDasha: 'वर्तमान दशा',
    mahaLevel: 'महादशा',
    antarLevel: 'अंतर्दशा',
    pratyantarLevel: 'प्रत्यंतर दशा',
    remainingPeriod: 'शेष अवधि',
    startDate: 'प्रारंभ तिथि',
    endDate: 'समाप्ति तिथि',
    years: 'वर्ष',
    months: 'महीने',
    days: 'दिन',
    dashaTimeline: 'दशा समयरेखा',
    upcomingPeriods: 'आगामी काल',
    pastPeriods: 'पिछले काल',
    sunSign: 'सूर्य राशि',
    moonSign: 'चंद्र राशि',
    tithi: 'तिथि',
    karana: 'करण',
    loading: 'कुंडली डेटा लोड हो रहा है...',
    chartNotFound: 'कुंडली नहीं मिली',
    unableToLoad: 'कुंडली डेटा लोड करने में असमर्थ',
    backToChartsButton: 'कुंडली पर वापस जाएं',
    transitImpactAnalysis: 'गोचर प्रभाव विश्लेषण',
    speed: 'गति',
    effect: 'प्रभाव',
    empty: 'खाली',
    more: 'अधिक',
    transitingYour: 'आपके',
    bringsDeepTransformation: 'गहन परिवर्तन और छिपे हुए ज्ञान लाता है',
    encouragesDisciplinedCreativity: 'अनुशासित रचनात्मकता को प्रोत्साहित करता है',
    amplifiesSocialConnections: 'सामाजिक संबंधों और नेटवर्क के माध्यम से लाभ को बढ़ाता है',
    currentPeriodInterpretation: 'वर्तमान काल की व्याख्या',
    activeNow: 'अभी सक्रिय',
    now: 'अभी',
    subPeriodsWithin: 'के भीतर उप-काल',
    current: 'वर्तमान',
    progress: 'प्रगति',
    duration: 'अवधि',
    activePlanetaryPeriod: 'सक्रिय ग्रह काल',
    transformationPeriod: 'परिवर्तन काल',
    creativityDiscipline: 'रचनात्मकता अनुशासन',
    serviceChallenges: 'सेवा चुनौतियाँ',
    learningEnergy: 'सीखने की ऊर्जा',
    socialGains: 'सामाजिक लाभ',
    careerCommunication: 'करियर संचार',
    houseNumber: (n: number) => `${n}वां भाव`,
    // Planet names
    jupiter: 'बृहस्पति',
    saturn: 'शनि',
    rahu: 'राहु',
    mars: 'मंगल',
    venus: 'शुक्र',
    mercury: 'बुध',
    sun: 'सूर्य',
    moon: 'चंद्र',
    ketu: 'केतु',
    // Sign names
    aries: 'मेष',
    taurus: 'वृषभ',
    gemini: 'मिथुन',
    cancer: 'कर्क',
    leo: 'सिंह',
    virgo: 'कन्या',
    scorpio: 'वृश्चिक',
    sagittarius: 'धनु',
    capricorn: 'मकर',
    aquarius: 'कुंभ',
    pisces: 'मीन',
    lunarMansion: 'चंद्र मंशन',
    // Nakshatra names
    ashwini: 'अश्विनी',
    bharani: 'भरणी',
    krittika: 'कृत्तिका',
    rohini: 'रोहिणी',
    mrigashira: 'मृगशिरा',
    ardra: 'आर्द्रा',
    punarvasu: 'पुनर्वसु',
    pushya: 'पुष्य',
    ashlesha: 'आश्लेषा',
    magha: 'मघा',
    purvaPhalguni: 'पूर्वा फाल्गुनी',
    uttaraPhalguni: 'उत्तरा फाल्गुनी',
    hasta: 'हस्त',
    chitra: 'चित्रा',
    swati: 'स्वाति',
    vishakha: 'विशाखा',
    anuradha: 'अनुराधा',
    jyeshtha: 'ज्येष्ठा',
    mula: 'मूल',
    purvaAshadha: 'पूर्वाषाढ़ा',
    uttaraAshadha: 'उत्तराषाढ़ा',
    shravana: 'श्रवण',
    dhanishta: 'धनिष्ठा',
    shatabhisha: 'शतभिषा',
    purvaBhadrapada: 'पूर्वा भाद्रपदा',
    uttaraBhadrapada: 'उत्तरा भाद्रपदा',
    revati: 'रेवती'
  },
  es: {
    backToCharts: 'Volver a Cartas',
    birthChart: 'Carta Natal',
    share: 'Compartir',
    downloadPDF: 'Descargar PDF',
    birthDetails: 'Detalles de Nacimiento',
    vedicSystem: 'Sistema Védico',
    dateOfBirth: 'Fecha de Nacimiento',
    timeOfBirth: 'Hora de Nacimiento',
    placeOfBirth: 'Lugar de Nacimiento',
    chartType: 'Tipo de Carta',
    currentTransits: 'Tránsitos Actuales',
    realTimePositions: 'Posiciones planetarias en tiempo real',
    viewTransitChart: 'Ver Carta de Tránsito',
    chartVisualization: 'Visualización de Carta',
    northIndianStyle: 'Estilo Védico del Norte de India',
    export: 'Exportar',
    detailedPositions: 'Posiciones Planetarias Detalladas',
    completePlanetaryData: 'Datos planetarios completos con grados, signos, casas y nakshatras',
    planet: 'Planeta',
    sign: 'Signo',
    degree: 'Grado',
    house: 'Casa',
    nakshatra: 'Nakshatra',
    pada: 'Pada',
    lord: 'Señor',
    motion: 'Movimiento',
    direct: 'Directo',
    retrograde: 'Retrógrado',
    ascendant: 'Ascendente',
    libra: 'Libra',
    houseCusps: 'Cúspides de Casas y Distribución de Signos',
    zodiacElementBreakdown: 'Desglose de elementos zodiacales en tus casas',
    statistics: 'Estadísticas',
    planetaryStrength: 'Fuerza Planetaria',
    dominantElement: 'Elemento Dominante',
    retrogradePlanets: 'Planetas Retrógrados',
    yogas: 'Yogas',
    houseAnalysis: 'Análisis Casa por Casa',
    nakshatraAnalysis: 'Análisis de Nakshatra',
    clickForMoreInfo: 'Haz clic para más información',
    showMore: 'Mostrar Más',
    showLess: 'Mostrar Menos',
    d1Chart: 'D1 - Carta Natal (Rashi)',
    d9Chart: 'D9 - Navamsa (Matrimonio y Dharma)',
    d10Chart: 'D10 - Dasamsa (Carrera y Estatus)',
    d12Chart: 'D12 - Dwadasamsa (Padres y Ancestros)',
    d60Chart: 'D60 - Shastiamsa (Karma y Vida Pasada)',
    doubleClickForDetails: 'Haz doble clic en cualquier planeta o casa para información detallada',
    chartTypes: 'Tipos de Cartas',
    vimshottariDasha: 'Sistema de Dasha Vimshottari',
    planetaryPeriods: 'Períodos Planetarios y Sub-Períodos',
    currentDasha: 'Dasha Actual',
    mahaLevel: 'Maha Dasha',
    antarLevel: 'Antar Dasha',
    pratyantarLevel: 'Pratyantara Dasha',
    remainingPeriod: 'Período Restante',
    startDate: 'Fecha de Inicio',
    endDate: 'Fecha de Fin',
    years: 'años',
    months: 'meses',
    days: 'días',
    dashaTimeline: 'Línea de Tiempo del Dasha',
    upcomingPeriods: 'Períodos Próximos',
    pastPeriods: 'Períodos Pasados',
    sunSign: 'Signo Solar',
    moonSign: 'Signo Lunar',
    tithi: 'Tithi',
    karana: 'Karana',
    loading: 'Cargando datos de la carta...',
    chartNotFound: 'Carta No Encontrada',
    unableToLoad: 'No se pudieron cargar los datos de la carta',
    backToChartsButton: 'Volver a Cartas',
    transitImpactAnalysis: 'Análisis de Impacto de Tránsitos',
    speed: 'Velocidad',
    effect: 'Efecto',
    empty: 'Vacío',
    more: 'más',
    transitingYour: 'transitando por tu',
    bringsDeepTransformation: 'trae transformación profunda y conocimiento oculto',
    encouragesDisciplinedCreativity: 'fomenta la creatividad disciplinada',
    amplifiesSocialConnections: 'amplifica las conexiones sociales y las ganancias a través de redes',
    currentPeriodInterpretation: 'Interpretación del Período Actual',
    activeNow: 'ACTIVO AHORA',
    now: 'AHORA',
    subPeriodsWithin: 'Sub-Períodos dentro de',
    current: 'Actual',
    progress: 'Progreso',
    duration: 'Duración',
    activePlanetaryPeriod: 'Período planetario activo',
    transformationPeriod: 'Período de transformación',
    creativityDiscipline: 'Disciplina creativa',
    serviceChallenges: 'Desafíos de servicio',
    learningEnergy: 'Energía de aprendizaje',
    socialGains: 'Ganancias sociales',
    careerCommunication: 'Comunicación profesional',
    houseNumber: (n: number) => `Casa ${n}`,
    // Planet names
    jupiter: 'Júpiter',
    saturn: 'Saturno',
    rahu: 'Rahu',
    mars: 'Marte',
    venus: 'Venus',
    mercury: 'Mercurio',
    sun: 'Sol',
    moon: 'Luna',
    ketu: 'Ketu',
    // Sign names
    aries: 'Aries',
    taurus: 'Tauro',
    gemini: 'Géminis',
    cancer: 'Cáncer',
    leo: 'Leo',
    virgo: 'Virgo',
    scorpio: 'Escorpio',
    sagittarius: 'Sagitario',
    capricorn: 'Capricornio',
    aquarius: 'Acuario',
    pisces: 'Piscis',
    lunarMansion: 'Mansión Lunar',
    // Nakshatra names
    ashwini: 'Ashwini',
    bharani: 'Bharani',
    krittika: 'Krittika',
    rohini: 'Rohini',
    mrigashira: 'Mrigashira',
    ardra: 'Ardra',
    punarvasu: 'Punarvasu',
    pushya: 'Pushya',
    ashlesha: 'Ashlesha',
    magha: 'Magha',
    purvaPhalguni: 'Purva Phalguni',
    uttaraPhalguni: 'Uttara Phalguni',
    hasta: 'Hasta',
    chitra: 'Chitra',
    swati: 'Swati',
    vishakha: 'Vishakha',
    anuradha: 'Anuradha',
    jyeshtha: 'Jyeshtha',
    mula: 'Mula',
    purvaAshadha: 'Purva Ashadha',
    uttaraAshadha: 'Uttara Ashadha',
    shravana: 'Shravana',
    dhanishta: 'Dhanishta',
    shatabhisha: 'Shatabhisha',
    purvaBhadrapada: 'Purva Bhadrapada',
    uttaraBhadrapada: 'Uttara Bhadrapada',
    revati: 'Revati'
  },
  fr: {
    backToCharts: 'Retour aux Cartes',
    birthChart: 'Carte Natale',
    share: 'Partager',
    downloadPDF: 'Télécharger PDF',
    birthDetails: 'Détails de Naissance',
    vedicSystem: 'Système Védique',
    dateOfBirth: 'Date de Naissance',
    timeOfBirth: 'Heure de Naissance',
    placeOfBirth: 'Lieu de Naissance',
    chartType: 'Type de Carte',
    currentTransits: 'Transits Actuels',
    realTimePositions: 'Positions planétaires en temps réel',
    viewTransitChart: 'Voir la Carte de Transit',
    chartVisualization: 'Visualisation de la Carte',
    northIndianStyle: 'Style Védique du Nord de l\'Inde',
    export: 'Exporter',
    detailedPositions: 'Positions Planétaires Détaillées',
    completePlanetaryData: 'Données planétaires complètes avec degrés, signes, maisons et nakshatras',
    planet: 'Planète',
    sign: 'Signe',
    degree: 'Degré',
    house: 'Maison',
    nakshatra: 'Nakshatra',
    pada: 'Pada',
    lord: 'Maître',
    motion: 'Mouvement',
    direct: 'Direct',
    retrograde: 'Rétrograde',
    ascendant: 'Ascendant',
    libra: 'Balance',
    houseCusps: 'Cuspides des Maisons et Distribution des Signes',
    zodiacElementBreakdown: 'Répartition des éléments zodiacaux dans vos maisons',
    statistics: 'Statistiques',
    planetaryStrength: 'Force Planétaire',
    dominantElement: 'Élément Dominant',
    retrogradePlanets: 'Planètes Rétrogrades',
    yogas: 'Yogas',
    houseAnalysis: 'Analyse Maison par Maison',
    nakshatraAnalysis: 'Analyse des Nakshatra',
    clickForMoreInfo: 'Cliquez pour plus d\'informations',
    showMore: 'Afficher Plus',
    showLess: 'Afficher Moins',
    d1Chart: 'D1 - Carte Natale (Rashi)',
    d9Chart: 'D9 - Navamsa (Mariage et Dharma)',
    d10Chart: 'D10 - Dasamsa (Carrière et Statut)',
    d12Chart: 'D12 - Dwadasamsa (Parents et Ancêtres)',
    d60Chart: 'D60 - Shastiamsa (Karma et Vie Antérieure)',
    doubleClickForDetails: 'Double-cliquez sur n\'importe quelle planète ou maison pour plus de détails',
    chartTypes: 'Types de Cartes',
    vimshottariDasha: 'Système Vimshottari Dasha',
    planetaryPeriods: 'Périodes Planétaires et Sous-Périodes',
    currentDasha: 'Dasha Actuel',
    mahaLevel: 'Maha Dasha',
    antarLevel: 'Antar Dasha',
    pratyantarLevel: 'Pratyantara Dasha',
    remainingPeriod: 'Période Restante',
    startDate: 'Date de Début',
    endDate: 'Date de Fin',
    years: 'ans',
    months: 'mois',
    days: 'jours',
    dashaTimeline: 'Chronologie du Dasha',
    upcomingPeriods: 'Périodes à Venir',
    pastPeriods: 'Périodes Passées',
    sunSign: 'Signe Solaire',
    moonSign: 'Signe Lunaire',
    tithi: 'Tithi',
    karana: 'Karana',
    loading: 'Chargement des données de la carte...',
    chartNotFound: 'Carte Non Trouvée',
    unableToLoad: 'Impossible de charger les données de la carte',
    backToChartsButton: 'Retour aux Cartes',
    transitImpactAnalysis: 'Analyse d\'Impact des Transits',
    speed: 'Vitesse',
    effect: 'Effet',
    empty: 'Vide',
    more: 'plus',
    transitingYour: 'transitant votre',
    bringsDeepTransformation: 'apporte une transformation profonde et des connaissances cachées',
    encouragesDisciplinedCreativity: 'encourage la créativité disciplinée',
    amplifiesSocialConnections: 'amplifie les connexions sociales et les gains via les réseaux',
    currentPeriodInterpretation: 'Interprétation de la Période Actuelle',
    activeNow: 'ACTIF MAINTENANT',
    now: 'MAINTENANT',
    subPeriodsWithin: 'Sous-Périodes dans',
    current: 'Actuel',
    progress: 'Progrès',
    duration: 'Durée',
    activePlanetaryPeriod: 'Période planétaire active',
    transformationPeriod: 'Période de transformation',
    creativityDiscipline: 'Discipline créative',
    serviceChallenges: 'Défis de service',
    learningEnergy: 'Énergie d\'apprentissage',
    socialGains: 'Gains sociaux',
    careerCommunication: 'Communication professionnelle',
    houseNumber: (n: number) => `Maison ${n}`,
    // Planet names
    jupiter: 'Jupiter',
    saturn: 'Saturne',
    rahu: 'Rahu',
    mars: 'Mars',
    venus: 'Vénus',
    mercury: 'Mercure',
    sun: 'Soleil',
    moon: 'Lune',
    ketu: 'Ketu',
    // Sign names
    aries: 'Bélier',
    taurus: 'Taureau',
    gemini: 'Gémeaux',
    cancer: 'Cancer',
    leo: 'Lion',
    virgo: 'Vierge',
    scorpio: 'Scorpion',
    sagittarius: 'Sagittaire',
    capricorn: 'Capricorne',
    aquarius: 'Verseau',
    pisces: 'Poissons',
    lunarMansion: 'Mansion Lunaire',
    // Nakshatra names
    ashwini: 'Ashwini',
    bharani: 'Bharani',
    krittika: 'Krittika',
    rohini: 'Rohini',
    mrigashira: 'Mrigashira',
    ardra: 'Ardra',
    punarvasu: 'Punarvasu',
    pushya: 'Pushya',
    ashlesha: 'Ashlesha',
    magha: 'Magha',
    purvaPhalguni: 'Purva Phalguni',
    uttaraPhalguni: 'Uttara Phalguni',
    hasta: 'Hasta',
    chitra: 'Chitra',
    swati: 'Swati',
    vishakha: 'Vishakha',
    anuradha: 'Anuradha',
    jyeshtha: 'Jyeshtha',
    mula: 'Mula',
    purvaAshadha: 'Purva Ashadha',
    uttaraAshadha: 'Uttara Ashadha',
    shravana: 'Shravana',
    dhanishta: 'Dhanishta',
    shatabhisha: 'Shatabhisha',
    purvaBhadrapada: 'Purva Bhadrapada',
    uttaraBhadrapada: 'Uttara Bhadrapada',
    revati: 'Revati'
  },
  mr: {
    backToCharts: 'कुंडली पाहा',
    birthChart: 'जन्म कुंडली',
    share: 'शेअर करा',
    downloadPDF: 'पीडीएफ डाउनलोड करा',
    birthDetails: 'जन्म तपशील',
    vedicSystem: 'वैदिक पद्धत',
    dateOfBirth: 'जन्म तारीख',
    timeOfBirth: 'जन्म वेळ',
    placeOfBirth: 'जन्म स्थळ',
    chartType: 'कुंडली प्रकार',
    currentTransits: 'सध्याची गोचर',
    realTimePositions: 'रिअल-टाइम ग्रह स्थिती',
    viewTransitChart: 'गोचर कुंडली पहा',
    chartVisualization: 'कुंडली दृश्य',
    northIndianStyle: 'उत्तर भारतीय वैदिक शैली',
    export: 'निर्यात करा',
    detailedPositions: 'तपशीलवार ग्रह स्थिती',
    completePlanetaryData: 'अंश, राशी, भाव आणि नक्षत्रासह संपूर्ण ग्रह माहिती',
    planet: 'ग्रह',
    sign: 'राशी',
    degree: 'अंश',
    house: 'भाव',
    nakshatra: 'नक्षत्र',
    pada: 'पाद',
    lord: 'स्वामी',
    motion: 'गती',
    direct: 'अनुलोम',
    retrograde: 'वक्री',
    ascendant: 'लग्न',
    libra: 'तूळ',
    houseCusps: 'भाव कुस्प आणि राशी वितरण',
    zodiacElementBreakdown: 'तुमच्या भावांमधील राशी घटक विभागणी',
    statistics: 'सांख्यिकी',
    planetaryStrength: 'ग्रह शक्ती',
    dominantElement: 'प्रधान घटक',
    retrogradePlanets: 'वक्री ग्रह',
    yogas: 'योग',
    houseAnalysis: 'भाव-निहाय विश्लेषण',
    nakshatraAnalysis: 'नक्षत्र विश्लेषण',
    clickForMoreInfo: 'अधिक माहितीसाठी क्लिक करा',
    showMore: 'अधिक दाखवा',
    showLess: 'कमी दाखवा',
    d1Chart: 'D1 - जन्म कुंडली (राशी)',
    d9Chart: 'D9 - नवमांश (विवाह आणि धर्म)',
    d10Chart: 'D10 - दशमांश (करिअर आणि स्थिती)',
    d12Chart: 'D12 - द्वादशांश (आई-वडील आणि पूर्वज)',
    d60Chart: 'D60 - षष्ट्यांश (कर्म आणि पूर्व जन्म)',
    doubleClickForDetails: 'तपशीलवार माहितीसाठी कोणत्याही ग्रह किंवा भावावर दोनदा क्लिक करा',
    chartTypes: 'कुंडली प्रकार',
    vimshottariDasha: 'विंशोत्तरी दशा पद्धत',
    planetaryPeriods: 'ग्रह काळ आणि उप-काळ',
    currentDasha: 'सध्याची दशा',
    mahaLevel: 'महादशा',
    antarLevel: 'अंतर्दशा',
    pratyantarLevel: 'प्रत्यंतर दशा',
    remainingPeriod: 'उर्वरित कालावधी',
    startDate: 'प्रारंभ तारीख',
    endDate: 'समाप्ती तारीख',
    years: 'वर्षे',
    months: 'महिने',
    days: 'दिवस',
    dashaTimeline: 'दशा टाइमलाइन',
    upcomingPeriods: 'आगामी काळ',
    pastPeriods: 'मागील काळ',
    sunSign: 'सूर्य राशी',
    moonSign: 'चंद्र राशी',
    tithi: 'तिथी',
    karana: 'करण',
    loading: 'कुंडली डेटा लोड होत आहे...',
    chartNotFound: 'कुंडली सापडली नाही',
    unableToLoad: 'कुंडली डेटा लोड करण्यात अक्षम',
    backToChartsButton: 'कुंडली पाहा',
    transitImpactAnalysis: 'गोचर प्रभाव विश्लेषण',
    speed: 'वेग',
    effect: 'प्रभाव',
    empty: 'रिकामे',
    more: 'अधिक',
    transitingYour: 'तुमच्या',
    bringsDeepTransformation: 'सखोल परिवर्तन आणि लपलेले ज्ञान आणते',
    encouragesDisciplinedCreativity: 'शिस्तबद्ध सर्जनशीलतेला प्रोत्साहन देते',
    amplifiesSocialConnections: 'सामाजिक संबंध आणि नेटवर्कद्वारे लाभ वाढवते',
    currentPeriodInterpretation: 'सध्याच्या कालावधीचे स्पष्टीकरण',
    activeNow: 'सध्या सक्रिय',
    now: 'सध्या',
    subPeriodsWithin: 'मधील उप-काळ',
    current: 'सध्याचा',
    progress: 'प्रगती',
    duration: 'कालावधी',
    activePlanetaryPeriod: 'सक्रिय ग्रह काळ',
    transformationPeriod: 'परिवर्तन काळ',
    creativityDiscipline: 'सर्जनशीलता शिस्त',
    serviceChallenges: 'सेवा आव्हाने',
    learningEnergy: 'शिकण्याची ऊर्जा',
    socialGains: 'सामाजिक लाभ',
    careerCommunication: 'करिअर संवाद',
    houseNumber: (n: number) => `${n}वा भाव`,
    // Planet names
    jupiter: 'गुरु',
    saturn: 'शनि',
    rahu: 'राहू',
    mars: 'मंगळ',
    venus: 'शुक्र',
    mercury: 'बुध',
    sun: 'सूर्य',
    moon: 'चंद्र',
    ketu: 'केतू',
    // Sign names
    aries: 'मेष',
    taurus: 'वृषभ',
    gemini: 'मिथुन',
    cancer: 'कर्क',
    leo: 'सिंह',
    virgo: 'कन्या',
    scorpio: 'वृश्चिक',
    sagittarius: 'धनु',
    capricorn: 'मकर',
    aquarius: 'कुंभ',
    pisces: 'मीन',
    lunarMansion: 'चंद्र मंशन',
    // House Cusps labels
    signLabel: 'राशी',
    cuspLabel: 'कुस्प',
    lordLabel: 'स्वामी',
    elementLabel: 'घटक',
    qualityLabel: 'गुणधर्म',
    // Elements
    fire: 'अग्नी',
    earth: 'पृथ्वी',
    air: 'वायु',
    water: 'जल',
    // Qualities
    cardinal: 'चल',
    fixed: 'स्थिर',
    mutable: 'द्विस्वभावी',
    // Element groups
    fireSigns: 'अग्नी राशी',
    earthSigns: 'पृथ्वी राशी',
    airSigns: 'वायु राशी',
    waterSigns: 'जल राशी',
    energyActive: 'ऊर्जा: सक्रिय, गतिशील',
    energyPractical: 'ऊर्जा: व्यावहारिक, स्थिर',
    energyMental: 'ऊर्जा: मानसिक, सामाजिक',
    energyEmotional: 'ऊर्जा: भावनात्मक, अंतर्ज्ञानी',
    // Divisional Charts
    divisionalCharts: 'विभागीय कुंडली (वर्ग)',
    advancedChartDivisions: 'सखोल विश्लेषणासाठी प्रगत कुंडली विभाग',
    viewAllDivisions: 'सर्व 16 विभाग पहा',
    navamsa: 'D9 - नवमांश',
    dasamsa: 'D10 - दशमांश',
    dwadasamsa: 'D12 - द्वादशांश',
    trimsamsa: 'D30 - त्रिंशांश',
    marriageDestiny: 'विवाह आणि नशीब',
    careerStatus: 'करिअर आणि स्थिती',
    parentsAncestors: 'आई-वडील आणि पूर्वज',
    misfortunesEvils: 'दुर्दैव आणि संकटे',
    // Statistics labels
    planetsLabel: 'ग्रह',
    directLabel: 'अनुलोम',
    retrogradeLabel: 'वक्री',
    housesLabel: 'भाव',
    nakshartrasLabel: 'नक्षत्रे',
    totalCelestialBodies: 'एकूण खगोलीय वस्तू',
    forwardMotionPlanets: 'अनुलोम ग्रह',
    backwardMotionPlanets: 'वक्री ग्रह',
    lifeAreasDivisions: 'जीवनाचे क्षेत्र/विभाग',
    lunarMansionsSystem: 'चंद्र मंशन प्रणाली',
    // Planetary Strength
    planetaryStrengthAnalysis: 'ग्रह शक्ती विश्लेषण',
    shadbalaStatus: 'षड्बल आणि प्रतिष्ठा स्थिती',
    shadbalScore: 'षड्बल गुण',
    dignityLabel: 'प्रतिष्ठा',
    houseLabel: 'भाव',
    nakshatraLabel: 'नक्षत्र',
    // Strength badges
    veryStrong: 'अतिशय मजबूत',
    strong: 'मजबूत',
    moderate: 'मध्यम',
    weak: 'कमकुवत',
    // Dignity states
    exaltedIn10th: '10व्या भावात उच्च',
    ownSign: 'स्वराशी',
    neutral: 'तटस्थ',
    friendSign: 'मित्र राशी',
    enemySign: 'शत्रू राशी',
    shadowy: 'छायामय',
    // Strength guide
    strengthClassificationGuide: 'शक्ती वर्गीकरण मार्गदर्शक',
    // Planetary Aspects
    planetaryAspectsRelationships: 'ग्रहांचे दृष्टी आणि संबंध',
    vedicAspectsDrishti: 'वैदिक दृष्टी आणि ग्रह संबंध',
    majorAspectsDrishti: 'प्रमुख दृष्टी',
    naturalRelationships: 'नैसर्गिक संबंध',
    aspect5th: '५वी दृष्टी',
    aspect3rd: '३री दृष्टी',
    aspect8th: '८वी दृष्टी',
    conjunction: 'युति',
    friends: 'मित्र',
    enemies: 'शत्रु',
    none: 'कोणीही नाही',
    // Special Combinations
    specialPlanetaryCombinations: 'विशेष ग्रह योग शोधले',
    gajaKesariYoga: 'गजकेसरी योग',
    budhAdityaYoga: 'बुधादित्य योग',
    chandraMangalYoga: 'चंद्र मंगळ योग',
    planetsLabel2: 'ग्रह',
    wisdomProsperityFame: 'ज्ञान, समृद्धी, यश',
    intelligenceCommunication: 'बुद्धिमत्ता, संवाद',
    wealthPropertyGains: 'संपत्ती, मालमत्ता लाभ',
    // Nakshatra Analysis
    nakshatraAnalysisTitle: 'नक्षत्र विश्लेषण',
    lunarMansionsInfluence: 'चंद्र मंशन आणि त्यांचा प्रभाव',
    inNakshatra: 'मध्ये',
    deity: 'देवता',
    symbol: 'चिन्ह',
    degreeLabel: 'अंश',
    quality: 'गुणधर्म',
    // Deity names
    nagas: 'नाग',
    bhaga: 'भग',
    savitar: 'सवितृ',
    rudra: 'रुद्र',
    pitris: 'पितृ',
    // Symbol descriptions
    coiledSerpent: 'गुंडाळलेला सर्प',
    frontLegsOfBed: 'पलंगाचे पुढचे पाय',
    hand: 'हात',
    teardrop: 'अश्रू थेंब',
    throne: 'सिंहासन',
    // Quality descriptions
    embracingClinging: 'आलिंगन, चिकटणे',
    enjoymentPleasure: 'आनंद, सुख',
    skillCraftsmanship: 'कौशल्य, कारागिरी',
    // Nakshatra Significance
    nakshatraSignificance: 'नक्षत्र महत्त्व',
    nakshatraDescription: 'नक्षत्रे ही वैदिक ज्योतिषातील २७ चंद्र मंशने आहेत, प्रत्येक राशीचक्रात १३°२०\' व्यापते. ते व्यक्तिमत्व वैशिष्ट्ये, कर्म नमुने आणि जीवन उद्देश यांबद्दल सखोल अंतर्दृष्टी प्रदान करतात. ग्रहांची नक्षत्र स्थिती जीवनाच्या विविध क्षेत्रांवर प्रभाव टाकणाऱ्या सूक्ष्म ऊर्जा आणि मानसिक नमुने प्रकट करते. प्रत्येक नक्षत्राचा एक शासक देवता, चिन्ह आणि विशिष्ट गुणधर्म आहेत जे त्या नक्षत्रात स्थित ग्रहांच्या अभिव्यक्तीला रंग देतात.',
    // Tab names
    overview: 'सारांश',
    detailedAnalysis: 'तपशीलवार विश्लेषण',
    yogasCombinations: 'योग आणि संयोग',
    dashasPeriods: 'दशा आणि काळ',
    // Chart Overview
    chartOverview: 'कुंडली सारांश',
    quickInsights: 'तुमच्या जन्म कुंडलीतून जलद अंतर्दृष्टी आणि मुख्य ठळक मुद्दे',
    sunSignAnalysis: 'सूर्य राशी विश्लेषण',
    moonSignAnalysis: 'चंद्र राशी विश्लेषण',
    signColon: 'राशी',
    houseColon: 'भाव',
    nakshatraColon: 'नक्षत्र',
    career: 'करिअर',
    gains: 'लाभ',
    // Nakshatra names
    ashwini: 'अश्विनी',
    bharani: 'भरणी',
    krittika: 'कृत्तिका',
    rohini: 'रोहिणी',
    mrigashira: 'मृगशिरा',
    ardra: 'आर्द्रा',
    punarvasu: 'पुनर्वसु',
    pushya: 'पुष्य',
    ashlesha: 'आश्लेषा',
    magha: 'मघा',
    purvaPhalguni: 'पूर्वा फाल्गुनी',
    uttaraPhalguni: 'उत्तरा फाल्गुनी',
    hasta: 'हस्ता',
    chitra: 'चित्रा',
    swati: 'स्वाती',
    vishakha: 'विशाखा',
    anuradha: 'अनुराधा',
    jyeshtha: 'ज्येष्ठा',
    mula: 'मूळ',
    purvaAshadha: 'पूर्वाषाढा',
    uttaraAshadha: 'उत्तराषाढा',
    shravana: 'श्रवण',
    dhanishta: 'धनिष्ठा',
    shatabhisha: 'शतभिषा',
    purvaBhadrapada: 'पूर्वा भाद्रपदा',
    uttaraBhadrapada: 'उत्तरा भाद्रपदा',
    revati: 'रेवती'
  }
};

export default function ChartViewPage() {
  const params = useParams();
  const router = useRouter();
  const chartId = params.id;
  const { language, setLanguage } = useLanguage();
  
  const [chart, setChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'yogas' | 'dashas'>('overview');
  const [activeChart, setActiveChart] = useState<'D1' | 'D9' | 'D10' | 'D12' | 'D60'>('D1');
  const [selectedPlanetInfo, setSelectedPlanetInfo] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    planetaryTable: false,
    houseCusps: false,
    statistics: false,
    houseAnalysis: false,
    nakshatraAnalysis: false
  });
  
  const t = translations[language];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Planet name translation mapper
  const getPlanetName = (planet: string | undefined) => {
    if (!planet) return '';
    const planetMap: Record<string, keyof typeof t> = {
      'Sun': 'sun',
      'Moon': 'moon',
      'Mars': 'mars',
      'Mercury': 'mercury',
      'Jupiter': 'jupiter',
      'Venus': 'venus',
      'Saturn': 'saturn',
      'Rahu': 'rahu',
      'Ketu': 'ketu'
    };
    return t[planetMap[planet]] || planet;
  };

  // Sign name translation mapper
  const getSignName = (sign: string) => {
    const signMap: Record<string, keyof typeof t> = {
      'Aries': 'aries',
      'Taurus': 'taurus',
      'Gemini': 'gemini',
      'Cancer': 'cancer',
      'Leo': 'leo',
      'Virgo': 'virgo',
      'Libra': 'libra',
      'Scorpio': 'scorpio',
      'Sagittarius': 'sagittarius',
      'Capricorn': 'capricorn',
      'Aquarius': 'aquarius',
      'Pisces': 'pisces'
    };
    return t[signMap[sign]] || sign;
  };

  // Nakshatra name translation mapper
  const getNakshatraName = (nakshatra: string | undefined) => {
    if (!nakshatra) return '';
    const nakshatraMap: Record<string, keyof typeof t> = {
      'Ashwini': 'ashwini',
      'Bharani': 'bharani',
      'Krittika': 'krittika',
      'Rohini': 'rohini',
      'Mrigashira': 'mrigashira',
      'Ardra': 'ardra',
      'Punarvasu': 'punarvasu',
      'Pushya': 'pushya',
      'Ashlesha': 'ashlesha',
      'Magha': 'magha',
      'Purva Phalguni': 'purvaPhalguni',
      'Uttara Phalguni': 'uttaraPhalguni',
      'Hasta': 'hasta',
      'Chitra': 'chitra',
      'Swati': 'swati',
      'Vishakha': 'vishakha',
      'Anuradha': 'anuradha',
      'Jyeshtha': 'jyeshtha',
      'Mula': 'mula',
      'Purva Ashadha': 'purvaAshadha',
      'Uttara Ashadha': 'uttaraAshadha',
      'Shravana': 'shravana',
      'Dhanishta': 'dhanishta',
      'Shatabhisha': 'shatabhisha',
      'Purva Bhadrapada': 'purvaBhadrapada',
      'Uttara Bhadrapada': 'uttaraBhadrapada',
      'Revati': 'revati'
    };
    return t[nakshatraMap[nakshatra]] || nakshatra;
  };

  // Strength status translation mapper
  const getStrengthStatus = (status: string) => {
    const statusMap: Record<string, keyof typeof t> = {
      'Very Strong': 'veryStrong',
      'Strong': 'strong',
      'Moderate': 'moderate',
      'Weak': 'weak'
    };
    return t[statusMap[status]] || status;
  };

  // Dignity translation mapper
  const getDignityName = (dignity: string) => {
    const dignityMap: Record<string, keyof typeof t> = {
      'Exalted in 10th': 'exaltedIn10th',
      'Own Sign': 'ownSign',
      'Neutral': 'neutral',
      "Friend's Sign": 'friendSign',
      "Enemy's Sign": 'enemySign',
      'Shadowy': 'shadowy'
    };
    return t[dignityMap[dignity]] || dignity;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    // Demo chart data with Libra Ascendant and Moon in Leo
    const demoChart: ChartData = {
      id: Number(chartId),
      user_id: 1,
      name: 'Birth Chart - Vedic (Demo)',
      birth_date: '1978-07-09',
      birth_time: '13:45:00',
      birth_place: 'Aurangabad, Maharashtra, India',
      latitude: 19.8762,
      longitude: 75.3433,
      timezone: 'Asia/Kolkata',
      chart_type: 'vedic',
      house_system: 'whole_sign',
      ayanamsa: 23.85, // Lahiri ayanamsa value
      planets: [
        {
          planet: 'Sun',
          sign: 'Cancer',
          degree: 23.53,
          house: 10,
          nakshatra: 'Ashlesha',
          pada: 2,
          lord: 'Moon',
          retrograde: false
        },
        {
          planet: 'Moon',
          sign: 'Leo',
          degree: 15.30,
          house: 11,
          nakshatra: 'Purva Phalguni',
          pada: 3,
          lord: 'Venus',
          retrograde: false
        },
        {
          planet: 'Mars',
          sign: 'Virgo',
          degree: 22.30,
          house: 12,
          nakshatra: 'Hasta',
          pada: 4,
          lord: 'Moon',
          retrograde: false
        },
        {
          planet: 'Mercury',
          sign: 'Gemini',
          degree: 18.75,
          house: 9,
          nakshatra: 'Ardra',
          pada: 2,
          lord: 'Rahu',
          retrograde: false
        },
        {
          planet: 'Jupiter',
          sign: 'Gemini',
          degree: 14.45,
          house: 9,
          nakshatra: 'Ardra',
          pada: 1,
          lord: 'Rahu',
          retrograde: false
        },
        {
          planet: 'Venus',
          sign: 'Leo',
          degree: 8.13,
          house: 11,
          nakshatra: 'Magha',
          pada: 2,
          lord: 'Ketu',
          retrograde: false
        },
        {
          planet: 'Saturn',
          sign: 'Leo',
          degree: 25.20,
          house: 11,
          nakshatra: 'Purva Phalguni',
          pada: 4,
          lord: 'Venus',
          retrograde: false
        },
        {
          planet: 'Rahu',
          sign: 'Virgo',
          degree: 28.38,
          house: 12,
          nakshatra: 'Chitra',
          pada: 2,
          lord: 'Mars',
          retrograde: true
        },
        {
          planet: 'Ketu',
          sign: 'Pisces',
          degree: 28.38,
          house: 6,
          nakshatra: 'Revati',
          pada: 4,
          lord: 'Mercury',
          retrograde: true
        }
      ],
      houses: [],
      aspects: [],
      created_at: new Date().toISOString()
    };

    const fetchChart = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use demo data for now since chartId is from mock list
        // In real scenario, this would call the test endpoint with actual birth data
        // For now, generate a chart using test endpoint with sample birth data
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await axios.get(`${API_BASE_URL}/api/v1/chart-test`, {
          params: {
            date: '1978-07-09',  // Sample birth date
            time: '12:00',
            latitude: 19.876,
            longitude: 75.343,
            timezone: 'Asia/Kolkata'
          }
        });
        
        // Transform the API response to match ChartData structure
        const chartData: ChartData = {
          id: Number(chartId),
          user_id: 1, // Demo user ID
          name: 'Demo Chart',
          birth_date: '1978-07-09',
          birth_time: '12:00:00',
          birth_place: 'Aurangabad, Maharashtra, India',
          latitude: 19.876,
          longitude: 75.343,
          timezone: 'Asia/Kolkata',
          chart_type: 'Vedic',
          house_system: 'Placidus',
          ayanamsa: 23.85, // Lahiri ayanamsa value
          planets: response.data.planets || [],
          houses: response.data.houses || [],
          aspects: response.data.aspects || [],
          created_at: new Date().toISOString()
        };
        
        setChart(chartData);
        setUsingDemoData(false);
      } catch (err: any) {
        console.error('Error fetching chart:', err);
        setError(err.message || 'Failed to load chart');
        toast.error('Unable to load chart. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (chartId) {
      fetchChart();
    }
  }, [chartId]);

  // Format date to "DD MMMM YYYY"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t?.loading || 'Loading chart data...'}</p>
        </div>
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t?.chartNotFound || 'Chart Not Found'}</h2>
          <p className="text-gray-600 mb-6">{t?.unableToLoad || 'Unable to load chart data'}</p>
          <button
            onClick={() => router.push('/dashboard/charts')}
            className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700"
          >
            {t?.backToChartsButton || 'Back to Charts'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Demo Data Banner - Hidden for demo accounts */}
      {false && usingDemoData && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-blue-900 mb-1">Demo Chart Data</p>
            <p className="text-sm text-blue-700">
              This is sample data. To see real planetary calculations, go to{' '}
              <button
                onClick={() => router.push('/dashboard/charts/new')}
                className="underline font-semibold hover:text-blue-900"
              >
                Generate New Chart
              </button>
              {' '}and create your birth chart.
            </p>
          </div>
        </div>
      )}
      
      {/* Header with Premium Animation */}
      <div className={`bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-white hover:text-violet-200 mb-4 transition-all duration-300 hover:scale-105 hover:-translate-x-1"
            >
              <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
              {t.backToCharts}
            </button>
            <h1 className="text-4xl font-bold mb-2 animate-fade-in-up">{chart.name || t.birthChart}</h1>
            <div className="flex items-center gap-4 text-violet-100">
              <span className="flex items-center gap-2 group hover:text-white transition-colors duration-300">
                <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                {chart.birth_place}
              </span>
              <span className="flex items-center gap-2 group hover:text-white transition-colors duration-300">
                <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                {formatDate(chart.birth_date)}
              </span>
              <span className="flex items-center gap-2 group hover:text-white transition-colors duration-300">
                <Clock className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                {chart.birth_time}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            {/* Language Selector with Animation */}
            <div className="relative group">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="px-4 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-opacity-30 transition-all appearance-none cursor-pointer pr-10 border-2 border-white border-opacity-30 hover:scale-105 duration-300"
              >
                <option value="en" className="bg-violet-600 text-white">🇬🇧 English</option>
                <option value="hi" className="bg-violet-600 text-white">🇮🇳 हिंदी</option>
                <option value="mr" className="bg-violet-600 text-white">🇮🇳 मराठी</option>
                <option value="es" className="bg-violet-600 text-white">🇪🇸 Español</option>
                <option value="fr" className="bg-violet-600 text-white">🇫🇷 Français</option>
              </select>
              <Globe className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:rotate-12 transition-transform duration-300" />
            </div>
            
            <button className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-opacity-30 transition-all flex items-center gap-2 hover:scale-105 duration-300 group">
              <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              {t.share}
            </button>
            <button className="px-6 py-3 bg-white text-violet-600 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 hover:scale-105 duration-300 animate-bounce-subtle group">
              <Download className="w-5 h-5 group-hover:animate-pulse" />
              {t.downloadPDF}
            </button>
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        {/* Quick Stats Grid with Stagger Animation */}
        <div className="grid grid-cols-6 gap-4">
          {[
            { label: t.ascendant, value: 'Libra ♎', icon: Star, color: 'from-purple-500 to-pink-500', delay: 0 },
            { label: t.sunSign, value: 'Cancer ♋', icon: Sun, color: 'from-orange-500 to-red-500', delay: 100 },
            { label: t.moonSign, value: 'Leo ♌', icon: Moon, color: 'from-blue-500 to-indigo-500', delay: 200 },
            { label: t.nakshatra, value: 'P. Phalguni', icon: Sparkles, color: 'from-violet-500 to-purple-500', delay: 300 },
            { label: t.tithi, value: 'Panchami (5th)', icon: Calendar, color: 'from-cyan-500 to-blue-500', delay: 400 },
            { label: t.karana, value: 'Bava', icon: Award, color: 'from-green-500 to-emerald-500', delay: 500 }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                style={{ animationDelay: `${stat.delay}ms` }}
                className={`bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 hover:bg-opacity-30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 group ${mounted ? 'opacity-100 translate-y-0 animate-fade-in-up' : 'opacity-0 translate-y-4'}`}
              >
                <Icon className={`w-4 h-4 mb-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-110 group-hover:animate-pulse`} />
                <div className="text-xs opacity-90 mb-1">{stat.label}</div>
                <div className="text-sm font-bold">{stat.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium Birth Details Card with Animation */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/30 dark:from-gray-800 dark:via-purple-900/10 dark:to-indigo-900/10 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0 animate-fade-in-up' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '600ms' }}>
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center animate-float">
                <Sparkles className="w-5 h-5 text-white animate-pulse" strokeWidth={2.5} />
              </div>
              {t.birthDetails}
            </h2>
            <span className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-glow">
              {t.vedicSystem}
            </span>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="group flex items-start gap-3 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                <Calendar className="w-6 h-6 text-violet-600 dark:text-violet-400 group-hover:animate-pulse" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.dateOfBirth}</p>
                <p className="font-bold text-gray-900 dark:text-white">{formatDate(chart.birth_date)}</p>
              </div>
            </div>
            <div className="group flex items-start gap-3 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:animate-pulse" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.timeOfBirth}</p>
                <p className="font-bold text-gray-900 dark:text-white">{chart.birth_time} {chart.timezone}</p>
              </div>
            </div>
            <div className="group flex items-start gap-3 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:animate-pulse" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.placeOfBirth}</p>
                <p className="font-bold text-gray-900 dark:text-white">{chart.birth_place}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {chart.latitude.toFixed(4)}°N, {chart.longitude.toFixed(4)}°E
                </p>
              </div>
            </div>
            <div className="group flex items-start gap-3 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400 group-hover:animate-pulse" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.chartType}</p>
                <p className="font-bold text-gray-900 dark:text-white capitalize">{chart.chart_type}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{chart.house_system}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Current Planetary Transits with Animation */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-cyan-900/10 dark:to-blue-900/10 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0 animate-fade-in-up' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '700ms' }}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d433_1px,transparent_1px),linear-gradient(to_bottom,#06b6d433_1px,transparent_1px)] bg-[size:40px_40px] animate-[grid_20s_linear_infinite] opacity-30"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-float">
                <Clock className="w-6 h-6 text-white animate-spin-slow" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.currentTransits}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.realTimePositions} • {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:shadow-xl transition-all text-sm font-bold hover:scale-105 duration-300 animate-glow group">
              <Eye className="w-4 h-4 inline mr-2 group-hover:animate-pulse" />
              {t.viewTransitChart}
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { planetKey: 'jupiter', planetSymbol: '♃', signKey: 'taurus', signSymbol: '♉', houseNum: 8, speed: '+0.12°/day', effectKey: 'transformationPeriod', color: 'from-yellow-500 to-amber-600', delay: 800 },
              { planetKey: 'saturn', planetSymbol: '♄', signKey: 'aquarius', signSymbol: '♒', houseNum: 5, speed: '+0.08°/day', effectKey: 'creativityDiscipline', color: 'from-gray-600 to-slate-700', delay: 900 },
              { planetKey: 'rahu', planetSymbol: '☊', signKey: 'pisces', signSymbol: '♓', houseNum: 6, speed: '-0.05°/day', effectKey: 'serviceChallenges', color: 'from-purple-600 to-indigo-700', delay: 1000 },
              { planetKey: 'mars', planetSymbol: '♂', signKey: 'gemini', signSymbol: '♊', houseNum: 9, speed: '+0.45°/day', effectKey: 'learningEnergy', color: 'from-red-500 to-rose-600', delay: 1100 },
              { planetKey: 'venus', planetSymbol: '♀', signKey: 'leo', signSymbol: '♌', houseNum: 11, speed: '+1.20°/day', effectKey: 'socialGains', color: 'from-pink-500 to-rose-600', delay: 1200 },
              { planetKey: 'mercury', planetSymbol: '☿', signKey: 'cancer', signSymbol: '♋', houseNum: 10, speed: '+1.50°/day', effectKey: 'careerCommunication', color: 'from-green-500 to-emerald-600', delay: 1300 }
            ].map((transit, idx) => (
              <div 
                key={idx} 
                style={{ animationDelay: `${transit.delay}ms` }}
                className={`group relative overflow-hidden bg-gradient-to-br ${transit.color} rounded-xl p-5 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0 animate-fade-in-up' : 'opacity-0 translate-y-4'}`}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold flex items-center gap-2">
                      <span className="text-3xl group-hover:scale-125 transition-transform duration-300">{transit.planetSymbol}</span>
                      {t[transit.planetKey as keyof typeof t]}
                    </span>
                    <span className="text-xs bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-1.5 font-bold group-hover:scale-110 transition-transform duration-300">{transit.speed}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="font-bold text-base flex items-center gap-2">
                      <span className="text-2xl">{transit.signSymbol}</span>
                      {t[transit.signKey as keyof typeof t]}
                    </div>
                    <div className="text-sm opacity-90 bg-white/10 rounded-lg px-3 py-1.5 inline-block">{t.houseNumber(transit.houseNum)}</div>
                    <div className="text-xs bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2 mt-3 font-medium group-hover:bg-opacity-30 transition-all">
                      {t[transit.effectKey as keyof typeof t]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-xl p-5 border-2 border-cyan-200 dark:border-cyan-800 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{t.transitImpactAnalysis}</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-bold text-cyan-700 dark:text-cyan-400">{t.jupiter}</span> {t.transitingYour} 8th {t.house} {t.bringsDeepTransformation}. 
                  <span className="font-bold text-gray-700 dark:text-gray-300"> {t.saturn}</span> in 5th {t.encouragesDisciplinedCreativity}. 
                  <span className="font-bold text-pink-700 dark:text-pink-400"> {t.venus}</span> in 11th {t.amplifiesSocialConnections}.
                </p>
              </div>
          </div>
        </div>
      </div>

      {/* Premium Chart Visualization with Animation */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-indigo-900/10 dark:to-purple-900/10 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0 animate-fade-in-up' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '1400ms' }}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#9333ea33_1px,transparent_1px),linear-gradient(to_bottom,#9333ea33_1px,transparent_1px)] bg-[size:40px_40px] animate-[grid_20s_linear_infinite] opacity-20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-float">
                <Star className="w-6 h-6 text-white animate-spin-slow" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.chartVisualization}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.northIndianStyle}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white dark:bg-gray-700 rounded-xl border-2 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-sm font-semibold text-purple-700 dark:text-purple-300 hover:scale-105 duration-300 group">
                <Download className="w-4 h-4 inline mr-2 group-hover:animate-pulse" />
                {t.export}
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all text-sm font-bold hover:scale-105 duration-300 animate-glow group">
                <Share2 className="w-4 h-4 inline mr-2 group-hover:rotate-12 transition-transform duration-300" />
                {t.share}
              </button>
            </div>
          </div>
          
          {/* Chart Type Selector with Animation */}
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.chartTypes}:</span>
            {[
              { id: 'D1', label: t.d1Chart, color: 'purple' },
              { id: 'D9', label: t.d9Chart, color: 'indigo' },
              { id: 'D10', label: t.d10Chart, color: 'blue' },
              { id: 'D12', label: t.d12Chart, color: 'cyan' },
              { id: 'D60', label: t.d60Chart, color: 'teal' }
            ].map((chartType, idx) => (
              <button
                key={chartType.id}
                style={{ animationDelay: `${1500 + (idx * 100)}ms` }}
                onClick={() => setActiveChart(chartType.id as any)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all transform hover:scale-105 hover:-translate-y-1 duration-300 shadow-md hover:shadow-lg ${
                  activeChart === chartType.id
                    ? `bg-gradient-to-r from-purple-600 to-indigo-600 text-white animate-glow`
                    : `bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 border-2 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20`
                } ${mounted ? 'opacity-100 translate-y-0 animate-fade-in-up' : 'opacity-0 translate-y-4'}`}
              >
                {chartType.label}
              </button>
            ))}
          </div>
          
          {/* North Indian Diamond Chart Layout - Fixed Spacing */}
          <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-purple-300 dark:border-purple-700">
            <div className="relative w-full mx-auto" style={{ maxWidth: '700px', aspectRatio: '1/1' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full" style={{ transform: 'rotate(45deg)' }}>
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 p-1" style={{ gap: '2px' }}>
                    {[12, 1, 2, 3, 11, '', '', 4, 10, '', '', 5, 9, 8, 7, 6].map((house, idx) => {
                      if (house === '') {
                        return (
                          <div key={idx} className="bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-4 border-amber-500 dark:border-amber-600 rounded-lg shadow-lg flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-300">
                            <div style={{ transform: 'rotate(-45deg)' }} className="text-center p-2">
                              <div className="text-xs font-bold text-amber-900 dark:text-amber-100 mb-1">{t.ascendant}</div>
                              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">♎</div>
                              <div className="text-xs font-semibold text-amber-800 dark:text-amber-200">{t.libra}</div>
                              <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">12°45'</div>
                            </div>
                          </div>
                        );
                      }
                      
                      const houseNum = Number(house);
                      const planetsInHouse = chart.planets?.filter(p => p.house === houseNum) || [];
                      
                      // Get zodiac sign for this house (with Libra as 1st house)
                      const signs = ['Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces', 
                                    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo'];
                      const signSymbols = ['♎', '♏', '♐', '♑', '♒', '♓', '♈', '♉', '♊', '♋', '♌', '♍'];
                      const signIndex = (houseNum - 1) % 12;
                      
                      // House colors - vibrant gradients
                      const houseColors: Record<number, { bg: string; border: string; text: string }> = {
                        1: { bg: 'from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30', border: 'border-amber-400 dark:border-amber-600', text: 'text-amber-900 dark:text-amber-100' },
                        2: { bg: 'from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30', border: 'border-emerald-400 dark:border-emerald-600', text: 'text-emerald-900 dark:text-emerald-100' },
                        3: { bg: 'from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30', border: 'border-yellow-400 dark:border-yellow-600', text: 'text-yellow-900 dark:text-yellow-100' },
                        4: { bg: 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30', border: 'border-blue-400 dark:border-blue-600', text: 'text-blue-900 dark:text-blue-100' },
                        5: { bg: 'from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30', border: 'border-purple-400 dark:border-purple-600', text: 'text-purple-900 dark:text-purple-100' },
                        6: { bg: 'from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30', border: 'border-orange-400 dark:border-orange-600', text: 'text-orange-900 dark:text-orange-100' },
                        7: { bg: 'from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30', border: 'border-pink-400 dark:border-pink-600', text: 'text-pink-900 dark:text-pink-100' },
                        8: { bg: 'from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30', border: 'border-indigo-400 dark:border-indigo-600', text: 'text-indigo-900 dark:text-indigo-100' },
                        9: { bg: 'from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30', border: 'border-cyan-400 dark:border-cyan-600', text: 'text-cyan-900 dark:text-cyan-100' },
                        10: { bg: 'from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30', border: 'border-violet-400 dark:border-violet-600', text: 'text-violet-900 dark:text-violet-100' },
                        11: { bg: 'from-lime-100 to-green-100 dark:from-lime-900/30 dark:to-green-900/30', border: 'border-lime-400 dark:border-lime-600', text: 'text-lime-900 dark:text-lime-100' },
                        12: { bg: 'from-slate-100 to-gray-100 dark:from-slate-900/30 dark:to-gray-900/30', border: 'border-slate-400 dark:border-slate-600', text: 'text-slate-900 dark:text-slate-100' }
                      };
                      
                      const colors = houseColors[houseNum];
                      
                      return (
                        <div 
                          key={idx} 
                          onDoubleClick={() => {
                            setSelectedPlanetInfo({
                              type: 'house',
                              houseNum,
                          sign: signSymbols[signIndex],
                          planets: planetsInHouse,
                          chartType: activeChart
                        });
                      }}
                      className={`bg-gradient-to-br ${colors.bg} border-3 ${colors.border} rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 flex items-center justify-center relative overflow-hidden group`}
                    >
                      <div style={{ transform: 'rotate(-45deg)' }} className="flex flex-col items-center justify-center text-center w-full h-full p-2">
                        {/* House Number Badge */}
                        <div className={`text-xs font-bold ${colors.text} mb-1 px-2 py-0.5 bg-white/60 dark:bg-gray-800/60 rounded-full shadow-sm`}>
                          {houseNum}
                        </div>
                        
                        {/* Sign Symbol - Larger */}
                        <div className={`text-3xl font-bold ${colors.text} mb-1 group-hover:scale-125 transition-transform duration-300`}>
                          {signSymbols[signIndex]}
                        </div>
                        
                        {/* Sign Name */}
                        <div className={`text-xs font-semibold ${colors.text} mb-2 opacity-80`}>
                          {getSignName(signs[signIndex])}
                        </div>
                        
                        {/* Planets in House */}
                        {planetsInHouse.length > 0 ? (
                          <div className="flex flex-col items-center gap-1 w-full">
                            {planetsInHouse.slice(0, 2).map((planet, pidx) => {
                              const planetSymbols: Record<string, string> = {
                                'Sun': '☉', 'Moon': '☾', 'Mars': '♂', 'Mercury': '☿',
                                'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋'
                              };
                              const planetColors: Record<string, string> = {
                                'Sun': 'from-orange-500 to-red-600',
                                'Moon': 'from-blue-500 to-indigo-600',
                                'Mars': 'from-red-600 to-rose-700',
                                'Mercury': 'from-green-500 to-emerald-600',
                                'Jupiter': 'from-yellow-500 to-amber-600',
                                'Venus': 'from-pink-500 to-rose-600',
                                'Saturn': 'from-gray-600 to-slate-800',
                                'Rahu': 'from-purple-700 to-indigo-800',
                                'Ketu': 'from-indigo-700 to-violet-800'
                              };
                              
                              return (
                                <div 
                                  key={pidx} 
                                  className={`bg-gradient-to-r ${planetColors[planet.planet]} text-white rounded-lg px-2 py-1 text-xs font-bold flex items-center gap-1 shadow-lg hover:scale-110 transition-transform duration-200`}
                                >
                                  <span className="text-sm">{planetSymbols[planet.planet]}</span>
                                  <span>{Math.floor(planet.degree)}°</span>
                                  {planet.retrograde && <span className="text-yellow-300 text-xs">℞</span>}
                                </div>
                              );
                            })}
                            {planetsInHouse.length > 2 && (
                              <div className={`text-xs ${colors.text} font-bold bg-white/70 dark:bg-gray-800/70 rounded px-2 py-0.5 shadow`}>
                                +{planetsInHouse.length - 2}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 dark:text-gray-500 italic opacity-60">{t.empty}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Chart Legend below */}
          <div className="mt-8 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Traditional North Indian Diamond Chart (Rotated 45°)</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">Houses arranged in diamond pattern • Ascendant at center</div>
          </div>
        </div>
        </div>
      </div>
        
        {/* Detailed Planetary Positions Table */}
        <div className="mt-8 bg-white rounded-xl border-2 border-purple-200 overflow-hidden shadow-lg">
          <div 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 cursor-pointer hover:from-purple-700 hover:to-indigo-700 transition-all"
            onClick={() => toggleSection('planetaryTable')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-white" />
                <div>
                  <h3 className="text-xl font-bold text-white">{t.detailedPositions}</h3>
                  <p className="text-sm text-purple-100 mt-1">{t.completePlanetaryData}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-200" />
                {expandedSections.planetaryTable ? (
                  <ChevronUp className="w-6 h-6 text-white" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
          </div>
          
          {expandedSections.planetaryTable && (
          <div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">{t.planet}</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">{t.sign}</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">{t.degree}</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">{t.house}</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">{t.nakshatra}</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">{t.pada}</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">{t.lord}</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t.motion}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {chart.planets?.map((planet, idx) => {
                  const planetSymbols: Record<string, string> = {
                    'Sun': '☉', 'Moon': '☾', 'Mars': '♂', 'Mercury': '☿',
                    'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋'
                  };
                  const signSymbols: Record<string, string> = {
                    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
                    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
                    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
                  };
                  const planetColors: Record<string, string> = {
                    'Sun': 'bg-gradient-to-r from-orange-100 to-red-100',
                    'Moon': 'bg-gradient-to-r from-blue-100 to-indigo-100',
                    'Mars': 'bg-gradient-to-r from-red-100 to-rose-100',
                    'Mercury': 'bg-gradient-to-r from-green-100 to-emerald-100',
                    'Jupiter': 'bg-gradient-to-r from-yellow-100 to-amber-100',
                    'Venus': 'bg-gradient-to-r from-pink-100 to-rose-100',
                    'Saturn': 'bg-gradient-to-r from-gray-100 to-slate-100',
                    'Rahu': 'bg-gradient-to-r from-purple-100 to-indigo-100',
                    'Ketu': 'bg-gradient-to-r from-indigo-100 to-violet-100'
                  };
                  
                  return (
                    <tr key={idx} className={`${planetColors[planet.planet]} hover:shadow-lg transition-all`}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{planetSymbols[planet.planet]}</span>
                          <span className="font-bold text-gray-900">{getPlanetName(planet.planet)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{signSymbols[planet.sign]}</span>
                          <span className="font-semibold text-gray-700">{getSignName(planet.sign)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-mono font-bold text-gray-900">
                            {Math.floor(planet.degree)}° {Math.floor((planet.degree % 1) * 60)}' {Math.floor(((planet.degree % 1) * 60 % 1) * 60)}"
                          </div>
                          <div className="text-xs text-gray-500">{planet.degree.toFixed(4)}°</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-bold">
                          {planet.house}th
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{getNakshatraName(planet.nakshatra)}</div>
                          <div className="text-xs text-gray-500">{t.lunarMansion}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm font-bold">
                          {planet.pada}/4
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-gray-700">{getPlanetName(planet.lord)}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {planet.retrograde ? (
                          <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold flex items-center gap-1 justify-center">
                            <span>℞</span>
                            <span>{t.retrograde}</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                            {t.direct}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 border-t-2 border-purple-200">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-bold text-purple-700">Total Planets:</span>
                <span className="ml-2 text-gray-900">{chart.planets?.length || 0}</span>
              </div>
              <div>
                <span className="font-bold text-green-700">Direct Motion:</span>
                <span className="ml-2 text-gray-900">{chart.planets?.filter(p => !p.retrograde).length || 0}</span>
              </div>
              <div>
                <span className="font-bold text-red-700">Retrograde:</span>
                <span className="ml-2 text-gray-900">{chart.planets?.filter(p => p.retrograde).length || 0}</span>
              </div>
            </div>
          </div>
          </div>
          )}
        </div>
        
        {/* House Cusps & Sign Positions */}
        <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 overflow-hidden shadow-lg">
          <div 
            className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 cursor-pointer hover:from-amber-700 hover:to-orange-700 transition-all"
            onClick={() => toggleSection('houseCusps')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-white" />
                <div>
                  <h3 className="text-xl font-bold text-white">{t.houseCusps}</h3>
                  <p className="text-sm text-amber-100 mt-1">{t.zodiacElementBreakdown}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-200" />
                {expandedSections.houseCusps ? (
                  <ChevronUp className="w-6 h-6 text-white" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
          </div>
          
          {expandedSections.houseCusps && (
          <div>
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { house: 1, sign: 'Libra', cusp: '12°45\'', lord: 'Venus', element: 'Air', quality: 'Cardinal' },
                { house: 2, sign: 'Scorpio', cusp: '12°45\'', lord: 'Mars', element: 'Water', quality: 'Fixed' },
                { house: 3, sign: 'Sagittarius', cusp: '12°45\'', lord: 'Jupiter', element: 'Fire', quality: 'Mutable' },
                { house: 4, sign: 'Capricorn', cusp: '12°45\'', lord: 'Saturn', element: 'Earth', quality: 'Cardinal' },
                { house: 5, sign: 'Aquarius', cusp: '12°45\'', lord: 'Saturn', element: 'Air', quality: 'Fixed' },
                { house: 6, sign: 'Pisces', cusp: '12°45\'', lord: 'Jupiter', element: 'Water', quality: 'Mutable' },
                { house: 7, sign: 'Aries', cusp: '12°45\'', lord: 'Mars', element: 'Fire', quality: 'Cardinal' },
                { house: 8, sign: 'Taurus', cusp: '12°45\'', lord: 'Venus', element: 'Earth', quality: 'Fixed' },
                { house: 9, sign: 'Gemini', cusp: '12°45\'', lord: 'Mercury', element: 'Air', quality: 'Mutable' },
                { house: 10, sign: 'Cancer', cusp: '12°45\'', lord: 'Moon', element: 'Water', quality: 'Cardinal' },
                { house: 11, sign: 'Leo', cusp: '12°45\'', lord: 'Sun', element: 'Fire', quality: 'Fixed' },
                { house: 12, sign: 'Virgo', cusp: '12°45\'', lord: 'Mercury', element: 'Earth', quality: 'Mutable' }
              ].map((h) => {
                const signSymbols: Record<string, string> = {
                  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
                  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
                  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
                };
                const elementColors: Record<string, string> = {
                  'Fire': 'from-red-400 to-orange-500',
                  'Earth': 'from-green-400 to-emerald-500',
                  'Air': 'from-blue-400 to-cyan-500',
                  'Water': 'from-indigo-400 to-purple-500'
                };
                
                return (
                  <div key={h.house} className={`bg-gradient-to-br ${elementColors[h.element]} rounded-lg p-4 text-white shadow-md hover:shadow-xl transition-all`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-black">H{h.house}</span>
                      <span className="text-4xl opacity-70">{signSymbols[h.sign]}</span>
                    </div>
                    
                    <div className="space-y-2 text-sm bg-white bg-opacity-20 rounded-lg p-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">{t.signLabel}:</span>
                        <span className="font-bold">{getSignName(h.sign)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">{t.cuspLabel}:</span>
                        <span className="font-mono font-bold">{h.cusp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">{t.lordLabel}:</span>
                        <span className="font-bold">{getPlanetName(h.lord)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold">{t.elementLabel}:</span>
                        <span>{t[h.element.toLowerCase() as keyof typeof t]}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold">{t.qualityLabel}:</span>
                        <span>{t[h.quality.toLowerCase() as keyof typeof t]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-4 border-2 border-red-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-full"></div>
                  <span className="font-bold text-gray-900">{t.fireSigns}</span>
                </div>
                <div className="text-sm text-gray-700">{t.aries}, {t.leo}, {t.sagittarius}</div>
                <div className="text-xs text-gray-600 mt-1">{t.energyActive}</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border-2 border-green-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
                  <span className="font-bold text-gray-900">{t.earthSigns}</span>
                </div>
                <div className="text-sm text-gray-700">{t.taurus}, {t.virgo}, {t.capricorn}</div>
                <div className="text-xs text-gray-600 mt-1">{t.energyPractical}</div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4 border-2 border-blue-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"></div>
                  <span className="font-bold text-gray-900">{t.airSigns}</span>
                </div>
                <div className="text-sm text-gray-700">{t.gemini}, {t.libra}, {t.aquarius}</div>
                <div className="text-xs text-gray-600 mt-1">{t.energyMental}</div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-4 border-2 border-indigo-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                  <span className="font-bold text-gray-900">{t.waterSigns}</span>
                </div>
                <div className="text-sm text-gray-700">{t.cancer}, {t.scorpio}, {t.pisces}</div>
                <div className="text-xs text-gray-600 mt-1">{t.energyEmotional}</div>
              </div>
            </div>
          </div>
          </div>
          )}
        </div>
        
        {/* Advanced Divisional Charts Preview */}
        <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                {t.divisionalCharts}
              </h3>
              <p className="text-sm text-gray-600">{t.advancedChartDivisions}</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold">
              {t.viewAllDivisions}
            </button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { name: t.navamsa, desc: t.marriageDestiny, color: 'from-pink-500 to-rose-600', icon: Heart },
              { name: t.dasamsa, desc: t.careerStatus, color: 'from-blue-500 to-indigo-600', icon: TrendingUp },
              { name: t.dwadasamsa, desc: t.parentsAncestors, color: 'from-purple-500 to-violet-600', icon: Shield },
              { name: t.trimsamsa, desc: t.misfortunesEvils, color: 'from-gray-600 to-slate-700', icon: Award }
            ].map((division, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${division.color} rounded-xl p-4 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer`}>
                <division.icon className="w-8 h-8 mb-2 opacity-90" />
                <div className="font-bold text-sm mb-1">{division.name}</div>
                <div className="text-xs opacity-90">{division.desc}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chart Statistics */}
        <div className="mt-8 grid md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-5 border-3 border-orange-300 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-black text-orange-700">9</div>
                <div className="text-[10px] font-bold text-orange-600">{t.planetsLabel}</div>
              </div>
            </div>
            <div className="text-xs text-gray-700 font-medium">{t.totalCelestialBodies}</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-5 border-3 border-green-300 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-black text-green-700">{chart.planets?.filter(p => !p.retrograde).length || 0}</div>
                <div className="text-[10px] font-bold text-green-600">{t.directLabel}</div>
              </div>
            </div>
            <div className="text-xs text-gray-700 font-medium">{t.forwardMotionPlanets}</div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl p-5 border-3 border-amber-300 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-black text-amber-700">{chart.planets?.filter(p => p.retrograde).length || 0}</div>
                <div className="text-[10px] font-bold text-amber-600">{t.retrogradeLabel}</div>
              </div>
            </div>
            <div className="text-xs text-gray-700 font-medium">{t.backwardMotionPlanets}</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl p-5 border-3 border-purple-300 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-md">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-black text-purple-700">12</div>
                <div className="text-[10px] font-bold text-purple-600">{t.housesLabel}</div>
              </div>
            </div>
            <div className="text-xs text-gray-700 font-medium">{t.lifeAreasDivisions}</div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl p-5 border-3 border-pink-300 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-black text-pink-700">27</div>
                <div className="text-[10px] font-bold text-pink-600">{t.nakshartrasLabel}</div>
              </div>
            </div>
            <div className="text-xs text-gray-700 font-medium">{t.lunarMansionsSystem}</div>
          </div>
        </div>
      </div>

      {/* Detailed House Analysis */}
      <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-2xl border-2 border-teal-200 overflow-hidden shadow-lg">
        <div 
          className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 cursor-pointer hover:from-teal-700 hover:to-cyan-700 transition-all"
          onClick={() => toggleSection('houseAnalysis')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">{t.houseAnalysis}</h2>
                <p className="text-sm text-teal-100">Complete breakdown of all 12 houses</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-teal-200" />
              {expandedSections.houseAnalysis ? (
                <ChevronUp className="w-6 h-6 text-white" />
              ) : (
                <ChevronDown className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
        </div>
        
        {expandedSections.houseAnalysis && (
        <div className="p-8">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { num: 1, name: 'Ascendant (Lagna)', sign: 'Libra ♎', lord: 'Venus', strength: 'Strong', planets: 'Venus 12°34\'', significance: 'Self, personality, physical body, overall life path', color: 'from-amber-500 to-yellow-600' },
            { num: 2, name: 'Dhana Bhava', sign: 'Scorpio ♏', lord: 'Mars', strength: 'Moderate', planets: 'Empty', significance: 'Wealth, family, speech, food, early childhood', color: 'from-emerald-500 to-green-600' },
            { num: 3, name: 'Sahaja Bhava', sign: 'Sagittarius ♐', lord: 'Jupiter', strength: 'Weak', planets: 'Empty', significance: 'Siblings, courage, communication, short journeys', color: 'from-yellow-500 to-amber-600' },
            { num: 4, name: 'Sukha Bhava', sign: 'Capricorn ♑', lord: 'Saturn', strength: 'Very Strong', planets: 'Empty', significance: 'Mother, home, happiness, property, vehicles', color: 'from-blue-500 to-cyan-600' },
            { num: 5, name: 'Putra Bhava', sign: 'Aquarius ♒', lord: 'Saturn', strength: 'Strong', planets: 'Empty', significance: 'Children, creativity, intelligence, romance', color: 'from-purple-500 to-violet-600' },
            { num: 6, name: 'Ripu Bhava', sign: 'Pisces ♓', lord: 'Jupiter', strength: 'Moderate', planets: 'Empty', significance: 'Enemies, diseases, debts, service, obstacles', color: 'from-orange-500 to-red-600' },
            { num: 7, name: 'Kalatra Bhava', sign: 'Aries ♈', lord: 'Mars', strength: 'Strong', planets: 'Ketu 8°12\'', significance: 'Marriage, partnerships, business, spouse', color: 'from-pink-500 to-rose-600' },
            { num: 8, name: 'Ayu Bhava', sign: 'Taurus ♉', lord: 'Venus', strength: 'Very Weak', planets: 'Empty', significance: 'Longevity, transformation, occult, inheritance', color: 'from-indigo-500 to-purple-600' },
            { num: 9, name: 'Dharma Bhava', sign: 'Gemini ♊', lord: 'Mercury', strength: 'Strong', planets: 'Mercury 18°45\'', significance: 'Father, fortune, religion, higher learning', color: 'from-cyan-500 to-blue-600' },
            { num: 10, name: 'Karma Bhava', sign: 'Cancer ♋', lord: 'Moon', strength: 'Very Strong', planets: 'Sun 23°53\', Mars 16°28\'', significance: 'Career, status, profession, public image', color: 'from-violet-500 to-indigo-600' },
            { num: 11, name: 'Labha Bhava', sign: 'Leo ♌', lord: 'Sun', strength: 'Strong', planets: 'Moon 15°30\', Jupiter 8°15\'', significance: 'Gains, income, friends, aspirations', color: 'from-lime-500 to-green-600' },
            { num: 12, name: 'Vyaya Bhava', sign: 'Virgo ♍', lord: 'Mercury', strength: 'Moderate', planets: 'Saturn 22°10\', Rahu 8°12\'', significance: 'Losses, expenses, spirituality, foreign lands', color: 'from-slate-500 to-gray-600' }
          ].map((house) => (
            <div key={house.num} className={`bg-gradient-to-br ${house.color} rounded-xl p-5 text-white shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-2xl font-black mb-1">House {house.num}</div>
                  <div className="text-sm font-bold opacity-90">{house.name}</div>
                </div>
                <div className="text-3xl font-bold opacity-80">{house.sign.split(' ')[1]}</div>
              </div>
              
              <div className="space-y-2 bg-white bg-opacity-20 rounded-lg p-3">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold">Sign:</span>
                  <span>{house.sign}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold">Lord:</span>
                  <span>{house.lord}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold">Strength:</span>
                  <span className="font-bold">{house.strength}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold">Planets:</span>
                  <span className="font-mono text-[10px]">{house.planets}</span>
                </div>
              </div>
              
              <div className="mt-3 text-xs bg-white bg-opacity-20 rounded-lg p-2">
                <div className="font-semibold mb-1">Significance:</div>
                <div className="opacity-90 leading-relaxed">{house.significance}</div>
              </div>
            </div>
          ))}
        </div>
        </div>
        )}
      </div>

      {/* Planetary Strength & Dignity Section */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border-2 border-gray-300 p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.planetaryStrengthAnalysis}</h2>
            <p className="text-sm text-gray-600">{t.shadbalaStatus}</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {chart.planets?.map((planet, idx) => {
            const planetSymbols: Record<string, string> = {
              'Sun': '☉', 'Moon': '☾', 'Mars': '♂', 'Mercury': '☿',
              'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋'
            };
            
            // Mock strength values (in real app, these would come from backend calculations)
            const strengthData: Record<string, { shadbala: number; status: string; color: string; dignity: string }> = {
              'Sun': { shadbala: 425, status: 'Strong', color: 'green', dignity: 'Exalted in 10th' },
              'Moon': { shadbala: 380, status: 'Moderate', color: 'yellow', dignity: 'Own Sign' },
              'Mars': { shadbala: 290, status: 'Weak', color: 'orange', dignity: 'Neutral' },
              'Mercury': { shadbala: 410, status: 'Strong', color: 'green', dignity: 'Friend\'s Sign' },
              'Jupiter': { shadbala: 395, status: 'Strong', color: 'green', dignity: 'Friend\'s Sign' },
              'Venus': { shadbala: 445, status: 'Very Strong', color: 'emerald', dignity: 'Own Sign' },
              'Saturn': { shadbala: 310, status: 'Weak', color: 'orange', dignity: 'Enemy\'s Sign' },
              'Rahu': { shadbala: 350, status: 'Moderate', color: 'yellow', dignity: 'Shadowy' },
              'Ketu': { shadbala: 350, status: 'Moderate', color: 'yellow', dignity: 'Shadowy' }
            };
            
            const strength = strengthData[planet.planet];
            const percentage = (strength.shadbala / 500) * 100;
            
            const statusColors: Record<string, string> = {
              'green': 'from-green-500 to-emerald-600',
              'emerald': 'from-emerald-500 to-green-600',
              'yellow': 'from-yellow-500 to-amber-600',
              'orange': 'from-orange-500 to-red-600'
            };
            
            return (
              <div key={idx} className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-purple-300 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${statusColors[strength.color]} rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-md`}>
                      {planetSymbols[planet.planet]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{getPlanetName(planet.planet)}</div>
                      <div className="text-xs text-gray-600">{getSignName(planet.sign)}</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 bg-gradient-to-r ${statusColors[strength.color]} text-white text-xs font-bold rounded-full shadow-sm`}>
                    {getStrengthStatus(strength.status)}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-600">{t.shadbalScore}</span>
                    <span className="text-sm font-bold text-gray-900">{strength.shadbala}/500</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${statusColors[strength.color]} transition-all duration-500 shadow-inner`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.dignityLabel}:</span>
                    <span className="font-semibold text-gray-900">{getDignityName(strength.dignity)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.houseLabel}:</span>
                    <span className="font-semibold text-gray-900">{t.houseNumber(planet.house)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.nakshatraLabel}:</span>
                    <span className="font-semibold text-gray-900">{getNakshatraName(planet.nakshatra)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            {t.strengthClassificationGuide}
          </h4>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded"></div>
              <span className="text-sm text-gray-700"><strong>{t.veryStrong}:</strong> 400+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded"></div>
              <span className="text-sm text-gray-700"><strong>{t.strong}:</strong> 350-400</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded"></div>
              <span className="text-sm text-gray-700"><strong>{t.moderate}:</strong> 300-350</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-600 rounded"></div>
              <span className="text-sm text-gray-700"><strong>{t.weak}:</strong> Below 300</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Planetary Aspects & Relationships */}
      <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-2xl border-2 border-violet-200 p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t.planetaryAspectsRelationships}</h2>
              <p className="text-sm text-gray-600">{t.vedicAspectsDrishti}</p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Major Aspects */}
          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-violet-200">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-violet-600" />
              {t.majorAspectsDrishti}
            </h3>
            <div className="space-y-3">
              {[
                { from: 'Jupiter ♃', to: 'Moon ☾', type: t.aspect5th, strength: t.strong, color: 'from-green-500 to-emerald-600' },
                { from: 'Saturn ♄', to: 'Mars ♂', type: t.aspect3rd, strength: t.moderate, color: 'from-yellow-500 to-amber-600' },
                { from: 'Mars ♂', to: 'Venus ♀', type: t.aspect8th, strength: t.weak, color: 'from-orange-500 to-red-600' },
                { from: 'Sun ☉', to: 'Mercury ☿', type: t.conjunction, strength: t.veryStrong, color: 'from-blue-500 to-indigo-600' }
              ].map((aspect, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-bold text-gray-900">{aspect.from}</div>
                    <div className="text-xs text-gray-500">→</div>
                    <div className="text-sm font-bold text-gray-900">{aspect.to}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600">{aspect.type}</span>
                    <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${aspect.color} text-white font-bold`}>
                      {aspect.strength}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Planetary Relationships */}
          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-purple-200">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-600" />
              {t.naturalRelationships}
            </h3>
            <div className="space-y-3">
              {[
                { planet: 'Sun ☉', friends: 'Moon, Mars, Jupiter', enemies: 'Venus, Saturn', neutral: 'Mercury' },
                { planet: 'Moon ☾', friends: 'Sun, Mercury', enemies: t.none, neutral: 'Mars, Jupiter, Venus, Saturn' },
                { planet: 'Mars ♂', friends: 'Sun, Moon, Jupiter', enemies: 'Mercury', neutral: 'Venus, Saturn' },
                { planet: 'Jupiter ♃', friends: 'Sun, Moon, Mars', enemies: 'Mercury, Venus', neutral: 'Saturn' }
              ].map((rel, idx) => (
                <div key={idx} className="bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-lg p-3 border border-purple-200">
                  <div className="font-bold text-sm text-gray-900 mb-2">{rel.planet}</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex gap-2">
                      <span className="font-semibold text-green-600">{t.friends}:</span>
                      <span className="text-gray-700">{rel.friends}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-red-600">{t.enemies}:</span>
                      <span className="text-gray-700">{rel.enemies}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-yellow-600">{t.neutral}:</span>
                      <span className="text-gray-700">{rel.neutral}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Special Planetary Combinations */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-md border-2 border-fuchsia-200">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-fuchsia-600" />
            {t.specialPlanetaryCombinations}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: t.gajaKesariYoga, planets: 'Jupiter-Moon', effect: t.wisdomProsperityFame, color: 'from-yellow-500 to-amber-600' },
              { name: t.budhAdityaYoga, planets: 'Sun-Mercury', effect: t.intelligenceCommunication, color: 'from-orange-500 to-red-600' },
              { name: t.chandraMangalYoga, planets: 'Moon-Mars', effect: t.wealthPropertyGains, color: 'from-green-500 to-emerald-600' }
            ].map((combo, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${combo.color} rounded-xl p-4 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all`}>
                <div className="font-bold text-sm mb-2">{combo.name}</div>
                <div className="text-xs opacity-90 mb-2">{t.planetsLabel2}: {combo.planets}</div>
                <div className="text-xs bg-white bg-opacity-20 rounded px-2 py-1">{combo.effect}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nakshatra Analysis */}
      <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 rounded-2xl border-2 border-rose-200 p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.nakshatraAnalysisTitle}</h2>
            <p className="text-sm text-gray-600">{t.lunarMansionsInfluence}</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {chart.planets?.filter(p => p.nakshatra).slice(0, 9).map((planet, idx) => {
            const planetSymbols: Record<string, string> = {
              'Sun': '☉', 'Moon': '☾', 'Mars': '♂', 'Mercury': '☿',
              'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋'
            };
            
            const nakshatraInfo: Record<string, { deity: string; symbol: string; quality: string; color: string }> = {
              'Ashwini': { deity: 'Ashwini Kumaras', symbol: 'Horse Head', quality: 'Healing, Swift Action', color: 'from-red-400 to-orange-500' },
              'Bharani': { deity: 'Yama', symbol: 'Yoni', quality: 'Transformation, Birth', color: 'from-orange-400 to-amber-500' },
              'Krittika': { deity: 'Agni', symbol: 'Razor', quality: 'Cutting, Purifying', color: 'from-yellow-400 to-red-500' },
              'Rohini': { deity: 'Brahma', symbol: 'Cart', quality: 'Growth, Creation', color: 'from-pink-400 to-rose-500' },
              'Mrigashira': { deity: 'Soma', symbol: 'Deer Head', quality: 'Seeking, Searching', color: 'from-green-400 to-emerald-500' },
              'Ardra': { deity: 'Rudra', symbol: 'Teardrop', quality: 'Destruction, Renewal', color: 'from-blue-400 to-cyan-500' },
              'Punarvasu': { deity: 'Aditi', symbol: 'Quiver of Arrows', quality: 'Renewal, Return', color: 'from-yellow-400 to-green-500' },
              'Pushya': { deity: 'Brihaspati', symbol: 'Udder of Cow', quality: 'Nourishment, Support', color: 'from-blue-400 to-indigo-500' },
              'Ashlesha': { deity: 'Nagas', symbol: 'Coiled Serpent', quality: 'Embracing, Clinging', color: 'from-purple-400 to-indigo-500' },
              'Magha': { deity: 'Pitris', symbol: 'Throne', quality: 'Authority, Legacy', color: 'from-red-400 to-pink-500' },
              'Purva Phalguni': { deity: 'Bhaga', symbol: 'Front Legs of Bed', quality: 'Enjoyment, Pleasure', color: 'from-pink-400 to-fuchsia-500' },
              'Uttara Phalguni': { deity: 'Aryaman', symbol: 'Back Legs of Bed', quality: 'Partnership, Union', color: 'from-orange-400 to-yellow-500' },
              'Hasta': { deity: 'Savitar', symbol: 'Hand', quality: 'Skill, Craftsmanship', color: 'from-green-400 to-teal-500' },
              'Chitra': { deity: 'Tvashtar', symbol: 'Bright Jewel', quality: 'Artistry, Beauty', color: 'from-purple-400 to-pink-500' },
              'Swati': { deity: 'Vayu', symbol: 'Coral', quality: 'Independence, Movement', color: 'from-cyan-400 to-blue-500' },
              'Vishakha': { deity: 'Indra-Agni', symbol: 'Triumphal Arch', quality: 'Goal-oriented, Determined', color: 'from-red-400 to-purple-500' },
              'Anuradha': { deity: 'Mitra', symbol: 'Lotus', quality: 'Friendship, Devotion', color: 'from-blue-400 to-purple-500' },
              'Jyeshtha': { deity: 'Indra', symbol: 'Earring', quality: 'Protection, Seniority', color: 'from-red-400 to-orange-500' },
              'Mula': { deity: 'Nirriti', symbol: 'Root', quality: 'Foundation, Investigation', color: 'from-gray-500 to-slate-600' },
              'Purva Ashadha': { deity: 'Apas', symbol: 'Elephant Tusk', quality: 'Invincibility, Victory', color: 'from-yellow-400 to-orange-500' },
              'Uttara Ashadha': { deity: 'Vishvadevas', symbol: 'Planks of Bed', quality: 'Final Victory, Permanent', color: 'from-orange-400 to-red-500' },
              'Shravana': { deity: 'Vishnu', symbol: 'Ear', quality: 'Listening, Learning', color: 'from-blue-400 to-cyan-500' },
              'Dhanishta': { deity: 'Vasus', symbol: 'Drum', quality: 'Wealth, Rhythm', color: 'from-green-400 to-emerald-500' },
              'Shatabhisha': { deity: 'Varuna', symbol: 'Empty Circle', quality: 'Healing, Mystery', color: 'from-cyan-400 to-blue-500' },
              'Purva Bhadrapada': { deity: 'Aja Ekapada', symbol: 'Front of Funeral Cot', quality: 'Transformation, Purification', color: 'from-indigo-400 to-purple-500' },
              'Uttara Bhadrapada': { deity: 'Ahir Budhnya', symbol: 'Back of Funeral Cot', quality: 'Depth, Wisdom', color: 'from-purple-400 to-violet-500' },
              'Revati': { deity: 'Pushan', symbol: 'Fish', quality: 'Nourishment, Journey', color: 'from-pink-400 to-rose-500' }
            };
            
            const info = nakshatraInfo[planet.nakshatra as keyof typeof nakshatraInfo] || { deity: 'Unknown', symbol: 'N/A', quality: 'Various', color: 'from-gray-400 to-gray-500' };
            
            return (
              <div key={idx} className={`bg-gradient-to-br ${info.color} rounded-xl p-5 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-2xl font-bold">{planetSymbols[planet.planet]} {planet.planet}</div>
                    <div className="text-sm opacity-90 mt-1">{t.inNakshatra} {planet.nakshatra}</div>
                  </div>
                  <div className="text-4xl opacity-70">✧</div>
                </div>
                
                <div className="space-y-2 bg-white bg-opacity-20 rounded-lg p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">{t.deity}:</span>
                    <span className="text-xs">{info.deity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{t.symbol}:</span>
                    <span className="text-xs">{info.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{t.pada}:</span>
                    <span className="text-xs">{planet.pada}/4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{t.degreeLabel}:</span>
                    <span className="text-xs font-mono">{planet.degree.toFixed(2)}°</span>
                  </div>
                </div>
                
                <div className="mt-3 text-xs bg-white bg-opacity-20 rounded-lg p-2">
                  <div className="font-semibold mb-1">{t.quality}:</div>
                  <div className="opacity-90">{info.quality}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 bg-white rounded-xl p-5 border-2 border-rose-200">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-rose-600" />
            {t.nakshatraSignificance}
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {t.nakshatraDescription}
          </p>
        </div>
      </div>

      {/* Tabbed Analysis Section */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
        <div className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex">
            {[
              { id: 'overview', label: t.overview, icon: Eye },
              { id: 'detailed', label: t.detailedAnalysis, icon: Target },
              { id: 'yogas', label: t.yogasCombinations, icon: Award },
              { id: 'dashas', label: t.dashasPeriods, icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-6 py-4 font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-600 border-b-4 border-purple-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 inline mr-2 ${activeTab === tab.id ? 'text-purple-600' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-purple-600" />
                  {t.chartOverview}
                </h3>
                <p className="text-gray-600 mb-6">{t.quickInsights}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-orange-500" />
                    {t.sunSignAnalysis}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t.signColon}:</span>
                      <span className="font-bold text-gray-900">♋ Cancer</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t.houseColon}:</span>
                      <span className="font-bold text-gray-900">10th ({t.career})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t.nakshatraColon}:</span>
                      <span className="font-bold text-gray-900">Ashlesha</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 mt-4">
                      <p className="text-sm text-gray-700">
                        <strong>Interpretation:</strong> Sun in 10th house indicates strong career focus and public recognition. 
                        Cancer brings emotional depth and intuition to professional life.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                  <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Moon className="w-5 h-5 text-blue-500" />
                    {t.moonSignAnalysis}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t.signColon}:</span>
                      <span className="font-bold text-gray-900">♌ Leo</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t.houseColon}:</span>
                      <span className="font-bold text-gray-900">11th ({t.gains})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t.nakshatraColon}:</span>
                      <span className="font-bold text-gray-900">Purva Phalguni</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 mt-4">
                      <p className="text-sm text-gray-700">
                        <strong>Interpretation:</strong> Moon in 11th house brings emotional fulfillment through friendships and achievements. 
                        Leo placement adds confidence and leadership qualities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Ascendant (Lagna) Analysis
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rising Sign:</span>
                      <span className="font-bold text-xl text-gray-900">♎ Libra</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ruling Planet:</span>
                      <span className="font-bold text-gray-900">Venus</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Element:</span>
                      <span className="font-bold text-gray-900">Air</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Quality:</span>
                      <span className="font-bold text-gray-900">Cardinal</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <strong>Personality Traits:</strong> Diplomatic, balanced, charming, and aesthetic. 
                      Natural peacemaker with strong sense of justice and harmony. 
                      Attracted to beauty, art, and partnerships.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'detailed' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-600" />
                  Detailed Planetary Analysis
                </h3>
                <p className="text-gray-600 mb-6">In-depth examination of each planet's position and influence</p>
              </div>
              
              <div className="space-y-4">
                {chart.planets?.map((planet, idx) => {
                  const planetSymbols: Record<string, string> = {
                    'Sun': '☉', 'Moon': '☾', 'Mars': '♂', 'Mercury': '☿',
                    'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋'
                  };
                  const planetColors: Record<string, string> = {
                    'Sun': 'from-orange-400 to-red-500',
                    'Moon': 'from-blue-400 to-indigo-500',
                    'Mars': 'from-red-500 to-pink-600',
                    'Mercury': 'from-green-400 to-emerald-500',
                    'Jupiter': 'from-yellow-400 to-orange-500',
                    'Venus': 'from-pink-400 to-rose-500',
                    'Saturn': 'from-gray-600 to-gray-800',
                    'Rahu': 'from-purple-600 to-indigo-700',
                    'Ketu': 'from-indigo-600 to-purple-700'
                  };
                  
                  return (
                    <div key={idx} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all hover:shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${planetColors[planet.planet]} rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                          {planetSymbols[planet.planet]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="text-xl font-bold text-gray-900">{planet.planet}</h4>
                            {planet.retrograde && (
                              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                                ℞ RETROGRADE
                              </span>
                            )}
                          </div>
                          <div className="grid md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Sign</div>
                              <div className="font-semibold text-purple-700">{planet.sign}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Degree</div>
                              <div className="font-semibold text-gray-900">
                                {Math.floor(planet.degree)}°{Math.floor((planet.degree % 1) * 60)}'{Math.floor(((planet.degree % 1) * 60 % 1) * 60)}"
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">House</div>
                              <div className="font-semibold text-gray-900">{planet.house}th</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Nakshatra</div>
                              <div className="font-semibold text-indigo-700">{planet.nakshatra}</div>
                            </div>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Pada:</span>
                              <span className="font-semibold text-gray-900">{planet.pada}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Lord:</span>
                              <span className="font-semibold text-gray-900">{planet.lord}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {activeTab === 'yogas' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-purple-600" />
                  Yogas & Planetary Combinations
                </h3>
                <p className="text-gray-600 mb-6">Special planetary alignments and their effects</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">Gaja Kesari Yoga</h4>
                      <p className="text-xs text-green-700 font-semibold">BENEFICIAL • STRENGTH: 75%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Jupiter and Moon in mutual kendras. This powerful yoga brings wisdom, wealth, and respect in society.
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-2">Effects:</div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✓ Strong intellect and wisdom</li>
                      <li>✓ Financial prosperity</li>
                      <li>✓ Good reputation and social standing</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-300">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">Budha Aditya Yoga</h4>
                      <p className="text-xs text-blue-700 font-semibold">BENEFICIAL • STRENGTH: 65%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Sun and Mercury in conjunction. Enhances intelligence, communication skills, and analytical abilities.
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-2">Effects:</div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✓ Excellent communication skills</li>
                      <li>✓ Sharp intellect and logic</li>
                      <li>✓ Success in education</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">Malavya Yoga</h4>
                      <p className="text-xs text-purple-700 font-semibold">BENEFICIAL • STRENGTH: 80%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Venus in Kendra from Moon. Creates charm, artistic talents, and material comforts.
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-2">Effects:</div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✓ Natural charisma and beauty</li>
                      <li>✓ Artistic and creative talents</li>
                      <li>✓ Material wealth and luxury</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">Raj Yoga</h4>
                      <p className="text-xs text-yellow-700 font-semibold">BENEFICIAL • STRENGTH: 70%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Lords of Kendra and Trikona houses in mutual aspect. Brings power, authority, and success.
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-2">Effects:</div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✓ Leadership and authority</li>
                      <li>✓ Career advancement</li>
                      <li>✓ Recognition and fame</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'dashas' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-spin-slow" />
                  {t.vimshottariDasha}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{t.planetaryPeriods}</p>
              </div>
              
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border-2 border-indigo-300 dark:border-indigo-700 mb-6 shadow-xl">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e533_1px,transparent_1px),linear-gradient(to_bottom,#4f46e533_1px,transparent_1px)] bg-[size:40px_40px] animate-[grid_20s_linear_infinite] opacity-20"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-xl text-gray-900 dark:text-white">{t.currentDasha}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t.activePlanetaryPeriod}</p>
                    </div>
                    <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold text-sm shadow-lg animate-pulse">
                      {t.activeNow}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { level: t.mahaLevel, planet: 'Venus', symbol: '♀', start: 'Mar 2018', end: 'Mar 2038', duration: '20 ' + t.years, color: 'from-pink-500 to-rose-600', borderColor: 'border-pink-300 dark:border-pink-700', delay: 0 },
                      { level: t.antarLevel, planet: 'Sun', symbol: '☉', start: 'Oct 2024', end: 'Feb 2026', duration: '18 ' + t.months, color: 'from-orange-500 to-red-600', borderColor: 'border-orange-300 dark:border-orange-700', delay: 100 },
                      { level: t.pratyantarLevel, planet: 'Jupiter', symbol: '♃', start: 'Nov 2025', end: 'Mar 2026', duration: '4 ' + t.months, color: 'from-yellow-500 to-amber-600', borderColor: 'border-yellow-300 dark:border-yellow-700', delay: 200 }
                    ].map((dasha, idx) => (
                      <div 
                        key={idx}
                        style={{ animationDelay: `${dasha.delay}ms` }}
                        className={`bg-white dark:bg-gray-800 rounded-xl p-5 border-3 ${dasha.borderColor} shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up group`}
                      >
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase font-bold tracking-wide">{dasha.level}</div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`text-5xl group-hover:scale-125 transition-transform duration-300`}>{dasha.symbol}</div>
                          <div>
                            <div className="font-bold text-lg text-gray-900 dark:text-white">{dasha.planet}</div>
                            <div className={`text-xs font-bold bg-gradient-to-r ${dasha.color} bg-clip-text text-transparent`}>{dasha.duration}</div>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                          <div className="flex justify-between">
                            <span className="font-semibold">{t.startDate}:</span>
                            <span>{dasha.start}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">{t.endDate}:</span>
                            <span>{dasha.end}</span>
                          </div>
                        </div>
                        <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${dasha.color} rounded-full transition-all duration-1000`} style={{ width: idx === 0 ? '35%' : idx === 1 ? '70%' : '45%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Sub-Dasha Timeline for Current Antar Dasha */}
              <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border-2 border-orange-300 dark:border-orange-700 shadow-xl">
                {/* Animated background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
                
                <div className="relative z-10">
                  <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400 animate-bounce-subtle" />
                    {t.subPeriodsWithin} Sun {t.antarLevel} ({t.current})
                  </h4>
                  <div className="space-y-3">
                    {[
                      { planet: 'Sun', symbol: '☉', start: 'Nov 2024', end: 'Dec 2024', days: 36, active: false, color: 'from-orange-500 to-red-600', delay: 0 },
                      { planet: 'Moon', symbol: '☾', start: 'Dec 2024', end: 'Jan 2025', days: 60, active: false, color: 'from-blue-500 to-indigo-600', delay: 50 },
                      { planet: 'Mars', symbol: '♂', start: 'Jan 2025', end: 'Feb 2025', days: 42, active: false, color: 'from-red-600 to-rose-700', delay: 100 },
                      { planet: 'Rahu', symbol: '☊', start: 'Feb 2025', end: 'Apr 2025', days: 108, active: false, color: 'from-purple-700 to-indigo-800', delay: 150 },
                      { planet: 'Jupiter', symbol: '♃', start: 'Apr 2025', end: 'Jun 2025', days: 96, active: false, color: 'from-yellow-500 to-amber-600', delay: 200 },
                      { planet: 'Saturn', symbol: '♄', start: 'Jun 2025', end: 'Aug 2025', days: 114, active: false, color: 'from-gray-600 to-slate-800', delay: 250 },
                      { planet: 'Mercury', symbol: '☿', start: 'Aug 2025', end: 'Oct 2025', days: 84, active: false, color: 'from-green-500 to-emerald-600', delay: 300 },
                      { planet: 'Ketu', symbol: '☋', start: 'Oct 2025', end: 'Nov 2025', days: 42, active: false, color: 'from-indigo-700 to-violet-800', delay: 350 },
                      { planet: 'Venus', symbol: '♀', start: 'Nov 2025', end: 'Dec 2025', days: 120, active: true, color: 'from-pink-500 to-rose-600', delay: 400 }
                    ].map((sub, idx) => (
                      <div 
                        key={idx}
                        style={{ animationDelay: `${sub.delay}ms` }}
                        className={`group bg-white dark:bg-gray-800 rounded-xl p-4 border-2 ${sub.active ? 'border-orange-400 dark:border-orange-500 shadow-lg ring-2 ring-orange-300 dark:ring-orange-600 animate-pulse' : 'border-gray-200 dark:border-gray-700'} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 bg-gradient-to-br ${sub.color} rounded-xl flex items-center justify-center text-2xl text-white shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${sub.active ? 'animate-pulse' : ''}`}>
                              {sub.symbol}
                            </div>
                            <div>
                              <div className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                {sub.planet} {t.pratyantarLevel}
                                {sub.active && <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full animate-pulse shadow-lg">{t.now}</span>}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3" />
                                {sub.start} - {sub.end}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold text-lg bg-gradient-to-r ${sub.color} bg-clip-text text-transparent`}>{sub.days}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{t.days}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-pulse" />
                  {t.upcomingPeriods}
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { planet: 'Venus', symbol: '♀', period: '2018-2038', years: 20, color: 'from-pink-500 to-rose-600', bgColor: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20', borderColor: 'border-pink-300 dark:border-pink-700', progress: 35, delay: 0 },
                    { planet: 'Sun', symbol: '☉', period: '2038-2044', years: 6, color: 'from-orange-500 to-amber-600', bgColor: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20', borderColor: 'border-orange-300 dark:border-orange-700', progress: 0, delay: 100 },
                    { planet: 'Moon', symbol: '☾', period: '2044-2054', years: 10, color: 'from-blue-500 to-indigo-600', bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20', borderColor: 'border-blue-300 dark:border-blue-700', progress: 0, delay: 200 },
                    { planet: 'Mars', symbol: '♂', period: '2054-2061', years: 7, color: 'from-red-500 to-rose-600', bgColor: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20', borderColor: 'border-red-300 dark:border-red-700', progress: 0, delay: 300 },
                    { planet: 'Rahu', symbol: '☊', period: '2061-2079', years: 18, color: 'from-purple-500 to-indigo-600', bgColor: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20', borderColor: 'border-purple-300 dark:border-purple-700', progress: 0, delay: 400 },
                    { planet: 'Jupiter', symbol: '♃', period: '2079-2095', years: 16, color: 'from-yellow-500 to-amber-600', bgColor: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20', borderColor: 'border-yellow-300 dark:border-yellow-700', progress: 0, delay: 500 },
                    { planet: 'Saturn', symbol: '♄', period: '2095-2114', years: 19, color: 'from-gray-600 to-slate-700', bgColor: 'from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20', borderColor: 'border-gray-400 dark:border-gray-600', progress: 0, delay: 600 },
                    { planet: 'Mercury', symbol: '☿', period: '2114-2131', years: 17, color: 'from-green-500 to-emerald-600', bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20', borderColor: 'border-green-300 dark:border-green-700', progress: 0, delay: 700 },
                    { planet: 'Ketu', symbol: '☋', period: '2131-2138', years: 7, color: 'from-indigo-700 to-violet-800', bgColor: 'from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20', borderColor: 'border-indigo-300 dark:border-indigo-700', progress: 0, delay: 800 }
                  ].map((dasha, idx) => (
                    <div 
                      key={idx}
                      style={{ animationDelay: `${dasha.delay}ms` }}
                      className={`group relative overflow-hidden bg-gradient-to-br ${dasha.bgColor} rounded-2xl p-6 border-2 ${dasha.borderColor} hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up`}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      {/* Decorative element */}
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${dasha.color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${dasha.color} rounded-xl flex items-center justify-center text-3xl text-white shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                            {dasha.symbol}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-lg text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">{dasha.planet}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold mt-0.5">{t.mahaLevel || 'Maha Dasha'}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">{t.period || 'Period'}:</span>
                            <span className="text-gray-900 dark:text-white font-bold">{dasha.period}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">{t.duration || 'Duration'}:</span>
                            <span className={`font-bold bg-gradient-to-r ${dasha.color} bg-clip-text text-transparent`}>{dasha.years} {t.years}</span>
                          </div>
                        </div>
                        
                        {dasha.progress > 0 && (
                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                              <span className="font-semibold">{t.progress || 'Progress'}</span>
                              <span className="font-bold">{dasha.progress}%</span>
                            </div>
                            <div className="h-3 bg-white dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                              <div 
                                className={`h-full bg-gradient-to-r ${dasha.color} rounded-full transition-all duration-1000 shadow-lg group-hover:scale-x-105 transform-gpu`} 
                                style={{ width: `${dasha.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {dasha.progress === 0 && (
                          <div className="mt-4 pt-3 border-t-2 border-dashed border-gray-300 dark:border-gray-600">
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-center font-semibold">{t.upcoming || 'Upcoming Period'}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Accurate Planetary Positions Table */}
      <div className="mt-6 bg-white rounded-2xl border-2 border-violet-200 p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Accurate Planetary Positions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-bold text-gray-900">Planet</th>
                <th className="text-left py-3 px-4 font-bold text-gray-900">Sign</th>
                <th className="text-left py-3 px-4 font-bold text-gray-900">Degree</th>
                <th className="text-left py-3 px-4 font-bold text-gray-900">House</th>
                <th className="text-left py-3 px-4 font-bold text-gray-900">Nakshatra</th>
                <th className="text-left py-3 px-4 font-bold text-gray-900">Pada</th>
                <th className="text-left py-3 px-4 font-bold text-gray-900">Lord</th>
                <th className="text-left py-3 px-4 font-bold text-gray-900">Retrograde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chart.planets && chart.planets.length > 0 ? (
                chart.planets.map((planet, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-violet-50 ${
                      planet.planet.includes('Rahu') || planet.planet.includes('Ketu') 
                        ? 'bg-yellow-50' 
                        : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold">{planet.planet}</td>
                    <td className="py-3 px-4">{planet.sign}</td>
                    <td className="py-3 px-4">
                      {Math.floor(planet.degree)}°
                      {Math.floor((planet.degree % 1) * 60)}'
                      {Math.floor(((planet.degree % 1) * 60 % 1) * 60)}"
                    </td>
                    <td className="py-3 px-4">{planet.house}th</td>
                    <td className="py-3 px-4">{planet.nakshatra || 'N/A'}</td>
                    <td className="py-3 px-4">{planet.pada || 'N/A'}</td>
                    <td className="py-3 px-4">{planet.lord || 'N/A'}</td>
                    <td className={`py-3 px-4 ${
                      planet.retrograde ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {planet.retrograde ? 'Retrograde' : 'Direct'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 px-4 text-center text-gray-500">
                    No planetary data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 border-2 border-violet-200">
            <h4 className="font-bold text-gray-900 mb-2">Planet Positions</h4>
            <div className="space-y-1 text-gray-700">
              <p>☉ Sun - 10th House (Cancer)</p>
              <p>☾ Moon - 11th House (Leo)</p>
              <p>♂ Mars - 12th House (Virgo)</p>
              <p>☿ Mercury - 9th House (Gemini)</p>
              <p>♃ Jupiter - 9th House (Gemini)</p>
              <p>♀ Venus - 11th House (Leo)</p>
              <p>♄ Saturn - 11th House (Leo)</p>
              <p>☊ Rahu - 12th House (Virgo)</p>
              <p>☋ Ketu - 6th House (Pisces)</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
            <h4 className="font-bold text-gray-900 mb-2">Key Yogas</h4>
            <div className="space-y-1 text-gray-700">
              <p>✨ Multiple planets in 11th (Gains)</p>
              <p>💫 Sun in 10th (Career strength)</p>
              <p>🌟 Jupiter-Mercury in 9th (Fortune)</p>
            </div>
            <h4 className="font-bold text-gray-900 mt-4 mb-2">Ascendant</h4>
            <p className="text-gray-700">♎ Libra Rising (Venus ruled)</p>
          </div>
        </div>
      </div>

      {/* AI Interpretation */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border-2 border-violet-200 p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Interpretation</h2>
            <p className="text-gray-600">Powered by advanced astrological AI</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">🌟 Personality Overview</h3>
            <p className="text-gray-700 leading-relaxed">
              Your birth chart reveals a dynamic and creative personality. The planetary positions at your time of birth 
              suggest strong leadership qualities and a natural inclination towards innovation and problem-solving.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">💼 Career & Life Path</h3>
            <p className="text-gray-700 leading-relaxed">
              The alignment suggests success in fields requiring strategic thinking and communication. Your professional 
              journey is marked by steady growth and recognition for your expertise.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">❤️ Relationships & Social Life</h3>
            <p className="text-gray-700 leading-relaxed">
              Strong emphasis on meaningful connections and long-term relationships. You value depth and authenticity 
              in your personal interactions, building lasting bonds with those around you.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 italic">
              💡 This is a sample interpretation. The actual AI-powered analysis will provide detailed insights 
              based on planetary positions, aspects, houses, and yogas in your chart.
            </p>
          </div>
        </div>
      </div>
      
      {/* Detailed Information Modal */}
      {selectedPlanetInfo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPlanetInfo(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {selectedPlanetInfo.type === 'house' ? `House ${selectedPlanetInfo.houseNum}` : selectedPlanetInfo.planet}
                  </h3>
                  <p className="text-sm text-purple-100">
                    {selectedPlanetInfo.chartType} - Detailed Information
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPlanetInfo(null)}
                  className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {selectedPlanetInfo.type === 'house' && (
                <>
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-purple-200">
                    <h4 className="font-bold text-gray-900 text-lg mb-3">House Information</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">House Number:</span>
                        <span className="ml-2 text-gray-900">{selectedPlanetInfo.houseNum}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Sign:</span>
                        <span className="ml-2 text-gray-900 text-xl">{selectedPlanetInfo.sign}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Chart Type:</span>
                        <span className="ml-2 text-gray-900">{selectedPlanetInfo.chartType}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Planets:</span>
                        <span className="ml-2 text-gray-900">{selectedPlanetInfo.planets?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedPlanetInfo.planets && selectedPlanetInfo.planets.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-3">Planets in this House</h4>
                      <div className="space-y-3">
                        {selectedPlanetInfo.planets.map((planet: any, idx: number) => {
                          const planetSymbols: Record<string, string> = {
                            'Sun': '☉', 'Moon': '☾', 'Mars': '♂', 'Mercury': '☿',
                            'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋'
                          };
                          return (
                            <div key={idx} className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border-2 border-gray-200">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl">{planetSymbols[planet.planet]}</span>
                                <div>
                                  <div className="font-bold text-gray-900">{planet.planet}</div>
                                  <div className="text-sm text-gray-600">{planet.sign}</div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                                <div>
                                  <span className="text-gray-600">Degree:</span>
                                  <span className="ml-1 font-semibold text-gray-900">{planet.degree.toFixed(2)}°</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Nakshatra:</span>
                                  <span className="ml-1 font-semibold text-gray-900">{planet.nakshatra}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Lord:</span>
                                  <span className="ml-1 font-semibold text-gray-900">{planet.lord}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Motion:</span>
                                  <span className={`ml-1 font-semibold ${planet.retrograde ? 'text-red-600' : 'text-green-600'}`}>
                                    {planet.retrograde ? 'Retrograde ℞' : 'Direct'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border-2 border-amber-200">
                    <h4 className="font-bold text-gray-900 text-lg mb-3">House Significance</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedPlanetInfo.houseNum === 1 && "Self, personality, physical body, overall life path, and how others perceive you. The Ascendant represents your approach to life."}
                      {selectedPlanetInfo.houseNum === 2 && "Wealth, family, speech, food, early childhood, accumulated resources, and personal values."}
                      {selectedPlanetInfo.houseNum === 3 && "Courage, siblings, short journeys, communication, skills, hobbies, and mental strength."}
                      {selectedPlanetInfo.houseNum === 4 && "Mother, home, property, emotions, education, inner peace, and domestic happiness."}
                      {selectedPlanetInfo.houseNum === 5 && "Children, creativity, intelligence, speculation, romance, past-life merit, and spiritual practices."}
                      {selectedPlanetInfo.houseNum === 6 && "Enemies, diseases, debts, service, daily work, obstacles, and competitive spirit."}
                      {selectedPlanetInfo.houseNum === 7 && "Marriage, partnerships, business relationships, contracts, and how you relate to others."}
                      {selectedPlanetInfo.houseNum === 8 && "Longevity, transformation, occult sciences, sudden events, inheritance, and deep research."}
                      {selectedPlanetInfo.houseNum === 9 && "Father, dharma, higher learning, long journeys, luck, spirituality, and philosophical beliefs."}
                      {selectedPlanetInfo.houseNum === 10 && "Career, reputation, social status, achievements, authority figures, and public image."}
                      {selectedPlanetInfo.houseNum === 11 && "Gains, income, elder siblings, social networks, aspirations, and fulfillment of desires."}
                      {selectedPlanetInfo.houseNum === 12 && "Losses, expenses, foreign lands, spirituality, isolation, liberation, and subconscious mind."}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
