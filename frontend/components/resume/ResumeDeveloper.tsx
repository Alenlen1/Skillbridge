import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "./ResumeTypes";

const INDIGO = "#6366f1";
const INDIGO_LIGHT = "#818cf8";
const DARK = "#0d0d1a";
const DARK2 = "#16162a";
const SIDEBAR_W = 175;

const s = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: "#111111",
  },

  // ── Sidebar ────────────────────────────────────────────────────────
  sidebar: {
    width: SIDEBAR_W,
    backgroundColor: DARK,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 18,
  },
  sbName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 3,
    lineHeight: 1.3,
  },
  sbHeadline: {
    fontSize: 8,
    color: INDIGO_LIGHT,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.3,
    marginBottom: 12,
    lineHeight: 1.4,
  },
  sbAbout: {
    fontSize: 7.5,
    color: "#9ca3af",
    lineHeight: 1.55,
    marginBottom: 16,
  },
  sbDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#2d2d4a",
    marginBottom: 14,
  },
  sbSection: { marginBottom: 16 },
  sbSectionTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: INDIGO_LIGHT,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 7,
  },
  sbContactItem: {
    fontSize: 7.5,
    color: "#d1d5db",
    marginBottom: 4,
    lineHeight: 1.4,
  },
  sbContactLabel: {
    fontSize: 6.5,
    color: "#6b7280",
    marginBottom: 1,
  },
  sbChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 3 },
  sbChip: {
    fontSize: 7,
    color: "#c7d2fe",
    backgroundColor: "#1e1b4b",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
    marginBottom: 3,
  },
  sbCertTitle: { fontSize: 7.5, color: "#e5e7eb", marginBottom: 1 },
  sbCertIssuer: { fontSize: 7, color: "#6b7280", marginBottom: 5 },

  // ── Main ───────────────────────────────────────────────────────────
  main: { flex: 1, paddingTop: 28, paddingBottom: 28, paddingHorizontal: 22 },
  mainSection: { marginBottom: 15 },
  mainTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: INDIGO,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
  },
  mainRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 9,
  },

  // ── Entry (timeline style for exp/edu) ────────────────────────────
  entry: { marginBottom: 9, paddingLeft: 11, position: "relative" },
  dot: {
    position: "absolute",
    left: 0,
    top: 3,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: INDIGO,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  entryTitle: { fontSize: 9.5, fontFamily: "Helvetica-Bold", flex: 1 },
  entryDate: { fontSize: 8, color: "#777777", marginLeft: 6 },
  entryCompany: { fontSize: 9, color: INDIGO, marginBottom: 1 },
  entryMeta: { fontSize: 8, color: "#888888", marginBottom: 2 },
  entryDesc: { fontSize: 8.5, color: "#444444", lineHeight: 1.55 },

  // ── Project card ──────────────────────────────────────────────────
  projectCard: {
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#e0e7ff",
  },
  projectTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 1,
  },
  projectDesc: {
    fontSize: 8.5,
    color: "#444444",
    lineHeight: 1.5,
    marginBottom: 3,
  },
  techRow: { flexDirection: "row", flexWrap: "wrap", gap: 3, marginBottom: 2 },
  techChip: {
    fontSize: 7.5,
    color: INDIGO,
    backgroundColor: "#eef2ff",
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 2,
  },
  projectUrl: { fontSize: 7.5, color: "#9ca3af" },
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

