"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import api from "@/lib/api";

function GitHubCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.push("/login?github=error");
      return;
    }

    // Store the token first so the API call can use it
    localStorage.setItem("accessToken", token);

    // Fetch the user's profile using the new token
    api
      .get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        setAuth(data.data, token);
        router.push("/portfolio");
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        router.push("/login?github=error");
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f]">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
      <p className="mt-4 text-sm text-slate-400">
        Signing you in with GitHub...
      </p>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
          <p className="mt-4 text-sm text-slate-400">
            Signing you in with GitHub...
          </p>
        </div>
      }
    >
      <GitHubCallbackContent />
    </Suspense>
  );
}
