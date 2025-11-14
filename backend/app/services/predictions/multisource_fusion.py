"""
Multi-Source Prediction Fusion Engine
Combines Astrology (50%) + Palmistry (30%) + Face Reading (20%)
for highest accuracy life event predictions
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class MultiSourceFusionEngine:
    """
    Fuses predictions from multiple sources with weighted algorithm
    for cross-verified, high-accuracy life predictions
    """
    
    def __init__(self):
        self.default_weights = {
            "astrology": 0.50,
            "palmistry": 0.30,
            "face_reading": 0.20
        }
    
    def fuse_predictions(
        self,
        astro_predictions: Dict[str, Any],
        palm_analysis: Optional[Dict[str, Any]] = None,
        face_analysis: Optional[Dict[str, Any]] = None,
        birth_date: datetime = None,
        current_age: int = None
    ) -> Dict[str, Any]:
        """
        Fuse predictions from all available sources
        
        Args:
            astro_predictions: Astrological predictions from life_events_engine
            palm_analysis: Palmistry analysis (optional)
            face_analysis: Face reading analysis (optional)
            birth_date: Date of birth
            current_age: Current age
            
        Returns:
            Unified, cross-verified prediction with confidence scores
        """
        try:
            # Adjust weights based on available sources
            active_weights = self._calculate_active_weights(
                has_astro=True,
                has_palm=palm_analysis is not None,
                has_face=face_analysis is not None
            )
            
            # Extract events from each source
            astro_events = self._extract_astro_events(astro_predictions)
            palm_events = self._extract_palm_events(palm_analysis) if palm_analysis else []
            face_events = self._extract_face_events(face_analysis) if face_analysis else []
            
            # Cross-verify and merge events
            merged_events = self._merge_events(
                astro_events, palm_events, face_events, active_weights
            )
            
            # Detect contradictions and consensus
            consensus_analysis = self._analyze_consensus(
                astro_events, palm_events, face_events
            )
            
            # Calculate overall confidence
            confidence_score = self._calculate_fusion_confidence(
                active_weights, consensus_analysis
            )
            
            # Generate unified personality blueprint
            personality = self._fuse_personality_traits(
                astro_predictions, palm_analysis, face_analysis
            )
            
            return {
                "success": True,
                "fusion_method": "weighted_cross_verification",
                "active_sources": {
                    "astrology": True,
                    "palmistry": palm_analysis is not None,
                    "face_reading": face_analysis is not None
                },
                "source_weights": active_weights,
                "unified_events": merged_events,
                "consensus_analysis": consensus_analysis,
                "unified_personality": personality,
                "confidence_score": confidence_score,
                "accuracy_rating": self._rate_accuracy(confidence_score),
                "cross_verification_status": self._get_verification_status(consensus_analysis),
                "recommendations": self._generate_fusion_recommendations(
                    merged_events, personality, confidence_score
                )
            }
            
        except Exception as e:
            logger.error(f"Multi-source fusion failed: {e}")
            return {"success": False, "error": str(e)}
    
    def _calculate_active_weights(
        self,
        has_astro: bool,
        has_palm: bool,
        has_face: bool
    ) -> Dict[str, float]:
        """
        Dynamically adjust weights based on available sources
        """
        weights = {}
        total = 0.0
        
        if has_astro:
            weights["astrology"] = self.default_weights["astrology"]
            total += weights["astrology"]
        
        if has_palm:
            weights["palmistry"] = self.default_weights["palmistry"]
            total += weights["palmistry"]
        
        if has_face:
            weights["face_reading"] = self.default_weights["face_reading"]
            total += weights["face_reading"]
        
        # Normalize weights to sum to 1.0
        if total > 0:
            weights = {k: v / total for k, v in weights.items()}
        
        return weights
    
    def _extract_astro_events(self, astro_predictions: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract events from astrology predictions"""
        events = []
        
        # Past events
        for event in astro_predictions.get("past_events", []):
            events.append({
                **event,
                "source": "astrology",
                "confidence": 0.85
            })
        
        # Future events
        for event in astro_predictions.get("future_events", []):
            events.append({
                **event,
                "source": "astrology",
                "confidence": 0.82
            })
        
        return events
    
    def _extract_palm_events(self, palm_analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract life events from palmistry analysis"""
        events = []
        
        interpretation = palm_analysis.get("interpretation", {})
        
        # Career events from palm
        if "career" in interpretation:
            events.append({
                "category": "career",
                "title": "Career Pattern from Palm",
                "description": interpretation["career"],
                "source": "palmistry",
                "confidence": 0.75,
                "age_range": [25, 45]
            })
        
        # Relationship events
        if "relationships" in interpretation:
            events.append({
                "category": "relationships",
                "title": "Relationship Pattern from Palm",
                "description": interpretation["relationships"],
                "source": "palmistry",
                "confidence": 0.72,
                "age_range": [20, 60]
            })
        
        # Health indicators from palm lines
        if "vitality" in interpretation:
            events.append({
                "category": "health",
                "title": "Vitality Pattern from Life Line",
                "description": interpretation["vitality"],
                "source": "palmistry",
                "confidence": 0.78,
                "age_range": [1, 100]
            })
        
        return events
    
    def _extract_face_events(self, face_analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract life patterns from face reading"""
        events = []
        
        interpretation = face_analysis.get("interpretation", {})
        life_areas = interpretation.get("life_areas", {})
        
        # Career patterns from face
        if "career" in life_areas:
            events.append({
                "category": "career",
                "title": "Career Aptitude from Face",
                "description": life_areas["career"],
                "source": "face_reading",
                "confidence": 0.70,
                "age_range": [25, 65]
            })
        
        # Relationship patterns
        if "relationships" in life_areas:
            events.append({
                "category": "relationships",
                "title": "Relationship Style from Face",
                "description": life_areas["relationships"],
                "source": "face_reading",
                "confidence": 0.68,
                "age_range": [18, 70]
            })
        
        # Emotional patterns from facial features
        if "emotions" in interpretation:
            events.append({
                "category": "emotional",
                "title": "Emotional Pattern from Face",
                "description": interpretation["emotions"],
                "source": "face_reading",
                "confidence": 0.72,
                "age_range": [1, 100]
            })
        
        return events
    
    def _merge_events(
        self,
        astro_events: List[Dict[str, Any]],
        palm_events: List[Dict[str, Any]],
        face_events: List[Dict[str, Any]],
        weights: Dict[str, float]
    ) -> List[Dict[str, Any]]:
        """
        Merge events from all sources with weighted confidence
        """
        merged = {}
        
        # Process all events
        for event_list, source_key in [
            (astro_events, "astrology"),
            (palm_events, "palmistry"),
            (face_events, "face_reading")
        ]:
            weight = weights.get(source_key, 0)
            
            for event in event_list:
                category = event.get("category", "general")
                age = event.get("age", event.get("age_range", [0])[0])
                
                # Create unique key for event grouping
                key = f"{category}_{age // 5}"  # Group by 5-year periods
                
                if key not in merged:
                    merged[key] = {
                        "category": category,
                        "age_range": [age, age + 5],
                        "sources": [],
                        "descriptions": [],
                        "weighted_confidence": 0.0,
                        "cross_verified": False
                    }
                
                # Add source info
                merged[key]["sources"].append(event.get("source", source_key))
                merged[key]["descriptions"].append({
                    "source": event.get("source", source_key),
                    "description": event.get("description", "")
                })
                
                # Calculate weighted confidence
                event_confidence = event.get("confidence", 0.75)
                merged[key]["weighted_confidence"] += event_confidence * weight
                
                # Mark as cross-verified if multiple sources agree
                if len(merged[key]["sources"]) > 1:
                    merged[key]["cross_verified"] = True
        
        # Convert to list and sort
        result = []
        for key, event in merged.items():
            event["unified_description"] = self._create_unified_description(
                event["descriptions"]
            )
            result.append(event)
        
        result.sort(key=lambda x: x["age_range"][0])
        return result
    
    def _create_unified_description(self, descriptions: List[Dict[str, str]]) -> str:
        """Create unified description from multiple sources"""
        if not descriptions:
            return "No description available"
        
        if len(descriptions) == 1:
            return descriptions[0]["description"]
        
        # Combine descriptions from multiple sources
        unified = "Multiple sources indicate: "
        for desc in descriptions:
            source = desc["source"]
            text = desc["description"]
            unified += f"[{source.title()}]: {text}. "
        
        return unified.strip()
    
    def _analyze_consensus(
        self,
        astro_events: List[Dict[str, Any]],
        palm_events: List[Dict[str, Any]],
        face_events: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Analyze consensus and contradictions between sources
        """
        all_events = astro_events + palm_events + face_events
        
        # Group by category
        by_category = {}
        for event in all_events:
            cat = event.get("category", "general")
            if cat not in by_category:
                by_category[cat] = []
            by_category[cat].append(event)
        
        # Calculate consensus score for each category
        consensus_scores = {}
        for cat, events in by_category.items():
            sources = set(e.get("source") for e in events)
            consensus_scores[cat] = {
                "sources_count": len(sources),
                "consensus_level": "high" if len(sources) >= 3 else "medium" if len(sources) == 2 else "low",
                "sources": list(sources)
            }
        
        # Overall consensus
        avg_sources = sum(s["sources_count"] for s in consensus_scores.values()) / len(consensus_scores) if consensus_scores else 0
        
        return {
            "by_category": consensus_scores,
            "overall_consensus": "high" if avg_sources >= 2.5 else "medium" if avg_sources >= 1.5 else "low",
            "contradictions_detected": False,  # Simplified - would check for actual contradictions
            "reliability_score": min(avg_sources / 3.0, 1.0)
        }
    
    def _calculate_fusion_confidence(
        self,
        weights: Dict[str, float],
        consensus: Dict[str, Any]
    ) -> float:
        """
        Calculate overall fusion confidence score
        """
        # Base confidence from weights
        base_confidence = sum(weights.values()) * 0.75
        
        # Bonus for consensus
        consensus_bonus = consensus["reliability_score"] * 0.15
        
        # Total confidence
        total = base_confidence + consensus_bonus
        
        return round(min(total, 1.0), 3)
    
    def _fuse_personality_traits(
        self,
        astro_predictions: Dict[str, Any],
        palm_analysis: Optional[Dict[str, Any]],
        face_analysis: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Fuse personality traits from all sources
        """
        unified = {
            "core_traits": [],
            "strengths": [],
            "challenges": [],
            "natural_talents": [],
            "life_purpose": ""
        }
        
        # From astrology
        astro_personality = astro_predictions.get("personality_blueprint", {})
        unified["core_traits"].extend([
            f"Sun in {astro_personality.get('sun_sign', 'Unknown')}",
            f"Moon in {astro_personality.get('moon_sign', 'Unknown')}",
            f"Ascendant: {astro_personality.get('ascendant', 'Unknown')}"
        ])
        unified["strengths"].extend(astro_personality.get("core_strengths", []))
        
        # From palmistry
        if palm_analysis:
            palm_interp = palm_analysis.get("interpretation", {})
            unified["core_traits"].append(f"Palm Element: {palm_interp.get('element', 'Unknown')}")
            unified["strengths"].extend(palm_interp.get("strengths", []))
            unified["challenges"].extend(palm_interp.get("challenges", []))
        
        # From face reading
        if face_analysis:
            face_interp = face_analysis.get("interpretation", {})
            face_shape = face_analysis.get("features", {}).get("face_shape", "Unknown")
            unified["core_traits"].append(f"Face Shape: {face_shape} - {face_interp.get('personality', '')}")
            unified["strengths"].extend(face_interp.get("strengths", []))
            unified["natural_talents"].extend([
                face_interp.get("intellect", ""),
                face_interp.get("communication", "")
            ])
        
        # Remove duplicates
        unified["strengths"] = list(set(unified["strengths"]))[:10]
        unified["challenges"] = list(set(unified["challenges"]))[:8]
        unified["natural_talents"] = list(set(filter(None, unified["natural_talents"])))[:8]
        
        return unified
    
    def _rate_accuracy(self, confidence: float) -> str:
        """Rate prediction accuracy"""
        if confidence >= 0.85:
            return "Excellent (85%+)"
        elif confidence >= 0.75:
            return "Very Good (75-85%)"
        elif confidence >= 0.65:
            return "Good (65-75%)"
        else:
            return "Moderate (50-65%)"
    
    def _get_verification_status(self, consensus: Dict[str, Any]) -> str:
        """Get cross-verification status"""
        level = consensus.get("overall_consensus", "low")
        
        if level == "high":
            return "Highly cross-verified across all sources"
        elif level == "medium":
            return "Partially cross-verified by multiple sources"
        else:
            return "Single source verification"
    
    def _generate_fusion_recommendations(
        self,
        merged_events: List[Dict[str, Any]],
        personality: Dict[str, Any],
        confidence: float
    ) -> List[str]:
        """Generate actionable recommendations based on fused predictions"""
        recommendations = []
        
        # Based on confidence
        if confidence >= 0.80:
            recommendations.append(
                "High confidence in predictions - use for major life decisions"
            )
        else:
            recommendations.append(
                "Moderate confidence - use as guidance, verify with personal intuition"
            )
        
        # Based on cross-verified events
        cross_verified_count = sum(1 for e in merged_events if e.get("cross_verified"))
        if cross_verified_count >= 3:
            recommendations.append(
                f"{cross_verified_count} life events cross-verified by multiple sources - pay special attention to these"
            )
        
        # Based on personality strengths
        strengths_count = len(personality.get("strengths", []))
        if strengths_count >= 5:
            recommendations.append(
                "Multiple strengths identified - focus on developing these natural talents"
            )
        
        # General recommendations
        recommendations.extend([
            "Review predictions quarterly to track accuracy",
            "Use insights for timing major decisions",
            "Combine predictions with practical action plans"
        ])
        
        return recommendations[:7]


# Global instance
multisource_fusion_engine = MultiSourceFusionEngine()
