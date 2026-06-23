import Link from "next/link";
import Image from "next/image";
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
import ProductPreview from "./ProductPreview";

const features = [
  {
    icon: <IconFolder size={20} stroke={1.5} />,
    title: "Portfolio builder",
    description:
      "Showcase your best work and create a portfolio that helps employers understand who you are beyond your resume.",},
  {
    icon: <IconBrandGithub size={20} stroke={1.5} />,
    title: "GitHub integration",
    description:
      "Turn your GitHub activity into a professional portfolio and let recruiters see your real development experience.",},
  {
    icon: <IconFileText size={20} stroke={1.5} />,
    title: "Resume builder",
    description:
      "Create professional resumes in seconds and keep them updated automatically as your portfolio grows.",},
  {
    icon: <IconCertificate size={20} stroke={1.5} />,
    title: "Certificate vault",
    description:
      "Keep all your achievements in one place and prove your skills with certificates that employers can verify.",},
  {
    icon: <IconBriefcase size={20} stroke={1.5} />,
    title: "Career tracker",
    description:
      "Stay organized throughout your internship journey and never lose track of applications, interviews, or offers.",},
  {
    icon: <IconChartBar size={20} stroke={1.5} />,
    title: "Analytics dashboard",
    description:
      "Understand what attracts recruiters and discover which projects and skills get the most attention.",},
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
    title: "Showcase your work",
    description:
      "Get a public URL at skillbridge.app/yourname. Share a professional profile that highlights your skills and achievements.",
  },
  {
    number: "03",
    title: "Launch your career",
    description:
      "Apply with confidence, track opportunities,and grow your professional presence.",
  },
];

const pricingFeatures = [
  "Public portfolio page",
  "Portfolio builder (all sections)",
  "GitHub integration",
  "Resume PDF generation",
  "Certificate vault",
  "Career tracker",
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
            <Image
              src="/logo.png"
              alt="SkillBridge"
              width={36}
              height={22}
              className="h-9 w-auto"
              priority
            />
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
              Create portfolio
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
              Built for students, graduates, and career starters
            </span>
          </div>

          <h1 className="mb-6 max-w-3xl text-5xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl">
            Build your skills.
            <br />
            <span className="text-indigo-400">Showcase your value.</span>
            <br />
            Launch your career.
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-relaxed text-slate-400">
            Turn your skills, projects, and achievements into opportunities with
            a professional portfolio built for students and future
            professionals.
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

          {/* Interactive product preview */}
          <ProductPreview />
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
                Build your portfolio, showcase your achievements, and track your
                journey from student to professional—all in one place.
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
                Turn your skills into opportunities{" "}
              </h2>
            </div>
            {/* Connector row, desktop only */}
            <div aria-hidden className="mb-4 hidden items-center md:flex">
              {steps.map((step, i) => (
                <div key={step.number} className="flex flex-1 items-center">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10">
                    <span className="text-xs font-semibold text-indigo-400">
                      {step.number}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mx-3 h-px flex-1 bg-gradient-to-r from-indigo-500/40 to-indigo-500/10" />
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number}>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 md:hidden">
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
                Start building your career for free.
              </h2>
              <p className="text-slate-400">
                Build your portfolio, showcase your achievements, and launch
                your career at no cost.
              </p>
            </div>
            <div className="mx-auto max-w-sm">
              <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 to-transparent p-8">
                <div className="mb-2 text-sm font-medium text-indigo-400">
                  EVERYTHING INCLUDED
                </div>
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="text-5xl font-semibold text-white">$0</span>
                  <span className="text-slate-500">/ month</span>
                </div>
                <p className="mb-8 text-sm text-slate-500">
                  Build your portfolio, showcase your achievements, and track
                  your career journey—all in one place.
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
                  Create my portfolio
                  <IconArrowRight size={15} stroke={2} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Founder note */}
        <section className="scroll-mt-20 border-t border-white/[0.04] px-6 py-32">
          <div className="mx-auto max-w-2xl">
            <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/[0.08] blur-[80px]"
              />
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-400">
                Why I built this
              </p>
              <p className="mb-6 text-lg leading-relaxed text-slate-300">
                As a student, I wanted a better way to showcase my projects,
                skills, certificates, and achievements in one place. SkillBridge
                was created to help students present their work professionally
                and turn their skills into opportunities.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white">
                  AA
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Alen Amarante
                  </p>
                  <p className="text-xs text-slate-500">
                    Creator of SkillBridge · IT Student
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="scroll-mt-20 border-t border-white/[0.04] px-6 py-32 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-white">
              Ready to launch your career?
            </h2>
            <p className="mb-10 text-lg text-slate-400">
              Build your portfolio, showcase your achievements, and take the
              next step toward your future.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-8 py-3.5 text-sm font-medium text-white transition hover:bg-indigo-400"
            >
              Create my portfolio
              <IconArrowRight size={15} stroke={2} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <div className="flex items-center gap-2 text-slate-500">
            <Image
              src="/logo.png"
              alt="SkillBridge"
              width={52}
              height={32}
              className="h-8 w-auto opacity-70"
            />{" "}
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
