# Nirikshan

### Crime Analytics & Decision Support Console

Nirikshan is an analytics and decision-support platform for
exploring historical crime/FIR data, discovering recurring incident
patterns, finding similar cases, querying data using natural language,
and generating explainable area/time risk indicators.

The goal is **not to predict whether a particular person will commit a
crime**. The system focuses on aggregated historical incident patterns
to help authorized analysts understand trends and make better-informed
operational decisions.

------------------------------------------------------------------------

## 🎯 Problem

Crime datasets can contain thousands of FIRs and incident records,
making it difficult to quickly answer questions such as:

-   Where are particular crime types concentrated?
-   At what times do incidents occur most frequently?
-   Are there recurring patterns across historical cases?
-   Which historical cases are similar to a newly reported case?
-   What historical factors contribute to elevated incident activity?
-   What operational action could be considered based on the observed
    pattern?

Traditional dashboards often stop at charts and tables.

**Nirikshan goes one step further:**

> **Raw Data → Analysis → Insight → Decision Support**

------------------------------------------------------------------------

## 🚀 Core Features

### 1. Command Center

An interactive overview of historical FIR/incident data.

Features include:

-   Total incident count
-   District-wise distribution
-   Crime-type distribution
-   Time-of-day analysis
-   Weekend/night-time patterns
-   Monthly trends
-   District and crime-type filters
-   Interactive geographic visualization
-   Historical incident records

------------------------------------------------------------------------

### 2. Risk Predictor

Provides an **area/time incident-risk indicator** based on historical
patterns.

Example inputs:

``` text
District: Mysuru
Crime Type: Theft
Month: June
Hour: 22
Weekend: Yes
```

Example output:

``` text
Risk Indicator: 63.4 / 100

Classification:
MODERATE-HIGH
```

The system can also display contributing factors using model
explainability:

``` text
Time of day          +18.2%
Historical pattern   +12.5%
District profile      +9.1%
Weekend pattern       +6.4%
```

The result should be interpreted as a **statistical indicator derived
from historical data**, not a guarantee that an incident will occur.

------------------------------------------------------------------------

### 3. Crime DNA Matcher

Allows an analyst to paste a new case narrative and search historical
FIR descriptions for similar modus-operandi patterns.

Example:

``` text
Two unknown males on a motorcycle approached a victim
near a jewellery market at night, threatened the victim
and stole a gold chain.
```

The system returns similar historical cases:

``` text
FIR-2026-1642
Similarity: 91%

District: Bengaluru Urban
Crime: Chain Snatching
Time: 21:00

Similar characteristics:
✓ Motorcycle
✓ Night
✓ Gold chain
✓ Two suspects
```

#### Initial retrieval approach

``` text
Case Narrative
      ↓
Text Preprocessing
      ↓
TF-IDF Vectorization
      ↓
Cosine Similarity
      ↓
Top-K Similar Cases
```

The retrieval layer can later be upgraded to embedding-based semantic
search.

------------------------------------------------------------------------

### 4. Natural Language Query

Users can query the dataset using plain English.

Example:

> "Show theft cases in Bengaluru Urban on weekends after 8 PM."

The natural-language query is converted into structured filters:

``` json
{
  "district": "Bengaluru Urban",
  "crime_type": "theft",
  "day_type": "weekend",
  "hour_min": 20
}
```

The backend then executes the structured query against the database.

This keeps the LLM focused on **query interpretation** rather than
allowing it to freely invent answers.

------------------------------------------------------------------------

### 5. Decision Support

The system can turn detected patterns into operational considerations.

Example:

``` text
Pattern detected:
Elevated historical incident activity
in Mysuru between 20:00–23:00 on weekends.

Decision support:
Consider reviewing patrol coverage
during this historical high-activity window.
```

Any recommendation should be presented as a **model/data-supported
consideration**, not as an automatic command or guaranteed outcome.

------------------------------------------------------------------------

### 6. Decision Simulator

A planned extension is an interactive simulator that lets users test
hypothetical interventions.

Example:

``` text
Current patrol allocation: 5 units

Scenario:
Move 2 units toward a high-activity zone.

[ SIMULATE ]

Estimated coverage change: +31%
```

