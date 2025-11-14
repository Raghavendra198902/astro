"""
AI Interpretation Engine
Orchestrates chart interpretation using LLM and RAG
"""

from typing import Dict, Any, List, Optional
import logging
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.ai.llm_client import get_llm_client
from app.services.ai.rag_engine import rag_engine
from app.services.ai.prompt_templates import get_prompt_template
from app.models.models import AIRun, Chart

logger = logging.getLogger(__name__)


class InterpretationEngine:
    """Main engine for generating astrological interpretations"""
    
    def __init__(self):
        self.llm_client = get_llm_client()
    
    async def interpret_natal_chart(
        self,
        db: AsyncSession,
        chart_data: Dict[str, Any],
        user_id: int,
        chart_id: int,
        use_rag: bool = True
    ) -> Dict[str, Any]:
        """
        Generate comprehensive natal chart interpretation
        
        Args:
            db: Database session
            chart_data: Complete chart data
            user_id: User ID for tracking
            chart_id: Chart ID for reference
            use_rag: Whether to use RAG for enhanced context
            
        Returns:
            Interpretation with sections and metadata
        """
        # Symbolize chart data for LLM
        symbolization = self._symbolize_chart(chart_data)
        
        # Get prompt template
        template = get_prompt_template("natal_interpretation")
        prompt = template.format(symbolization=symbolization)
        
        # Use RAG if enabled
        if use_rag:
            # Search for relevant context based on key features
            key_features = self._extract_key_features(chart_data)
            context_query = " ".join(key_features)
            
            rag_response = await rag_engine.generate_with_context(
                db,
                context_query,
                category="vedic_text",
                max_context_chunks=3
            )
            
            interpretation_text = rag_response["answer"]
            sources = rag_response["sources"]
            usage = rag_response["usage"]
        else:
            # Generate without RAG
            response = await self.llm_client.generate(
                prompt=prompt,
                system_prompt=get_prompt_template("system_astrologer"),
                temperature=0.7,
                max_tokens=2000
            )
            
            interpretation_text = response["text"]
            sources = []
            usage = response.get("usage", {})
        
        # Parse interpretation into sections
        sections = self._parse_interpretation(interpretation_text)
        
        # Calculate confidence score
        confidence = self._calculate_confidence(chart_data, sections)
        
        # Store AI run for tracking
        ai_run = AIRun(
            user_id=user_id,
            chart_id=chart_id,
            run_type="natal_interpretation",
            llm_provider=self.llm_client.model if hasattr(self.llm_client, 'model') else "unknown",
            prompt_tokens=usage.get("prompt_tokens", 0),
            completion_tokens=usage.get("completion_tokens", 0),
            total_cost=self._calculate_cost(usage),
            response_time_ms=0,  # Would need timing
            output_data={
                "interpretation": interpretation_text,
                "sections": sections,
                "sources": sources
            }
        )
        
        db.add(ai_run)
        await db.commit()
        
        logger.info(f"Generated natal interpretation for chart {chart_id}")
        
        return {
            "interpretation": interpretation_text,
            "sections": sections,
            "confidence_score": confidence,
            "sources": sources,
            "usage": usage,
            "ai_run_id": ai_run.id
        }
    
    async def interpret_transit(
        self,
        db: AsyncSession,
        natal_chart: Dict[str, Any],
        transit_data: Dict[str, Any],
        user_id: int
    ) -> Dict[str, Any]:
        """Generate transit interpretation"""
        
        # Symbolize both natal and transit
        symbolization = {
            "natal": self._symbolize_chart(natal_chart),
            "transit": self._symbolize_chart(transit_data),
            "aspects": self._calculate_transit_aspects(natal_chart, transit_data)
        }
        
        template = get_prompt_template("transit_interpretation")
        prompt = template.format(**symbolization)
        
        response = await self.llm_client.generate(
            prompt=prompt,
            system_prompt=get_prompt_template("system_astrologer"),
            temperature=0.7,
            max_tokens=1500
        )
        
        sections = self._parse_interpretation(response["text"])
        
        return {
            "interpretation": response["text"],
            "sections": sections,
            "usage": response.get("usage", {})
        }
    
    async def interpret_dasha_period(
        self,
        db: AsyncSession,
        chart_data: Dict[str, Any],
        dasha_data: Dict[str, Any],
        user_id: int
    ) -> Dict[str, Any]:
        """Generate dasha period interpretation"""
        
        current_maha = dasha_data.get("current_mahadasha")
        current_antar = dasha_data.get("current_antardasha")
        
        symbolization = {
            "chart": self._symbolize_chart(chart_data),
            "mahadasha": current_maha,
            "antardasha": current_antar,
            "balance_years": dasha_data.get("balance_years", 0)
        }
        
        template = get_prompt_template("dasha_interpretation")
        prompt = template.format(**symbolization)
        
        response = await self.llm_client.generate(
            prompt=prompt,
            system_prompt=get_prompt_template("system_astrologer"),
            temperature=0.7,
            max_tokens=1200
        )
        
        return {
            "interpretation": response["text"],
            "dasha_lord": current_maha,
            "antardasha_lord": current_antar,
            "usage": response.get("usage", {})
        }
    
    def _symbolize_chart(self, chart_data: Dict[str, Any]) -> str:
        """
        Convert chart data into symbolic text for LLM
        
        Extracts key features in natural language for better LLM understanding
        """
        planets = chart_data.get("planets", {})
        houses = chart_data.get("houses", [])
        ascendant = chart_data.get("ascendant", 0)
        
        symbols = []
        
        # Ascendant
        asc_sign = self._get_sign_name(int(ascendant / 30))
        symbols.append(f"Ascendant in {asc_sign}")
        
        # Planets
        for planet_name, planet_data in planets.items():
            if not planet_data:
                continue
            
            longitude = planet_data.get("longitude", 0)
            sign = self._get_sign_name(int(longitude / 30))
            house = self._get_house_number(longitude, houses)
            retrograde = planet_data.get("retrograde", False)
            
            retro_str = " (retrograde)" if retrograde else ""
            symbols.append(
                f"{planet_name.capitalize()} in {sign}, {house} house{retro_str}"
            )
        
        # Aspects
        aspects = chart_data.get("aspects", [])
        if aspects:
            symbols.append("\nKey Aspects:")
            for aspect in aspects[:5]:  # Top 5 aspects
                symbols.append(
                    f"{aspect['planet1']} {aspect['aspect']} {aspect['planet2']} "
                    f"(orb: {aspect['orb']}°)"
                )
        
        return "\n".join(symbols)
    
    def _extract_key_features(self, chart_data: Dict[str, Any]) -> List[str]:
        """Extract key features for RAG query"""
        features = []
        
        # Add ascendant sign
        ascendant = chart_data.get("ascendant", 0)
        asc_sign = self._get_sign_name(int(ascendant / 30))
        features.append(f"Ascendant {asc_sign}")
        
        # Add sun and moon signs
        planets = chart_data.get("planets", {})
        if planets.get("sun"):
            sun_sign = self._get_sign_name(
                int(planets["sun"]["longitude"] / 30)
            )
            features.append(f"Sun {sun_sign}")
        
        if planets.get("moon"):
            moon_sign = self._get_sign_name(
                int(planets["moon"]["longitude"] / 30)
            )
            features.append(f"Moon {moon_sign}")
            
            # Add moon nakshatra
            moon_nak = chart_data.get("moon_nakshatra")
            if moon_nak:
                features.append(f"nakshatra {moon_nak['name']}")
        
        # Add dasha if present
        dashas = chart_data.get("dashas", {})
        if dashas:
            maha = dashas.get("current_mahadasha")
            if maha:
                features.append(f"{maha} dasha")
        
        return features
    
    def _parse_interpretation(self, text: str) -> Dict[str, str]:
        """Parse interpretation text into sections"""
        sections = {}
        
        # Common section headers
        headers = [
            "Overview", "Personality", "Career", "Relationships",
            "Health", "Strengths", "Challenges", "Recommendations"
        ]
        
        current_section = "main"
        current_text = []
        
        for line in text.split("\n"):
            line = line.strip()
            if not line:
                continue
            
            # Check if line is a header
            is_header = False
            for header in headers:
                if line.lower().startswith(header.lower()):
                    # Save previous section
                    if current_text:
                        sections[current_section] = "\n".join(current_text)
                    
                    current_section = header.lower()
                    current_text = []
                    is_header = True
                    break
            
            if not is_header:
                current_text.append(line)
        
        # Save last section
        if current_text:
            sections[current_section] = "\n".join(current_text)
        
        return sections
    
    def _calculate_confidence(
        self,
        chart_data: Dict[str, Any],
        sections: Dict[str, str]
    ) -> float:
        """Calculate confidence score for interpretation"""
        score = 0.5  # Base score
        
        # More data = higher confidence
        if chart_data.get("planets"):
            score += 0.1
        if chart_data.get("aspects"):
            score += 0.1
        if chart_data.get("dashas"):
            score += 0.1
        
        # More detailed sections = higher confidence
        if len(sections) >= 5:
            score += 0.1
        
        # Cap at 0.95 (never 100% confident)
        return min(score, 0.95)
    
    def _calculate_cost(self, usage: Dict[str, int]) -> float:
        """Calculate cost based on token usage"""
        # OpenAI GPT-4 pricing (approximate)
        prompt_cost_per_1k = 0.03
        completion_cost_per_1k = 0.06
        
        prompt_tokens = usage.get("prompt_tokens", 0)
        completion_tokens = usage.get("completion_tokens", 0)
        
        cost = (
            (prompt_tokens / 1000) * prompt_cost_per_1k +
            (completion_tokens / 1000) * completion_cost_per_1k
        )
        
        return round(cost, 4)
    
    def _calculate_transit_aspects(
        self,
        natal: Dict[str, Any],
        transit: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Calculate aspects between natal and transit planets"""
        aspects = []
        
        natal_planets = natal.get("planets", {})
        transit_planets = transit.get("planets", {})
        
        for nat_name, nat_data in natal_planets.items():
            if not nat_data:
                continue
            
            for tr_name, tr_data in transit_planets.items():
                if not tr_data:
                    continue
                
                nat_long = nat_data["longitude"]
                tr_long = tr_data["longitude"]
                
                diff = abs(nat_long - tr_long)
                if diff > 180:
                    diff = 360 - diff
                
                # Check major aspects with 5° orb
                aspect_types = [
                    (0, "conjunction"), (60, "sextile"), (90, "square"),
                    (120, "trine"), (180, "opposition")
                ]
                
                for angle, asp_name in aspect_types:
                    orb = abs(diff - angle)
                    if orb <= 5:
                        aspects.append({
                            "natal_planet": nat_name,
                            "transit_planet": tr_name,
                            "aspect": asp_name,
                            "orb": round(orb, 2)
                        })
        
        return aspects
    
    def _get_sign_name(self, sign_num: int) -> str:
        """Get zodiac sign name"""
        signs = [
            "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Libra", "Scorpio", "Sagittarius", "Capricorn",
            "Aquarius", "Pisces"
        ]
        return signs[sign_num % 12]
    
    def _get_house_number(self, longitude: float, houses: List[float]) -> str:
        """Get house number for a longitude"""
        for i, cusp in enumerate(houses):
            next_cusp = houses[(i + 1) % 12]
            
            if cusp < next_cusp:
                if cusp <= longitude < next_cusp:
                    return self._ordinal(i + 1)
            else:  # Wraps around 360°
                if longitude >= cusp or longitude < next_cusp:
                    return self._ordinal(i + 1)
        
        return "1st"
    
    def _ordinal(self, n: int) -> str:
        """Convert number to ordinal (1st, 2nd, etc.)"""
        suffix = ["th", "st", "nd", "rd", "th"][min(n % 10, 4)]
        if 11 <= n % 100 <= 13:
            suffix = "th"
        return f"{n}{suffix}"


# Global interpretation engine instance
interpretation_engine = InterpretationEngine()
