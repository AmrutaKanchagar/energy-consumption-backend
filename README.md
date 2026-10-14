# ⚡ AI-Based Smart Energy Consumption and Bill Prediction System

An AI-powered web application that predicts household energy consumption and estimates electricity bills using Machine Learning. The project uses historical household electricity consumption data to train predictive models and provides a Flask REST API for energy and bill predictions.

## 📌 Project Overview

Electricity consumption monitoring helps households understand their energy usage and estimate potential electricity costs.

This project uses machine learning to predict energy consumption based on input parameters such as voltage, current, time, date, and electricity tariff. The predicted consumption is then used to estimate the electricity bill.

## 🎯 Objectives

- Predict household energy consumption using Machine Learning.
- Estimate electricity costs based on energy consumption and tariff.
- Develop a REST API using Flask for model predictions.
- Provide a foundation for a web-based energy monitoring dashboard.
- Help users understand and analyze estimated energy usage.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Model development and backend programming |
| Pandas & NumPy | Data processing |
| Scikit-learn | Machine Learning |
| Joblib | Model serialization |
| Flask | REST API development |
| Flask-CORS | Cross-origin API access |
| Git & GitHub | Version control |

## 🧠 Machine Learning

The energy prediction pipeline evaluates multiple regression algorithms:

- Linear Regression
- Decision Tree Regressor
- Random Forest Regressor

### Model Evaluation Results

Results obtained during evaluation on a sample of 100,000 records:

| Algorithm | MAE | RMSE | R² Score |
|---|---:|---:|---:|
| Linear Regression | 0.0331 | 0.0475 | 0.9980 |
| Decision Tree | 0.0264 | 0.0495 | 0.9978 |
| Random Forest | 0.0229 | 0.0397 | 0.9986 |

The Random Forest model achieved the best results among the evaluated models. These metrics reflect the current evaluation setup and should be validated on independent data before real-world use.

## 📂 Project Structure

```text
energy-consumption-backend/
├── Backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── README.md
│   ├── routes/
│   │   └── prediction.py
│   ├── services/
│   │   └── ml_service.py
│   ├── config/
│   ├── models/
│   └── data/
├── Energy-Consumption-and-Prediction-main/
│   ├── src/
│   │   ├── load_data.py
│   │   ├── preprocess.py
│   │   ├── feature_engineering.py
│   │   ├── train_energy_model.py
│   │   ├── train_api_bill_model.py
│   │   ├── predict_energy.py
│   │   └── predict_energy_and_bill.py
│   ├── data/
│   └── models/
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/AmrutaKanchagar/energy-consumption-backend.git
cd energy-consumption-backend
```

### 2. Create a Python virtual environment

```bash
cd Backend
python -m venv .venv
```

Activate it on Linux or macOS:

```bash
source .venv/bin/activate
```

On Windows:

```bash
.venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Add trained models

Place the trained model files in the `Backend/models/` directory:

- `energy_model.pkl`
- `bill_model.pkl`

The model files are excluded from GitHub because of their size. Generate them using the project's training scripts or obtain them separately.

### 5. Start the Flask backend

From the `Backend/` directory, run:

```bash
python app.py
```

The development server runs on port `5000`.

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Project information |
| GET | `/api/health` | Check backend health |
| GET | `/api/models/status` | Check model availability |
| POST | `/api/predict` | Predict energy consumption and estimate the bill |

### Example Prediction Request

**Endpoint:** `POST /api/predict`

**Content-Type:** `application/json`

```json
{
  "voltage": 240,
  "current": 4,
  "hour": 19,
  "day": 14,
  "month": 10,
  "weekday": 2,
  "tariff": 8
}
```

### Example Response

```json
{
  "success": true,
  "prediction": {
    "predicted_power_kw": 0.9441,
    "predicted_energy_kwh": 0.0157,
    "tariff_per_kwh": 8.0,
    "predicted_bill_inr": 0.1259,
    "interval_minutes": 1
  }
}
```

Values are illustrative of a development test. Predictions depend on the supplied input and trained model.

## 🧪 Testing the API

Check backend health:

```bash
curl http://127.0.0.1:5000/api/health
```

Check model availability:

```bash
curl http://127.0.0.1:5000/api/models/status
```

Test a prediction:

```bash
curl -X POST http://127.0.0.1:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "voltage": 240,
    "current": 4,
    "hour": 19,
    "day": 14,
    "month": 10,
    "weekday": 2,
    "tariff": 8
  }'
```

## 📊 Current Features

- Household electricity data preprocessing.
- Feature engineering for time-based variables.
- Regression model training and evaluation.
- Energy consumption prediction through a Flask API.
- Electricity bill estimation using tariff information.
- API health and model availability endpoints.

## ⚠️ Limitations

- Predictions depend on the quality and representativeness of the training data.
- The current prediction endpoint estimates a one-minute energy interval.
- A one-minute prediction is not a monthly bill. Monthly estimates require an explicit usage-duration assumption and should not be treated as actual utility charges.
- Electricity bill predictions depend on the trained bill model and its training data.
- The model's evaluation scores do not guarantee equivalent real-world accuracy.
- The Flask development server is intended for development, not production deployment.

## 🚀 Future Enhancements

- Build a React-based dashboard for entering inputs and viewing predictions.
- Add prediction history and interactive consumption charts.
- Provide clearly labeled daily and monthly bill estimates.
- Add user authentication and persistent storage.
- Evaluate models using independent test data and real-world measurements.
- Deploy the application using production-ready services.

## 👩‍💻 Author

**Amruta Kanchagar**

GitHub: [AmrutaKanchagar](https://github.com/AmrutaKanchagar)

---

*Developed as an AI and Machine Learning project for household energy consumption prediction and electricity bill estimation.*