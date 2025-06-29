# Lead Qualifier Dashboard

This project is a full-stack Lead Qualification Dashboard that allows users to view, filter, and analyze leads, enriched with LLM-based intelligence. Built using **FastAPI** (Python) for the backend and **React + TypeScript** for the frontend, it includes interactive data visualizations, real-time event tracking, and a modular architecture to support rapid iteration.

---

## Key Features

### Lead Data Dashboard

* Filter leads by **industry** and **maximum company size**
* Switch between **table**, **pie chart**, and **bar chart** views
* View leads' **names, companies, sources, and creation dates**

### LLM-Based Enrichment

* Uses **OpenAI GPT-3.5** to:

  * Classify lead quality as **High**, **Medium**, or **Low**
  * Generate a **1-sentence company summary**
* Results displayed on the frontend for every enriched lead

### Event Tracking + SQL Insights

* Tracks frontend actions (e.g., filters, view toggles)
* Logs events to **SQLite** with metadata
* Run SQL queries to extract insights like:

```sql
SELECT metadata->>'filterType' AS filter,
       COUNT(*) AS uses
FROM events
WHERE action = 'filter'
GROUP BY filter
ORDER BY uses DESC
LIMIT 3;
```
![SQL result](https://github.com/Prakash-2610/lead_qualifier/blob/main/SQL%20query%201.png?raw=True) 
---

---

## Setup Instructions

### Backend (FastAPI + SQLite + OpenAI)

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt

# Set your OpenAI key
set OPENAI_API_KEY=your-key-here

# Start server
uvicorn app:app --reload
```

### Frontend (React + Vite + TypeScript)

```bash
cd frontend
npm install
npm run dev
```

Then visit: `http://localhost:5173`

---

## Sample Enriched Lead JSON

```json
{
  "id": 1,
  "name": "Alice Smith",
  "company": "Acme Corp",
  "industry": "Technology",
  "size": 120,
  "source": "Organic",
  "created_at": "2025-06-21T11:29:08.79Z",
  "quality": "High",
  "summary": "Acme Corp is a leading technology company focused on scalable cloud solutions."
}
```

---

## Future Enhancements

* Lead detail view with modal popup
* CSV export functionality
* Caching for enrichment API
* User login and role-based access

---

## Author Notes

This project was built to demonstrate full-stack engineering capability including:

* API design and request handling
* Integration of third-party LLM APIs
* Clean frontend component structure
* Writing production-ready SQL queries

It showcases the power of combining structured data with AI enrichment and frontend observability for smarter business dashboards.

---