Simulation results should be clearly marked as estimates based on
historical/model assumptions.

------------------------------------------------------------------------

# 🧠 System Architecture

``` text
Next.js Frontend
        ↓
FastAPI Backend
        ↓
SQLAlchemy
        ↓
MySQL

┌─────────────────────────────────────────────────────────────┐
│                  ML / LLM Services                         │
│  (risk model, retrieval, embedding, LLM conversion)        │
└─────────────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 🛠️ Technology Stack

## Frontend

-   Next.js
-   React
-   Tailwind CSS
-   Recharts / Plotly
-   Leaflet or MapLibre for geographic visualization

## Backend

-   Python
-   FastAPI
-   Pydantic
-   REST APIs

## Data Processing

-   Pandas
-   NumPy

## Machine Learning

-   Scikit-learn
-   Random Forest
-   SHAP for model explainability

## Case Retrieval

Initial:

-   TF-IDF


Possible upgrade:

-   Sentence embeddings
-   Vector database
-   Semantic retrieval

## Database

-   MySQL

## Optional AI Layer

-   LLM for natural-language-to-structured-filter conversion
-   Embedding model for semantic case retrieval

------------------------------------------------------------------------

# 📁 Suggested Project Structure

``` text
ksp-intelligence/
│
├── src/
│   ├── app/
│   │   ├── command-center/
│   │   ├── risk-predictor/
│   │   ├── crime-dna/
│   │   └── nl-query/
│   │
│   ├── components/
│   ├── lib/
│   └── package.json
│
├── public/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── ml/
│   │   ├── risk_model.py
│   │   ├── explainability.py
│   │   └── retrieval.py
│   │
│   ├── data/
│   ├── scripts/
│   ├── tests/
│   ├── requirements.txt
│   ├── .env.example
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── notebooks/
│   └── exploratory_analysis.ipynb
│
├── docs/
│
├── .env.example
└── README.md
```

------------------------------------------------------------------------

# 🔄 Example Data Flow

## Risk Prediction

``` text
User selects:
    ↓
District
Crime Type
Month
Hour
Weekend
    ↓
Frontend
    ↓
FastAPI
    ↓
Feature preprocessing
    ↓
ML model
    ↓
Risk score
    ↓
SHAP explanation
    ↓
Dashboard
```

## Crime DNA Matching

``` text
Case narrative
      ↓
Text normalization
      ↓
TF-IDF
      ↓
Vector representation
      ↓
Cosine similarity
      ↓
Top-K historical cases
      ↓
Similarity results
```

## Natural Language Query

``` text
User:
"Show theft cases in Mysuru after 8 PM."

                ↓

          Query Parser / LLM

                ↓

{
  "district": "Mysuru",
  "crime_type": "theft",
  "hour_min": 20
}

                ↓

          Database Query

                ↓

        Filtered Results
                ↓
             Charts
