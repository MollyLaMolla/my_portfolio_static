import { workExperience } from "@/data";
import React from "react";
import Image from "next/image";
import { Button } from "./ui/moving-border";

const Experience = () => {
  return (
    <div className="mb-24 relative">
      <div className="heading mb-16">
        My <span className="text-purple">Work Experience</span>
      </div>
      <div className="w-full mt-12 grid lg:grid-cols-4 grid-cols-1 gap-10">
        {workExperience.map((card) => (
          <Button
            key={card.id}
            borderRadius="1.75rem"
            className="p-6 flex-1 text-white border-neutral-200 dark:border-slate-800"
            duration={Math.floor(Math.random() * 10000) + 10000}>
            <div className="flex lg:flex-row flex-col items-center p-3 py-6 md:p-5 lg:p-8 gap-2">
              <Image
                src={card.thumbnail}
                alt={card.title}
                width={128}
                height={128}
                className="lg:w-32 md:w-20 w-16"
                style={{ height: "auto" }}
                loading="lazy"
              />
              <div className="lg:ms-5">
                <h1 className="text-start text-xl md:text-2xl font-bold">
                  {card.title}
                </h1>
                <p className="text-start text-white-100 mt-3 font-semibold">
                  <span dangerouslySetInnerHTML={{ __html: card.desc }} />
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Experience;
