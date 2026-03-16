"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  /** Animation delay in ms */
  delay?: number;
  /** Animation duration in ms (default 600) */
  duration?: number;
  /** How much of the element should be visible before triggering (0-1) */
  threshold?: number;
  /** Only animate once (default true) */
  once?: boolean;
}

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  duration = 600,
  threshold = 0.05,
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={cn(
        visible ? "scroll-reveal-visible" : "scroll-reveal",
        className,
      )}
      data-visible={visible || undefined}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
