# CyberShield X: Machine Learning Model

This directory contains the machine learning components for the CyberShield X phishing detection system.

## Data Structure

The training data is organized as follows:

- `data/Phishing URL dataset/`: Contains `phishing_url_dataset.csv`.
- `data/Website phishing detection/`: Contains multiple datasets (`dataset1.csv` through `dataset6.csv`) for broader website analysis.

## Roadmap

1. **Setup**: Install dependencies using `pip install -r requirements.txt`.
2. **Preprocessing**: Clean and tokenize URLs and website features.
3. **Feature Engineering**: Extract relevant security indicators.
4. **Training**: Train and evaluate models (e.g., Random Forest, XGBoost, or Neural Networks).
5. **Integration**: Export models for use in the CyberShield X FastAPI backend.
