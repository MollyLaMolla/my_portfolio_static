"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data";
import { PinContainer } from "./ui/3d-pin";
import { FaLocationArrow } from "react-icons/fa";
import MagicBtn from "./ui/magicBtn";

const RecentProjects = () => {
  function handleLinckClick(url: string) {
    window.open(url, "_blank");
  }

  return (
    <div className="py-24 relative" id="projects">
      <h1 className="heading">
        A Small Selection of{" "}
        <span className="text-purple">Recent Projects</span>
      </h1>
      <div className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
        {projects
          .filter((project) => project.recent)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map(
            ({
              id,
              title,
              des,
              img,
              iconLists,
              websiteLink,
              websiteLinkTitle,
            }) => (
              <div
                key={id}
                onClick={() => handleLinckClick(websiteLink)}
                className={`lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-[280px] lg:w-[360px] w-[80vw]`}>
                <PinContainer
                  title={websiteLinkTitle ? websiteLinkTitle : websiteLink}
                  href={websiteLink}>
                  <div className="relative flex items-center justify-center sm:w-[280px] lg:w-[360px] w-[80vw] overflow-hidden h-[25vh] lg:h-[30vh] mb-10">
                    <div className="relative w-full h-full overflow-hidden rounded-xl bg-[#13162d]">
                      <Image
                        src="/bg.png"
                        alt="bg"
                        fill
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 280px, 360px"
                        className="object-cover"
                        loading="lazy"
                      />
                      <Image
                        src={img}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 280px, 360px"
                        className="z-10 object-contain object-bottom"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                    {title}
                  </h1>
                  <p className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2">
                    {des}
                  </p>
                  <div className="flex flex-col items-start justify-between mt-7 gap-4 w-full">
                    <div className="flex items-center justify-start relative w-fit h-10">
                      {iconLists.map((icon, idx) => (
                        <div
                          key={idx}
                          className="border border-white/[0.2] bg-[#10132E] rounded-full flex items-center justify-center lg:w-10 lg:h-10 w-8 h-8 -ml-3 first:ml-0"
                          title={icon}>
                          <Image
                            src={`/small-skills-icons${icon}`}
                            alt={icon}
                            className="p-0"
                            style={{ width: "24px", height: "24px" }}
                            width={24}
                            height={24}
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center items-center gap-2 self-end">
                      <p className="lg:text-lg md:text-xs text-sm text-purple line-clamp-1">
                        Check Live
                      </p>
                      <FaLocationArrow
                        color="#CBACF9"
                        className="mt-1 lg:w-4 lg:h-4 w-2 h-2 rotate-45"
                      />
                    </div>
                  </div>
                </PinContainer>
              </div>
            ),
          )}
      </div>
      <div className="flex justify-center items-center mt-24">
        <Link href="/projects" className="no-underline">
          <MagicBtn
            title="View All Projects"
            icon={
              <FaLocationArrow
                color="#ffff"
                className="lg:w-6 lg:h-6 w-4 h-4"
              />
            }
            position="right"
            buttonClasses=""
            otherClasses="lg:px-12 lg:py-4 lg:text-2xl lg:gap-8 px-6 py-3 text-lg gap-4"
          />
        </Link>
      </div>
    </div>
  );
};
export default RecentProjects;
