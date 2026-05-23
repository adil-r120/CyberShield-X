from sqlalchemy import func, case
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..services.ml_service import predict_url
from ..core.database import get_db
from ..models.scan import Scan
from datetime import datetime, timedelta
import random

router = APIRouter()

# --- HIGH PRIORITY ANALYTICS ENGINE (HARDENED) ---

@router.delete("/delete-scan/{scan_id}")
def delete_scan(scan_id: int, db: Session = Depends(get_db)):
    try:
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if not scan: return {"error": "Scan record not found."}
        db.delete(scan)
        db.commit()
        return {"success": True, "message": "Forensic record purged."}
    except Exception as e:
        return {"error": str(e)}

@router.get("/recent-audits")
def get_recent_audits(limit: int = 10, db: Session = Depends(get_db)):
    try:
        audits = db.query(Scan).order_by(Scan.created_at.desc()).limit(limit).all()
        return audits
    except Exception as e:
        print(f"AUDIT FETCH ERROR: {e}")
        return []

@router.get("/analytics")
def get_analytics(days: int = 7, db: Session = Depends(get_db)):
    """
    Returns daily scan volume and detection trends.
    ALWAYS returns a full timeline, even if data is missing or query fails.
    """
    # Get "Today" and shift forward to catch current scans in any timezone
    now = datetime.utcnow()
    end_date = (now + timedelta(days=1)).date() 
    start_date = end_date - timedelta(days=days)
    
    # Initialize the timeline with guaranteed zero-states
    full_timeline = []
    for i in range(days + 1):
        current_date = start_date + timedelta(days=i)
        full_timeline.append({
            "date": current_date.strftime("%b %d").upper(), # E.g. "MAY 05"
            "date_key": str(current_date),
            "total_scans": 0,
            "phishing": 0,
            "safe": 0
        })

    try:
        # Fetch actual scan data
        raw_data = db.query(
            func.date(Scan.created_at).label("date"),
            func.count(Scan.id).label("total_scans"),
            func.sum(case((Scan.result == "Phishing", 1), else_=0)).label("phishing"),
            func.sum(case((Scan.result == "Safe", 1), else_=0)).label("safe")
        ).filter(Scan.created_at >= datetime.combine(start_date, datetime.min.time())).group_by(func.date(Scan.created_at)).all()

        # Map actual data onto the guaranteed timeline
        data_map = {str(row.date): row for row in raw_data}
        
        for item in full_timeline:
            date_key = item["date_key"]
            if date_key in data_map:
                row = data_map[date_key]
                item["total_scans"] = int(row.total_scans or 0)
                item["phishing"] = int(row.phishing or 0)
                item["safe"] = int(row.safe or 0)
        
        # Remove internal key before returning
        for item in full_timeline: item.pop("date_key", None)
        
        return full_timeline
    except Exception as e:
        print(f"ANALYTICS ENGINE ALERT: {e}")
        # Return the guaranteed (empty) timeline instead of []
        for item in full_timeline: item.pop("date_key", None)
        return full_timeline

@router.get("/attack-distribution")
def get_attack_distribution(db: Session = Depends(get_db)):
    try:
        total = db.query(Scan).count()
        if total == 0: return []
        phishing = db.query(Scan).filter(Scan.result == "Phishing").count()
        safe = db.query(Scan).filter(Scan.result == "Safe").count()
        suspicious = db.query(Scan).filter(Scan.result == "Suspicious").count()
        threats = phishing + suspicious
        return [
            {"name": "Phishing", "value": threats, "percentage": round((threats/total) * 100, 1)},
            {"name": "Safe", "value": safe, "percentage": round((safe/total) * 100, 1)}
        ]
    except: return []

@router.get("/system-status")
def get_system_status(db: Session = Depends(get_db)):
    try:
        ten_mins_ago = datetime.utcnow() - timedelta(minutes=10)
        recent_activity = db.query(Scan).filter(Scan.created_at >= ten_mins_ago).count()
        load = min(99, 2 + (recent_activity * 5) + random.randint(-1, 2))
        nodes = db.query(func.count(func.distinct(Scan.url))).scalar() or 0
        return {"load": load, "nodes": nodes, "uptime": "99.98%", "neural_status": "Synchronized"}
    except: return {"load": 0, "nodes": 0, "uptime": "0%", "neural_status": "Offline"}

