"""
Enterprise Batch Processing System
Handles bulk chart generation, data exports, and scheduled tasks
"""
from typing import List, Dict, Any, Optional
from datetime import datetime
import asyncio
import uuid
from enum import Enum
from sqlalchemy import Column, Integer, String, DateTime, JSON, Float, Index
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import Base
import logging

logger = logging.getLogger(__name__)


class BatchJobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class BatchJob(Base):
    """Track batch processing jobs"""
    __tablename__ = "batch_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String(100), unique=True, nullable=False, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    
    # Job details
    job_type = Column(String(50), nullable=False)  # bulk_charts, export, report, etc.
    status = Column(String(20), default=BatchJobStatus.PENDING, index=True)
    priority = Column(Integer, default=5)  # 1-10, higher = more priority
    
    # Progress tracking
    total_items = Column(Integer, default=0)
    processed_items = Column(Integer, default=0)
    failed_items = Column(Integer, default=0)
    progress_percent = Column(Float, default=0.0)
    
    # Input/Output
    input_data = Column(JSON)
    result_data = Column(JSON)
    error_message = Column(String(1000))
    
    # Timing
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    estimated_completion_at = Column(DateTime)
    
    # Resource tracking
    execution_time_seconds = Column(Float)
    memory_usage_mb = Column(Float)
    
    __table_args__ = (
        Index('idx_batch_user_status', 'user_id', 'status'),
        Index('idx_batch_created', 'created_at'),
    )


