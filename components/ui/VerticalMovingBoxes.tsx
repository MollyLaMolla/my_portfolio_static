"use client";
import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

type Props = {
  // Baseline auto-scroll speed in px per second (positive = upward)
  autoScrollSpeed?: number;
  // Maximum velocity captured on release in px per second
  maxReleaseSpeed?: number;
  // Linear friction in px per second^2 applied to momentum after release
  friction?: number;
  // Disable momentum/inertia and only use base auto-scroll
  inertia?: boolean;
};

const VerticalMovingBoxes: React.FC<Props> = ({
  autoScrollSpeed = 24, // ~0.4px per frame @60fps
  maxReleaseSpeed = 2000, // clamp fast flicks
  friction = 2000, // slow down in ~1s from max speed
  inertia = true,
}) => {
  const isMobile = useIsMobile();
  const leftLists = [
    "HTML",
    "JavaScript",
    "Tailwind",
    "JQuery",
    "EJS",
    "npm",
    "bcrypt",
    "Git",
    "GitHub",
    "API",
    "Postman",
    "Vite",
    "VS Code",
    "Chrome",
    "Figma",
    "DApps",
    "Motoko",
    "C",
  ];
  const rightLists = [
    "CSS",
    "Bootstrap",
    "TypeScript",
    "Three.js",
    "Node.js",
    "Express",
    "Axios",
    "JSON",
    "REST API",
    "PostgreSQL",
    "Auth0",
    "React",
    "Next.js",
    "Framer Motion",
    "GSAP",
    "Blender",
    "Web3",
    "C++",
  ];

  // Duplicate content for seamless loop
  const left = [...leftLists, ...leftLists];
  const right = [...rightLists, ...rightLists];

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const leftLoopH = useRef<number>(0);
  const rightLoopH = useRef<number>(0);
  const [offL, setOffL] = useState(0);
  const staggerRef = useRef<number>(0); // half of (item height + gap)

  const draggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastYRef = useRef(0);
  const lastMoveTsRef = useRef<number>(0);

  // Momentum state
  const velRef = useRef<number>(0); // px/sec
  const inertiaActiveRef = useRef<boolean>(false);
  const lastFrameTsRef = useRef<number | null>(null);

  const normalize = (y: number, H: number) => {
    const len = H || 1;
    let n = y % len;
    if (n < 0) n += len;
    return n;
  };

  // Measure loop lengths and stride
  useEffect(() => {
    const measure = () => {
      if (leftColRef.current)
        leftLoopH.current = leftColRef.current.scrollHeight / 2;
      if (rightColRef.current)
        rightLoopH.current = rightColRef.current.scrollHeight / 2;
      if (leftColRef.current) {
        const gap = parseFloat(
          getComputedStyle(leftColRef.current).rowGap || "0",
        );
        const first = leftColRef.current.children[0] as HTMLElement | undefined;
        const stride = (first?.offsetHeight || 0) + gap;
        staggerRef.current = stride > 0 ? stride / 2 : 0;
      }
    };
    measure();
    const id = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Auto-scroll + inertia step loop (time-based)
  useEffect(() => {
    let raf: number;
    const step = (ts: number) => {
      const last = lastFrameTsRef.current;
      lastFrameTsRef.current = ts;

      if (last != null) {
        const dt = Math.max(0, ts - last) / 1000; // seconds

        if (!draggingRef.current) {
          // Momentum integration
          let v = inertiaActiveRef.current ? velRef.current : 0;

          if (inertia && inertiaActiveRef.current) {
            // Apply linear friction toward zero
            if (v > 0) {
              v = Math.max(0, v - friction * dt);
            } else if (v < 0) {
              v = Math.min(0, v + friction * dt);
            }

            velRef.current = v;
            if (Math.abs(v) < 1) {
              // close enough to rest
              velRef.current = 0;
              inertiaActiveRef.current = false;
              v = 0;
            }
          }

          const totalVel = autoScrollSpeed + (inertia ? v : 0);
          if (totalVel !== 0) {
            const delta = totalVel * dt;
            setOffL((o) => normalize(o + delta, leftLoopH.current));
          }
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [autoScrollSpeed, friction, inertia]);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (isMobile) return;
    draggingRef.current = true;
    setIsDragging(true);
    lastYRef.current = e.clientY;
    lastMoveTsRef.current = performance.now();
    // stop any current inertia
    inertiaActiveRef.current = false;
    velRef.current = 0;
    wrapperRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (isMobile) return;
    if (!draggingRef.current) return;
    // Prevent text selection/drag ghost while moving
    e.preventDefault();
    const now = performance.now();
    const dy = e.clientY - lastYRef.current;
    const dt = Math.max(0.001, (now - lastMoveTsRef.current) / 1000); // seconds

    lastYRef.current = e.clientY;
    lastMoveTsRef.current = now;

    // Update offset directly from pointer movement
    setOffL((o) => normalize(o - dy, leftLoopH.current));

    // Estimate velocity in px/sec (same direction as offset update)
    const instVel = -dy / dt;
    // Exponential smoothing to avoid spikes near release
    const alpha = 0.35;
    const nextVel = alpha * instVel + (1 - alpha) * velRef.current;
    // Clamp to max speed
    velRef.current = Math.max(
      -maxReleaseSpeed,
      Math.min(maxReleaseSpeed, nextVel),
    );
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    draggingRef.current = false;
    setIsDragging(false);
    // Respect reduced motion: disable inertia
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    inertiaActiveRef.current =
      inertia && !prefersReduced && Math.abs(velRef.current) > 10;
    try {
      wrapperRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Transforms: right column is always half-stride ahead of left
  const leftTranslate = `translate3d(0, ${-offL}px, 0)`;
  const rightOffset = normalize(offL + staggerRef.current, rightLoopH.current);
  const rightTranslate = `translate3d(0, ${-rightOffset}px, 0)`;

  return (
    <div className="absolute top-0 right-0 h-full w-full !m-0 vertical-moving-boxes">
      {/* tech stack lists */}
      <div
        ref={wrapperRef}
        className={`relative h-full w-full select-none ${isMobile ? "" : "touch-none"}`}
        style={{
          cursor: isMobile ? "default" : isDragging ? "grabbing" : "grab",
        }}
        onDragStart={(e) => e.preventDefault()}
        onPointerDown={isMobile ? undefined : onPointerDown}
        onPointerMove={isMobile ? undefined : onPointerMove}
        onPointerUp={isMobile ? undefined : onPointerUp}
        onPointerCancel={isMobile ? undefined : onPointerUp}
        onPointerLeave={isMobile ? undefined : onPointerUp}>
        <div
          ref={leftColRef}
          className="flex flex-col gap-4 absolute right-28 sm:right-36 w-24 sm:w-28 will-change-transform"
          style={{ transform: leftTranslate }}>
          {left.map((item, i) => (
            <span
              key={`l-${i}`}
              className="text-xs sm:text-base opacity-50 rounded-lg text-center bg-[#10132E] flex items-center justify-center min-h-[42px] sm:min-h-[56px] overflow-hidden whitespace-nowrap text-ellipsis select-none"
              draggable={false}
              style={{ textOverflow: "ellipsis" }}>
              {item}
            </span>
          ))}
        </div>
        <div
          ref={rightColRef}
          className="flex flex-col gap-4 absolute right-2 sm:right-4 w-24 sm:w-28 will-change-transform"
          style={{ transform: rightTranslate }}>
          {right.map((item, i) => (
            <span
              key={`r-${i}`}
              className="text-xs sm:text-base opacity-50 rounded-lg text-center bg-[#10132E] min-h-[42px] sm:min-h-[56px] flex items-center justify-center select-none"
              draggable={false}
              style={{ textOverflow: "ellipsis" }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerticalMovingBoxes;
