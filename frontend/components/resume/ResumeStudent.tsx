import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "./ResumeTypes";



const INDIGO = "#6366f1";
const INDIGO_PALE = "#eef2ff";

const s = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: "#111111",
    lineHeight: 1.4,
  },

  // ── Header ──────────────────────────────────────────────────────────
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.3,
    lineHeight: 1.1,
    marginBottom: 6,
  },
  headline: {
    fontSize: 11,
    color: INDIGO,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.2,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 8.5,
    color: "#555555",
    gap: 0,
    marginBottom: 2,
  },
  contactItem: { marginRight: 0 },
  contactSep: { color: "#aaaaaa", marginHorizontal: 6 },

  // ── Divider ──────────────────────────────────────────────────────────
  rule: {
    borderBottomWidth: 2,
    borderBottomColor: INDIGO,
    marginTop: 12,
    marginBottom: 14,
  },
  thinRule: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    marginBottom: 9,
  },

  // ── Sections ─────────────────────────────────────────────────────────
  section: { marginBottom: 13 },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    color: INDIGO,
    marginBottom: 5,
  },

  // ── Entries with left accent border ──────────────────────────────────
  entry: {
    marginBottom: 8,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: INDIGO_PALE,
  },
  entryActiveLeft: {
    borderLeftColor: INDIGO,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  entryTitle: { fontSize: 9.5, fontFamily: "Helvetica-Bold", flex: 1 },
  entryDate: { fontSize: 8.5, color: "#777777", marginLeft: 8 },
  entryMeta: { fontSize: 8.5, color: "#555555", marginBottom: 2 },
  entryDesc: { fontSize: 9, color: "#333333", lineHeight: 1.55 },

  // ── Projects ─────────────────────────────────────────────────────────
  projectTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 1,
  },
  projectDesc: {
    fontSize: 9,
    color: "#333333",
    lineHeight: 1.5,
    marginBottom: 3,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 3, marginBottom: 2 },
  tag: {
    fontSize: 7.5,
    color: INDIGO,
    backgroundColor: INDIGO_PALE,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  projectUrl: { fontSize: 8, color: "#9ca3af" },

  // ── Skills ────────────────────────────────────────────────────────────
  skillChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  skillChip: {
    fontSize: 8.5,
    color: "#374151",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 3,
    marginBottom: 3,
  },

  // ── Certs ─────────────────────────────────────────────────────────────
  certRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  certChip: {
    fontSize: 8,
    color: "#444444",
    backgroundColor: "#f9fafb",
    borderWidth: 0.5,
    borderColor: "#d1d5db",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 3,
    marginBottom: 3,
  },
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

export default function ResumeStudent({ data }: { data: ResumeData }) {
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
            <View key={i} style={{ flexDirection: "row" }}>
              {i > 0 && <Text style={s.contactSep}>·</Text>}
              <Text style={s.contactItem}>{c}</Text>
            </View>
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

        {/* Education — first for students */}
        {data.education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Education</Text>
            <View style={s.thinRule} />
            {data.education.map((edu) => (
              <View
                key={edu.id}
                style={[s.entry, edu.current ? s.entryActiveLeft : {}]}
              >
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
                <View
                  key={exp.id}
                  style={[s.entry, exp.current ? s.entryActiveLeft : {}]}
                >
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
              <View
                key={p.id}
                style={[s.entry, { borderLeftColor: "#c7d2fe" }]}
              >
                <Text style={s.projectTitle}>{p.title}</Text>
                {p.description && (
                  <Text style={s.projectDesc}>{p.description}</Text>
                )}
                {p.techStack.length > 0 && (
                  <View style={s.tagRow}>
                    {p.techStack.map((t) => (
                      <Text key={t} style={s.tag}>
                        {t}
                      </Text>
                    ))}
                  </View>
                )}
                {(p.githubUrl || p.liveUrl) && (
                  <Text style={s.projectUrl}>
                    {[p.githubUrl, p.liveUrl].filter(Boolean).join("  ·  ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            <View style={s.thinRule} />
            <View style={s.skillChipRow}>
              {data.skills.map((sk) => (
                <Text key={sk.id} style={s.skillChip}>
                  {sk.name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Certifications */}
        {data.certificates.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Certifications</Text>
            <View style={s.thinRule} />
            <View style={s.certRow}>
              {data.certificates.map((c) => (
                <Text key={c.id} style={s.certChip}>
                  {c.title} — {c.issuer}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
