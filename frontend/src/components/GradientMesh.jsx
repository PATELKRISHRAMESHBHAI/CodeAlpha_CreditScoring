import { motion } from "framer-motion";
import "./GradientMesh.css";

export default function GradientMesh() {
  return (
    <div className="mesh-field" aria-hidden="true">
      <motion.span
        className="mesh-glow"
        animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
