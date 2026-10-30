// The full app shell (sidebar, topbar, mobile nav) is built in Phase 3.
export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return <div className="min-h-screen">{children}</div>;
}
