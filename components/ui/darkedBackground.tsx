import React from "react";

const DarkedBackground = () => {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 via-black/20 to-black/40 pointer-events-none select-none" />
    </>
  );
};

export default DarkedBackground;
