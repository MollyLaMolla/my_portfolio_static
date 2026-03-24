import { Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import { FloatingNav } from "@/components/ui/floating-navbar";

// Tier 1 — just below the fold, SSR + eager JS load
const Grid = dynamic(() => import("@/components/Grid"), { ssr: true });

// Tier 2 — mid-page, SSR but lower priority
const RecentProjects = dynamic(() => import("@/components/RecentProjects"), {
  ssr: true,
});

// Tier 3 — deep below fold, still SSR for SEO
const Experience = dynamic(() => import("@/components/Experience"), {
  ssr: true,
});
const Skills = dynamic(() => import("@/components/Skills"), { ssr: true });
const Approach = dynamic(() => import("@/components/Approach"), {
  ssr: true,
});
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav />
        <Hero />

        {/* Progressive Suspense boundaries — each tier can render independently */}
        <Suspense>
          <Grid />
        </Suspense>

        <Suspense>
          <RecentProjects />
        </Suspense>

        <Suspense>
          <div className="py-24" id="skills">
            <Experience />
            <Skills />
            <Approach />
          </div>
        </Suspense>

        <Suspense>
          <Footer />
        </Suspense>
      </div>
    </main>
  );
}
