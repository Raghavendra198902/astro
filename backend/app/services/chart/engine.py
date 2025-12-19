"""
Chart Engine - Core Astrological Computation Module
Swiss Ephemeris integration for planetary calculations
"""

import swisseph as swe
from datetime import datetime, timezone
from typing import Dict, List, Tuple, Optional, Any
import hashlib
import json
import logging
from pathlib import Path

from app.core.config import settings

logger = logging.getLogger(__name__)

# Planet constants
PLANETS = {
    "sun": swe.SUN,
    "moon": swe.MOON,
    "mercury": swe.MERCURY,
    "venus": swe.VENUS,
    "mars": swe.MARS,
    "jupiter": swe.JUPITER,
    "saturn": swe.SATURN,
    "rahu": swe.MEAN_NODE,  # North Node (Rahu)
    "ketu": -1,  # Calculated as opposite of Rahu
    "uranus": swe.URANUS,
    "neptune": swe.NEPTUNE,
    "pluto": swe.PLUTO,
}

# House system mapping
HOUSE_SYSTEMS = {
    "placidus": b"P",
    "whole_sign": b"W",
    "koch": b"K",
    "equal": b"E",
}

# Ayanamsha mapping
AYANAMSHA_MAP = {
    "lahiri": swe.SIDM_LAHIRI,
    "raman": swe.SIDM_RAMAN,
    "krishnamurti": swe.SIDM_KRISHNAMURTI,
    "yukteshwar": swe.SIDM_YUKTESHWAR,
}


