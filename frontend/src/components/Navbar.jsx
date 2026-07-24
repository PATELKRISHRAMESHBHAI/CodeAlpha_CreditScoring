import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import "./Navbar.css";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/assessment", label: "Assessment" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="navbar-inner glass">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <motion.img
            src={logo}
            alt="CreditIQ"
            className="brand-logo"
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300, damping: 14 }}
          />
        </NavLink>

        <nav className="main-nav">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && <motion.span className="nav-underline" layoutId="nav-underline" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }} />
          <motion.span animate={{ opacity: open ? 0 : 1 }} />
          <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav glass"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => "mobile-nav-link" + (isActive ? " active" : "")}
              >
                {link.label}
              </NavLink>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
