API Reference
Local development base URL: http://127.0.0.1:5000
GET /api/health
Checks whether the Flask API is responding.
Example response:
{
  "message": "Flask backend is running",
  "status": "healthy"
}
Expected HTTP status in the tested environment: 200 OK.
GET /api/models/status
Checks whether the saved model artifacts are available.
Example response:
{
  "bill_model_available": true,
  "energy_model_available": true,
  "ready_for_predictions": true
}
POST /api/predict
Predicts energy use and estimated bill from the supplied features.
Headers
Content-Type: application/json
Request body
{
  "voltage": 240,
  "current": 4,
  "hour": 14,
  "day": 15,
  "month": 10,
  "weekday": 3,
  "tariff": 8
}
Field	Description
voltage	Voltage input
current	Current input
hour	Hour-of-day feature
day	Day-of-month feature
month	Month feature
weekday	Weekday feature; use the encoding expected by the ML preprocessing pipeline
tariff	Tariff in INR per kWh


Example success response
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
Example values came from a manual test and are not guaranteed constants.
curl example
curl -X POST http://127.0.0.1:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"voltage":240,"current":4,"hour":14,"day":15,"month":10,"weekday":3,"tariff":8}'
Units and interpretation
- predicted_power_kw: kilowatts.
- predicted_energy_kwh: kilowatt-hours for the returned prediction interval.
- predicted_bill_inr: interval-level estimated cost in Indian rupees.
- tariff_per_kwh: tariff supplied to the prediction request.
- interval_minutes: prediction interval in minutes; observed value is 1.
Do not label an interval-level prediction as a complete daily/monthly bill. A monthly projection requires explicit assumptions about daily use and billing days and is not a utility-issued bill.
Error responses
The precise error JSON schema should be confirmed from Backend/app.py. Clients should handle non-2xx HTTP responses and avoid assuming every response contains a prediction object.