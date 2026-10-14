import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# --------------------------------------------------
# Load Feature-Engineered Dataset
# --------------------------------------------------

file_path = "data/processed/energy_features.csv"

df = pd.read_csv(file_path)

print("Dataset Shape:")
print(df.shape)

print("\nDataset Columns:")
print(df.columns.tolist())

print("\nFirst 5 Rows:")
print(df.head())

print("\nStatistical Summary:")
print(df.describe())

print("\nMissing Values:")
print(df.isnull().sum())


# --------------------------------------------------
# Create a sample for visualization
# --------------------------------------------------

sample_df = df.sample(
    n=min(100000, len(df)),
    random_state=42
)


# --------------------------------------------------
# 1. Distribution of Global Active Power
# --------------------------------------------------

plt.figure(figsize=(10, 6))

plt.hist(
    sample_df["Global_active_power"],
    bins=50
)

plt.xlabel("Global Active Power (kW)")
plt.ylabel("Frequency")
plt.title("Distribution of Global Active Power")

plt.tight_layout()
plt.show()


# --------------------------------------------------
# 2. Distribution of Voltage
# --------------------------------------------------

plt.figure(figsize=(10, 6))

plt.hist(
    sample_df["Voltage"],
    bins=50
)

plt.xlabel("Voltage (V)")
plt.ylabel("Frequency")
plt.title("Distribution of Voltage")

plt.tight_layout()
plt.show()


# --------------------------------------------------
# 3. Distribution of Global Intensity
# --------------------------------------------------

plt.figure(figsize=(10, 6))

plt.hist(
    sample_df["Global_intensity"],
    bins=50
)

plt.xlabel("Global Intensity (A)")
plt.ylabel("Frequency")
plt.title("Distribution of Global Intensity")

plt.tight_layout()
plt.show()


# --------------------------------------------------
# 4. Correlation Heatmap
# --------------------------------------------------

numeric_df = df.select_dtypes(
    include=["number"]
)

plt.figure(figsize=(12, 8))

sns.heatmap(
    numeric_df.corr(),
    annot=True,
    cmap="coolwarm",
    fmt=".2f"
)

plt.title("Correlation Heatmap")

plt.tight_layout()
plt.show()


# --------------------------------------------------
# 5. Global Active Power vs Voltage
# --------------------------------------------------

plt.figure(figsize=(10, 6))

plt.scatter(
    sample_df["Voltage"],
    sample_df["Global_active_power"],
    alpha=0.2
)

plt.xlabel("Voltage (V)")
plt.ylabel("Global Active Power (kW)")
plt.title("Global Active Power vs Voltage")

plt.tight_layout()
plt.show()


# --------------------------------------------------
# 6. Global Active Power vs Global Intensity
# --------------------------------------------------

plt.figure(figsize=(10, 6))

plt.scatter(
    sample_df["Global_intensity"],
    sample_df["Global_active_power"],
    alpha=0.2
)

plt.xlabel("Global Intensity (A)")
plt.ylabel("Global Active Power (kW)")
plt.title("Global Active Power vs Global Intensity")

plt.tight_layout()
plt.show()


# --------------------------------------------------
# 7. Boxplot of Global Active Power
# --------------------------------------------------

plt.figure(figsize=(10, 6))

plt.boxplot(
    sample_df["Global_active_power"]
)

plt.ylabel("Global Active Power (kW)")
plt.title("Boxplot of Global Active Power")

plt.tight_layout()
plt.show()


# --------------------------------------------------
# 8. Boxplot of Voltage
# --------------------------------------------------

plt.figure(figsize=(10, 6))

plt.boxplot(
    sample_df["Voltage"]
)

plt.ylabel("Voltage (V)")
plt.title("Boxplot of Voltage")

plt.tight_layout()
plt.show()


print("\nEDA completed successfully.")