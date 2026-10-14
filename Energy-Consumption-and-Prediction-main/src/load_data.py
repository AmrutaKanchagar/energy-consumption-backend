import pandas as pd

# Dataset path
file_path = "data/raw/household_power_consumption.txt"

# Load dataset
df = pd.read_csv(
    file_path,
    sep=";",
    na_values="?"
)

# Display first 5 rows
print("First 5 rows:")
print(df.head())

# Display dataset shape
print("\nDataset Shape:")
print(df.shape)

# Display column names
print("\nColumn Names:")
print(df.columns.tolist())

# Display data types
print("\nData Types:")
print(df.dtypes)

# Display missing values
print("\nMissing Values:")
print(df.isnull().sum())