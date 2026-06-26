import { ResumeData } from "../ResumeTypes";

interface Props {
  data: ResumeData;
}

function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function ATSPreview({ data }: Props) {
  const skillsByCategory = data.skills.reduce<Record<string, string[]>>(
    (acc, skill) => {
      const category = skill.category || "Other";

      if (!acc[category]) acc[category] = [];

      acc[category].push(skill.name);

      return acc;
    },
    {},
  );

  const linkedin = data.socialLinks.find((l) => l.platform === "LinkedIn");

  const github = data.socialLinks.find((l) => l.platform === "GitHub");

  const contactItems = [
    data.email,
    data.phone,
    data.location,
    data.website?.replace(/^https?:\/\//, ""),
    linkedin?.url.replace(/^https?:\/\/(www\.)?/, ""),
    github?.url.replace(/^https?:\/\/(www\.)?/, ""),
    `skillbridge.app/${data.username}`,
  ].filter(Boolean);

  return (
    <div className="bg-white p-12 text-black">
      {/* Header */}

      <div className="text-center">
        <h1 className="text-3xl font-bold uppercase tracking-[0.25em]">
          {data.name}
        </h1>

        {data.headline && (
          <p className="mt-2 text-sm text-gray-600">{data.headline}</p>
        )}

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-gray-600">
          {contactItems.map((item, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-2 text-gray-400">|</span>}

              {item}
            </span>
          ))}
        </div>
      </div>

      <hr className="my-8 border-black" />

      {/* Summary */}

      {data.about && (
        <section className="mb-8">
          <h2 className="border-b border-gray-300 pb-2 text-xs font-bold uppercase tracking-[0.2em]">
            Summary
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-700">{data.about}</p>
        </section>
      )}

      {/* Experience */}

      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="border-b border-gray-300 pb-2 text-xs font-bold uppercase tracking-[0.2em]">
            Experience
          </h2>

          <div className="mt-4 space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <h3 className="font-semibold">
                    {exp.role} — {exp.company}
                  </h3>

                  <span className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} —{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>

                {exp.description && (
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}

      {data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="border-b border-gray-300 pb-2 text-xs font-bold uppercase tracking-[0.2em]">
            Projects
          </h2>

          <div className="mt-4 space-y-5">
            {data.projects.map((project) => (
              <div key={project.id}>
                <h3 className="font-semibold">{project.title}</h3>

                {project.description && (
                  <p className="mt-1 text-sm leading-6 text-gray-700">
                    {project.description}
                  </p>
                )}

                {project.techStack.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    <strong>Tech:</strong> {project.techStack.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}

      {data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="border-b border-gray-300 pb-2 text-xs font-bold uppercase tracking-[0.2em]">
            Education
          </h2>

          <div className="mt-4 space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <h3 className="font-semibold">{edu.school}</h3>

                  <span className="text-sm text-gray-500">
                    {edu.startYear} — {edu.current ? "Present" : edu.endYear}
                  </span>
                </div>

                <p className="text-sm text-gray-700">
                  {edu.degree}

                  {edu.field && ` in ${edu.field}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}

      {Object.keys(skillsByCategory).length > 0 && (
        <section className="mb-8">
          <h2 className="border-b border-gray-300 pb-2 text-xs font-bold uppercase tracking-[0.2em]">
            Skills
          </h2>

          <div className="mt-4 space-y-2">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className="flex">
                <span className="w-28 font-semibold">{category}</span>

                <span className="text-gray-700">{skills.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}

      {data.certificates.length > 0 && (
        <section>
          <h2 className="border-b border-gray-300 pb-2 text-xs font-bold uppercase tracking-[0.2em]">
            Certifications
          </h2>

          <ul className="mt-4 space-y-2">
            {data.certificates.map((cert) => (
              <li key={cert.id} className="text-sm text-gray-700">
                • {cert.title} — {cert.issuer}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
