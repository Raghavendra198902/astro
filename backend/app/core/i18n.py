"""
Internationalization (i18n) Support
Multi-language support for Astro AI Platform
"""

from typing import Dict, Optional
from enum import Enum

class Language(str, Enum):
    """Supported languages"""
    ENGLISH = "en"
    MARATHI = "mr"
    HINDI = "hi"

# Marathi translations (मराठी भाषा)
MARATHI_TRANSLATIONS = {
    # Navigation & UI
    "dashboard": "डॅशबोर्ड",
    "predictions": "भविष्यवाणी",
    "charts": "कुंडली",
    "compatibility": "जुळणी",
    "consultations": "सल्लामसलत",
    "settings": "सेटिंग्ज",
    "profile": "प्रोफाइल",
    "logout": "बाहेर पडा",
    
    # Predictions Page
    "life_events": "जीवनातील घटना",
    "past_events": "भूतकाळातील घटना",
    "future_events": "भविष्यातील घटना",
    "combined_events": "एकत्रित घटना",
    "generate_predictions": "भविष्यवाणी तयार करा",
    "loading": "लोड होत आहे...",
    "no_predictions": "भविष्यवाणी उपलब्ध नाहीत",
    
    # Life Areas
    "career": "करिअर",
    "relationships": "नातेसंबंध",
    "health": "आरोग्य",
    "finance": "आर्थिक",
    "personal": "वैयक्तिक",
    "spiritual": "आध्यात्मिक",
    "education": "शिक्षण",
    "family": "कुटुंब",
    
    # Time Periods
    "today": "आज",
    "this_week": "या आठवड्यात",
    "this_month": "या महिन्यात",
    "this_year": "या वर्षी",
    "past": "भूतकाळ",
    "present": "वर्तमान",
    "future": "भविष्य",
    
    # Chart Elements
    "birth_chart": "जन्मकुंडली",
    "planets": "ग्रह",
    "houses": "भाव",
    "signs": "राशी",
    "aspects": "दृष्टी",
    "yogas": "योग",
    "doshas": "दोष",
    
    # Planets (Marathi names)
    "sun": "सूर्य",
    "moon": "चंद्र",
    "mars": "मंगळ",
    "mercury": "बुध",
    "jupiter": "गुरु",
    "venus": "शुक्र",
    "saturn": "शनि",
    "rahu": "राहू",
    "ketu": "केतू",
    
    # Zodiac Signs (Marathi)
    "aries": "मेष",
    "taurus": "वृषभ",
    "gemini": "मिथुन",
    "cancer": "कर्क",
    "leo": "सिंह",
    "virgo": "कन्या",
    "libra": "तुळा",
    "scorpio": "वृश्चिक",
    "sagittarius": "धनु",
    "capricorn": "मकर",
    "aquarius": "कुंभ",
    "pisces": "मीन",
    
    # Messages
    "welcome": "स्वागत आहे",
    "success": "यशस्वी",
    "error": "त्रुटी",
    "warning": "चेतावणी",
    "info": "माहिती",
    "create_profile": "प्रोफाइल तयार करा",
    "no_profile_found": "प्रोफाइल सापडले नाही",
    "please_create_profile": "कृपया तुमची जन्म माहिती जोडून प्रोफाइल तयार करा",
    
    # Predictions
    "prediction_accuracy": "अचूकता",
    "confidence": "विश्वास",
    "based_on_chart": "तुमच्या जन्मकुंडलीवर आधारित",
    "ai_powered": "AI सक्षम भविष्यवाणी",
    "vedic_analysis": "वैदिक ज्योतिष विश्लेषण",
    "ml_insights": "ML अंतर्दृष्टी",
    
    # Actions
    "view_details": "तपशील पहा",
    "download_report": "रिपोर्ट डाउनलोड करा",
    "book_consultation": "सल्लामसलत बुक करा",
    "share": "शेअर करा",
    "save": "सेव्ह करा",
    "cancel": "रद्द करा",
    "submit": "सबमिट करा",
    "edit": "संपादित करा",
    "delete": "हटवा",
    "view_now": "आता पहा",
    "generated_date": "तयार केली तारीख",
    "name": "नाव",
    "birth_place": "जन्मस्थान",
    "description": "वर्णन",
    "disclaimer": "कृपया लक्षात घ्या: हे भविष्यवाणी मार्गदर्शन साठी आहेत",
    "daily_digest": "दैनिक सारांश",
    "new_predictions": "नवीन भविष्यवाणी",
    "high_accuracy_prediction": "उच्च अचूकता भविष्यवाणी",
    
    # Quality indicators
    "excellent": "उत्कृष्ट",
    "very_good": "अतिशय चांगले",
    "good": "चांगले",
    "moderate": "मध्यम",
    "poor": "कमी",
}

# Hindi translations (हिंदी भाषा)
HINDI_TRANSLATIONS = {
    "dashboard": "डैशबोर्ड",
    "predictions": "भविष्यवाणी",
    "charts": "कुंडली",
    "compatibility": "मिलान",
    "consultations": "परामर्श",
    "settings": "सेटिंग्स",
    "profile": "प्रोफ़ाइल",
    "career": "करियर",
    "relationships": "रिश्ते",
    "health": "स्वास्थ्य",
    "finance": "वित्त",
    "sun": "सूर्य",
    "moon": "चंद्र",
    "mars": "मंगल",
    "mercury": "बुध",
    "jupiter": "गुरु",
    "venus": "शुक्र",
    "saturn": "शनि",
    "rahu": "राहु",
    "ketu": "केतु",
}

# Translation registry
TRANSLATIONS: Dict[Language, Dict[str, str]] = {
    Language.ENGLISH: {},  # Default language
    Language.MARATHI: MARATHI_TRANSLATIONS,
    Language.HINDI: HINDI_TRANSLATIONS,
}

class Translator:
    """Multi-language translator"""
    
    def __init__(self, language: Language = Language.ENGLISH):
        self.language = language
    
    def translate(self, key: str, language: Optional[Language] = None) -> str:
        """Translate a key to target language"""
        lang = language or self.language
        
        if lang == Language.ENGLISH:
            return key
        
        translations = TRANSLATIONS.get(lang, {})
        return translations.get(key, key)
    
    def t(self, key: str) -> str:
        """Shorthand for translate"""
        return self.translate(key)
    
    def set_language(self, language: Language):
        """Change active language"""
        self.language = language

# Global translator instance
translator = Translator()

def get_translator(language: Language = Language.ENGLISH) -> Translator:
    """Get translator for specific language"""
    return Translator(language)

def translate_prediction(prediction: Dict, language: Language) -> Dict:
    """Translate prediction content to target language"""
    if language == Language.ENGLISH:
        return prediction
    
    t = get_translator(language)
    translated = prediction.copy()
    
    # Translate area if present
    if "area" in translated:
        translated["area"] = t.translate(translated["area"])
    
    # Translate category
    if "category" in translated:
        translated["category"] = t.translate(translated["category"])
    
    # Note: AI-generated descriptions would need LLM translation
    # For now, we keep English descriptions and translate UI labels only
    
    return translated
