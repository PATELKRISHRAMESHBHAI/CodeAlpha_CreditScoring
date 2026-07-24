import { motion } from "framer-motion";
import "./AnimatedBlobs.css";

const blobs = [
  { className: "blob blob-a", x: [0, 40, -20, 0], y: [0, -30, 20, 0], duration: 18 },
  { className: "blob blob-b", x: [0, -50, 30, 0], y: [0, 30, -20, 0], duration: 22 },
  { className: "blob blob-c", x: [0, 30, -30, 0], y: [0, -20, 30, 0], duration: 26 },
];

export default function AnimatedBlobs() {
  return (
    <div className="blob-field" aria-hidden="true">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={b.className}
          animate={{ x: b.x, y: b.y }}
          transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
