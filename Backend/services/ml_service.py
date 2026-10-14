from pathlib import Path

import joblib
import pandas as pd

BACKEND_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BACKEND_DIR / "models"

ENERGY_MODEL_PATH = MODEL_DIR / "energy_model.pkl"
BILL_MODEL_PATH = MODEL_DIR / "bill_model.pkl"


def get_model_status():
    return {
        "energy_model_available": ENERGY_MODEL_PATH.is_file(),
        "bill_model_available": BILL_MODEL_PATH.is_file(),
        "ready_for_predictions": (
            ENERGY_MODEL_PATH.is_file()
            and BILL_MODEL_PATH.is_file()
        ),
    }


def predict_energy_and_bill(data):
    status = get_model_status()

    if not status["ready_for_predictions"]:
        raise RuntimeError(
            "Trained models are missing. Place energy_model.pkl "
            "and bill_model.pkl inside Backend/models."
        )

    energy_saved = joblib.load(ENERGY_MODEL_PATH)
    bill_model = joblib.load(BILL_MODEL_PATH)

    energy_model = energy_saved["model"]
    features = energy_saved["features"]

    hour = data["hour"]
    weekday = data["weekday"]

    input_row = {
        "Voltage": data["voltage"],
        "Global_intensity": data["current"],
        "Hour": hour,
        "Day": data["day"],
        "Month": data["month"],
        "Weekday": weekday,
        "Weekend": int(weekday >= 5),
        "Peak_Hour": int(18 <= hour <= 21),
    }

    energy_input = pd.DataFrame([input_row])[features]
    predicted_power = float(energy_model.predict(energy_input)[0])

    # The existing ML project assumes one-minute intervals.
    energy_kwh = predicted_power / 60.0

    bill_input = pd.DataFrame([{
        "Energy_kWh": energy_kwh,
        "Tariff": data["tariff"],
    }])

    predicted_bill = float(bill_model.predict(bill_input)[0])

    return {
        "predicted_power_kw": predicted_power,
        "predicted_energy_kwh": energy_kwh,
        "tariff_per_kwh": data["tariff"],
        "predicted_bill_inr": predicted_bill,
        "interval_minutes": 1,
    }
