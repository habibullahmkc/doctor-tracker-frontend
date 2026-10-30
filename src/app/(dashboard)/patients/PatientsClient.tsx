"use client";

import { Plus, Users } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useCallback, useMemo, useState } from "react";
import { countPatientFilters, PatientFilters } from "@/components/patients/PatientFilters";
import { PatientFormDialog } from "@/components/patients/PatientFormDialog";
import { PatientsTable } from "@/components/patients/PatientsTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { FilterToolbar } from "@/components/shared/FilterToolbar";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/States";
import { Button } from "@/components/ui/button";
import { usePageClamp } from "@/hooks/usePageClamp";
import { useDeletePatient, usePatients } from "@/hooks/usePatients";
import { listStateOptions, patientListParsers } from "@/lib/searchParams";
import type { Patient, PatientListParams } from "@/types/patient";

const RESET = { search: "", condition: "", status: "", gender: "", doctor: "", from: "", to: "", page: 1 };

export function PatientsClient() {
  const [q, setQ] = useQueryStates(patientListParsers, listStateOptions);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | undefined>();
  const [deleting, setDeleting] = useState<Patient | undefined>();

  const params = useMemo<PatientListParams>(
    () => ({
      page: q.page,
      limit: q.limit,
      sort: q.sort,
      search: q.search || undefined,
      condition: q.condition || undefined,
      status: q.status || undefined,
      gender: q.gender || undefined,
      doctor: q.doctor || undefined,
      from: q.from || undefined,
      to: q.to || undefined,
    }),
    [q],
  );

  const { data, isLoading, isFetching, error, refetch } = usePatients(params);
  const deletePatient = useDeletePatient();

  const setPage = useCallback((page: number) => setQ({ page }), [setQ]);
  usePageClamp(q.page, data?.pagination.totalPages, setPage);

  const activeFilters = countPatientFilters(q);
  const hasQuery = activeFilters > 0 || Boolean(q.search);

  const onEdit = useCallback((patient: Patient) => {
    setEditing(patient);
    setFormOpen(true);
  }, []);
  const onDelete = useCallback((patient: Patient) => setDeleting(patient), []);
  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="All patients across doctors — search, filter and manage care status."
        actions={
          <Button onClick={openCreate}>
            <Plus />
            Add patient
          </Button>
        }
      />

      <FilterToolbar
        activeCount={activeFilters}
        onReset={() => setQ(RESET)}
        search={
          <SearchInput
            value={q.search}
            onChange={(search) => setQ({ search, page: 1 })}
            placeholder="Search name, phone or email…"
          />
        }
      >
        <PatientFilters values={q} onChange={setQ} />
      </FilterToolbar>

      <PatientsTable
        data={data?.data}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={() => refetch()}
        onEdit={onEdit}
        onDelete={onDelete}
        emptyState={
          hasQuery ? (
            <EmptyState
              icon={Users}
              title="No patients match your filters"
              description="Try a different search term or clear the filters."
              action={<Button variant="outline" size="sm" onClick={() => setQ(RESET)}>Clear filters</Button>}
            />
          ) : (
            <EmptyState
              icon={Users}
              title="No patients yet"
              description="Patients you add will appear here."
              action={<Button size="sm" onClick={openCreate}><Plus />Add patient</Button>}
            />
          )
        }
        footer={
          data && (
            <Pagination
              page={q.page}
              totalPages={data.pagination.totalPages}
              total={data.pagination.total}
              limit={q.limit}
              onPageChange={setPage}
              onLimitChange={(limit) => setQ({ limit, page: 1 })}
            />
          )
        }
      />

      <PatientFormDialog open={formOpen} onOpenChange={setFormOpen} patient={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        destructive
        title={`Delete ${deleting?.name ?? "patient"}?`}
        description="This permanently removes the patient and their record. This cannot be undone."
        confirmLabel="Delete patient"
        loading={deletePatient.isPending}
        onConfirm={() =>
          deleting && deletePatient.mutate(deleting._id, { onSuccess: () => setDeleting(undefined) })
        }
      />
    </div>
  );
}
