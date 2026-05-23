import pandas as pd
import os

# Define the base data directory relative to this script
base_dir = os.path.dirname(__file__)
data_dir = os.path.abspath(os.path.join(base_dir, '..', 'data', 'Website phishing detection'))

# Load datasets
df1 = pd.read_csv(os.path.join(data_dir, "dataset3.csv"))
df2 = pd.read_csv(os.path.join(data_dir, "dataset2.csv"))

print(f"Dataset 3 shape: {df1.shape}")
print(f"Dataset 2 shape: {df2.shape}")

# Standardize Columns
# For dataset3: Rename 'status' to 'label'
df1 = df1.rename(columns={"status": "label"})

# For dataset2: Rename 'phishing' to 'label'
df2 = df2.rename(columns={"phishing": "label"})

# Note: dataset3 already has 'url' column. 
# dataset2 does not have a raw 'url' column, it only has pre-extracted features.

print("\n--- Standardized Dataset 3 Columns ---")
print(df1.columns.tolist()[:5], "... [label]")

# Merge Datasets
df = pd.concat([df1, df2], ignore_index=True)

print("\n--- Merge Summary ---")
print("Merged shape:", df.shape)

# Remove Missing Values
# Note: This will drop rows from dataset2 since it doesn't have a 'url' column
df = df.dropna(subset=["url", "label"])

print("\n--- After Dropping Missing Values ---")
print("Shape before duplicates removal:", df.shape)

# Remove Duplicates
df = df.drop_duplicates(subset=["url"])

print("\n--- After Dropping Duplicates ---")
print("Shape before label fix:", df.shape)

# Fix Labels
# Convert labels to 0 and 1
df["label"] = df["label"].replace({
    "phishing": 1,
    "legitimate": 0,
    -1: 1
})

# Ensure only binary labels remain
df = df[df["label"].isin([0, 1])]

print("\n--- After Fixing Labels ---")
print("Value counts:\n", df["label"].value_counts())

# Remove Invalid URLs
df = df[df["url"].str.startswith(("http://", "https://"), na=False)]

# Balance Dataset (Undersampling majority class)
phishing = df[df["label"] == 1]
safe = df[df["label"] == 0]

min_count = min(len(phishing), len(safe))

df_balanced = pd.concat([
    phishing.sample(min_count, random_state=42),
    safe.sample(min_count, random_state=42)
])

# Shuffle the balanced dataset
df_balanced = df_balanced.sample(frac=1, random_state=42).reset_index(drop=True)

print("\n--- Balanced Dataset ---")
print(df_balanced["label"].value_counts())
print("Balanced shape:", df_balanced.shape)

# Save Clean Dataset
output_path = os.path.join(data_dir, "..", "cleaned_dataset.csv")
df_balanced.to_csv(output_path, index=False)

print(f"\n--- Success ---")
print(f"Cleaned dataset saved to: {os.path.abspath(output_path)}")
