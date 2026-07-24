import { motion, AnimatePresence } from "framer-motion";
import RiskMeter from "./RiskMeter.jsx";
import ContributingFactors from "./ContributingFactors.jsx";
import "./ResultPanel.css";

export default function ResultPanel({ result }) {
  return (
    <aside className="result-panel glass">
      <AnimatePresence mode="wait">
        {!result && (
          <motion.div
            key="placeholder"
            className="result-placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="result-placeholder-icon">🛡️</div>
            <p>Fill in the form and submit to see your predicted risk here.</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            key="result"
            className="result-content"
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -16 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <motion.div
              className={"result-icon " + (result.prediction === 1 ? "positive" : "negative")}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 14 }}
            >
              {result.prediction === 1 ? "⚠" : "✓"}
            </motion.div>

            <h2>{result.result_label}</h2>

            <RiskMeter probability={result.probability} riskLevel={result.risk_level} />

            <p className="result-model">
              Model used: <span>{result.model_name}</span>
            </p>

            <ContributingFactors factors={result.top_factors} />

            <p className="disclaimer">
              This is an ML estimate, not a real credit decision. Please consult a financial
              professional.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
