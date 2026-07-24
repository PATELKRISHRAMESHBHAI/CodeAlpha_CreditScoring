import "./GradientMesh.css";

// Flat, single-colored page background (Porcelain / dark navy) plus a faint
// grain texture. Signal Blue stays out of the background entirely — it's
// reserved for foreground/accent elements, not blended in behind them.
export default function GradientMesh() {
  return <div className="mesh-field" aria-hidden="true" />;
}
