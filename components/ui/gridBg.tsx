import { cn } from "@/lib/utils";
import React from "react";

export function GridBg() {
  return (
    <div className="absolute flex h-full w-full items-center justify-center dark:bg-black-100 gb-white top-0 left-0 overflow-hidden">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:80px_80px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_2px,transparent_2px),linear-gradient(to_bottom,#e4e4e7_2px,transparent_2px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_2px,transparent_2px),linear-gradient(to_bottom,#262626_2px,transparent_2px)]",
          "opacity-10"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_25%,black)] dark:bg-black-100" />
    </div>
  );
}
