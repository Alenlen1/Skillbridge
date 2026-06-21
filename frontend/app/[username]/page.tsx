import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
interface Portfolio {
  about: string | null;
  headline: string | null;
  location: string | null;
  website: string | null;
  accentColor: string;
  skills: {
    id: string;
    name: string;
    category: string | null;
    level: string | null;
  }[];
  projects: {
    id: string;
    title: string;
    description: string | null;
    techStack: string[];
    liveUrl: string | null;
    githubUrl: string | null;
    featured: boolean;
  }[];
  education: {
    id: string;
    school: string;
    degree: string | null;
    field: string | null;
    startYear: number | null;
    endYear: number | null;
    current: boolean;
  }[];
  experience: {
    id: string;
    company: string;
    role: string;
    startDate: string | null;
    endDate: string | null;
    current: boolean;
    description: string | null;
  }[];
}

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  category: string;
  fileUrl: string;
  issuedAt: string | null;
}

interface User {
  name: string | null;
  username: string;
  avatar: string | null;
  bio: string | null;
  certificates: Certificate[];
  portfolio: Portfolio | null;
}

async function getUser(username: string): Promise<User | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/portfolio/${username}`,
      { next: { revalidate: 10 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUser(username);

  if (!user || !user.portfolio) notFound();

  const { portfolio } = user;
  const certificates = user.certificates || [];

  const skillsByCategory = portfolio.skills.reduce<
    Record<string, typeof portfolio.skills>
  >((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const initials = (user.name || user.username)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#0a0a0f] antialiased">
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
          <Link
            href="/register"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
          >
            Create your portfolio
          </Link>
        </div>
      </header>

      <main className="pt-14">
        {/* Hero section with glow */}
        <div className="relative overflow-hidden border-b border-white/[0.06] px-6 py-16">
          {/* Indigo glow — same as landing page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="h-[500px] w-[500px] rounded-full bg-indigo-500/[0.07] blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-6xl">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-start">
              {/* Avatar */}
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-semibold text-white shadow-lg shadow-indigo-500/20">
                {initials}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  {user.name || user.username}
                </h1>

                {portfolio.headline && (
                  <p className="mt-2 text-lg font-medium text-slate-200">
                    {portfolio.headline}
                  </p>
                )}

                <p className="mt-1 text-slate-500">@{user.username}</p>

                <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                  {portfolio.location && (
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {portfolio.location}
                    </span>
                  )}
                  {portfolio.website && (
                    <a
                      href={portfolio.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-indigo-400 transition hover:text-indigo-300"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      {portfolio.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>

                {portfolio.about && (
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
                    {portfolio.about}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-6xl space-y-16 px-6 py-16">
          {/* Skills */}
          {portfolio.skills.length > 0 && (
            <section>
              <div className="mb-8 flex items-center gap-4">
                <h2 className="text-lg font-semibold text-white">Skills</h2>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>
              <div className="space-y-6">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category}>
                    <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-600">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400"
                        >
                          {skill.name}
                          {skill.level && (
                            <span className="ml-2 text-xs text-slate-600">
                              {skill.level}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {portfolio.projects.length > 0 && (
            <section>
              <div className="mb-8 flex items-center gap-4">
                <h2 className="text-lg font-semibold text-white">Projects</h2>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {portfolio.projects.map((project) => (
                  <div
                    key={project.id}
                    className="group relative flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/[0.1] hover:bg-white/[0.04]"
                  >
                    {project.featured && (
                      <span className="absolute right-4 top-4 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                        Featured
                      </span>
                    )}
                    <h3 className="mb-2 font-medium text-white">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500">
                        {project.description}
                      </p>
                    )}
                    {project.techStack.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-white"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-indigo-400 transition hover:text-indigo-300"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Live demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {/* Certificates */}
          {certificates.length > 0 && (
            <section>
              <div className="mb-8 flex items-center gap-4">
                <h2 className="text-lg font-semibold text-white">
                  Certificates
                </h2>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {certificates.map((cert) => (
                  <a
                    key={cert.id}
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/[0.1] hover:bg-white/[0.04]"
                  >
                    <span className="mb-2 inline-block rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                      {cert.category}
                    </span>
                    <h3 className="font-medium text-white">{cert.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{cert.issuer}</p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {portfolio.education.length > 0 && (
            <section>
              <div className="mb-8 flex items-center gap-4">
                <h2 className="text-lg font-semibold text-white">Education</h2>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>
              <div className="space-y-4">
                {portfolio.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="flex items-start justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                  >
                    <div>
                      <h3 className="font-medium text-white">{edu.school}</h3>
                      {edu.degree && (
                        <p className="mt-1 text-sm text-slate-400">
                          {edu.degree}
                          {edu.field && ` · ${edu.field}`}
                        </p>
                      )}
                    </div>
                    <p className="flex-shrink-0 text-xs text-slate-600">
                      {edu.startYear} — {edu.current ? "Present" : edu.endYear}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {portfolio.experience.length > 0 && (
            <section>
              <div className="mb-8 flex items-center gap-4">
                <h2 className="text-lg font-semibold text-white">Experience</h2>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>
              <div className="space-y-4">
                {portfolio.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-start justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                  >
                    <div>
                      <h3 className="font-medium text-white">{exp.role}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {exp.company}
                      </p>
                      {exp.description && (
                        <p className="mt-2 text-sm text-slate-500">
                          {exp.description}
                        </p>
                      )}
                    </div>
                    {exp.current && (
                      <span className="flex-shrink-0 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                        Current
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.06] px-6 py-8 text-center">
          <p className="text-xs text-slate-600">
            Built with{" "}
            <Link
              href="/"
              className="text-indigo-400 transition hover:text-indigo-300"
            >
              SkillBridge
            </Link>
            {" · "}
            <Link
              href="/register"
              className="text-indigo-400 transition hover:text-indigo-300"
            >
              Create your own portfolio for free
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