class ChartEngine:
    """Core chart calculation engine using Swiss Ephemeris"""
    
    def __init__(self):
        """Initialize chart engine with ephemeris path"""
        ephemeris_path = Path(settings.EPHEMERIS_PATH)
        if ephemeris_path.exists():
            swe.set_ephe_path(str(ephemeris_path))
            logger.info(f"Swiss Ephemeris path set to: {ephemeris_path}")
        else:
            logger.warning(f"Ephemeris path not found: {ephemeris_path}")
    
    def calculate_julian_day(self, dt: datetime) -> float:
        """Calculate Julian Day from datetime"""
        # Ensure UTC
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        else:
            dt = dt.astimezone(timezone.utc)
        
        jd = swe.julday(
            dt.year, dt.month, dt.day,
            dt.hour + dt.minute/60.0 + dt.second/3600.0
        )
        return jd
    
    def calculate_planets(
        self,
        jd: float,
        ayanamsha: str = "lahiri",
        flags: int = swe.FLG_SWIEPH
    ) -> Dict[str, Dict[str, float]]:
        """Calculate planetary positions"""
        
        # Set ayanamsha for Vedic
        if ayanamsha in AYANAMSHA_MAP:
            swe.set_sid_mode(AYANAMSHA_MAP[ayanamsha])
            flags |= swe.FLG_SIDEREAL
        
        positions = {}
        
        for planet_name, planet_id in PLANETS.items():
            if planet_name == "ketu":
                # Ketu is opposite of Rahu
                if "rahu" in positions:
                    rahu_long = positions["rahu"]["longitude"]
                    ketu_long = (rahu_long + 180) % 360
                    positions["ketu"] = {
                        "longitude": ketu_long,
                        "latitude": 0.0,
                        "distance": 0.0,
                        "speed": -positions["rahu"]["speed"],
                        "retrograde": False,
                    }
                continue
            
            try:
                result, ret_flag = swe.calc_ut(jd, planet_id, flags)
                
                positions[planet_name] = {
                    "longitude": result[0],
                    "latitude": result[1],
                    "distance": result[2],
                    "speed": result[3],
                    "retrograde": result[3] < 0,
                }
            except Exception as e:
                logger.error(f"Error calculating {planet_name}: {e}")
                positions[planet_name] = None
        
        return positions
    
    def calculate_houses(
        self,
        jd: float,
        lat: float,
        lon: float,
        house_system: str = "placidus",
        ayanamsha: str = "lahiri"
    ) -> Tuple[List[float], float]:
        """Calculate house cusps and ascendant"""
        
        # Set ayanamsha for Vedic
        flags = 0
        if ayanamsha in AYANAMSHA_MAP:
            swe.set_sid_mode(AYANAMSHA_MAP[ayanamsha])
            flags = swe.FLG_SIDEREAL
        
        house_sys = HOUSE_SYSTEMS.get(house_system, b"P")
        
        try:
            cusps, ascmc = swe.houses_ex(jd, lat, lon, house_sys, flags)
            
            # cusps[1] to cusps[12] are the house cusps
            # ascmc[0] is ascendant, ascmc[1] is MC
            houses = list(cusps[1:13])
            ascendant = ascmc[0]
            mc = ascmc[1]
            
            return houses, ascendant, mc
        except Exception as e:
            logger.error(f"Error calculating houses: {e}")
            raise
    
    def calculate_aspects(
        self,
        positions: Dict[str, Dict[str, float]],
        orbs: Optional[Dict[str, float]] = None
    ) -> List[Dict[str, Any]]:
        """Calculate aspects between planets"""
        
        if orbs is None:
            orbs = {
                "conjunction": settings.DEFAULT_ORBS_CONJUNCTION,
                "opposition": settings.DEFAULT_ORBS_OPPOSITION,
                "trine": settings.DEFAULT_ORBS_TRINE,
                "square": settings.DEFAULT_ORBS_SQUARE,
                "sextile": settings.DEFAULT_ORBS_SEXTILE,
            }
        
        aspect_angles = {
            "conjunction": 0,
            "opposition": 180,
            "trine": 120,
            "square": 90,
            "sextile": 60,
        }
        
        aspects = []
        planet_names = list(positions.keys())
        
        for i, planet1 in enumerate(planet_names):
            if positions[planet1] is None:
                continue
            
            for planet2 in planet_names[i+1:]:
                if positions[planet2] is None:
                    continue
                
                long1 = positions[planet1]["longitude"]
                long2 = positions[planet2]["longitude"]
                
                # Calculate angular distance
                diff = abs(long1 - long2)
                if diff > 180:
                    diff = 360 - diff
                
                # Check each aspect type
                for aspect_type, target_angle in aspect_angles.items():
                    orb = orbs.get(aspect_type, 8.0)
                    actual_orb = abs(diff - target_angle)
                    
                    if actual_orb <= orb:
                        aspects.append({
                            "from": planet1,
                            "to": planet2,
                            "type": aspect_type,
                            "orb": round(actual_orb, 2),
                            "applying": self._is_applying(
                                positions[planet1],
                                positions[planet2],
                                target_angle
                            ),
                        })
        
        return aspects
    
    def _is_applying(
        self,
        planet1: Dict[str, float],
        planet2: Dict[str, float],
        target_angle: float
    ) -> bool:
        """Check if aspect is applying or separating"""
        # Simplified: check if planets are moving towards or away from aspect
        speed1 = planet1["speed"]
        speed2 = planet2["speed"]
        return (speed1 - speed2) > 0
    
    def calculate_nakshatra(self, longitude: float) -> Dict[str, Any]:
        """Calculate nakshatra (lunar mansion) from longitude"""
        # 27 nakshatras, each 13°20' (13.333°)
        nakshatra_length = 360 / 27
        nakshatra_num = int(longitude / nakshatra_length)
        
        nakshatra_names = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
            "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
            "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
            "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula",
            "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
            "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
        ]
        
        # Nakshatra pada (quarter)
        pada_length = nakshatra_length / 4
        pada = int((longitude % nakshatra_length) / pada_length) + 1
        
        return {
            "name": nakshatra_names[nakshatra_num],
            "number": nakshatra_num + 1,
            "pada": pada,
            "degree_in_nakshatra": longitude % nakshatra_length,
        }
    
    def generate_chart(
        self,
        dt: datetime,
        lat: float,
        lon: float,
        system: str = "vedic",
        house_system: str = "placidus",
        ayanamsha: str = "lahiri",
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate complete birth chart
        
        Args:
            dt: Birth datetime (UTC)
            lat: Latitude
            lon: Longitude
            system: "vedic" or "western"
            house_system: House system to use
            ayanamsha: Ayanamsha for Vedic charts
            options: Additional options
        
        Returns:
            Complete chart data as dictionary
        """
        
        jd = self.calculate_julian_day(dt)
        
        # Calculate planets
        use_ayanamsha = ayanamsha if system == "vedic" else None
        positions = self.calculate_planets(jd, use_ayanamsha or "lahiri")
        
        # Calculate houses
        houses, ascendant, mc = self.calculate_houses(
            jd, lat, lon, house_system, use_ayanamsha or "lahiri"
        )
        
        # Calculate aspects
        aspects = self.calculate_aspects(positions)
        
        # Additional calculations
        moon_nakshatra = None
        if positions.get("moon"):
            moon_nakshatra = self.calculate_nakshatra(
                positions["moon"]["longitude"]
            )
        
        chart_data = {
            "system": system,
            "ayanamsha": ayanamsha if system == "vedic" else None,
            "house_system": house_system,
            "datetime_utc": dt.isoformat(),
            "julian_day": jd,
            "latitude": lat,
            "longitude": lon,
            "ascendant": round(ascendant, 6),
            "mc": round(mc, 6),
            "planets": {
                name: {
                    k: round(v, 6) if isinstance(v, float) else v
                    for k, v in pos.items()
                } if pos else None
                for name, pos in positions.items()
            },
            "houses": [round(h, 6) for h in houses],
            "aspects": aspects,
            "moon_nakshatra": moon_nakshatra,
        }
        
        # Add dashas if requested
        if options and options.get("include_dashas", True):
            chart_data["dashas"] = self.calculate_vimshottari_dasha(
                jd, positions["moon"]["longitude"]
            )
        
        return chart_data
    
    def calculate_vimshottari_dasha(
        self,
        jd: float,
        moon_longitude: float
    ) -> Dict[str, Any]:
        """
        Calculate complete Vimshottari Dasha with Mahadasha, Antardasha, and Pratyantardasha.
        Returns dasha periods with start/end dates.
        """
        # Dasha lords and years
        lords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
        years = [7, 20, 6, 10, 7, 18, 16, 19, 17]
        
        # Determine starting dasha based on moon nakshatra
        nakshatra = self.calculate_nakshatra(moon_longitude)
        nakshatra_num = nakshatra["number"] - 1
        
        # Each lord rules 3 nakshatras
        lord_idx = nakshatra_num // 3
        
        # Calculate balance of first dasha
        nakshatra_span = 13.333333  # 360/27
        moon_in_nakshatra = moon_longitude % nakshatra_span
        elapsed_fraction = moon_in_nakshatra / nakshatra_span
        
        balance_years = years[lord_idx] * (1 - elapsed_fraction)
        
        # Calculate Mahadasha periods
        mahadashas = []
        current_jd = jd
        
        for i in range(9):
            idx = (lord_idx + i) % 9
            lord = lords[idx]
            period_years = years[idx] if i > 0 else balance_years
            period_days = period_years * 365.25
            
            start_date = self._jd_to_datetime(current_jd)
            end_date = self._jd_to_datetime(current_jd + period_days)
            
            # Calculate Antardashas for this Mahadasha
            antardashas = []
            antardasha_jd = current_jd
            
            for j in range(9):
                ant_idx = (idx + j) % 9
                ant_lord = lords[ant_idx]
                ant_years = (years[idx] * years[ant_idx]) / 120.0
                ant_days = ant_years * 365.25
                
                ant_start = self._jd_to_datetime(antardasha_jd)
                ant_end = self._jd_to_datetime(antardasha_jd + ant_days)
                
                # Calculate Pratyantar Dashas
                pratyantars = []
                prat_jd = antardasha_jd
                
                for k in range(9):
                    prat_idx = (ant_idx + k) % 9
                    prat_lord = lords[prat_idx]
                    prat_years = (years[idx] * years[ant_idx] * years[prat_idx]) / 10800.0
                    prat_days = prat_years * 365.25
                    
                    pratyantars.append({
                        "lord": prat_lord,
                        "start_date": self._jd_to_datetime(prat_jd).isoformat(),
                        "end_date": self._jd_to_datetime(prat_jd + prat_days).isoformat(),
                        "duration_days": round(prat_days, 2)
                    })
                    prat_jd += prat_days
                
                antardashas.append({
                    "lord": ant_lord,
                    "start_date": ant_start.isoformat(),
                    "end_date": ant_end.isoformat(),
                    "duration_days": round(ant_days, 2),
                    "pratyantardashas": pratyantars
                })
                antardasha_jd += ant_days
            
            mahadashas.append({
                "lord": lord,
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "duration_years": round(period_years, 2),
                "antardashas": antardashas
            })
            current_jd += period_days
        
        # Find current periods at birth
        birth_dt = self._jd_to_datetime(jd)
        current_maha = None
        current_antar = None
        current_prat = None
        
        for maha in mahadashas:
            maha_start = datetime.fromisoformat(maha["start_date"])
            maha_end = datetime.fromisoformat(maha["end_date"])
            
            if maha_start <= birth_dt <= maha_end:
                current_maha = maha["lord"]
                for antar in maha["antardashas"]:
                    antar_start = datetime.fromisoformat(antar["start_date"])
                    antar_end = datetime.fromisoformat(antar["end_date"])
                    if antar_start <= birth_dt <= antar_end:
                        current_antar = antar["lord"]
                        for prat in antar["pratyantardashas"]:
                            prat_start = datetime.fromisoformat(prat["start_date"])
                            prat_end = datetime.fromisoformat(prat["end_date"])
                            if prat_start <= birth_dt <= prat_end:
                                current_prat = prat["lord"]
                                break
                        break
                break
        
        return {
            "current_mahadasha": current_maha or lords[lord_idx],
            "current_antardasha": current_antar,
            "current_pratyantardasha": current_prat,
            "balance_years": round(balance_years, 2),
            "all_mahadashas": mahadashas
        }
    
    def _jd_to_datetime(self, jd: float) -> datetime:
        """Convert Julian Day to datetime"""
        year, month, day, hour = swe.revjul(jd)
        minute = int((hour % 1) * 60)
        hour = int(hour)
        return datetime(year, month, day, hour, minute)
    
    def calculate_panchang(self, jd: float, lat: float, lon: float, ayanamsha: str = "lahiri") -> Dict[str, Any]:
        """
        Calculate Panchang (5 limbs of time):
        - Tithi (lunar day)
        - Nakshatra (lunar mansion)
        - Yoga (sun-moon combination)
        - Karana (half of tithi)
        - Vara (weekday)
        """
        # Set ayanamsha
        ayanamsha_id = AYANAMSHA_MAP.get(ayanamsha.lower(), swe.SIDM_LAHIRI)
        swe.set_sid_mode(ayanamsha_id)
        
        # Get Sun and Moon positions (sidereal)
        sun_pos = swe.calc_ut(jd, swe.SUN, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)[0][0]
        moon_pos = swe.calc_ut(jd, swe.MOON, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)[0][0]
        
        # 1. Tithi calculation (based on moon-sun elongation)
        elongation = (moon_pos - sun_pos) % 360
        tithi_num = int(elongation / 12) + 1
        tithi_elapsed = (elongation % 12) / 12
        
        tithis = [
            "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
            "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
            "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"
        ]
        
        paksha = "Shukla" if tithi_num <= 15 else "Krishna"
        tithi_name = tithis[(tithi_num - 1) % 15]
        
        # 2. Nakshatra (already have this)
        nakshatra = self.calculate_nakshatra(moon_pos)
        
        # 3. Yoga calculation (sum of sun and moon longitudes)
        yoga_longitude = (sun_pos + moon_pos) % 360
        yoga_num = int(yoga_longitude / (360/27)) + 1
        yoga_elapsed = (yoga_longitude % (360/27)) / (360/27)
        
        yogas = [
            "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
            "Atiganda", "Sukarman", "Dhriti", "Shula", "Ganda",
            "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
            "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
            "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
            "Indra", "Vaidhriti"
        ]
        
        # 4. Karana calculation (half of tithi)
        karana_num = int(elongation / 6) + 1
        karana_elapsed = (elongation % 6) / 6
        
        karanas = [
            "Bava", "Balava", "Kaulava", "Taitila", "Garija",
            "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna"
        ]
        
        # First 7 karanas repeat 8 times, last 4 are fixed
        if karana_num <= 57:
            karana_name = karanas[(karana_num - 1) % 7]
        else:
            karana_name = karanas[7 + (karana_num - 58)]
        
        # 5. Vara (weekday)
        year, month, day, hour = swe.revjul(jd)
        dt = datetime(year, month, day, int(hour), int((hour % 1) * 60))
        weekday_num = dt.weekday()
        
        varas = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        vara_vedic = ["Soma", "Mangala", "Budha", "Guru", "Shukra", "Shani", "Ravi"]
        
        return {
            "tithi": {
                "number": tithi_num,
                "name": tithi_name,
                "paksha": paksha,
                "elapsed_percent": round(tithi_elapsed * 100, 2)
            },
            "nakshatra": nakshatra,
            "yoga": {
                "number": yoga_num,
                "name": yogas[yoga_num - 1],
                "elapsed_percent": round(yoga_elapsed * 100, 2)
            },
            "karana": {
                "number": karana_num,
                "name": karana_name,
                "elapsed_percent": round(karana_elapsed * 100, 2)
            },
            "vara": {
                "weekday": varas[weekday_num],
                "vedic_name": vara_vedic[weekday_num]
            }
        }
    
    def calculate_divisional_charts(self, jd: float, positions: Dict[str, Dict], ayanamsha: str = "lahiri") -> Dict[str, Any]:
        """
        Calculate divisional charts (Vargas):
        D9 (Navamsa), D10 (Dasamsa), D12 (Dwadasamsa), D30 (Trimsamsa)
        """
        divisional_charts = {}
        
        # Define divisions for each varga
        divisions = {
            "D7": {"name": "Saptamsa", "parts": 7, "per_sign": 4.285714},  # 7 divisions
            "D9": {"name": "Navamsa", "parts": 9, "per_sign": 3.333333},  # 9 divisions
            "D10": {"name": "Dasamsa", "parts": 10, "per_sign": 3.0},  # 10 divisions
            "D12": {"name": "Dwadasamsa", "parts": 12, "per_sign": 2.5},  # 12 divisions
            "D30": {"name": "Trimsamsa", "parts": 30, "per_sign": 1.0}   # 30 divisions
        }
        
        for div_key, div_info in divisions.items():
            div_positions = {}
            
            for planet_name, planet_data in positions.items():
                if not planet_data or planet_name in ["rahu", "ketu"]:
                    continue
                
                longitude = planet_data["longitude"]
                
                # Sign and position within sign
                sign_num = int(longitude / 30)
                pos_in_sign = longitude % 30
                
                # Calculate divisional position
                division_in_sign = int(pos_in_sign / div_info["per_sign"])
                
                # Navamsa formula: (sign_num * parts + division) % 12
                if div_key == "D9":
                    navamsa_sign = ((sign_num * 9) + division_in_sign) % 12
                    div_longitude = navamsa_sign * 30 + (pos_in_sign % div_info["per_sign"]) * 9
                else:
                    # General varga formula
                    varga_sign = ((sign_num * div_info["parts"]) + division_in_sign) % 12
                    div_longitude = varga_sign * 30 + (pos_in_sign % div_info["per_sign"]) * div_info["parts"]
                
                div_positions[planet_name] = {
                    "longitude": round(div_longitude % 360, 6),
                    "sign": self._get_sign_name(int(div_longitude / 30))
                }
            
            divisional_charts[div_key] = {
                "name": div_info["name"],
                "positions": div_positions
            }
        
        return divisional_charts
    
    def calculate_shadbala(self, jd: float, lat: float, lon: float, positions: Dict[str, Dict], houses: List[float]) -> Dict[str, Any]:
        """
        Calculate Shadbala (six-fold strength) for planets.
        Components: Sthana, Dig, Kala, Chesta, Naisargika, Drik Bala
        """
        shadbala_results = {}
        
        # Naisargika Bala (natural strength) - fixed values
        naisargika = {
            "sun": 60, "moon": 51.43, "mars": 17.14,
            "mercury": 25.71, "jupiter": 34.29, "venus": 42.86,
            "saturn": 8.57
        }
        
        for planet_name, planet_data in positions.items():
            if not planet_data or planet_name in ["rahu", "ketu", "uranus", "neptune", "pluto"]:
                continue
            
            bala = {}
            longitude = planet_data["longitude"]
            sign_num = int(longitude / 30)
            
            # 1. Sthana Bala (positional strength)
            # Simplified: exaltation/debilitation, moolatrikona, own sign
            exaltations = {
                "sun": 10, "moon": 33, "mars": 298, "mercury": 165,
                "jupiter": 95, "venus": 357, "saturn": 200
            }
            
            if planet_name in exaltations:
                exalt_long = exaltations[planet_name]
                distance = min(abs(longitude - exalt_long), 360 - abs(longitude - exalt_long))
                sthana_bala = max(0, 60 - distance)
            else:
                sthana_bala = 30
            
            bala["sthana_bala"] = round(sthana_bala, 2)
            
            # 2. Dig Bala (directional strength)
            # Based on house position - simplified
            house_num = 0
            for i, cusp in enumerate(houses):
                if longitude >= cusp:
                    house_num = i
            
            dig_strength = {
                "sun": 10, "moon": 4, "mars": 10,
                "mercury": 1, "jupiter": 1, "venus": 4, "saturn": 7
            }
            
            dig_bala = dig_strength.get(planet_name, 0) * 10
            bala["dig_bala"] = round(dig_bala, 2)
            
            # 3. Kala Bala (temporal strength) - simplified day/night
            year, month, day, hour = swe.revjul(jd)
            is_day = 6 <= hour <= 18
            
            if planet_name in ["sun", "jupiter", "venus"]:
                kala_bala = 60 if is_day else 30
            else:
                kala_bala = 60 if not is_day else 30
            
            bala["kala_bala"] = round(kala_bala, 2)
            
            # 4. Chesta Bala (motional strength)
            # Based on retrograde/direct motion
            speed = planet_data.get("speed", 0)
            is_retro = planet_data.get("retrograde", False)
            
            chesta_bala = 30 if not is_retro else 45  # Retrograde planets get more
            bala["chesta_bala"] = round(chesta_bala, 2)
            
            # 5. Naisargika Bala (natural strength)
            bala["naisargika_bala"] = naisargika.get(planet_name, 30)
            
            # 6. Drik Bala (aspectual strength) - simplified
            drik_bala = 30  # Would require full aspect calculation
            bala["drik_bala"] = round(drik_bala, 2)
            
            # Total Shadbala
            total = sum(bala.values())
            bala["total_shadbala"] = round(total, 2)
            bala["strength_rating"] = self._get_strength_rating(total)
            
            shadbala_results[planet_name] = bala
        
        return shadbala_results
    
    def _get_strength_rating(self, total: float) -> str:
        """Get strength rating based on total Shadbala"""
        if total >= 300:
            return "Excellent"
        elif total >= 240:
            return "Very Good"
        elif total >= 180:
            return "Good"
        elif total >= 120:
            return "Average"
        else:
            return "Weak"
    
    def _get_sign_name(self, sign_num: int) -> str:
        """Get zodiac sign name from number"""
        signs = [
            "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
        ]
        return signs[sign_num % 12]
    
    def get_chart_hash(self, chart_data: Dict[str, Any]) -> str:
        """Generate unique hash for chart deduplication"""
        # Use key parameters for hash
        hash_input = f"{chart_data['datetime_utc']}-{chart_data['latitude']}-{chart_data['longitude']}-{chart_data['system']}"
        return hashlib.sha256(hash_input.encode()).hexdigest()


# Global chart engine instance
chart_engine = ChartEngine()


# Convenience wrapper functions for backward compatibility
def calculate_chart(*args, **kwargs):
    """Wrapper for chart_engine.generate_chart()"""
    return chart_engine.generate_chart(*args, **kwargs)


def calculate_divisional_charts(*args, **kwargs):
    """Wrapper for chart_engine.calculate_divisional_charts()"""
    return chart_engine.calculate_divisional_charts(*args, **kwargs)


def calculate_vimshottari_dasha(*args, **kwargs):
    """Wrapper for chart_engine.calculate_vimshottari_dasha()"""
    return chart_engine.calculate_vimshottari_dasha(*args, **kwargs)


def calculate_panchang(*args, **kwargs):
    """Wrapper for chart_engine.calculate_panchang()"""
    return chart_engine.calculate_panchang(*args, **kwargs)


def calculate_shadbala(*args, **kwargs):
    """Wrapper for chart_engine.calculate_shadbala()"""
    return chart_engine.calculate_shadbala(*args, **kwargs)
