# Nirikshan

### Crime Analytics & Decision Support Console

Nirikshan is a prototype platform for exploring historical crime/FIR data and turning raw incident records into clear, explainable insights.

## 🚧 Current Status: Phase 1

The project is currently focused on building the **data foundation and interactive Command Center**.

The first release is designed to let a visitor explore historical incident patterns through filters, charts, records, and basic geographic visualization. Advanced ML, case retrieval, and natural-language features are planned for later phases.

---

## 🔎 What Can Be Explored?

### Command Center

The Phase 1 dashboard provides:

- Total incident count
- District-wise incident distribution
- Crime-type distribution
- Time-of-day patterns
- Weekend and night-time patterns
- Monthly trends
- District filtering
- Crime-type filtering
- Incident records
- Basic geographic visualization where the dataset supports it

Changing filters updates the displayed analytics so users can explore different slices of the historical data.

---

## 📊 Data Foundation

The platform works with structured historical/sample incident records.

A typical record can contain:

```text
fir_id
date
district
crime_type
hour
day_of_week
is_weekend
latitude
longitude
description
```

Before reaching the dashboard, the data goes through cleaning and validation so that missing or inconsistent values can be handled consistently.

---

## 🏗️ Architecture

```text
Historical / Sample Data
          ↓
    Data Cleaning
          ↓
       Database
          ↓
       FastAPI
          ↓
    Next.js / React
          ↓
    Command Center
```

---

## 🛠️ Technology

**Frontend**
- Next.js
- React
- Tailwind CSS
- Recharts

**Backend**
- Python
- FastAPI
- Pydantic

**Data**
- MySQL
- Pandas
- NumPy

---

## 🎯 Phase 1 Objective

The first phase establishes the foundation for the intelligence features that will follow.

A visitor should be able to:

1. Open the Command Center.
2. Explore the available incident data.
3. Filter incidents by district and crime type.
4. See the visualizations update with the selected filters.
5. Inspect individual incident records.
6. Identify basic historical patterns from the available data.

---

## 🔮 Planned Next Steps

The following capabilities are intentionally outside the current Phase 1 scope:

- **Risk Predictor** — historical area/time risk indicators
- **Crime DNA Matcher** — similar historical case retrieval
- **Natural Language Query** — ask questions about the dataset in plain English
- **Explainable ML** — understand factors contributing to model outputs
- **Decision Simulator** — explore hypothetical operational scenarios

These features will be introduced incrementally after the Phase 1 data pipeline and Command Center are stable.

---

## 🧩 Project Philosophy

```text
Raw Data
   ↓
Clean Data
   ↓
Analyze
   ↓
Visualize
   ↓
Understand Patterns
   ↓
Build Intelligence
```

**Nirikshan starts with reliable data and clear visualization, then builds intelligence on top of that foundation.**

---

## ⚠️ Responsible Use

This project is a technical prototype for historical data analysis and decision support.

Its outputs are intended to help users understand patterns in available data and should not be treated as certainty, proof of criminal intent, or identification of individuals as criminals.
