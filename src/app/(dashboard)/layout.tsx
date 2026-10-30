import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { queryKeys } from "@/lib/queryKeys";
import { serverGet } from "@/lib/server-api";
import type { Admin } from "@/types/auth";

/**
 * App shell. The signed-in admin is prefetched here (not in a page) because the
 * topbar renders before any page — so the shell and the page both server-render
 * with the real name instead of a placeholder.
 */
export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const queryClient = new QueryClient();
  const admin = await serverGet<Admin>("/auth/me", 3000);
  if (admin) queryClient.setQueryData(queryKeys.me, admin);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Sidebar />
        <div className="flex min-h-screen flex-col lg:pl-64">
          <Topbar />
          <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </HydrationBoundary>
  );
}
