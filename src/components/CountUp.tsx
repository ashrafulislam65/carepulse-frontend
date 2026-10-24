"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";

export default function CountUp({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        node.textContent = Math.round(v).toLocaleString() + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, duration]);

  return <span ref={ref}>0{suffix}</span>;
}