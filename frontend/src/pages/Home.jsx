import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition.jsx";
import { fetchCreditInfo } from "../api/client.js";
import "./Home.css";

const STEPS = [
  { title: "Enter your details", desc: "Credit usage, payment history, and income — ten fields, three minutes." },
  { title: "The model reads your profile", desc: "Whichever of the three trained classifiers scored best on held-out data evaluates the inputs." },
  { title: "See the reasoning, not just a number", desc: "A risk tier, a probability, and the specific factors that moved the needle." },
];

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

  return (
    <PageTransition>
      <section className="hero container">
        <div className="hero-copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            CodeAlpha Machine Learning Internship · Task 1
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            A second opinion on <span className="hero-highlight">credit risk</span>, before you
            need one.
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
          >
            CreditIQ estimates the likelihood of serious delinquency from an applicant's credit
            usage, payment history, and income — and shows its work, instead of just handing you
            a number.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
          >
            <Link to="/assessment" className="btn btn-primary">
              Run an assessment
            </Link>
            {status === "ready" && (
              <span className="hero-trust">
                Trained on <strong>{info.dataset_size.toLocaleString()}</strong> historical records ·{" "}
                <strong>{Math.round(info.roc_auc * 100)}%</strong> ROC-AUC
              </span>
            )}
          </motion.div>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, y: 24, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <div className="score-card glass">
            <div className="score-card-head">
              <span className="score-card-dot" />
              Sample assessment
            </div>
            <div className="score-card-gauge">
              <svg viewBox="0 0 120 70" width="180" height="105">
                <path d="M10 65 A50 50 0 0 1 110 65" fill="none" stroke="var(--color-border)" strokeWidth="10" strokeLinecap="round" />
                <motion.path
                  d="M10 65 A50 50 0 0 1 110 65"
                  fill="none"
                  stroke="url(#gaugeGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="157"
                  initial={{ strokeDashoffset: 157 }}
                  animate={{ strokeDashoffset: 157 - 157 * 0.155 }}
                  transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor="#0057ff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="score-card-value">
                <span>15.5%</span>
                <small>predicted risk</small>
              </div>
            </div>
            <div className="score-card-tag">Low Risk · Good credit standing</div>
            <div className="score-card-factors">
              <div className="score-card-factor-row">
                <span>Revolving utilization</span>
                <span className="score-card-bar"><i style={{ width: "92%" }} /></span>
              </div>
              <div className="score-card-factor-row">
                <span>Payment history</span>
                <span className="score-card-bar"><i style={{ width: "58%" }} /></span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="container timeline-section">
        <div className="timeline-heading">
          <h2>How it works</h2>
          <p>No sign-up, no waiting room — a form, a model, an answer.</p>
        </div>
        <div className="timeline">
          {STEPS.map((step, i) => (
            <motion.div
              className="timeline-item"
              key={step.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              <div className="timeline-marker">
                <span>{i + 1}</span>
              </div>
              <div className="timeline-body">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
