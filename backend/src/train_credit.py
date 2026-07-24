"""Train the Credit Scoring model ("Give Me Some Credit" dataset).

Trains on the 10 raw applicant fields plus 2 engineered features (TotalPastDueEvents,
DebtToIncomeFlag). The API only asks the user for the 10 raw fields — the engineered
features are computed automatically server-side, both here at training time and again
in the Flask predict handler at inference time, so the two stay in lockstep.
"""
import numpy as np
import pandas as pd
from pathlib import Path
from train_utils import train_and_save

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "raw" / "credit.csv"

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

ALL_FEATURES = RAW_FEATURES + ["TotalPastDueEvents", "DebtToIncomeFlag"]


def add_engineered_features(df):
    df = df.copy()
    df["TotalPastDueEvents"] = df[PAST_DUE_COLS].sum(axis=1)
    df["DebtToIncomeFlag"] = (df["DebtRatio"] > DEBT_TO_INCOME_HIGH_RISK_THRESHOLD).astype(int)
    return df


def clean(df):
    df = df.drop(columns=["id"])

    # Missing values
    df["MonthlyIncome"] = df["MonthlyIncome"].fillna(df["MonthlyIncome"].median())
    df["NumberOfDependents"] = df["NumberOfDependents"].fillna(0)

    # Invalid age (a single age==0 row)
    df.loc[df["age"] < 18, "age"] = df["age"].median()

    # Sentinel "unknown" values (96/98) in the past-due counters: cap to the highest
    # genuinely-observed (non-sentinel) value for that column.
    for col in PAST_DUE_COLS:
        real_max = df.loc[df[col] < 96, col].max()
        df.loc[df[col] >= 96, col] = real_max

    # Heavy-tailed outliers: winsorize at the 99.5th percentile.
    for col in ["RevolvingUtilizationOfUnsecuredLines", "DebtRatio"]:
        cap = df[col].quantile(0.995)
        df[col] = df[col].clip(upper=cap)

    return df


def main():
    df = pd.read_csv(DATA_PATH)
    df = clean(df)
    df = add_engineered_features(df)

    X = df[ALL_FEATURES]
    y = df["SeriousDlqin2yrs"]

    feature_ranges = {
        col: [round(float(X[col].min()), 4), round(float(X[col].max()), 4)] for col in RAW_FEATURES
    }

    train_and_save(
        model_key="credit",
        X=X,
        y=y,
        feature_names=ALL_FEATURES,
        feature_ranges=feature_ranges,
    )


if __name__ == "__main__":
    main()
