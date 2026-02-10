# AI-Powered Breast Cancer Detection

## Abstract
This project uses Deep Learning (CNN) to classify mammogram images as Benign or Malignant. It features a secure login system, patient history database, and a user-friendly web interface.

## Tech Stack
- **Frontend:** Streamlit
- **Backend:** Python
- **AI Model:** TensorFlow/Keras
- **Database:** SQLite

## Architecture
1. **User** uploads image via Streamlit UI.
2. **Backend** preprocesses image (resize/normalize).
3. **CNN Model** predicts probability.
4. **Database** stores timestamp, result, and username.

## How to Run
1. Install dependencies: `pip install -r requirements.txt`
2. Train model: `python train.py`
3. Run App: `streamlit run app.py`