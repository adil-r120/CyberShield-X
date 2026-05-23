from datetime import datetime, timedelta
import bcrypt
from jose import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.user import User
from pydantic import BaseModel

# Security Configuration
SECRET_KEY = "CYBERSHIELD_X_NEURAL_SECRET"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

router = APIRouter()

class AuthData(BaseModel):
    email: str
    password: str
    name: str = None

class LoginData(BaseModel):
    email: str
    password: str

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password[:72].encode("utf-8"),
            hashed_password.encode("utf-8"),
        )
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(
        password[:72].encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/signup")
def signup(data: AuthData, db: Session = Depends(get_db)):
    print(f"NEURAL LOG: Induction request for identifier: {data.email}")
    db_user = db.query(User).filter(User.email == data.email).first()
    if db_user:
        print(f"NEURAL LOG: Conflict detected for identifier: {data.email}")
        raise HTTPException(status_code=400, detail="Identity already registered")
    
    try:
        user = User(
            name=data.name or "New Officer",
            email=data.email,
            role="ADMIN",
            department="Security Operations"
        )
        user.hashed_password = get_password_hash(data.password)
        
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"NEURAL LOG: Induction successful for: {data.email}")
    except Exception as e:
        db.rollback()
        print(f"NEURAL LOG: Critical registration failure: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")
    
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "user": {
        "name": user.name,
        "email": user.email,
        "role": user.role
    }}

@router.post("/login")
def login(data: LoginData, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not getattr(user, 'hashed_password', None) or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "user": {
        "name": user.name,
        "email": user.email,
        "role": user.role
    }}
