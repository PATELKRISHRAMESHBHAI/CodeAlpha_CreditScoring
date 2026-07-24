import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber.jsx";
import "./RiskMeter.css";

const RISK_COLOR_VAR = {
  Low: "var(--color-success)",
  Moderate: "var(--color-warning)",
  High: "var(--color-danger)",
};

export default function RiskMeter({ probability, riskLevel }) {
  const color = RISK_COLOR_VAR[riskLevel] || "var(--color-accent)";

  return (
    <div className="risk-meter-wrap">
      <div className="risk-meter-value" style={{ color }}>
        <AnimatedNumber value={probability} decimals={1} />%
      </div>

      <div className="risk-meter-track">
        <motion.div
          className="risk-meter-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${probability}%` }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </div>

      <motion.p
        className="risk-meter-level"
        style={{ color }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {riskLevel} Risk
      </motion.p>
    </div>
  );
}
