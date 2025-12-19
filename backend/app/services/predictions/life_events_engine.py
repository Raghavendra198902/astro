"""
Life Events Prediction Engine
Combines Vedic Astrology (Dasha, Transit, Bhava) + Numerology + AI Pattern Matching
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from enum import Enum
import logging
import hashlib
import json
from pydantic import BaseModel, Field, field_validator, ValidationError

logger = logging.getLogger(__name__)


class PredictionValidationError(Exception):
    """Custom exception for prediction validation errors"""
    pass


class PredictionInput(BaseModel):
    """Validated input for life events prediction"""
    birth_date: datetime = Field(..., description="Date of birth")
    birth_time: str = Field(..., pattern=r"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$", description="Time of birth (HH:MM)")
    latitude: float = Field(..., ge=-90, le=90, description="Birth location latitude")
    longitude: float = Field(..., ge=-180, le=180, description="Birth location longitude")
    full_name: str = Field(..., min_length=2, max_length=200, description="Full name")
    current_age: int = Field(..., ge=1, le=150, description="Current age")
    prediction_years: int = Field(default=10, ge=1, le=50, description="Years to predict")
    
    @field_validator("birth_date")
    @classmethod
    def validate_birth_date(cls, v):
        """Validate birth date is not in future and reasonable"""
        if v > datetime.now():
            raise ValueError("Birth date cannot be in the future")
        if v.year < 1900:
            raise ValueError("Birth date must be after 1900")
        return v
    
    @field_validator("full_name")
    @classmethod
    def validate_name(cls, v):
        """Validate name contains valid characters"""
        if not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip()
    
    def generate_cache_key(self) -> str:
        """Generate unique cache key for this prediction request"""
        key_data = {
            "birth_date": self.birth_date.isoformat(),
            "birth_time": self.birth_time,
            "latitude": round(self.latitude, 4),
            "longitude": round(self.longitude, 4),
            "full_name": self.full_name.lower(),
            "current_age": self.current_age,
            "prediction_years": self.prediction_years
        }
        key_string = json.dumps(key_data, sort_keys=True)
        return f"prediction:{hashlib.sha256(key_string.encode()).hexdigest()}"


class EventCategory(str, Enum):
    """Life event categories"""
    CAREER = "career"
    RELATIONSHIPS = "relationships"
    HEALTH = "health"
    FINANCE = "finance"
    EDUCATION = "education"
    FAMILY = "family"
    SPIRITUAL = "spiritual"
    TRAVEL = "travel"
    PROPERTY = "property"
    LEGAL = "legal"


class RiskLevel(str, Enum):
    """Risk severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class EventType(str, Enum):
    """Event nature"""
    OPPORTUNITY = "opportunity"
    CHALLENGE = "challenge"
    NEUTRAL = "neutral"
    TRANSFORMATION = "transformation"


