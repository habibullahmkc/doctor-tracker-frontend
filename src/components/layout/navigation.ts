import { LayoutDashboard, Stethoscope, Users, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", description: "Overview & analytics", icon: LayoutDashboard },
  { href: "/doctors", label: "Doctors", description: "Manage doctors", icon: Stethoscope },
  { href: "/patients", label: "Patients", description: "Manage patients", icon: Users },
];

export const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

/** Breadcrumb trail for the topbar, e.g. /doctors/123 → Doctors › Details */
export function getBreadcrumbs(pathname: string) {
  const item = NAV_ITEMS.find((nav) => isActivePath(pathname, nav.href));
  if (!item) return [];
  const crumbs = [{ label: item.label, href: item.href }];
  if (pathname !== item.href) crumbs.push({ label: "Details", href: pathname });
  return crumbs;
}
