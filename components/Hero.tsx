"use client";
import React from "react";
import { Spotlight } from "./ui/spotlight";
import { GridBg } from "./ui/gridBg";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import MagicBtn from "./ui/magicBtn";
import { FaLocationArrow } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="h-screen flex items-center justify-center w-full" id="home">
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="top-24 left-[90%] h-[80vh] w-[50vw] !rotate-[100deg] translate-x-[-50%] translate-y-[-50%] hidden lg:block"
          fill="purple"
        />
        <Spotlight
          className="-top-[20px] left-[0px] h-[80vh] w-[50vw] !-rotate-[190deg] translate-y-[-50%] translate-x-[-50%] hidden lg:block"
          fill="blue"
        />
      </div>
      <GridBg />
      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <h2 className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
            Dynamic Web Magic with Next.js & React
          </h2>
          <TextGenerateEffect
            words="Transforming Concepts into Seamless User Experiences"
            className="text-center text-[40px] md:text-5xl lg:text-6xl max-w-[880px]"
            filter={true}
            duration={0.5}
            purpleWordsPositions={[4, 5]}
          />
          <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
            Hi, I&apos;m Alessandro, a Full Stack Web Developer based in Italy.
          </p>
          <MagicBtn
            title="Show My Work"
            icon={<FaLocationArrow />}
            position="right"
            buttonClasses="md:w-60 md:mt-10 h-12"
            otherClasses="px-7 gap-2 text-sm"
            handleClick={() => {
              const projectsSection = document.getElementById("projects");
              if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