class LifeEventsEngine:
    """
    Core prediction engine combining multiple sources
    for past and future life event detection
    """
    
    def __init__(self, cache_service=None):
        self.accuracy_weights = {
            "astrology": 0.50,  # Vedic charts, Dasha, Transit
            "numerology": 0.30,  # Life cycles, Personal years
            "ai_patterns": 0.20  # ML pattern recognition
        }
        self.cache_service = cache_service
        self.cache_enabled = cache_service is not None
        self.cache_ttl = 3600  # 1 hour
    
    async def validate_and_predict_cached(
        self,
        birth_date: datetime,
        birth_time: str,
        latitude: float,
        longitude: float,
        full_name: str,
        current_age: int,
        prediction_years: int = 10,
        use_cache: bool = True
    ) -> Dict[str, Any]:
        """
        Validate inputs, check cache, and perform prediction
        
        Args:
            birth_date: Date of birth
            birth_time: Time of birth (HH:MM)
            latitude: Birth location latitude (-90 to 90)
            longitude: Birth location longitude (-180 to 180)
            full_name: Full name for numerology (2-200 chars)
            current_age: Current age (1-150)
            prediction_years: Years to predict (1-50)
            use_cache: Whether to use cache (default: True)
            
        Returns:
            Complete life events prediction data or error response
        """
        try:
            # Validate inputs
            validated_input = PredictionInput(
                birth_date=birth_date,
                birth_time=birth_time,
                latitude=latitude,
                longitude=longitude,
                full_name=full_name,
                current_age=current_age,
                prediction_years=prediction_years
            )
            
            # Check cache if enabled
            if use_cache and self.cache_enabled:
                cache_key = validated_input.generate_cache_key()
                cached_result = await self.cache_service.get(cache_key)
                
                if cached_result:
                    logger.info(f"Returning cached prediction for {validated_input.full_name}")
                    cached_result["from_cache"] = True
                    return cached_result
            
            # Perform prediction
            logger.info(
                f"Computing prediction for {validated_input.full_name}, "
                f"age {validated_input.current_age}, span {validated_input.prediction_years}y"
            )
            
            result = self.predict_life_events(
                validated_input.birth_date,
                validated_input.birth_time,
                validated_input.latitude,
                validated_input.longitude,
                validated_input.full_name,
                validated_input.current_age,
                validated_input.prediction_years
            )
            
            # Cache successful results
            if use_cache and self.cache_enabled and result.get("success"):
                cache_key = validated_input.generate_cache_key()
                await self.cache_service.set(cache_key, result, self.cache_ttl)
            
            result["from_cache"] = False
            return result
            
        except ValidationError as e:
            error_details = []
            for error in e.errors():
                field = " -> ".join(str(loc) for loc in error["loc"])
                message = error["msg"]
                error_details.append(f"{field}: {message}")
            
            error_message = "Input validation failed: " + "; ".join(error_details)
            logger.error(error_message)
            
            return {
                "success": False,
                "error": "Validation Error",
                "details": error_details,
                "message": "Please check your input parameters and try again"
            }
        
        except Exception as e:
            logger.error(f"Unexpected error in cached prediction: {e}", exc_info=True)
            return {
                "success": False,
                "error": "Internal Error",
                "message": "An unexpected error occurred. Please try again later."
            }
    
    def validate_and_predict(
        self,
        birth_date: datetime,
        birth_time: str,
        latitude: float,
        longitude: float,
        full_name: str,
        current_age: int,
        prediction_years: int = 10
    ) -> Dict[str, Any]:
        """
        Validate inputs and perform prediction with comprehensive error handling
        
        Args:
            birth_date: Date of birth
            birth_time: Time of birth (HH:MM)
            latitude: Birth location latitude (-90 to 90)
            longitude: Birth location longitude (-180 to 180)
            full_name: Full name for numerology (2-200 chars)
            current_age: Current age (1-150)
            prediction_years: Years to predict (1-50)
            
        Returns:
            Complete life events prediction data or error response
        
        Raises:
            PredictionValidationError: If input validation fails
        """
        try:
            # Validate all inputs
            validated_input = PredictionInput(
                birth_date=birth_date,
                birth_time=birth_time,
                latitude=latitude,
                longitude=longitude,
                full_name=full_name,
                current_age=current_age,
                prediction_years=prediction_years
            )
            
            logger.info(
                f"Validated prediction request for {validated_input.full_name}, "
                f"age {validated_input.current_age}, predicting {validated_input.prediction_years} years"
            )
            
            # Perform prediction with validated inputs
            return self.predict_life_events(
                validated_input.birth_date,
                validated_input.birth_time,
                validated_input.latitude,
                validated_input.longitude,
                validated_input.full_name,
                validated_input.current_age,
                validated_input.prediction_years
            )
            
        except ValidationError as e:
            error_details = []
            for error in e.errors():
                field = " -> ".join(str(loc) for loc in error["loc"])
                message = error["msg"]
                error_details.append(f"{field}: {message}")
            
            error_message = "Input validation failed: " + "; ".join(error_details)
            logger.error(error_message)
            
            return {
                "success": False,
                "error": "Validation Error",
                "details": error_details,
                "message": "Please check your input parameters and try again"
            }
        
        except Exception as e:
            logger.error(f"Unexpected error in validation: {e}", exc_info=True)
            return {
                "success": False,
                "error": "Internal Error",
                "message": "An unexpected error occurred. Please try again later."
            }
    
    def predict_life_events(
        self,
        birth_date: datetime,
        birth_time: str,
        latitude: float,
        longitude: float,
        full_name: str,
        current_age: int,
        prediction_years: int = 10
    ) -> Dict[str, Any]:
        """
        Master prediction function combining all engines
        
        Args:
            birth_date: Date of birth (validated)
            birth_time: Time of birth (HH:MM) (validated)
            latitude: Birth location latitude (validated)
            longitude: Birth location longitude (validated)
            full_name: Full name for numerology (validated)
            current_age: Current age (validated)
            prediction_years: Years to predict into future (validated)
            
        Returns:
            Complete life events prediction data
        """
        request_id = hashlib.md5(f"{birth_date}{birth_time}{current_age}".encode()).hexdigest()[:8]
        
        try:
            logger.info(f"[{request_id}] Starting prediction for age {current_age}, span {prediction_years}y")
            start_time = datetime.now()
            
            # Get astrology analysis
            astro_data = self._get_astrology_predictions(
                birth_date, birth_time, latitude, longitude, current_age, prediction_years
            )
            logger.debug(f"[{request_id}] Astrology analysis completed")
            
            # Get numerology analysis
            numerology_data = self._get_numerology_predictions(
                birth_date, full_name, current_age, prediction_years
            )
            logger.debug(f"[{request_id}] Numerology analysis completed")
            
            # Get AI pattern predictions
            ai_patterns = self._get_ai_pattern_predictions(
                astro_data, numerology_data, current_age
            )
            logger.debug(f"[{request_id}] AI pattern analysis completed")
            
            # Combine all sources with weighted algorithm
            combined_predictions = self._combine_predictions(
                astro_data, numerology_data, ai_patterns
            )
            
            computation_time = (datetime.now() - start_time).total_seconds()
            logger.info(f"[{request_id}] Prediction completed in {computation_time:.2f}s")
            
            return {
                "success": True,
                "request_id": request_id,
                "birth_date": birth_date.isoformat(),
                "current_age": current_age,
                "prediction_span": f"{current_age} - {current_age + prediction_years} years",
                "past_events": self._detect_past_events(
                    astro_data, numerology_data, current_age
                ),
                "future_events": self._predict_future_events(
                    astro_data, numerology_data, ai_patterns, current_age, prediction_years
                ),
                "risk_periods": self._detect_risk_periods(
                    combined_predictions, current_age, prediction_years
                ),
                "life_cycles": self._analyze_life_cycles(
                    numerology_data, current_age, prediction_years
                ),
                "personality_blueprint": self._generate_personality_blueprint(
                    astro_data, numerology_data
                ),
                "accuracy_score": self._calculate_accuracy_score(combined_predictions),
                "data_sources": {
                    "astrology_weight": self.accuracy_weights["astrology"],
                    "numerology_weight": self.accuracy_weights["numerology"],
                    "ai_patterns_weight": self.accuracy_weights["ai_patterns"]
                },
                "metadata": {
                    "computation_time_seconds": round(computation_time, 2),
                    "timestamp": datetime.now().isoformat()
                }
            }
            
        except Exception as e:
            logger.error(f"[{request_id}] Life events prediction failed: {e}", exc_info=True)
            return {
                "success": False,
                "request_id": request_id,
                "error": "Prediction Error",
                "message": "Unable to generate predictions. Please verify your birth details and try again."
            }
    
    def _get_astrology_predictions(
        self,
        birth_date: datetime,
        birth_time: str,
        latitude: float,
        longitude: float,
        current_age: int,
        prediction_years: int
    ) -> Dict[str, Any]:
        """Get astrological predictions using Dasha, Transit, Bhava"""
        # Import here to avoid circular dependency
        from app.services.chart.engine import calculate_chart, chart_engine
        from datetime import datetime as dt
        import swisseph as swe
        
        # Calculate birth chart
        birth_datetime = dt.combine(birth_date.date(), dt.strptime(birth_time, "%H:%M").time())
        
        chart_data = calculate_chart(birth_datetime, latitude, longitude)
        
        # Calculate Dasha periods using the class method directly
        moon_longitude = chart_data.get("planets", {}).get("moon", {}).get("longitude", 0)
        jd = chart_engine.calculate_julian_day(birth_datetime)
        dasha_periods = chart_engine.calculate_vimshottari_dasha(jd, moon_longitude)
        
        # Analyze house placements for life areas
        house_analysis = self._analyze_houses(chart_data)
        
        # Get current and future transits
        transits = self._calculate_transits(birth_date, current_age, prediction_years)
        
        return {
            "chart": chart_data,
            "dasha_periods": dasha_periods,
            "house_analysis": house_analysis,
            "transits": transits
        }
    
    def _get_numerology_predictions(
        self,
        birth_date: datetime,
        full_name: str,
        current_age: int,
        prediction_years: int
    ) -> Dict[str, Any]:
        """Get numerology predictions"""
        from app.services.numerology.engine import NumerologyEngine
        
        engine = NumerologyEngine()
        full_analysis = engine.calculate_full_analysis(
            full_name=full_name,
            birth_date=birth_date,
            system="pythagorean"
        )
        
        # Calculate personal years for past and future
        personal_years = self._calculate_personal_years(
            birth_date, current_age, prediction_years
        )
        
        return {
            "core_analysis": full_analysis,
            "personal_years": personal_years,
            "pinnacle_cycles": self._calculate_pinnacle_cycles(birth_date, current_age)
        }
    
    def _get_ai_pattern_predictions(
        self,
        astro_data: Dict[str, Any],
        numerology_data: Dict[str, Any],
        current_age: int
    ) -> Dict[str, Any]:
        """
        AI pattern matching engine
        Note: Simplified version - would use trained ML model in production
        """
        patterns = []
        
        # Analyze planetary patterns
        chart = astro_data.get("chart", {})
        planets = chart.get("planets", {})
        
        # Check for challenging aspects (simulated AI pattern detection)
        if self._has_saturn_transit(astro_data.get("transits", [])):
            patterns.append({
                "pattern": "saturn_return",
                "age_range": [28, 30],
                "event_type": "transformation",
                "description": "Major life restructuring period",
                "probability": 0.78
            })
        
        # Check numerology cycles
        life_path = numerology_data.get("core_analysis", {}).get("life_path", {}).get("number", 0)
        if life_path in [1, 8, 9]:
            patterns.append({
                "pattern": "leadership_emergence",
                "age_range": [current_age, current_age + 5],
                "event_type": "opportunity",
                "description": "Strong leadership opportunities",
                "probability": 0.72
            })
        
        return {"patterns": patterns, "confidence": 0.75}
    
    def _detect_past_events(
        self,
        astro_data: Dict[str, Any],
        numerology_data: Dict[str, Any],
        current_age: int
    ) -> List[Dict[str, Any]]:
        """
        Retrodiction Engine: Reconstruct past life events
        """
        past_events = []
        
        # Analyze Dasha periods for past
        dasha_periods = astro_data.get("dasha_periods", {})
        for period in dasha_periods.get("mahadasha", [])[:current_age]:
            event = self._interpret_dasha_period(period, is_past=True)
            if event:
                past_events.append(event)
        
        # Analyze past personal years
        personal_years = numerology_data.get("personal_years", [])
        for py in personal_years:
            if py["age"] < current_age:
                event = self._interpret_personal_year(py, is_past=True)
                if event:
                    past_events.append(event)
        
        # Sort by age
        past_events.sort(key=lambda x: x.get("age", 0))
        
        return past_events[:20]  # Return top 20 significant events
    
    def _predict_future_events(
        self,
        astro_data: Dict[str, Any],
        numerology_data: Dict[str, Any],
        ai_patterns: Dict[str, Any],
        current_age: int,
        prediction_years: int
    ) -> List[Dict[str, Any]]:
        """
        Future prediction engine using Transit + Dasha + Numerology + AI
        """
        future_events = []
        
        # Future Dasha periods
        dasha_periods = astro_data.get("dasha_periods", {})
        for period in dasha_periods.get("mahadasha", []):
            start_age = self._calculate_age_from_date(period.get("start_date", ""))
            if current_age <= start_age <= current_age + prediction_years:
                event = self._interpret_dasha_period(period, is_past=False)
                if event:
                    future_events.append(event)
        
        # Future personal years
        personal_years = numerology_data.get("personal_years", [])
        for py in personal_years:
            if current_age < py["age"] <= current_age + prediction_years:
                event = self._interpret_personal_year(py, is_past=False)
                if event:
                    future_events.append(event)
        
        # AI predicted patterns
        for pattern in ai_patterns.get("patterns", []):
            age_range = pattern.get("age_range", [])
            if age_range[0] >= current_age:
                future_events.append({
                    "age": age_range[0],
                    "year": datetime.now().year + (age_range[0] - current_age),
                    "category": EventCategory.SPIRITUAL.value,  # Changed from TRANSFORMATION
                    "event_type": pattern.get("event_type", "neutral"),
                    "title": pattern.get("pattern", "").replace("_", " ").title(),
                    "description": pattern.get("description", ""),
                    "probability": pattern.get("probability", 0.5),
                    "source": "AI Pattern Detection"
                })
        
        # Sort by age
        future_events.sort(key=lambda x: x.get("age", 999))
        
        return future_events[:30]  # Return top 30 predictions
    
    def _detect_risk_periods(
        self,
        combined_predictions: Dict[str, Any],
        current_age: int,
        prediction_years: int
    ) -> List[Dict[str, Any]]:
        """
        Risk Detection Engine: Health, accident-prone, emotional cycles
        """
        risk_periods = []
        
        # Health risk windows (simplified logic)
        for age in range(current_age, current_age + prediction_years):
            # Every 7-year cycle has transformation
            if age % 7 == 0:
                risk_periods.append({
                    "age": age,
                    "year": datetime.now().year + (age - current_age),
                    "risk_category": "health",
                    "risk_level": RiskLevel.MEDIUM.value,
                    "description": "Seven-year transformation cycle - monitor health closely",
                    "recommendations": [
                        "Schedule comprehensive health checkup",
                        "Review and update insurance",
                        "Focus on stress management"
                    ]
                })
            
            # Saturn transit (29-30 years)
            if age in [29, 30, 58, 59]:
                risk_periods.append({
                    "age": age,
                    "year": datetime.now().year + (age - current_age),
                    "risk_category": "emotional",
                    "risk_level": RiskLevel.HIGH.value,
                    "description": "Saturn Return - major life restructuring period",
                    "recommendations": [
                        "Be patient with delays and obstacles",
                        "Focus on building strong foundations",
                        "Avoid major commitments during peak intensity"
                    ]
                })
        
        return risk_periods[:15]
    
    def _analyze_life_cycles(
        self,
        numerology_data: Dict[str, Any],
        current_age: int,
        prediction_years: int
    ) -> Dict[str, Any]:
        """Analyze major life cycles"""
        return {
            "current_cycle": self._determine_current_cycle(current_age),
            "upcoming_transitions": self._find_cycle_transitions(current_age, prediction_years),
            "pinnacle_periods": numerology_data.get("pinnacle_cycles", [])
        }
    
    def _generate_personality_blueprint(
        self,
        astro_data: Dict[str, Any],
        numerology_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate comprehensive personality blueprint"""
        chart = astro_data.get("chart", {})
        core_analysis = numerology_data.get("core_analysis", {})
        
        # Get ascendant sign from degree (simplified - just use degree value for now)
        ascendant_degree = chart.get("ascendant", 0)
        ascendant_sign = self._degree_to_sign(ascendant_degree) if isinstance(ascendant_degree, (int, float)) else "Unknown"
        
        # Note: planets are lowercase and don't have "sign" field, only longitude
        # We'll calculate sign from longitude
        planets = chart.get("planets", {})
        sun_longitude = planets.get("sun", {}).get("longitude", 0)
        moon_longitude = planets.get("moon", {}).get("longitude", 0)
        
        return {
            "sun_sign": self._degree_to_sign(sun_longitude),
            "moon_sign": self._degree_to_sign(moon_longitude),
            "ascendant": ascendant_sign,
            "life_path_number": core_analysis.get("life_path", {}).get("number", 0),
            "expression_number": core_analysis.get("expression", {}).get("number", 0),
            "core_strengths": self._extract_strengths(chart, core_analysis),
            "key_challenges": self._extract_challenges(chart, core_analysis),
            "natural_talents": self._identify_talents(chart, core_analysis)
        }
    
    def _degree_to_sign(self, degree: float) -> str:
        """Convert zodiac degree to sign name"""
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
                "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        if not isinstance(degree, (int, float)):
            return "Unknown"
        # Normalize to 0-360
        degree = degree % 360
        sign_index = int(degree / 30)
        return signs[sign_index]
    
    # Helper methods
    
    def _combine_predictions(
        self,
        astro_data: Dict[str, Any],
        numerology_data: Dict[str, Any],
        ai_patterns: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Weighted combination of all prediction sources"""
        return {
            "astrology": astro_data,
            "numerology": numerology_data,
            "ai_patterns": ai_patterns,
            "combined_confidence": (
                self.accuracy_weights["astrology"] * 0.85 +
                self.accuracy_weights["numerology"] * 0.80 +
                self.accuracy_weights["ai_patterns"] * ai_patterns.get("confidence", 0.75)
            )
        }
    
    def _calculate_accuracy_score(self, combined_predictions: Dict[str, Any]) -> float:
        """Calculate overall prediction accuracy score"""
        confidence = combined_predictions.get("combined_confidence", 0.75)
        return round(confidence * 100, 2)
    
    def _analyze_houses(self, chart_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze 12 houses for life areas"""
        houses = chart_data.get("houses", [])
        analysis = {}
        
        house_meanings = {
            1: "Self, Personality, Physical Body",
            2: "Wealth, Family, Speech",
            3: "Siblings, Courage, Communication",
            4: "Mother, Home, Property",
            5: "Children, Creativity, Intelligence",
            6: "Health, Enemies, Service",
            7: "Partnership, Marriage, Business",
            8: "Longevity, Transformation, Occult",
            9: "Father, Fortune, Spirituality",
            10: "Career, Status, Authority",
            11: "Gains, Friends, Aspirations",
            12: "Loss, Expenses, Liberation"
        }
        
        for i in range(1, 13):
            house_cusp = houses[i-1] if i-1 < len(houses) else 0
            analysis[f"house_{i}"] = {
                "number": i,
                "meaning": house_meanings.get(i, ""),
                "cusp_degree": round(house_cusp, 2) if isinstance(house_cusp, (int, float)) else 0,
                "strength": "medium"  # Simplified
            }
        
        return analysis
    
    def _calculate_transits(
        self,
        birth_date: datetime,
        current_age: int,
        prediction_years: int
    ) -> List[Dict[str, Any]]:
        """Calculate planetary transits"""
        # Simplified - in production, calculate actual ephemeris transits
        return [
            {
                "planet": "Jupiter",
                "age": current_age + 1,
                "description": "Jupiter transit brings growth and expansion"
            },
            {
                "planet": "Saturn",
                "age": current_age + 3,
                "description": "Saturn transit brings discipline and structure"
            }
        ]
    
    def _calculate_personal_years(
        self,
        birth_date: datetime,
        current_age: int,
        prediction_years: int
    ) -> List[Dict[str, Any]]:
        """Calculate personal year cycles"""
        personal_years = []
        
        for offset in range(-current_age, prediction_years + 1):
            target_year = datetime.now().year + offset
            age = current_age + offset
            
            if age >= 0:
                # Calculate personal year number
                day_digit = self._reduce_to_single(birth_date.day)
                month_digit = self._reduce_to_single(birth_date.month)
                year_digit = self._reduce_to_single(target_year)
                py_number = self._reduce_to_single(day_digit + month_digit + year_digit)
                
                personal_years.append({
                    "age": age,
                    "year": target_year,
                    "personal_year_number": py_number,
                    "meaning": self._get_py_meaning(py_number)
                })
        
        return personal_years
    
    def _reduce_to_single(self, number: int) -> int:
        """Reduce number to single digit (except 11, 22, 33)"""
        while number > 9 and number not in [11, 22, 33]:
            number = sum(int(digit) for digit in str(number))
        return number
    
    def _get_py_meaning(self, number: int) -> str:
        """Get personal year meaning"""
        meanings = {
            1: "New beginnings and fresh starts",
            2: "Partnerships and cooperation",
            3: "Creativity and self-expression",
            4: "Building foundations and hard work",
            5: "Change and freedom",
            6: "Responsibility and harmony",
            7: "Introspection and spiritual growth",
            8: "Power and material success",
            9: "Completion and humanitarian efforts"
        }
        return meanings.get(number, "Transformative year")
    
    def _calculate_pinnacle_cycles(
        self,
        birth_date: datetime,
        current_age: int
    ) -> List[Dict[str, Any]]:
        """Calculate pinnacle cycles"""
        # Simplified pinnacle calculation
        return [
            {
                "cycle": 1,
                "age_range": [0, 35],
                "active": current_age < 35,
                "focus": "Foundation building and early development"
            },
            {
                "cycle": 2,
                "age_range": [36, 44],
                "active": 36 <= current_age <= 44,
                "focus": "Relationship and partnership focus"
            },
            {
                "cycle": 3,
                "age_range": [45, 53],
                "active": 45 <= current_age <= 53,
                "focus": "Creative expression and achievement"
            },
            {
                "cycle": 4,
                "age_range": [54, 100],
                "active": current_age >= 54,
                "focus": "Wisdom, legacy, and completion"
            }
        ]
    
    def _has_saturn_transit(self, transits: List[Dict[str, Any]]) -> bool:
        """Check if Saturn transit is present"""
        return any(t.get("planet") == "Saturn" for t in transits)
    
    def _interpret_dasha_period(
        self,
        period: Dict[str, Any],
        is_past: bool
    ) -> Optional[Dict[str, Any]]:
        """Interpret Dasha period for events"""
        planet = period.get("planet", "Unknown")
        start_date = period.get("start_date", "")
        
        # Planet-based event mapping
        planet_events = {
            "Sun": ("career", "Leadership opportunities and career advancement"),
            "Moon": ("emotional", "Emotional growth and family focus"),
            "Mars": ("action", "Dynamic action period, possible conflicts"),
            "Mercury": ("communication", "Learning, communication, business growth"),
            "Jupiter": ("expansion", "Growth, wisdom, spiritual advancement"),
            "Venus": ("relationships", "Love, creativity, artistic pursuits"),
            "Saturn": ("discipline", "Hard work, restructuring, delays"),
            "Rahu": ("transformation", "Unconventional changes, foreign connections"),
            "Ketu": ("spiritual", "Spiritual growth, detachment, introspection")
        }
        
        category, description = planet_events.get(planet, ("neutral", "General period"))
        
        age = self._calculate_age_from_date(start_date)
        if age is None:
            return None
        
        return {
            "age": age,
            "year": datetime.now().year - (datetime.now().year - age) if is_past else datetime.now().year + age,
            "category": category,
            "event_type": "neutral",
            "title": f"{planet} Mahadasha Period",
            "description": description,
            "source": "Vedic Dasha System"
        }
    
    def _interpret_personal_year(
        self,
        personal_year: Dict[str, Any],
        is_past: bool
    ) -> Optional[Dict[str, Any]]:
        """Interpret personal year for events"""
        py_number = personal_year.get("personal_year_number", 1)
        age = personal_year.get("age", 0)
        year = personal_year.get("year", datetime.now().year)
        
        # Personal year event mapping
        py_events = {
            1: ("new_beginnings", "opportunity", "New beginnings, fresh starts, initiative"),
            2: ("relationships", "neutral", "Cooperation, partnerships, patience"),
            3: ("creativity", "opportunity", "Creative expression, communication, joy"),
            4: ("foundation", "neutral", "Building foundations, hard work, stability"),
            5: ("change", "transformation", "Change, freedom, adventure, movement"),
            6: ("responsibility", "neutral", "Family, home, responsibility, service"),
            7: ("introspection", "neutral", "Spiritual growth, analysis, inner work"),
            8: ("power", "opportunity", "Achievement, power, financial gains"),
            9: ("completion", "transformation", "Endings, completion, humanitarian focus")
        }
        
        category, event_type, description = py_events.get(py_number, ("neutral", "neutral", "General year"))
        
        return {
            "age": age,
            "year": year,
            "category": category,
            "event_type": event_type,
            "title": f"Personal Year {py_number}",
            "description": description,
            "source": "Numerology Personal Year"
        }
    
    def _calculate_age_from_date(self, date_str: str) -> Optional[int]:
        """Calculate age from date string"""
        try:
            if not date_str:
                return None
            date = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
            today = datetime.now()
            age = today.year - date.year
            if today.month < date.month or (today.month == date.month and today.day < date.day):
                age -= 1
            return age
        except:
            return None
    
    def _determine_current_cycle(self, age: int) -> Dict[str, Any]:
        """Determine current life cycle"""
        if age < 28:
            return {"name": "Youth & Exploration", "phase": "building"}
        elif age < 56:
            return {"name": "Maturity & Achievement", "phase": "consolidating"}
        else:
            return {"name": "Wisdom & Legacy", "phase": "transcending"}
    
    def _find_cycle_transitions(self, age: int, years: int) -> List[Dict[str, Any]]:
        """Find upcoming cycle transitions"""
        transitions = []
        target_ages = [28, 36, 44, 52, 56, 63, 72]
        
        for target_age in target_ages:
            if age < target_age <= age + years:
                transitions.append({
                    "age": target_age,
                    "transition": f"Entering new life phase at {target_age}",
                    "significance": "Major life cycle transition"
                })
        
        return transitions
    
    def _extract_strengths(self, chart: Dict[str, Any], numerology: Dict[str, Any]) -> List[str]:
        """Extract core strengths from chart and numerology"""
        strengths = []
        
        # From numerology
        life_path = numerology.get("life_path", {})
        if life_path:
            strengths.append(life_path.get("meaning", "").split("-")[0].strip())
        
        # From astrology (simplified)
        strengths.extend([
            "Natural leadership abilities",
            "Strong intuition and insight",
            "Creative problem-solving skills"
        ])
        
        return strengths[:5]
    
    def _extract_challenges(self, chart: Dict[str, Any], numerology: Dict[str, Any]) -> List[str]:
        """Extract key challenges"""
        return [
            "Tendency to overthink situations",
            "Need for balance between logic and emotion",
            "Learning to trust the process"
        ]
    
    def _identify_talents(self, chart: Dict[str, Any], numerology: Dict[str, Any]) -> List[str]:
        """Identify natural talents"""
        return [
            "Communication and teaching",
            "Strategic thinking and planning",
            "Building meaningful relationships"
        ]


# Global instance
life_events_engine = LifeEventsEngine()
