"use client";

import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import { GlobeDemo } from "./GridGlobe";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import MagicBtn from "./magicBtn";
import { IoCopyOutline } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
import DarkedBackground from "./darkedBackground";
import { useIsMobile } from "@/hooks/useIsMobile";

// Lazy-load heavy components only used by specific card IDs
const BackgroundGradientAnimation = dynamic(
  () =>
    import("./background-gradient-animation").then(
      (m) => m.BackgroundGradientAnimation,
    ),
  { ssr: false },
);
const VerticalMovingBoxes = dynamic(() => import("./VerticalMovingBoxes"), {
  ssr: false,
});
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return <div className={cn("bento-grid", className)}>{children}</div>;
};

export const BentoGridItem = ({
  className,
  title,
  description,
  id,
  img,
  imgClassName,
  titleClassName,
  titleSizeClassName,
  spareImg,
  enableTilt,
  tiltMaxDeg = 5,
  tiltScale = 1.015,
  tiltPerspective = 1000,
  tiltTransitionMs = 300,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string | StaticImageData;
  id: number;
  imgClassName?: string;
  titleClassName?: string;
  titleSizeClassName?: string;
  spareImg?: string;
  /**
   * Abilita/disabilita il tilt per questa card. Se non specificato, il default è attivo per tutte
   * tranne la card con id = 2 (nessun tilt sulla 2 come richiesto).
   */
  enableTilt?: boolean;
  /** Massima rotazione in gradi per asse (default 10) */
  tiltMaxDeg?: number;
  /** Scala al passaggio del mouse (default 1.02) */
  tiltScale?: number;
  /** Prospettiva 3D in px (default 1000) */
  tiltPerspective?: number;
  /** Durata della transizione in ms (default 180) */
  tiltTransitionMs?: number;
}) => {
  const [copied, setCopied] = useState(false);
  // Counter to force remount of Lottie for immediate restart
  const [confettiRunId, setConfettiRunId] = useState(0);
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Lazily loaded confetti animation data (1.2 MB — only fetched on first click)
  const confettiDataRef = useRef<any>(null);
  // Ref for the card DOM node
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  // Simple rAF throttle to keep mousemove performant
  const rafRef = useRef<number | null>(null);

  // Track tilt transform
  const [tilt, setTilt] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 1,
  });

  // handleCopy was inlined into MagicBtn to guarantee immediate restart behavior

  const [hovered, setHovered] = useState(false);
  // For card id=3: lower list opacity on very small card widths
  const [isNarrow3, setIsNarrow3] = useState(false);

  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
    };
  }, []);

  // Observe card width for id=3 to toggle opacity of VerticalMovingBoxes when < 480px
  useEffect(() => {
    if (id !== 3) return;
    if (typeof window === "undefined") return;
    const node = cardRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const w =
          entry.contentRect?.width ?? node.getBoundingClientRect().width;
        setIsNarrow3(w < 480);
      }
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [id]);

  // Helpers for tilt effect
  const tiltEnabled = enableTilt ?? id !== 2;
  const supportsFinePointer =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: fine)").matches;
  const prefersMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const handleEnter = () => {
    if (!tiltEnabled || !supportsFinePointer || !prefersMotion || isTouchDevice)
      return;
    setTilt((t) => ({ ...t, scale: tiltScale }));
  };

  const handleMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!tiltEnabled || !supportsFinePointer || !prefersMotion || isTouchDevice)
      return;
    const node = cardRef.current;
    if (!node) return;

    if (rafRef.current !== null) return; // throttle to one frame
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const rect = node.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // may go outside 0..1 while flicking
      const py = (e.clientY - rect.top) / rect.height; // may go outside 0..1 while flicking

      // Map to -0.5..0.5 then scale
      const dx = px - 0.5;
      const dy = py - 0.5;
      const maxDeg = tiltMaxDeg; // sensitivity configurabile

      // Clamp rotation so it never exceeds +/- maxDeg even if the pointer is outside the card
      const clamp = (v: number, min: number, max: number) =>
        Math.min(max, Math.max(min, v));
      const rotateY = clamp(dx * (maxDeg * 2), -maxDeg, maxDeg); // left/right
      const rotateX = clamp(-dy * (maxDeg * 2), -maxDeg, maxDeg); // up/down (invert)
      setTilt((t) => ({ ...t, x: rotateX, y: rotateY }));
    });
  };

  const handleLeave = () => {
    if (!tiltEnabled || !supportsFinePointer || !prefersMotion || isTouchDevice)
      return;
    setTilt({ x: 0, y: 0, scale: 1 });
  };

  // Ensure card id=3 resets tilt when the cursor leaves its bounds even during pointer capture
  useEffect(() => {
    if (id !== 3) return;
    if (!tiltEnabled || !supportsFinePointer || !prefersMotion || isTouchDevice)
      return;
    let scheduled = false;
    const onPointerMove = (e: PointerEvent) => {
      const node = cardRef.current;
      if (!node) return;
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        const rect = node.getBoundingClientRect();
        const inside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        if (!inside) {
          setTilt((t) =>
            t.x !== 0 || t.y !== 0 || t.scale !== 1
              ? { x: 0, y: 0, scale: 1 }
              : t,
          );
        }
      });
    };
    window.addEventListener("pointermove", onPointerMove as EventListener, {
      passive: true,
    });
    return () =>
      window.removeEventListener("pointermove", onPointerMove as EventListener);
  }, [id, tiltEnabled, supportsFinePointer, prefersMotion, isTouchDevice]);

  return (
    <div
      ref={cardRef}
      id={`bento-grid-item-${id}`}
      className={cn(
        `group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 relative rounded-2xl dark:shadow-none border border-white/[0.1] transform-gpu will-change-transform
        ${id === 1 ? "bento-item-1" : ""}
        ${id === 2 ? "bento-item-2" : ""}
        ${id === 3 ? "bento-item-3" : ""}
        ${id === 4 ? "bento-item-4" : ""}
        ${id === 5 ? "bento-item-5" : ""}
        ${id === 6 ? "justify-center p-5 items-center gap-12 bento-item-6" : ""}
      `,
        className,
      )}
      style={{
        background: "rgb(4,7,29)",
        backgroundColor:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
        overflow: id === 10 ? "visible" : "hidden",
        transform: tiltEnabled
          ? `perspective(${tiltPerspective}px) rotateX(${tilt.x.toFixed(
              2,
            )}deg) rotateY(${tilt.y.toFixed(2)}deg) scale(${tilt.scale.toFixed(
              3,
            )})`
          : undefined,
        transition: tiltEnabled
          ? `transform ${tiltTransitionMs}ms ease-out`
          : undefined,
      }}
      onMouseEnter={() => {
        handleEnter();
        if (id === 4) setHovered(true);
      }}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        handleLeave();
        if (id === 4) setHovered(false);
      }}>
      <div
        className={`${id === 6 && "flex justify-end"} ${id !== 6 && "h-full"}`}>
        <DarkedBackground />
        <div className="w-full h-full absolute">
          {img && (
            <Image
              src={typeof img === "string" ? img : (img as StaticImageData)}
              alt={typeof img === "string" ? img : "Bento grid image"}
              className={`object-cover object-center ${imgClassName}`}
              // personalizzed sizes from the imgClassName
              width={1000}
              height={1000}
              style={{ width: "auto", height: "100%" }}
              loading="lazy"
            />
          )}
        </div>

        <div
          className={`${
            id === 5 && "w-full h-full opacity-[0.3]"
          } absolute right-0 -bottom-5 ${id === 4 ? "w-72 h-32" : ""}
            ${
              hovered && id === 4 ? "-translate-y-2" : "translate-y-2"
            } transition-transform duration-500 ease-in-out`}>
          {spareImg && (
            <div className="relative w-full h-full">
              <Image
                src={spareImg}
                alt={
                  typeof spareImg === "string" ? spareImg : "Bento grid image"
                }
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 288px"
                loading="lazy"
              />
            </div>
          )}
        </div>
        {id === 6 && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 flex items-center justify-center text-white font-bold" />
          </BackgroundGradientAnimation>
        )}

        <div
          className={cn(
            titleClassName,
            `transition duration-200 relative flex flex-col min-h-40 px-5 p-5 lg:p-8 md:h-full ${
              id === 6 ? "lg:p-0" : ""
            } ${id === 3 ? "h-full max-w-[240px]" : ""}`,
          )}>
          <div className="font-sans text-sm font-extralight text-[#c1c2d3] md:text-xs lg:text-base z-10">
            {description}
          </div>
          <div
            className={` font-sans font-bold max-w-96 z-10 ${titleSizeClassName}`}>
            {title}
          </div>
          {id === 2 && <GlobeDemo />}
          {id === 3 && (
            <>
              {/* elevate and re-enable pointer events so the button stays above the scrolling lists */}
              <div className="!m-0 !p-0 relative z-30 pointer-events-auto flex flex-col items-start justify-center">
                <MagicBtn
                  title="See My Tech Stack"
                  icon={null}
                  position="left"
                  otherClasses="!bg-[#161a31] gap-2 px-6 py-4 text-sm"
                  buttonClasses="!mt-4"
                  handleClick={() => {
                    const techSection = document.getElementById("tech-stack");
                    if (techSection) {
                      techSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {id === 3 && (
        <div
          style={{
            opacity: isNarrow3 ? 0.5 : 1,
            transition: "opacity 200ms ease",
          }}>
          <VerticalMovingBoxes />
        </div>
      )}
      {id === 6 && (
        <>
          <div
            className={`absolute bottom-0 right-[50%] w-auto h-full translate-x-[50%] pointer-events-none z-[100]`}>
            {copied && !isMobile && confettiDataRef.current && (
              <Lottie
                key={`confetti-${confettiRunId}`}
                options={{
                  loop: false,
                  autoplay: true, // parte immediatamente al mount
                  animationData: confettiDataRef.current,
                  rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
                }}
                isPaused={false}
                eventListeners={[
                  {
                    eventName: "complete",
                    callback: () => setCopied(false),
                  },
                ]}
              />
            )}
          </div>
          <div className="!m-0 !p-0 relative flex flex-col items-center justify-center">
            <MagicBtn
              title={copied ? "Email Copied!" : "Copy Email"}
              icon={
                copied ? (
                  <FaCircleCheck className="text-green-400" />
                ) : (
                  <IoCopyOutline />
                )
              }
              position="left"
              otherClasses="!bg-[#161a31] gap-2 px-8 py-4 text-sm"
              buttonClasses="!mt-0"
              handleClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    "alessandro.slyusar22@gmail.com",
                  );
                } catch {
                  // Even if clipboard fails, still show the animation for UX feedback
                }
                // Lazy-load confetti animation data on first use
                if (!confettiDataRef.current && !isMobile) {
                  const mod = await import("@/data/confetti.json");
                  confettiDataRef.current = mod.default;
                }
                // Restart confetti immediately without waiting previous cycle to end
                setConfettiRunId((n) => n + 1);
                setCopied(true);
                // Safety reset in case 'complete' event doesn't fire
                if (confettiTimeoutRef.current)
                  clearTimeout(confettiTimeoutRef.current);
                confettiTimeoutRef.current = setTimeout(
                  () => setCopied(false),
                  1000,
                );
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};
