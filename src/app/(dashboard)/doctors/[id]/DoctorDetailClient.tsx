"use client";

import { ArrowLeft, Plus, SearchX, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DoctorFormDialog } from "@/components/doctors/DoctorFormDialog";
import { DoctorProfileCard, DoctorProfileSkeleton } from "@/components/doctors/DoctorProfileCard";
import { countPatientFilters, PatientFilters } from "@/components/patients/PatientFilters";
import { PatientFormDialog } from "@/components/patients/PatientFormDialog";
import { PatientsTable } from "@/components/patients/PatientsTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { FilterToolbar } from "@/components/shared/FilterToolbar";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState, ErrorState } from "@/components/shared/States";
import { Button } from "@/components/ui/button";
import { useDeleteDoctor, useDoctor, useDoctorPatients } from "@/hooks/useDoctors";
import { usePageClamp } from "@/hooks/usePageClamp";
import { useDeletePatient } from "@/hooks/usePatients";
import { ApiError } from "@/lib/api";
import { APP_NAME } from "@/lib/constants";
import { listStateOptions, patientListParsers } from "@/lib/searchParams";
import type { Patient, PatientListParams } from "@/types/patient";

const RESET = { search: "", condition: "", status: "", gender: "", from: "", to: "", page: 1 };

function BackLink() {
  return (
    <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
      <Link href="/doctors">
        <ArrowLeft />
        Back to doctors
      </Link>
    </Button>
  );
}

