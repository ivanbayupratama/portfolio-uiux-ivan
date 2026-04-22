import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { caseStudiesDB } from "@/lib/data";

export default function CaseStudies() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-8 md:px-24 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section*/}
        <div className="mb-16 md:mb-24">
          <FadeIn direction="down" delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-neutral-900 dark:text-neutral-50">Case Studies</h1>
          </FadeIn>
          <FadeIn direction="down" delay={0.2}>
            <p className="text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">Translating complex user problems and system requirements into intuitive, high-fidelity interfaces. </p>
          </FadeIn>
        </div>

        {/* Grid Layout untuk Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {Object.entries(caseStudiesDB).map(([slug, project], index) => {
            const direction = index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right";

            return (
              <FadeIn key={slug} direction={direction} delay={0.3 + index * 0.15} className="h-full">
                <Link
                  href={`/case-studies/${slug}`}
                  className="group flex flex-col h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-4xl overflow-hidden hover:shadow-2xl dark:hover:shadow-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-500"
                >
                  {/* BAGIAN ATAS: Gambar Cover */}
                  <div className="relative w-full aspect-4/3 bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                    <Image src={project.images[0]} alt={project.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    {/* Meta Data: Role & Durasi */}
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">{project.role.split("&")[0]}</span>
                      <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">{project.duration}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-50 line-clamp-2">{project.title.split(" - ")[0]}</h3>

                    <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8 flex-1 line-clamp-3 text-sm">{project.outcome}</p>

                    {/* CTA Button */}
                    <div className="mt-auto flex items-center font-bold text-sm text-neutral-900 dark:text-neutral-50">
                      Read case study
                      <span className="ml-2 opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-2">&rarr;</span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </main>
  );
}
