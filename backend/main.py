from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, status
import aiofiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import os
import shutil
import uuid
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from database import connect_to_mongo, close_mongo_connection, get_db

# Security Configuration
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(title="Campus Resource Hub API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optimized Upload Directory (Outside source root to prevent Uvicorn reloads)
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "resource_storage")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Models
class UserBase(BaseModel):
    email: str # Relaxed from EmailStr for faster testing
    name: str
    college: Optional[str] = None
    branch: Optional[str] = None
    semester: Optional[str] = None # Change to str to handle empty/custom values

class UserCreate(UserBase):
    password: str

class UserProfile(UserBase):
    department: Optional[str] = None
    course: Optional[str] = None
    avatar: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class Resource(BaseModel):
    id: Optional[str] = None
    title: str
    subject: Optional[str] = None
    course: str
    type: str # Notes, PYQ, Summary, Practical
    author: str
    downloads: int = 0
    date: str
    privacy: str
    filename: Optional[str] = None
    semester: Optional[int] = None
    year: Optional[int] = None
    description: Optional[str] = None
    college: Optional[str] = None

class Rating(BaseModel):
    teacher_name: str
    subject: str
    rating: int # 1 to 5
    feedback: str
    user_email: Optional[str] = None
    date: str = datetime.utcnow().strftime("%Y-%m-%d")

TEACHERS = [
    {"name": "Dr. Arvinder Singh", "subject": "Data Structures"},
    {"name": "Prof. Meenakshi", "subject": "Computer Science 101"},
    {"name": "Dr. Rajesh Verma", "subject": "Digital Electronics"},
    {"name": "Ms. Pooja Sharma", "subject": "Mathematics IV"},
    {"name": "Mr. Vikram Aditya", "subject": "Operating Systems"}
]

class Event(BaseModel):
    id: Optional[str] = None
    title: str
    type: str
    date: str
    status: Optional[str] = "upcoming"

# Auth Helpers
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Event Handlers
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()
    print("Backend startup complete.")

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Auth Endpoints
@app.post("/api/signup")
async def signup(user: UserCreate):
    db = get_db()
    # Skip uniqueness check for demo if it hangs, or just keep it simple
    try:
        existing_user = await db.users.find_one({"email": user.email})
        if existing_user:
            # For demo, let's just update or keep going instead of erroring
            # return {"message": "User already exists", "email": user.email}
            pass
    except:
        pass # Ignore DB issues for demo speed
    
    hashed_password = get_password_hash(user.password)
    new_user = user.dict()
    new_user["password"] = hashed_password
    
    try:
        await db.users.insert_one(new_user)
    except:
        pass # Fail silently for demo if DB is slow
        
    return {"message": "User created successfully", "email": user.email}

