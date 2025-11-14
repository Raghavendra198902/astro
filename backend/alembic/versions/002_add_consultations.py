"""Add consultation tables

Revision ID: 002_add_consultations
Revises: 001_initial_migration
Create Date: 2024-11-12 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002_add_consultations'
down_revision = '001_initial_migration'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create consultation_slots table
    op.create_table(
        'consultation_slots',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('astrologer_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('start_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('end_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_available', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('timezone', sa.String(length=50), nullable=False, server_default='UTC'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['astrologer_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_consultation_slots_astrologer', 'consultation_slots', ['astrologer_id'])
    op.create_index('idx_consultation_slots_start_time', 'consultation_slots', ['start_time'])
    op.create_index('idx_consultation_slots_available', 'consultation_slots', ['is_available', 'is_active'])

    # Create consultation_bookings table
    op.create_table(
        'consultation_bookings',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('slot_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('astrologer_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('seeker_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('scheduled_start', sa.DateTime(timezone=True), nullable=False),
        sa.Column('scheduled_end', sa.DateTime(timezone=True), nullable=False),
        sa.Column('actual_start', sa.DateTime(timezone=True), nullable=True),
        sa.Column('actual_end', sa.DateTime(timezone=True), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=True),
        sa.Column('consultation_type', sa.String(length=50), nullable=False, server_default='general'),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='scheduled'),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('session_notes', sa.Text(), nullable=True),
        sa.Column('video_room_url', sa.String(length=255), nullable=True),
        sa.Column('video_room_name', sa.String(length=100), nullable=True),
        sa.Column('recording_url', sa.String(length=255), nullable=True),
        sa.Column('payment_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('cancellation_reason', sa.Text(), nullable=True),
        sa.Column('cancelled_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['slot_id'], ['consultation_slots.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['astrologer_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['seeker_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint(
            "status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')",
            name='check_booking_status'
        )
    )
    op.create_index('idx_consultation_bookings_astrologer', 'consultation_bookings', ['astrologer_id'])
    op.create_index('idx_consultation_bookings_seeker', 'consultation_bookings', ['seeker_id'])
    op.create_index('idx_consultation_bookings_status', 'consultation_bookings', ['status'])
    op.create_index('idx_consultation_bookings_scheduled_start', 'consultation_bookings', ['scheduled_start'])


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_index('idx_consultation_bookings_scheduled_start', table_name='consultation_bookings')
    op.drop_index('idx_consultation_bookings_status', table_name='consultation_bookings')
    op.drop_index('idx_consultation_bookings_seeker', table_name='consultation_bookings')
    op.drop_index('idx_consultation_bookings_astrologer', table_name='consultation_bookings')
    op.drop_table('consultation_bookings')
    
    op.drop_index('idx_consultation_slots_available', table_name='consultation_slots')
    op.drop_index('idx_consultation_slots_start_time', table_name='consultation_slots')
    op.drop_index('idx_consultation_slots_astrologer', table_name='consultation_slots')
    op.drop_table('consultation_slots')
