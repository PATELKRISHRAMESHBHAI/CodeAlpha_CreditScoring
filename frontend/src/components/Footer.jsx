import { motion } from "framer-motion";
import "./Footer.css";

export default function Footer() {
  return (
    <motion.footer
      className="site-footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <p>
          Built for the <strong>CodeAlpha Machine Learning Internship</strong> — Task 1: Credit
          Scoring Model.
        </p>
        <p className="disclaimer">
          ⚠️ This tool provides ML-based estimates for educational purposes only and is{" "}
          <strong>not</strong> a real credit or lending decision.
        </p>
      </div>
    </motion.footer>
  );
}
