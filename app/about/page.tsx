import Image from "next/image";
import FadeIn from "@/components/FadeIn";

export default function About() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-8 md:px-24 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-16">
          <FadeIn direction="down" delay={0.1}>
            <h1 className="text-5xl font-bold tracking-tight mb-6 text-neutral-900 dark:text-neutral-50">Beyond the Pixels</h1>
          </FadeIn>
          <FadeIn direction="down" delay={0.2}>
            <p className="text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Hello, I'm Ivan Bayu Pratama. Here is a glimpse into my background, my community involvement, and what keeps me grounded outside of the canvas.
            </p>
          </FadeIn>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)] group/bento">
          {/* Card 1: Logical Framework */}
          <FadeIn direction="left" delay={0.3} className="md:col-span-2">
            <div className="h-full bg-white dark:bg-neutral-900 p-8 md:p-12 rounded-4xl border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center transition-colors">
              <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">The Logical Framework</h2>
              <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <p>
                  As a UI/UX Designer and System Analyst based in Bandung (originally from Cirebon), my approach to design is heavily rooted in logical frameworks. Before initiating any design iteration, I prioritize in-depth research with
                  stakeholders utilizing various applicable methodologies.
                </p>
                <p>
                  I argue that exceptional design is not just about visual aesthetics; it must be fundamentally relevant and address actual needs. This requires navigating data structures, system limitations, and logical workflows. This
                  combined foundation of empirical research and technical understanding allows me to craft solutions that are both intuitive for users and feasible for developers.
                </p>
              </div>
            </div>
          </FadeIn>
          {/* Card 2: Photo Work */}
          <FadeIn direction="right" delay={0.4} className="h-full">
            <div className="relative h-full rounded-4xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 min-h-75 md:min-h-full">
              <div className="absolute inset-0 bg-[url('/images/Work.jpeg')] bg-cover bg-center"></div>
            </div>
          </FadeIn>
          {/* Card 3: Photo Campus */}
          <FadeIn direction="left" delay={0.5}>
            <div className="relative rounded-4xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800">
              <img src="/images/GDGOC.jpeg" alt="GDGOC Activity" className="w-full h-auto block" />
            </div>
          </FadeIn>
          {/* Card 4: Leadership  */}
          <FadeIn direction="right" delay={0.6} className="md:col-span-2 h-full">
            <div className="h-full bg-neutral-900 dark:bg-neutral-50 p-8 md:p-12 rounded-4xl border border-neutral-800 dark:border-neutral-200 flex flex-col transition-colors">
              <h2 className="text-2xl font-bold mb-6 text-white dark:text-neutral-900">Leadership & Collaboration</h2>
              <div className="space-y-5 text-neutral-300 dark:text-neutral-600 leading-relaxed text-lg">
                <p>
                  Design is rarely a solo endeavor. During my tenure as the Media Creative Staff at GDG (Google Developer Groups) on Campus Pasundan University, I was responsible for translating complex, tech-centric initiatives into
                  engaging visual communications.
                </p>
                <p>Having completed my term, I now carry forward that experience as a critical foundation for aligning differing stakeholder opinions and navigating collaborative team dynamics in fast-paced environments.</p>
              </div>

              <div className="mt-auto pt-12 flex items-center gap-4 opacity-50">
                <span className="w-12 h-[2px] bg-neutral-500"></span>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-white dark:text-neutral-900">Community & Impact</span>
              </div>
            </div>
          </FadeIn>
          {/* Card 5: Hobbies  */}
          <FadeIn direction="up" delay={0.7} className="md:col-span-3">
            <div className="h-full bg-white dark:bg-neutral-900 p-8 md:p-12 rounded-4xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row gap-8 items-center transition-colors">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">The Offline Equilibrium</h2>
                <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  <p>To balance the high-speed, fast-iteration culture of the digital world, I step away from the screen by playing guitar, hanging out at the billiard table, and caring for my pet Brazil turtle.</p>
                  <p>
                    Trading the monitor for a relaxed game of pool, the creative rhythm of guitar, or the deliberate pace of turtle care gives me essential space to decompress. These offline moments help me clear my head, allowing me to
                    return to system architectures and complex design problems with a much sharper perspective.
                  </p>
                </div>
              </div>

              {/* Card 6: Photo Hobbies */}
              <div className="w-full md:w-1/3 aspect-square relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 shrink-0">
                <div className="absolute inset-0 bg-[url('/images/Hobbies.jpeg')] bg-cover bg-center"></div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
