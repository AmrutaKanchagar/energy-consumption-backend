
from pathlib import Path

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"


@app.get("/")
def home():
    return jsonify({
        "project": "AI-Based Smart Energy Consumption and Bill Prediction System",
        "message": "Backend API is running",
        "status": "success"
    }), 200


@app.get("/api/health")
def health():
    return jsonify({"status": "healthy"}), 200


@app.get("/api/models/status")
def model_status():
    energy_model = MODEL_DIR / "energy_model.pkl"
    bill_model = MODEL_DIR / "bill_model.pkl"

    energy_available = energy_model.is_file()
    bill_available = bill_model.is_file()

    return jsonify({
        "energy_model_available": energy_available,
        "bill_model_available": bill_available,
        "ready_for_predictions": energy_available and bill_available
    }), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
