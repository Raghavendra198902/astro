"""Add biometric_readings table

Revision ID: 005_add_biometric_readings
Revises: 004_add_subscription_transaction
Create Date: 2024-12-10

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

# revision identifiers, used by Alembic.
revision = '005_add_biometric_readings'
down_revision = '004_add_subscription_transaction'
branch_labels = None
depends_on = None


def upgrade():
    # Create biometric_readings table
    op.create_table(
        'biometric_readings',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('reading_type', sa.String(50), nullable=False),
        sa.Column('analysis_data', JSONB, nullable=False),
        sa.Column('user_consent', sa.Boolean(), default=True, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
    )
    
    # Create indexes
    op.create_index('idx_biometric_readings_user', 'biometric_readings', ['user_id'])
    op.create_index('idx_biometric_readings_type', 'biometric_readings', ['reading_type'])
    op.create_index('idx_biometric_readings_expires', 'biometric_readings', ['expires_at'])


def downgrade():
    op.drop_index('idx_biometric_readings_expires', 'biometric_readings')
    op.drop_index('idx_biometric_readings_type', 'biometric_readings')
    op.drop_index('idx_biometric_readings_user', 'biometric_readings')
    op.drop_table('biometric_readings')
