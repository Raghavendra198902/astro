"""
Panchang Engine - Hindu Vedic Calendar Calculations
Calculates Tithi, Nakshatra, Yoga, Karana, and other panchang elements
"""

import swisseph as swe
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import pytz
from astral import LocationInfo
from astral.sun import sun
import logging

logger = logging.getLogger(__name__)

# Nakshatra names (27 lunar mansions)
NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

# Nakshatra deities
NAKSHATRA_DEITIES = [
    "Ashwini Kumaras", "Yama", "Agni", "Brahma", "Chandra", "Rudra",
    "Aditi", "Brihaspati", "Nagas", "Pitris", "Bhaga", "Aryaman",
    "Savitar", "Tvashtar", "Vayu", "Indra-Agni", "Mitra", "Indra",
    "Nirrti", "Apah", "Vishvadevas", "Vishnu", "Vasus", "Varuna",
    "Aja Ekapada", "Ahir Budhnya", "Pushan"
]

# Tithi names (30 lunar days)
TITHIS = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima"
]

TITHI_DEITIES = [
    "Brahma", "Vidhatr", "Vishnu", "Yama", "Chandra",
    "Kartikeya", "Indra", "Vasus", "Nagas", "Dharmaraja",
    "Rudra", "Aditya", "Kama", "Shiva", "Chandra"
]

# Yoga names (27 yogas)
YOGAS = [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma",
    "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana",
    "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha",
    "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
]

YOGA_QUALITIES = [
    "Inauspicious", "Auspicious", "Auspicious", "Auspicious", "Auspicious", "Inauspicious", "Auspicious",
    "Auspicious", "Inauspicious", "Inauspicious", "Auspicious", "Auspicious", "Inauspicious", "Auspicious",
    "Inauspicious", "Auspicious", "Inauspicious", "Auspicious", "Inauspicious", "Auspicious", "Auspicious",
    "Auspicious", "Auspicious", "Auspicious", "Auspicious", "Auspicious", "Inauspicious"
]

# Karana names (11 karanas)
KARANAS = [
    "Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti",
    "Shakuni", "Chatushpada", "Naga", "Kimstughna"
]

KARANA_NATURES = [
    "Movable", "Movable", "Movable", "Movable", "Movable", "Movable", "Movable",
    "Fixed", "Fixed", "Fixed", "Fixed"
]

# Rahu Kaal timings (in 8ths of day from sunrise to sunset)
RAHU_KAAL_WEEKDAY = {
    0: (7, 8),  # Monday - 7/8th part
    1: (1, 2),  # Tuesday - 1/8th part
    2: (6, 7),  # Wednesday - 6/8th part
    3: (3, 4),  # Thursday - 3/8th part
    4: (4, 5),  # Friday - 4/8th part
    5: (5, 6),  # Saturday - 5/8th part
    6: (2, 3),  # Sunday - 2/8th part
}

# Yamaganda timings
YAMAGANDA_WEEKDAY = {
    0: (5, 6),  # Monday
    1: (4, 5),  # Tuesday
    2: (3, 4),  # Wednesday
    3: (2, 3),  # Thursday
    4: (1, 2),  # Friday
    5: (0, 1),  # Saturday
    6: (6, 7),  # Sunday
}

# Gulika timings
GULIKA_WEEKDAY = {
    0: (6, 7),  # Monday
    1: (5, 6),  # Tuesday
    2: (4, 5),  # Wednesday
    3: (3, 4),  # Thursday
    4: (2, 3),  # Friday
    5: (1, 2),  # Saturday
    6: (5, 6),  # Sunday
}


