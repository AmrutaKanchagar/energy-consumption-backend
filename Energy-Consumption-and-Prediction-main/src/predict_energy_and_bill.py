import joblib
import pandas as pd

# ==========================================
# LOAD ENERGY MODEL
# ==========================================

energy_model_path = "models/energy_model.pkl"
saved_energy_model = joblib.load(energy_model_path)

energy_model = saved_energy_model["model"]
energy_features = saved_energy_model["features"]


# ==========================================
# LOAD BILL MODEL
# ==========================================

bill_model_path = "models/bill_model.pkl"
bill_model = joblib.load(bill_model_path)


# ==========================================
# USER INPUT
# ==========================================

voltage = float(input("Enter Voltage (V): "))
current = float(input("Enter Current (A): "))
hour = int(input("Enter Hour (0-23): "))
day = int(input("Enter Day (1-31): "))
month = int(input("Enter Month (1-12): "))
weekday = int(input("Enter Weekday (0=Monday, 6=Sunday): "))

tariff = float(input("Enter Tariff (₹/kWh): "))


# ==========================================
# DERIVED FEATURES
# ==========================================

weekend = 1 if weekday >= 5 else 0
peak_hour = 1 if 18 <= hour <= 21 else 0


# ==========================================
# ENERGY MODEL INPUT
# ==========================================

energy_input = pd.DataFrame([{
    "Voltage": voltage,
    "Global_intensity": current,
    "Hour": hour,
    "Day": day,
    "Month": month,
    "Weekday": weekday,
    "Weekend": weekend,
    "Peak_Hour": peak_hour
}])


# ==========================================
# PREDICT ENERGY
# ==========================================

predicted_power_kw = energy_model.predict(
    energy_input[energy_features]
)[0]


# ==========================================
# CONVERT kW TO kWh
# 1-minute interval
# ==========================================

energy_kwh = predicted_power_kw / 60


# ==========================================
# BILL MODEL INPUT
# ==========================================

bill_input = pd.DataFrame({
    "Energy_kWh": [energy_kwh],
    "Tariff": [tariff]
})


# ==========================================
# PREDICT BILL
# ==========================================

predicted_bill = bill_model.predict(bill_input)[0]


# ==========================================
# DISPLAY RESULTS
# ==========================================

print("\n===================================")
print("ENERGY & BILL PREDICTION")
print("===================================")

print(f"Predicted Power       : {predicted_power_kw:.4f} kW")
print(f"Energy Consumption    : {energy_kwh:.6f} kWh")
print(f"Tariff                : ₹{tariff:.2f}/kWh")
print(f"Predicted Bill        : ₹{predicted_bill:.4f}")

print("===================================")