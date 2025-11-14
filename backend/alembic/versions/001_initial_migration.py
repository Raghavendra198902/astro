"""Initial database migration - Create all tables

Revision ID: 001_initial_migration
Revises: 
Create Date: 2025-11-12

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision = '001_initial_migration'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Enable pgvector extension
    op.execute('CREATE EXTENSION IF NOT EXISTS vector')
    
    # Create enum types
    op.execute("CREATE TYPE userrole AS ENUM ('seeker', 'astrologer', 'admin')")
    
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('role', sa.String(50), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('is_verified', sa.Boolean(), nullable=False, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    op.create_index('idx_users_email', 'users', ['email'])
    op.create_index('idx_users_role', 'users', ['role'])
    
    # Create profiles table
    op.create_table(
        'profiles',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('dob_ts_utc', sa.DateTime(timezone=True), nullable=False),
        sa.Column('tob_accuracy', sa.String(50), nullable=False),
        sa.Column('birthplace_text', sa.String(500), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('timezone', sa.String(100), nullable=False),
        sa.Column('preferred_system', sa.String(50), nullable=False),
        sa.Column('language', sa.String(10), nullable=False, default='en'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    op.create_index('idx_profiles_user_id', 'profiles', ['user_id'])
    
    # Create charts table
    op.create_table(
        'charts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('profile_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('system', sa.String(50), nullable=False),
        sa.Column('json_payload', postgresql.JSONB(), nullable=False),
        sa.Column('hash_key', sa.String(64), nullable=False, unique=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_charts_profile_id', 'charts', ['profile_id'])
    op.create_index('idx_charts_hash_key', 'charts', ['hash_key'])
    
    # Create transit_watches table
    op.create_table(
        'transit_watches',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('profile_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('rule', sa.String(500), nullable=False),
        sa.Column('window_start', sa.DateTime(timezone=True), nullable=False),
        sa.Column('window_end', sa.DateTime(timezone=True), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, default='active'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_transit_watches_profile_id', 'transit_watches', ['profile_id'])
    
    # Create compat_requests table
    op.create_table(
        'compat_requests',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('chart_a_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('charts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('chart_b_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('charts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('system', sa.String(50), nullable=False),
        sa.Column('raw_json', postgresql.JSONB(), nullable=False),
        sa.Column('guna_score', sa.Integer(), nullable=True),
        sa.Column('synastry_score', sa.Float(), nullable=True),
        sa.Column('ai_summary', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_compat_requests_chart_a', 'compat_requests', ['chart_a_id'])
    op.create_index('idx_compat_requests_chart_b', 'compat_requests', ['chart_b_id'])
    
    # Create reports table
    op.create_table(
        'reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('chart_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('charts.id', ondelete='CASCADE'), nullable=True),
        sa.Column('type', sa.String(50), nullable=False),
        sa.Column('theme', sa.String(50), nullable=False),
        sa.Column('file_url', sa.String(1000), nullable=False),
        sa.Column('metadata', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_reports_chart_id', 'reports', ['chart_id'])
    
    # Create ai_runs table
    op.create_table(
        'ai_runs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('chart_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('charts.id', ondelete='CASCADE'), nullable=True),
        sa.Column('input_hash', sa.String(64), nullable=False),
        sa.Column('prompt_template_id', sa.String(100), nullable=False),
        sa.Column('model', sa.String(100), nullable=False),
        sa.Column('output_tokens', sa.Integer(), nullable=True),
        sa.Column('cost_meta', postgresql.JSONB(), nullable=True),
        sa.Column('output_ref', sa.Text(), nullable=True),
        sa.Column('confidence_score', sa.Float(), nullable=True),
        sa.Column('user_rating', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_ai_runs_chart_id', 'ai_runs', ['chart_id'])
    op.create_index('idx_ai_runs_input_hash', 'ai_runs', ['input_hash'])
    
    # Create payments table
    op.create_table(
        'payments',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('plan', sa.String(50), nullable=False),
        sa.Column('provider', sa.String(50), nullable=False),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('amount', sa.Integer(), nullable=False),
        sa.Column('currency', sa.String(10), nullable=False, default='INR'),
        sa.Column('txn_ref', sa.String(255), nullable=False, unique=True),
        sa.Column('metadata', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    op.create_index('idx_payments_user_id', 'payments', ['user_id'])
    op.create_index('idx_payments_txn_ref', 'payments', ['txn_ref'])
    
    # Create audit_logs table
    op.create_table(
        'audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('actor_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('target', sa.String(255), nullable=True),
        sa.Column('meta', postgresql.JSONB(), nullable=True),
        sa.Column('ip_address', sa.String(50), nullable=True),
        sa.Column('user_agent', sa.String(500), nullable=True),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_audit_logs_actor_id', 'audit_logs', ['actor_id'])
    op.create_index('idx_audit_logs_timestamp', 'audit_logs', ['timestamp'])
    
    # Create kb_docs table with pgvector
    op.create_table(
        'kb_docs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('chunk_text', sa.Text(), nullable=False),
        sa.Column('embedding', Vector(1536), nullable=True),
        sa.Column('source_ref', sa.String(500), nullable=True),
        sa.Column('category', sa.String(100), nullable=True),
        sa.Column('language', sa.String(10), nullable=False, default='en'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_kb_docs_category', 'kb_docs', ['category'])
    
    # Create numerology_runs table
    op.create_table(
        'numerology_runs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('profile_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('system', sa.String(50), nullable=False),
        sa.Column('input_hash', sa.String(64), nullable=False),
        sa.Column('json_result', postgresql.JSONB(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_numerology_runs_profile_id', 'numerology_runs', ['profile_id'])
    
    # Create biometrics_faces table
    op.create_table(
        'biometrics_faces',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('profile_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('landmarks_hash', sa.String(64), nullable=False),
        sa.Column('features_json', postgresql.JSONB(), nullable=False),
        sa.Column('consent_flag', sa.Boolean(), nullable=False, default=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_biometrics_faces_profile_id', 'biometrics_faces', ['profile_id'])
    
    # Create biometrics_palms table
    op.create_table(
        'biometrics_palms',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('profile_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('features_json', postgresql.JSONB(), nullable=False),
        sa.Column('consent_flag', sa.Boolean(), nullable=False, default=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_biometrics_palms_profile_id', 'biometrics_palms', ['profile_id'])


def downgrade() -> None:
    op.drop_table('biometrics_palms')
    op.drop_table('biometrics_faces')
    op.drop_table('numerology_runs')
    op.drop_table('kb_docs')
    op.drop_table('audit_logs')
    op.drop_table('payments')
    op.drop_table('ai_runs')
    op.drop_table('reports')
    op.drop_table('compat_requests')
    op.drop_table('transit_watches')
    op.drop_table('charts')
    op.drop_table('profiles')
    op.drop_table('users')
    op.execute('DROP EXTENSION IF EXISTS vector')
