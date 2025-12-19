"""Add enterprise features

Revision ID: 006_enterprise_features
Revises: 005_add_biometric_readings
Create Date: 2025-12-18 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '006_enterprise_features'
down_revision = '005_add_biometric_readings'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Analytics Events table
    op.create_table(
        'analytics_events',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('event_type', sa.String(length=100), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('session_id', sa.String(length=100), nullable=True),
        sa.Column('event_category', sa.String(length=50), nullable=True),
        sa.Column('event_action', sa.String(length=50), nullable=True),
        sa.Column('event_label', sa.String(length=200), nullable=True),
        sa.Column('event_value', sa.Float(), nullable=True),
        sa.Column('endpoint', sa.String(length=200), nullable=True),
        sa.Column('method', sa.String(length=10), nullable=True),
        sa.Column('status_code', sa.Integer(), nullable=True),
        sa.Column('response_time_ms', sa.Float(), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('user_agent', sa.String(length=500), nullable=True),
        sa.Column('country', sa.String(length=2), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=True),
        sa.Column('properties', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_analytics_category', 'analytics_events', ['event_category', 'created_at'])
    op.create_index('idx_analytics_created', 'analytics_events', ['created_at'])
    op.create_index('idx_analytics_user_event', 'analytics_events', ['user_id', 'event_type'])
    op.create_index(op.f('ix_analytics_events_event_category'), 'analytics_events', ['event_category'])
    op.create_index(op.f('ix_analytics_events_event_type'), 'analytics_events', ['event_type'])
    op.create_index(op.f('ix_analytics_events_id'), 'analytics_events', ['id'])
    op.create_index(op.f('ix_analytics_events_session_id'), 'analytics_events', ['session_id'])
    op.create_index(op.f('ix_analytics_events_user_id'), 'analytics_events', ['user_id'])

    # Usage Metrics table
    op.create_table(
        'usage_metrics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('metric_date', sa.DateTime(), nullable=False),
        sa.Column('metric_type', sa.String(length=50), nullable=False),
        sa.Column('total_requests', sa.Integer(), nullable=True),
        sa.Column('unique_users', sa.Integer(), nullable=True),
        sa.Column('new_users', sa.Integer(), nullable=True),
        sa.Column('avg_response_time', sa.Float(), nullable=True),
        sa.Column('p95_response_time', sa.Float(), nullable=True),
        sa.Column('p99_response_time', sa.Float(), nullable=True),
        sa.Column('error_count', sa.Integer(), nullable=True),
        sa.Column('error_rate', sa.Float(), nullable=True),
        sa.Column('charts_generated', sa.Integer(), nullable=True),
        sa.Column('predictions_made', sa.Integer(), nullable=True),
        sa.Column('consultations_booked', sa.Integer(), nullable=True),
        sa.Column('revenue', sa.Float(), nullable=True),
        sa.Column('aggregated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_metrics_date_type', 'usage_metrics', ['metric_date', 'metric_type'])
    op.create_index(op.f('ix_usage_metrics_id'), 'usage_metrics', ['id'])
    op.create_index(op.f('ix_usage_metrics_metric_date'), 'usage_metrics', ['metric_date'])

    # Batch Jobs table
    op.create_table(
        'batch_jobs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('job_id', sa.String(length=100), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('job_type', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('priority', sa.Integer(), nullable=True),
        sa.Column('total_items', sa.Integer(), nullable=True),
        sa.Column('processed_items', sa.Integer(), nullable=True),
        sa.Column('failed_items', sa.Integer(), nullable=True),
        sa.Column('progress_percent', sa.Float(), nullable=True),
        sa.Column('input_data', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('result_data', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('error_message', sa.String(length=1000), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('estimated_completion_at', sa.DateTime(), nullable=True),
        sa.Column('execution_time_seconds', sa.Float(), nullable=True),
        sa.Column('memory_usage_mb', sa.Float(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('job_id')
    )
    op.create_index('idx_batch_created', 'batch_jobs', ['created_at'])
    op.create_index('idx_batch_user_status', 'batch_jobs', ['user_id', 'status'])
    op.create_index(op.f('ix_batch_jobs_id'), 'batch_jobs', ['id'])
    op.create_index(op.f('ix_batch_jobs_job_id'), 'batch_jobs', ['job_id'])
    op.create_index(op.f('ix_batch_jobs_status'), 'batch_jobs', ['status'])
    op.create_index(op.f('ix_batch_jobs_user_id'), 'batch_jobs', ['user_id'])

    # Audit Logs table
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('event_id', sa.String(length=100), nullable=False),
        sa.Column('event_type', sa.Enum(
            'LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'PASSWORD_CHANGE', 'PASSWORD_RESET',
            'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'USER_ACTIVATED', 'USER_DEACTIVATED',
            'DATA_VIEWED', 'DATA_CREATED', 'DATA_UPDATED', 'DATA_DELETED', 'DATA_EXPORTED',
            'CHART_GENERATED', 'CHART_DOWNLOADED', 'CHART_SHARED',
            'PREDICTION_REQUESTED', 'PREDICTION_GENERATED',
            'PAYMENT_INITIATED', 'PAYMENT_COMPLETED', 'PAYMENT_FAILED', 'PAYMENT_REFUNDED',
            'SYSTEM_ERROR', 'SYSTEM_WARNING', 'API_RATE_LIMIT', 'UNAUTHORIZED_ACCESS',
            'ADMIN_ACTION', 'CONFIG_CHANGE', 'SECURITY_ALERT',
            name='audit_event_type'
        ), nullable=False),
        sa.Column('severity', sa.Enum('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL', name='audit_severity'), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('username', sa.String(length=255), nullable=True),
        sa.Column('session_id', sa.String(length=100), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('user_agent', sa.String(length=500), nullable=True),
        sa.Column('endpoint', sa.String(length=200), nullable=True),
        sa.Column('method', sa.String(length=10), nullable=True),
        sa.Column('country', sa.String(length=2), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=True),
        sa.Column('action', sa.String(length=200), nullable=True),
        sa.Column('resource_type', sa.String(length=50), nullable=True),
        sa.Column('resource_id', sa.String(length=100), nullable=True),
        sa.Column('old_value', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('new_value', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('event_id')
    )
    op.create_index('idx_audit_resource', 'audit_logs', ['resource_type', 'resource_id'])
    op.create_index('idx_audit_severity', 'audit_logs', ['severity', 'timestamp'])
    op.create_index('idx_audit_timestamp', 'audit_logs', ['timestamp'])
    op.create_index('idx_audit_user_event', 'audit_logs', ['user_id', 'event_type'])
    op.create_index(op.f('ix_audit_logs_event_id'), 'audit_logs', ['event_id'])
    op.create_index(op.f('ix_audit_logs_event_type'), 'audit_logs', ['event_type'])
    op.create_index(op.f('ix_audit_logs_id'), 'audit_logs', ['id'])
    op.create_index(op.f('ix_audit_logs_severity'), 'audit_logs', ['severity'])
    op.create_index(op.f('ix_audit_logs_timestamp'), 'audit_logs', ['timestamp'])
    op.create_index(op.f('ix_audit_logs_user_id'), 'audit_logs', ['user_id'])


def downgrade() -> None:
    op.drop_table('audit_logs')
    op.drop_table('batch_jobs')
    op.drop_table('usage_metrics')
    op.drop_table('analytics_events')
    
    # Drop enums
    op.execute('DROP TYPE IF EXISTS audit_event_type')
    op.execute('DROP TYPE IF EXISTS audit_severity')
