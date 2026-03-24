import React from "react";

interface TechBadgeProps {
  label: string;
}

const TechBadge: React.FC<TechBadgeProps> = ({ label }) => {
  return (
    <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md text-[10px] md:text-xs font-medium tracking-wide bg-[#0b1022] text-white/90 border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.35)] opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200">
      {label}
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#0b1022] border-b border-r border-white/10" />
    </div>
  );
};

export default TechBadge;
