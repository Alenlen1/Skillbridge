import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "./ResumeTypes";

const s = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingBottom: 42,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: "#111111",
    lineHeight: 1.4,
  },

  // ── Header ──────────────────────────────────────────────────────────
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 4,
    lineHeight: 1.1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  headline: {
    fontSize: 10,
    color: "#555555",
    lineHeight: 1.2,
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 9.5,
    color: "#555555",
    marginBottom: 2,
  },
  contactItem: {
    marginRight: 10,
    marginBottom: 4,
  },

  // ── Thick rule under header ─────────────────────────────────────────
  rule: {
    borderBottomWidth: 2,
    borderBottomColor: "#111111",
    marginTop: 10,
    marginBottom: 14,
  },
  thinRule: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
    marginBottom: 8,
  },

  // ── Sections ────────────────────────────────────────────────────────
  section: { marginBottom: 13 },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 5,
  },

  // ── Entries ─────────────────────────────────────────────────────────
  entry: { marginBottom: 8 },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  entryTitle: { fontSize: 9.5, fontFamily: "Helvetica-Bold", flex: 1 },
  entryDate: { fontSize: 8.5, color: "#555555", marginLeft: 8 },
  entryMeta: { fontSize: 8.5, color: "#444444", marginBottom: 2 },
  entryDesc: { fontSize: 9, color: "#333333", lineHeight: 1.55 },

  // ── Skills grid ─────────────────────────────────────────────────────
  skillRow: { flexDirection: "row", marginBottom: 3 },
  skillCat: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    width: 72,
    color: "#111111",
  },
  skillVal: { fontSize: 9, color: "#333333", flex: 1 },

  // ── Certs ────────────────────────────────────────────────────────────
  certLine: { fontSize: 9, color: "#333333", marginBottom: 2 },
});

function fmt(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function isPlaceholderEmail(email: string): boolean {
  return email.includes("@github.skillbridge.placeholder");
}

export default function ResumeATS({ data }: { data: ResumeData }) {
  const byCategory = data.skills.reduce<Record<string, string[]>>((acc, sk) => {
    const c = sk.category || "Other";
    if (!acc[c]) acc[c] = [];
    acc[c].push(sk.name);
    return acc;
  }, {});

  const linkedin = data.socialLinks.find((l) => l.platform === "LinkedIn");
  const github = data.socialLinks.find((l) => l.platform === "GitHub");

  const contacts = [
    !isPlaceholderEmail(data.email) ? data.email : null,
    data.phone,
    data.location,
    data.website?.replace(/^https?:\/\//, ""),
    linkedin?.url.replace(/^https?:\/\/(www\.)?/, ""),
    github?.url.replace(/^https?:\/\/(www\.)?/, ""),
    `skillbridge.app/${data.username}`,
  ].filter(Boolean) as string[];

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <Text style={s.name}>{data.name}</Text>
        {data.headline && <Text style={s.headline}>{data.headline}</Text>}
        <View style={s.contactRow}>
          {contacts.map((c, i) => (
            <Text key={i} style={s.contactItem}>
              {c}
              {i < contacts.length - 1 ? "   |   " : ""}
            </Text>
          ))}
        </View>
        <View style={s.rule} />

        {/* Summary */}
        {data.about && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Summary</Text>
            <View style={s.thinRule} />
            <Text style={s.entryDesc}>{data.about}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Experience</Text>
            <View style={s.thinRule} />
            {data.experience.map((exp) => {
              const meta = [exp.company, exp.employmentType, exp.location]
                .filter(Boolean)
                .join(" · ");
              return (
                <View key={exp.id} style={s.entry}>
                  <View style={s.entryRow}>
                    <Text style={s.entryTitle}>{exp.role}</Text>
                    <Text style={s.entryDate}>
                      {fmt(exp.startDate)} –{" "}
                      {exp.current ? "Present" : fmt(exp.endDate)}
                    </Text>
                  </View>
                  {meta ? <Text style={s.entryMeta}>{meta}</Text> : null}
                  {exp.description ? (
                    <Text style={s.entryDesc}>{exp.description}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Projects</Text>
            <View style={s.thinRule} />
            {data.projects.map((p) => (
              <View key={p.id} style={s.entry}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>{p.title}</Text>
                  {(p.liveUrl || p.githubUrl) && (
                    <Text style={s.entryDate}>
                      {(p.liveUrl || p.githubUrl)!.replace(
                        /^https?:\/\/(www\.)?/,
                        "",
                      )}
                    </Text>
                  )}
                </View>
                {p.techStack.length > 0 && (
                  <Text style={s.entryMeta}>{p.techStack.join(", ")}</Text>
                )}
                {p.description && (
                  <Text style={s.entryDesc}>{p.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Education</Text>
            <View style={s.thinRule} />
            {data.education.map((edu) => (
              <View key={edu.id} style={s.entry}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>{edu.school}</Text>
                  <Text style={s.entryDate}>
                    {edu.startYear ?? ""}
                    {edu.startYear || (!edu.current && edu.endYear)
                      ? " – "
                      : ""}
                    {edu.current ? "Present" : (edu.endYear ?? "")}
                  </Text>
                </View>
                {edu.degree && (
                  <Text style={s.entryMeta}>
                    {edu.degree}
                    {edu.field ? ` · ${edu.field}` : ""}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {Object.keys(byCategory).length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            <View style={s.thinRule} />
            {Object.entries(byCategory).map(([cat, skills]) => (
              <View key={cat} style={s.skillRow}>
                <Text style={s.skillCat}>{cat}:</Text>
                <Text style={s.skillVal}>{skills.join(", ")}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certificates.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Certifications</Text>
            <View style={s.thinRule} />
            {data.certificates.map((cert) => (
              <Text key={cert.id} style={s.certLine}>
                {cert.title} — {cert.issuer}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
