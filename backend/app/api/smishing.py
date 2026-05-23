from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import re

router = APIRouter()

class SmishingRequest(BaseModel):
    message: str
    sender: str = "Unknown"

class SmishingResult(BaseModel):
    is_smishing: bool
    risk_score: float
    urgency_detected: bool
    links_found: list[str]
    threat_indicators: list[str]
    recommendation: str
    forensic_details: dict

# Advanced forensic patterns
URGENCY_KEYWORDS = ["urgent", "suspended", "immediately", "action", "blocked", "restricted", "final", "last chance", "alert"]
FINANCIAL_KEYWORDS = ["bank", "payment", "invoice", "refund", "tax", "irs", "crypto", "bitcoin", "wallet", "login", "password", "otp", "transaction", "unauthorized"]
SENSITIVE_PATTERNS = {
    "card_pattern": r"\b(?:\d[ -]*?){13,16}\b",
    "otp_pattern": r"\b\d{4,6}\b",
    "account_mask": r"\b(X|x){4,}\d{4}\b",
    "phone_mask": r"\b\d{3}-\d{3}-\d{4}\b"
}

def calculate_text_risk(text: str) -> tuple[float, list[str], dict]:
    score = 0.0
    indicators = []
    details = {"linguistic": 0, "technical": 0, "psychological": 0}
    text_lower = text.lower()
    
    # 1. Linguistic Analysis
    urgency_matches = [word for word in URGENCY_KEYWORDS if word in text_lower]
    if urgency_matches:
        score += 25.0
        details["psychological"] += 40
        indicators.append(f"High-pressure urgency: '{urgency_matches[0]}'")
    
    financial_matches = [word for word in FINANCIAL_KEYWORDS if word in text_lower]
    if financial_matches:
        score += 20.0
        details["linguistic"] += 30
        indicators.append(f"Financial lure detected: '{financial_matches[0]}'")
    
    # 2. Pattern Matching (Social Engineering)
    if re.search(SENSITIVE_PATTERNS["account_mask"], text):
        score += 15.0
        indicators.append("Fake account masking (Spoofing tactic)")
    
    if re.search(SENSITIVE_PATTERNS["otp_pattern"], text) and ("verify" in text_lower or "code" in text_lower):
        score += 35.0
        indicators.append("OTP/Verification code request (High Risk)")

    # 3. Technical Indicators
    shorteners = ["bit.ly", "t.co", "tinyurl", "is.gd", "buff.ly", "shorte.st", "cutt.ly"]
    found_shorteners = [s for s in shorteners if s in text_lower]
    if found_shorteners:
        score += 30.0
        details["technical"] += 50
        indicators.append(f"Obfuscated link ({found_shorteners[0]})")
        
    return min(score, 100.0), indicators, details

@router.post("/smishing/analyze", response_model=SmishingResult)
async def analyze_smishing(request: SmishingRequest):
    # 1. Extract Links
    url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
    links = re.findall(url_pattern, request.message)
    
    # 2. Deep Scan
    risk_score, indicators, details = calculate_text_risk(request.message)
    
    # 3. Adjust for links
    if len(links) > 0:
        risk_score += 10.0
        details["technical"] += 30
        # Check for HTTP (unsecured)
        if any(link.startswith("http://") for link in links):
            risk_score += 15.0
            indicators.append("Unsecured HTTP link detected")
            
    is_smishing = risk_score > 40.0
    
    recommendation = "Message appears safe. No critical markers found."
    if risk_score > 75:
        recommendation = "CRITICAL THREAT: This is a verified Smishing attack. Block the sender immediately."
    elif risk_score > 40:
        recommendation = "CAUTION: Message contains deceptive patterns. Verify source manually."
        
    return SmishingResult(
        is_smishing=is_smishing,
        risk_score=risk_score,
        urgency_detected=details["psychological"] > 0,
        links_found=links,
        threat_indicators=indicators,
        recommendation=recommendation,
        forensic_details=details
    )
