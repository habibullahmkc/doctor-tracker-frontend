import { Users } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/States";

export const metadata: Metadata = { title: "Patients" };

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Patients" description="All patients across doctors." />
      <div className="rounded-xl border bg-card">
        <EmptyState icon={Users} title="Patients list" description="The patients table is built in Phase 4." />
      </div>
    </div>
  );
}
