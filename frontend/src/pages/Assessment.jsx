import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition.jsx";
import ResultPanel from "../components/ResultPanel.jsx";
import { fetchCreditForm, predictCredit } from "../api/client.js";
import "./Assessment.css";

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: "easeOut" },
  }),
};

export default function Assessment() {
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState("loading");
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCreditForm()
      .then((data) => {
        setForm(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  function handleChange(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleFillSample() {
    if (form) setValues(form.sample_record);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = await predictCredit(values);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <PageTransition>
        <div className="container assessment-status">Loading form…</div>
      </PageTransition>
    );
  }

  if (status === "error" || !form) {
    return (
      <PageTransition>
        <div className="container assessment-status">
          Couldn't load this assessment. Make sure the Flask backend is running.
        </div>
      </PageTransition>
    );
  }

  let fieldIndex = 0;

  return (
    <PageTransition>
      <section className="container assessment-page">
        <motion.div
          className="assessment-header"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1>{form.title}</h1>
          <p>{form.subtitle}</p>
        </motion.div>

        <div className="assessment-layout">
          <form className="assessment-form glass" onSubmit={handleSubmit}>
            {form.sections.map((section) => (
              <div className="form-section" key={section.name}>
                <h2 className="form-section-title">{section.name}</h2>
                <div className="field-grid">
                  {section.fields.map((field) => {
                    const i = fieldIndex++;
                    return (
                      <motion.div
                        className="field"
                        key={field.name}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={fieldVariants}
                      >
                        <label htmlFor={field.name}>{field.label}</label>
                        <input
                          id={field.name}
                          type="number"
                          step={field.step}
                          min={field.min}
                          max={field.max}
                          placeholder={field.placeholder}
                          required
                          value={values[field.name] ?? ""}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                        {field.help && <small className="field-help">{field.help}</small>}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}

            {error && (
              <motion.p className="form-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.p>
            )}

            <div className="form-actions">
              <motion.button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.03 }}
                whileTap={{ scale: submitting ? 1 : 0.97 }}
              >
                {submitting ? "Predicting…" : "Predict Risk"}
              </motion.button>
              <motion.button
                type="button"
                className="btn btn-secondary"
                onClick={handleFillSample}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Fill Sample Data
              </motion.button>
            </div>
          </form>

          <ResultPanel result={result} />
        </div>
      </section>
    </PageTransition>
  );
}
