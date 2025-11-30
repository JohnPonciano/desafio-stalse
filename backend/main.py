from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import json
import os
from datetime import datetime
from typing import Optional
import requests

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "sqlite:///./db.sqlite"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    customer_name = Column(String)
    channel = Column(String)
    subject = Column(String)
    status = Column(String, default="open")
    priority = Column(String, default="medium")

Base.metadata.create_all(bind=engine)

# Seeds
seeds = [
    {"customer_name": "Alice", "channel": "email", "subject": "Issue with login", "status": "open", "priority": "high"},
    {"customer_name": "Bob", "channel": "phone", "subject": "Refund request", "status": "closed", "priority": "medium"},
    {"customer_name": "Charlie", "channel": "chat", "subject": "Product question", "status": "open", "priority": "low"},
    {"customer_name": "Diana", "channel": "email", "subject": "Bug report", "status": "open", "priority": "high"},
    {"customer_name": "Eve", "channel": "phone", "subject": "Account setup", "status": "closed", "priority": "medium"},
    {"customer_name": "Frank", "channel": "chat", "subject": "Feature request", "status": "open", "priority": "low"},
    {"customer_name": "Grace", "channel": "email", "subject": "Password reset", "status": "closed", "priority": "high"},
    {"customer_name": "Henry", "channel": "phone", "subject": "Billing issue", "status": "open", "priority": "medium"},
    {"customer_name": "Ivy", "channel": "chat", "subject": "Technical support", "status": "open", "priority": "low"},
    {"customer_name": "Jack", "channel": "email", "subject": "Order status", "status": "closed", "priority": "high"},
    {"customer_name": "Kate", "channel": "phone", "subject": "Return policy", "status": "open", "priority": "medium"},
    {"customer_name": "Leo", "channel": "chat", "subject": "App crash", "status": "open", "priority": "low"},
    {"customer_name": "Mia", "channel": "email", "subject": "Subscription", "status": "closed", "priority": "high"},
    {"customer_name": "Noah", "channel": "phone", "subject": "Delivery delay", "status": "open", "priority": "medium"},
    {"customer_name": "Olivia", "channel": "chat", "subject": "User guide", "status": "closed", "priority": "low"},
    {"customer_name": "Peter", "channel": "email", "subject": "Data export", "status": "open", "priority": "high"},
    {"customer_name": "Quinn", "channel": "phone", "subject": "Payment failed", "status": "open", "priority": "medium"},
    {"customer_name": "Rose", "channel": "chat", "subject": "Feedback", "status": "closed", "priority": "low"},
    {"customer_name": "Sam", "channel": "email", "subject": "API access", "status": "open", "priority": "high"},
    {"customer_name": "Tina", "channel": "phone", "subject": "Account deletion", "status": "closed", "priority": "medium"},
]

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    if db.query(Ticket).count() == 0:
        for seed in seeds:
            ticket = Ticket(**seed)
            db.add(ticket)
        db.commit()
    db.close()

@app.get("/tickets")
def get_tickets():
    db = SessionLocal()
    tickets = db.query(Ticket).all()
    db.close()
    return [{"id": t.id, "created_at": t.created_at.isoformat(), "customer_name": t.customer_name, "channel": t.channel, "subject": t.subject, "status": t.status, "priority": t.priority} for t in tickets]

from pydantic import BaseModel

class TicketUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None

@app.patch("/tickets/{ticket_id}")
def update_ticket(ticket_id: int, update: TicketUpdate):
    db = SessionLocal()
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        db.close()
        raise HTTPException(status_code=404, detail="Ticket not found")
    if update.status:
        ticket.status = update.status
    if update.priority:
        ticket.priority = update.priority
    db.commit()
    # Send webhook if status closed or priority high
    if ticket.status == 'closed' or ticket.priority == 'high':
        try:
            requests.post('http://localhost:5678/webhook/ticket-update', json={'ticket_id': ticket.id, 'status': ticket.status, 'priority': ticket.priority})
        except:
            pass  # Ignore if n8n not running
    db.close()
    return {"message": "Ticket updated"}

@app.get("/metrics")
def get_metrics():
    metrics_path = "../data/processed/metrics.json"
    if not os.path.exists(metrics_path):
        raise HTTPException(status_code=404, detail="Metrics not found")
    with open(metrics_path, "r") as f:
        return json.load(f)