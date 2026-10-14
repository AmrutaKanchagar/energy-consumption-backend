# ⚡ AI-Based Smart Energy Consumption and Bill Prediction System

<p align="center">
  <b>A Machine Learning-Based System for Energy Consumption and Electricity Bill Prediction</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.x-blue?logo=python" />
  <img src="https://img.shields.io/badge/Scikit--learn-ML-orange?logo=scikit-learn" />
  <img src="https://img.shields.io/badge/Pandas-Data%20Analysis-purple?logo=pandas" />
  <img src="https://img.shields.io/badge/Flask-API-black?logo=flask" />
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow" />
</p>

---

## 📌 Project Overview

The **AI-Based Smart Energy Consumption and Bill Prediction System** is a machine learning project designed to predict household energy consumption and estimate the corresponding electricity bill.

The system consists of two interconnected machine learning pipelines:

1. ⚡ **Energy Consumption Prediction**
2. 💰 **Electricity Bill Prediction**

The predicted energy consumption from the first model is passed to the bill prediction model to estimate the electricity cost based on the applicable tariff.

The project is designed to be integrated with a **Flask API and web-based interface** for user interaction.

---

## 🎯 Objectives

The main objectives of the project are:

- To analyze household electricity consumption data.
- To preprocess and transform raw energy consumption data.
- To perform exploratory data analysis and identify important patterns.
- To develop machine learning models for energy consumption prediction.
- To develop a machine learning model for electricity bill prediction.
- To compare the performance of different regression algorithms.
- To integrate energy and bill prediction into a single pipeline.
- To prepare the machine learning models for API and web application integration.

---

## 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │      User Input      │
                         │──────────────────────│
                         │ Voltage              │
                         │ Current              │
                         │ Date / Time          │
                         │ Tariff               │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌────────────────────────────┐
                    │  Energy Prediction Model   │
                    │────────────────────────────│
                    │ Linear Regression           │
                    │ Decision Tree               │
                    │ Random Forest               │
                    └──────────────┬─────────────┘
                                   │
                                   ▼
                    ┌────────────────────────────┐
                    │ Predicted Active Power      │
                    │          (kW)               │
                    └──────────────┬─────────────┘
                                   │
                                   ▼
                    ┌────────────────────────────┐
                    │ Energy Conversion           │
                    │          (kWh)              │
                    └──────────────┬─────────────┘
                                   │
                                   ▼
                    ┌────────────────────────────┐
                    │   Bill Prediction Model     │
                    │────────────────────────────│
                    │ Energy Consumption          │
                    │ Tariff                      │
                    └──────────────┬─────────────┘
                                   │
                                   ▼
                    ┌────────────────────────────┐
                    │ Predicted Electricity Bill  │
                    │            (₹)              │
                    └────────────────────────────┘
⚡ Energy Consumption Prediction

The Energy Consumption Prediction pipeline is responsible for predicting Global Active Power using electrical and time-based features.

Pipeline
Raw Dataset
     ↓
Data Loading
     ↓
Data Cleaning
     ↓
Feature Engineering
     ↓
Exploratory Analysis
     ↓
Model Training
     ↓
Model Evaluation
     ↓
Best Model
     ↓
Energy Prediction

Target Variable
Global_active_power
Features Used
Voltage
Global_intensity
Hour
Day
Month
Weekday
Weekend
Peak_Hour
Machine Learning Models
Linear Regression
Decision Tree Regressor
Random Forest Regressor

💰 Electricity Bill Prediction

The Electricity Bill Prediction pipeline was developed as the second machine learning component of the project.

Since the original energy dataset does not directly contain an electricity bill column, a bill dataset is created using energy consumption and tariff information.

Bill Prediction Inputs
Energy_kWh
Tariff
Target Variable
Bill
Machine Learning Models
Linear Regression
Decision Tree Regressor
Random Forest Regressor
🔗 Integrated Energy + Bill Prediction

The two machine learning pipelines are integrated as follows:

Energy Prediction
       ↓
Predicted Power (kW)
       ↓
Energy Conversion
       ↓
Energy Consumption (kWh)
       ↓
Bill Prediction
       ↓
Predicted Bill (₹)

The integrated prediction module is:

src/predict_energy_and_bill.py
Example Prediction

For the tested input:

Voltage       : 240 V
Current       : 4 A
Hour          : 19
Day           : 24
Month         : 9
Weekday       : 3
Tariff        : ₹8/kWh

The system produced:

Predicted Power       : 0.9072 kW
Energy Consumption    : 0.015119 kWh
Tariff                : ₹8.00/kWh
Predicted Bill        : ₹0.1210

Note: The current implementation calculates the bill for the prediction interval. It should not be interpreted as a monthly electricity bill unless predictions are aggregated over the corresponding billing period.
