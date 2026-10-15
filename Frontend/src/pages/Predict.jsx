
import { useState, useEffect } from "react";
import {
  Zap,
  Gauge,
  Clock3,
  CalendarDays,
  Calendar,
  IndianRupee,
  ArrowRight,
  RotateCcw,
  Info,
  CheckCircle2,
  Activity,
  Receipt,
  Calculator,
  LoaderCircle,
} from "lucide-react";
import { predictEnergy } from "../services/api";

const SETTINGS_KEY = "smartEnergySettings";
const HISTORY_KEY = "smartEnergyHistory";

const defaultSettings = {
  tariff: 8,
  dailyHours: 5,
  billingDays: 30,
};

function loadSettings() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(SETTINGS_KEY) || "{}"
    );

    return {
      tariff:
        Number(stored.tariff) > 0
          ? Number(stored.tariff)
          : defaultSettings.tariff,
      dailyHours:
        stored.dailyHours !== undefined &&
        Number(stored.dailyHours) >= 0 &&
        Number(stored.dailyHours) <= 24
          ? Number(stored.dailyHours)
          : defaultSettings.dailyHours,
      billingDays:
        stored.billingDays !== undefined &&
        Number(stored.billingDays) >= 1 &&
        Number(stored.billingDays) <= 31
          ? Number(stored.billingDays)
          : defaultSettings.billingDays,
    };
  } catch {
    return defaultSettings;
  }
}

const fields = [
  { name: "voltage", label: "Voltage", unit: "V", icon: Zap, min: 0.01 },
  { name: "current", label: "Current", unit: "A", icon: Gauge, min: 0 },
  { name: "hour", label: "Hour", unit: "0–23", icon: Clock3, min: 0, max: 23, integer: true },
  { name: "day", label: "Day of month", unit: "1–31", icon: CalendarDays, min: 1, max: 31, integer: true },
  { name: "month", label: "Month", unit: "1–12", icon: Calendar, min: 1, max: 12, integer: true },
  { name: "weekday", label: "Weekday", unit: "0–6", icon: CalendarDays, min: 0, max: 6, integer: true },
  { name: "tariff", label: "Electricity tariff", unit: "₹/kWh", icon: IndianRupee, min: 0 },
];

