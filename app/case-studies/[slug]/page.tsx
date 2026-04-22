import CaseStudyViewer from "@/components/CaseStudyViewer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudiesDB } from "@/lib/data";
import { Metadata } from "next";

// 1. DYNAMIC METADATA (Untuk SEO & Social Sharing)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const currentCaseStudy = caseStudiesDB[resolvedParams.slug];

  if (!currentCaseStudy) {
    return {
      title: "Case Study Not Found | Ivan Bayu Pratama",
    };
  }

  return {
    title: `${currentCaseStudy.title} | Case Study`,
    description: currentCaseStudy.problem,
    openGraph: {
      title: currentCaseStudy.title,
      description: currentCaseStudy.problem,
      images: currentCaseStudy.images ? [currentCaseStudy.images[0]] : [],
    },
  };
}

// 2. MAIN COMPONENT
export default async function CaseStudyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const currentCaseStudy = caseStudiesDB[resolvedParams.slug];

  if (!currentCaseStudy) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-28 pb-12 transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-8">
        <Link href="/#featured" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:-translate-x-1 transition-all duration-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Case Studies
        </Link>
      </div>

      <CaseStudyViewer data={currentCaseStudy} />
    </main>
  );
}
