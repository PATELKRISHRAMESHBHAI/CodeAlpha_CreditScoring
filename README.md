# CodeAlpha_CreditScoring

## Credit Scoring Model — "CreditIQ" Web App

Machine Learning internship project (Task 1) for **CodeAlpha**. A full-stack web app that predicts an
applicant's credit risk — the likelihood of serious delinquency within 2 years — from their credit usage,
payment history, and income: a **Flask JSON API** serving a trained scikit-learn model, and an **animated React
frontend** (Vite + framer-motion) consuming it.

---

## 1. Objective

Predict an individual's creditworthiness from past financial data. The model outputs a binary prediction ("good
credit standing" vs "high risk of serious delinquency") together with a probability score, a Low/Moderate/High
risk tier, and the top factors that drove the prediction — shown live in the browser with animated transitions.

---

## 2. Architecture

```
┌───────────────────────────┐        JSON / fetch        ┌───────────────────────────┐
│   React frontend (Vite)    │ ─────────────────────────▶ │   Flask API (backend/)     │
│   framer-motion, router    │ ◀───────────────────────── │   scikit-learn model       │
└───────────────────────────┘                             └───────────────────────────┘
       localhost:5174                                            localhost:5051
```

The backend is a stateless JSON API — `GET /api/credit/info`, `GET /api/credit/form`,
`POST /api/predict/credit`. The frontend is a single-page app that fetches from it and owns all UI/animation.

---

## 3. Dataset

**"Give Me Some Credit"** — 150,000 anonymized historical credit records, 10 predictor features + 1 binary
target (`SeriousDlqin2yrs`).

| Column | Type | Notes |
|---|---|---|
| `SeriousDlqin2yrs` | int (0/1) | **Target.** 1 = experienced 90+ days delinquency within 2 years |
| `RevolvingUtilizationOfUnsecuredLines` | float | Total balance on credit cards/lines ÷ total credit limit |
| `age` | int | Applicant age |
| `NumberOfTime30-59DaysPastDueNotWorse` | int | Times 30-59 days late in the last 2 years |
| `DebtRatio` | float | Monthly debt payments ÷ monthly gross income |
| `MonthlyIncome` | float | ~20% missing → median-imputed |
| `NumberOfOpenCreditLinesAndLoans` | int | Open loans/credit lines |
| `NumberOfTimes90DaysLate` | int | Times 90+ days late |
| `NumberRealEstateLoansOrLines` | int | Mortgage/real-estate loans |
| `NumberOfTime60-89DaysPastDueNotWorse` | int | Times 60-89 days late |
| `NumberOfDependents` | int | ~2.6% missing → zero-imputed |

**Cleaning**: median-imputed `MonthlyIncome`, zero-imputed `NumberOfDependents`, capped sentinel "unknown"
values (96/98) in the three past-due counters to the highest genuinely-observed value, winsorized
`RevolvingUtilizationOfUnsecuredLines`/`DebtRatio` at the 99.5th percentile, corrected one invalid `age=0` row.

**Engineered features** (computed automatically server-side, not requested from the user):
- `TotalPastDueEvents` — sum of the three past-due counters
- `DebtToIncomeFlag` — 1 if `DebtRatio` exceeds 0.5, else 0

---

## 4. Approach / Methodology

1. **Data Collection** — public mirror of the original Kaggle "Give Me Some Credit" competition dataset.
2. **Data Preprocessing** — imputation, sentinel-value capping, winsorization (see above).
3. **Model Building** — trains and compares 3 classifiers, all class-weighted for the ~6.7% positive-class
   imbalance: Logistic Regression, Decision Tree, Random Forest.
4. **Model Selection** — best model kept by test-set ROC-AUC, serialized to `backend/models/`.
5. **Model Evaluation** — Accuracy, Precision, Recall, F1, ROC-AUC, 5-fold CV ROC-AUC, confusion matrix,
   persisted to `backend/reports/credit_report.json`.
6. **Feature Importance** — extracted from the winning model and persisted to metadata, powering the UI's
   "Top Contributing Factors" panel.
7. **Serving** — Flask (`backend/app.py`) loads the trained model + scaler at startup and exposes a JSON API.
8. **UI** — React (`frontend/`) fetches from that API and renders an animated splash loader, animated 3-section
   form, and an animated results panel (count-up %, risk meter fill, spring pop-ins, proportional factor bars).

---

