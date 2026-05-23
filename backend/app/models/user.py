from sqlalchemy import Column, Integer, String
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Admin User")
    email = Column(String, unique=True, index=True, default="admin@cybershield.x")
    hashed_password = Column(String, nullable=True)
    role = Column(String, default="ADMIN")
    department = Column(String, default="Cyber Security Operations")
    avatar_url = Column(String, nullable=True)
