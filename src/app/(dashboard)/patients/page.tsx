import type { Metadata } from "next";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/shared/States";
import { PatientsClient } from "./PatientsClient";

export const metadata: Metadata = { title: "Patients" };

export default function PatientsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <PatientsClient />
    </Suspense>
  );
}
