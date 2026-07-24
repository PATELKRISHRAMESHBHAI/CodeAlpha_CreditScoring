"""Human-friendly form definition for the credit risk assessment page.

Numeric min/max bounds shown in the UI are filled in at runtime from
credit_metadata.json's feature_ranges (see app.py: attach_ranges), so this
file only needs to describe labels, help text, and section grouping.
"""

FORM = {
    "title": "Credit Risk Assessment",
    "subtitle": "Based on credit usage, payment history, and income",
    "positive_label": "High risk of serious delinquency",
    "negative_label": "Good credit standing",
    "sections": [
        {
            "name": "Credit Usage",
            "fields": [
                {
                    "name": "RevolvingUtilizationOfUnsecuredLines",
                    "label": "Revolving Credit Utilization",
                    "help": "Total balance on credit cards / total credit limit",
                    "type": "number",
                    "step": "0.0001",
                },
                {
                    "name": "NumberOfOpenCreditLinesAndLoans",
                    "label": "Open Credit Lines & Loans",
                    "type": "number",
                    "step": "1",
                },
                {
                    "name": "NumberRealEstateLoansOrLines",
                    "label": "Real Estate Loans / Lines",
                    "help": "Mortgages and home equity lines",
                    "type": "number",
                    "step": "1",
                },
            ],
        },
        {
            "name": "Payment History",
            "fields": [
                {
                    "name": "NumberOfTime30-59DaysPastDueNotWorse",
                    "label": "Times 30-59 Days Past Due",
                    "type": "number",
                    "step": "1",
                },
                {
                    "name": "NumberOfTime60-89DaysPastDueNotWorse",
                    "label": "Times 60-89 Days Past Due",
                    "type": "number",
                    "step": "1",
                },
                {
                    "name": "NumberOfTimes90DaysLate",
                    "label": "Times 90+ Days Late",
                    "type": "number",
                    "step": "1",
                },
            ],
        },
        {
            "name": "Income & Household",
            "fields": [
                {
                    "name": "MonthlyIncome",
                    "label": "Monthly Income",
                    "type": "number",
                    "step": "1",
                },
                {
                    "name": "DebtRatio",
                    "label": "Debt Ratio",
                    "help": "Monthly debt payments / monthly gross income",
                    "type": "number",
                    "step": "0.0001",
                },
                {
                    "name": "age",
                    "label": "Age",
                    "type": "number",
                    "step": "1",
                },
                {
                    "name": "NumberOfDependents",
                    "label": "Number of Dependents",
                    "type": "number",
                    "step": "1",
                },
            ],
        },
    ],
}

# Plain-language labels for the "top contributing factors" list, keyed by the
# raw + engineered feature names used by the trained model.
FACTOR_LABELS = {
    "RevolvingUtilizationOfUnsecuredLines": "Revolving credit utilization",
    "age": "Applicant age",
    "NumberOfTime30-59DaysPastDueNotWorse": "Times 30-59 days past due",
    "DebtRatio": "Debt-to-income ratio",
    "MonthlyIncome": "Monthly income",
    "NumberOfOpenCreditLinesAndLoans": "Number of open credit lines/loans",
    "NumberOfTimes90DaysLate": "Times 90+ days late",
    "NumberRealEstateLoansOrLines": "Real estate loans/lines",
    "NumberOfTime60-89DaysPastDueNotWorse": "Times 60-89 days past due",
    "NumberOfDependents": "Number of dependents",
    "TotalPastDueEvents": "Overall late-payment history",
    "DebtToIncomeFlag": "High debt-to-income flag",
}
