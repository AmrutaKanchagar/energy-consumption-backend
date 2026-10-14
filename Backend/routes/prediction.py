from flask import Blueprint, jsonify, request

from services.ml_service import predict_energy_and_bill

prediction_bp = Blueprint("prediction", __name__)


@prediction_bp.post("/api/predict")
def predict():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "error": "Send a valid JSON object."
        }), 400

    required = [
        "voltage", "current", "hour",
        "day", "month", "weekday", "tariff"
    ]

    missing = [key for key in required if key not in data]

    if missing:
        return jsonify({
            "success": False,
            "error": "Missing required fields.",
            "missing_fields": missing,
        }), 400

    try:
        values = {key: float(data[key]) for key in required}

        if not all(__import__("math").isfinite(v)
                   for v in values.values()):
            raise ValueError("All values must be finite numbers.")

        for key in ("hour", "day", "month", "weekday"):
            if not values[key].is_integer():
                raise ValueError(f"{key} must be an integer.")

        values["hour"] = int(values["hour"])
        values["day"] = int(values["day"])
        values["month"] = int(values["month"])
        values["weekday"] = int(values["weekday"])

        if values["voltage"] <= 0 or values["current"] < 0:
            raise ValueError("Voltage must be positive and current non-negative.")

        if not 0 <= values["hour"] <= 23:
            raise ValueError("hour must be between 0 and 23.")

        if not 1 <= values["day"] <= 31:
            raise ValueError("day must be between 1 and 31.")

        if not 1 <= values["month"] <= 12:
            raise ValueError("month must be between 1 and 12.")

        if not 0 <= values["weekday"] <= 6:
            raise ValueError("weekday must be between 0 and 6.")

        if values["tariff"] < 0:
            raise ValueError("tariff cannot be negative.")

        result = predict_energy_and_bill(values)

        return jsonify({
            "success": True,
            "prediction": result,
        }), 200

    except (ValueError, TypeError) as error:
        return jsonify({
            "success": False,
            "error": str(error),
        }), 400

    except RuntimeError as error:
        return jsonify({
            "success": False,
            "error": str(error),
        }), 503

    except Exception:
        prediction_bp.logger.exception("Prediction failed")
        return jsonify({
            "success": False,
            "error": "Prediction failed. Check backend logs.",
        }), 500
