"""
Payment Endpoints
Handle subscriptions and payments
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import get_settings
from app.models.models import User, Subscription, Transaction
from app.schemas.schemas import (
    SubscriptionRequest,
    SubscriptionResponse,
    PaymentIntentRequest,
    PaymentIntentResponse
)
from app.services.payment.gateway import PaymentGateway

router = APIRouter()
settings = get_settings()


@router.post("/intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    request: PaymentIntentRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create payment intent for one-time payment"""
    gateway = PaymentGateway(provider=request.provider)
    
    try:
        intent = gateway.create_payment_intent(
            amount=request.amount,
            currency=request.currency,
            metadata={
                "user_id": str(current_user.id),
                "description": request.description
            }
        )
        
        # Create transaction record
        transaction = Transaction(
            user_id=current_user.id,
            amount=request.amount / 100,  # Convert from cents
            currency=request.currency,
            payment_provider=request.provider,
            provider_payment_id=intent["id"],
            status="pending"
        )
        
        db.add(transaction)
        await db.commit()
        
        return {
            "client_secret": intent["client_secret"],
            "payment_id": intent["id"]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment intent creation failed: {str(e)}"
        )


@router.post("/subscriptions", response_model=SubscriptionResponse)
async def create_subscription(
    request: SubscriptionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create or upgrade subscription"""
    gateway = PaymentGateway(provider=request.provider)
    
    try:
        # Create subscription with payment provider
        # Convert plan_name string to SubscriptionPlan enum
        from app.services.payment.gateway import SubscriptionPlan
        plan_enum = SubscriptionPlan(request.plan_name)
        
        subscription_data = await gateway.create_subscription(
            customer_id=current_user.email,  # Use email as customer ID
            plan=plan_enum,
            trial_days=request.trial_days
        )
        
        # Check for existing subscription
        stmt = select(Subscription).where(
            Subscription.user_id == current_user.id,
            Subscription.status == "active"
        )
        result = await db.execute(stmt)
        existing_sub = result.scalars().first()
        
        if existing_sub:
            # Cancel old subscription
            gateway.cancel_subscription(existing_sub.provider_subscription_id)
            existing_sub.status = "cancelled"
        
        # Create new subscription record
        subscription = Subscription(
            user_id=current_user.id,
            plan_name=request.plan_name,
            status="active",
            provider=request.provider,
            provider_subscription_id=subscription_data["id"],
            current_period_start=subscription_data["current_period_start"],
            current_period_end=subscription_data["current_period_end"]
        )
        
        db.add(subscription)
        await db.commit()
        await db.refresh(subscription)
        
        return subscription
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Subscription creation failed: {str(e)}"
        )


@router.delete("/subscriptions/{subscription_id}")
async def cancel_subscription(
    subscription_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancel subscription"""
    # Get subscription
    stmt = select(Subscription).where(
        Subscription.id == subscription_id,
        Subscription.user_id == current_user.id
    )
    result = await db.execute(stmt)
    subscription = result.scalars().first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )
    
    if subscription.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subscription is not active"
        )
    
    try:
        gateway = PaymentGateway(provider=subscription.provider)
        gateway.cancel_subscription(subscription.provider_subscription_id)
        
        subscription.status = "cancelled"
        await db.commit()
        
        return {"message": "Subscription cancelled successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cancellation failed: {str(e)}"
        )


@router.post("/webhooks/stripe")
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Handle Stripe webhooks"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    gateway = PaymentGateway(provider="stripe")
    
    try:
        event = gateway.verify_webhook_signature(
            payload,
            sig_header,
            settings.STRIPE_WEBHOOK_SECRET
        )
        
        # Handle different event types
        if event["type"] == "payment_intent.succeeded":
            payment_id = event["data"]["object"]["id"]
            # Update transaction status
            stmt = select(Transaction).where(
                Transaction.provider_payment_id == payment_id
            )
            result = await db.execute(stmt)
            transaction = result.scalars().first()
            if transaction:
                transaction.status = "completed"
                await db.commit()
        
        return {"status": "success"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/webhooks/razorpay")
async def razorpay_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Handle Razorpay webhooks"""
    payload = await request.body()
    sig_header = request.headers.get("x-razorpay-signature")
    
    gateway = PaymentGateway(provider="razorpay")
    
    try:
        event = gateway.verify_webhook_signature(
            payload,
            sig_header,
            settings.RAZORPAY_WEBHOOK_SECRET
        )
        
        # Handle different event types
        if event["event"] == "payment.captured":
            payment_id = event["payload"]["payment"]["entity"]["id"]
            # Update transaction status
            stmt = select(Transaction).where(
                Transaction.provider_payment_id == payment_id
            )
            result = await db.execute(stmt)
            transaction = result.scalars().first()
            if transaction:
                transaction.status = "completed"
                await db.commit()
        
        return {"status": "success"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
