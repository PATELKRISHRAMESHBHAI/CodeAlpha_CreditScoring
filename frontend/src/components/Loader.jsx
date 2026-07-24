import { motion } from "framer-motion";
import "./Loader.css";

const BRAND = "CreditIQ";

// "Scan and reveal" rhythm: quick pulse, settle, repeat — evokes a risk scan rather than a heartbeat.
const PULSE_SCALE = [1, 1.12, 1, 1, 1];
const PULSE_TIMES = [0, 0.18, 0.36, 0.7, 1];
const PULSE_DURATION = 1.8;

export default function Loader() {
  return (
    <motion.div
      className="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
    >
      <div className="loader-icon-stage">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="loader-ring"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 2.1], opacity: [0.4, 0] }}
            transition={{
              duration: PULSE_DURATION,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * (PULSE_DURATION / 3),
            }}
          />
        ))}

        <motion.div
          className="loader-icon glass"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: PULSE_SCALE, opacity: 1 }}
          transition={{
            scale: { duration: PULSE_DURATION, times: PULSE_TIMES, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.6 },
          }}
        >
          <svg viewBox="0 0 24 24" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5z"
              fill="var(--color-primary)"
              opacity="0.1"
            />
            <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5z" className="wire wire-thick" />
            <path d="M7 12.5a5 5 0 0 1 10 0" className="wire" />
            <path d="M12 12.5 15 9.5" className="wire" />
            <circle cx="12" cy="12.5" r="0.9" fill="var(--color-primary)" />
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
