import Link from "next/link";
import { IconSparkles } from "@tabler/icons-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] font-sans text-white antialiased">
      {/* Nav - matches landing page */}
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
                including projects, skills, education, and experience.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                2. How we use your information
              </h2>
              <p>
                We use the information we collect to operate and improve
                SkillBridge, provide customer support, send you updates about
                your account, and display your public portfolio to visitors.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                3. Information sharing
              </h2>
              <p>
                We do not sell your personal information to third parties. Your
                public portfolio is visible to anyone with your portfolio link.
                You can set your portfolio to private at any time from your
                dashboard settings.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                4. Data security
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
                5. Cookies
              </h2>
              <p>
                We use cookies to keep you logged in and remember your
                preferences. You can disable cookies in your browser settings,
                but some features of SkillBridge may not work correctly.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                6. Your rights
              </h2>
              <p>
                You can access, update, or delete your account information at
                any time from your dashboard. To permanently delete your account
                and all associated data, contact us at support@skillbridge.app.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-white">
                7. Contact
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at support@skillbridge.app.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer - matches landing page */}
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
