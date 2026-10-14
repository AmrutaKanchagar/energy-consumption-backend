# ⚡ Energy Consumption and Bill Prediction — Backend

## 📌 Overview

The backend of the **AI-Based Smart Energy Consumption and Bill Prediction System** is developed using Python and Flask. It provides REST API endpoints to predict household energy consumption and estimate electricity bills using trained Machine Learning models.

The backend receives input parameters such as voltage, current, date, time, and electricity tariff, processes the inputs, and returns prediction results in JSON format.

## 🎯 Objectives

- Develop REST APIs for energy consumption prediction.
- Integrate trained Machine Learning models with Flask.
- Estimate electricity bills based on predicted energy consumption and tariff.
- Validate user inputs and handle API errors.
- Provide health-check and model-status endpoints.

## 🛠️ Technologies Used

- **Python** — Backend programming
- **Flask** — REST API framework
- **Flask-CORS** — Cross-origin resource sharing
- **Pandas & NumPy** — Data processing
- **Scikit-learn** — Machine Learning
- **Joblib** — Loading trained models

## 📂 Backend Structure

```text
Backend/
├── app.py
├── requirements.txt
├── .env.example
├── .gitignore
├── README.md
├── routes/
│   ├── __init__.py
│   └── prediction.py
├── services/
│   ├── __init__.py
│   └── ml_service.py
├── config/
│   └── __init__.py
├── models/
│   ├── energy_model.pkl
│   └── bill_model.pkl
└── data/
    └── raw/
```

**Note:** Trained model files and datasets are excluded from GitHub because of their size. The model files must be generated or obtained separately and placed in `Backend/models/`.

## ⚙️ Installation and Setup

### 1. Navigate to the backend

```bash
cd Backend
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate the environment on Linux or macOS:

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

Ensure the following files are available in the `models/` directory:

- `energy_model.pkl`
- `bill_model.pkl`

Without these files, prediction requests will not work.

### 5. Run the Flask server

```bash
python app.py
```

The development server runs at:

`http://127.0.0.1:5000`

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Returns project information |
| GET | `/api/health` | Checks backend health |
| GET | `/api/models/status` | Checks model availability |
| POST | `/api/predict` | Predicts energy consumption and estimates the bill |

## 🧪 Testing the API

### Health check

```bash
curl http://127.0.0.1:5000/api/health
```

### Check model status

```bash
curl http://127.0.0.1:5000/api/models/status
```

### Energy and bill prediction

**Endpoint:** `POST /api/predict`

**Content-Type:** `application/json`

Request body:

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

Example response:

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

Actual prediction values depend on the input and trained models.

## 📊 Prediction Output

The prediction API returns:

- **Predicted Power:** Estimated power in kW.
- **Predicted Energy:** Estimated energy consumption in kWh for the one-minute interval.
- **Tariff:** Electricity price per kWh supplied in the request.
- **Predicted Bill:** Estimated cost returned by the trained bill model.
- **Interval:** The prediction represents a one-minute interval.

The one-minute prediction is not a monthly electricity bill. Monthly estimates require additional usage assumptions.

## 🛡️ Error Handling

The backend validates required fields and numeric inputs. It returns appropriate HTTP errors for invalid requests, missing models, and unexpected prediction failures.

## ⚠️ Limitations

- Predictions depend on the quality of the training data.
- Trained models must be available locally.
- The development server is not intended for production deployment.
- Predictions should be validated against real-world household measurements before practical use.

## 🚀 Future Enhancements

- Integrate the backend with a React frontend.
- Add prediction history and database storage.
- Provide daily and monthly consumption estimates.
- Deploy using a production-ready WSGI server.
- Add automated API tests and monitoring.

## 👩‍💻 Author

**Amruta Kanchagar**

GitHub: [AmrutaKanchagar](https://github.com/AmrutaKanchagar)

---

*Backend module for the AI-Based Smart Energy Consumption and Bill Prediction System.*