import { motion } from "framer-motion";
import "./ContributingFactors.css";

export default function ContributingFactors({ factors }) {
  if (!factors || factors.length === 0) return null;

  const maxImpact = Math.max(...factors.map((f) => f.impact));

  return (
    <div className="factors">
      <h3 className="factors-title">Top Contributing Factors</h3>
      <ul className="factors-list">
        {factors.map((f, i) => (
          <motion.li
            key={f.feature}
            className="factors-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.35 }}
          >
            <span className="factors-label">{f.label}</span>
            <span className="factors-bar-track">
              <motion.span
                className="factors-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(f.impact / maxImpact) * 100}%` }}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.6, ease: "easeOut" }}
              />
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
