import type { Metadata } from "next";
import { Suspense } from "react";
import { DoctorProfileSkeleton } from "@/components/doctors/DoctorProfileCard";
import { DoctorDetailClient } from "./DoctorDetailClient";

export const metadata: Metadata = { title: "Doctor details" };

export default async function DoctorDetailPage({ params }: PageProps<"/doctors/[id]">) {
  const { id } = await params;
  return (
    <Suspense fallback={<DoctorProfileSkeleton />}>
      <DoctorDetailClient id={id} />
    </Suspense>
  );
}