export function DoctorDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [q, setQ] = useQueryStates(patientListParsers, listStateOptions);
  const [editDoctorOpen, setEditDoctorOpen] = useState(false);
  const [deleteDoctorOpen, setDeleteDoctorOpen] = useState(false);
  const [patientFormOpen, setPatientFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();
  const [removingPatient, setRemovingPatient] = useState<Patient | undefined>();

  const doctorQuery = useDoctor(id);
  const doctor = doctorQuery.data;

  // Tab title with the doctor's name once loaded.
  useEffect(() => {
    if (doctor) document.title = `${doctor.name} · ${APP_NAME}`;
  }, [doctor]);

  const params = useMemo<PatientListParams>(
    () => ({
      page: q.page,
      limit: q.limit,
      sort: q.sort,
      search: q.search || undefined,
      condition: q.condition || undefined,
      status: q.status || undefined,
      gender: q.gender || undefined,
      from: q.from || undefined,
      to: q.to || undefined,
    }),
    [q],
  );
  const patientsQuery = useDoctorPatients(id, params);
  const deleteDoctor = useDeleteDoctor();
  const deletePatient = useDeletePatient();

  const setPage = useCallback((page: number) => setQ({ page }), [setQ]);
  usePageClamp(q.page, patientsQuery.data?.pagination.totalPages, setPage);

  const onEdit = useCallback((patient: Patient) => {
    setEditingPatient(patient);
    setPatientFormOpen(true);
  }, []);
  const onRemove = useCallback((patient: Patient) => setRemovingPatient(patient), []);
  const openAddPatient = () => {
    setEditingPatient(undefined);
    setPatientFormOpen(true);
  };

  if (doctorQuery.error && !doctor) {
    const notFound = doctorQuery.error instanceof ApiError && [400, 404].includes(doctorQuery.error.status);
    return (
      <div className="space-y-4">
        <BackLink />
        <div className="rounded-xl border bg-card">
          {notFound ? (
            <EmptyState
              icon={SearchX}
              title="Doctor not found"
              description="This doctor may have been deleted, or the link is incorrect."
              action={<Button asChild size="sm"><Link href="/doctors">View all doctors</Link></Button>}
            />
          ) : (
            <ErrorState message={doctorQuery.error.message} onRetry={() => doctorQuery.refetch()} />
          )}
        </div>
      </div>
    );
  }

  const activeFilters = countPatientFilters(q);
  const hasQuery = activeFilters > 0 || Boolean(q.search);

  return (
    <div className="space-y-6">
      <BackLink />

      {doctor ? (
        <DoctorProfileCard
          doctor={doctor}
          onEdit={() => setEditDoctorOpen(true)}
          onDelete={() => setDeleteDoctorOpen(true)}
        />
      ) : (
        <DoctorProfileSkeleton />
      )}

      <section aria-labelledby="doctor-patients-heading" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="doctor-patients-heading" className="text-lg font-semibold tracking-tight">
              Patients
            </h2>
            <p className="text-sm text-muted-foreground">
              {doctor ? `Patients under the care of ${doctor.name}.` : "Loading…"}
            </p>
          </div>
          <Button onClick={openAddPatient} disabled={!doctor}>
            <Plus />
            Add patient
          </Button>
        </div>

        <FilterToolbar
          activeCount={activeFilters}
          onReset={() => setQ(RESET)}
          search={
            <SearchInput
              value={q.search}
              onChange={(search) => setQ({ search, page: 1 })}
              placeholder="Search this doctor's patients…"
            />
          }
        >
          <PatientFilters values={q} onChange={setQ} showDoctor={false} />
        </FilterToolbar>

        <PatientsTable
          showDoctor={false}
          deleteLabel="Remove"
          data={patientsQuery.data?.data}
          isLoading={patientsQuery.isLoading}
          isFetching={patientsQuery.isFetching}
          error={patientsQuery.error}
          onRetry={() => patientsQuery.refetch()}
          onEdit={onEdit}
          onDelete={onRemove}
          emptyState={
            hasQuery ? (
              <EmptyState
                icon={Users}
                title="No patients match your filters"
                action={<Button variant="outline" size="sm" onClick={() => setQ(RESET)}>Clear filters</Button>}
              />
            ) : (
              <EmptyState
                icon={Users}
                title="No patients yet"
                description="Add the first patient under this doctor."
                action={<Button size="sm" onClick={openAddPatient} disabled={!doctor}><Plus />Add patient</Button>}
              />
            )
          }
          footer={
            patientsQuery.data && (
              <Pagination
                page={q.page}
                totalPages={patientsQuery.data.pagination.totalPages}
                total={patientsQuery.data.pagination.total}
                limit={q.limit}
                onPageChange={setPage}
                onLimitChange={(limit) => setQ({ limit, page: 1 })}
              />
            )
          }
        />
      </section>

      {doctor && (
        <>
          <DoctorFormDialog open={editDoctorOpen} onOpenChange={setEditDoctorOpen} doctor={doctor} />
          <PatientFormDialog
            open={patientFormOpen}
            onOpenChange={setPatientFormOpen}
            patient={editingPatient}
            doctor={editingPatient ? undefined : { _id: doctor._id, name: doctor.name }}
          />
          <ConfirmDialog
            open={deleteDoctorOpen}
            onOpenChange={setDeleteDoctorOpen}
            destructive
            title={`Delete ${doctor.name}?`}
            description={
              doctor.patientCount
                ? `This will also permanently delete their ${doctor.patientCount} patient${doctor.patientCount === 1 ? "" : "s"}. This cannot be undone.`
                : "This doctor has no patients. This cannot be undone."
            }
            confirmLabel="Delete doctor"
            loading={deleteDoctor.isPending}
            onConfirm={() => deleteDoctor.mutate(doctor._id, { onSuccess: () => router.replace("/doctors") })}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(removingPatient)}
        onOpenChange={(open) => !open && setRemovingPatient(undefined)}
        destructive
        title={`Remove ${removingPatient?.name ?? "patient"}?`}
        description={`This removes the patient from ${doctor?.name ?? "this doctor"}'s list and deletes their record. This cannot be undone.`}
        confirmLabel="Remove patient"
        loading={deletePatient.isPending}
        onConfirm={() =>
          removingPatient &&
          deletePatient.mutate(removingPatient._id, { onSuccess: () => setRemovingPatient(undefined) })
        }
      />
    </div>
  );
}
