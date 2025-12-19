"""
Social Sharing Service
Generate shareable content in multiple languages
"""

from typing import Dict, Optional
import base64
from datetime import datetime
from app.core.i18n import Language, get_translator


class SocialSharingService:
    """
    Generate shareable content for social media platforms
    Supports WhatsApp, Facebook, Twitter, Instagram with regional languages
    """
    
    def __init__(self):
        self.base_url = "https://192.168.0.102"
        
    def generate_share_text(
        self,
        prediction: Dict,
        language: Language = Language.ENGLISH,
        platform: str = "general"
    ) -> Dict:
        """
        Generate shareable text for a prediction
        """
        translator = get_translator(language)
        
        area = translator.translate(prediction.get("area", ""))
        title = prediction.get("title", "")
        accuracy = int(prediction.get("accuracy", 0) * 100)
        confidence = prediction.get("confidence", "").replace("_", " ")
        
        # Platform-specific formatting
        if platform == "whatsapp":
            text = self._format_whatsapp(prediction, translator, area, title, accuracy, confidence)
        elif platform == "twitter":
            text = self._format_twitter(prediction, translator, area, accuracy)
        elif platform == "facebook":
            text = self._format_facebook(prediction, translator, area, title, accuracy, confidence)
        elif platform == "instagram":
            text = self._format_instagram(prediction, translator, area, accuracy)
        else:
            text = self._format_general(prediction, translator, area, title, accuracy, confidence)
        
        return {
            "text": text,
            "language": language,
            "platform": platform,
            "hashtags": self._get_hashtags(language, area),
            "url": f"{self.base_url}/share/{prediction.get('id', '')}"
        }
    
    def generate_whatsapp_link(
        self,
        prediction: Dict,
        language: Language = Language.ENGLISH
    ) -> str:
        """
        Generate WhatsApp share link
        """
        share_data = self.generate_share_text(prediction, language, "whatsapp")
        text = share_data["text"]
        
        # URL encode for WhatsApp
        import urllib.parse
        encoded_text = urllib.parse.quote(text)
        
        return f"https://wa.me/?text={encoded_text}"
    
    def generate_twitter_link(
        self,
        prediction: Dict,
        language: Language = Language.ENGLISH
    ) -> str:
        """
        Generate Twitter share link
        """
        share_data = self.generate_share_text(prediction, language, "twitter")
        text = share_data["text"]
        hashtags = ",".join(share_data["hashtags"])
        
        import urllib.parse
        encoded_text = urllib.parse.quote(text)
        
        return f"https://twitter.com/intent/tweet?text={encoded_text}&hashtags={hashtags}"
    
    def generate_facebook_link(
        self,
        prediction: Dict,
        language: Language = Language.ENGLISH
    ) -> str:
        """
        Generate Facebook share link
        """
        share_data = self.generate_share_text(prediction, language, "facebook")
        url = share_data["url"]
        
        import urllib.parse
        encoded_url = urllib.parse.quote(url)
        
        return f"https://www.facebook.com/sharer/sharer.php?u={encoded_url}"
    
    def generate_share_image(
        self,
        prediction: Dict,
        language: Language = Language.ENGLISH
    ) -> Dict:
        """
        Generate shareable image data (for Instagram stories, etc.)
        """
        translator = get_translator(language)
        
        # In production, this would generate actual image using PIL/Canvas
        # For now, return structured data for frontend rendering
        
        return {
            "type": "image",
            "format": "png",
            "width": 1080,
            "height": 1920,
            "template": "prediction_story",
            "data": {
                "background_gradient": ["#9333ea", "#3b82f6"],
                "area": translator.translate(prediction.get("area", "")),
                "title": prediction.get("title", ""),
                "date": prediction.get("date", ""),
                "accuracy": f"{int(prediction.get('accuracy', 0) * 100)}%",
                "confidence": prediction.get("confidence", "").replace("_", " ").title(),
                "branding": {
                    "logo": "Astor AI",
                    "tagline": translator.translate("ai_powered")
                }
            }
        }
    
    def _format_whatsapp(self, prediction, translator, area, title, accuracy, confidence):
        """Format for WhatsApp with emojis"""
        if translator.language == Language.MARATHI:
            return f"""🌟 *{area}*

📊 {title}

✅ अचूकता: {accuracy}%
🎯 विश्वास: {confidence}

🔮 Astor AI द्वारे
#ज्योतिष #भविष्यवाणी #AstorAI"""
        
        elif translator.language == Language.HINDI:
            return f"""🌟 *{area}*

📊 {title}

✅ सटीकता: {accuracy}%
🎯 आत्मविश्वास: {confidence}

🔮 Astor AI द्वारा
#ज्योतिष #भविष्यवाणी #AstorAI"""
        
        else:
            return f"""🌟 *{area}*

📊 {title}

✅ Accuracy: {accuracy}%
🎯 Confidence: {confidence}

🔮 By Astor AI
#Astrology #Predictions #AstorAI"""
    
    def _format_twitter(self, prediction, translator, area, accuracy):
        """Format for Twitter (character limit)"""
        if translator.language == Language.MARATHI:
            return f"🌟 {area} - {accuracy}% अचूकता\n\n🔮 AI-सक्षम भविष्यवाणी"
        elif translator.language == Language.HINDI:
            return f"🌟 {area} - {accuracy}% सटीकता\n\n🔮 AI-संचालित भविष्यवाणी"
        else:
            return f"🌟 {area} - {accuracy}% Accuracy\n\n🔮 AI-Powered Prediction"
    
    def _format_facebook(self, prediction, translator, area, title, accuracy, confidence):
        """Format for Facebook"""
        date = datetime.strptime(prediction.get("date", ""), "%Y-%m-%d").strftime("%B %d, %Y")
        
        if translator.language == Language.MARATHI:
            return f"""🌟 {area} भविष्यवाणी

{title}

📅 तारीख: {date}
✅ अचूकता: {accuracy}%
🎯 विश्वास पातळी: {confidence}

AI आणि वैदिक ज्योतिष यांचे संयोजन करून अचूक भविष्यवाणी.

🔮 Astor AI - तुमचा डिजिटल ज्योतिषी"""
        
        elif translator.language == Language.HINDI:
            return f"""🌟 {area} भविष्यवाणी

{title}

📅 तिथि: {date}
✅ सटीकता: {accuracy}%
🎯 विश्वास स्तर: {confidence}

AI और वैदिक ज्योतिष का संयोजन करके सटीक भविष्यवाणी.

🔮 Astor AI - आपका डिजिटल ज्योतिषी"""
        
        else:
            return f"""🌟 {area} Prediction

{title}

📅 Date: {date}
✅ Accuracy: {accuracy}%
🎯 Confidence Level: {confidence}

Accurate predictions combining AI and Vedic Astrology.

🔮 Astor AI - Your Digital Astrologer"""
    
    def _format_instagram(self, prediction, translator, area, accuracy):
        """Format for Instagram caption"""
        if translator.language == Language.MARATHI:
            return f"""🌟 {area} भविष्यवाणी

{accuracy}% अचूकता ✨

AI + वैदिक ज्योतिष 🔮

#ज्योतिष #भविष्यवाणी #AstorAI #मराठी #वैदिक"""
        
        elif translator.language == Language.HINDI:
            return f"""🌟 {area} भविष्यवाणी

{accuracy}% सटीकता ✨

AI + वैदिक ज्योतिष 🔮

#ज्योतिष #भविष्यवाणी #AstorAI #हिंदी #वैदिक"""
        
        else:
            return f"""🌟 {area} Prediction

{accuracy}% Accuracy ✨

AI + Vedic Astrology 🔮

#Astrology #Predictions #AstorAI #Vedic #AI"""
    
    def _format_general(self, prediction, translator, area, title, accuracy, confidence):
        """General format for any platform"""
        return f"{area}: {title}\n\nAccuracy: {accuracy}% | Confidence: {confidence}\n\nBy Astor AI"
    
    def _get_hashtags(self, language: Language, area: str) -> list:
        """Get relevant hashtags based on language"""
        if language == Language.MARATHI:
            return ["ज्योतिष", "भविष्यवाणी", "AstorAI", "मराठी", "वैदिक", area]
        elif language == Language.HINDI:
            return ["ज्योतिष", "भविष्यवाणी", "AstorAI", "हिंदी", "वैदिक", area]
        else:
            return ["Astrology", "Predictions", "AstorAI", "Vedic", "AI", area]


# Global instance
social_sharing_service = SocialSharingService()
