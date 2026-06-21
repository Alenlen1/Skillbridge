"use client";

import { useState } from "react";
import { IconMail, IconX } from "@tabler/icons-react";
import { useAuthStore } from "@/lib/auth";
import api from "@/lib/api";

export default function EmailVerificationBanner() {
  const { user } = useAuthStore();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Don't show anything if the user is verified or already dismissed it
  // for this session.
  if (!user || user.emailVerified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    try {
      setSending(true);
      await api.post("/auth/resend-verification");
      setSent(true);
    } catch {
      // Silently fail — the banner stays visible so they can try again
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <IconMail
          size={18}
          stroke={1.5}
          className="flex-shrink-0 text-amber-400"
        />
        <p className="text-sm text-amber-200">
          {sent
            ? "Verification email sent — check your inbox"
            : "Verify your email to make your portfolio public"}
        </p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-3">
        {!sent && (
          <button
            onClick={handleResend}
            disabled={sending}
            className="text-xs font-medium text-amber-300 underline hover:text-amber-200 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Resend email"}
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-400/60 hover:text-amber-300"
        >
          <IconX size={15} stroke={1.5} />
        </button>
      </div>
    </div>
  );
}
