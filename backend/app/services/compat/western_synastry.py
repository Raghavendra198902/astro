"""
Western Synastry Analysis
Relationship compatibility using Western astrology techniques
"""

from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)


class WesternSynastry:
    """Western astrology compatibility analysis"""
    
    def analyze_synastry(
        self,
        chart_a: Dict[str, Any],
        chart_b: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Perform comprehensive synastry analysis
        
        Args:
            chart_a: First person's chart
            chart_b: Second person's chart
            
        Returns:
            Detailed synastry analysis
        """
        planets_a = chart_a.get("planets", {})
        planets_b = chart_b.get("planets", {})
        
        # Calculate inter-chart aspects
        aspects = self._calculate_interaspects(planets_a, planets_b)
        
        # Analyze key connections
        sun_moon = self._analyze_sun_moon(planets_a, planets_b, aspects)
        venus_mars = self._analyze_venus_mars(planets_a, planets_b, aspects)
        mercury_aspects = self._analyze_mercury(planets_a, planets_b, aspects)
        
        # House overlays (person A's planets in person B's houses)
        overlays_a_in_b = self._calculate_house_overlays(
            planets_a, chart_b.get("houses", []), chart_b.get("ascendant", 0)
        )
        overlays_b_in_a = self._calculate_house_overlays(
            planets_b, chart_a.get("houses", []), chart_a.get("ascendant", 0)
        )
        
        # Calculate overall compatibility score
        score = self._calculate_compatibility_score(aspects, sun_moon, venus_mars)
        
        return {
            "compatibility_score": score,
            "aspects": aspects,
            "sun_moon_connection": sun_moon,
            "venus_mars_chemistry": venus_mars,
            "mercury_communication": mercury_aspects,
            "house_overlays": {
                "a_planets_in_b_houses": overlays_a_in_b,
                "b_planets_in_a_houses": overlays_b_in_a
            },
            "key_themes": self._identify_key_themes(aspects)
        }
    
    def calculate_composite_chart(
        self,
        chart_a: Dict[str, Any],
        chart_b: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculate composite chart (midpoints of both charts)
        
        Args:
            chart_a: First chart
            chart_b: Second chart
            
        Returns:
            Composite chart data
        """
        planets_a = chart_a.get("planets", {})
        planets_b = chart_b.get("planets", {})
        
        composite_planets = {}
        
        for planet_name in ["sun", "moon", "mercury", "venus", "mars", 
                           "jupiter", "saturn"]:
            if planets_a.get(planet_name) and planets_b.get(planet_name):
                long_a = planets_a[planet_name]["longitude"]
                long_b = planets_b[planet_name]["longitude"]
                
                # Calculate midpoint
                midpoint = self._calculate_midpoint(long_a, long_b)
                
                composite_planets[planet_name] = {
                    "longitude": midpoint,
                    "sign": self._get_sign_name(int(midpoint / 30))
                }
        
        # Composite ascendant (midpoint of ascendants)
        asc_a = chart_a.get("ascendant", 0)
        asc_b = chart_b.get("ascendant", 0)
        composite_asc = self._calculate_midpoint(asc_a, asc_b)
        
        return {
            "planets": composite_planets,
            "ascendant": composite_asc,
            "ascendant_sign": self._get_sign_name(int(composite_asc / 30))
        }
    
    def _calculate_interaspects(
        self,
        planets_a: Dict[str, Dict],
        planets_b: Dict[str, Dict]
    ) -> List[Dict[str, Any]]:
        """Calculate aspects between two charts"""
        aspects = []
        
        aspect_orbs = {
            "conjunction": 8,
            "opposition": 8,
            "trine": 8,
            "square": 7,
            "sextile": 6
        }
        
        for name_a, data_a in planets_a.items():
            if not data_a or name_a in ["rahu", "ketu"]:
                continue
            
            for name_b, data_b in planets_b.items():
                if not data_b or name_b in ["rahu", "ketu"]:
                    continue
                
                long_a = data_a["longitude"]
                long_b = data_b["longitude"]
                
                diff = abs(long_a - long_b)
                if diff > 180:
                    diff = 360 - diff
                
                # Check each aspect type
                for aspect_name, orb in aspect_orbs.items():
                    if aspect_name == "conjunction" and diff <= orb:
                        aspects.append({
                            "planet_a": name_a,
                            "planet_b": name_b,
                            "aspect": "conjunction",
                            "orb": round(diff, 2),
                            "nature": self._get_aspect_nature(
                                name_a, name_b, "conjunction"
                            )
                        })
                    elif aspect_name == "opposition" and abs(diff - 180) <= orb:
                        aspects.append({
                            "planet_a": name_a,
                            "planet_b": name_b,
                            "aspect": "opposition",
                            "orb": round(abs(diff - 180), 2),
                            "nature": self._get_aspect_nature(
                                name_a, name_b, "opposition"
                            )
                        })
                    elif aspect_name == "trine" and abs(diff - 120) <= orb:
                        aspects.append({
                            "planet_a": name_a,
                            "planet_b": name_b,
                            "aspect": "trine",
                            "orb": round(abs(diff - 120), 2),
                            "nature": "harmonious"
                        })
                    elif aspect_name == "square" and abs(diff - 90) <= orb:
                        aspects.append({
                            "planet_a": name_a,
                            "planet_b": name_b,
                            "aspect": "square",
                            "orb": round(abs(diff - 90), 2),
                            "nature": "challenging"
                        })
                    elif aspect_name == "sextile" and abs(diff - 60) <= orb:
                        aspects.append({
                            "planet_a": name_a,
                            "planet_b": name_b,
                            "aspect": "sextile",
                            "orb": round(abs(diff - 60), 2),
                            "nature": "harmonious"
                        })
        
        return aspects
    
    def _analyze_sun_moon(
        self,
        planets_a: Dict,
        planets_b: Dict,
        aspects: List[Dict]
    ) -> Dict[str, Any]:
        """Analyze Sun-Moon connections (emotional compatibility)"""
        sun_moon_aspects = [
            a for a in aspects
            if (a["planet_a"] in ["sun", "moon"] and 
                a["planet_b"] in ["sun", "moon"])
        ]
        
        # Calculate element compatibility
        if planets_a.get("moon") and planets_b.get("moon"):
            moon_a_sign = int(planets_a["moon"]["longitude"] / 30)
            moon_b_sign = int(planets_b["moon"]["longitude"] / 30)
            
            element_a = self._get_element(moon_a_sign)
            element_b = self._get_element(moon_b_sign)
            
            element_compat = self._check_element_compatibility(
                element_a, element_b
            )
        else:
            element_compat = "Unknown"
        
        return {
            "aspects": sun_moon_aspects,
            "element_compatibility": element_compat,
            "rating": len([a for a in sun_moon_aspects 
                          if a["nature"] == "harmonious"]) / max(len(sun_moon_aspects), 1)
        }
    
    def _analyze_venus_mars(
        self,
        planets_a: Dict,
        planets_b: Dict,
        aspects: List[Dict]
    ) -> Dict[str, Any]:
        """Analyze Venus-Mars connections (romantic chemistry)"""
        venus_mars_aspects = [
            a for a in aspects
            if (a["planet_a"] in ["venus", "mars"] and 
                a["planet_b"] in ["venus", "mars"])
        ]
        
        chemistry_rating = 0
        
        for aspect in venus_mars_aspects:
            if aspect["aspect"] == "conjunction":
                chemistry_rating += 5
            elif aspect["aspect"] == "trine":
                chemistry_rating += 4
            elif aspect["aspect"] == "opposition":
                chemistry_rating += 3  # Magnetic attraction
            elif aspect["aspect"] == "square":
                chemistry_rating += 2  # Passionate but challenging
        
        return {
            "aspects": venus_mars_aspects,
            "chemistry_rating": min(chemistry_rating, 10),
            "description": self._describe_venus_mars(venus_mars_aspects)
        }
    
    def _analyze_mercury(
        self,
        planets_a: Dict,
        planets_b: Dict,
        aspects: List[Dict]
    ) -> Dict[str, Any]:
        """Analyze Mercury connections (communication)"""
        mercury_aspects = [
            a for a in aspects
            if "mercury" in [a["planet_a"], a["planet_b"]]
        ]
        
        return {
            "aspects": mercury_aspects,
            "communication_ease": len([a for a in mercury_aspects 
                                      if a["nature"] == "harmonious"]) > 0
        }
    
    def _calculate_house_overlays(
        self,
        planets: Dict,
        houses: List[float],
        ascendant: float
    ) -> Dict[str, List[str]]:
        """Calculate which planets fall in which houses"""
        overlays = {}
        
        for planet_name, planet_data in planets.items():
            if not planet_data or planet_name in ["rahu", "ketu"]:
                continue
            
            longitude = planet_data["longitude"]
            house_num = self._get_house_number(longitude, ascendant)
            
            if house_num not in overlays:
                overlays[house_num] = []
            
            overlays[house_num].append(planet_name)
        
        return overlays
    
    def _calculate_compatibility_score(
        self,
        aspects: List[Dict],
        sun_moon: Dict,
        venus_mars: Dict
    ) -> int:
        """Calculate overall compatibility score (0-100)"""
        score = 50  # Base score
        
        # Add for harmonious aspects
        harmonious = len([a for a in aspects if a["nature"] == "harmonious"])
        score += harmonious * 3
        
        # Subtract for challenging aspects
        challenging = len([a for a in aspects if a["nature"] == "challenging"])
        score -= challenging * 2
        
        # Sun-Moon bonus
        score += sun_moon.get("rating", 0) * 10
        
        # Venus-Mars bonus
        score += venus_mars.get("chemistry_rating", 0) * 2
        
        return max(0, min(100, int(score)))
    
    def _identify_key_themes(self, aspects: List[Dict]) -> List[str]:
        """Identify key relationship themes from aspects"""
        themes = []
        
        # Count aspect types
        for aspect in aspects:
            planets = f"{aspect['planet_a']}-{aspect['planet_b']}"
            aspect_type = aspect['aspect']
            
            if "sun" in planets and "moon" in planets:
                themes.append("Strong emotional connection")
            
            if "venus" in planets and "mars" in planets:
                themes.append("Passionate attraction")
            
            if aspect_type == "conjunction":
                themes.append("Intense merging of energies")
            elif aspect_type == "square":
                themes.append("Growth through challenge")
        
        return list(set(themes))[:5]  # Top 5 unique themes
    
    def _calculate_midpoint(self, long_a: float, long_b: float) -> float:
        """Calculate midpoint between two longitudes"""
        diff = abs(long_a - long_b)
        
        if diff <= 180:
            return (long_a + long_b) / 2
        else:
            # Take the shorter arc
            midpoint = ((long_a + long_b) / 2 + 180) % 360
            return midpoint
    
    def _get_aspect_nature(
        self,
        planet_a: str,
        planet_b: str,
        aspect: str
    ) -> str:
        """Determine nature of aspect based on planets involved"""
        if aspect in ["trine", "sextile"]:
            return "harmonious"
        elif aspect == "square":
            return "challenging"
        elif aspect == "conjunction":
            # Depends on planet combination
            benefics = ["venus", "jupiter", "moon"]
            if planet_a in benefics and planet_b in benefics:
                return "harmonious"
            elif planet_a == "saturn" or planet_b == "saturn":
                return "karmic"
            else:
                return "intense"
        elif aspect == "opposition":
            return "polarizing"
        
        return "neutral"
    
    def _get_element(self, sign: int) -> str:
        """Get element for zodiac sign"""
        elements = [
            "fire", "earth", "air", "water",
            "fire", "earth", "air", "water",
            "fire", "earth", "air", "water"
        ]
        return elements[sign % 12]
    
    def _check_element_compatibility(self, elem_a: str, elem_b: str) -> str:
        """Check element compatibility"""
        if elem_a == elem_b:
            return "Very Compatible (same element)"
        
        compat = {
            ("fire", "air"): "Compatible",
            ("air", "fire"): "Compatible",
            ("earth", "water"): "Compatible",
            ("water", "earth"): "Compatible",
            ("fire", "water"): "Challenging",
            ("water", "fire"): "Challenging",
            ("earth", "air"): "Challenging",
            ("air", "earth"): "Challenging"
        }
        
        return compat.get((elem_a, elem_b), "Neutral")
    
    def _describe_venus_mars(self, aspects: List[Dict]) -> str:
        """Describe Venus-Mars chemistry"""
        if not aspects:
            return "Moderate chemistry"
        
        aspect_types = [a["aspect"] for a in aspects]
        
        if "conjunction" in aspect_types:
            return "Intense magnetic attraction"
        elif "trine" in aspect_types:
            return "Natural, easy romantic flow"
        elif "opposition" in aspect_types:
            return "Strong attraction with polarity"
        elif "square" in aspect_types:
            return "Passionate but requires work"
        
        return "Moderate chemistry"
    
    def _get_sign_name(self, sign_num: int) -> str:
        """Get zodiac sign name"""
        signs = [
            "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Libra", "Scorpio", "Sagittarius", "Capricorn",
            "Aquarius", "Pisces"
        ]
        return signs[sign_num % 12]
    
    def _get_house_number(self, longitude: float, ascendant: float) -> int:
        """Get house number from longitude"""
        diff = (longitude - ascendant) % 360
        return int(diff / 30) + 1


# Global instance
western_synastry = WesternSynastry()
