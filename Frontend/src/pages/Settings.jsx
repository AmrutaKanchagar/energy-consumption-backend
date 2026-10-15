
import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  IndianRupee,
  Clock,
  CalendarDays,
  Save,
  RotateCcw,
  Trash2,
  CheckCircle,
} from "lucide-react";

const SETTINGS_KEY = "smartEnergySettings";
const HISTORY_KEY = "smartEnergyHistory";

const defaultSettings = {
  tariff: 8,
  dailyHours: 5,
  billingDays: 30,
};

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        setSettings({
          ...defaultSettings,
          ...parsed,
        });
      }

      const history = JSON.parse(
        localStorage.getItem(HISTORY_KEY) || "[]"
      );

      setHistoryCount(
        Array.isArray(history) ? history.length : 0
      );
    } catch (error) {
      console.error("Error loading saved data:", error);
      setSettings(defaultSettings);
      setHistoryCount(0);
    }

    function refreshHistory() {
      try {
        const history = JSON.parse(
          localStorage.getItem(HISTORY_KEY) || "[]"
        );

        setHistoryCount(
          Array.isArray(history) ? history.length : 0
        );
      } catch {
        setHistoryCount(0);
      }
    }

    window.addEventListener(
      "smartEnergyHistoryUpdated",
      refreshHistory
    );

    window.addEventListener("storage", refreshHistory);

    return () => {
      window.removeEventListener(
        "smartEnergyHistoryUpdated",
        refreshHistory
      );

      window.removeEventListener("storage", refreshHistory);
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  }

  function handleSave(event) {
    event.preventDefault();

    const updated = {
      tariff: Number(settings.tariff),
      dailyHours: Number(settings.dailyHours),
      billingDays: Number(settings.billingDays),
    };

    if (
      !Number.isFinite(updated.tariff) ||
      !Number.isFinite(updated.dailyHours) ||
      !Number.isFinite(updated.billingDays) ||
      updated.tariff <= 0 ||
      updated.dailyHours <= 0 ||
      updated.dailyHours > 24 ||
      updated.billingDays < 1 ||
      updated.billingDays > 31 ||
      !Number.isInteger(updated.billingDays)
    ) {
      alert(
        "Please enter a valid tariff, daily usage hours, and billing period."
      );
      return;
    }

    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(updated)
      );

      setSettings(updated);
      setSaved(true);

      window.dispatchEvent(
        new Event("smartEnergySettingsUpdated")
      );
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Unable to save settings. Please try again.");
    }
  }

  function handleReset() {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(defaultSettings)
      );

      setSettings(defaultSettings);
      setSaved(true);

      window.dispatchEvent(
        new Event("smartEnergySettingsUpdated")
      );
    } catch (error) {
      console.error("Error resetting settings:", error);
      alert("Unable to reset settings. Please try again.");
    }
  }

  function handleClearHistory() {
    if (historyCount === 0) {
      setShowConfirm(false);
      return;
    }

    try {
      localStorage.removeItem(HISTORY_KEY);

      setHistoryCount(0);
      setShowConfirm(false);

      window.dispatchEvent(
        new Event("smartEnergyHistoryUpdated")
      );

      alert("Prediction history cleared successfully.");
    } catch (error) {
      console.error("Error clearing history:", error);
      alert("Unable to clear prediction history.");
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #dbe3ef",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    background: "#fff",
    color: "#172033",
    boxSizing: "border-box",
  };

  const cardStyle = {
    background: "#fff",
    border: "1px solid #e5eaf2",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "22px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "#344054",
    marginBottom: "9px",
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 750,
            color: "#172554",
            margin: "0 0 8px",
          }}
        >
          Settings
        </h1>

        <p style={{ color: "#667085", margin: 0 }}>
          Customize your electricity bill estimation preferences.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                background: "#eaf2ff",
                color: "#2563eb",
                padding: "11px",
                borderRadius: "12px",
              }}
            >
              <SettingsIcon size={23} />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "19px",
                  color: "#172554",
                }}
              >
                Billing Preferences
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#667085",
                  fontSize: "13px",
                }}
              >
                Set the values used for estimated monthly costs.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "22px",
            }}
          >
            <div>
              <label style={labelStyle} htmlFor="tariff">
                <IndianRupee
                  size={15}
                  style={{ verticalAlign: "middle" }}
                />{" "}
                Electricity tariff (₹/kWh)
              </label>

              <input
                id="tariff"
                name="tariff"
                type="number"
                min="0.01"
                step="0.01"
                value={settings.tariff}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="dailyHours">
                <Clock
                  size={15}
                  style={{ verticalAlign: "middle" }}
                />{" "}
                Usage hours per day
              </label>

              <input
                id="dailyHours"
                name="dailyHours"
                type="number"
                min="0.1"
                max="24"
                step="0.1"
                value={settings.dailyHours}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="billingDays">
                <CalendarDays
                  size={15}
                  style={{ verticalAlign: "middle" }}
                />{" "}
                Billing days
              </label>

              <input
                id="billingDays"
                name="billingDays"
                type="number"
                min="1"
                max="31"
                step="1"
                value={settings.billingDays}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <p
            style={{
              marginTop: "18px",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "#667085",
            }}
          >
            These preferences are saved in your browser and are
            used for monthly bill estimation. Changes apply to
            future predictions and estimates.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "22px",
            }}
          >
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: 0,
                borderRadius: "10px",
                padding: "12px 18px",
                color: "#fff",
                background: "#2563eb",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Save size={17} />
              Save Settings
            </button>

            <button
              type="button"
              onClick={handleReset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #dbe3ef",
                borderRadius: "10px",
                padding: "12px 18px",
                color: "#344054",
                background: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={16} />
              Reset Defaults
            </button>
          </div>

          {saved && (
            <p
              role="status"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                color: "#15803d",
                marginBottom: 0,
                fontSize: "14px",
              }}
            >
              <CheckCircle size={17} />
              Settings saved successfully.
            </p>
          )}
        </section>
      </form>

      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              background: "#fff0f0",
              color: "#dc2626",
              padding: "11px",
              borderRadius: "12px",
            }}
          >
            <Trash2 size={23} />
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "19px",
                color: "#172554",
              }}
            >
              Data Management
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#667085",
                fontSize: "13px",
              }}
            >
              Manage prediction records saved in this browser.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 5px",
                fontWeight: 600,
                color: "#344054",
              }}
            >
              Prediction History
            </p>

            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#667085",
              }}
            >
              {historyCount} saved prediction record(s)
            </p>
          </div>

          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={historyCount === 0}
              style={{
                border: "1px solid #fecaca",
                borderRadius: "10px",
                padding: "11px 15px",
                color:
                  historyCount === 0 ? "#9ca3af" : "#dc2626",
                background: "#fff",
                fontWeight: 600,
                cursor:
                  historyCount === 0
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Clear History
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={handleClearHistory}
                style={{
                  border: 0,
                  borderRadius: "9px",
                  padding: "10px 13px",
                  color: "#fff",
                  background: "#dc2626",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Confirm Clear
              </button>

              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                style={{
                  border: "1px solid #dbe3ef",
                  borderRadius: "9px",
                  padding: "10px 13px",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <p
          style={{
            color: "#b45309",
            fontSize: "13px",
            marginBottom: 0,
          }}
        >
          Clearing history permanently removes the saved records
          from this browser. It does not delete your trained ML
          models.
        </p>
      </section>
    </div>
  );
}
