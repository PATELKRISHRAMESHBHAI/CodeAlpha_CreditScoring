import { motion } from "framer-motion";
import "./Loader.css";

const BRAND = "CreditIQ";

// "Scan and reveal" rhythm: quick pulse, settle, repeat — evokes a risk scan rather than a heartbeat.
const PULSE_SCALE = [1, 1.12, 1, 1, 1];
const PULSE_TIMES = [0, 0.18, 0.36, 0.7, 1];
const PULSE_DURATION = 1.8;

const PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const seed = i * 37.5;
  return {
    left: (seed * 1.7) % 100,
    top: (seed * 2.3 + 13) % 100,
    size: 1.5 + ((i * 7) % 4),
    delay: (i % 7) * 0.35,
    duration: 3 + (i % 5) * 0.6,
  };
});

export default function Loader() {
  return (
    <motion.div
      className="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
    >
      <div className="loader-grid" aria-hidden="true" />

      <div className="loader-bokeh" aria-hidden="true">
        <span className="bokeh bokeh-a" />
        <span className="bokeh bokeh-b" />
        <span className="bokeh bokeh-c" />
      </div>

      <div className="loader-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="particle"
            style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
            animate={{ opacity: [0.1, 0.9, 0.1], y: [0, -10, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="loader-icon-stage">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="loader-ring"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 2.1], opacity: [0.5, 0] }}
            transition={{
              duration: PULSE_DURATION,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * (PULSE_DURATION / 3),
            }}
          />
        ))}

        <motion.div
          className="loader-icon"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: PULSE_SCALE, opacity: 1 }}
          transition={{
            scale: { duration: PULSE_DURATION, times: PULSE_TIMES, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.6 },
          }}
        >
          <svg viewBox="0 0 24 24" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="glowStroke" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#8ab4ff" />
                <stop offset="50%" stopColor="#4c8dff" />
                <stop offset="100%" stopColor="#0057ff" />
              </linearGradient>
            </defs>
            <path
              d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5z"
              fill="#0057ff"
              opacity="0.1"
            />
            <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5z" className="wire wire-thick" />
            <path d="M7 12.5a5 5 0 0 1 10 0" className="wire" />
            <path d="M12 12.5 15 9.5" className="wire" />
            <circle cx="12" cy="12.5" r="0.9" fill="url(#glowStroke)" />
          </svg>
        </motion.div>
      </div>

      <div className="loader-brand" aria-label={BRAND}>
        {BRAND.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.045, duration: 0.4, ease: "easeOut" }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="loader-bar-track"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <motion.div
          className="loader-bar-fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 1.3, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
