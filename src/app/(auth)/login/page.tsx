import { Activity, BarChart3, ShieldCheck, Users } from "lucide-react";
import type { Metadata } from "next";
import { Logo } from "@/components/layout/Logo";
import { ServerStatus } from "@/components/shared/ServerStatus";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

const FEATURES = [
  { icon: Users, text: "Manage doctors and their patients in one place" },
  { icon: BarChart3, text: "Live analytics on admissions and workload" },
  { icon: ShieldCheck, text: "Secure, cookie-based authentication" },
];

/** Only allow same-site relative redirects (blocks open redirects like //evil.com). */
function safeRedirect(next: string | string[] | undefined) {
  const value = Array.isArray(next) ? next[0] : next;
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-cyan-300/10 blur-3xl" />

        <Logo inverted />

        <div className="relative space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl leading-tight font-semibold tracking-tight">
              Care, organised.
              <br />
              Insights, instantly.
            </h1>
            <p className="max-w-md text-teal-50/80">
              A focused admin workspace for tracking doctors, their patients and the trends that matter.
            </p>
          </div>
          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-teal-50/90">
                <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-teal-50/60">
          <Activity className="size-3.5" /> Doctor Tracker Admin Portal
        </p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm space-y-8">
          <Logo className="lg:hidden" />

          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Sign in to your admin account to continue.</p>
          </div>

          <LoginForm redirectTo={safeRedirect(next)} />

          <div className="rounded-lg border border-dashed bg-card p-3 text-xs text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">Demo credentials</p>
            <p>
              Email: <span className="font-mono text-foreground">admin@doctortracker.com</span>
            </p>
            <p>
              Password: <span className="font-mono text-foreground">Admin@123</span>
            </p>
          </div>

          <ServerStatus />
        </div>
      </section>
    </main>
  );
}
