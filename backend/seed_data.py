import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid

# Configuration
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "campus_resource_hub"

async def seed():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
    db = client[DATABASE_NAME]
    
    samples = [
        {
            "title": "Algorithms & Logic (Unit 1-4)",
            "subject": "Discrete Mathematics",
            "course": "BCA",
            "author": "Guneet",
            "type": "Notes",
            "downloads": 45,
            "date": "2026-02-10",
            "privacy": "public",
            "semester": 6,
            "year": 2025,
            "description": "Final year revision notes for Discrete Maths.",
            "college": "Global Institute of Tech"
        },
        {
            "title": "Operating Systems Previous Papers",
            "subject": "System Software",
            "course": "CS101",
            "author": "Aman",
            "type": "PYQ",
            "downloads": 120,
            "date": "2026-01-20",
            "privacy": "public",
            "semester": 4,
            "year": 2024,
            "description": "Collection of last 5 years papers.",
            "college": "Tech University"
        },
        {
            "title": "Physics Formula Cheat Sheet",
            "subject": "Applied Physics",
            "course": "B.Tech CS",
            "author": "Dr. Verma",
            "type": "Summary",
            "downloads": 310,
            "date": "2026-02-05",
            "privacy": "public",
            "semester": 1,
            "year": 2023,
            "description": "All key formulas for Semester 1 Physics.",
            "college": "Global Institute of Tech"
        }
    ]
    
    for s in samples:
        s["filename"] = f"seed_{uuid.uuid4().hex[:6]}.pdf"
        
    try:
        print("Inserting data...")
        await db.resources.insert_many(samples)
        print(f"Done! Inserted {len(samples)} items.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed())
