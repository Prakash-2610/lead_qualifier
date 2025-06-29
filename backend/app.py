from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Lead, Event
import csv
from datetime import datetime
import os
from dateutil import parser
from openai import OpenAI
from fastapi import Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

app = FastAPI()

# CORS (allows frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setting up the database in SQLite
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, '..', 'leads.db')}"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(engine)

# Defining request schema
class EventIn(BaseModel):
    userId: str = "unknown"
    action: str
    metadata: dict = {}
    timestamp: str = datetime.utcnow().isoformat()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#The API key is hardcoded here. Please encode your API key here. 
client = OpenAI(api_key="Put_Your_openai_API_key_here")


def enrich_lead(lead):
    prompt = f"""
You are a lead enrichment assistant.

Given:
- Name: {lead.name}
- Company: {lead.company}
- Industry: {lead.industry}
- Size: {lead.size}

1. Classify this lead as 'High', 'Medium', or 'Low' quality based on size and industry.
2. Generate a one-line professional description of the company.

Respond in JSON format:
{{"quality": "...", "summary": "..."}}
"""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        content = response.choices[0].message.content
        enrichment = eval(content)  
        return enrichment
    except Exception as e:
        print("Enrichment failed:", e)
        return {"quality": "Unknown", "summary": "No summary available."}


# Loads leads.csv into the database (only if empty)
def load_leads_from_csv():
    session = SessionLocal()
    if session.query(Lead).count() == 0:
        with open("../data/leads.csv", newline="") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Parse the date string into a datetime object
                created_at = parser.parse(row["created_at"].replace("Z", ""))
                lead = Lead(
                    id=int(row["id"]),
                    name=row["name"],
                    company=row["company"],
                    industry=row["industry"],
                    size=int(row["size"]),
                    source=row["source"],
                    created_at=created_at
                )
                enrichment = enrich_lead(lead)
                lead.quality = enrichment.get("quality")
                lead.summary = enrichment.get("summary")
                session.add(lead)
        session.commit()   
    session.close()

load_leads_from_csv()


# Routes

@app.get("/api/leads")
def get_leads(industry: str = None, size: int = None):
    session = SessionLocal()
    query = session.query(Lead)
    if industry:
        query = query.filter(Lead.industry == industry)
    if size:
        query = query.filter(Lead.size <= size)
    leads = query.all()
    session.close()
# Returns a list of leads in JSON-serializable dictionary format 
    return [
        {
            "id": lead.id,
            "name": lead.name,
            "company": lead.company,
            "industry": lead.industry,
            "size": lead.size,
            "source": lead.source,
            "created_at": lead.created_at.isoformat(),
            "quality": lead.quality,
            "summary": lead.summary
        }
        for lead in leads
    ]



@app.post("/api/events")
async def log_event(event: EventIn, db: Session = Depends(get_db)):
    new_event = Event(
        user_id=event.userId,
        action=event.action,
        event_metadata=event.metadata,
        occurred_at=datetime.fromisoformat(event.timestamp.replace("Z", ""))
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return {"status": "event logged"}

