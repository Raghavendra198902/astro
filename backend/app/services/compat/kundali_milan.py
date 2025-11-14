"""
Kundali Milan - Vedic Compatibility Analysis
Implements 36 Guna (Ashta Koota) system
"""

from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)


class KundaliMilan:
    """Vedic compatibility analysis using 36 Guna system"""
    
    def calculate_guna_milan(
        self,
        chart_a: Dict[str, Any],
        chart_b: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculate 36 Guna Milan (Ashta Koota) score
        
        Args:
            chart_a: First person's chart data
            chart_b: Second person's chart data
            
        Returns:
            Detailed Guna Milan results with score and breakdown
        """
        planets_a = chart_a.get("planets", {})
        planets_b = chart_b.get("planets", {})
        
        if not planets_a.get("moon") or not planets_b.get("moon"):
            logger.error("Moon position required for Guna Milan")
            return {"error": "Moon position required"}
        
        moon_a = planets_a["moon"]["longitude"]
        moon_b = planets_b["moon"]["longitude"]
        
        # Get nakshatras
        nak_a = self._get_nakshatra(moon_a)
        nak_b = self._get_nakshatra(moon_b)
        
        # Get rashi (moon signs)
        rashi_a = int(moon_a / 30)
        rashi_b = int(moon_b / 30)
        
        # Calculate each Koota
        results = {}
        
        # 1. Varna (Caste/Class) - 1 point
        results["varna"] = self._calculate_varna(nak_a, nak_b)
        
        # 2. Vashya (Dominance) - 2 points
        results["vashya"] = self._calculate_vashya(rashi_a, rashi_b)
        
        # 3. Tara (Nakshatra constellation) - 3 points
        results["tara"] = self._calculate_tara(nak_a, nak_b)
        
        # 4. Yoni (Sexual compatibility) - 4 points
        results["yoni"] = self._calculate_yoni(nak_a, nak_b)
        
        # 5. Graha Maitri (Planetary friendship) - 5 points
        results["graha_maitri"] = self._calculate_graha_maitri(rashi_a, rashi_b)
        
        # 6. Gana (Temperament) - 6 points
        results["gana"] = self._calculate_gana(nak_a, nak_b)
        
        # 7. Bhakoot (Rashi position) - 7 points
        results["bhakoot"] = self._calculate_bhakoot(rashi_a, rashi_b)
        
        # 8. Nadi (Health/Progeny) - 8 points
        results["nadi"] = self._calculate_nadi(nak_a, nak_b)
        
        # Total score
        total_score = sum(r["score"] for r in results.values())
        max_score = 36
        
        # Interpretation
        compatibility_level = self._interpret_score(total_score)
        
        return {
            "total_score": total_score,
            "max_score": max_score,
            "percentage": round((total_score / max_score) * 100, 1),
            "compatibility_level": compatibility_level,
            "kootas": results,
            "moon_nakshatra_a": nak_a,
            "moon_nakshatra_b": nak_b
        }
    
    def check_mangal_dosha(
        self,
        chart: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Check for Mangal Dosha (Mars affliction in marriage houses)
        
        Args:
            chart: Chart data
            
        Returns:
            Mangal Dosha analysis with severity and cancellations
        """
        planets = chart.get("planets", {})
        houses = chart.get("houses", [])
        ascendant = chart.get("ascendant", 0)
        
        if not planets.get("mars"):
            return {"present": False, "reason": "Mars position not available"}
        
        mars_long = planets["mars"]["longitude"]
        
        # Find Mars house from ascendant
        mars_house = self._get_house_from_ascendant(mars_long, ascendant)
        
        # Dosha houses: 1, 4, 7, 8, 12 from Lagna
        dosha_houses = [1, 4, 7, 8, 12]
        
        if mars_house not in dosha_houses:
            return {
                "present": False,
                "mars_house": mars_house,
                "reason": f"Mars in {mars_house}th house (not a dosha house)"
            }
        
        # Dosha is present, check for cancellations
        cancellations = []
        
        # 1. Mars in own sign or exaltation
        mars_sign = int(mars_long / 30)
        if mars_sign in [0, 7, 9]:  # Aries, Scorpio, Capricorn
            cancellations.append("Mars in own sign or exaltation")
        
        # 2. Benefic aspects on Mars
        jupiter = planets.get("jupiter")
        venus = planets.get("venus")
        
        if jupiter:
            aspect = self._calculate_aspect_angle(
                mars_long, jupiter["longitude"]
            )
            if aspect in ["trine", "sextile"]:
                cancellations.append("Benefic Jupiter aspect on Mars")
        
        if venus:
            aspect = self._calculate_aspect_angle(
                mars_long, venus["longitude"]
            )
            if aspect in ["trine", "conjunction"]:
                cancellations.append("Benefic Venus aspect/conjunction")
        
        # 3. Mars retrograde (reduces malefic effect)
        if planets["mars"].get("retrograde"):
            cancellations.append("Mars retrograde (reduced effect)")
        
        # Determine severity
        if cancellations:
            severity = "Low" if len(cancellations) >= 2 else "Moderate"
        else:
            severity = "High" if mars_house in [7, 8] else "Moderate"
        
        return {
            "present": True,
            "mars_house": mars_house,
            "severity": severity,
            "cancellations": cancellations,
            "advice": self._get_dosha_remedy(mars_house, severity)
        }
    
    def _calculate_varna(self, nak_a: int, nak_b: int) -> Dict[str, Any]:
        """Calculate Varna Koota (1 point)"""
        varna_map = {
            # Brahmin (highest)
            1: 0, 8: 0, 15: 0, 22: 0,
            # Kshatriya
            2: 1, 9: 1, 16: 1, 23: 1,
            # Vaishya
            3: 2, 10: 2, 17: 2, 24: 2,
            # Shudra
            4: 3, 11: 3, 18: 3, 25: 3,
        }
        
        # Default remaining to appropriate varnas
        for i in range(1, 28):
            if i not in varna_map:
                varna_map[i] = i % 4
        
        varna_a = varna_map.get(nak_a, 0)
        varna_b = varna_map.get(nak_b, 0)
        
        # Groom's varna should be equal or higher
        score = 1 if varna_a >= varna_b else 0
        
        return {
            "score": score,
            "max": 1,
            "description": "Spiritual compatibility and social harmony"
        }
    
    def _calculate_vashya(self, rashi_a: int, rashi_b: int) -> Dict[str, Any]:
        """Calculate Vashya Koota (2 points)"""
        # Vashya groups: mutual attraction groups
        vashya_groups = [
            [0, 4],  # Aries, Leo
            [1, 3, 6],  # Taurus, Cancer, Libra
            [2, 5],  # Gemini, Virgo
            [7, 10, 11],  # Scorpio, Aquarius, Pisces
            [8, 9]  # Sagittarius, Capricorn
        ]
        
        same_group = False
        for group in vashya_groups:
            if rashi_a in group and rashi_b in group:
                same_group = True
                break
        
        score = 2 if same_group else 0
        
        return {
            "score": score,
            "max": 2,
            "description": "Mutual attraction and control"
        }
    
    def _calculate_tara(self, nak_a: int, nak_b: int) -> Dict[str, Any]:
        """Calculate Tara Koota (3 points)"""
        # Count from girl's nakshatra to boy's
        diff = (nak_b - nak_a) % 27
        tara = (diff % 9) + 1
        
        # Favorable taras: 1, 3, 5, 7 (odd)
        score = 3 if tara % 2 == 1 else 1.5
        
        return {
            "score": score,
            "max": 3,
            "description": "Birth star compatibility for health and well-being"
        }
    
    def _calculate_yoni(self, nak_a: int, nak_b: int) -> Dict[str, Any]:
        """Calculate Yoni Koota (4 points)"""
        # Animal symbols for each nakshatra
        yoni_animals = [
            "Horse", "Elephant", "Sheep", "Serpent", "Dog",
            "Cat", "Rat", "Cow", "Buffalo", "Tiger",
            "Deer", "Monkey", "Mongoose", "Horse", "Elephant",
            "Sheep", "Serpent", "Dog", "Cat", "Rat",
            "Cow", "Buffalo", "Tiger", "Deer", "Monkey",
            "Mongoose", "Horse"
        ]
        
        animal_a = yoni_animals[nak_a - 1]
        animal_b = yoni_animals[nak_b - 1]
        
        # Natural enemies get 0, friends get 4
        if animal_a == animal_b:
            score = 4
        elif self._are_yoni_friends(animal_a, animal_b):
            score = 3
        elif self._are_yoni_enemies(animal_a, animal_b):
            score = 0
        else:
            score = 2
        
        return {
            "score": score,
            "max": 4,
            "description": "Sexual compatibility and physical intimacy"
        }
    
    def _calculate_graha_maitri(
        self,
        rashi_a: int,
        rashi_b: int
    ) -> Dict[str, Any]:
        """Calculate Graha Maitri Koota (5 points)"""
        # Get lords of moon signs
        lord_a = self._get_rashi_lord(rashi_a)
        lord_b = self._get_rashi_lord(rashi_b)
        
        # Check planetary friendship
        if self._are_planets_friends(lord_a, lord_b):
            score = 5
        elif self._are_planets_neutral(lord_a, lord_b):
            score = 3
        else:
            score = 0
        
        return {
            "score": score,
            "max": 5,
            "description": "Mental compatibility and friendship"
        }
    
    def _calculate_gana(self, nak_a: int, nak_b: int) -> Dict[str, Any]:
        """Calculate Gana Koota (6 points)"""
        # Deva (divine), Manushya (human), Rakshasa (demonic)
        gana_map = {
            # Deva
            1: 0, 5: 0, 7: 0, 8: 0, 13: 0, 15: 0, 17: 0, 22: 0, 27: 0,
            # Manushya
            2: 1, 4: 1, 6: 1, 11: 1, 12: 1, 20: 1, 21: 1, 25: 1, 26: 1,
            # Rakshasa
            3: 2, 9: 2, 10: 2, 14: 2, 16: 2, 18: 2, 19: 2, 23: 2, 24: 2
        }
        
        gana_a = gana_map.get(nak_a, 1)
        gana_b = gana_map.get(nak_b, 1)
        
        if gana_a == gana_b:
            score = 6  # Same gana = perfect
        elif (gana_a == 0 and gana_b == 1) or (gana_a == 1 and gana_b == 0):
            score = 6  # Deva-Manushya compatible
        elif (gana_a == 1 and gana_b == 2) or (gana_a == 2 and gana_b == 1):
            score = 0  # Manushya-Rakshasa incompatible
        else:
            score = 0  # Deva-Rakshasa incompatible
        
        return {
            "score": score,
            "max": 6,
            "description": "Temperament and behavioral compatibility"
        }
    
    def _calculate_bhakoot(self, rashi_a: int, rashi_b: int) -> Dict[str, Any]:
        """Calculate Bhakoot Koota (7 points)"""
        diff = abs(rashi_a - rashi_b)
        
        # Inauspicious positions: 2-12, 5-9, 6-8
        if diff in [1, 11] or diff in [4, 8] or diff in [5, 7]:
            score = 0
        else:
            score = 7
        
        return {
            "score": score,
            "max": 7,
            "description": "Emotional and financial well-being"
        }
    
    def _calculate_nadi(self, nak_a: int, nak_b: int) -> Dict[str, Any]:
        """Calculate Nadi Koota (8 points) - Most important"""
        # Adi (Vata), Madhya (Pitta), Antya (Kapha)
        nadi_map = {}
        for i in range(1, 28):
            nadi_map[i] = i % 3
        
        nadi_a = nadi_map[nak_a]
        nadi_b = nadi_map[nak_b]
        
        # Same Nadi = 0 points (major incompatibility)
        # Different Nadi = 8 points
        score = 0 if nadi_a == nadi_b else 8
        
        return {
            "score": score,
            "max": 8,
            "description": "Health, progeny, and genetic compatibility"
        }
    
    def _interpret_score(self, score: int) -> str:
        """Interpret total Guna Milan score"""
        if score >= 31:
            return "Excellent"
        elif score >= 24:
            return "Very Good"
        elif score >= 18:
            return "Good"
        elif score >= 13:
            return "Average"
        else:
            return "Not Recommended"
    
    def _get_nakshatra(self, longitude: float) -> int:
        """Get nakshatra number from longitude"""
        return int(longitude / (360 / 27)) + 1
    
    def _get_house_from_ascendant(
        self,
        longitude: float,
        ascendant: float
    ) -> int:
        """Get house number from longitude and ascendant"""
        diff = (longitude - ascendant) % 360
        return int(diff / 30) + 1
    
    def _get_rashi_lord(self, rashi: int) -> str:
        """Get ruling planet of rashi"""
        lords = [
            "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
            "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
        ]
        return lords[rashi % 12]
    
    def _are_planets_friends(self, planet_a: str, planet_b: str) -> bool:
        """Check if two planets are natural friends"""
        friendships = {
            "Sun": ["Moon", "Mars", "Jupiter"],
            "Moon": ["Sun", "Mercury"],
            "Mars": ["Sun", "Moon", "Jupiter"],
            "Mercury": ["Sun", "Venus"],
            "Jupiter": ["Sun", "Moon", "Mars"],
            "Venus": ["Mercury", "Saturn"],
            "Saturn": ["Mercury", "Venus"]
        }
        return planet_b in friendships.get(planet_a, [])
    
    def _are_planets_neutral(self, planet_a: str, planet_b: str) -> bool:
        """Check if planets are neutral"""
        enemies = ["Saturn", "Venus"] if planet_a == "Sun" else []
        friends_list = ["Moon", "Mars", "Jupiter"] if planet_a == "Sun" else []
        
        return planet_b not in enemies and planet_b not in friends_list
    
    def _are_yoni_friends(self, animal_a: str, animal_b: str) -> bool:
        """Check if yoni animals are compatible"""
        friends = {
            "Horse": ["Horse"],
            "Elephant": ["Sheep"],
            "Sheep": ["Elephant"],
            "Cow": ["Buffalo"],
            "Buffalo": ["Cow"]
        }
        return animal_b in friends.get(animal_a, [])
    
    def _are_yoni_enemies(self, animal_a: str, animal_b: str) -> bool:
        """Check if yoni animals are enemies"""
        enemies = {
            "Cat": ["Rat"],
            "Rat": ["Cat"],
            "Dog": ["Deer"],
            "Deer": ["Dog"],
            "Serpent": ["Mongoose"],
            "Mongoose": ["Serpent"]
        }
        return animal_b in enemies.get(animal_a, [])
    
    def _calculate_aspect_angle(
        self,
        long_a: float,
        long_b: float
    ) -> str:
        """Calculate aspect type between two longitudes"""
        diff = abs(long_a - long_b)
        if diff > 180:
            diff = 360 - diff
        
        if diff <= 10:
            return "conjunction"
        elif 55 <= diff <= 65:
            return "sextile"
        elif 85 <= diff <= 95:
            return "square"
        elif 115 <= diff <= 125:
            return "trine"
        elif 175 <= diff <= 185:
            return "opposition"
        return "none"
    
    def _get_dosha_remedy(self, house: int, severity: str) -> str:
        """Get remedy advice for Mangal Dosha"""
        remedies = {
            1: "Perform Mars pacification rituals. Chant Hanuman Chalisa.",
            4: "Donate red items on Tuesdays. Strengthen Moon.",
            7: "Both partners having Mangal Dosha can cancel effects.",
            8: "Strong remedies needed. Consult qualified astrologer.",
            12: "Perform Kuja Shanti puja. Wear red coral after consultation."
        }
        
        base_remedy = remedies.get(house, "Consult astrologer for specific remedies.")
        
        if severity == "Low":
            return f"{base_remedy} (Mild case - minimal concern)"
        else:
            return base_remedy


# Global instance
kundali_milan = KundaliMilan()
