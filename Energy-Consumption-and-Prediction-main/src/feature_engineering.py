import pandas as pd

# Load processed dataset
file_path = "data/processed/energy_data.csv"

df = pd.read_csv(file_path)

print("Original Shape:")
print(df.shape)

# Convert Datetime column to datetime format
df["Datetime"] = pd.to_datetime(df["Datetime"])

# Extract time-based features
df["Hour"] = df["Datetime"].dt.hour
df["Day"] = df["Datetime"].dt.day
df["Month"] = df["Datetime"].dt.month
df["Weekday"] = df["Datetime"].dt.weekday

# Weekend: 1 = Weekend, 0 = Weekday
df["Weekend"] = (df["Weekday"] >= 5).astype(int)

# Peak Hour: 1 = 6 PM to 10 PM, 0 = Other hours
df["Peak_Hour"] = df["Hour"].between(18, 21).astype(int)

# Save feature-engineered dataset
output_path = "data/processed/energy_features.csv"

df.to_csv(output_path, index=False)

print("\nFeature-engineered Shape:")
print(df.shape)

print("\nNew Features:")
print([
    "Hour",
    "Day",
    "Month",
    "Weekday",
    "Weekend",
    "Peak_Hour"
])

print("\nFirst 5 rows:")
print(df.head())

print("\nFeature-engineered dataset saved to:")
print(output_path)