import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { gridItems as items } from "@/data";

const Grid = () => {
  return (
    <section id="about" className="py-24">
      <BentoGrid>
        {items.map(
          ({
            id,
            title,
            description,
            className,
            img,
            imgClassName,
            titleClassName,
            titleSizeClassName,
            spareImg,
          }) => {
            // Tilt strength mapping per spec (100% = default tilt)
            // id: 1->10%, 2->0%, 3->20%, 4->20%, 5->10%, 6->20%
            const percentById: Record<number, number> = {
              1: 15,
              2: 35, // non si resetta più e tilt al 35%
              3: 35,
              4: 35,
              5: 10,
              6: 35,
            };
            const pct = percentById[id] ?? 100;
            // Base of 10deg at 100%, but hard-cap to 5deg overall as requested
            const baseMaxDeg = 10;
            const computed = Math.round((pct / 100) * baseMaxDeg);
            const tiltMaxDeg = Math.min(5, computed);
            const enableTilt = pct > 0; // explicitly disable when 0%

            return (
              <BentoGridItem
                id={id}
                key={id}
                title={title}
                description={description}
                className={className}
                img={img}
                imgClassName={imgClassName}
                titleClassName={titleClassName}
                titleSizeClassName={titleSizeClassName}
                spareImg={spareImg}
                enableTilt={enableTilt}
                tiltMaxDeg={tiltMaxDeg}
              />
            );
          }
        )}
      </BentoGrid>
    </section>
  );
};

export default Grid;