export default function ResumeDeveloper({ data }: { data: ResumeData }) {
  const linkedin = data.socialLinks.find((l) => l.platform === "LinkedIn");
  const github = data.socialLinks.find((l) => l.platform === "GitHub");

  const byCategory = data.skills.reduce<Record<string, string[]>>((acc, sk) => {
    const c = sk.category || "Other";
    if (!acc[c]) acc[c] = [];
    acc[c].push(sk.name);
    return acc;
  }, {});

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── Sidebar ── */}
        <View style={s.sidebar}>
          <Text style={s.sbName}>{data.name}</Text>
          {data.headline && <Text style={s.sbHeadline}>{data.headline}</Text>}
          {data.about && <Text style={s.sbAbout}>{data.about}</Text>}
          <View style={s.sbDivider} />

          {/* Contact */}
          <View style={s.sbSection}>
            <Text style={s.sbSectionTitle}>Contact</Text>
            {!isPlaceholderEmail(data.email) && (
              <>
                <Text style={s.sbContactLabel}>Email</Text>
                <Text style={s.sbContactItem}>{data.email}</Text>
              </>
            )}
            {data.phone && (
              <>
                <Text style={s.sbContactLabel}>Phone</Text>
                <Text style={s.sbContactItem}>{data.phone}</Text>
              </>
            )}
            {data.location && (
              <>
                <Text style={s.sbContactLabel}>Location</Text>
                <Text style={s.sbContactItem}>{data.location}</Text>
              </>
            )}
            {data.website && (
              <>
                <Text style={s.sbContactLabel}>Website</Text>
                <Text style={s.sbContactItem}>
                  {data.website.replace(/^https?:\/\//, "")}
                </Text>
              </>
            )}
            {github && (
              <>
                <Text style={s.sbContactLabel}>GitHub</Text>
                <Text style={s.sbContactItem}>
                  {github.url.replace(/^https?:\/\/(www\.)?/, "")}
                </Text>
              </>
            )}
            {linkedin && (
              <>
                <Text style={s.sbContactLabel}>LinkedIn</Text>
                <Text style={s.sbContactItem}>
                  {linkedin.url.replace(/^https?:\/\/(www\.)?/, "")}
                </Text>
              </>
            )}
            <Text style={s.sbContactLabel}>Portfolio</Text>
            <Text style={s.sbContactItem}>skillbridge.app/{data.username}</Text>
          </View>

          {/* Skills as chips */}
          {data.skills.length > 0 && (
            <View style={s.sbSection}>
              <Text style={s.sbSectionTitle}>Tech Stack</Text>
              <View style={s.sbChipRow}>
                {data.skills.map((sk) => (
                  <Text key={sk.id} style={s.sbChip}>
                    {sk.name}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Certs */}
          {data.certificates.length > 0 && (
            <View style={s.sbSection}>
              <Text style={s.sbSectionTitle}>Certifications</Text>
              {data.certificates.map((c) => (
                <View key={c.id}>
                  <Text style={s.sbCertTitle}>{c.title}</Text>
                  <Text style={s.sbCertIssuer}>{c.issuer}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── Main ── */}
        <View style={s.main}>
          {/* Experience */}
          {data.experience.length > 0 && (
            <View style={s.mainSection}>
              <Text style={s.mainTitle}>Experience</Text>
              <View style={s.mainRule} />
              {data.experience.map((exp) => {
                const meta = [exp.employmentType, exp.location]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <View key={exp.id} style={s.entry}>
                    <View style={s.dot} />
                    <View style={s.entryRow}>
                      <Text style={s.entryTitle}>{exp.role}</Text>
                      <Text style={s.entryDate}>
                        {fmt(exp.startDate)} –{" "}
                        {exp.current ? "Present" : fmt(exp.endDate)}
                      </Text>
                    </View>
                    <Text style={s.entryCompany}>{exp.company}</Text>
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
            <View style={s.mainSection}>
              <Text style={s.mainTitle}>Projects</Text>
              <View style={s.mainRule} />
              {data.projects.map((p) => (
                <View key={p.id} style={s.projectCard}>
                  <Text style={s.projectTitle}>{p.title}</Text>
                  {p.description && (
                    <Text style={s.projectDesc}>{p.description}</Text>
                  )}
                  {p.techStack.length > 0 && (
                    <View style={s.techRow}>
                      {p.techStack.map((t) => (
                        <Text key={t} style={s.techChip}>
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

          {/* Education */}
          {data.education.length > 0 && (
            <View style={s.mainSection}>
              <Text style={s.mainTitle}>Education</Text>
              <View style={s.mainRule} />
              {data.education.map((edu) => (
                <View key={edu.id} style={s.entry}>
                  <View style={s.dot} />
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

          {/* Skills by category */}
          {Object.keys(byCategory).length > 0 && (
            <View style={s.mainSection}>
              <Text style={s.mainTitle}>Skills</Text>
              <View style={s.mainRule} />
              {Object.entries(byCategory).map(([cat, skills]) => (
                <View key={cat} style={{ marginBottom: 6 }}>
                  <Text
                    style={[
                      s.entryMeta,
                      { fontFamily: "Helvetica-Bold", marginBottom: 3 },
                    ]}
                  >
                    {cat}
                  </Text>
                  <View style={s.techRow}>
                    {skills.map((sk) => (
                      <Text key={sk} style={s.techChip}>
                        {sk}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
