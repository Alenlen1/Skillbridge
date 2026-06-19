import Link from "next/link";
import {
  IconBrandGithub,
  IconBriefcase,
  IconCertificate,
  IconChartBar,
  IconFileText,
  IconFolder,
  IconArrowRight,
  IconStar,
  IconCheck,
  IconSparkles,
} from "@tabler/icons-react";

const features = [
  {
    icon: <IconFolder size={20} stroke={1.5} />,
    title: "Portfolio builder",
    description:
      "Build a stunning portfolio with sections for projects, skills, education, and experience. Make it yours with themes and accent colors.",
    phase: "Phase 1",
  },
  {
    icon: <IconBrandGithub size={20} stroke={1.5} />,
    title: "GitHub integration",
    description:
      "Connect your GitHub and auto-import repositories. Pin your best projects so employers see your real work, not just a resume.",
    phase: "Phase 2",
  },
  {
    icon: <IconFileText size={20} stroke={1.5} />,
    title: "Resume builder",
    description:
      "Generate a polished PDF resume directly from your portfolio data. Multiple templates, always up to date, one click away.",
    phase: "Phase 3",
  },
  {
    icon: <IconCertificate size={20} stroke={1.5} />,
    title: "Certificate vault",
    description:
      "Upload, categorize, and showcase your certificates and credentials alongside your projects. Everything in one place.",
    phase: "Phase 3",
  },
  {
    icon: <IconBriefcase size={20} stroke={1.5} />,
    title: "Internship tracker",
    description:
      "Track every application on a Kanban board. Applied → Screening → Interview → Offer. Never lose track of where you stand.",
    phase: "Phase 4",
  },
  {
    icon: <IconChartBar size={20} stroke={1.5} />,
    title: "Analytics dashboard",
    description:
      "See who is visiting your portfolio, downloading your resume, and clicking your projects so you know what is working.",
    phase: "Phase 4",
  },
];

const steps = [
  {
    number: "01",
    title: "Build your portfolio",
    description:
      "Add your projects, skills, and experience. Connect GitHub to auto-import repositories.",
  },
  {
    number: "02",
    title: "Share your profile",
    description:
      "Get a public URL at skillbridge.app/yourname. Share it with recruiters, on LinkedIn, or in applications.",
  },
  {
    number: "03",
    title: "Land the internship",
    description:
      "Track applications, generate resumes, and use AI feedback to keep improving until you get the offer.",
  },
];

