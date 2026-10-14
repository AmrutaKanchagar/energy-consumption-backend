import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Load dataset
data_path = "data/processed/api_bill_dataset.csv"
df = pd.read_csv(data_path)

print("Dataset Shape:", df.shape)

# Features and target
X = df[["Energy_kWh", "Tariff"]]
y = df["Bill"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))

# Models
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

results = {}

# Train and evaluate models
for name, model in models.items():

    print(f"\nTraining {name}...")

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    mse = mean_squared_error(y_test, predictions)
    rmse = mse ** 0.5
    r2 = r2_score(y_test, predictions)

    results[name] = {
        "MAE": mae,
        "MSE": mse,
        "RMSE": rmse,
        "R2": r2
    }

    print(f"MAE  : {mae:.10f}")
    print(f"MSE  : {mse:.10f}")
    print(f"RMSE : {rmse:.10f}")
    print(f"R²   : {r2:.10f}")

# Display comparison
print("\n===================================")
print("FINAL BILL MODEL COMPARISON")
print("===================================")

results_df = pd.DataFrame(results).T
print(results_df)

# Select best model based on R²
best_model_name = results_df["R2"].idxmax()
best_model = models[best_model_name]

print("\nBest Model:", best_model_name)

# Create models directory
os.makedirs("models", exist_ok=True)

# Save final model
model_path = "models/bill_model.pkl"
joblib.dump(best_model, model_path)

print("\nFinal bill model saved successfully:")
print(model_path)