```

------------------------------------------------------------------------

# 📊 Example Dataset Schema

A basic incident dataset could contain:

  Field            Description
  ---------------- -----------------------------------
  `fir_id`         Unique incident/FIR identifier
  `date`           Incident date
  `district`       District where incident occurred
  `crime_type`     Type/category of crime
  `hour`           Hour of incident
  `day_of_week`    Day of the week
  `is_weekend`     Weekend indicator
  `latitude`       Geographic latitude
  `longitude`      Geographic longitude
  `description`    Incident narrative
  `repeat_count`   Historical repeat-pattern feature

The actual schema should be adapted to the available dataset.

------------------------------------------------------------------------

# 🔐 Responsible AI & Safety

Because this project deals with crime-related information, responsible
design is a core requirement.

### The system should:

-   Use aggregated/historical incident patterns where possible.
-   Avoid identifying individuals as likely criminals.
-   Avoid profiling people based on sensitive characteristics.
-   Clearly distinguish correlation from causation.
-   Display model uncertainty and limitations.
-   Provide evidence behind analytical outputs.
-   Keep a human analyst in the decision loop.
-   Treat model outputs as decision support rather than automatic
    decisions.

### Risk prediction scope

The risk model should estimate patterns such as:

> "Historical incident activity is elevated for this area/time
> combination."

It should **not** claim:

> "This person is likely to commit a crime."

------------------------------------------------------------------------

# 🧪 Development Roadmap

## Phase 1 --- Data Foundation

-   Obtain/prepare a suitable historical crime dataset.
-   Clean missing and inconsistent values.
-   Define database schema.
-   Load data into MySQL.
-   Perform exploratory analysis.

## Phase 2 --- Command Center

-   Build dashboard layout.
-   Add KPIs.
-   Add crime distribution charts.
-   Add district filters.
-   Add time-based analytics.
-   Add map visualization.

## Phase 3 --- Crime DNA Matcher

-   Implement TF-IDF retrieval.
-   Implement cosine similarity.
-   Return Top-K similar cases.
-   Display similarity evidence.

## Phase 4 --- Risk Predictor

-   Engineer historical/time/location features.
-   Train baseline Random Forest model.
-   Evaluate model.
-   Add SHAP explanations.
-   Expose prediction API.

## Phase 5 --- Natural Language Query

-   Define structured query schema.
-   Convert natural language to JSON filters.
-   Validate generated filters.
-   Execute database query.
-   Render results.

## Phase 6 --- Decision Support

-   Detect important patterns.
-   Generate evidence-backed insights.
-   Add recommended operational considerations.
-   Add decision simulator.

## Phase 7 --- Production Polish

-   Authentication/authorization
-   API error handling
-   Loading states
-   Empty states
-   Audit logging
-   Input validation
-   Responsive UI
-   Deployment

------------------------------------------------------------------------

# 🎯 Hackathon MVP

If development time is limited, prioritize:

``` text
                     NIRIKSHAN
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    COMMAND CENTER    RISK PREDICTOR    DNA MATCHER
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                     NL QUERY
```

The minimum impressive version should contain:

-   A polished command center
-   Real historical/sample data
-   Interactive filtering
-   Crime trend visualizations
-   A working risk model
-   SHAP-based explanation
-   TF-IDF case matching
-   Natural-language queries
-   Evidence-backed decision support

------------------------------------------------------------------------

# 💡 Example User Journey

### Step 1

An analyst opens the Command Center.

They notice that chain-snatching incidents have historically increased
during certain evening hours.

### Step 2

They open Risk Predictor.

They select:

``` text
District: Bengaluru Urban
Crime: Chain Snatching
Hour: 21
Weekend: Yes
```

The system produces an incident-pattern risk indicator and explains the
major contributing features.

### Step 3

A new case narrative is entered into Crime DNA Matcher.

The system retrieves historically similar cases.

### Step 4

The analyst asks:

> "Show chain-snatching incidents in Bengaluru Urban after 8 PM during
> weekends."

The NL Query module converts the question into structured filters and
displays the relevant records.

### Step 5

The system summarizes the observed historical pattern and presents an
operational consideration supported by the underlying data.

------------------------------------------------------------------------

# 🌟 Why This Project Fits the Challenge

The challenge asks for systems that turn raw data into **actionable
insight**, rather than simply presenting passive charts.

Nirikshan follows:

``` text
RAW DATA
   ↓
DATA PROCESSING
   ↓
ANALYTICS
   ↓
MACHINE LEARNING
   ↓
PATTERN DISCOVERY
   ↓
EXPLAINABLE INSIGHT
   ↓
DECISION SUPPORT
```

This combines:

-   Data analytics
-   Interactive visualization
-   Predictive modeling
-   Explainable AI
-   Information retrieval
-   Natural-language interfaces
-   Decision support

into a single platform.

------------------------------------------------------------------------

# ⚠️ Disclaimer

This project is intended as a **technical prototype for data analysis
and decision support**.

Model outputs are statistical estimates based on available historical
data and should not be interpreted as certainty, proof of criminal
intent, or identification of individuals as criminals.

Operational decisions should remain under appropriate human oversight
and follow applicable laws, policies, and data-protection requirements.

------------------------------------------------------------------------

## 🏗️ Project Status

**Status:** Prototype / Hackathon Development

**Primary Goal:** Transform historical crime data into an interactive,
explainable decision-support system.

**Core principle:**

> **Don't just show what happened. Help the analyst understand what the
> data suggests, why it suggests it, and what can be considered next.**
