import pandas as pd
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

def main():
    # Paths
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    input_file = os.path.join(data_dir, 'processed_dataset.csv')
    model_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
        
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found. Please run process_features.py first.")
        return
    
    # Load
    print(f"Loading {input_file}...")
    df = pd.read_csv(input_file)
    
    # Split features and label
    X = df.drop(columns=['label'])
    y = df['label']
    
    # Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"Training set size: {len(X_train)}")
    print(f"Testing set size: {len(X_test)}")
    
    # Initialize Model
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    
    # Train
    model.fit(X_train, y_train)
    
    # Evaluate
    print("\n--- Evaluation Results ---")
    y_pred = model.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save Model
    model_path = os.path.join(model_dir, 'phishing_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    # Save Feature names for inference
    feature_names_path = os.path.join(model_dir, 'feature_names.pkl')
    with open(feature_names_path, 'wb') as f:
        pickle.dump(list(X.columns), f)
    
    print(f"\n--- Success ---")
    print(f"Model saved to: {model_path}")
    print(f"Feature names saved to: {feature_names_path}")

if __name__ == "__main__":
    main()
