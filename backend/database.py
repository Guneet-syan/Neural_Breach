import os
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "campus_resource_hub"
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    class Config:
        env_file = ".env"

settings = Settings()

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db_helper = MongoDB()

async def connect_to_mongo():
    try:
        print(f"Attempting to connect to MongoDB: {settings.mongodb_url.split('@')[-1]}") # Log without creds
        db_helper.client = AsyncIOMotorClient(
            settings.mongodb_url,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000
        )
        # Force a connection check
        await db_helper.client.admin.command('ping')
        db_helper.db = db_helper.client[settings.database_name]
        print(f"✅ Connected to MongoDB database: {settings.database_name}")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        # Initialize db as None to prevent crashes, but log the error
        db_helper.db = None

async def close_mongo_connection():
    if db_helper.client:
        db_helper.client.close()
        print("Closed MongoDB connection")

def get_db():
    return db_helper.db

