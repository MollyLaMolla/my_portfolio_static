"use client";
import { useState, useEffect } from "react";

/**
 * Returns `true` on touch / mobile devices where hover effects
 * and drag interactions don't work well.
 *
 * Uses `(pointer: coarse)` media query which matches devices
 * whose primary pointer is a finger / stylus (phones, tablets).
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: coarse)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
