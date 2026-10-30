import { Activity, BarChart3, HeartPulse, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { BrandMark, BrandWordmark } from "@/components/layout/BrandMark";
import { ServerStatus } from "@/components/shared/ServerStatus";
import { safeRedirect } from "@/lib/redirect";
import { cn } from "@/lib/utils";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

const FEATURES: { icon: LucideIcon; title: string; text: string; tone: string }[] = [
  { icon: Users, title: "Manage doctors and their patients", text: "Keep everything in one place", tone: "bg-teal-50 text-teal-700" },
  { icon: BarChart3, title: "Live analytics on admissions and workload", text: "Make better decisions with real-time data", tone: "bg-blue-50 text-blue-700" },
  { icon: ShieldCheck, title: "Secure, cookie-based authentication", text: "Your data, our priority", tone: "bg-violet-50 text-violet-700" },
];

function MedicalCross({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("pointer-events-none absolute", className)} aria-hidden>
      <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" fill="currentColor" />
    </svg>
  );
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;

  return (
    <main className="grid h-dvh overflow-hidden bg-[#f6f9fe] lg:grid-cols-[1.12fr_1fr]">
      {/* ---------- Brand panel ---------- */}
      <section className="relative hidden overflow-hidden bg-[#f7fafe] lg:block">
        <div className="absolute inset-y-0 right-0 w-[44%] 2xl:w-[52%]">
          <Image
            src="/login-doctor.jpg"
            alt="A doctor with a tablet walking down a bright hospital corridor"
            fill
            priority
            sizes="(min-width: 1024px) 30vw, 0px"
            className="object-cover object-[78%_center] 2xl:object-[60%_center]"
          />
          {/* blend the photo into the copy */}
          <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#f7fafe] via-[#f7fafe]/60 to-transparent 2xl:w-1/3" />
        </div>
        {/* soft wave under the copy, continuing the photo's bottom wave */}
        <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full" aria-hidden>
          <path d="M0 60 C180 20 360 120 560 110 C680 104 760 80 800 70 L800 200 L0 200 Z" fill="#dbeafe" opacity="0.7" />
          <path d="M0 120 C200 90 380 170 600 160 C700 156 760 140 800 132 L800 200 L0 200 Z" fill="#c7ddfa" opacity="0.6" />
        </svg>

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14 [@media(max-height:760px)]:p-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <BrandMark className="size-14" />
              <BrandWordmark className="text-4xl" />
            </div>
            <p className="pl-[68px] text-sm text-slate-600">
              Better Doctors <span className="px-1.5 text-slate-300">|</span> Better Care{" "}
              <span className="px-1.5 text-slate-300">|</span> Healthier Tomorrow
            </p>
          </div>

          <div className="max-w-md space-y-8 [@media(max-height:760px)]:space-y-5">
            <div className="space-y-4">
              <h1 className="text-5xl leading-[1.08] font-bold tracking-tight [@media(max-height:760px)]:text-4xl">
                <span className="text-[#0f2a5f]">Care, organised.</span>
                <br />
                <span className="bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent">
                  Insights, instantly.
                </span>
              </h1>
              <p className="text-lg leading-relaxed text-slate-600">
                A focused admin workspace for tracking doctors, their patients and the trends that matter.
              </p>
            </div>
            <ul className="space-y-5">
              {FEATURES.map(({ icon: Icon, title, text, tone }) => (
                <li key={title} className="flex items-center gap-4">
                  <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-xs", tone)}>
                    <Icon className="size-6" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-slate-800">{title}</span>
                    <span className="block text-sm text-slate-600">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="flex items-center gap-2 text-sm text-slate-600">
            <Activity className="size-4 text-blue-700" /> Doctor Tracker Admin Portal
          </p>
        </div>
      </section>

      {/* ---------- Sign-in panel ---------- */}
      <section className="relative flex h-dvh flex-col overflow-hidden px-5 py-5 sm:px-10">
        <MedicalCross className="top-40 -right-6 hidden size-24 text-blue-100 sm:block" />
        <svg viewBox="0 0 120 40" className="pointer-events-none absolute right-8 bottom-10 w-28 text-teal-300 [@media(max-height:760px)]:hidden" aria-hidden>
          <path d="M0 24 H40 L48 8 L58 36 L66 16 L72 24 H120" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <p className="hidden items-center justify-end gap-2 text-sm text-slate-600 sm:flex">
          <HeartPulse className="size-5 text-blue-700" />
          Healthcare <span aria-hidden>•</span> Data <span aria-hidden>•</span> People
        </p>

        <div className="flex min-h-0 flex-1 items-center justify-center py-4">
          <div className="relative w-full max-w-[460px] rounded-3xl border border-white bg-white/90 p-6 shadow-[0_20px_60px_-20px_rgba(15,42,95,0.18)] backdrop-blur sm:p-10 [@media(max-height:760px)]:p-6">
            <div className="flex items-center gap-2.5">
              <BrandMark className="size-11" />
              <BrandWordmark className="text-2xl" />
            </div>

            <div className="mt-5 mb-6 space-y-1.5 [@media(max-height:760px)]:mt-4 [@media(max-height:760px)]:mb-4">
              <h2 className="text-3xl font-bold tracking-tight text-[#0f2a5f]">Welcome back</h2>
              <p className="text-[15px] text-slate-600">Sign in to your admin account to continue.</p>
            </div>

            <LoginForm redirectTo={safeRedirect(next)} />

            <div className="mt-6 border-t border-dashed border-slate-200 pt-5 [@media(max-height:760px)]:mt-4 [@media(max-height:760px)]:pt-4">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-xs">
                  <ShieldCheck className="size-5" />
                </span>
                <div className="text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">Demo credentials</p>
                  <p>
                    Email: <span className="font-medium text-slate-800">admin@doctortracker.com</span>
                  </p>
                  <p>
                    Password: <span className="font-medium text-slate-800">Admin@123</span>
                  </p>
                </div>
              </div>
            </div>

            <ServerStatus className="mt-5" />
          </div>
        </div>
      </section>
    </main>
  );
}
