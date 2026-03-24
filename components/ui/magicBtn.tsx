import React from "react";

const MagicBtn = ({
  title,
  icon,
  position,
  handleClick,
  otherClasses,
  buttonClasses,
}: {
  title: string;
  icon: React.ReactNode;
  position: string;
  handleClick?: () => void;
  otherClasses?: string;
  buttonClasses?: string;
}) => {
  return (
    <button
      className={`relative inline-flex overflow-hidden rounded-lg p-[1px] focus:outline-none ${buttonClasses} hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 ease-in-out`}
      onClick={handleClick}
      aria-label={title}>
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span
        className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 font-medium text-white backdrop-blur-3xl ${otherClasses}`}>
        {position === "left" && icon}
        {title}
        {position === "right" && icon}
      </span>
    </button>
  );
};

export default MagicBtn;
