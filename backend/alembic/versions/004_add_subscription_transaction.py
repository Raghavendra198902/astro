"""Add Subscription and Transaction models

Revision ID: 004_add_subscription_transaction
Revises: 003_add_prediction_history
Create Date: 2025-12-10 07:35:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '004_add_subscription_transaction'
down_revision = '003_add_prediction_history'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create subscriptions table
    op.create_table(
        'subscriptions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('plan', sa.String(50), nullable=False),
        sa.Column('status', sa.String(20), nullable=False, server_default='active'),
        sa.Column('provider', sa.String(50), nullable=False),
        sa.Column('provider_subscription_id', sa.String(255), nullable=True),
        sa.Column('current_period_start', sa.DateTime(timezone=True), nullable=False),
        sa.Column('current_period_end', sa.DateTime(timezone=True), nullable=False),
        sa.Column('cancel_at_period_end', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('cancelled_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('trial_start', sa.DateTime(timezone=True), nullable=True),
        sa.Column('trial_end', sa.DateTime(timezone=True), nullable=True),
        sa.Column('subscription_metadata', postgresql.JSONB, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
        sa.CheckConstraint(
            "status IN ('active', 'cancelled', 'past_due', 'trialing', 'incomplete')",
            name='check_subscription_status'
        )
    )
    
    # Create indexes for subscriptions
    op.create_index('idx_subscriptions_user_id', 'subscriptions', ['user_id'])
    op.create_index('idx_subscriptions_status', 'subscriptions', ['status'])
    op.create_index('idx_subscriptions_current_period_end', 'subscriptions', ['current_period_end'])
    
    # Create transactions table
    op.create_table(
        'transactions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('subscription_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('subscriptions.id', ondelete='SET NULL'), nullable=True),
        sa.Column('amount', sa.Integer, nullable=False),
        sa.Column('currency', sa.String(10), nullable=False, server_default='INR'),
        sa.Column('status', sa.String(20), nullable=False, server_default='pending'),
        sa.Column('provider', sa.String(50), nullable=False),
        sa.Column('provider_transaction_id', sa.String(255), nullable=True),
        sa.Column('transaction_type', sa.String(50), nullable=False, server_default='charge'),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('failure_reason', sa.Text, nullable=True),
        sa.Column('transaction_metadata', postgresql.JSONB, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
        sa.CheckConstraint(
            "transaction_type IN ('charge', 'refund', 'adjustment')",
            name='check_transaction_type'
        )
    )
    
    # Create indexes for transactions
    op.create_index('idx_transactions_user_id', 'transactions', ['user_id'])
    op.create_index('idx_transactions_subscription_id', 'transactions', ['subscription_id'])
    op.create_index('idx_transactions_status', 'transactions', ['status'])
    op.create_index('idx_transactions_created_at', 'transactions', ['created_at'])


def downgrade() -> None:
    # Drop transactions table and indexes
    op.drop_index('idx_transactions_created_at', 'transactions')
    op.drop_index('idx_transactions_status', 'transactions')
    op.drop_index('idx_transactions_subscription_id', 'transactions')
    op.drop_index('idx_transactions_user_id', 'transactions')
    op.drop_table('transactions')
    
    # Drop subscriptions table and indexes
    op.drop_index('idx_subscriptions_current_period_end', 'subscriptions')
    op.drop_index('idx_subscriptions_status', 'subscriptions')
    op.drop_index('idx_subscriptions_user_id', 'subscriptions')
    op.drop_table('subscriptions')
