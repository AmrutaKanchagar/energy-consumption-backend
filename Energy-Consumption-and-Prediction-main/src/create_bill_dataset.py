import pandas as pd
import os

# --------------------------------------------------
# Load Feature-Engineered Dataset
# --------------------------------------------------

input_path = "data/processed/energy_features.csv"

df = pd.read_csv(input_path)

print("Original Dataset Shape:")
print(df.shape)


# --------------------------------------------------
# Define Electricity Tariff
# --------------------------------------------------

tariff = 8.0   # ₹ per kWh


# --------------------------------------------------
# Calculate Energy Consumption
# --------------------------------------------------
# Global_active_power is measured in kW.
# Each record represents approximately one minute.
# Therefore, energy consumed in one record is:
#
# Energy (kWh) = Power (kW) × Time (hours)
#              = Global_active_power × (1/60)

df["Energy_kWh"] = df["Global_active_power"] / 60


# --------------------------------------------------
# Calculate Electricity Bill
# --------------------------------------------------

df["Tariff"] = tariff

df["Bill"] = df["Energy_kWh"] * df["Tariff"]


# --------------------------------------------------
# Display Bill Information
# --------------------------------------------------

print("\nTariff:")
print(f"₹{tariff} per kWh")

print("\nEnergy Consumption Statistics:")
print(df["Energy_kWh"].describe())

print("\nBill Statistics:")
print(df["Bill"].describe())


# --------------------------------------------------
# Save Bill Dataset
# --------------------------------------------------

output_directory = "data/processed"
os.makedirs(output_directory, exist_ok=True)

output_path = os.path.join(
    output_directory,
    "bill_dataset.csv"
)

df.to_csv(output_path, index=False)

print("\nBill dataset saved successfully:")
print(output_path)

print("\nFinal Dataset Shape:")
print(df.shape)

print("\nFirst 5 Rows:")
print(
    df[
        [
            "Global_active_power",
            "Energy_kWh",
            "Tariff",
            "Bill"
        ]
    ].head()
)