## 5. Results

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC |
|---|---|---|---|---|---|
| Logistic Regression | 0.799 | 0.214 | 0.749 | 0.333 | 0.858 |
| Decision Tree | 0.799 | 0.216 | 0.764 | 0.337 | 0.854 |
| **Random Forest (selected)** | **0.831** | **0.242** | **0.717** | **0.362** | **0.864** |

ROC-AUC of 0.864 exceeds the 0.80 target. Precision is low relative to accuracy because the target class is
rare (~6.7% of applicants) — Recall (catching true at-risk applicants) is weighted alongside Precision when
comparing models, consistent with standard practice for imbalanced credit risk data. Full per-model comparison
is in `backend/reports/credit_report.json`.

**Top global feature importances**: Revolving credit utilization (28.6%), overall past-due history (23.4%),
times 90+ days late (10.1%), times 30-59 days past due (9.0%).

---

## 6. Tech Stack

- **ML**: `scikit-learn`, `pandas`, `numpy`, `joblib` (Python 3.14)
- **Backend**: `Flask`, `flask-cors`
- **Frontend**: `React 19`, `Vite`, `framer-motion`, `react-router-dom`

---

## 7. Project Structure

```
CodeAlpha_CreditScoring/
├── README.md
├── backend/
│   ├── app.py                    <- Flask JSON API (info, form, predict)
│   ├── field_config.py           <- Form field labels/help text/section grouping
│   ├── requirements.txt
│   ├── data/raw/credit.csv
│   ├── src/                      <- train_utils.py + train_credit.py
│   ├── models/                   <- Generated credit_model.pkl / _scaler.pkl / _metadata.json
│   └── reports/                  <- Full metric comparison across all 3 algorithms
└── frontend/
    ├── src/
    │   ├── api/client.js         <- fetch wrapper for the Flask API
    │   ├── components/           <- Loader, Navbar, Footer, RiskMeter, ContributingFactors, ResultPanel, ...
    │   ├── pages/                <- Home.jsx, Assessment.jsx
    │   └── App.jsx               <- routing + splash loader + page transitions
    └── package.json
```

---

## 8. Evaluation Metrics

| Metric | Why it matters |
|---|---|
| **Recall (Sensitivity)** | Minimizing missed at-risk applicants matters for a lender |
| **Precision** | Avoid flagging too many good applicants as risky |
| **F1-Score** | Balance between precision and recall |
| **ROC-AUC** | Overall discriminative ability across thresholds (used to pick the final model) |
| **Confusion Matrix** | Visual breakdown of TP/TN/FP/FN |

---

## 9. How to Run

**Backend (Flask API), from `backend/`:**

```bash
python -m pip install -r requirements.txt

# Only needed once / after changing data:
cd src && python train_credit.py && cd ..

python app.py   # serves http://127.0.0.1:5051
```

**Frontend (React), from `frontend/`, in a second terminal:**

```bash
npm install
npm run dev     # serves http://localhost:5174 (or the port Vite selects)
```

Open the frontend URL. The home page fetches live model metrics from the Flask API. The Assessment page has a
**"Fill Sample Data"** button (the dataset's median applicant) for an instant demo. Submitting calls
`POST /api/predict/credit` and animates in the prediction, probability, risk level, and top contributing
factors.

To point the frontend at a different backend URL, set `VITE_API_URL` — see `frontend/.env.example`.

---

## 10. Project Checklist (CodeAlpha Submission Requirements)

- [x] Data preprocessing pipeline built (imputation, outlier capping, winsorization)
- [x] 3 models trained and compared (Logistic Regression, Decision Tree, Random Forest)
- [x] Best model auto-selected based on ROC-AUC (0.864, above the 0.80 target)
- [x] Feature engineering (TotalPastDueEvents, DebtToIncomeFlag)
- [x] Results documented in `backend/reports/` and `backend/models/credit_metadata.json`
- [x] Interactive, animated web app built (Flask API + React frontend) for live predictions
- [x] Code pushed to GitHub repo named `CodeAlpha_CreditScoring`
- [ ] Video explanation recorded and posted on LinkedIn (tagging @CodeAlpha) with GitHub repo link
- [ ] Task submitted via the official CodeAlpha submission form

---

## 11. References

- Original dataset: "Give Me Some Credit" (Kaggle competition, 2011)
- Scikit-learn documentation: https://scikit-learn.org/stable/
- CodeAlpha: https://www.codealpha.tech

---

## 12. Disclaimer

This tool provides ML-based estimates for **educational purposes only** and is not a real credit or lending
decision. Consult a qualified financial professional for actual credit decisions.

---

## 13. Author

**Krish Patel**
CodeAlpha Machine Learning Internship — Task 1: Credit Scoring Model
