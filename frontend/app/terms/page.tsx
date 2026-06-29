import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] font-sans text-white antialiased">
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
        </div>
      </header>

      <main className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="mb-10 text-sm text-slate-500">
            Last updated: June 2026
          </p>

          <div className="space-y-8 text-sm leading-relaxed text-slate-400">
            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                1. Acceptance of terms
              </h2>
              <p>
                By creating an account and using SkillBridge, you agree to these
                Terms of Service. If you do not agree, please do not use the
                platform.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                2. Your account
              </h2>
              <p>
                You are responsible for maintaining the security of your account
                and password. You must provide accurate information when
                creating your account. You may not use another person&apos;s
                account without permission.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                3. Acceptable use
              </h2>
              <p>
                You agree not to use SkillBridge to post false or misleading
                information, violate any applicable laws, attempt to gain
                unauthorized access to other accounts, or interfere with the
                platform&apos;s operation.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                4. Your content
              </h2>
              <p>
                You own the content you post on SkillBridge. By posting content,
                you grant us a license to display it as part of the service. You
                are responsible for ensuring your content does not violate any
                third-party rights.
              </p>
            </section>
            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                5. Intellectual Property
              </h2>
              <p>
                The SkillBridge name, logo, and platform design are the
                intellectual property of the project creators. Users retain
                ownership of the content they upload, including resumes,
                portfolios, projects, and certificates.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                6. AI Assistant
              </h2>
              <p>
                SkillBridge includes an AI Assistant powered by Google Gemini
                AI. By using these features, you agree that your portfolio data,
                resume content, and job descriptions may be sent to
                Google&apos;s API for processing. AI-generated content may
                contain inaccuracies or outdated information. Users are
                responsible for reviewing and verifying all AI-generated content
                before using it for employment, education, or professional
                purposes. SkillBridge does not guarantee the accuracy or
                completeness of AI-generated results. You are solely responsible
                for how you use AI-generated content.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                7. Public portfolios
              </h2>
              <p>
                You control the visibility of your portfolio. You may choose to
                make it public or private through your account settings. Public
                portfolios can be viewed by anyone with the portfolio URL.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                8. Termination
              </h2>
              <p>
                We may suspend or terminate accounts involved in spam, abuse,
                illegal activities, impersonation, or violations of these Terms
                of Service.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                9. Disclaimer
              </h2>
              <p>
                SkillBridge is provided as-is without warranties of any kind. We
                are not responsible for any damages arising from your use of the
                platform, including any reliance on AI-generated content.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                10. Open source license
              </h2>
              <p>
                The SkillBridge source code is licensed under the Apache License
                2.0. This license applies only to the source code and does not
                grant ownership of user-generated content., Version 2.0.
                Copyright 2026 Alen Andrei R. Amarante. A copy of the license is
                available at{" "}
                <a
                  href="https://www.apache.org/licenses/LICENSE-2.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 transition hover:text-indigo-300"
                >
                  apache.org/licenses/LICENSE-2.0
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                11. Contact
              </h2>
              <p>
                If you have any questions about these Terms, please contact us
                at support@skillbridge.app.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.04] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <div className="flex items-center gap-2 text-slate-500">
            <Image
              src="/logo.png"
              alt="SkillBridge"
              width={36}
              height={22}
              className="h-9 w-auto opacity-70"
            />
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