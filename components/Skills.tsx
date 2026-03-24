"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

const Skills = () => {
  const iconPathFor = (label: string) => {
    const key = label.toLowerCase();
    const overrides: Record<string, string> = {
      graphql: "GraphQL",
      jquery: "jquery",
    };
    const base = label.replace(/\s+/g, "-").replace(/\+\+/g, "pp");
    const filename = overrides[key] ?? base;
    return `/skills-icons/${filename}.png`;
  };
  const skills = [
    "html",
    "css",
    "js",
    "ts",
    "react",
    "node",
    "nextjs",
    "express",
    "rest api",
    "json",
    "tailwind",
    "bootstrap",
    "postgre",
    "graphql",
    "npm",
    "axios",
    "jQuery",
    "ejs",
    "cyber security",
    "git",
    "github",
    "gsap",
    "web3",
    "motoko",
    "framer motion",
    "three.js",
    "aceternity",
    "material ui",
    "vercel",
    "vite",
    "figma",
    "postman",
    "vs code",
    "blender",
    "photoshop",
    "illustrator",
    "xd",
    "python",
    "c++",
    "rust",
  ];

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [flippedSet, setFlippedSet] = useState<Set<number>>(new Set());
  const flipTimersRef = useRef<Record<number, number>>({});
  const [cols, setCols] = useState<number>(3);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafIdRef = useRef<number | null>(null);

  // Deriva il numero di colonne dai breakpoint Tailwind usati nella grid
  useEffect(() => {
    const mqXs = window.matchMedia("(min-width: 420px)");
    const mqMd = window.matchMedia("(min-width: 768px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");

    const applyCols = () => {
      if (mqLg.matches) setCols(10);
      else if (mqMd.matches) setCols(8);
      else if (mqXs.matches) setCols(5);
      else setCols(4);
    };

    applyCols();
    mqXs.addEventListener?.("change", applyCols);
    mqMd.addEventListener?.("change", applyCols);
    mqLg.addEventListener?.("change", applyCols);
    return () => {
      mqXs.removeEventListener?.("change", applyCols);
      mqMd.removeEventListener?.("change", applyCols);
      mqLg.removeEventListener?.("change", applyCols);
    };
  }, []);

  const indexToRC = (i: number) => ({ r: Math.floor(i / cols), c: i % cols });
  const isNeighbor = (i: number, center: number | null) => {
    if (center == null || i === center) return false;
    const A = indexToRC(i);
    const B = indexToRC(center);
    const dr = A.r - B.r;
    const dc = A.c - B.c;
    return Math.abs(dr) <= 1 && Math.abs(dc) <= 1 && !(dr === 0 && dc === 0);
  };

  // Dynamic font sizing based on longest word length
  const longestWordLen = (label: string) => {
    const cleaned = label.trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    let max = 0;
    for (const p of parts) max = Math.max(max, p.length);
    return max || cleaned.length;
  };

  const fontSizeFor = (label: string) => {
    const len = longestWordLen(label);
    if (len <= 4) return "14px"; // short labels: html, css, react, c, c++
    if (len <= 8) return "12px"; // medium labels
    return "9px"; // long labels: photoshop, illustrator
  };

  const hoveredCardZ = 8;
  const tiltDeg = 4;
  const neighborLiftZ = 4;

  // (removed) dynamic font sizing helpers; not needed

  const tiltFor = (i: number, center: number) => {
    const A = indexToRC(i);
    const B = indexToRC(center);
    const dr = A.r - B.r;
    const dc = A.c - B.c;
    const rx = dr === -1 ? +tiltDeg : dr === +1 ? -tiltDeg : 0;
    const ry = dc === -1 ? -tiltDeg : dc === +1 ? +tiltDeg : 0;
    return {
      transform: `perspective(900px) translateZ(${neighborLiftZ}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
      transition:
        "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      willChange: "transform",
    } as React.CSSProperties;
  };

  const hoverTransform = useMemo(
    () =>
      ({
        transform: `perspective(900px) translateZ(${hoveredCardZ}px) rotateX(0deg) rotateY(0deg)`,
        transition:
          "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform",
        boxShadow:
          "0 8px 30px rgba(139,92,246,0.25), 0 0 40px rgba(59,130,246,0.15)",
        backgroundColor: "rgba(255,255,255,0.98)",
      }) as React.CSSProperties,
    [],
  );

  const baseTransform = useMemo(
    () =>
      ({
        transform:
          "perspective(900px) translateZ(0px) rotateX(0deg) rotateY(0deg)",
        transition:
          "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform",
      }) as React.CSSProperties,
    [],
  );

  const isTouch =
    typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

  const handleMouseMoveNearest = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const x = e.clientX;
    const y = e.clientY;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      let nearestIdx: number | null = null;
      let nearestDist = Infinity;
      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const d2 = dx * dx + dy * dy;
        if (d2 < nearestDist) {
          nearestDist = d2;
          nearestIdx = i;
        }
      }
      if (nearestIdx !== null) setHoverIdx(nearestIdx);
    });
  };

  return (
    <div
      className="py-24 relative flex justify-center items-center flex-col"
      id="tech-stack">
      <div className="heading mb-16">
        My <span className="text-purple">Skills</span>
      </div>

      <div
        ref={containerRef}
        className="grid grid-cols-4 w-full xs:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4 xs:gap-3 sm:gap-6 md:gap-4 lg:gap-4 xl:gap-8"
        style={{ perspective: 900 }}
        onMouseLeave={() => setHoverIdx(null)}
        onMouseMove={handleMouseMoveNearest}>
        {skills.map((skill, index) => {
          let style = baseTransform;
          if (!isTouch) {
            if (hoverIdx === index) style = hoverTransform;
            else if (isNeighbor(index, hoverIdx))
              style = tiltFor(index, hoverIdx as number);
          }

          const isFlipped = flippedSet.has(index);
          const handleClick = () => {
            setFlippedSet((prev) => {
              const next = new Set(prev);
              if (next.has(index)) {
                // Manual unflip: clear timer if any
                if (flipTimersRef.current[index]) {
                  clearTimeout(flipTimersRef.current[index]);
                  delete flipTimersRef.current[index];
                }
                next.delete(index);
              } else {
                // Flip and start auto-unflip timer
                next.add(index);
                if (flipTimersRef.current[index]) {
                  clearTimeout(flipTimersRef.current[index]);
                }
                flipTimersRef.current[index] = window.setTimeout(() => {
                  setFlippedSet((prev2) => {
                    const n2 = new Set(prev2);
                    n2.delete(index);
                    return n2;
                  });
                  delete flipTimersRef.current[index];
                }, 3000);
              }
              return next;
            });
          };

          return (
            <div
              key={skill + index}
              className="bg-[white]/90 p-3 rounded-[1ch] xs:rounded-[2ch] shadow-md flex items-center justify-center hover:shadow-lg duration-300 transition-colors cursor-pointer aspect-square w-full relative"
              style={style}
              onMouseEnter={() => !isTouch && setHoverIdx(index)}
              onMouseDown={handleClick}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}>
              {/* Underlay card: now sized to the whole card (including padding) */}
              {(() => {
                const isN =
                  hoverIdx !== null &&
                  hoverIdx !== index &&
                  isNeighbor(index, hoverIdx);
                const A = indexToRC(index);
                const B = hoverIdx !== null ? indexToRC(hoverIdx) : A;
                const dr = A.r - B.r;
                const dc = A.c - B.c;
                const shift = 6;
                const tx = isN
                  ? dc === -1
                    ? +shift
                    : dc === 1
                      ? -shift
                      : 0
                  : 0;
                const ty = isN
                  ? dr === -1
                    ? +shift
                    : dr === 1
                      ? -shift
                      : 0
                  : 0;
                const opacity = isN ? 1 : 0;
                return (
                  <div
                    className="absolute inset-0 rounded-[1ch] xs:rounded-[2ch] bg-black/20 dark:bg-white/10"
                    style={{
                      transform: `translate(${tx}px, ${ty}px)`,
                      opacity,
                      transition:
                        "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                      zIndex: 0,
                    }}
                  />
                );
              })()}
              {/* 3D Flip wrapper */}
              <div
                className="relative w-full h-full"
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}>
                {/* Front face (icon + underlay) */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backfaceVisibility: "hidden" }}>
                  <Image
                    src={iconPathFor(skill)}
                    alt={skill}
                    fill
                    className="object-contain select-none"
                    draggable={false}
                    sizes="(max-width: 420px) 20vw, (max-width: 768px) 12vw, (max-width: 1024px) 10vw, 8vw"
                    loading="lazy"
                  />
                </div>

                {/* Back face (skill name) */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                  }}>
                  <span
                    className="select-none text-center leading-tight font-bold text-black/80 px-0 w-fit"
                    style={{ fontSize: fontSizeFor(skill) }}>
                    {skill.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Skills;