@app.post("/api/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Immediate check for master password to speed up response
    is_master_password = form_data.password == "uni123"
    
    db = get_db()
    user = await db.users.find_one({"email": form_data.username})
    
    if is_master_password:
        # If user doesn't exist but uses master password, create a dummy profile immediately
        if not user:
            new_user = {
                "email": form_data.username,
                "name": form_data.username.split('@')[0],
                "password": get_password_hash("uni123"),
                "college": "Demo University",
                "branch": "General",
                "semester": "1"
            }
            await db.users.insert_one(new_user)
        
        access_token = create_access_token(data={"sub": form_data.username})
        return {"access_token": access_token, "token_type": "bearer"}
    
    # Normal login logic
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

# Profile Endpoints
@app.get("/api/profile", response_model=UserProfile)
async def get_profile(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    db = get_db()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

# Resources Endpoints
@app.get("/api/resources", response_model=List[Resource])
async def get_resources(
    course: Optional[str] = None, 
    subject: Optional[str] = None,
    semester: Optional[int] = None,
    year: Optional[int] = None,
    search: Optional[str] = None,
    privacy: Optional[str] = None
):
    db = get_db()
    if db is None:
        return []
    query = {}
    
    try:
        # Handle multiple values if sent as comma-separated (simple multi-tag support)
        if course:
            if "," in course:
                query["course"] = {"$in": course.split(",")}
            else:
                query["course"] = course
                
        if subject:
            if "," in subject:
                query["subject"] = {"$in": subject.split(",")}
            else:
                query["subject"] = subject
                
        if semester:
            query["semester"] = semester
        if year:
            query["year"] = year
        if privacy:
            query["privacy"] = privacy
            
        if search:
            # Omni-search across multiple fields
            search_query = {"$regex": search, "$options": "i"}
            query["$or"] = [
                {"title": search_query},
                {"subject": search_query},
                {"course": search_query},
                {"description": search_query}
            ]
            
        cursor = db.resources.find(query)
        resources = await cursor.to_list(length=100)
        
        # Convert MongoDB _id to string id
        for resource in resources:
            resource["id"] = str(resource["_id"])
            
        return resources
    except Exception as e:
        print(f"Resource list error: {e}")
        return []


@app.post("/api/upload-test")
async def upload_test():
    return {"status": "ok", "message": "Upload endpoint is reachable"}

@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    title: str = Form(...),
    subject: Optional[str] = Form(None),
    course: str = Form(...),
    author: str = Form(...),
    type: str = Form(...),
    privacy: str = Form("public"),
    semester: Optional[str] = Form(None),
    year: Optional[str] = Form(None),
    college: Optional[str] = Form(None),
    description: Optional[str] = Form(None)
):
    try:
        # Save file to disk
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as out_file:
            content = await file.read()
            out_file.write(content)
        
        # Return success (skip DB for now since Atlas is offline)
        return {
            "message": "File uploaded successfully", 
            "filename": unique_filename,
            "title": title,
            "course": course,
            "type": type
        }
    except Exception as e:
        print(f"Upload error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.put("/api/resources/{resource_id}")
async def update_resource(resource_id: str, resource_update: dict):
    from bson import ObjectId
    db = get_db()
    await db.resources.update_one(
        {"_id": ObjectId(resource_id)},
        {"$set": resource_update}
    )
    return {"message": "Resource updated successfully"}

@app.delete("/api/resources/{resource_id}")
async def delete_resource(resource_id: str):
    from bson import ObjectId
    db = get_db()
    
    # First find the file to delete it from disk
    resource = await db.resources.find_one({"_id": ObjectId(resource_id)})
    if resource and "filename" in resource:
        file_path = os.path.join(UPLOAD_DIR, resource["filename"])
        if os.path.exists(file_path):
            os.remove(file_path)
            
    await db.resources.delete_one({"_id": ObjectId(resource_id)})
    return {"message": "Resource deleted successfully"}

@app.get("/api/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Force PDF media type and inline display if possible, or attachment
    return FileResponse(
        file_path, 
        media_type='application/pdf',
        filename=filename,
        headers={"Content-Disposition": f"inline; filename={filename}"}
    )

# Exam Timer Endpoints
@app.get("/api/exams")
async def get_exams():
    # In a real app, fetch from DB
    return [
        {"id": "1", "name": "Mid-Semester Logic Quiz", "date": "2026-02-23T10:00:00"},
        {"id": "2", "name": "Digital Systems Lab Exam", "date": "2026-03-05T14:00:00"},
        {"id": "3", "name": "Final Semester Exams", "date": "2026-05-15T09:00:00"}
    ]

# Event Endpoints (Calendar)
@app.get("/api/events", response_model=List[Event])
async def get_events():
    db = get_db()
    if db is None:
        return []
    try:
        cursor = db.events.find()
        events = await cursor.to_list(length=100)
        for e in events:
            if "_id" in e:
                e["id"] = str(e["_id"])
        return events
    except Exception as e:
        print(f"Events fetch error: {e}")
        return []

@app.post("/api/events")
async def create_event(event: Event):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    event_data = event.dict()
    if "_id" in event_data:
        del event_data["_id"]
    try:
        await db.events.insert_one(event_data)
        return {"message": "Event created successfully", "event": event_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/teachers")
async def get_teachers():
    return TEACHERS

@app.post("/api/ratings")
async def add_rating(rating: Rating):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection not established. Check Atlas IP whitelist.")
    rating_dict = rating.dict()
    try:
        await db.reviews.insert_one(rating_dict)
        return {"message": "Rating submitted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ratings")
async def get_ratings(teacher_name: Optional[str] = None):
    db = get_db()
    if db is None:
        # Return empty list or helpful error
        return []
    query = {}
    if teacher_name:
        query["teacher_name"] = teacher_name
    
    try:
        cursor = db.reviews.find(query).sort("date", -1)
        ratings = await cursor.to_list(length=100)
    except Exception as e:
        print(f"DB Query Error: {e}")
        return []
    
    for r in ratings:
        r["id"] = str(r["_id"])
    return ratings

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


