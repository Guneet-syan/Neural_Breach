import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# Configuration
MONGODB_URL = "mongodb://127.0.0.1:27017"
DATABASE_NAME = "campus_resource_hub"

async def link_files():
    client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
    db = client[DATABASE_NAME]
    
    samples = [
        {
            "title": "Machine Learning Fundamentals",
            "subject": "AI/ML",
            "course": "B.Tech CS",
            "author": "Guneet",
            "type": "Notes",
            "downloads": 156,
            "date": "2026-02-15",
            "privacy": "public",
            "semester": 7,
            "year": 2025,
            "description": "Comprehensive guide to Supervised and Unsupervised learning.",
            "filename": "demo_09559e.pdf"
        },
        {
            "title": "CS202 Microprocessors PYQ 2025",
            "subject": "Hardware",
            "course": "CS202",
            "author": "Ankit",
            "type": "PYQ",
            "downloads": 42,
            "date": "2026-02-11",
            "privacy": "public",
            "semester": 4,
            "year": 2026,
            "description": "Solved questions for 8085 and 8086 architectures.",
            "filename": "demo_581eb6.pdf"
        },
        {
            "title": "Data Structures Lab Report",
            "subject": "DSA",
            "course": "CS101",
            "author": "Ishaan",
            "type": "Practical",
            "downloads": 98,
            "date": "2026-01-30",
            "privacy": "public",
            "semester": 3,
            "year": 2024,
            "description": "Complete records for Stack, Queue and LinkedList experiments.",
            "filename": "demo_638921.pdf"
        },
        {
            "title": "Economics for Engineers Summary",
            "subject": "Humanities",
            "course": "EC201",
            "author": "Sara",
            "type": "Summary",
            "downloads": 23,
            "date": "2026-02-17",
            "privacy": "public",
            "semester": 5,
            "year": 2025,
            "description": "Quick revision for midterms.",
            "filename": "demo_a8ceee.pdf"
        }
    ]
    
    try:
        print("Updating database...")
        # Clear previous partial attempts if any
        await db.resources.delete_many({"filename": {"$regex": "^demo_"}})
        await db.resources.insert_many(samples)
        print(f"Successfully linked {len(samples)} demo files in database.")
    except Exception as e:
        print(f"Update error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(link_files())
