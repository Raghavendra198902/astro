"""
Payment Gateway Integration
Supports Stripe and Razorpay
"""

from typing import Dict, Any, Optional
import logging
from datetime import datetime
from enum import Enum

from app.core.config import settings

logger = logging.getLogger(__name__)


class PaymentProvider(str, Enum):
    STRIPE = "stripe"
    RAZORPAY = "razorpay"


class SubscriptionPlan(str, Enum):
    FREE = "free"
    PRO = "pro"
    ASTROLOGER = "astrologer"


class PaymentGateway:
    """Payment gateway abstraction"""
    
    def __init__(self, provider: PaymentProvider = PaymentProvider.STRIPE):
        self.provider = provider
        
        if provider == PaymentProvider.STRIPE:
            self._init_stripe()
        elif provider == PaymentProvider.RAZORPAY:
            self._init_razorpay()
    
    def _init_stripe(self):
        """Initialize Stripe"""
        try:
            import stripe
            stripe.api_key = settings.STRIPE_SECRET_KEY
            self.stripe = stripe
            self.available = True
            logger.info("Stripe initialized")
        except ImportError:
            logger.error("Stripe package not installed")
            self.available = False
    
    def _init_razorpay(self):
        """Initialize Razorpay"""
        try:
            import razorpay
            self.razorpay_client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )
            self.available = True
            logger.info("Razorpay initialized")
        except ImportError:
            logger.error("Razorpay package not installed")
            self.available = False
    
    async def create_payment_intent(
        self,
        amount: float,
        currency: str = "usd",
        metadata: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Create payment intent
        
        Args:
            amount: Amount in smallest currency unit (cents for USD)
            currency: Currency code
            metadata: Additional metadata
            
        Returns:
            Payment intent details with client_secret
        """
        if not self.available:
            raise RuntimeError("Payment gateway not available")
        
        if self.provider == PaymentProvider.STRIPE:
            return await self._create_stripe_intent(amount, currency, metadata)
        elif self.provider == PaymentProvider.RAZORPAY:
            return await self._create_razorpay_order(amount, currency, metadata)
    
    async def _create_stripe_intent(
        self,
        amount: float,
        currency: str,
        metadata: Optional[Dict]
    ) -> Dict[str, Any]:
        """Create Stripe payment intent"""
        try:
            intent = self.stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Convert to cents
                currency=currency,
                metadata=metadata or {},
                automatic_payment_methods={"enabled": True}
            )
            
            return {
                "provider": "stripe",
                "intent_id": intent.id,
                "client_secret": intent.client_secret,
                "amount": amount,
                "currency": currency,
                "status": intent.status
            }
        except Exception as e:
            logger.error(f"Stripe payment intent error: {e}")
            raise
    
    async def _create_razorpay_order(
        self,
        amount: float,
        currency: str,
        metadata: Optional[Dict]
    ) -> Dict[str, Any]:
        """Create Razorpay order"""
        try:
            order = self.razorpay_client.order.create({
                "amount": int(amount * 100),  # Amount in paise
                "currency": currency.upper(),
                "notes": metadata or {}
            })
            
            return {
                "provider": "razorpay",
                "order_id": order["id"],
                "amount": amount,
                "currency": currency,
                "status": order["status"]
            }
        except Exception as e:
            logger.error(f"Razorpay order error: {e}")
            raise
    
    async def create_subscription(
        self,
        customer_id: str,
        plan: SubscriptionPlan,
        trial_days: int = 0
    ) -> Dict[str, Any]:
        """
        Create subscription
        
        Args:
            customer_id: Customer ID from payment provider
            plan: Subscription plan
            trial_days: Trial period in days
            
        Returns:
            Subscription details
        """
        if not self.available:
            raise RuntimeError("Payment gateway not available")
        
        # Get plan details
        plan_details = self._get_plan_details(plan)
        
        if self.provider == PaymentProvider.STRIPE:
            return await self._create_stripe_subscription(
                customer_id, plan_details, trial_days
            )
        elif self.provider == PaymentProvider.RAZORPAY:
            return await self._create_razorpay_subscription(
                customer_id, plan_details, trial_days
            )
    
    async def _create_stripe_subscription(
        self,
        customer_id: str,
        plan_details: Dict,
        trial_days: int
    ) -> Dict[str, Any]:
        """Create Stripe subscription"""
        try:
            subscription = self.stripe.Subscription.create(
                customer=customer_id,
                items=[{"price": plan_details["stripe_price_id"]}],
                trial_period_days=trial_days if trial_days > 0 else None
            )
            
            return {
                "provider": "stripe",
                "subscription_id": subscription.id,
                "customer_id": customer_id,
                "status": subscription.status,
                "current_period_start": subscription.current_period_start,
                "current_period_end": subscription.current_period_end,
                "trial_end": subscription.trial_end
            }
        except Exception as e:
            logger.error(f"Stripe subscription error: {e}")
            raise
    
    async def _create_razorpay_subscription(
        self,
        customer_id: str,
        plan_details: Dict,
        trial_days: int
    ) -> Dict[str, Any]:
        """Create Razorpay subscription"""
        try:
            subscription = self.razorpay_client.subscription.create({
                "plan_id": plan_details["razorpay_plan_id"],
                "customer_notify": 1,
                "total_count": 12,  # 12 billing cycles
                "start_at": int(datetime.utcnow().timestamp()) + (trial_days * 86400)
            })
            
            return {
                "provider": "razorpay",
                "subscription_id": subscription["id"],
                "status": subscription["status"],
                "start_at": subscription["start_at"]
            }
        except Exception as e:
            logger.error(f"Razorpay subscription error: {e}")
            raise
    
    async def cancel_subscription(
        self,
        subscription_id: str
    ) -> Dict[str, Any]:
        """Cancel subscription"""
        if not self.available:
            raise RuntimeError("Payment gateway not available")
        
        if self.provider == PaymentProvider.STRIPE:
            subscription = self.stripe.Subscription.delete(subscription_id)
            return {"status": "canceled", "subscription_id": subscription_id}
        elif self.provider == PaymentProvider.RAZORPAY:
            subscription = self.razorpay_client.subscription.cancel(subscription_id)
            return {"status": subscription["status"], "subscription_id": subscription_id}
    
    async def verify_webhook_signature(
        self,
        payload: bytes,
        signature: str
    ) -> bool:
        """Verify webhook signature"""
        if self.provider == PaymentProvider.STRIPE:
            try:
                self.stripe.Webhook.construct_event(
                    payload,
                    signature,
                    settings.STRIPE_WEBHOOK_SECRET
                )
                return True
            except Exception as e:
                logger.error(f"Stripe webhook verification failed: {e}")
                return False
        elif self.provider == PaymentProvider.RAZORPAY:
            try:
                self.razorpay_client.utility.verify_webhook_signature(
                    payload.decode(),
                    signature,
                    settings.RAZORPAY_WEBHOOK_SECRET
                )
                return True
            except Exception as e:
                logger.error(f"Razorpay webhook verification failed: {e}")
                return False
        
        return False
    
    def _get_plan_details(self, plan: SubscriptionPlan) -> Dict[str, Any]:
        """Get plan pricing details"""
        plans = {
            SubscriptionPlan.FREE: {
                "name": "Free",
                "price": 0,
                "features": ["Basic birth chart", "Daily horoscope"],
                "stripe_price_id": None,
                "razorpay_plan_id": None
            },
            SubscriptionPlan.PRO: {
                "name": "Pro",
                "price": 9.99,
                "features": [
                    "Unlimited charts",
                    "AI interpretations",
                    "Compatibility analysis",
                    "Transit alerts",
                    "PDF reports"
                ],
                "stripe_price_id": settings.STRIPE_PRO_PRICE_ID,
                "razorpay_plan_id": settings.RAZORPAY_PRO_PLAN_ID
            },
            SubscriptionPlan.ASTROLOGER: {
                "name": "Astrologer",
                "price": 29.99,
                "features": [
                    "All Pro features",
                    "Client management",
                    "Consultation scheduling",
                    "Custom branding",
                    "API access"
                ],
                "stripe_price_id": settings.STRIPE_ASTROLOGER_PRICE_ID,
                "razorpay_plan_id": settings.RAZORPAY_ASTROLOGER_PLAN_ID
            }
        }
        
        return plans.get(plan, plans[SubscriptionPlan.FREE])


# Global payment gateway instance
payment_gateway = PaymentGateway(
    provider=PaymentProvider(settings.PAYMENT_PROVIDER or "stripe")
)
