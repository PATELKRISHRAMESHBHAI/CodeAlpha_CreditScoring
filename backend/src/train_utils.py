"""Shared training/evaluation pipeline for the credit scoring model."""
import json
import joblib
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix
)

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
REPORTS_DIR = Path(__file__).resolve().parent.parent / "reports"


def _feature_importances(model, feature_names):
    """Extract a {feature: importance} dict from a tree-based or linear model."""
    if hasattr(model, "feature_importances_"):
        values = model.feature_importances_
    elif hasattr(model, "coef_"):
        values = np.abs(model.coef_[0])
    else:
        return {}

    total = values.sum() or 1.0
    return {name: round(float(v / total), 4) for name, v in zip(feature_names, values)}


def train_and_save(model_key, X, y, feature_names, feature_ranges=None):
    """Train several classifiers, pick the best by ROC-AUC, save model+scaler+metadata."""
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    candidates = {
        "LogisticRegression": LogisticRegression(max_iter=2000, class_weight="balanced", random_state=42),
        "DecisionTree": DecisionTreeClassifier(max_depth=6, class_weight="balanced", random_state=42),
        "RandomForest": RandomForestClassifier(
            n_estimators=300, max_depth=12, class_weight="balanced", random_state=42, n_jobs=-1
        ),
    }

    results = {}
    best_name, best_model, best_auc = None, None, -1

    for name, model in candidates.items():
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        y_proba = model.predict_proba(X_test_scaled)[:, 1]

        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring="roc_auc")

        metrics = {
            "accuracy": round(accuracy_score(y_test, y_pred), 4),
            "precision": round(precision_score(y_test, y_pred), 4),
            "recall": round(recall_score(y_test, y_pred), 4),
            "f1_score": round(f1_score(y_test, y_pred), 4),
            "roc_auc": round(roc_auc_score(y_test, y_proba), 4),
            "cv_roc_auc_mean": round(cv_scores.mean(), 4),
            "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
        }
        results[name] = metrics
        print(f"[{model_key}] {name}: {metrics}")

        if metrics["roc_auc"] > best_auc:
            best_auc = metrics["roc_auc"]
            best_name = name
            best_model = model

    print(f"[{model_key}] Best model: {best_name} (ROC-AUC={best_auc})")

    joblib.dump(best_model, MODELS_DIR / f"{model_key}_model.pkl")
    joblib.dump(scaler, MODELS_DIR / f"{model_key}_scaler.pkl")

    sample_record = {name: round(float(X[name].median()), 4) for name in feature_names}

    metadata = {
        "model_key": model_key,
        "best_model": best_name,
        "feature_names": feature_names,
        "feature_ranges": feature_ranges or {},
        "sample_record": sample_record,
        "feature_importances": _feature_importances(best_model, feature_names),
        "dataset_size": int(len(X)),
        "metrics": results[best_name],
        "all_results": results,
    }
    with open(MODELS_DIR / f"{model_key}_metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

    with open(REPORTS_DIR / f"{model_key}_report.json", "w") as f:
        json.dump(results, f, indent=2)

    return best_name, results[best_name]
