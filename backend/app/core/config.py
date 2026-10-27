import os
from dotenv import load_dotenv
from pathlib import Path

# Load the environment file
env_path = Path(__file__).resolve().parents[2] 
load_dotenv(env_path / '.env')



class Config:
    def __init__(self):

        # Clerk keys
        #self.CLERK_SECRET_KEY: str = os.getenv("CLERK_SECRET_KEY", "")
        #self.CLERK_PUBLISHABLE_KEY: str = os.getenv("CLERK_PUBLISHABLE_KEY","")
        #self.CLERK_WEBHOOK_SECRET: str = os.getenv("CLERK_WEBHOOK_SECRET", "")
        #self.CLERK_JWKS_URL: str = os.getenv("CLERK_JWKS_URL", "")

        # BACKEND
        self.DATABASE_URL: str = os.getenv("DATABASE_URL", "")

        # FRONTEND
        self.FRONTEND_URL: str = os.getenv("FRONTEND_URL", "")
        self.ALLOWED_ORIGINS: list = [
            "http://localhost:3000",  # Next.js dev
            os.getenv("FRONTEND_URL", ""),
        ]

        # CLOUDINARY
        self.CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
        self.CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
        self.CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")

        # CLAUDE ANTHROPIC API KEY
        self.ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")

        # REDIS API 
        self.REDIS_URL: str = os.getenv("REDIS_URL", "")

        # SUBSCRIPTION 
        self.STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
        self.STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
        self.STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")

        # PRODUCTS
        self.STRIPE_PRICE_MONTHLY: str = os.getenv("STRIPE_PRICE_MONTHLY", "")
        self.STRIPE_PRICE_THREE_MONTHS: str = os.getenv("STRIPE_PRICE_THREE_MONTHS", "")
        self.STRIPE_PRICE_SIX_MONTHS: str = os.getenv("STRIPE_PRICE_SIX_MONTHS", "")
        self.STRIPE_SINGLE_SESSION: str = os.getenv("STRIPE_SINGLE_SESSION", "")
        self.STRIPE_THREE_SESSIONS: str = os.getenv("STRIPE_THREE_SESSIONS", "")
        self.STRIPE_FIVE_SESSIONS: str = os.getenv("STRIPE_FIVE_SESSIONS", "")

        # EMAIL CORRESPONDENCES
        self.RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")

        # CLERK 
        self.GUEST_CLERK_ID: str = os.getenv("GUEST_CLERK_ID", "")
        self.CLERK_SECRET_KEY: str = os.getenv("CLERK_SECRET_KEY", "")
        self.CLERK_JWT_KEY: str = os.getenv("CLERK_JWT_KEY", "")
        self.CLERK_ISSUER: str = os.getenv("CLERK_ISSUER", "")
        self.CLERK_JWKS_URL: str = os.getenv("CLERK_JWKS_URL", "")
        self.CLERK_WEBHOOK: str = os.getenv("CLERK_WEBHOOK", "")
        self.CLERK_AUTHORIZED_PARTIES: list[str] = os.getenv("CLERK_AUTHORIZED_PARTIES", [])

        # NGROK 
        self.NGROK_AUTHTOKEN: str = os.getenv("NGROK_AUTHTOKEN", "")


# Single instance to import everywhere
settings = Config()

