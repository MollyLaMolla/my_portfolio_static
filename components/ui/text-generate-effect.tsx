"use client";
import { useEffect, useRef } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration,
  purpleWordsPositions = [],
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  purpleWordsPositions?: number[];
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    // Animate translateY + subtle blur; opacity stays at 1 so LCP isn't blocked
    animate(
      "span",
      {
        y: 0,
        ...(filter ? { filter: "blur(0px)" } : {}),
      },
      {
        duration: duration ?? 0.5,
        delay: stagger(0.12),
        ease: [0.25, 0.1, 0.25, 1],
      },
    );
  }, [scope, animate, duration, filter]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className={
                purpleWordsPositions.includes(idx)
                  ? "text-purple"
                  : "dark:text-white text-black"
              }
              style={{
                display: "inline-block",
                // Text is VISIBLE (opacity: 1) from SSR — critical for LCP.
                // Animation uses translateY + subtle blur instead of hiding text.
                opacity: 1,
                transform: "translateY(12px)",
                filter: filter ? "blur(4px)" : "none",
              }}>
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="my-4">
        <div className="dark:text-white text-black leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
