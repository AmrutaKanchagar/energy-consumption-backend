import pandas as pd

# Dataset path
file_path = "data/raw/household_power_consumption.txt"

# Load raw dataset
df = pd.read_csv(
    file_path,
    sep=";",
    na_values="?"
)

print("Original Shape:")
print(df.shape)

# Combine Date and Time into one datetime column
df["Datetime"] = pd.to_datetime(
    df["Date"] + " " + df["Time"],
    dayfirst=True
)

# Convert numeric columns
numeric_columns = [
    "Global_active_power",
    "Global_reactive_power",
    "Voltage",
    "Global_intensity",
    "Sub_metering_1",
    "Sub_metering_2",
    "Sub_metering_3"
]

for column in numeric_columns:
    df[column] = pd.to_numeric(df[column], errors="coerce")

# Check missing values
print("\nMissing values before cleaning:")
print(df.isnull().sum())

# Remove rows containing missing values
df = df.dropna()

# Remove duplicate rows
df = df.drop_duplicates()

# Sort by datetime
df = df.sort_values("Datetime")

# Reset index
df = df.reset_index(drop=True)

# Save processed dataset
output_path = "data/processed/energy_data.csv"
df.to_csv(output_path, index=False)

print("\nFinal Shape:")
print(df.shape)

print("\nMissing values after cleaning:")
print(df.isnull().sum())

print("\nProcessed dataset saved to:")
print(output_path)