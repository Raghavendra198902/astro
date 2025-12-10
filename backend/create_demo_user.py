"""Script to create demo user in the database"""

import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.models.models import User
from app.core.security import get_password_hash


async def create_demo_user():
    """Create demo user if it doesn't exist"""
    async with AsyncSessionLocal() as db:
        try:
            # Check if demo user exists
            from sqlalchemy import select
            result = await db.execute(select(User).filter(User.email == "demo@astroai.com"))
            demo_user = result.scalar_one_or_none()
            
            if demo_user:
                print('✅ Demo user already exists')
                print(f'   Email: {demo_user.email}')
                print(f'   Role: {demo_user.role}')
            else:
                # Create demo user
                demo_user = User(
                    email="demo@astroai.com",
                    hashed_password=get_password_hash("demo1234"),
                    is_active=True,
                    is_verified=True,
                    role="seeker"
                )
                db.add(demo_user)
                await db.commit()
                await db.refresh(demo_user)
                print('✅ Demo user created successfully!')
                print(f'   Email: demo@astroai.com')
                print(f'   Password: demo1234')
                print(f'   Role: {demo_user.role}')
                
        except Exception as e:
            print(f'❌ Error: {e}')
            await db.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(create_demo_user())
