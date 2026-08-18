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

        # Frontend
        self.FRONTEND_URL: str = os.getenv("FRONTEND_URL", "")
        self.ALLOWED_ORIGINS: list = [
            "http://localhost:3000",  # Next.js dev
            os.getenv("FRONTEND_URL", ""),
        ]

        # CLOUDINARY
        self.CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
        self.CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
        self.CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")

        # MEMBERSHIP
        
        # EMAIL CORRESPONDENCES
        self.RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")

# Single instance to import everywhere
settings = Config()

