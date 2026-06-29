"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IconCheck, IconX } from "@tabler/icons-react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/auth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification link is missing or invalid");
      return;
    }

    api
      .get(`/auth/verify-email?token=${token}`)
      .then(({ data }) => {
        // New accounts: the backend creates the user and logs them in,
        // returning accessToken + user. Existing-user verification (the
        // resend flow) just returns a plain success message instead.
        if (data?.data?.accessToken && data?.data?.user) {
          setAuth(data.data.user, data.data.accessToken);
          setStatus("success");
          setTimeout(() => router.push("/portfolio"), 1500);
        } else {
          setStatus("success");
        }
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.error?.message ||
            "This verification link is invalid or has expired",
        );
      });
  }, [token]);

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
        <p className="mt-4 text-sm text-slate-400">Verifying your email...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
          <IconCheck size={20} stroke={2} className="text-green-400" />
        </div>
        <p className="text-sm font-medium text-white">Your account is ready!</p>
        <p className="mt-1 text-sm text-slate-400">
          Taking you to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
        <IconX size={20} stroke={2} className="text-red-400" />
      </div>
      <p className="text-sm font-medium text-white">Verification failed</p>
      <p className="mt-1 text-sm text-slate-400">{message}</p>
      <Link
        href="/register"
        className="mt-4 inline-block text-sm text-indigo-400 hover:text-indigo-300"
      >
        Back to sign up →
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image
            src="/logo.png"
            alt="SkillBridge"
            width={36}
            height={22}
            className="h-9 w-auto"
            priority
          />
          <h1 className="text-xl font-semibold text-white">
            Email Verification
          </h1>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
