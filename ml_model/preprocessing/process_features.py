import pandas as pd
import os
from feature_extraction import extract_features

# Define paths relative to the script location
base_dir = os.path.dirname(__file__)
input_path = os.path.abspath(os.path.join(base_dir, "..", "data", "cleaned_dataset.csv"))
output_path = os.path.abspath(os.path.join(base_dir, "..", "data", "processed_dataset.csv"))

if not os.path.exists(input_path):
    print(f"Error: {input_path} not found. Please run clean_data.py first.")
    exit()

print(f"Loading {input_path}...")
df = pd.read_csv(input_path)

# Extract features
print("Starting feature extraction (this may take a moment)...")
feature_list = []

for url in df["url"]:
    feature_list.append(extract_features(url))

features_df = pd.DataFrame(feature_list)

# Ensure feature order is consistent
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

# Add labels
features_df["label"] = df["label"]

# Save processed data
print(f"Saving processed data to {output_path}...")
features_df.to_csv(output_path, index=False)

print("\n--- Feature extraction completed! ---")
print(f"Processed dataset shape: {features_df.shape}")
