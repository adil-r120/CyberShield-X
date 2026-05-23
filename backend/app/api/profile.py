from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.user import User
from jose import jwt, JWTError

# Must match auth.py
SECRET_KEY = "CYBERSHIELD_X_NEURAL_SECRET"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

router = APIRouter()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    # Return the currently authenticated user's data
    return {
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "department": current_user.department
    }

@router.put("/profile")
def update_profile(data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.name = data.get("name", current_user.name)
    current_user.role = data.get("role", current_user.role)
    current_user.email = data.get("email", current_user.email)
    current_user.department = data.get("department", current_user.department)
    
    db.commit()
    db.refresh(current_user)
    
    return {
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "department": current_user.department
    }
