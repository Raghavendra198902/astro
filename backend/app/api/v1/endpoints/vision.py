"""
Vision AI Endpoints
Face and palm reading
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import cv2
import numpy as np

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, BiometricReading
from app.schemas.schemas import BiometricReadingResponse
from app.services.vision.face_reading import FaceReadingEngine
from app.services.vision.palm_reading import PalmReadingEngine

router = APIRouter()
face_engine = FaceReadingEngine()
palm_engine = PalmReadingEngine()


@router.post("/face", response_model=BiometricReadingResponse)
async def analyze_face(
    file: UploadFile = File(...),
    user_consent: bool = True,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Analyze face from uploaded image"""
    if not user_consent:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User consent required for biometric analysis"
        )
    
    try:
        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image file"
            )
        
        # Analyze face
        analysis = face_engine.analyze_face(image, user_consent=True)
        
        if not analysis["face_detected"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No face detected in image"
            )
        
        # Save reading
        reading = BiometricReading(
            user_id=current_user.id,
            reading_type="face",
            analysis_data=analysis,
            user_consent=user_consent
        )
        
        db.add(reading)
        await db.commit()
        await db.refresh(reading)
        
        return reading
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Face analysis failed: {str(e)}"
        )


@router.post("/palm", response_model=BiometricReadingResponse)
async def analyze_palm(
    file: UploadFile = File(...),
    user_consent: bool = True,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Analyze palm from uploaded image"""
    if not user_consent:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User consent required for biometric analysis"
        )
    
    try:
        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image file"
            )
        
        # Analyze palm
        analysis = palm_engine.analyze_palm(image, user_consent=True)
        
        if not analysis["hand_detected"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No hand detected in image"
            )
        
        # Save reading
        reading = BiometricReading(
            user_id=current_user.id,
            reading_type="palm",
            analysis_data=analysis,
            user_consent=user_consent
        )
        
        db.add(reading)
        await db.commit()
        await db.refresh(reading)
        
        return reading
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Palm analysis failed: {str(e)}"
        )


@router.get("/{reading_id}", response_model=BiometricReadingResponse)
async def get_biometric_reading(
    reading_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get biometric reading by ID"""
    stmt = select(BiometricReading).where(
        BiometricReading.id == reading_id,
        BiometricReading.user_id == current_user.id
    )
    result = await db.execute(stmt)
    reading = result.scalars().first()
    
    if not reading:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reading not found"
        )
    
    return reading