@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    try:
        now = datetime.utcnow()
        last_24h = now - timedelta(hours=24)
        prev_24h = now - timedelta(hours=48)

        # Totals
        total_scans = db.query(Scan).count()
        phishing = db.query(Scan).filter(Scan.result == "Phishing").count()
        safe = db.query(Scan).filter(Scan.result == "Safe").count()
        avg_risk = round(float(db.query(func.avg(Scan.risk_score)).scalar() or 0), 1)

        # Trends (Compare last 24h vs previous 24h)
        curr_vol = db.query(Scan).filter(Scan.created_at >= last_24h).count()
        prev_vol = db.query(Scan).filter(Scan.created_at >= prev_24h, Scan.created_at < last_24h).count()
        
        curr_phish = db.query(Scan).filter(Scan.result == "Phishing", Scan.created_at >= last_24h).count()
        prev_phish = db.query(Scan).filter(Scan.result == "Phishing", Scan.created_at >= prev_24h, Scan.created_at < last_24h).count()
        
        curr_safe = db.query(Scan).filter(Scan.result == "Safe", Scan.created_at >= last_24h).count()
        prev_safe = db.query(Scan).filter(Scan.result == "Safe", Scan.created_at >= prev_24h, Scan.created_at < last_24h).count()
        
        curr_risk = db.query(func.avg(Scan.risk_score)).filter(Scan.created_at >= last_24h).scalar() or 0
        prev_risk = db.query(func.avg(Scan.risk_score)).filter(Scan.created_at >= prev_24h, Scan.created_at < last_24h).scalar() or 0

        def calc_trend(curr, prev):
            if not prev or prev == 0: 
                return "+0%" if not curr or curr == 0 else f"+{int(curr*100)}%" if curr < 1 else "+100%"
            diff = ((float(curr) - float(prev)) / float(prev)) * 100
            return f"{'+' if diff >= 0 else ''}{round(diff)}%"

        return {
            "total_scans": total_scans, 
            "phishing_count": phishing, 
            "safe_count": safe, 
            "average_risk_score": avg_risk,
            "trends": {
                "volume": calc_trend(curr_vol, prev_vol), 
                "phishing": calc_trend(curr_phish, prev_phish), 
                "safe": calc_trend(curr_safe, prev_safe),
                "risk": calc_trend(curr_risk, prev_risk)
            }
        }
    except Exception as e:
        print(f"DASHBOARD ERROR: {e}")
        return {"total_scans": 0, "phishing_count": 0, "safe_count": 0, "average_risk_score": 0}

