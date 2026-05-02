"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type Props = HTMLMotionProps<"div"> & {
  delay?: number;
};

// Subtle fade-up entrance, used to soften first paint on the hero / result
// banner. Per CLAUDE.md: never wrap the live age counter in this — its
// per-second updates must not run through Framer's reconciliation.
export function FadeIn({ delay = 0, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
