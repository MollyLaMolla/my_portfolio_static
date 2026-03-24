"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import { navItems } from "@/data";
import { FaHome } from "react-icons/fa";

export const FloatingNav = ({ className }: { className?: string }) => {
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [clickLockUntil, setClickLockUntil] = useState<number>(0);
  const [topLock, setTopLock] = useState(true);
  const [isNarrow, setIsNarrow] = useState(false);
  const [initAnim, setInitAnim] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const lockRef = useRef<number>(0);
  const [indicator, setIndicator] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [initialDims, setInitialDims] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // keep lockRef synced with state
  useEffect(() => {
    lockRef.current = clickLockUntil;
  }, [clickLockUntil]);

  // observe width < 480px to swap Home text with icon
  useEffect(() => {
    const update = () => setIsNarrow(window.innerWidth < 480);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Show/hide bar based on scroll direction
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current !== "number") return;
    const TOP_LOCK_PX = 100;
    // Keep navbar visible near the very top of the page
    if (typeof window !== "undefined") {
      const isTop = window.scrollY <= TOP_LOCK_PX;
      setTopLock(isTop);
      if (isTop) {
        setVisible(true);
        return;
      }
    }
    // Keep navbar visible for a short period after a nav click
    if (Date.now() < lockRef.current) {
      setVisible(true);
      return;
    }
    const prev = scrollYProgress.getPrevious() ?? current;
    const direction = current - prev;
    // Show when scrolling up anywhere on the page; hide when scrolling down
    if (direction < 0) {
      setVisible(true);
    } else {
      setVisible(true);
    }
  });

  // Calculate indicator position/size for the active item (relative to container padding box)
  const recalcIndicator = (index: number) => {
    const container = containerRef.current;
    const target = itemRefs.current[index];
    if (!container || !target) return;

    const PADDING = 2; // exact fit; adjust for halo if desired
    const x = target.offsetLeft - PADDING - 6;
    const y = target.offsetTop - PADDING;
    const width = target.offsetWidth + PADDING * 4;
    const height = target.offsetHeight + PADDING * 2;
    setIndicator({ x, y, width, height });
  };

  // Initial indicator: cover full navbar, then animate to active button
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      setIndicator({ x: 0, y: 0, width: rect.width, height: rect.height });
      setInitialDims({ width: rect.width, height: rect.height });
    }
    const id = requestAnimationFrame(() => {
      recalcIndicator(activeIndex);
      // slow initial animation and optional small delay
      setTimeout(() => setInitAnim(false), 800);
    });
    return () => cancelAnimationFrame(id);
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Responsive recalculation on resize
  useEffect(() => {
    const onResize = () => recalcIndicator(activeIndex);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [activeIndex]);

  // Recalculate indicator when label switches (e.g., Home text → icon under 480px)
  useEffect(() => {
    const id = requestAnimationFrame(() => recalcIndicator(activeIndex));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNarrow]);

  // Scrollspy: use viewport-center rule with hysteresis to avoid bouncing
  useEffect(() => {
    let rafId: number | null = null;

    const computeActiveByCenter = () => {
      if (Date.now() < lockRef.current) return; // pause during click lock

      const viewportCenter = window.innerHeight / 2;
      let bestIdx = activeIndex;
      let bestDist = Infinity;

      for (let i = 0; i < navItems.length; i++) {
        const link = navItems[i].link;
        if (!link || !link.startsWith("#")) continue;
        const el = document.querySelector(link) as HTMLElement | null;
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const dist = Math.abs(sectionCenter - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }

      // Hysteresis: only switch if new candidate is meaningfully closer
      const HYSTERESIS_PX = 24;
      const prevLink = navItems[activeIndex]?.link;
      const prevEl =
        prevLink && prevLink.startsWith("#")
          ? (document.querySelector(prevLink) as HTMLElement | null)
          : null;

      if (prevEl) {
        const prevRect = prevEl.getBoundingClientRect();
        const prevCenter = prevRect.top + prevRect.height / 2;
        const prevDist = Math.abs(prevCenter - viewportCenter);

        if (bestIdx !== activeIndex && bestDist + HYSTERESIS_PX < prevDist) {
          setActiveIndex(bestIdx);
          requestAnimationFrame(() => recalcIndicator(bestIdx));
        }
      } else if (bestIdx !== activeIndex) {
        setActiveIndex(bestIdx);
        requestAnimationFrame(() => recalcIndicator(bestIdx));
      }
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(computeActiveByCenter);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // initial check
    rafId = requestAnimationFrame(computeActiveByCenter);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [activeIndex]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex max-w-fit fixed top-4 sm:top-6 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-3 py-2 items-center justify-center space-x-1 transition-colors duration-300 overflow-hidden",
          topLock ? "bg-black-300" : "dark:bg-[#0e0b14] bg-white",
          className
        )}>
        {navItems.map((navItem, idx) => (
          <a
            key={`link-${idx}`}
            href={navItem.link}
            className={cn(
              "relative z-10 dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 px-3 py-1 rounded-full"
            )}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            onClick={() => {
              setActiveIndex(idx);
              // lock visibility while scroll-to-anchor happens
              const until = Date.now() + 1200;
              setClickLockUntil(until);
              lockRef.current = until;
              // ensure immediate visual update
              setTimeout(() => recalcIndicator(idx), 0);
            }}>
            <span className="flex items-center text-sm">
              {(() => {
                const isHome =
                  (navItem.name && navItem.name.toLowerCase() === "home") ||
                  (navItem.link && navItem.link.toLowerCase() === "#home");
                if (isNarrow && isHome) {
                  return <FaHome aria-label="Home" />;
                }
                return navItem.name;
              })()}
            </span>
          </a>
        ))}

        {/* Animated moving rounded border indicator */}
        {initialDims && (
          <motion.div
            className={cn(
              "pointer-events-none absolute left-0 top-0 rounded-full backdrop-blur-lg p-[1px] transition-colors duration-300",
              topLock
                ? "border-white/80 bg-white/10"
                : "border-slate-800/60 bg-gray-500/10"
            )}
            initial={{
              x: 4,
              y: 6,
              width: initialDims.width - 18,
              height: initialDims.height - 14,
            }}
            animate={{
              x: indicator.x,
              y: indicator.y,
              width: indicator.width,
              height: indicator.height,
            }}
            transition={
              initAnim
                ? {
                    type: "spring",
                    stiffness: 200,
                    damping: 40,
                    mass: 1,
                    delay: 1,
                  }
                : { type: "spring", stiffness: 500, damping: 30, mass: 1 }
            }
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
