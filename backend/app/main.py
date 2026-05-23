from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.scan import router as scan_router
from .api.profile import router as profile_router
from .api.auth import router as auth_router
from .api.smishing import router as smishing_router
from .core.database import engine, Base
from .models.scan import Scan
from .models.user import User # Ensure model is registered

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize default admin user
from .core.database import SessionLocal
from .api.auth import get_password_hash
import sys

db = SessionLocal()
try:
    admin_user = db.query(User).filter(User.email == "cybershield@gmail.com").first()
    if not admin_user:
        print("NEURAL LOG: Creating default admin user...", file=sys.stderr, flush=True)
        admin_user = User(
            name="Admin User",
            email="cybershield@gmail.com",
            hashed_password=get_password_hash("Cyber@123"),
            role="ADMIN",
            department="Cyber Security Operations",
            avatar_url=None
        )
        db.add(admin_user)
        db.commit()
        print("NEURAL LOG: Default admin user created - email: cybershield@gmail.com, password: Cyber@123", file=sys.stderr, flush=True)
    else:
        print(f"NEURAL LOG: Admin user already exists: {admin_user.email}", file=sys.stderr, flush=True)
except Exception as e:
    print(f"NEURAL LOG: Error creating admin user: {str(e)}", file=sys.stderr, flush=True)
    db.rollback()
finally:
    db.close()

# Manual migration check for SQLite (handles schema changes)
from sqlalchemy import text
with engine.connect() as conn:
    result = conn.execute(text("PRAGMA table_info(users)")).fetchall()
    existing_columns = [row[1] for row in result]
    
    columns = ["hashed_password", "department", "avatar_url", "role"]
    for col in columns:
        if col not in existing_columns:
            print(f"NEURAL LOG: Patching database schema - Adding {col}...")
            conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} VARCHAR"))
    conn.commit()

app = FastAPI(title="CyberShield X API")

# Configure CORS for maximum compatibility with Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173", # Vite default
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan_router, prefix="/api")
app.include_router(profile_router, prefix="/api")
app.include_router(smishing_router, prefix="/api")
app.include_router(auth_router, prefix="/api/auth")

@app.get("/")
def home():
    return {"message": "CyberShield_X API running"}

@app.get("/health")
def health():
    return {"status": "OK"}
