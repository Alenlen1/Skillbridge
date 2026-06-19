export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <a
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to SkillBridge
        </a>

        <h1 className="mb-2 text-3xl font-semibold text-white">
          Terms of Service
        </h1>
        <p className="mb-10 text-sm text-slate-500">Last updated: June 2026</p>

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
              and password. You must provide accurate information when creating
              your account. You may not use another person&apos;s account
              without permission.
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
              5. Public portfolios
            </h2>
            <p>
              By default, your portfolio is public and visible to anyone with
              your portfolio URL. You can make your portfolio private at any
              time from your dashboard settings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-white">
              6. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate
              these terms. You can delete your account at any time by contacting
              us at support@skillbridge.app.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-white">
              7. Disclaimer
            </h2>
            <p>
              SkillBridge is provided as-is without warranties of any kind. We
              are not responsible for any damages arising from your use of the
              platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-white">
              8. Contact
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at
              support@skillbridge.app.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
