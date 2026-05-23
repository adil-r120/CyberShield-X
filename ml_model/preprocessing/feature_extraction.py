import pandas as pd
import os
import re
from urllib.parse import urlparse
import difflib

# Suspicious keywords
SUSPICIOUS_WORDS = ["login", "secure", "verify", "bank", "update", "free", "account"]
# Known brands for similarity check
KNOWN_BRANDS = ["google", "paypal", "amazon", "microsoft", "apple", "netflix", "facebook"]

def extract_features(url):
    """
    Core feature extraction logic for a single URL.
    """
    features = {}
    url_str = str(url)
    
    # URL length
    features["url_length"] = len(url_str)

    # Count dots
    features["dot_count"] = url_str.count(".")

    # Special characters
    features["special_char_count"] = len(re.findall(r"[!@#$%^&*(),?\":{}|<>]", url_str))

    # HTTPS check
    features["has_https"] = 1 if url_str.startswith("https") else 0

    # IP address check
    features["has_ip"] = 1 if re.match(r"http[s]?://\d+\.\d+\.\d+\.\d+", url_str) else 0

    # Suspicious keywords (O(n))
    features["has_suspicious_word"] = 0
    for word in SUSPICIOUS_WORDS:
        if word in url_str.lower():
            features["has_suspicious_word"] = 1
            break

    # NEW FEATURES
    try:
        parsed = urlparse(url_str if "://" in url_str else "http://" + url_str)
        domain = parsed.netloc
        
        # 1. Subdomain count
        # parts = domain.split('.') -> e.g. "sub.example.com" -> ["sub", "example", "com"] -> count = 3
        features["subdomain_count"] = len(domain.split(".")) if domain else 0
        
        # 2. Similarity Score (compare with known brands)
        max_similarity = 0
        domain_name = domain.split('.')[0] if domain else ""
        for brand in KNOWN_BRANDS:
            similarity = difflib.SequenceMatcher(None, brand, domain_name).ratio()
            if similarity > max_similarity:
                max_similarity = similarity
        features["similarity_score"] = round(max_similarity, 3)

        # 3. Domain Age Days (Mock: using hash of domain for deterministic consistency)
        # In real world, this would use a WHOIS API
        if domain:
            features["domain_age_days"] = abs(hash(domain)) % 3650 # 0 to 10 years
        else:
            features["domain_age_days"] = 0

    except Exception:
        features["subdomain_count"] = 0
        features["similarity_score"] = 0
        features["domain_age_days"] = 0

    return features

def main():
    # Paths
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    input_file = os.path.join(data_dir, 'cleaned_dataset.csv')
    output_file = os.path.join(data_dir, 'featured_dataset.csv')
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found. Please run clean_data.py first.")
        return
    
    # Load
    print(f"Loading {input_file}...")
    df = pd.read_csv(input_file)
    
    # Extract Features
    print("Extracting core features from URLs...")
    feature_list = df['url'].apply(extract_features)
    feature_df = pd.DataFrame(feature_list.tolist())
    
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
    feature_df = feature_df[expected_columns]
    
    # Combine with original dataframe (keeping url and label)
    final_df = pd.concat([df, feature_df], axis=1)
    
    # Save
    print(f"Saving featured dataset to {output_file}...")
    final_df.to_csv(output_file, index=False)
    
    print("\n--- Feature Extraction Complete ---")
    print(f"Final dataset shape: {final_df.shape}")
    print(f"Features created: {list(feature_df.columns)}")

if __name__ == "__main__":
    main()
