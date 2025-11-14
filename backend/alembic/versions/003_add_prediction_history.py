"""Add prediction history table

Revision ID: 003_add_prediction_history
Revises: 002_add_consultations
Create Date: 2025-11-14 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import uuid

# revision identifiers, used by Alembic.
revision = '003_add_prediction_history'
down_revision = '002_add_consultations'
branch_labels = None
depends_on = None


def upgrade():
    # Create prediction_history table
    op.create_table(
        'prediction_history',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('profile_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('profiles.id', ondelete='CASCADE'), nullable=True),
        
        # Request parameters
        sa.Column('full_name', sa.String(200), nullable=False),
        sa.Column('birth_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('birth_time', sa.String(10), nullable=False),
        sa.Column('latitude', sa.Float, nullable=False),
        sa.Column('longitude', sa.Float, nullable=False),
        sa.Column('current_age', sa.Integer, nullable=False),
        sa.Column('prediction_years', sa.Integer, nullable=False),
        
        # Results
        sa.Column('prediction_data', postgresql.JSONB, nullable=False),
        sa.Column('past_events_count', sa.Integer, default=0),
        sa.Column('future_events_count', sa.Integer, default=0),
        sa.Column('risk_periods_count', sa.Integer, default=0),
        sa.Column('accuracy_score', sa.Float, nullable=True),
        
        # Metadata
        sa.Column('computation_time_seconds', sa.Float, nullable=True),
        sa.Column('from_cache', sa.Boolean, default=False),
        sa.Column('cache_key', sa.String(100), nullable=True),
        sa.Column('request_id', sa.String(50), nullable=True),
        
        # Timestamps
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('accessed_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now())
    )
    
    # Create indexes
    op.create_index('idx_prediction_history_user', 'prediction_history', ['user_id'])
    op.create_index('idx_prediction_history_profile', 'prediction_history', ['profile_id'])
    op.create_index('idx_prediction_history_created', 'prediction_history', ['created_at'])
    op.create_index('idx_prediction_history_cache_key', 'prediction_history', ['cache_key'])


def downgrade():
    # Drop indexes
    op.drop_index('idx_prediction_history_cache_key', 'prediction_history')
    op.drop_index('idx_prediction_history_created', 'prediction_history')
    op.drop_index('idx_prediction_history_profile', 'prediction_history')
    op.drop_index('idx_prediction_history_user', 'prediction_history')
    
    # Drop table
    op.drop_table('prediction_history')