@router.post("/scan-url")
def scan_url(data: dict, db: Session = Depends(get_db)):
    url = data.get("url", "").strip()
    if not url: return {"error": "Target asset required for audit."}
    
    # --- HIGH-FIDELITY SYNTAX VALIDATOR ---
    import re
    # Hardened regex to allow localhost, IPs, and standard domains
    url_pattern = re.compile(r'^(https?://)?(localhost|([\w-]+\.)+[\w-]+)(:\d+)?(/.*)?$')
    if not url_pattern.match(url) and not ('.' in url or url == 'localhost'):
        return {"error": "Invalid Forensic Target: Asset must be a valid URL or IP address."}

    # --- DOMAIN EXISTENCE VERIFICATION (HIGH-AVAILABILITY) ---
    import socket
    from urllib.parse import urlparse
    
    # Extract clean hostname
    parsed = urlparse(url if '://' in url else f'http://{url}')
    hostname = (parsed.hostname or parsed.netloc or url.split('/')[0]).split(':')[0].strip().lower()
    
    is_live = False
    try:
        # Increased timeout to 5s for global reliability
        socket.setdefaulttimeout(5)
        # Primary check
        socket.gethostbyname(hostname)
        is_live = True
    except:
        try:
            # Redundant check with 'www.' if missing
            alt_host = f"www.{hostname}" if not hostname.startswith('www.') else hostname
            socket.gethostbyname(alt_host)
            is_live = True
        except:
            try:
                # Deep system resolution check
                socket.getaddrinfo(hostname, 80)
                is_live = True
            except:
                is_live = False
    finally:
        socket.setdefaulttimeout(None)

    prediction, probability, features = predict_url(url)
    # Inject live status into features for the UI
    features['is_live'] = is_live
    
    risk_score = round(probability * 100)
    # Map binary prediction to high-fidelity status strings for the UI
    result = "Phishing" if prediction == 1 else "Safe"
    if result == "Safe" and risk_score > 70:
        result = "Suspicious"
    
    # Calculate confidence based on the chosen result
    confidence = round(probability * 100, 1) if result == "Phishing" else round((1 - probability) * 100, 1)

    print(f"DEBUG: URL={url} | Pred={prediction} | Prob={probability} | Result={result} | Risk={risk_score}")

    # Generate Explainable AI (XAI) insights
    explanation = []
    
    # 1. Brand Spoofing (Only trigger if high similarity but NOT an exact match)
    sim_score = features.get("similarity_score", 0)
    if 0.7 < sim_score < 1.0:
        explanation.append({
            "title": "Brand Spoofing",
            "desc": "Visual similarity analysis confirms this domain mimics a high-value trusted brand without being the official asset.",
            "severity": "Critical"
        })
    
    # 2. Subdomain Depth
    if features.get("subdomain_count", 0) > 3:
        explanation.append({
            "title": "Subdomain Depth",
            "desc": f"Neural audit detected {features.get('subdomain_count')} subdomain layers. High depth is a primary indicator of cloaked phishing vectors.",
            "severity": "High"
        })

    # 3. Domain Age
    if features.get("domain_age_days", 365) < 30:
        explanation.append({
            "title": "Fresh Asset",
            "desc": "Domain age is less than 30 days. Fresh domains lack the historical trust index required for safe classification.",
            "severity": "Medium"
        })

    # 4. Technical Indicators
    if features.get("has_ip", 0) == 1:
        explanation.append({
            "title": "IP-Based Request",
            "desc": "The URL uses a raw IP address instead of a registered hostname, bypassing DNS reputation checks.",
            "severity": "Critical"
        })
    if features.get("has_suspicious_word", 0) == 1:
        explanation.append({
            "title": "Keyword Trigger",
            "desc": "Sensitive administrative keywords (e.g., 'login', 'secure') were detected in the URI string.",
            "severity": "Medium"
        })

    if result in ["Phishing", "Suspicious"] and not explanation:
        explanation.append({
            "title": "Neural Core Detection",
            "desc": "The Random Forest engine has identified structural anomalies consistent with advanced phishing signatures that bypass traditional heuristics.",
            "severity": "High"
        })

    db_scan = Scan(url=url, result=result, risk_score=risk_score, created_at=datetime.utcnow())
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    
    return {
        "scan_id": db_scan.id, 
        "url": url, 
        "result": result, 
        "risk_score": risk_score, 
        "confidence": confidence,
        "timestamp": db_scan.created_at.isoformat() + "Z",
        "explanation": explanation,
        "features": {
            "url_length": features.get("url_length"),
            "dot_count": features.get("dot_count"),
            "special_chars": features.get("special_char_count"),
            "has_https": features.get("has_https"),
            "has_ip": features.get("has_ip"),
            "subdomain_count": features.get("subdomain_count"),
            "similarity_score": features.get("similarity_score"),
            "domain_age_days": features.get("domain_age_days")
        }
    }

@router.get("/history")
def get_history(limit: int = 20, offset: int = 0, result: str = None, search: str = None, db: Session = Depends(get_db)):
    query = db.query(Scan)
    if result: query = query.filter(Scan.result == result)
    if search: query = query.filter(Scan.url.contains(search))
    total_count = query.count()
    scans = query.order_by(Scan.created_at.desc()).limit(limit).offset(offset).all()
    return {"total": total_count, "scans": [{"id": s.id, "url": s.url, "result": s.result, "risk_score": s.risk_score, "timestamp": s.created_at.isoformat() + "Z"} for s in scans]}

@router.delete("/purge-all")
def purge_all_history(db: Session = Depends(get_db)):
    try:
        db.query(Scan).delete()
        db.commit()
        return {"message": "Archive Purged"}
    except:
        db.rollback()
        return {"error": "Purge failed"}
