
from flask import Flask, jsonify
from flask_cors import CORS

from routes.prediction import prediction_bp
from services.ml_service import get_model_status

app = Flask(__name__)
CORS(app)

# Register prediction routes
app.register_blueprint(prediction_bp)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "project": "AI-Based Smart Energy Consumption and Bill Prediction System",
        "message": "Backend API is running successfully",
        "status": "success"
    }), 200


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "message": "Flask backend is running"
    }), 200


@app.route("/api/models/status", methods=["GET"])
def model_status():
    return jsonify(get_model_status()), 200


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": "API endpoint not found"
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
