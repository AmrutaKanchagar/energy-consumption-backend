import pandas as pd
import os

# Load the existing bill dataset
input_path = "data/processed/bill_dataset.csv"

df = pd.read_csv(input_path)

# Create API-compatible dataset
api_bill_df = df[["Energy_kWh", "Tariff", "Bill"]].copy()

# Save the new dataset
output_path = "data/processed/api_bill_dataset.csv"
api_bill_df.to_csv(output_path, index=False)

print("API Bill Dataset Created Successfully!")
print("Shape:", api_bill_df.shape)
print("\nColumns:")
print(api_bill_df.columns.tolist())

print("\nFirst 5 rows:")
print(api_bill_df.head())

print("\nDataset saved to:")
print(output_path)