class BatchProcessor:
    """Process batch jobs asynchronously"""
    
    def __init__(self):
        self.max_concurrent_jobs = 5
        self.running_jobs: Dict[str, asyncio.Task] = {}
    
    async def create_job(
        self,
        db: AsyncSession,
        user_id: int,
        job_type: str,
        input_data: Dict,
        priority: int = 5
    ) -> str:
        """Create a new batch job"""
        job_id = str(uuid.uuid4())
        
        job = BatchJob(
            job_id=job_id,
            user_id=user_id,
            job_type=job_type,
            status=BatchJobStatus.PENDING,
            priority=priority,
            input_data=input_data,
            total_items=len(input_data.get("items", []))
        )
        
        db.add(job)
        await db.commit()
        await db.refresh(job)
        
        logger.info(f"Created batch job {job_id} for user {user_id}")
        
        # Start processing if capacity available
        if len(self.running_jobs) < self.max_concurrent_jobs:
            asyncio.create_task(self.process_job(job_id))
        
        return job_id
    
    async def process_job(self, job_id: str):
        """Process a batch job"""
        from app.core.database import async_session_maker
        
        async with async_session_maker() as db:
            try:
                # Get job
                from sqlalchemy import select
                stmt = select(BatchJob).where(BatchJob.job_id == job_id)
                result = await db.execute(stmt)
                job = result.scalars().first()
                
                if not job:
                    logger.error(f"Job {job_id} not found")
                    return
                
                # Update status to running
                job.status = BatchJobStatus.RUNNING
                job.started_at = datetime.utcnow()
                await db.commit()
                
                logger.info(f"Processing batch job {job_id} - {job.job_type}")
                
                # Process based on job type
                if job.job_type == "bulk_charts":
                    await self._process_bulk_charts(db, job)
                elif job.job_type == "bulk_predictions":
                    await self._process_bulk_predictions(db, job)
                elif job.job_type == "export_data":
                    await self._process_export(db, job)
                elif job.job_type == "generate_reports":
                    await self._process_reports(db, job)
                else:
                    raise ValueError(f"Unknown job type: {job.job_type}")
                
                # Mark as completed
                job.status = BatchJobStatus.COMPLETED
                job.completed_at = datetime.utcnow()
                job.progress_percent = 100.0
                job.execution_time_seconds = (
                    job.completed_at - job.started_at
                ).total_seconds()
                
                await db.commit()
                
                logger.info(f"Batch job {job_id} completed successfully")
                
            except Exception as e:
                logger.error(f"Error processing job {job_id}: {e}")
                
                # Mark as failed
                job.status = BatchJobStatus.FAILED
                job.error_message = str(e)
                job.completed_at = datetime.utcnow()
                await db.commit()
            
            finally:
                # Remove from running jobs
                if job_id in self.running_jobs:
                    del self.running_jobs[job_id]
    
    async def _process_bulk_charts(self, db: AsyncSession, job: BatchJob):
        """Process bulk chart generation"""
        from app.services.chart.engine import calculate_chart
        
        items = job.input_data.get("items", [])
        results = []
        
        for idx, item in enumerate(items):
            try:
                # Generate chart
                chart_data = calculate_chart(
                    datetime.fromisoformat(item["birth_datetime"]),
                    latitude=item["latitude"],
                    longitude=item["longitude"],
                    system=item.get("system", "vedic")
                )
                
                results.append({
                    "id": item.get("id"),
                    "status": "success",
                    "data": chart_data
                })
                
                job.processed_items += 1
                
            except Exception as e:
                logger.error(f"Error processing chart {idx}: {e}")
                results.append({
                    "id": item.get("id"),
                    "status": "error",
                    "error": str(e)
                })
                job.failed_items += 1
            
            # Update progress
            job.progress_percent = (idx + 1) / len(items) * 100
            await db.commit()
            
            # Small delay to prevent overwhelming the system
            await asyncio.sleep(0.1)
        
        job.result_data = {"results": results}
    
    async def _process_bulk_predictions(self, db: AsyncSession, job: BatchJob):
        """Process bulk AI predictions"""
        from app.services.ai.interpretation_engine import InterpretationEngine
        
        engine = InterpretationEngine()
        items = job.input_data.get("items", [])
        results = []
        
        for idx, item in enumerate(items):
            try:
                # Generate prediction
                prediction = await engine.generate_interpretation(
                    chart_data=item["chart_data"],
                    question=item.get("question"),
                    aspect=item.get("aspect")
                )
                
                results.append({
                    "id": item.get("id"),
                    "status": "success",
                    "prediction": prediction
                })
                
                job.processed_items += 1
                
            except Exception as e:
                logger.error(f"Error processing prediction {idx}: {e}")
                results.append({
                    "id": item.get("id"),
                    "status": "error",
                    "error": str(e)
                })
                job.failed_items += 1
            
            # Update progress
            job.progress_percent = (idx + 1) / len(items) * 100
            await db.commit()
            
            await asyncio.sleep(0.2)
        
        job.result_data = {"results": results}
    
    async def _process_export(self, db: AsyncSession, job: BatchJob):
        """Process data export"""
        export_type = job.input_data.get("export_type")
        format_type = job.input_data.get("format", "json")
        
        # Implement export logic based on type
        logger.info(f"Processing export: {export_type} in {format_type} format")
        
        job.processed_items = 1
        job.result_data = {
            "export_url": f"/api/v1/exports/{job.job_id}.{format_type}",
            "format": format_type
        }
    
    async def _process_reports(self, db: AsyncSession, job: BatchJob):
        """Process report generation"""
        from app.services.reports.pdf_generator import generate_comprehensive_report
        
        items = job.input_data.get("items", [])
        results = []
        
        for idx, item in enumerate(items):
            try:
                # Generate report
                report_path = await generate_comprehensive_report(
                    user_id=job.user_id,
                    chart_data=item["chart_data"],
                    report_type=item.get("report_type", "full")
                )
                
                results.append({
                    "id": item.get("id"),
                    "status": "success",
                    "report_url": report_path
                })
                
                job.processed_items += 1
                
            except Exception as e:
                logger.error(f"Error generating report {idx}: {e}")
                results.append({
                    "id": item.get("id"),
                    "status": "error",
                    "error": str(e)
                })
                job.failed_items += 1
            
            # Update progress
            job.progress_percent = (idx + 1) / len(items) * 100
            await db.commit()
            
            await asyncio.sleep(0.5)
        
        job.result_data = {"results": results}
    
    async def get_job_status(self, db: AsyncSession, job_id: str) -> Optional[Dict]:
        """Get status of a batch job"""
        from sqlalchemy import select
        
        stmt = select(BatchJob).where(BatchJob.job_id == job_id)
        result = await db.execute(stmt)
        job = result.scalars().first()
        
        if not job:
            return None
        
        return {
            "job_id": job.job_id,
            "job_type": job.job_type,
            "status": job.status,
            "progress_percent": job.progress_percent,
            "total_items": job.total_items,
            "processed_items": job.processed_items,
            "failed_items": job.failed_items,
            "created_at": job.created_at.isoformat(),
            "started_at": job.started_at.isoformat() if job.started_at else None,
            "completed_at": job.completed_at.isoformat() if job.completed_at else None,
            "execution_time_seconds": job.execution_time_seconds,
            "result_data": job.result_data,
            "error_message": job.error_message
        }
    
    async def cancel_job(self, db: AsyncSession, job_id: str) -> bool:
        """Cancel a running job"""
        from sqlalchemy import select
        
        stmt = select(BatchJob).where(BatchJob.job_id == job_id)
        result = await db.execute(stmt)
        job = result.scalars().first()
        
        if not job or job.status not in [BatchJobStatus.PENDING, BatchJobStatus.RUNNING]:
            return False
        
        job.status = BatchJobStatus.CANCELLED
        job.completed_at = datetime.utcnow()
        await db.commit()
        
        # Cancel the running task
        if job_id in self.running_jobs:
            self.running_jobs[job_id].cancel()
            del self.running_jobs[job_id]
        
        return True


# Global batch processor instance
batch_processor = BatchProcessor()