const pricingFeatures = [
  "Public portfolio page",
  "Portfolio builder (all sections)",
  "GitHub integration",
  "Resume PDF generation",
  "Certificate vault",
  "Internship tracker",
  "Analytics dashboard",
  "AI resume reviewer (coming soon)",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] font-sans text-white antialiased">
      {/* Nav */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500">
              <IconSparkles size={14} stroke={2} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white">
              SkillBridge
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-14 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="h-[600px] w-[600px] rounded-full bg-indigo-500/[0.08] blur-[120px]" />
          </div>

          <div className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5">
            <IconStar size={13} stroke={1.5} className="text-indigo-400" />
            <span className="text-xs font-medium text-slate-300">
              Built for students and fresh graduates
            </span>
          </div>

          <h1 className="mb-6 max-w-3xl text-5xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl">
            Build your skills.
            <br />
            <span className="text-indigo-400">Showcase your work.</span>
            <br />
            Launch your career.
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-relaxed text-slate-400">
            SkillBridge is the all-in-one career platform that helps you build a
            professional portfolio, generate resumes, and track internship
            applications before your first job.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-400"
            >
              Create your portfolio
              <IconArrowRight
                size={15}
                stroke={2}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              Log in →
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-600">
            Free to use · No credit card required
          </p>

          {/* Mock browser */}
          <div className="relative mt-20 w-full max-w-4xl">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0f0f1a] p-1 shadow-2xl shadow-black/40">
              <div className="mb-3 flex items-center gap-2 px-3 pt-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                <div className="ml-3 flex-1 rounded-md bg-white/[0.05] py-1 px-3">
                  <span className="text-xs text-slate-600">
                    skillbridge.app/alen
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-[#0d0d18] p-6">
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
                    AA
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Alen Amarante</h3>
                    <p className="text-sm text-slate-400">
                      Sophomore IT Student · Full-Stack Developer
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["React", "TypeScript", "Next.js", "PostgreSQL"].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400"
                          >
                            {tag}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    {
                      name: "SkillBridge",
                      desc: "Career platform for students",
                      stars: 42,
                    },
                    {
                      name: "FlaskAPI Boilerplate",
                      desc: "REST API starter with auth",
                      stars: 18,
                    },
                  ].map((project) => (
                    <div
                      key={project.name}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {project.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {project.desc}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600">
                          <IconStar size={12} stroke={1.5} />
                          <span className="text-xs">{project.stars}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f]" />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 px-6 py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-400">
                Features
              </p>
              <h2 className="mb-4 text-4xl font-semibold tracking-tight text-white">
                Everything you need to stand out
              </h2>
              <p className="mx-auto max-w-lg text-slate-400">
                From portfolio to job offer, SkillBridge covers every step of
                the early career journey.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group bg-[#0a0a0f] p-6 transition-colors hover:bg-[#0f0f1a]"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                      {feature.icon}
                    </div>
                    <span className="rounded-full border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-xs text-slate-600">
                      {feature.phase}
                    </span>
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-20 border-t border-white/[0.04] px-6 py-32"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-400">
                How it works
              </p>
              <h2 className="text-4xl font-semibold tracking-tight text-white">
                From zero to hired in three steps
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number}>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
                    <span className="text-xs font-semibold text-indigo-400">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="scroll-mt-20 border-t border-white/[0.04] px-6 py-32"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-400">
                Pricing
              </p>
              <h2 className="mb-4 text-4xl font-semibold tracking-tight text-white">
                Free while you are a student
              </h2>
              <p className="text-slate-400">
                SkillBridge is completely free during early access. No catch.
              </p>
            </div>
            <div className="mx-auto max-w-sm">
              <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 to-transparent p-8">
                <div className="mb-2 text-sm font-medium text-indigo-400">
                  Early access
                </div>
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="text-5xl font-semibold text-white">$0</span>
                  <span className="text-slate-500">/ month</span>
                </div>
                <p className="mb-8 text-sm text-slate-500">
                  All features included, forever free for students.
                </p>
                <ul className="mb-8 space-y-3">
                  {pricingFeatures.map((feat) => (
                    <li key={feat} className="flex items-center gap-3">
                      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
                        <IconCheck
                          size={10}
                          stroke={2.5}
                          className="text-indigo-400"
                        />
                      </div>
                      <span className="text-sm text-slate-300">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 py-3 text-sm font-medium text-white transition hover:bg-indigo-400"
                >
                  Create your free account
                  <IconArrowRight size={15} stroke={2} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="scroll-mt-20 border-t border-white/[0.04] px-6 py-32 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-white">
              Your career starts here
            </h2>
            <p className="mb-10 text-lg text-slate-400">
              Join students who are building real portfolios and landing their
              first internships with SkillBridge.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-8 py-3.5 text-sm font-medium text-white transition hover:bg-indigo-400"
            >
              Get started for free
              <IconArrowRight size={15} stroke={2} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <div className="flex items-center gap-2 text-slate-500">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20">
              <IconSparkles size={10} stroke={2} className="text-indigo-400" />
            </div>

            <span className="font-medium text-white">SkillBridge</span>

            <span>·</span>

            <span>Built by</span>

            <a
              href="https://www.facebook.com/alenlenamarante"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-400 transition hover:text-indigo-300"
            >
              Alen Amarante
            </a>
          </div>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-indigo-400 transition hover:text-indigo-300"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-indigo-400 transition hover:text-indigo-300"
            >
              Terms
            </Link>

            <a
              href="https://github.com/Alenlen1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 transition hover:text-indigo-300"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
