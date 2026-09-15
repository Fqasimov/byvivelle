"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { revealVariants, staggerVariants, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = HTMLMotionProps<"div"> & {
  /** Seconds to hold before starting — use sparingly, and under 0.3. */
  delay?: number;
};

/** A single element rising out of blur as it enters the viewport. */
export function Reveal({ delay = 0, className, children, ...props }: RevealProps) {
  return (
    <motion.div
      data-reveal
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={revealVariants}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  delay?: number;
};

/** Wrap a group; every `<Reveal.Item>` inside follows in sequence. */
export function Stagger({
  stagger = 0.07,
  delay = 0,
  className,
  children,
  ...props
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerVariants(stagger, delay)}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * `as` exists only so a staggered group inside a <ul> emits <li> elements —
 * a <div> child of a list is invalid markup and screen readers do notice.
 */
export function StaggerItem({
  as = "div",
  className,
  children,
  ...props
}: HTMLMotionProps<"div"> & { as?: "div" | "li" }) {
  // Both accept the same props we pass; the cast just stops TS from trying to
  // reconcile HTMLLIElement and HTMLDivElement event handlers.
  const Component = (as === "li" ? motion.li : motion.div) as typeof motion.div;

  return (
    <Component
      data-reveal
      variants={revealVariants}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
}
