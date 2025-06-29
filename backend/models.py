from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Lead(Base):
    __tablename__ = "leads"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    company = Column(String)
    industry = Column(String)
    size = Column(Integer)
    source = Column(String)
    created_at = Column(DateTime)
    quality = Column(String, nullable=True) 
    summary = Column(String, nullable=True)

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True)
    user_id = Column(String)
    action = Column(String)
    event_metadata = Column(JSON)
    occurred_at = Column(DateTime, default=datetime.utcnow)
