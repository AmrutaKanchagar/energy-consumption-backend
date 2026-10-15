
import { useEffect, useState } from "react";
import {
  Activity,
  Calendar,
  IndianRupee,
  Zap,
  Trash2,
  RefreshCw,
  History as HistoryIcon,
} from "lucide-react";

const STORAGE_KEY = "smartEnergyHistory";

function loadHistory() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleString();
}

function formatNumber(value, digits = 4) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : "—";
}

export default function History() {
  const [records, setRecords] = useState(loadHistory);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    function refreshHistory() {
      setRecords(loadHistory());
    }

    window.addEventListener("storage", refreshHistory);
    window.addEventListener("focus", refreshHistory);

    return () => {
      window.removeEventListener("storage", refreshHistory);
      window.removeEventListener("focus", refreshHistory);
    };
  }, []);

  const filteredRecords = records.filter((record) => {
    if (filter === "today") {
      const date = new Date(record.timestamp);
      const now = new Date();

      return (
        !Number.isNaN(date.getTime()) &&
        date.toDateString() === now.toDateString()
      );
    }

    return true;
  });

  const totalEnergy = records.reduce(
    (sum, record) =>
      sum + (Number(record.result?.predicted_energy_kwh) || 0),
    0
  );

  const totalBill = records.reduce(
    (sum, record) =>
      sum + (Number(record.result?.predicted_bill_inr) || 0),
    0
  );

  function clearHistory() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all prediction history?"
    );

    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEY);
    setRecords([]);
  }

  return (
    <main className="history-page">
      <div className="history-header">
        <div>
          <span className="history-eyebrow">
            <HistoryIcon size={16} /> YOUR ACTIVITY
          </span>
          <h1>Prediction History</h1>
          <p>Review your saved energy and electricity bill predictions.</p>
        </div>

        <button
          className="history-refresh"
          onClick={() => setRecords(loadHistory())}
          type="button"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <section className="history-stats">
        <div className="history-stat-card">
          <span className="history-stat-icon">
            <Activity size={21} />
          </span>
          <p>Total Predictions</p>
          <h2>{records.length}</h2>
        </div>

        <div className="history-stat-card">
          <span className="history-stat-icon">
            <Zap size={21} />
          </span>
          <p>Sum of Predicted Energy</p>
          <h2>{formatNumber(totalEnergy)} kWh</h2>
        </div>

        <div className="history-stat-card">
          <span className="history-stat-icon">
            <IndianRupee size={21} />
          </span>
          <p>Sum of Predicted Bills</p>
          <h2>₹{formatNumber(totalBill, 2)}</h2>
        </div>
      </section>

      <section className="history-table-card">
        <div className="history-table-heading">
          <div>
            <h2>Saved Predictions</h2>
            <p>{filteredRecords.length} records displayed</p>
          </div>

          <div className="history-actions">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter prediction history"
            >
              <option value="all">All predictions</option>
              <option value="today">Today</option>
            </select>

            <button
              type="button"
              className="history-delete"
              onClick={clearHistory}
              disabled={records.length === 0}
            >
              <Trash2 size={16} />
              Clear history
            </button>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="history-empty">
            <Calendar size={38} />
            <h3>No predictions found</h3>
            <p>
              Make a prediction on the Predict Energy page.
              Your saved results will appear here.
            </p>
          </div>
        ) : (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Power (kW)</th>
                  <th>Energy (kWh)</th>
                  <th>Tariff (₹/kWh)</th>
                  <th>Predicted Bill</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr key={record.id || `${record.timestamp}-${index}`}>
                    <td>{formatDate(record.timestamp)}</td>
                    <td>
                      {formatNumber(record.result?.predicted_power_kw)}
                    </td>
                    <td>
                      {formatNumber(record.result?.predicted_energy_kwh)}
                    </td>
                    <td>
                      ₹{formatNumber(record.result?.tariff_per_kwh, 2)}
                    </td>
                    <td className="history-bill">
                      ₹{formatNumber(record.result?.predicted_bill_inr, 4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="history-footnote">
          Energy and bill values are predictions for the model's specified
          interval, not verified electricity meter readings or actual bills.
        </p>
      </section>
    </main>
  );
}
