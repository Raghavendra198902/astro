"""
Yoga Detection Engine
Detects and evaluates Vedic yogas (planetary combinations)
"""

from typing import Dict, List, Any
import yaml
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class YogaEngine:
    """Engine for detecting Vedic yogas from chart data"""
    
    def __init__(self, rules_path: str = None):
        """Initialize with YAML rules"""
        if rules_path is None:
            rules_path = Path(__file__).parent / "yoga_rules.yaml"
        
        self.rules = self._load_rules(rules_path)
    
    def _load_rules(self, path: Path) -> Dict[str, Any]:
        """Load yoga rules from YAML file"""
        try:
            if Path(path).exists():
                with open(path, 'r') as f:
                    return yaml.safe_load(f) or {}
            else:
                logger.warning(f"Yoga rules file not found: {path}")
                return self._get_default_rules()
        except Exception as e:
            logger.error(f"Error loading yoga rules: {e}")
            return self._get_default_rules()
    
    def _get_default_rules(self) -> Dict[str, Any]:
        """Return default yoga rules"""
        return {
            "yogas": [
                {
                    "name": "Gajakesari Yoga",
                    "description": "Jupiter in kendra from Moon",
                    "category": "wealth",
                    "strength": "high",
                    "conditions": {
                        "type": "kendra_relationship",
                        "planet1": "jupiter",
                        "planet2": "moon"
                    }
                },
                {
                    "name": "Raj Yoga (1-9)",
                    "description": "Lords of 1st and 9th house conjunct",
                    "category": "power",
                    "strength": "very_high",
                    "conditions": {
                        "type": "house_lord_conjunction",
                        "houses": [1, 9]
                    }
                },
                {
                    "name": "Raj Yoga (4-5)",
                    "description": "Lords of 4th and 5th house conjunct",
                    "category": "power",
                    "strength": "high",
                    "conditions": {
                        "type": "house_lord_conjunction",
                        "houses": [4, 5]
                    }
                },
                {
                    "name": "Pancha Mahapurusha - Hamsa",
                    "description": "Jupiter in kendra in own/exaltation",
                    "category": "fortune",
                    "strength": "very_high",
                    "conditions": {
                        "type": "mahapurusha",
                        "planet": "jupiter"
                    }
                },
                {
                    "name": "Pancha Mahapurusha - Malavya",
                    "description": "Venus in kendra in own/exaltation",
                    "category": "fortune",
                    "strength": "very_high",
                    "conditions": {
                        "type": "mahapurusha",
                        "planet": "venus"
                    }
                },
                {
                    "name": "Neecha Bhanga Raj Yoga",
                    "description": "Debilitated planet's dispositor in kendra",
                    "category": "redemption",
                    "strength": "high",
                    "conditions": {
                        "type": "neecha_bhanga"
                    }
                },
                {
                    "name": "Budhaditya Yoga",
                    "description": "Sun and Mercury conjunct",
                    "category": "intelligence",
                    "strength": "medium",
                    "conditions": {
                        "type": "conjunction",
                        "planets": ["sun", "mercury"],
                        "orb": 10
                    }
                },
                {
                    "name": "Chandra Mangala Yoga",
                    "description": "Moon and Mars conjunct",
                    "category": "wealth",
                    "strength": "medium",
                    "conditions": {
                        "type": "conjunction",
                        "planets": ["moon", "mars"],
                        "orb": 8
                    }
                }
            ]
        }
    
    def detect_yogas(
        self,
        positions: Dict[str, Dict],
        houses: List[float],
        ascendant: float
    ) -> List[Dict[str, Any]]:
        """
        Detect all yogas present in the chart
        
        Args:
            positions: Planet positions with longitudes
            houses: House cusps
            ascendant: Ascendant degree
            
        Returns:
            List of detected yogas with details
        """
        detected_yogas = []
        
        for yoga_rule in self.rules.get("yogas", []):
            if self._check_yoga(yoga_rule, positions, houses, ascendant):
                detected_yogas.append({
                    "name": yoga_rule["name"],
                    "description": yoga_rule["description"],
                    "category": yoga_rule["category"],
                    "strength": yoga_rule["strength"],
                    "present": True
                })
        
        return detected_yogas
    
    def _check_yoga(
        self,
        rule: Dict[str, Any],
        positions: Dict[str, Dict],
        houses: List[float],
        ascendant: float
    ) -> bool:
        """Check if a specific yoga condition is met"""
        conditions = rule.get("conditions", {})
        cond_type = conditions.get("type")
        
        if cond_type == "kendra_relationship":
            return self._check_kendra_relationship(
                conditions, positions, ascendant
            )
        elif cond_type == "conjunction":
            return self._check_conjunction(conditions, positions)
        elif cond_type == "house_lord_conjunction":
            return self._check_house_lord_conjunction(
                conditions, positions, houses, ascendant
            )
        elif cond_type == "mahapurusha":
            return self._check_mahapurusha(
                conditions, positions, houses, ascendant
            )
        elif cond_type == "neecha_bhanga":
            return self._check_neecha_bhanga(positions, houses, ascendant)
        
        return False
    
    def _check_kendra_relationship(
        self,
        conditions: Dict,
        positions: Dict[str, Dict],
        ascendant: float
    ) -> bool:
        """Check if two planets are in kendra (1,4,7,10) relationship"""
        planet1_name = conditions.get("planet1")
        planet2_name = conditions.get("planet2")
        
        if not positions.get(planet1_name) or not positions.get(planet2_name):
            return False
        
        p1_long = positions[planet1_name]["longitude"]
        p2_long = positions[planet2_name]["longitude"]
        
        # Calculate house positions from ascendant
        p1_house = self._get_house_from_ascendant(p1_long, ascendant)
        p2_house = self._get_house_from_ascendant(p2_long, ascendant)
        
        # Check if in kendra relationship (1, 4, 7, 10 apart)
        house_diff = abs(p1_house - p2_house)
        return house_diff in [0, 3, 6, 9]
    
    def _check_conjunction(
        self,
        conditions: Dict,
        positions: Dict[str, Dict]
    ) -> bool:
        """Check if planets are conjunct within orb"""
        planet_names = conditions.get("planets", [])
        orb = conditions.get("orb", 10)
        
        if len(planet_names) < 2:
            return False
        
        longitudes = []
        for name in planet_names:
            if positions.get(name):
                longitudes.append(positions[name]["longitude"])
            else:
                return False
        
        # Check if all within orb of each other
        for i in range(len(longitudes) - 1):
            diff = abs(longitudes[i] - longitudes[i + 1])
            if diff > 180:
                diff = 360 - diff
            if diff > orb:
                return False
        
        return True
    
    def _check_house_lord_conjunction(
        self,
        conditions: Dict,
        positions: Dict[str, Dict],
        houses: List[float],
        ascendant: float
    ) -> bool:
        """
        Check if lords of specified houses are conjunct
        Simplified: uses planet rulerships
        """
        house_numbers = conditions.get("houses", [])
        
        # Simplified lord determination (full system needs dispositor logic)
        # For now, check if benefics are in these houses
        lords = []
        for house_num in house_numbers:
            house_cusp = houses[(house_num - 1) % 12]
            sign = int(house_cusp / 30)
            lord = self._get_sign_lord(sign)
            if lord:
                lords.append(lord)
        
        if len(lords) < 2:
            return False
        
        # Check if lords are conjunct
        return self._check_conjunction(
            {"planets": lords, "orb": 10},
            positions
        )
    
    def _check_mahapurusha(
        self,
        conditions: Dict,
        positions: Dict[str, Dict],
        houses: List[float],
        ascendant: float
    ) -> bool:
        """Check for Pancha Mahapurusha yoga"""
        planet_name = conditions.get("planet")
        
        if not positions.get(planet_name):
            return False
        
        longitude = positions[planet_name]["longitude"]
        sign = int(longitude / 30)
        
        # Check if in kendra house (1, 4, 7, 10)
        house = self._get_house_from_ascendant(longitude, ascendant)
        if house not in [1, 4, 7, 10]:
            return False
        
        # Check if in own sign or exaltation
        own_signs = self._get_own_signs(planet_name)
        exaltation_sign = self._get_exaltation_sign(planet_name)
        
        return sign in own_signs or sign == exaltation_sign
    
    def _check_neecha_bhanga(
        self,
        positions: Dict[str, Dict],
        houses: List[float],
        ascendant: float
    ) -> bool:
        """Check for cancellation of debilitation"""
        # Find debilitated planets
        for planet_name, planet_data in positions.items():
            if not planet_data or planet_name in ["rahu", "ketu"]:
                continue
            
            longitude = planet_data["longitude"]
            sign = int(longitude / 30)
            debil_sign = self._get_debilitation_sign(planet_name)
            
            if sign == debil_sign:
                # Check if dispositor is in kendra
                dispositor = self._get_sign_lord(sign)
                if dispositor and positions.get(dispositor):
                    disp_long = positions[dispositor]["longitude"]
                    disp_house = self._get_house_from_ascendant(
                        disp_long, ascendant
                    )
                    if disp_house in [1, 4, 7, 10]:
                        return True
        
        return False
    
    def _get_house_from_ascendant(
        self,
        longitude: float,
        ascendant: float
    ) -> int:
        """Get house number from longitude and ascendant"""
        diff = (longitude - ascendant) % 360
        return int(diff / 30) + 1
    
    def _get_sign_lord(self, sign: int) -> str:
        """Get ruling planet of a sign"""
        lords = [
            "mars", "venus", "mercury", "moon", "sun", "mercury",
            "venus", "mars", "jupiter", "saturn", "saturn", "jupiter"
        ]
        return lords[sign % 12]
    
    def _get_own_signs(self, planet: str) -> List[int]:
        """Get signs owned by planet"""
        ownership = {
            "sun": [4],  # Leo
            "moon": [3],  # Cancer
            "mars": [0, 7],  # Aries, Scorpio
            "mercury": [2, 5],  # Gemini, Virgo
            "jupiter": [8, 11],  # Sagittarius, Pisces
            "venus": [1, 6],  # Taurus, Libra
            "saturn": [9, 10]  # Capricorn, Aquarius
        }
        return ownership.get(planet, [])
    
    def _get_exaltation_sign(self, planet: str) -> int:
        """Get exaltation sign for planet"""
        exaltations = {
            "sun": 0,  # Aries
            "moon": 1,  # Taurus
            "mars": 9,  # Capricorn
            "mercury": 5,  # Virgo
            "jupiter": 3,  # Cancer
            "venus": 11,  # Pisces
            "saturn": 6  # Libra
        }
        return exaltations.get(planet, -1)
    
    def _get_debilitation_sign(self, planet: str) -> int:
        """Get debilitation sign for planet (opposite of exaltation)"""
        exalt = self._get_exaltation_sign(planet)
        return (exalt + 6) % 12 if exalt >= 0 else -1


# Global yoga engine instance
yoga_engine = YogaEngine()
