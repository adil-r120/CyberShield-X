import joblib
from functools import lru_cache
import pandas as pd
import os
import sys

# Ensure we can find the ml_model package regardless of where the server is started
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "..", ".."))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

# Try multiple possible paths for the model
POSSIBLE_PATHS = [
    os.path.abspath(os.path.join(BASE_DIR, "..", "..", "..", "ml_model", "models", "phishing_model.pkl")),
    os.path.abspath(os.path.join(os.getcwd(), "ml_model", "models", "phishing_model.pkl")),
    "ml_model/models/phishing_model.pkl"
]

MODEL_PATH = None
for path in POSSIBLE_PATHS:
    if os.path.exists(path):
        MODEL_PATH = path
        break

if not MODEL_PATH:
    raise FileNotFoundError(f"Intelligence Asset (Model) not found in paths: {POSSIBLE_PATHS}")

from ml_model.preprocessing.feature_extraction import extract_features

# Load model once using joblib for better performance
model = joblib.load(MODEL_PATH)

@lru_cache(maxsize=1000)
def predict_url(url: str):
    try:
        # Extract features
        features = extract_features(url)
        features_df = pd.DataFrame([features])

        # Best Practice: Ensure feature order is consistent
        expected_columns = [
            "url_length",
            "dot_count",
            "special_char_count",
            "has_https",
            "has_ip",
            "has_suspicious_word",
            "subdomain_count",
            "similarity_score",
            "domain_age_days"
        ]
        features_df = features_df[expected_columns]

        # Predict
        prediction = int(model.predict(features_df)[0])
        # [0][1] gives the probability of the positive class (phishing)
        probability = float(model.predict_proba(features_df)[0][1])

        return prediction, probability, features
    except Exception as e:
        print(f"ML INFERENCE ERROR: {e}")
        # Return safe defaults if inference fails
        return 0, 0.0, extract_features(url)
