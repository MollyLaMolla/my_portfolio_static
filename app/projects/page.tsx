import React from "react";
import { projects } from "@/data";
import { GridBg } from "@/components/ui/gridBg";
import ProjectCard from "@/components/ProjectCard";
import BackButton from "@/components/ui/BackButton";

export default function ProjectsPage() {
  return (
    <main className="relative py-24">
      <GridBg />
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4">
        <h1 className="heading">
          All <span className="text-purple">Projects</span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-24">
          {projects
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((p, idx) => (
              <ProjectCard key={p.id} {...p} aboveFold={idx < 6} />
            ))}
        </div>
        {/* Back button */}
        <div className="fixed top-4 left-4">
          <BackButton />
        </div>
      </div>
    </main>
  );
}
