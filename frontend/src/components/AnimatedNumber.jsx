import { useEffect, useState } from "react";
import { useMotionValue, animate } from "framer-motion";

export default function AnimatedNumber({ value, decimals = 1, duration = 1.1 }) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, duration, motionValue]);

  return <>{display.toFixed(decimals)}</>;
}
