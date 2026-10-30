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

