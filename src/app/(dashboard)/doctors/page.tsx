import type { Metadata } from "next";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/shared/States";
import { DoctorsClient } from "./DoctorsClient";

export const metadata: Metadata = { title: "Doctors" };

export default function DoctorsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <DoctorsClient />
    </Suspense>
  );
}
