"""
Numerology Engine
Supports Pythagorean and Chaldean systems
"""

from typing import Dict, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class NumerologyEngine:
    """Numerology calculations and interpretations"""
    
    def __init__(self):
        # Pythagorean system (1-9)
        self.pythagorean = {
            'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
            'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
            's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
        }
        
        # Chaldean system (1-8, no 9)
        self.chaldean = {
            'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 8, 'g': 3, 'h': 5, 'i': 1,
            'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 7, 'p': 8, 'q': 1, 'r': 2,
            's': 3, 't': 4, 'u': 6, 'v': 6, 'w': 6, 'x': 5, 'y': 1, 'z': 7
        }
    
    def calculate_full_analysis(
        self,
        full_name: str,
        birth_date: datetime,
        system: str = "pythagorean"
    ) -> Dict[str, Any]:
        """
        Calculate complete numerology analysis
        
        Args:
            full_name: Person's full name
            birth_date: Date of birth
            system: 'pythagorean' or 'chaldean'
            
        Returns:
            Complete numerology profile
        """
        letter_map = self.pythagorean if system == "pythagorean" else self.chaldean
        
        # Life Path Number (from birth date)
        life_path = self._calculate_life_path(birth_date)
        
        # Expression Number (from full name)
        expression = self._calculate_name_number(full_name, letter_map)
        
        # Soul Urge Number (from vowels)
        soul_urge = self._calculate_soul_urge(full_name, letter_map)
        
        # Personality Number (from consonants)
        personality = self._calculate_personality(full_name, letter_map)
        
        # Destiny Number (same as expression in most systems)
        destiny = expression
        
        # Maturity Number (Life Path + Expression)
        maturity = self._reduce_to_single(life_path["number"] + expression["number"])
        
        # Current Year Personal Year Number
        personal_year = self._calculate_personal_year(birth_date, datetime.now())
        
        return {
            "system": system,
            "life_path": {
                "number": life_path["number"],
                "meaning": self._get_life_path_meaning(life_path["number"]),
                "calculation": life_path["steps"]
            },
            "expression": {
                "number": expression["number"],
                "meaning": self._get_expression_meaning(expression["number"]),
                "calculation": expression["steps"]
            },
            "soul_urge": {
                "number": soul_urge["number"],
                "meaning": self._get_soul_urge_meaning(soul_urge["number"]),
                "calculation": soul_urge["steps"]
            },
            "personality": {
                "number": personality["number"],
                "meaning": self._get_personality_meaning(personality["number"]),
                "calculation": personality["steps"]
            },
            "maturity": {
                "number": maturity,
                "meaning": self._get_maturity_meaning(maturity)
            },
            "personal_year": {
                "number": personal_year,
                "meaning": self._get_personal_year_meaning(personal_year)
            }
        }
    
    def _calculate_life_path(self, birth_date: datetime) -> Dict[str, Any]:
        """Calculate Life Path Number from birth date"""
        day = birth_date.day
        month = birth_date.month
        year = birth_date.year
        
        # Reduce each component
        day_reduced = self._reduce_to_single(day)
        month_reduced = self._reduce_to_single(month)
        year_reduced = self._reduce_to_single(year)
        
        # Sum and reduce
        total = day_reduced + month_reduced + year_reduced
        final = self._reduce_to_single(total)
        
        return {
            "number": final,
            "steps": f"{day} → {day_reduced}, {month} → {month_reduced}, {year} → {year_reduced} = {final}"
        }
    
    def _calculate_name_number(
        self,
        name: str,
        letter_map: Dict[str, int]
    ) -> Dict[str, Any]:
        """Calculate number from full name"""
        name = name.lower().replace(" ", "")
        
        total = 0
        values = []
        
        for char in name:
            if char in letter_map:
                value = letter_map[char]
                values.append(f"{char}={value}")
                total += value
        
        final = self._reduce_to_single(total)
        
        return {
            "number": final,
            "steps": " + ".join(values) + f" = {total} → {final}"
        }
    
    def _calculate_soul_urge(
        self,
        name: str,
        letter_map: Dict[str, int]
    ) -> Dict[str, Any]:
        """Calculate Soul Urge from vowels"""
        name = name.lower().replace(" ", "")
        vowels = "aeiou"
        
        total = 0
        values = []
        
        for char in name:
            if char in vowels and char in letter_map:
                value = letter_map[char]
                values.append(f"{char}={value}")
                total += value
        
        final = self._reduce_to_single(total)
        
        return {
            "number": final,
            "steps": " + ".join(values) + f" = {total} → {final}"
        }
    
    def _calculate_personality(
        self,
        name: str,
        letter_map: Dict[str, int]
    ) -> Dict[str, Any]:
        """Calculate Personality from consonants"""
        name = name.lower().replace(" ", "")
        vowels = "aeiou"
        
        total = 0
        values = []
        
        for char in name:
            if char not in vowels and char in letter_map:
                value = letter_map[char]
                values.append(f"{char}={value}")
                total += value
        
        final = self._reduce_to_single(total)
        
        return {
            "number": final,
            "steps": " + ".join(values) + f" = {total} → {final}"
        }
    
    def _calculate_personal_year(
        self,
        birth_date: datetime,
        current_date: datetime
    ) -> int:
        """Calculate Personal Year Number"""
        day = birth_date.day
        month = birth_date.month
        year = current_date.year
        
        total = self._reduce_to_single(day) + self._reduce_to_single(month) + self._reduce_to_single(year)
        return self._reduce_to_single(total)
    
    def _reduce_to_single(self, number: int) -> int:
        """Reduce number to single digit (keep master numbers 11, 22, 33)"""
        if number in [11, 22, 33]:
            return number
        
        while number > 9:
            number = sum(int(d) for d in str(number))
            if number in [11, 22, 33]:
                break
        
        return number
    
    def _get_life_path_meaning(self, number: int) -> str:
        """Get Life Path Number meaning"""
        meanings = {
            1: "The Leader - Independent, innovative, ambitious",
            2: "The Peacemaker - Diplomatic, intuitive, cooperative",
            3: "The Creative - Expressive, optimistic, social",
            4: "The Builder - Practical, disciplined, hardworking",
            5: "The Freedom Seeker - Adventurous, versatile, dynamic",
            6: "The Nurturer - Responsible, caring, harmonious",
            7: "The Seeker - Analytical, spiritual, introspective",
            8: "The Powerhouse - Ambitious, organized, successful",
            9: "The Humanitarian - Compassionate, idealistic, generous",
            11: "The Master Intuitive - Spiritual, inspirational, visionary",
            22: "The Master Builder - Practical visionary, manifests big dreams",
            33: "The Master Teacher - Spiritual teacher, healer, uplifts humanity"
        }
        return meanings.get(number, "Unknown")
    
    def _get_expression_meaning(self, number: int) -> str:
        """Get Expression Number meaning"""
        meanings = {
            1: "Natural leader with unique talents and abilities",
            2: "Skilled mediator and relationship builder",
            3: "Creative communicator and entertainer",
            4: "Reliable builder and organizer",
            5: "Dynamic change agent and explorer",
            6: "Caring provider and harmony creator",
            7: "Wise analyst and truth seeker",
            8: "Powerful achiever and manifestor",
            9: "Compassionate humanitarian and teacher",
            11: "Inspirational leader with spiritual gifts",
            22: "Master architect who builds lasting legacies",
            33: "Master healer and spiritual guide"
        }
        return meanings.get(number, "Unknown")
    
    def _get_soul_urge_meaning(self, number: int) -> str:
        """Get Soul Urge Number meaning"""
        meanings = {
            1: "Desires independence and personal achievement",
            2: "Craves peace, partnership, and harmony",
            3: "Seeks creative expression and joy",
            4: "Yearns for stability and security",
            5: "Desires freedom and adventure",
            6: "Seeks to nurture and create beauty",
            7: "Craves wisdom and spiritual understanding",
            8: "Desires material success and recognition",
            9: "Seeks to serve and make a difference",
            11: "Yearns for spiritual enlightenment",
            22: "Desires to manifest grand visions",
            33: "Seeks to heal and uplift others"
        }
        return meanings.get(number, "Unknown")
    
    def _get_personality_meaning(self, number: int) -> str:
        """Get Personality Number meaning"""
        meanings = {
            1: "Appears confident, independent, pioneering",
            2: "Appears gentle, diplomatic, friendly",
            3: "Appears charming, sociable, entertaining",
            4: "Appears stable, reliable, practical",
            5: "Appears dynamic, exciting, unpredictable",
            6: "Appears warm, responsible, caring",
            7: "Appears mysterious, reserved, intellectual",
            8: "Appears powerful, successful, ambitious",
            9: "Appears compassionate, wise, idealistic",
            11: "Appears charismatic, inspirational, spiritual",
            22: "Appears capable, visionary, influential",
            33: "Appears enlightened, nurturing, masterful"
        }
        return meanings.get(number, "Unknown")
    
    def _get_maturity_meaning(self, number: int) -> str:
        """Get Maturity Number meaning"""
        return f"Qualities that emerge in later life (Number {number})"
    
    def _get_personal_year_meaning(self, number: int) -> str:
        """Get Personal Year meaning"""
        meanings = {
            1: "New beginnings, fresh starts, initiate",
            2: "Cooperation, relationships, patience",
            3: "Creativity, self-expression, social",
            4: "Hard work, foundation building, practical",
            5: "Change, freedom, adventure",
            6: "Responsibility, family, home",
            7: "Introspection, spiritual growth, analysis",
            8: "Power, achievement, financial success",
            9: "Completion, endings, letting go"
        }
        return meanings.get(number, "Unknown")


# Global instance
numerology_engine = NumerologyEngine()
