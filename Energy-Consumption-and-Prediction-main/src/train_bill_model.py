import pandas as pd
import os

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

import joblib


# --------------------------------------------------
# Load Bill Dataset
# --------------------------------------------------

input_path = "data/processed/bill_dataset.csv"

df = pd.read_csv(input_path)

print("Dataset Shape:")
print(df.shape)


# --------------------------------------------------
# Define Features and Target
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


print("\nFeatures:")
print(features)

print("\nTarget:")
print("Bill")


# --------------------------------------------------
# Train-Test Split
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


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
        n_jobs=-1,
        max_depth=15
    )
}


# --------------------------------------------------
# Train and Evaluate Models
# --------------------------------------------------

results = {}

for name, model in models.items():

    print(f"\nTraining {name}...")

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

    results[name] = {
        "MAE": mae,
        "MSE": mse,
        "RMSE": rmse,
        "R2": r2
    }

    print(f"MAE  : {mae:.6f}")
    print(f"MSE  : {mse:.6f}")
    print(f"RMSE : {rmse:.6f}")
    print(f"R²   : {r2:.6f}")


# --------------------------------------------------
# Display Model Comparison
# --------------------------------------------------

results_df = pd.DataFrame(results).T

print("\nModel Comparison:")
print(results_df)


# --------------------------------------------------
# Select Best Model Based on R²
# --------------------------------------------------

best_model_name = results_df["R2"].idxmax()

best_model = models[best_model_name]

print("\nBest Model:")
print(best_model_name)


# --------------------------------------------------
# Save Best Model
# --------------------------------------------------

model_directory = "models"

os.makedirs(
    model_directory,
    exist_ok=True
)

model_path = os.path.join(
    model_directory,
    "bill_model.pkl"
)

joblib.dump(
    best_model,
    model_path
)

print("\nBill model saved successfully:")
print(model_path)