import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# Load feature-engineered dataset
file_path = "data/processed/energy_features.csv"

df = pd.read_csv(file_path)

print("Dataset Shape:")
print(df.shape)


# Select features
features = [
    "Voltage",
    "Global_intensity",
    "Hour",
    "Day",
    "Month",
    "Weekday",
    "Weekend",
    "Peak_Hour"
]

target = "Global_active_power"


# Use a sample for faster model training
df_sample = df.sample(
    n=100000,
    random_state=42
)

print("\nTraining Sample Shape:")
print(df_sample.shape)


# Input and target
X = df_sample[features]
y = df_sample[target]


# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining Data:")
print(X_train.shape)

print("\nTesting Data:")
print(X_test.shape)


# Create models
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


# Train and evaluate models
results = {}

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
        "RMSE": rmse,
        "R2 Score": r2
    }

    print(f"{name} Results:")
    print(f"MAE: {mae:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"R2 Score: {r2:.4f}")


# Display model comparison
print("\n================ MODEL COMPARISON ================")

for name, metrics in results.items():
    print(f"\n{name}")
    print(f"MAE      : {metrics['MAE']:.4f}")
    print(f"RMSE     : {metrics['RMSE']:.4f}")
    print(f"R2 Score : {metrics['R2 Score']:.4f}")


# Select the model with the highest R2 score
best_model_name = max(
    results,
    key=lambda name: results[name]["R2 Score"]
)

best_model = models[best_model_name]


print("\nBest Model:")
print(best_model_name)


# Save the best model
model_path = "models/energy_model.pkl"

joblib.dump(
    {
        "model": best_model,
        "features": features,
        "target": target
    },
    model_path
)

print("\nBest model saved to:")
print(model_path)