function loadHistory() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || "[]"
    );
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatCurrency(value) {
  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Predict() {
  const [settings] = useState(loadSettings);

  const [values, setValues] = useState(() => ({
    voltage: "240",
    current: "4",
    hour: "19",
    day: String(new Date().getDate()),
    month: String(new Date().getMonth() + 1),
    weekday: String((new Date().getDay() + 6) % 7),
    tariff: String(loadSettings().tariff),
  }));

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [prediction, setPrediction] = useState(null);

  const [dailyHours, setDailyHours] = useState(
    String(settings.dailyHours)
  );

  const [numberOfDays, setNumberOfDays] = useState(
    String(settings.billingDays)
  );

  // Update preferences when saved settings change.
  useEffect(() => {
    function refreshSettings() {
      const currentSettings = loadSettings();

      setDailyHours(String(currentSettings.dailyHours));
      setNumberOfDays(String(currentSettings.billingDays));

      setValues((previous) => ({
        ...previous,
        tariff: String(currentSettings.tariff),
      }));
    }

    window.addEventListener(
      "smartEnergySettingsUpdated",
      refreshSettings
    );

    window.addEventListener("storage", refreshSettings);

    return () => {
      window.removeEventListener(
        "smartEnergySettingsUpdated",
        refreshSettings
      );

      window.removeEventListener("storage", refreshSettings);
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setApiError("");
  }

  function validateForm() {
    const nextErrors = {};

    for (const field of fields) {
      const raw = values[field.name];
      const number = Number(raw);

      if (raw.trim() === "" || !Number.isFinite(number)) {
        nextErrors[field.name] = "Enter a valid number.";
      } else if (number < field.min) {
        nextErrors[field.name] = `Minimum value is ${field.min}.`;
      } else if (
        field.max !== undefined &&
        number > field.max
      ) {
        nextErrors[field.name] = `Maximum value is ${field.max}.`;
      } else if (
        field.integer &&
        !Number.isInteger(number)
      ) {
        nextErrors[field.name] = "Enter a whole number.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setApiError("");
    setPrediction(null);

    if (!validateForm()) return;

    const payload = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        Number(value),
      ])
    );

    setLoading(true);

    try {
      const response = await predictEnergy(payload);

      if (!response?.success || !response?.prediction) {
        throw new Error(
          "The backend did not return a valid prediction."
        );
      }

      const record = {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        inputs: payload,
        result: response.prediction,
      };

      const history = loadHistory();
      const updatedHistory = [record, ...history].slice(0, 500);

      try {
        localStorage.setItem(
          HISTORY_KEY,
          JSON.stringify(updatedHistory)
        );

        // Notify the Dashboard and other components.
        window.dispatchEvent(
          new Event("smartEnergyHistoryUpdated")
        );
      } catch {
        setApiError(
          "Prediction succeeded, but browser history could not be saved."
        );
      }

      setPrediction(record);
    } catch (error) {
      setApiError(
        error.message || "Prediction failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    const currentSettings = loadSettings();

    setValues({
      voltage: "240",
      current: "4",
      hour: "19",
      day: String(new Date().getDate()),
      month: String(new Date().getMonth() + 1),
      weekday: String((new Date().getDay() + 6) % 7),
      tariff: String(currentSettings.tariff),
    });

    setErrors({});
    setApiError("");
    setPrediction(null);
    setDailyHours(String(currentSettings.dailyHours));
    setNumberOfDays(String(currentSettings.billingDays));
  }

  const power = Number(
    prediction?.result?.predicted_power_kw
  );

  const monthlyTariff = Number(settings.tariff);
  const hours = Number(dailyHours);
  const days = Number(numberOfDays);

  const validMonthlyInputs =
    dailyHours.trim() !== "" &&
    numberOfDays.trim() !== "" &&
    Number.isFinite(power) &&
    Number.isFinite(monthlyTariff) &&
    Number.isFinite(hours) &&
    Number.isFinite(days) &&
    power >= 0 &&
    monthlyTariff > 0 &&
    hours >= 0 &&
    hours <= 24 &&
    days >= 1 &&
    days <= 31;

  const monthlyEstimate = validMonthlyInputs
    ? power * hours * days * monthlyTariff
    : null;

  return (
    <div className="predict-page">
      <div className="predict-intro">
        <div className="predict-badge">
          <Zap size={14} /> MACHINE LEARNING
        </div>

        <h2>Predict Energy Consumption</h2>
        <p>
          Enter electricity parameters to request a prediction
          from your trained ML models.
        </p>
      </div>

      <div className="predict-layout">
        <section className="predict-card">
          <div className="predict-card-heading">
            <div>
              <h3>Input Parameters</h3>
              <p>Provide the required electricity details.</p>
            </div>

            <div className="predict-heading-icon">
              <Gauge size={22} />
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="predict-fields">
              {fields.map((field) => {
                const Icon = field.icon;

                return (
                  <div className="predict-field" key={field.name}>
                    <label htmlFor={field.name}>
                      {field.label}
                      <span className="field-unit">
                        {field.unit}
                      </span>
                    </label>

                    <div
                      className={`predict-input-wrap ${
                        errors[field.name] ? "input-error" : ""
                      }`}
                    >
                      <Icon size={17} />

                      <input
                        id={field.name}
                        name={field.name}
                        type="number"
                        value={values[field.name]}
                        onChange={handleChange}
                        min={field.min}
                        max={field.max}
                        step={field.integer ? 1 : "any"}
                        required
                        aria-invalid={Boolean(errors[field.name])}
                      />
                    </div>

                    {errors[field.name] && (
                      <span className="field-error">
                        {errors[field.name]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="weekday-help">
              Weekday: 0 = Monday, 6 = Sunday.
            </p>

            <div className="predict-form-actions">
              <button
                className="predict-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <LoaderCircle
                    className="loading-icon"
                    size={17}
                  />
                ) : (
                  <Zap size={17} />
                )}

                {loading
                  ? "Predicting..."
                  : "Predict Consumption"}

                {!loading && <ArrowRight size={17} />}
              </button>

              <button
                className="predict-reset"
                type="button"
                onClick={resetForm}
                disabled={loading}
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>

            {apiError && (
              <div className="predict-api-error" role="alert">
                <Info size={17} />
                <span>{apiError}</span>
              </div>
            )}
          </form>
        </section>

        <aside className="predict-side">
          <section className="predict-card how-card">
            <div className="predict-card-heading">
              <div>
                <h3>How it works</h3>
                <p>Your prediction workflow</p>
              </div>
            </div>

            <div className="workflow-list">
              {[
                "Enter electricity parameters",
                "Validate the input values",
                "Request the ML prediction",
                "View energy and bill results",
              ].map((step, index) => (
                <div className="workflow-item" key={step}>
                  <span className="workflow-number">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="predict-note">
            <Info size={19} />
            <div>
              <strong>Important information</strong>
              <p>
                The backend estimates energy for a one-minute
                interval. This is not a monthly bill.
              </p>
            </div>
          </section>
        </aside>
      </div>

      {prediction && (
        <section className="prediction-results">
          <div className="results-heading">
            <div>
              <div className="result-success-label">
                <CheckCircle2 size={17} /> PREDICTION SUCCESSFUL
              </div>

              <h2>Your Prediction Results</h2>
              <p>
                Generated on{" "}
                {new Date(prediction.timestamp).toLocaleString()}
              </p>
            </div>

            <div className="results-model-icon">
              <Activity size={25} />
            </div>
          </div>

          <div className="results-grid">
            <ResultCard
              icon={<Activity size={21} />}
              label="Predicted Power"
              value={prediction.result.predicted_power_kw}
              unit="kW"
              color="blue"
            />

            <ResultCard
              icon={<Zap size={21} />}
              label="Predicted Energy"
              value={prediction.result.predicted_energy_kwh}
              unit="kWh"
              color="green"
            />

            <ResultCard
              icon={<IndianRupee size={21} />}
              label="Prediction Tariff"
              value={prediction.result.tariff_per_kwh}
              unit="per kWh"
              color="orange"
              prefix="₹"
            />

            <ResultCard
              icon={<Receipt size={21} />}
              label="Estimated Interval Bill"
              value={prediction.result.predicted_bill_inr}
              unit="INR"
              color="purple"
              prefix="₹"
            />
          </div>

          <div className="result-interval-note">
            <Info size={18} />
            <span>
              Energy and bill values represent the backend's{" "}
              <strong>
                {prediction.result.interval_minutes ?? 1}-minute
                interval
              </strong>
              , not a monthly total.
            </span>
          </div>

          <section className="monthly-estimator">
            <div className="monthly-heading">
              <div className="monthly-icon">
                <Calculator size={21} />
              </div>

              <div>
                <h3>Monthly Bill Estimator</h3>
                <p>
                  Estimate a cost using your saved Settings preferences.
                </p>
              </div>
            </div>

            <div className="monthly-fields">
              <div className="predict-field">
                <label htmlFor="dailyHours">
                  Daily usage hours
                  <span className="field-unit">0–24</span>
                </label>

                <input
                  className="monthly-input"
                  id="dailyHours"
                  type="number"
                  min="0"
                  max="24"
                  step="any"
                  value={dailyHours}
                  onChange={(event) =>
                    setDailyHours(event.target.value)
                  }
                />
              </div>

              <div className="predict-field">
                <label htmlFor="numberOfDays">
                  Billing days
                  <span className="field-unit">1–31</span>
                </label>

                <input
                  className="monthly-input"
                  id="numberOfDays"
                  type="number"
                  min="1"
                  max="31"
                  step="1"
                  value={numberOfDays}
                  onChange={(event) =>
                    setNumberOfDays(event.target.value)
                  }
                />
              </div>

              <div className="predict-field">
                <label>
                  Saved electricity tariff
                  <span className="field-unit">₹/kWh</span>
                </label>

                <div className="monthly-input">
                  ₹{monthlyTariff.toFixed(2)} per kWh
                </div>
              </div>

              <div className="monthly-total">
                <span>Estimated total</span>
                <strong>
                  {monthlyEstimate === null
                    ? "—"
                    : `₹${formatCurrency(monthlyEstimate)}`}
                </strong>
                <small>Assumption-based estimate</small>
              </div>
            </div>

            <p className="monthly-disclaimer">
              Formula: predicted power (kW) × daily usage hours ×
              billing days × saved tariff. This assumes predicted power
              remains constant during the selected usage hours. Actual
              household consumption, tariff slabs, taxes, and fixed
              charges may differ. This is not an official bill.
            </p>
          </section>

          <div className="results-actions">
            <button
              className="predict-submit"
              type="button"
              onClick={resetForm}
            >
              <Zap size={17} /> Make Another Prediction
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function ResultCard({
  icon,
  label,
  value,
  unit,
  color,
  prefix = "",
}) {
  const number = Number(value);

  const formatted = Number.isFinite(number)
    ? number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      })
    : "—";

  return (
    <article className="result-card">
      <div className={`result-card-icon ${color}`}>
        {icon}
      </div>

      <span className="result-card-label">{label}</span>

      <div className="result-card-value">
        {prefix}{formatted}
      </div>

      <span className="result-card-unit">{unit}</span>
    </article>
  );
}