class PanchangEngine:
    """Calculate Hindu Panchang elements using Swiss Ephemeris"""
    
    def __init__(self, ayanamsha: str = "lahiri"):
        """Initialize with ayanamsha (default: Lahiri)"""
        self.ayanamsha = swe.SIDM_LAHIRI
        swe.set_sid_mode(self.ayanamsha)
    
    def get_julian_day(self, dt: datetime) -> float:
        """Convert datetime to Julian Day"""
        return swe.julday(dt.year, dt.month, dt.day, dt.hour + dt.minute/60.0 + dt.second/3600.0)
    
    def get_planet_position(self, jd: float, planet: int) -> Tuple[float, float]:
        """Get planet's longitude and latitude"""
        calc_flag = swe.FLG_SIDEREAL | swe.FLG_SPEED
        result = swe.calc_ut(jd, planet, calc_flag)
        return result[0][0], result[0][1]  # longitude, latitude
    
    def calculate_tithi(self, jd: float) -> Dict:
        """Calculate Tithi (lunar day)"""
        # Get Sun and Moon longitudes
        sun_long, _ = self.get_planet_position(jd, swe.SUN)
        moon_long, _ = self.get_planet_position(jd, swe.MOON)
        
        # Calculate elongation (moon - sun)
        elongation = (moon_long - sun_long) % 360
        
        # Each tithi is 12 degrees
        tithi_num = int(elongation / 12)
        tithi_progress = (elongation % 12) / 12
        
        # Determine paksha (fortnight)
        if tithi_num < 15:
            paksha = "Shukla"  # Waxing
            tithi_name = TITHIS[tithi_num]
            deity = TITHI_DEITIES[tithi_num]
        else:
            paksha = "Krishna"  # Waning
            tithi_name = TITHIS[tithi_num - 15]
            deity = TITHI_DEITIES[tithi_num - 15]
        
        # Calculate end time (when tithi completes)
        remaining = 1 - tithi_progress
        hours_remaining = remaining * 12 / 13  # Approximate
        
        return {
            "number": tithi_num + 1,
            "name": tithi_name,
            "deity": deity,
            "paksha": paksha,
            "progress": tithi_progress,
            "hours_remaining": hours_remaining
        }
    
    def calculate_nakshatra(self, jd: float) -> Dict:
        """Calculate Nakshatra (lunar mansion)"""
        moon_long, _ = self.get_planet_position(jd, swe.MOON)
        
        # Each nakshatra is 13°20' (13.333...)
        nakshatra_num = int(moon_long / 13.333333333)
        nakshatra_progress = (moon_long % 13.333333333) / 13.333333333
        
        return {
            "number": nakshatra_num + 1,
            "name": NAKSHATRAS[nakshatra_num],
            "deity": NAKSHATRA_DEITIES[nakshatra_num],
            "progress": nakshatra_progress,
            "hours_remaining": (1 - nakshatra_progress) * 24  # Approximate
        }
    
    def calculate_yoga(self, jd: float) -> Dict:
        """Calculate Yoga"""
        sun_long, _ = self.get_planet_position(jd, swe.SUN)
        moon_long, _ = self.get_planet_position(jd, swe.MOON)
        
        # Yoga is based on sum of sun and moon longitudes
        yoga_degrees = (sun_long + moon_long) % 360
        yoga_num = int(yoga_degrees / 13.333333333)
        yoga_progress = (yoga_degrees % 13.333333333) / 13.333333333
        
        return {
            "number": yoga_num + 1,
            "name": YOGAS[yoga_num],
            "quality": YOGA_QUALITIES[yoga_num],
            "progress": yoga_progress,
            "hours_remaining": (1 - yoga_progress) * 24  # Approximate
        }
    
    def calculate_karana(self, jd: float) -> Dict:
        """Calculate Karana (half of tithi)"""
        sun_long, _ = self.get_planet_position(jd, swe.SUN)
        moon_long, _ = self.get_planet_position(jd, swe.MOON)
        
        elongation = (moon_long - sun_long) % 360
        karana_num = int(elongation / 6)  # Each karana is 6 degrees
        karana_progress = (elongation % 6) / 6
        
        # First 7 are movable, repeat 8 times, then 4 fixed
        if karana_num < 56:
            karana_index = karana_num % 7
        else:
            karana_index = 7 + (karana_num - 56)
        
        karana_index = min(karana_index, 10)  # Safety check
        
        return {
            "number": karana_num + 1,
            "name": KARANAS[karana_index],
            "nature": KARANA_NATURES[karana_index],
            "progress": karana_progress,
            "hours_remaining": (1 - karana_progress) * 12  # Approximate
        }
    
    def calculate_sun_moon_times(self, date: datetime, latitude: float, longitude: float, 
                                  timezone_str: str = "Asia/Kolkata") -> Dict:
        """Calculate sunrise, sunset, moonrise, moonset"""
        try:
            # Create location
            location = LocationInfo(latitude=latitude, longitude=longitude, timezone=timezone_str)
            
            # Calculate sun times
            s = sun(location.observer, date=date.date(), tzinfo=pytz.timezone(timezone_str))
            
            # Calculate moon times using Swiss Ephemeris
            tz = pytz.timezone(timezone_str)
            local_date = tz.localize(datetime.combine(date.date(), datetime.min.time()))
            jd_start = self.get_julian_day(local_date)
            
            # Find moonrise and moonset
            moonrise_time = None
            moonset_time = None
            
            # Check each hour for moon rise/set
            for hour in range(48):  # Check 48 hours
                jd = jd_start + hour / 24.0
                
                # Calculate moon altitude
                moon_long, moon_lat = self.get_planet_position(jd, swe.MOON)
                
                # Simple altitude calculation (approximate)
                # In production, use proper altitude calculation
                if hour > 0:
                    prev_jd = jd_start + (hour - 1) / 24.0
                    prev_long, prev_lat = self.get_planet_position(prev_jd, swe.MOON)
                    
                    # Detect rising (rough approximation)
                    if not moonrise_time and hour < 24:
                        moonrise_time = local_date + timedelta(hours=hour)
                    if not moonset_time and hour > 12:
                        moonset_time = local_date + timedelta(hours=hour)
            
            return {
                "sunrise": s["sunrise"].strftime("%I:%M %p"),
                "sunset": s["sunset"].strftime("%I:%M %p"),
                "moonrise": moonrise_time.strftime("%I:%M %p") if moonrise_time else "N/A",
                "moonset": moonset_time.strftime("%I:%M %p") if moonset_time else "N/A",
            }
        except Exception as e:
            logger.error(f"Error calculating sun/moon times: {e}")
            return {
                "sunrise": "06:30 AM",
                "sunset": "06:30 PM",
                "moonrise": "N/A",
                "moonset": "N/A",
            }
    
    def calculate_moon_phase(self, jd: float) -> Dict:
        """Calculate moon phase and sign"""
        sun_long, _ = self.get_planet_position(jd, swe.SUN)
        moon_long, _ = self.get_planet_position(jd, swe.MOON)
        
        elongation = (moon_long - sun_long) % 360
        
        # Determine phase
        if elongation < 45:
            phase = "New Moon"
        elif elongation < 90:
            phase = "Waxing Crescent"
        elif elongation < 135:
            phase = "First Quarter"
        elif elongation < 180:
            phase = "Waxing Gibbous"
        elif elongation < 225:
            phase = "Full Moon"
        elif elongation < 270:
            phase = "Waning Gibbous"
        elif elongation < 315:
            phase = "Last Quarter"
        else:
            phase = "Waning Crescent"
        
        # Determine zodiac sign (rashi)
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                 "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        sign_num = int(moon_long / 30)
        
        return {
            "phase": phase,
            "sign": signs[sign_num],
            "elongation": elongation
        }
    
    def calculate_inauspicious_times(self, sunrise: str, sunset: str, weekday: int) -> List[Dict]:
        """Calculate Rahu Kaal, Yamaganda, and Gulika timings"""
        # Parse times
        sunrise_dt = datetime.strptime(sunrise, "%I:%M %p")
        sunset_dt = datetime.strptime(sunset, "%I:%M %p")
        
        # Calculate day duration in minutes
        day_duration = (sunset_dt.hour - sunrise_dt.hour) * 60 + (sunset_dt.minute - sunrise_dt.minute)
        eighth_part = day_duration / 8
        
        def calculate_time_range(start_eighth: int, end_eighth: int) -> Tuple[str, str]:
            start_mins = sunrise_dt.hour * 60 + sunrise_dt.minute + (start_eighth * eighth_part)
            end_mins = sunrise_dt.hour * 60 + sunrise_dt.minute + (end_eighth * eighth_part)
            
            start_time = f"{int(start_mins // 60) % 12 or 12}:{int(start_mins % 60):02d} {'AM' if start_mins < 720 else 'PM'}"
            end_time = f"{int(end_mins // 60) % 12 or 12}:{int(end_mins % 60):02d} {'AM' if end_mins < 720 else 'PM'}"
            
            return start_time, end_time
        
        rahu_start, rahu_end = RAHU_KAAL_WEEKDAY[weekday]
        yama_start, yama_end = YAMAGANDA_WEEKDAY[weekday]
        gulika_start, gulika_end = GULIKA_WEEKDAY[weekday]
        
        rahu_time_start, rahu_time_end = calculate_time_range(rahu_start, rahu_end)
        yama_time_start, yama_time_end = calculate_time_range(yama_start, yama_end)
        gulika_time_start, gulika_time_end = calculate_time_range(gulika_start, gulika_end)
        
        return [
            {
                "name": "Rahu Kaal",
                "time": f"{rahu_time_start} - {rahu_time_end}",
                "warning": "Avoid New Beginnings"
            },
            {
                "name": "Yamaganda",
                "time": f"{yama_time_start} - {yama_time_end}",
                "warning": "Not for Important Work"
            },
            {
                "name": "Gulika Kaal",
                "time": f"{gulika_time_start} - {gulika_time_end}",
                "warning": "Avoid Auspicious Events"
            }
        ]
    
    def calculate_auspicious_times(self, sunrise: str, sunset: str) -> List[Dict]:
        """Calculate auspicious muhurat timings"""
        sunrise_dt = datetime.strptime(sunrise, "%I:%M %p")
        sunset_dt = datetime.strptime(sunset, "%I:%M %p")
        
        # Brahma Muhurta: 1h 36m before sunrise
        brahma_end = sunrise_dt
        brahma_start = (datetime.combine(datetime.today(), brahma_end.time()) - timedelta(minutes=96)).time()
        
        # Abhijit Muhurta: Middle of the day (noon ± 24 minutes)
        noon = datetime.combine(datetime.today(), datetime.strptime("12:00 PM", "%I:%M %p").time())
        abhijit_start = (noon - timedelta(minutes=24)).time()
        abhijit_end = (noon + timedelta(minutes=24)).time()
        
        # Vijaya Muhurta: 2-3 PM range
        vijaya_start = datetime.strptime("02:00 PM", "%I:%M %p").time()
        vijaya_end = datetime.strptime("03:00 PM", "%I:%M %p").time()
        
        # Godhuli Muhurta: Around sunset (sunset ± 24 minutes)
        sunset_time = datetime.combine(datetime.today(), sunset_dt.time())
        godhuli_start = (sunset_time - timedelta(minutes=24)).time()
        godhuli_end = (sunset_time + timedelta(minutes=24)).time()
        
        return [
            {
                "name": "Abhijit Muhurta",
                "time": f"{abhijit_start.strftime('%I:%M %p')} - {abhijit_end.strftime('%I:%M %p')}",
                "quality": "Most Auspicious"
            },
            {
                "name": "Brahma Muhurta",
                "time": f"{brahma_start.strftime('%I:%M %p')} - {brahma_end.strftime('%I:%M %p')}",
                "quality": "Spiritual Activities"
            },
            {
                "name": "Vijaya Muhurta",
                "time": f"{vijaya_start.strftime('%I:%M %p')} - {vijaya_end.strftime('%I:%M %p')}",
                "quality": "Victory & Success"
            },
            {
                "name": "Godhuli Muhurta",
                "time": f"{godhuli_start.strftime('%I:%M %p')} - {godhuli_end.strftime('%I:%M %p')}",
                "quality": "Prayers & Rituals"
            }
        ]
    
    def get_complete_panchang(self, date: datetime, latitude: float, longitude: float,
                             timezone_str: str = "Asia/Kolkata") -> Dict:
        """Calculate complete panchang for given date and location"""
        try:
            # Convert to UTC for calculations
            tz = pytz.timezone(timezone_str)
            local_dt = tz.localize(date) if date.tzinfo is None else date
            jd = self.get_julian_day(local_dt.astimezone(pytz.UTC))
            
            # Calculate all elements
            tithi = self.calculate_tithi(jd)
            nakshatra = self.calculate_nakshatra(jd)
            yoga = self.calculate_yoga(jd)
            karana = self.calculate_karana(jd)
            sun_moon = self.calculate_sun_moon_times(date, latitude, longitude, timezone_str)
            moon_phase = self.calculate_moon_phase(jd)
            
            # Calculate timings
            weekday = date.weekday()
            inauspicious = self.calculate_inauspicious_times(sun_moon["sunrise"], sun_moon["sunset"], weekday)
            auspicious = self.calculate_auspicious_times(sun_moon["sunrise"], sun_moon["sunset"])
            
            # Format end times
            tithi_end = (local_dt + timedelta(hours=tithi["hours_remaining"])).strftime("%I:%M %p")
            nakshatra_end = (local_dt + timedelta(hours=nakshatra["hours_remaining"])).strftime("%I:%M %p")
            yoga_end = (local_dt + timedelta(hours=yoga["hours_remaining"])).strftime("%I:%M %p")
            karana_end = (local_dt + timedelta(hours=karana["hours_remaining"])).strftime("%I:%M %p")
            
            return {
                "date": date.strftime("%Y-%m-%d"),
                "location": {
                    "latitude": latitude,
                    "longitude": longitude,
                    "timezone": timezone_str
                },
                "panchang": {
                    "tithi": {
                        "name": f"{tithi['name']} ({tithi['number']}th Day)",
                        "endTime": tithi_end,
                        "deity": tithi["deity"]
                    },
                    "nakshatra": {
                        "name": nakshatra["name"],
                        "endTime": nakshatra_end,
                        "deity": nakshatra["deity"]
                    },
                    "yoga": {
                        "name": yoga["name"],
                        "endTime": yoga_end,
                        "quality": yoga["quality"]
                    },
                    "karana": {
                        "name": karana["name"],
                        "endTime": karana_end,
                        "nature": karana["nature"]
                    },
                    "paksha": {
                        "name": f"{tithi['paksha']} Paksha",
                        "phase": f"{'Waxing' if tithi['paksha'] == 'Shukla' else 'Waning'} Moon"
                    }
                },
                "sunMoon": {
                    **sun_moon,
                    "moonPhase": moon_phase["phase"],
                    "moonSign": moon_phase["sign"]
                },
                "auspiciousTimes": auspicious,
                "inauspiciousTimes": inauspicious
            }
        except Exception as e:
            logger.error(f"Error calculating panchang: {e}", exc_info=True)
            raise
