"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IconMailCheck } from "@tabler/icons-react";
import api from "@/lib/api";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and privacy policy",
  }),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormData) => {
    try {
      setError("");
      await api.post("/auth/register", values);
      setSubmittedEmail(values.email);
      setRegistered(true);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { error?: { message?: string } } };
      };
      setError(e.response?.data?.error?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-3 inline-flex h-16 items-center justify-center transition hover:opacity-80"
          >
            <Image
              src="/logo.png"
              alt="SkillBridge"
              width={36}
              height={22}
              className="h-9 w-auto"
              priority
            />
          </Link>
          {!registered && (
            <>
              <h1 className="text-xl font-semibold text-white">
                Create your account
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>

        {registered ? (
          /* Check your email confirmation screen */
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <IconMailCheck
                size={22}
                stroke={1.5}
                className="text-indigo-400"
              />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Check your email
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              We sent a confirmation link to{" "}
              <span className="text-slate-200">{submittedEmail}</span>. Click it
              to finish creating your account.
            </p>
            <p className="mt-4 text-xs text-slate-600">
              Didn&apos;t get it? Check your spam folder, or{" "}
              <button
                onClick={() => setRegistered(false)}
                className="text-indigo-400 underline hover:text-indigo-300"
              >
                try again
              </button>
              .
            </p>
          </div>
        ) : (
          /* Registration form */
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Full name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Alen Amarante"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="alen@example.com"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Username
                </label>
                <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 transition focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                  <span className="text-sm text-slate-600">
                    skillbridge.app/
                  </span>
                  <input
                    {...register("username")}
                    type="text"
                    placeholder="alen"
                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Min. 8 characters"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Global error */}
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Sending confirmation..." : "Create account"}
              </button>

              {/* Agreement */}
              <div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreed"
                    {...register("agreed")}
                    className="mt-0.5 rounded border-white/10 bg-white/[0.05]"
                  />
                  <label
                    htmlFor="agreed"
                    className="text-xs leading-relaxed text-slate-500"
                  >
                    I agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      className="text-slate-300 underline transition hover:text-white"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      className="text-slate-300 underline transition hover:text-white"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.agreed && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.agreed.message}
                  </p>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
