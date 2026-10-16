
from flask import Blueprint, jsonify, request

from services.sms_service import send_budget_alert

alerts_bp = Blueprint("alerts", __name__)


@alerts_bp.post("/api/alerts/budget")
def budget_alert():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "error": "Send a valid JSON object."
        }), 400

    try:
        phone_number = data.get("phone_number")
        budget = float(data["budget"])
        estimated_bill = float(data["estimated_monthly_bill"])

        if not isinstance(phone_number, str) or not phone_number.strip():
            raise ValueError("A mobile phone number is required.")

        if not all(map(
            __import__("math").isfinite,
            [budget, estimated_bill]
        )):
            raise ValueError("Bill and budget must be finite numbers.")

        if budget < 0 or estimated_bill < 0:
            raise ValueError("Bill and budget cannot be negative.")

        if estimated_bill <= budget:
            return jsonify({
                "success": True,
                "alert_sent": False,
                "message": "The estimated monthly bill is within budget."
            }), 200

        result = send_budget_alert(
            phone_number,
            estimated_bill,
            budget
        )

        return jsonify({
            "success": True,
            "alert_sent": result["sent"],
            "message": "SMS sent successfully." if result["sent"]
            else result["reason"],
            "message_sid": result.get("message_sid"),
        }), 200

    except (ValueError, TypeError, KeyError) as error:
        return jsonify({
            "success": False,
            "error": str(error)
        }), 400

    except RuntimeError as error:
        return jsonify({
            "success": False,
            "error": str(error)
        }), 503

    except Exception:
        alerts_bp.logger.exception("SMS alert failed")
        return jsonify({
            "success": False,
            "error": "Unable to send SMS. Check the backend logs."
        }), 502
