Technical Documentation
1. System overview
The AI-Based Smart Energy Consumption and Bill Prediction System is organized into three main parts:
1. React + Vite frontend (Frontend/) — UI, input collection, prediction display, dashboard, history, and settings.
2. Flask backend (Backend/) — REST endpoints, model availability checks, request handling, and inference through saved model artifacts.
3. ML source project (Energy-Consumption-and-Prediction-main/) — data loading, preprocessing, feature engineering, training, prediction, and evaluation scripts.
The ML source directory is intentionally kept separate from the application backend and frontend.
2. Architecture and request flow
User
  |
  v
React + Vite UI (Frontend/)
  |  /api/* requests
  v
Vite development proxy
  |  http://127.0.0.1:5000
  v
Flask API (Backend/app.py)
  |
  +--> model status / health checks
  |
  +--> energy model artifact: Backend/models/energy_model.pkl
  |
  +--> bill model artifact: Backend/models/bill_model.pkl
  |
  v
JSON response to frontend
  |
  +--> prediction results shown in UI
  +--> prediction history saved in browser localStorage
The diagram describes the current development architecture. The browser-side history and settings are not stored in a backend database.
3. Components
3.1 Frontend
Known files/components include:
- src/App.jsx: application shell, sidebar navigation, dashboard layout, and page selection.
- src/App.css: shared layout and page-specific styles.
- src/pages/Predict.jsx: prediction inputs, API request, results, and monthly estimate UI.
- src/pages/History.jsx: displays stored prediction records.
- src/pages/Settings.jsx: edits and saves settings and can clear stored history.
- src/services/api.js: helper functions for API requests, including prediction, health, and model status.
Other page components may exist in the current workspace. Check Frontend/src/ for the definitive list.
3.2 Backend
- Backend/app.py: Flask application and routes.
- Backend/models/energy_model.pkl: trained energy model artifact.
- Backend/models/bill_model.pkl: trained bill model artifact.
- Backend/.venv/: local Python environment; should not be version-controlled.
The exact internal module/function layout of the current app.py should be documented from the source if it changes.
3.3 ML source
The ML source project includes scripts for loading data, preprocessing, feature engineering, training, bill dataset generation, prediction, and evaluation. Known filenames include:
- load_data.py
- preprocess.py
- feature_engineering.py
- train_energy_model.py
- train_bill_model.py
- train_api_bill_model.py
- create_bill_dataset.py
- create_api_bill_dataset.py
- predict_energy.py
- predict_bill.py
- predict_energy_and_bill.py
- evaluation.py
- eda.py
The exact order and prerequisites for running all ML scripts should be taken from the ML project's README and scripts. The application can use existing trained artifacts without retraining, provided the expected artifacts are present and compatible.
4. REST API reference
Base URL in local development: http://127.0.0.1:5000
4.1 Health
GET /api/health
Purpose: determine whether the Flask application is responding.
Example response:
{
  "message": "Flask backend is running",
  "status": "healthy"
}
Expected status for the tested environment: HTTP 200.
4.2 Model status
GET /api/models/status
Purpose: report whether the energy and bill model artifacts were loaded and are available.
Example response:
{
  "bill_model_available": true,
  "energy_model_available": true,
  "ready_for_predictions": true
}
The actual response may contain additional fields if the backend implementation changes.
4.3 Prediction
POST /api/predict
Header:
Content-Type: application/json
Request example:
{
  "voltage": 240,
  "current": 4,
  "hour": 14,
  "day": 15,
  "month": 10,
  "weekday": 3,
  "tariff": 8
}
Fields:
Field	Meaning	Example
voltage	Voltage input supplied to the model	240
current	Current input supplied to the model	4
hour	Hour-of-day feature	14
day	Day-of-month feature	15
month	Month feature	10
weekday	Weekday feature using the model's expected encoding	3
tariff	Electricity tariff in INR per kWh	8


Use the weekday encoding expected by the ML pipeline; do not assume a different numbering convention without checking preprocessing code.
Example response based on a successful test:
{
  "prediction": {
    "interval_minutes": 1,
    "predicted_bill_inr": 0.12365023442083102,
    "predicted_energy_kwh": 0.015456279302603845,
    "predicted_power_kw": 0.9273767581562307,
    "tariff_per_kwh": 8.0
  },
  "success": true
}
The numeric values are illustrative outputs from one test request and are not guaranteed to repeat exactly across model versions or environments.
4.4 Prediction result interpretation
- predicted_power_kw: predicted power in kilowatts.
- predicted_energy_kwh: predicted energy in kilowatt-hours for the model/API interval.
- predicted_bill_inr: estimated bill amount associated with the prediction interval and tariff/model logic.
- tariff_per_kwh: tariff used by the request.
- interval_minutes: duration associated with the energy/bill prediction; the tested response returned 1.
The API response should not be presented as a full monthly utility bill. Monthly estimates displayed by the frontend are projections based on assumptions and user settings.
5. Browser storage and UI synchronization
The current frontend uses these browser local-storage keys:
Key	Purpose
smartEnergySettings	Stores user preferences, including tariff and usage assumptions
smartEnergyHistory	Stores prediction history


The Settings page dispatches custom events including:
- smartEnergySettingsUpdated
- smartEnergyHistoryUpdated
The prediction page listens for settings updates so its tariff/usage assumptions can stay synchronized. A browser storage event is also used where implemented, but the storage event does not normally fire in the same document that made the change; the custom event supports same-tab updates.
Because storage is browser-side:
- records are not automatically synced between browsers/devices;
- clearing site data can remove settings/history;
- the storage origin must remain the same for data to appear.
6. Model artifacts and ML workflow
The backend expects model artifacts at:
Backend/models/energy_model.pkl
Backend/models/bill_model.pkl
The model artifacts were created by the ML workflow and made available to the backend. Do not regenerate or overwrite them unless intentionally retraining and validating the model.
The ML project uses the household power-consumption dataset in the development workflow. Data preparation and training scripts are kept under Energy-Consumption-and-Prediction-main/src/. Check the ML project's own README and source scripts for the exact dataset schema, feature order, preprocessing sequence, and model evaluation process.
Artifact compatibility is important: the feature names/order, preprocessing, and dependency versions used for inference must match those used to train the saved models.
7. Development setup
Backend
cd Backend
source .venv/bin/activate
python app.py
Expected development port: 5000.
Frontend
Open a second terminal:
cd Frontend
npm install
npm run dev -- --host 0.0.0.0
Expected Vite development port: 5173 unless configured differently. In Codespaces, open the forwarded port URL. The Vite proxy should forward /api to http://127.0.0.1:5000.
Quick smoke tests
curl -i http://127.0.0.1:5000/api/health
curl -i http://127.0.0.1:5000/api/models/status
curl -X POST http://127.0.0.1:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"voltage":240,"current":4,"hour":14,"day":15,"month":10,"weekday":3,"tariff":8}'
8. Verification status
Manual checks reported as passing in the current environment:
- Health endpoint returns HTTP 200.
- Model status reports energy and bill models available.
- Prediction endpoint returns success: true with prediction values.
- React prediction page displays returned results.
- Prediction is added to History.
- Saved tariff synchronizes with the prediction form.
- Settings and history persist after refresh.
- Dashboard cards, charts, and navigation display.
Still to verify:
- Empty, negative, and out-of-range input validation.
- Clear error behavior when the Flask API is unavailable, plus recovery after restart.
- Mobile/narrow viewport layout.
- Whether dashboard metrics use live stored predictions or sample/demo data.
- Automated test coverage (no automated test suite has been confirmed).
9. Error handling and troubleshooting
API request fails from frontend
1. Confirm Flask is running.
2. Test GET /api/health in a terminal.
3. Check the Vite proxy target in Frontend/vite.config.*.
4. Check browser developer tools and Flask terminal output.
Model unavailable
1. Confirm both .pkl files exist in Backend/models/.
2. Review model-loading errors in the Flask terminal.
3. Check that the backend virtual environment contains compatible libraries.
Prediction returns incorrect or unexpected values
1. Confirm the request fields and units.
2. Verify the expected weekday encoding and feature order in the ML code.
3. Confirm the model artifact matches the preprocessing pipeline.
4. Do not compare a one-minute interval estimate directly with a daily or monthly bill.
History/settings missing after refresh
1. Check that the same browser profile and forwarded URL/origin are used.
2. Confirm browser site storage was not cleared.
3. Inspect localStorage in browser developer tools for the keys listed above.
10. Security, deployment, and maintenance
- Never commit secrets or populated environment files.
- Keep .venv/ and node_modules/ out of version control.
- Check repository hosting limits before committing the raw dataset or large model artifacts.
- Only load trusted .pkl/joblib files.
- Flask's development server is for development; use an appropriate production server and secure configuration for deployment.
- Validate API input on the server even if the frontend performs validation.
- If history must be shared across devices, implement a server-side persistence layer; local storage alone does not provide this.
- Keep the ML source project unchanged when working only on UI/API/documentation tasks.