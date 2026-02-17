import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid

# Configuration
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "campus_resource_hub"
STORAGE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "resource_storage")

async def seed_with_files():
    print(f"Connecting to MongoDB and Storage ({STORAGE_DIR})...")
    if not os.path.exists(STORAGE_DIR):
        os.makedirs(STORAGE_DIR)
        
    client = AsyncIOMotorClient(MONGODB_URL)
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
        }
    ]
    
    # Create dummy PDF contents
    dummy_pdf_content = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 50 >>\nstream\nBT /F1 24 Tf 100 700 Td (Sample Academic Resource) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000060 00000 n\n0000000116 00000 n\n0000000212 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n312\n%%EOF"
    
    for s in samples:
        fname = f"demo_{uuid.uuid4().hex[:6]}.pdf"
        s["filename"] = fname
        # Physical file creation
        fpath = os.path.join(STORAGE_DIR, fname)
        with open(fpath, "wb") as f:
            f.write(dummy_pdf_content)
        print(f"Created file: {fname}")
        
    try:
        await db.resources.insert_many(samples)
        print(f"Database seeded with {len(samples)} functional entries.")
    except Exception as e:
        print(f"Seeding error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_with_files())
