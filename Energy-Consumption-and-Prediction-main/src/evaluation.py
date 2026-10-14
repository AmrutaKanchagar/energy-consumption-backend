import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)


# --------------------------------------------------
# Load Bill Dataset
# --------------------------------------------------

input_path = "data/processed/bill_dataset.csv"

df = pd.read_csv(input_path)

print("Dataset Shape:")
print(df.shape)


# --------------------------------------------------
# Features and Target
# --------------------------------------------------

features = [
    "Global_active_power",
    "Global_reactive_power",
    "Voltage",
    "Global_intensity",
    "Sub_metering_1",
    "Sub_metering_2",
    "Sub_metering_3",
    "Hour",
    "Day",
    "Month",
    "Weekday",
    "Weekend",
    "Peak_Hour"
]

X = df[features]
y = df["Bill"]


# --------------------------------------------------
# Train-Test Split
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# --------------------------------------------------
# Define Models
# --------------------------------------------------

models = {
    "Linear Regression": LinearRegression(),

    "Decision Tree": DecisionTreeRegressor(
        random_state=42,
        max_depth=15
    ),

    "Random Forest": RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        max_depth=15,
        n_jobs=-1
    )
}


# --------------------------------------------------
# Train and Evaluate
# --------------------------------------------------

results = []

for name, model in models.items():

    print(f"\nEvaluating {name}...")

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(
        y_test,
        predictions
    )

    mse = mean_squared_error(
        y_test,
        predictions
    )

    rmse = mse ** 0.5

    r2 = r2_score(
        y_test,
        predictions
    )

    results.append({
        "Model": name,
        "MAE": mae,
        "MSE": mse,
        "RMSE": rmse,
        "R2": r2
    })


# --------------------------------------------------
# Create Results DataFrame
# --------------------------------------------------

results_df = pd.DataFrame(results)

print("\n===================================")
print("MODEL EVALUATION RESULTS")
print("===================================")

print(results_df.to_string(index=False))


# --------------------------------------------------
# Save Results
# --------------------------------------------------

results_df.to_csv(
    "data/processed/bill_model_evaluation.csv",
    index=False
)

print("\nEvaluation results saved to:")
print("data/processed/bill_model_evaluation.csv")


# --------------------------------------------------
# MAE Comparison
# --------------------------------------------------

plt.figure(figsize=(10, 6))

plt.bar(
    results_df["Model"],
    results_df["MAE"]
)

plt.xlabel("Model")
plt.ylabel("Mean Absolute Error")
plt.title("MAE Comparison")

plt.xticks(rotation=15)
plt.tight_layout()
plt.show()


# --------------------------------------------------
# MSE Comparison
# --------------------------------------------------

plt.figure(figsize=(10, 6))

plt.bar(
    results_df["Model"],
    results_df["MSE"]
)

plt.xlabel("Model")
plt.ylabel("Mean Squared Error")
plt.title("MSE Comparison")

plt.xticks(rotation=15)
plt.tight_layout()
plt.show()


# --------------------------------------------------
# RMSE Comparison
# --------------------------------------------------

plt.figure(figsize=(10, 6))

plt.bar(
    results_df["Model"],
    results_df["RMSE"]
)

plt.xlabel("Model")
plt.ylabel("Root Mean Squared Error")
plt.title("RMSE Comparison")

plt.xticks(rotation=15)
plt.tight_layout()
plt.show()


# --------------------------------------------------
# R2 Comparison
# --------------------------------------------------

plt.figure(figsize=(10, 6))

plt.bar(
    results_df["Model"],
    results_df["R2"]
)

plt.xlabel("Model")
plt.ylabel("R² Score")
plt.title("R² Score Comparison")

plt.xticks(rotation=15)
plt.tight_layout()
plt.show()


print("\nEvaluation completed successfully.")