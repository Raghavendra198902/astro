"""
Batch Processing API Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.batch.batch_processor import batch_processor

router = APIRouter()


class BulkChartRequest(BaseModel):
    """Request model for bulk chart generation"""
    items: List[Dict]
    priority: int = 5


class BulkPredictionRequest(BaseModel):
    """Request model for bulk predictions"""
    items: List[Dict]
    priority: int = 5


class ExportRequest(BaseModel):
    """Request model for data export"""
    export_type: str
    format: str = "json"
    filters: Dict = {}


@router.post("/bulk-charts")
async def create_bulk_charts_job(
    request: BulkChartRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create bulk chart generation job
    
    Body:
    {
        "items": [
            {
                "id": "user123",
                "birth_datetime": "1990-01-15T10:30:00",
                "latitude": 28.6139,
                "longitude": 77.2090,
                "system": "vedic"
            }
        ],
        "priority": 5
    }
    """
    job_id = await batch_processor.create_job(
        db=db,
        user_id=current_user.id,
        job_type="bulk_charts",
        input_data={"items": request.items},
        priority=request.priority
    )
    
    return {
        "job_id": job_id,
        "status": "pending",
        "total_items": len(request.items),
        "message": "Bulk chart generation job created"
    }


@router.post("/bulk-predictions")
async def create_bulk_predictions_job(
    request: BulkPredictionRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create bulk prediction generation job
    
    Body:
    {
        "items": [
            {
                "id": "pred123",
                "chart_data": {...},
                "question": "What about career?",
                "aspect": "career"
            }
        ],
        "priority": 5
    }
    """
    job_id = await batch_processor.create_job(
        db=db,
        user_id=current_user.id,
        job_type="bulk_predictions",
        input_data={"items": request.items},
        priority=request.priority
    )
    
    return {
        "job_id": job_id,
        "status": "pending",
        "total_items": len(request.items),
        "message": "Bulk prediction job created"
    }


@router.post("/export")
async def create_export_job(
    request: ExportRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create data export job
    
    Body:
    {
        "export_type": "charts" | "predictions" | "consultations",
        "format": "json" | "csv" | "xlsx",
        "filters": {...}
    }
    """
    job_id = await batch_processor.create_job(
        db=db,
        user_id=current_user.id,
        job_type="export_data",
        input_data={
            "export_type": request.export_type,
            "format": request.format,
            "filters": request.filters
        },
        priority=5
    )
    
    return {
        "job_id": job_id,
        "status": "pending",
        "message": f"Export job created for {request.export_type}"
    }


@router.get("/jobs/{job_id}")
async def get_job_status(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get status of a batch job"""
    status = await batch_processor.get_job_status(db, job_id)
    
    if not status:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return status


@router.delete("/jobs/{job_id}")
async def cancel_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Cancel a running batch job"""
    cancelled = await batch_processor.cancel_job(db, job_id)
    
    if not cancelled:
        raise HTTPException(
            status_code=400,
            detail="Job cannot be cancelled (not found or already completed)"
        )
    
    return {"job_id": job_id, "status": "cancelled"}


@router.get("/jobs")
async def list_user_jobs(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """List all batch jobs for current user"""
    from sqlalchemy import select
    from app.services.batch.batch_processor import BatchJob
    
    stmt = select(BatchJob).where(
        BatchJob.user_id == current_user.id
    ).order_by(
        BatchJob.created_at.desc()
    ).limit(limit)
    
    result = await db.execute(stmt)
    jobs = result.scalars().all()
    
    return {
        "jobs": [
            {
                "job_id": job.job_id,
                "job_type": job.job_type,
                "status": job.status,
                "progress_percent": job.progress_percent,
                "total_items": job.total_items,
                "processed_items": job.processed_items,
                "failed_items": job.failed_items,
                "created_at": job.created_at.isoformat(),
                "completed_at": job.completed_at.isoformat() if job.completed_at else None
            }
            for job in jobs
        ]
    }
