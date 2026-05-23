import pickle
import os
from preprocessing.feature_extraction import extract_features

# Paths
# This script is located in ml_model/, model is in ml_model/models/
base_dir = os.path.dirname(__file__)
model_path = os.path.join(base_dir, 'models', 'phishing_model.pkl')

if not os.path.exists(model_path):
    print(f"Error: {model_path} not found. Please run train_model.py first.")
    exit()

# Load model
with open(model_path, "rb") as f:
    model = pickle.load(f)

# URL to test
url = "http://secure-login-bank.xyz"

print(f"\n--- 🛡️ CyberShield X: AI Scanner ---")
print(f"URL: {url}")

# Extract features
features = extract_features(url)

# Predict
# Ensure we pass a 2D array to predict
import pandas as pd

features_df = pd.DataFrame([features])

# Ensure feature order is consistent
expected_columns = [
    "url_length",
    "dot_count",
    "special_char_count",
    "has_https",
    "has_ip",
    "has_suspicious_word"
]
features_df = features_df[expected_columns]

prediction = model.predict(features_df)

print("-" * 35)
print("Prediction:", "⚠️  PHISHING" if prediction[0] == 1 else "✅ SAFE")
print("-" * 35)
