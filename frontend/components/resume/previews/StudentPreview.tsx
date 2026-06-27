import { ResumeData } from "../ResumeTypes";

interface Props {
  data: ResumeData;
}

export default function StudentPreview({ data }: Props) {
  return (
    <div className="rounded-3xl bg-neutral-50 p-10 text-black shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <h1 className="text-4xl font-bold">{data.name}</h1>

      {data.headline && (
        <p className="mt-2 text-lg font-semibold text-indigo-600">
          {data.headline}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
        {data.email && <span>{data.email}</span>}

        {data.phone && <span>{data.phone}</span>}

        {data.location && <span>{data.location}</span>}

        <span>skillbridge.app/{data.username}</span>
      </div>

      <div className="mt-8 space-y-8">
        {data.about && (
          <section>
            <h2 className="mb-2 border-b pb-2 text-sm font-bold uppercase tracking-widest text-indigo-600">
              Summary
            </h2>

            <p className="leading-7 text-gray-700">{data.about}</p>
          </section>
        )}

        {/* Education — students lead with this */}
        {data.education.length > 0 && (
          <section>
            <h2 className="mb-4 border-b pb-2 text-sm font-bold uppercase tracking-widest text-indigo-600">
              Education
            </h2>

            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between">
                    <p className="font-semibold">{edu.school}</p>
                    <span className="text-sm text-gray-500">
                      {edu.startYear} – {edu.current ? "Present" : edu.endYear}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700">
                    {edu.degree}
                    {edu.field && ` · ${edu.field}`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h2 className="mb-4 border-b pb-2 text-sm font-bold uppercase tracking-widest text-indigo-600">
              Experience
            </h2>

            <div className="space-y-4">
              {data.experience.map((exp) => {
                const meta = [exp.company, exp.employmentType, exp.location]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <div key={exp.id}>
                    <div className="flex justify-between">
                      <p className="font-semibold">{exp.role}</p>
                      <span className="text-sm text-gray-500">
                        {exp.startDate
                          ? new Date(exp.startDate).toLocaleDateString(
                              "en-US",
                              { month: "short", year: "numeric" },
                            )
                          : ""}
                        {" – "}
                        {exp.current
                          ? "Present"
                          : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" },
                              )
                            : ""}
                      </span>
                    </div>

                    {meta && <p className="text-sm text-gray-500">{meta}</p>}

                    {exp.description && (
                      <p className="mt-1 text-sm text-gray-700">
                        {exp.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section>
            <h2 className="mb-4 border-b pb-2 text-sm font-bold uppercase tracking-widest text-indigo-600">
              Projects
            </h2>

            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <p className="font-semibold">{project.title}</p>

                  {project.description && (
                    <p className="text-sm text-gray-700">
                      {project.description}
                    </p>
                  )}

                  {project.techStack.length > 0 && (
                    <p className="mt-1 text-xs text-gray-500">
                      {project.techStack.join(" • ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h2 className="mb-4 border-b pb-2 text-sm font-bold uppercase tracking-widest text-indigo-600">
              Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.certificates.length > 0 && (
          <section>
            <h2 className="mb-4 border-b pb-2 text-sm font-bold uppercase tracking-widest text-indigo-600">
              Certifications
            </h2>

            <div className="space-y-2">
              {data.certificates.map((cert) => (
                <div key={cert.id}>
                  <p className="font-medium">{cert.title}</p>

                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
