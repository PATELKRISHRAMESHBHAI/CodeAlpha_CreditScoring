import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition.jsx";
import AnimatedBlobs from "../components/AnimatedBlobs.jsx";
import { fetchCreditInfo } from "../api/client.js";
import "./Home.css";

const HEADING = [
  { text: "Know", accent: false },
  { text: "Your", accent: false },
  { text: "Credit", accent: true },
  { text: "Risk,", accent: true },
  { text: "Instantly", accent: false },
];

const STEPS = [
  { title: "Enter Your Details", desc: "Fill in your credit usage, payment history, and income on the assessment page." },
  { title: "AI Analyzes Your Profile", desc: "A trained classifier (Logistic Regression, Decision Tree, or Random Forest — whichever scored best) evaluates the inputs." },
  { title: "Get Instant Results", desc: "See your predicted risk tier, a probability score, and the top factors behind it, right in your browser." },
];

const wordVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.07, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Home() {
  const [info, setInfo] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetchCreditInfo()
      .then((data) => {
        setInfo(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const stats = info
    ? [
        { value: `${info.dataset_size.toLocaleString()}+`, label: "Records Analyzed" },
        { value: "3", label: "ML Models Compared" },
        { value: `${Math.round(info.roc_auc * 100)}%`, label: "Model Accuracy (ROC-AUC)" },
      ]
    : [];

  return (
    <PageTransition>
      <section className="hero">
        <AnimatedBlobs />
        <div className="container">
          <h1>
            {HEADING.map((w, i) => (
              <motion.span
                key={w.text}
                className={"word" + (w.accent ? " word-accent" : "")}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={wordVariants}
              >
                {w.text}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            A machine-learning model trained on historical credit data to estimate the likelihood
            of serious delinquency from an applicant's credit usage, payment history, and income.
          </motion.p>

          {status === "ready" && (
            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {stats.map((s) => (
                <div className="hero-stat" key={s.label}>
                  <span className="hero-stat-value">{s.value}</span>
                  <span className="hero-stat-label">{s.label}</span>
                </div>
              ))}
            </motion.div>
          )}
          {status === "error" && (
            <p className="cards-status">
              Live model stats unavailable — is the Flask backend running?
            </p>
          )}
        </div>
      </section>

      <section className="container feature-section">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/assessment" className="feature-card">
            <div className="feature-card-icon">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5z" />
                <path d="M7 12.5a5 5 0 0 1 10 0" />
                <path d="M12 12.5 15 9.5" />
                <circle cx="12" cy="12.5" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div className="feature-card-body">
              <h2>Check Your Credit Risk</h2>
              <p>Enter your financial details and get an instant, explained risk assessment.</p>
            </div>
            <span className="feature-card-cta">
              Get Started
              <span className="feature-card-cta-arrow">→</span>
            </span>
          </Link>
        </motion.div>
      </section>

      <section className="container about-section">
        <div className="section-heading">
          <h2>How It Works</h2>
        </div>
        <div className="about-grid">
          {STEPS.map((step, i) => (
            <motion.div
              className="about-item"
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
            >
              <span className="about-step">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
