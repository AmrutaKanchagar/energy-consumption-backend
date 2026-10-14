import joblib
import pandas as pd

# Load trained bill model
model_path = "models/bill_model.pkl"
model = joblib.load(model_path)

# Example input
energy_consumption = 0.070267
tariff = 8.0

# Prepare input
input_data = pd.DataFrame({
    "Energy_kWh": [energy_consumption],
    "Tariff": [tariff]
})

# Predict bill
predicted_bill = model.predict(input_data)[0]

print("===================================")
print("BILL PREDICTION")
print("===================================")

print(f"Energy Consumption : {energy_consumption:.6f} kWh")
print(f"Tariff             : ₹{tariff:.2f}/kWh")
print(f"Predicted Bill     : ₹{predicted_bill:.4f}")