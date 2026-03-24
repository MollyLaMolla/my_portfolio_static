"use client";

import React from "react";
import { useRouter } from "next/navigation";
import MagicBtn from "./magicBtn";

type BackButtonProps = {
  title?: string;
  otherClasses?: string;
  buttonClasses?: string;
  position?: "left" | "right";
};

export default function BackButton({
  title = "Back",
  otherClasses = "sm:px-5 sm:py-3 sm:text-lg sm:gap-4 items-center justify-center flex px-4 py-2 text-sm gap-2",
  buttonClasses = "",
  position = "left",
}: BackButtonProps) {
  const router = useRouter();

  return (
    <MagicBtn
      title={title}
      position={position}
      buttonClasses={buttonClasses}
      otherClasses={otherClasses}
      handleClick={() => router.push("/#projects")}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="sm:w-5 sm:h-5 w-4 h-4">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      }
    />
  );
}
