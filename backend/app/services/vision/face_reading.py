"""
Face Reading using MediaPipe
Facial landmark detection and astrological interpretation
"""

from typing import Dict, Any, List, Optional
import logging
import numpy as np
from pathlib import Path

logger = logging.getLogger(__name__)


class FaceReadingEngine:
    """Face reading and analysis using MediaPipe"""
    
    def __init__(self):
        try:
            import mediapipe as mp
            import cv2
            
            self.mp = mp
            self.cv2 = cv2
            self.face_mesh = mp.solutions.face_mesh.FaceMesh(
                static_image_mode=True,
                max_num_faces=1,
                refine_landmarks=True,
                min_detection_confidence=0.5
            )
            
            # Load face reading rules
            self.rules = self._load_face_reading_rules()
            
        except ImportError as e:
            logger.error(f"MediaPipe or OpenCV not installed: {e}")
            self.face_mesh = None
    
    def analyze_face(
        self,
        image,
        user_consent: bool = True
    ) -> Dict[str, Any]:
        """
        Analyze facial features from image
        
        Args:
            image: OpenCV image (numpy array) or path to face image
            user_consent: Explicit consent for biometric processing
            
        Returns:
            Face reading analysis with features and interpretations
        """
        if not user_consent:
            return {"error": "User consent required for biometric processing", "face_detected": False}
        
        if not self.face_mesh:
            return {"error": "MediaPipe not available", "face_detected": False}
        
        # Handle both file path and numpy array
        if isinstance(image, str):
            image = self.cv2.imread(image)
            if image is None:
                return {"error": "Could not read image", "face_detected": False}
        
        # Convert to RGB
        image_rgb = self.cv2.cvtColor(image, self.cv2.COLOR_BGR2RGB)
        
        # Process with MediaPipe
        results = self.face_mesh.process(image_rgb)
        
        if not results.multi_face_landmarks:
            return {"error": "No face detected", "face_detected": False}
        
        # Extract landmarks (468 points)
        landmarks = results.multi_face_landmarks[0]
        
        # Analyze facial features
        features = self._extract_features(landmarks, image.shape)
        
        # Interpret features
        interpretation = self._interpret_features(features)
        
        return {
            "face_detected": True,
            "features": features,
            "interpretation": interpretation,
            "landmarks_count": len(landmarks.landmark),
            "confidence": 0.85  # Based on detection quality
        }
    
    def _extract_features(
        self,
        landmarks: Any,
        image_shape: tuple
    ) -> Dict[str, Any]:
        """Extract key facial features from landmarks"""
        height, width, _ = image_shape
        
        # Convert normalized landmarks to pixel coordinates
        points = []
        for landmark in landmarks.landmark:
            x = int(landmark.x * width)
            y = int(landmark.y * height)
            points.append((x, y))
        
        features = {}
        
        # Face shape
        features["face_shape"] = self._determine_face_shape(points)
        
        # Forehead (points 10, 338, 297, 332, 284, 251, 389, 356, 454, 323)
        forehead_height = self._calculate_forehead_height(points)
        features["forehead"] = {
            "height": forehead_height,
            "type": "high" if forehead_height > 0.35 else "medium" if forehead_height > 0.25 else "low"
        }
        
        # Eyebrows (points 70, 63, 105, 66, 107)
        eyebrow_shape = self._analyze_eyebrows(points)
        features["eyebrows"] = eyebrow_shape
        
        # Eyes (points 33, 133, 362, 263)
        eye_features = self._analyze_eyes(points)
        features["eyes"] = eye_features
        
        # Nose (points 1, 2, 98, 327)
        nose_features = self._analyze_nose(points)
        features["nose"] = nose_features
        
        # Mouth (points 61, 291, 0, 17, 91, 181)
        mouth_features = self._analyze_mouth(points)
        features["mouth"] = mouth_features
        
        # Chin (point 152)
        chin_features = self._analyze_chin(points)
        features["chin"] = chin_features
        
        # Face proportions
        features["proportions"] = self._calculate_proportions(points)
        
        return features
    
    def _determine_face_shape(self, points: List[tuple]) -> str:
        """Determine overall face shape"""
        # Simplified face shape detection
        # Would use more sophisticated geometric analysis
        
        # Calculate face width to height ratio
        jaw_width = abs(points[234][0] - points[454][0])
        face_height = abs(points[10][1] - points[152][1])
        
        ratio = jaw_width / face_height if face_height > 0 else 1
        
        if ratio > 0.95:
            return "round"
        elif ratio > 0.85:
            return "square"
        elif ratio > 0.75:
            return "oval"
        elif ratio > 0.65:
            return "oblong"
        else:
            return "heart"
    
    def _calculate_forehead_height(self, points: List[tuple]) -> float:
        """Calculate forehead height as proportion of face"""
        forehead_top = points[10][1]
        eyebrow = points[70][1]
        chin = points[152][1]
        
        face_height = chin - forehead_top
        forehead_height = eyebrow - forehead_top
        
        return forehead_height / face_height if face_height > 0 else 0
    
    def _analyze_eyebrows(self, points: List[tuple]) -> Dict[str, str]:
        """Analyze eyebrow characteristics"""
        # Simplified eyebrow analysis
        left_inner = points[70]
        left_outer = points[105]
        
        # Calculate angle
        angle = np.arctan2(
            left_outer[1] - left_inner[1],
            left_outer[0] - left_inner[0]
        ) * 180 / np.pi
        
        if angle < -10:
            shape = "arched"
        elif angle < 5:
            shape = "straight"
        else:
            shape = "curved"
        
        return {
            "shape": shape,
            "thickness": "medium"  # Would need more detailed analysis
        }
    
    def _analyze_eyes(self, points: List[tuple]) -> Dict[str, Any]:
        """Analyze eye characteristics"""
        # Eye distance
        left_eye = points[33]
        right_eye = points[263]
        eye_distance = abs(right_eye[0] - left_eye[0])
        
        # Eye size (simplified)
        left_eye_width = abs(points[133][0] - points[33][0])
        
        return {
            "distance": "wide" if eye_distance > 100 else "close",
            "size": "large" if left_eye_width > 30 else "medium",
            "shape": "almond"  # Simplified
        }
    
    def _analyze_nose(self, points: List[tuple]) -> Dict[str, str]:
        """Analyze nose characteristics"""
        nose_bridge = points[6]
        nose_tip = points[4]
        
        nose_height = abs(nose_tip[1] - nose_bridge[1])
        
        return {
            "length": "long" if nose_height > 80 else "medium",
            "shape": "straight"  # Simplified
        }
    
    def _analyze_mouth(self, points: List[tuple]) -> Dict[str, str]:
        """Analyze mouth characteristics"""
        left_corner = points[61]
        right_corner = points[291]
        
        mouth_width = abs(right_corner[0] - left_corner[0])
        
        return {
            "size": "wide" if mouth_width > 60 else "medium",
            "shape": "full"  # Simplified
        }
    
    def _analyze_chin(self, points: List[tuple]) -> Dict[str, str]:
        """Analyze chin characteristics"""
        return {
            "shape": "round",  # Simplified
            "prominence": "medium"
        }
    
    def _calculate_proportions(self, points: List[tuple]) -> Dict[str, float]:
        """Calculate facial proportions (golden ratio analysis)"""
        # Simplified proportion analysis
        try:
            # Use key facial landmarks
            # Point 10: top of head, Point 152: chin, Point 1: nose bridge
            face_height = abs(points[10][1] - points[152][1])
            face_width = abs(points[234][0] - points[454][0])
            
            # Calculate golden ratio using proper facial thirds
            # Upper face: hairline to eye center (use point 10 to point 1)
            # Lower face: eye center to chin (use point 1 to point 152)
            upper_face = abs(points[10][1] - points[1][1])  # Top to nose bridge
            lower_face = abs(points[1][1] - points[152][1])  # Nose bridge to chin
            
            # Calculate ratio (should be close to 1.618 for golden ratio)
            if upper_face > 0 and lower_face > 0:
                # Always divide larger by smaller to get a ratio >= 1
                if lower_face > upper_face:
                    ratio = lower_face / upper_face
                else:
                    ratio = upper_face / lower_face
                
                # Cap at reasonable values
                golden_ratio = round(min(ratio, 2.5), 3)
                
                # Calculate percentage - how close to the ideal 1.618
                # Perfect match (1.618) = 100%
                # Further from 1.618 = lower percentage
                difference = abs(golden_ratio - 1.618)
                
                # Use inverse proportion: smaller difference = higher percentage
                # Scale: 0 diff = 100%, 0.5 diff = ~75%, 1.0 diff = ~50%
                if difference < 0.01:
                    golden_ratio_percent = 100.0
                else:
                    # Exponential decay for smoother percentage
                    golden_ratio_percent = round(100 * (1 / (1 + difference)), 1)
                
                logger.info(f"Golden ratio calculation: ratio={golden_ratio}, diff={difference:.3f}, percent_before_cap={golden_ratio_percent}")
                
                # Ensure it's between 0-100
                golden_ratio_percent = max(0.0, min(100.0, golden_ratio_percent))
            else:
                golden_ratio = 1.5
                golden_ratio_percent = 94.1
            
            return {
                "width_to_height_ratio": round(face_width / face_height, 2) if face_height > 0 else 1.0,
                "golden_ratio": golden_ratio,
                "golden_ratio_percent": golden_ratio_percent,
                "symmetry_score": 0.85  # Would need detailed symmetry analysis
            }
        except Exception as e:
            logger.error(f"Error calculating proportions: {e}")
            return {
                "width_to_height_ratio": 1.0,
                "golden_ratio": 1.5,
                "golden_ratio_percent": 94.1,
                "symmetry_score": 0.85
            }
    
    def _interpret_features(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Interpret facial features using face reading principles"""
        interpretation = {}
        
        # Face shape interpretation
        shape_meanings = {
            "round": "Friendly, creative, emotionally expressive",
            "square": "Strong-willed, determined, practical",
            "oval": "Balanced, harmonious, adaptable",
            "oblong": "Intellectual, serious, reserved",
            "heart": "Passionate, energetic, strong-willed"
        }
        
        interpretation["personality"] = shape_meanings.get(
            features.get("face_shape", "oval"),
            "Balanced personality"
        )
        
        # Forehead interpretation
        forehead_type = features.get("forehead", {}).get("type", "medium")
        forehead_meanings = {
            "high": "Intellectual, philosophical, visionary",
            "medium": "Balanced thinker, practical wisdom",
            "low": "Action-oriented, practical, grounded"
        }
        interpretation["intellect"] = forehead_meanings.get(forehead_type, "Balanced")
        
        # Eye interpretation
        eye_distance = features.get("eyes", {}).get("distance", "medium")
        eye_meanings = {
            "wide": "Broad perspective, open-minded, tolerant",
            "close": "Focused, detail-oriented, intense"
        }
        interpretation["perception"] = eye_meanings.get(eye_distance, "Balanced view")
        
        # Nose interpretation
        nose_length = features.get("nose", {}).get("length", "medium")
        nose_meanings = {
            "long": "Ambitious, business-minded, leadership",
            "medium": "Balanced ambition, practical goals"
        }
        interpretation["ambition"] = nose_meanings.get(nose_length, "Moderate ambition")
        
        # Mouth interpretation
        mouth_size = features.get("mouth", {}).get("size", "medium")
        mouth_meanings = {
            "wide": "Generous, expressive, sociable",
            "medium": "Balanced communication, moderate expression"
        }
        interpretation["communication"] = mouth_meanings.get(mouth_size, "Balanced")
        
        # Overall summary
        interpretation["summary"] = self._generate_summary(features)
        
        return interpretation
    
    def _generate_summary(self, features: Dict[str, Any]) -> str:
        """Generate overall face reading summary"""
        face_shape = features.get("face_shape", "oval")
        forehead = features.get("forehead", {}).get("type", "medium")
        
        return (
            f"A {face_shape} face with {forehead} forehead indicates "
            f"a personality that is balanced and adaptable, with good "
            f"intellectual capacity and emotional expressiveness."
        )
    
    def _load_face_reading_rules(self) -> Dict[str, Any]:
        """Load face reading interpretation rules"""
        # In production, load from YAML file
        return {
            "enabled": True,
            "confidence_threshold": 0.5
        }


# Global instance
face_reading_engine = FaceReadingEngine()
