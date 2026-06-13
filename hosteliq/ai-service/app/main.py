from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import uvicorn
import random
from datetime import datetime
import json
import urllib.request
import urllib.error
import os

app = FastAPI(title="HostelIQ AI Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- TF-IDF ML Model Initialization ---
# Simple training corpora
category_data = [
    # ELECTRICAL
    ("fan not working, switch board sparking, power cut", "ELECTRICAL"),
    ("light bulb fused tube light blinking", "ELECTRICAL"),
    ("socket plug not working heater load trip", "ELECTRICAL"),
    ("ac not cooling remote sensor broken", "ELECTRICAL"),
    ("geyser switch broken power socket burnt", "ELECTRICAL"),
    # WATER
    ("tap leaking continuous water flow in toilet", "WATER"),
    ("geyser not heating cold water only in shower", "WATER"),
    ("no water in tap washroom washbasin dry", "WATER"),
    ("drain pipe clogged water logging sink block", "WATER"),
    ("flush tank not working flush valve broken", "WATER"),
    # MESS
    ("stale food quality very poor in mess", "MESS"),
    ("hair insect found in dinner meal plate", "MESS"),
    ("mess counter long queue slow service", "MESS"),
    ("mess food is uncooked raw chapati salt is high", "MESS"),
    # CLEANING
    ("washroom dirty toilet needs cleaning acid wash", "CLEANING"),
    ("sweep corridors room floor needs mopping dustbin full", "CLEANING"),
    ("cobwebs in balcony window dust dirty rooms", "CLEANING"),
    ("garbage spilling overflow bin garbage collector missing", "CLEANING"),
    # FURNITURE
    ("bed frame broken leg cracked creaking sound", "FURNITURE"),
    ("study table drawer jammed lock broken", "FURNITURE"),
    ("chair support broke backrest loose desk wobbling", "FURNITURE"),
    ("wardrobe door hinge came off lock key missing", "FURNITURE"),
]

priority_data = [
    ("short circuit spark fire shock hazardous active wire", "URGENT"),
    ("flooding overflow water leakage pipe burst no water", "HIGH"),
    ("geyser shock current leakage door lock broken theft", "URGENT"),
    ("fan not rotating high heat summer study table broken", "MEDIUM"),
    ("food stale bad smell unhygienic kitchen mess delay", "HIGH"),
    ("room dirty dustbin smells clean floor", "LOW"),
    ("balcony cobweb wifi slow drawer key lost", "LOW"),
    ("ac remote battery replace tube light dim blinking", "MEDIUM"),
]

# Train Category pipeline
cat_texts, cat_labels = zip(*category_data)
category_model = make_pipeline(TfidfVectorizer(ngram_range=(1, 2)), MultinomialNB(alpha=0.5))
category_model.fit(cat_texts, cat_labels)

# Train Priority pipeline
pri_texts, pri_labels = zip(*priority_data)
priority_model = make_pipeline(TfidfVectorizer(ngram_range=(1, 2)), MultinomialNB(alpha=0.5))
priority_model.fit(pri_texts, pri_labels)

# Map category to default ETA
ETA_MAPPING = {
    "ELECTRICAL": 4,
    "WATER": 6,
    "MESS": 12,
    "CLEANING": 24,
    "FURNITURE": 48,
    "OTHER": 24
}

class ComplaintRequest(BaseModel):
    title: str
    description: str

class ChatRequest(BaseModel):
    message: str
    userId: str

def call_gemini(prompt: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set.")
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }
    
    req_body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_body,
        headers=headers,
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["candidates"][0]["content"]["parts"][0]["text"]
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        raise Exception(f"Gemini API HTTP Error {e.code}: {error_body}")
    except Exception as e:
        raise Exception(f"Gemini API Error: {str(e)}")

@app.post("/api/v1/ai/classify")
def classify_complaint(req: ComplaintRequest):
    text = f"{req.title} {req.description}".lower()
    
    # Predict Category
    cat_pred = category_model.predict([text])[0]
    cat_probs = category_model.predict_proba([text])[0]
    cat_conf = float(np.max(cat_probs))
    
    # Predict Priority
    pri_pred = priority_model.predict([text])[0]
    pri_probs = priority_model.predict_proba([text])[0]
    pri_conf = float(np.max(pri_probs))
    
    # Adjust Category / Priority fallback check
    if cat_conf < 0.2:
        cat_pred = "OTHER"
    
    eta_hours = ETA_MAPPING.get(cat_pred, 24)
    if pri_pred == "URGENT":
        eta_hours = max(2, eta_hours // 4)
    elif pri_pred == "HIGH":
        eta_hours = max(4, eta_hours // 2)

    return {
        "category": cat_pred,
        "priority": pri_pred,
        "eta_hours": eta_hours,
        "confidence": round((cat_conf + pri_conf) / 2.0, 2)
    }

@app.get("/api/v1/ai/occupancy-prediction")
def get_occupancy_prediction():
    # Simulate occupancy forecasting using dynamic projections
    months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    # Predict a rising occupancy pattern for the new semester
    occupancy_rates = [78.2, 80.5, 94.2, 95.8, 96.1, 95.9, 95.5]
    predictions = [{"month": m, "predictedOccupancy": r} for m, r in zip(months, occupancy_rates)]
    return {
        "status": "success",
        "predicted_trend": predictions,
        "insights": "Occupancy will spike to 94.2% in August due to the incoming freshman batch."
    }

@app.get("/api/v1/ai/mess-crowd-alert")
def get_mess_crowd_alert():
    now = datetime.now()
    hour = now.hour
    
    if 8 <= hour <= 9:
        status = "HIGHLY_CROWDED"
        density = 88
        advice = "Avoid going now. Crowds peak during breakfast. Try after 9:15 AM."
    elif 12 <= hour <= 13:
        status = "HIGHLY_CROWDED"
        density = 92
        advice = "Lunch rush in progress. Order queue is currently >15 mins."
    elif 19 <= hour <= 21:
        status = "CRITICAL"
        density = 95
        advice = "Dinner peak hour. Mess is at maximum capacity."
    else:
        status = "LOW_CROWD"
        density = 25
        advice = "Great time to visit. Almost empty."

    return {
        "status": status,
        "crowd_density_percentage": density,
        "advice": advice,
        "timestamp": now.isoformat()
    }

@app.post("/api/v1/ai/chat-assistant")
def chat_assistant(req: ChatRequest):
    timestamp_str = datetime.now().isoformat()
    # Log the AI Request
    print(f"[HOSTELIQ LOG] Timestamp: {timestamp_str} | User ID: {req.userId} | Action: AI Request: '{req.message}' | Status: RECEIVED")
    
    msg = req.message.lower()
    
    # Check if Gemini key is available
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        err_msg = "Error: GEMINI_API_KEY environment variable is not configured on the server. Please set the API key to activate the AI Assistant."
        print(f"[HOSTELIQ LOG] Timestamp: {datetime.now().isoformat()} | User ID: {req.userId} | Action: AI Response | Status: FAILURE - Missing API Key")
        return {
            "response": err_msg,
            "timestamp": datetime.now().isoformat()
        }

    # Determine live crowd context
    is_mess_crowd_query = any(word in msg for word in ["crowd", "busy", "rush", "full", "people", "line", "crowded"]) and any(word in msg for word in ["mess", "dining", "food", "canteen"])
    
    live_crowd_context = "Live crowd data is currently unavailable."
    if is_mess_crowd_query:
        try:
            crowd_data = get_mess_crowd_alert()
            if crowd_data:
                live_crowd_context = f"Current Status: {crowd_data['status']}, Density: {crowd_data['crowd_density_percentage']}%, Advice: {crowd_data['advice']}"
        except Exception:
            live_crowd_context = "Live crowd data is currently unavailable."

    # Build System prompt
    system_prompt = f"""You are the HostelIQ Smart Assistant, an AI chatbot for the HostelIQ Smart Hostel Operating System.
You help students with queries about hostel rules, curfews, mess timings, internet setup, and more.

Here is the official hostel context information you MUST use to answer the questions:
1. Curfew & Gate Timings:
- Boys curfew/gate close time is 10:30 PM.
- Girls curfew/gate close time is 9:30 PM.
- Late entry or outings require a valid gate pass approved by their Warden.
- Late entry requests must be submitted via the parent portal at least 4 hours in advance.

2. Leave Application Instructions:
- To apply for leave: Go to the 'Leave Requests' tab in the Student Dashboard, select your start and end dates, reason, and destination.
- Once your Warden/Admin approves it, a QR-coded gate pass will be automatically generated on your dashboard.

3. Wifi/Internet Setup:
- Student Wifi Network: Connect to SSID 'MUJ-Student-Wifi'.
- Login: Use your enrollment number as username and your portal password.
- Issues: If the internet speed is low or disconnected, raise a complaint under the 'OTHER' category so the IT desk can assist.

4. Mess & Dining Schedule:
- Breakfast: 7:30 AM - 9:30 AM
- Lunch: 12:00 PM - 2:00 PM
- Snacks: 5:00 PM - 6:30 PM
- Dinner: 7:30 PM - 9:30 PM
- Weekly menu: The menu is updated weekly on the dashboard under Mess Analytics.

5. Hostel Wardens:
- Block A Warden: Dr. Ramesh Sharma (Ext: 201)
- Block B Warden: Prof. Meenakshi Sharma (Ext: 202)
- Block C Warden: Dr. Amit Patel (Ext: 203)
- Emergency Warden Desk Number: 0141-3999100

6. Live Mess Crowd Data:
{live_crowd_context}

Guidelines:
- Answer the user's question accurately using ONLY the context above.
- If the question is about live mess crowd status or density, use the Live Mess Crowd Data section.
- CRITICAL: If the user asks about live mess crowd status and the context says "Live crowd data is currently unavailable", you MUST respond exactly with: "Live crowd data is currently unavailable." (Do NOT print the mess timings instead).
- Keep answers polite, brief, and helpful.
- If a question cannot be answered using the provided context, politely state that you do not have that information and suggest contacting the hostel helpdesk.
"""

    prompt = f"{system_prompt}\n\nUser Question: {req.message}\nAnswer:"
    
    try:
        res = call_gemini(prompt)
        print(f"[HOSTELIQ LOG] Timestamp: {datetime.now().isoformat()} | User ID: {req.userId} | Action: AI Response | Status: SUCCESS")
        return {
            "response": res.strip(),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"[HOSTELIQ LOG] Timestamp: {datetime.now().isoformat()} | User ID: {req.userId} | Action: AI Response | Status: FAILURE - {str(e)}")
        return {
            "response": "Sorry, I am having trouble connecting to the AI brain right now. Please try again later.",
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
