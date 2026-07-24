"""Flask JSON API for the CodeAlpha Credit Scoring project.

Pure API backend — the UI is a separate React app (see ../frontend). Serves:
  GET  /api/credit/info    -> headline model stats for the home page
  GET  /api/credit/form    -> field config + ranges + a sample applicant
  POST /api/predict/credit -> run the trained model on submitted values
"""
import json
from pathlib import Path

import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

from field_config import FORM, FACTOR_LABELS

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"

app = Flask(__name__)
CORS(app)

MODEL = joblib.load(MODELS_DIR / "credit_model.pkl")
SCALER = joblib.load(MODELS_DIR / "credit_scaler.pkl")
with open(MODELS_DIR / "credit_metadata.json") as f:
    METADATA = json.load(f)

RAW_FEATURES = [
    "RevolvingUtilizationOfUnsecuredLines", "age",
    "NumberOfTime30-59DaysPastDueNotWorse", "DebtRatio", "MonthlyIncome",
    "NumberOfOpenCreditLinesAndLoans", "NumberOfTimes90DaysLate",
    "NumberRealEstateLoansOrLines", "NumberOfTime60-89DaysPastDueNotWorse",
    "NumberOfDependents",
]
PAST_DUE_COLS = [
    "NumberOfTime30-59DaysPastDueNotWorse",
    "NumberOfTime60-89DaysPastDueNotWorse",
    "NumberOfTimes90DaysLate",
]
DEBT_TO_INCOME_HIGH_RISK_THRESHOLD = 0.5
ALL_FEATURES = METADATA["feature_names"]  # raw 10 + 2 engineered, in training order


def add_engineered_features(values):
    """values: dict of the 10 raw fields -> dict including the 2 engineered ones."""
    values = dict(values)
    values["TotalPastDueEvents"] = sum(values[c] for c in PAST_DUE_COLS)
    values["DebtToIncomeFlag"] = 1.0 if values["DebtRatio"] > DEBT_TO_INCOME_HIGH_RISK_THRESHOLD else 0.0
    return values


def attach_ranges():
    """Return the form config with min/max attached to each numeric field."""
    form = json.loads(json.dumps(FORM))  # cheap deep copy
    ranges = METADATA["feature_ranges"]
    for section in form["sections"]:
        for field in section["fields"]:
            if field["type"] == "number" and field["name"] in ranges:
                lo, hi = ranges[field["name"]]
                field["min"] = lo
                field["max"] = hi
                field["placeholder"] = f"{lo} - {hi}"
    return form


@app.route("/api/credit/info")
def credit_info():
    return jsonify({
        "model_name": METADATA["best_model"],
        "dataset_size": METADATA["dataset_size"],
        "roc_auc": METADATA["metrics"]["roc_auc"],
        "accuracy": METADATA["metrics"]["accuracy"],
    })


@app.route("/api/credit/form")
def credit_form():
    form = attach_ranges()
    sample_record = {name: METADATA["sample_record"][name] for name in RAW_FEATURES}
    return jsonify({
        "title": form["title"],
        "subtitle": form["subtitle"],
        "sections": form["sections"],
        "sample_record": sample_record,
    })


@app.route("/api/predict/credit", methods=["POST"])
def predict_credit():
    payload = request.get_json(silent=True) or request.form

    try:
        raw_values = {name: float(payload[name]) for name in RAW_FEATURES}
    except (KeyError, TypeError, ValueError):
        return jsonify({"error": "Missing or invalid input values"}), 400

    full_values = add_engineered_features(raw_values)
    X = np.array([[full_values[name] for name in ALL_FEATURES]])
    X_scaled = SCALER.transform(X)

    prediction = int(MODEL.predict(X_scaled)[0])
    probability = float(MODEL.predict_proba(X_scaled)[0][1])

    if probability >= 0.7:
        risk_level = "High"
    elif probability >= 0.4:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    result_label = FORM["positive_label"] if prediction == 1 else FORM["negative_label"]

    top_factors = sorted(
        METADATA["feature_importances"].items(), key=lambda item: item[1], reverse=True
    )[:4]
    top_factors = [
        {"feature": name, "label": FACTOR_LABELS.get(name, name), "impact": impact}
        for name, impact in top_factors
    ]

    return jsonify({
        "prediction": prediction,
        "probability": round(probability * 100, 2),
        "risk_level": risk_level,
        "result_label": result_label,
        "model_name": METADATA["best_model"],
        "top_factors": top_factors,
    })


if __name__ == "__main__":
    app.run(debug=True, port=5051)
