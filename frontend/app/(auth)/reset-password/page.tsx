"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormData) => {
    if (!token) {
      setError("Reset link is missing or invalid");
      return;
    }

    try {
      setError("");
      await api.post("/auth/reset-password", {
        token,
        password: values.password,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { error?: { message?: string } } };
      };
      setError(
        e.response?.data?.error?.message ||
          "This reset link is invalid or has expired",
      );
    }
  };

  if (!token) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
        <p className="text-sm text-red-400">
          This reset link is missing or invalid.
        </p>
        <Link
          href="/forgot-password"
          className="mt-4 inline-block text-sm text-indigo-400 hover:text-indigo-300"
        >
          Request a new link →
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-6 text-center">
        <p className="text-sm text-green-400">
          Password reset successfully. Redirecting you to login...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">
          New password
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="Min. 8 characters"
          autoFocus
          className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">
          Confirm new password
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Re-enter your password"
          className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Resetting..." : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image
            src="/logo.png"
            alt="SkillBridge"
            width={36}
            height={22}
            className="mb-3 inline-block h-9 w-auto"
            priority
          />
          <h1 className="text-xl font-semibold text-white">
            Reset your password
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Choose a new password for your account
          </p>
        </div>

        {/* useSearchParams requires a Suspense boundary in App Router */}
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
