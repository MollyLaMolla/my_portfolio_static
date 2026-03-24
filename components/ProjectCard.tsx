import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaLocationArrow } from "react-icons/fa";

export interface ProjectCardProps {
  id: number;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  websiteLink: string;
  githubLink?: string;
  tecnologies?: string[];
  /** Mark card images as above-the-fold for eager loading */
  aboveFold?: boolean;
}

import TechBadge from "./ui/TechBadge";

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  des,
  img,
  iconLists,
  websiteLink,
  githubLink,
  tecnologies,
  aboveFold = false,
}) => {
  return (
    <article className=" relative rounded-2xl border border-white/10 bg-[#0f1324]/10 backdrop-blur-sm flex flex-col overflow-hidden mx-auto shadow-[0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-500 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_28px_-6px_rgba(0,0,0,0.15),0_0_20px_10px_rgba(139,92,246,0.10)]">
      {/* Glow ring */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl">
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.25),transparent_60%)]" />
        <div className="absolute -inset-px rounded-2xl border border-white/5 group-hover:border-white/15 transition-colors" />
      </div>

      {/* Top media */}
      <div className="relative aspect-[16/11] w-full bg-[#13162d] overflow-hidden">
        <Image
          src="/bg.png"
          alt="background grid"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover opacity-70"
          loading={aboveFold ? "eager" : "lazy"}
        />
        {img ? (
          <Image
            src={img}
            alt={title}
            fill
            sizes="(max-width:768px) 280px, (max-width:1024px) 360px, 480px"
            className="object-contain object-bottom drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
            loading={aboveFold ? "eager" : "lazy"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs">
            No preview
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col grow p-5">
        <h2 className="font-semibold tracking-tight lg:text-xl text-lg mb-1 line-clamp-1 group-hover:text-white transition-colors">
          {title}
        </h2>
        <p className="text-xs md:text-sm text-white/60 lg:line-clamp-4 line-clamp-3 leading-relaxed group-hover:text-white/70 transition-colors md:h-[80px] h-[58.5px]">
          {des}
        </p>

        {/* Tech stack icons */}
        <div className="mt-4 flex items-start flex-wrap gap-[8px] h-[76px]">
          {iconLists.map((icon, idx) => {
            const label =
              tecnologies?.[idx] ?? icon.replace(/^\/(.+)\..+$/, "$1");
            return (
              <div key={idx} className="flex items-center justify-center">
                <div className="relative group/icon">
                  <div className="border border-white/10 bg-[#10132E]/80 backdrop-blur rounded-full w-8 h-8 flex items-center justify-center shadow-[0_0_0_1px_rgba(255,255,255,0.06)] group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.18)] transition-shadow">
                    <Image
                      src={`/small-skills-icons${icon}`}
                      alt={label}
                      width={22}
                      height={22}
                      style={{ width: "auto", height: "auto" }}
                      loading="lazy"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/5 group-hover:ring-white/15" />
                  {label && <TechBadge label={label} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Footer action */}
      <div className="py-4 px-6 flex justify-between items-center border-t border-white/10">
        {/* github code link */}
        <Link
          href={githubLink?.includes("github.com") ? githubLink : "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View source on GitHub for ${title}`}
          className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-white/60 hover:text-white transition-colors mr-4">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 md:w-5 md:h-5"
            aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.43 2.865 8.192 6.839 9.525.5.092.682-.217.682-.48 0-.237-.009-.868-.014-1.704-2.782.605-3.369-1.343-3.369-1.343-.454-1.153-1.11-1.461-1.11-1.461-.909-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.531 2.341 1.089 2.91.833.091-.648.35-1.089.636-1.34-2.22-.254-4.555-1.113-4.555-4.949 0-1.093.39-1.988 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 7.07c.85.004 1.705.115 2.503.337 1.909-1.295 2.748-1.026 2.748-1.026.546 1.379.202 2.398.1 2.651.64.699 1.028 1.594 1.028 2.687 0 3.845-2.338 4.692-4.566 4.941.36.31.682.918.682 1.852 0 1.337-.012 2.416-.012 2.744 0 .265.18.576.688.478A10.024 10.024 0 0 0 22 12.021C22 6.484 17.523 2 12 2Z" />
          </svg>
          <span>View Code</span>
        </Link>

        {/* website link */}
        <Link
          href={websiteLink}
          target="_blank"
          aria-label={`Visit live site for ${title}`}
          className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-purple hover:text-white transition-colors">
          <span>Check Live</span>
          <FaLocationArrow className="mt-[1px] w-3 h-3 md:w-4 md:h-4 rotate-45" />
        </Link>
      </div>
    </article>
  );
};

export default ProjectCard;
