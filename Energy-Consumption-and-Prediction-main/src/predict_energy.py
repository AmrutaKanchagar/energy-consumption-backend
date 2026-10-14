import joblib
import pandas as pd

# Load trained model
model_path = "models/energy_model.pkl"

saved_model = joblib.load(model_path)

model = saved_model["model"]
features = saved_model["features"]


# Take user input
voltage = float(input("Enter Voltage (V): "))
current = float(input("Enter Current (A): "))
hour = int(input("Enter Hour (0-23): "))
day = int(input("Enter Day (1-31): "))
month = int(input("Enter Month (1-12): "))
weekday = int(input("Enter Weekday (0=Monday, 6=Sunday): "))


# Create derived features
weekend = 1 if weekday >= 5 else 0
peak_hour = 1 if 18 <= hour <= 21 else 0


# Create input data
input_data = pd.DataFrame([{
    "Voltage": voltage,
    "Global_intensity": current,
    "Hour": hour,
    "Day": day,
    "Month": month,
    "Weekday": weekday,
    "Weekend": weekend,
    "Peak_Hour": peak_hour
}])


# Make prediction
prediction = model.predict(input_data[features])


print("\nPredicted Global Active Power:")
print(f"{prediction[0]:.4f} kW")