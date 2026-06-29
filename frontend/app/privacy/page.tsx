import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mb-10 text-sm text-slate-500">
            Last updated: June 2026
          </p>

          <div className="space-y-8 text-sm leading-relaxed text-slate-400">
            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                1. Information we collect
              </h2>
              <p>
                We collect information you provide directly to us when you
                create an account, such as your name, email address, username,
                and password. We also collect content you add to your portfolio
                including projects, skills, education, experience, and
                certificates. If you connect your GitHub account, we collect
                your GitHub profile and repository data.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                2. How We Use Your Information
              </h2>

              <p>
                We use the information we collect to operate and improve
                SkillBridge, provide customer support, personalize your
                experience, display your portfolio, and deliver platform
                features.
              </p>

              <p className="mt-4">
                When you use the AI Assistant, relevant information such as your
                resume, portfolio content, skills, experience, education,
                certificates, projects, and any job descriptions or prompts you
                provide may be securely sent to Google's Gemini API to generate
                AI features such as Resume Review, Portfolio Review, Skill Gap
                Analysis, Cover Letter Generation, Career Roadmap
                recommendations, and Interview Preparation. Only the information
                required to process your request is shared.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                3. AI Assistant and third-party services
              </h2>
              <p>
                SkillBridge uses Google Gemini AI to power the AI Assistant
                features including Resume Review, Portfolio Review, Skill Gap
                Analysis, Cover Letter Generator, Career Roadmap, and Interview
                Prep. When you use these features, relevant data is sent to
                Google&apos;s API for processing. We do not store AI-generated
                results permanently. Please review Google&apos;s privacy policy
                at privacy.google.com for more information on how they handle
                your data.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                4. Information sharing
              </h2>
              <p>
                We do not sell your personal information to third parties. Your
                public portfolio is visible to anyone with your portfolio link.
                You can set your portfolio to private at any time from your
                dashboard settings. Even when private, you can always view your
                own portfolio when logged in.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                5. Data security
              </h2>
              <p>
                We use industry-standard security measures including encrypted
                passwords, secure HTTPS connections, and JWT authentication to
                protect your account. However, no method of transmission over
                the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                6. Cookies and local storage
              </h2>
              <p>
                We use local storage to keep you logged in and remember your
                session. Your authentication token is stored locally in your
                browser. You can clear this at any time by logging out or
                clearing your browser data.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                7. Your rights
              </h2>
              <p>
                You have the right to access, update, or delete your account
                information at any time through your dashboard. You may also
                change your portfolio visibility between public and private
                whenever you choose. If you wish to permanently delete your
                account and associated personal data, you may do so through your
                account settings.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                8. Open source license
              </h2>
              <p>
                SkillBridge is licensed under the Apache License, Version 2.0.
                Copyright 2026 Alen Andrei R. Amarante. You may obtain a copy of
                the license at{" "}
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
                9. Contact
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at skillbridge.support.team@gmail.com
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
              width={52}
              height={32}
              className="h-8 w-auto opacity-70"
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