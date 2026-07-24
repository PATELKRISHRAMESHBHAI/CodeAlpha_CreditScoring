import { motion } from "framer-motion";
import "./GradientMesh.css";

// Slow, large, mostly-off-screen drifts so the mesh reads as ambient
// light rather than an obvious "3 floating circles" template pattern.
const BLOBS = [
  { className: "mesh-blob mesh-blob-a", x: [0, 60, -20, 0], y: [0, -40, 30, 0], duration: 34 },
  { className: "mesh-blob mesh-blob-b", x: [0, -70, 40, 0], y: [0, 50, -30, 0], duration: 41 },
  { className: "mesh-blob mesh-blob-c", x: [0, 40, -60, 0], y: [0, -50, 20, 0], duration: 37 },
  { className: "mesh-blob mesh-blob-d", x: [0, -30, 50, 0], y: [0, 30, -40, 0], duration: 29 },
];

export default function GradientMesh() {
  return (
    <div className="mesh-field" aria-hidden="true">
      {BLOBS.map((b, i) => (
        <motion.span
          key={i}
          className={b.className}
          animate={{ x: b.x, y: b.y }}
          transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
