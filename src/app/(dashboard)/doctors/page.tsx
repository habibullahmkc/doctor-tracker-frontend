import { Stethoscope } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/States";

export const metadata: Metadata = { title: "Doctors" };

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Doctors" description="Manage all registered doctors." />
      <div className="rounded-xl border bg-card">
        <EmptyState icon={Stethoscope} title="Doctors list" description="The doctors table is built in Phase 4." />
      </div>
    </div>
  );
}
