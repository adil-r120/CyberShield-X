from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from ..core.database import Base

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    result = Column(String)
    risk_score = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
