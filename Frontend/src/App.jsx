
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Zap,
  History as HistoryIcon,
  Info,
  Settings as SettingsIcon,
  Bell,
  Activity,
  IndianRupee,
  ChevronRight,
  Sun,
  Moon,
  ArrowUpRight,
  Menu,
  X,
  RefreshCw,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import Predict from "./pages/Predict";
import History from "./pages/History";
import SettingsPage from "./pages/Settings";
import "./App.css";

const STORAGE_KEY = "smartEnergyHistory";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Predict Energy", icon: Zap },
  { label: "History", icon: HistoryIcon },
  { label: "About Project", icon: Info },
  { label: "Settings", icon: SettingsIcon },
];

function loadPredictionHistory() {
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function formatNumber(value, digits = 4) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : "—";
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  function navigateTo(page) {
    setActivePage(page);
    setSidebarOpen(false);
  }

  return (
    <div className={`app-shell ${darkMode ? "dark-mode" : ""}`}>
      <aside
        className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        <div className="brand">
          <div className="brand-icon">
            <Zap size={24} fill="currentColor" />
          </div>

          <div>
            <h2>SmartEnergy</h2>
            <span>AI POWERED SYSTEM</span>
          </div>

          <button
            type="button"
            className="sidebar-close"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="nav-heading">WORKSPACE</div>

        <nav className="side-navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              className={`nav-item ${
                activePage === label ? "active" : ""
              }`}
              onClick={() => navigateTo(label)}
            >
              <Icon size={19} />
              <span>{label}</span>

              {activePage === label && (
                <span className="active-dot" />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="energy-tip">
            <div className="tip-icon">
              <Zap size={18} />
            </div>
            <h4>Energy Tip</h4>
            <p>
              Monitor your energy usage to understand your
              consumption patterns and make informed decisions.
            </p>
          </div>

          <div className="profile">
            <div className="avatar">SE</div>
            <div className="profile-info">
              <strong>Smart Energy</strong>
              <span>Project Dashboard</span>
            </div>
            <SettingsIcon size={17} />
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="icon-button mobile-menu"
              aria-label="Toggle navigation"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>

            <div>
              <div className="breadcrumb">
                Workspace
                <ChevronRight size={14} />
                {activePage}
              </div>
              <h1>{activePage}</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="status-pill">
              <span className="status-dot" />
              <span>AI Energy System</span>
            </div>

            <button
              type="button"
              className="icon-button"
              aria-label="Toggle light or dark theme"
              title="Toggle theme"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>

            <button
              type="button"
              className="icon-button notification-button"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={19} />
            </button>
          </div>
        </header>

        {activePage === "Dashboard" && (
          <Dashboard onNavigate={navigateTo} />
        )}

        {activePage === "Predict Energy" && <Predict />}

        {activePage === "History" && <History />}

        {activePage === "Settings" && <SettingsPage />}

        {activePage === "About Project" && (
          <PlaceholderPage
            page="About Project"
            onBack={() => navigateTo("Dashboard")}
          />
        )}
      </main>
    </div>
  );
}

function Dashboard({ onNavigate }) {
  const [records, setRecords] = useState(loadPredictionHistory);

  useEffect(() => {
    function refreshRecords() {
      setRecords(loadPredictionHistory());
    }

    window.addEventListener("focus", refreshRecords);
    window.addEventListener("storage", refreshRecords);
    window.addEventListener(
      "smartEnergyHistoryUpdated",
      refreshRecords
    );

    return () => {
      window.removeEventListener("focus", refreshRecords);
      window.removeEventListener("storage", refreshRecords);
      window.removeEventListener(
        "smartEnergyHistoryUpdated",
        refreshRecords
      );
    };
  }, []);

  function refreshDashboard() {
    setRecords(loadPredictionHistory());
  }

  const totalPredictions = records.length;
  const latest = records[0]?.result;

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

  const chartData = [...records]
    .reverse()
    .slice(-10)
    .map((record, index) => ({
      prediction: `#${index + 1}`,
      energy: Number(record.result?.predicted_energy_kwh) || 0,
      bill: Number(record.result?.predicted_bill_inr) || 0,
    }));

  return (
    <div className="page-content">
      <section className="welcome-banner">
        <div className="welcome-copy">
          <span className="eyebrow">
            <Activity size={14} />
            INTELLIGENT ENERGY MONITORING
          </span>

          <h2>
            Understand your energy.
            <br />
            Make smarter decisions.
          </h2>

          <p>
            Explore your energy insights and predict electricity
            costs with machine learning.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => onNavigate("Predict Energy")}
          >
            <Zap size={17} />
            Predict Energy
            <ArrowUpRight size={17} />
          </button>
        </div>

        <div className="banner-art">
          <div className="art-circle">
            <div className="art-house">
              <Sun size={28} />
              <Zap size={55} fill="currentColor" />
            </div>
          </div>

          <div className="floating-chip chip-top">
            <Activity size={16} />
            AI Analytics
          </div>

          <div className="floating-chip chip-bottom">
            <Zap size={16} />
            Energy Insights
          </div>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <h2>Overview</h2>
          <p>Your saved energy prediction results</p>
        </div>

        <button
          type="button"
          className="date-label"
          onClick={refreshDashboard}
        >
          <RefreshCw size={15} />
          Refresh Data
        </button>
      </section>

      <section className="metric-grid">
        <MetricCard
          icon={<Zap size={20} />}
          label="Latest Predicted Energy"
          value={
            latest
              ? formatNumber(latest.predicted_energy_kwh)
              : "—"
          }
          unit="kWh"
          color="blue"
          note="Latest prediction interval"
        />

        <MetricCard
          icon={<IndianRupee size={20} />}
          label="Latest Estimated Cost"
          value={
            latest
              ? formatNumber(latest.predicted_bill_inr)
              : "—"
          }
          unit="INR"
          color="purple"
          note="Latest prediction interval"
        />

        <MetricCard
          icon={<Activity size={20} />}
          label="Latest Predicted Power"
          value={
            latest
              ? formatNumber(latest.predicted_power_kw)
              : "—"
          }
          unit="kW"
          color="orange"
          note="Latest model output"
        />

        <MetricCard
          icon={<HistoryIcon size={20} />}
          label="Total Predictions"
          value={String(totalPredictions)}
          unit="records"
          color="green"
          note="Saved in this browser"
        />
      </section>

      <section className="content-grid">
        <div className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h3>Energy Consumption</h3>
              <p>Saved prediction results · kWh per interval</p>
            </div>

            <span className="chart-legend">
              <span />
              Predicted energy
            </span>
          </div>

          <div className="chart-container">
            {chartData.length === 0 ? (
              <div className="dashboard-chart-empty">
                <Activity size={32} />
                <p>No saved predictions yet.</p>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => onNavigate("Predict Energy")}
                >
                  Make a Prediction
                </button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 8,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="energyFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#3B82F6"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="100%"
                        stopColor="#3B82F6"
                        stopOpacity={0.01}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#E8EDF5"
                  />

                  <XAxis
                    dataKey="prediction"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8B95A7", fontSize: 12 }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8B95A7", fontSize: 12 }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${Number(value).toFixed(6)} kWh`,
                      "Predicted energy",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="energy"
                    name="Predicted energy"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fill="url(#energyFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <p className="chart-disclaimer">
            Each point represents one saved prediction interval, not a
            complete daily or monthly consumption total.
          </p>
        </div>

        <div className="panel quick-panel">
          <div className="panel-heading">
            <div>
              <h3>Quick Actions</h3>
              <p>Explore your energy workspace</p>
            </div>
          </div>

          <QuickAction
            icon={<Zap size={20} />}
            color="blue"
            title="New Prediction"
            description="Estimate energy and cost"
            onClick={() => onNavigate("Predict Energy")}
          />

          <QuickAction
            icon={<HistoryIcon size={20} />}
            color="purple"
            title="View History"
            description="Review saved predictions"
            onClick={() => onNavigate("History")}
          />

          <QuickAction
            icon={<Info size={20} />}
            color="green"
            title="Explore Project"
            description="Learn about the system"
            onClick={() => onNavigate("About Project")}
          />

          <div className="api-notice">
            <span className="notice-dot" />
            <span>
              Dashboard metrics use saved prediction results.
            </span>
          </div>
        </div>
      </section>

      <section className="panel dashboard-summary">
        <div className="panel-heading">
          <div>
            <h3>Saved Prediction Summary</h3>
            <p>Totals across saved prediction intervals</p>
          </div>
        </div>

        <div className="summary-values">
          <div>
            <span>Total predicted energy</span>
            <strong>{formatNumber(totalEnergy)} kWh</strong>
          </div>
          <div>
            <span>Sum of predicted interval costs</span>
            <strong>₹{formatNumber(totalBill, 4)}</strong>
          </div>
          <div>
            <span>Saved records</span>
            <strong>{totalPredictions}</strong>
          </div>
        </div>

        <p className="chart-disclaimer">
          These sums combine saved model prediction intervals. They are
          not verified meter readings or an official electricity bill.
        </p>
      </section>

      <footer className="footer">
        <span>SmartEnergy · AI-Based Energy Prediction</span>
        <span>Built with React & Machine Learning</span>
      </footer>
    </div>
  );
}

function MetricCard({ icon, label, value, unit, color, note }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${color}`}>{icon}</div>
      <span className="metric-label">{label}</span>

      <div className="metric-value">
        {value} <span>{unit}</span>
      </div>

      <div className="metric-note">{note}</div>
    </article>
  );
}

function QuickAction({
  icon,
  color,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      className="quick-action"
      onClick={onClick}
    >
      <div className={`quick-icon ${color}`}>{icon}</div>

      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <ChevronRight size={18} />
    </button>
  );
}

function PlaceholderPage({ page, onBack }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon">
        <Info size={30} />
      </div>

      <h2>{page}</h2>

      <p>
        This project uses machine learning to estimate energy
        consumption and electricity costs.
      </p>

      <button
        type="button"
        className="primary-button"
        onClick={onBack}
      >
        Back to Dashboard
        <ChevronRight size={17} />
      </button>
    </div>
  );
}

export default App;
