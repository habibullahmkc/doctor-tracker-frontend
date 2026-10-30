"use client";

import { ChevronRight, Eye, Pencil, Plus, Stethoscope, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useCallback, useMemo, useState } from "react";
import { DoctorAvatar } from "@/components/doctors/DoctorAvatar";
import { DoctorFormDialog } from "@/components/doctors/DoctorFormDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { FilterToolbar } from "@/components/shared/FilterToolbar";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { RowActions } from "@/components/shared/RowActions";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/States";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteDoctor, useDoctorFilterOptions, useDoctors } from "@/hooks/useDoctors";
import { usePageClamp } from "@/hooks/usePageClamp";
import { SPECIALIZATIONS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { doctorListParsers, listStateOptions, SORT_OPTIONS } from "@/lib/searchParams";
import type { DoctorListItem, DoctorListParams } from "@/types/doctor";

const RESET = { search: "", specialization: "", hospital: "", from: "", to: "", page: 1 };

export function DoctorsClient() {
  const router = useRouter();
  const [q, setQ] = useQueryStates(doctorListParsers, listStateOptions);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DoctorListItem | undefined>();
  const [deleting, setDeleting] = useState<DoctorListItem | undefined>();

  const params = useMemo<DoctorListParams>(
    () => ({
      page: q.page,
      limit: q.limit,
      sort: q.sort,
      search: q.search || undefined,
      specialization: q.specialization || undefined,
      hospital: q.hospital || undefined,
      from: q.from || undefined,
      to: q.to || undefined,
    }),
    [q],
  );

  const { data, isLoading, isFetching, error, refetch } = useDoctors(params);
  const { data: filterOptions } = useDoctorFilterOptions();
  const deleteDoctor = useDeleteDoctor();

  const setPage = useCallback((page: number) => setQ({ page }), [setQ]);
  usePageClamp(q.page, data?.pagination.totalPages, setPage);

  const activeFilters = [q.specialization, q.hospital, q.from || q.to].filter(Boolean).length;
  const hasQuery = activeFilters > 0 || Boolean(q.search);

  const openDetails = useCallback((doctor: DoctorListItem) => router.push(`/doctors/${doctor._id}`), [router]);
  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const columns = useMemo<Column<DoctorListItem>[]>(
    () => [
      {
        key: "doctor",
        header: "Doctor",
        cell: (d) => (
          <div className="flex items-center gap-3">
            <DoctorAvatar name={d.name} />
            <div className="min-w-0">
              <p className="truncate font-medium">{d.name}</p>
              <p className="truncate text-xs text-muted-foreground">{d.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: "specialization",
        header: "Specialization",
        cell: (d) => (
          <Badge variant="outline" className="font-normal">
            {d.specialization}
          </Badge>
        ),
      },
      { key: "hospital", header: "Hospital", cell: (d) => <span className="text-sm">{d.hospital}</span>, className: "max-w-56 truncate" },
      { key: "phone", header: "Phone", cell: (d) => <span className="text-sm text-muted-foreground tabular-nums">{d.phone}</span>, headerClassName: "hidden xl:table-cell", className: "hidden xl:table-cell" },
      {
        key: "patients",
        header: "Patients",
        headerClassName: "text-right",
        className: "text-right",
        cell: (d) => <span className="font-medium tabular-nums">{d.patientCount}</span>,
      },
      { key: "joined", header: "Joined", cell: (d) => <span className="text-sm text-muted-foreground">{formatDate(d.createdAt)}</span>, headerClassName: "hidden lg:table-cell", className: "hidden lg:table-cell" },
      {
        key: "actions",
        header: <span className="sr-only">Actions</span>,
        className: "w-12",
        cell: (d) => (
          <RowActions
            label={d.name}
            actions={[
              { label: "View details", icon: Eye, onSelect: () => openDetails(d) },
              { label: "Edit", icon: Pencil, onSelect: () => { setEditing(d); setFormOpen(true); } },
              { label: "Delete", icon: Trash2, destructive: true, onSelect: () => setDeleting(d) },
            ]}
          />
        ),
      },
    ],
    [openDetails],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        description="Manage registered doctors and their patients."
        actions={
          <Button onClick={openCreate}>
            <Plus />
            Add doctor
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
            placeholder="Search name, hospital, specialization…"
          />
        }
      >
        <FilterSelect
          allLabel="All specializations"
          ariaLabel="Specialization"
          value={q.specialization}
          options={filterOptions?.specializations ?? SPECIALIZATIONS}
          onChange={(specialization) => setQ({ specialization, page: 1 })}
        />
        <FilterSelect
          allLabel="All hospitals"
          ariaLabel="Hospital"
          value={q.hospital}
          options={filterOptions?.hospitals ?? []}
          onChange={(hospital) => setQ({ hospital, page: 1 })}
        />
        <DateRangeFilter label="Joined" from={q.from} to={q.to} onChange={(range) => setQ({ ...range, page: 1 })} />
        <FilterSelect
          required
          allLabel="Sort"
          ariaLabel="Sort doctors"
          value={q.sort}
          options={SORT_OPTIONS}
          onChange={(sort) => setQ({ sort: sort as typeof q.sort, page: 1 })}
        />
      </FilterToolbar>

      <DataTable
        columns={columns}
        data={data?.data}
        getRowId={(d) => d._id}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={() => refetch()}
        onRowClick={openDetails}
        emptyState={
          hasQuery ? (
            <EmptyState
              icon={Stethoscope}
              title="No doctors match your filters"
              description="Try a different search term or clear the filters."
              action={<Button variant="outline" size="sm" onClick={() => setQ(RESET)}>Clear filters</Button>}
            />
          ) : (
            <EmptyState
              icon={Stethoscope}
              title="No doctors yet"
              description="Add your first doctor to start tracking patients."
              action={<Button size="sm" onClick={openCreate}><Plus />Add doctor</Button>}
            />
          )
        }
        renderMobileCard={(d) => (
          <button
            type="button"
            onClick={() => openDetails(d)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-muted/60"
          >
            <DoctorAvatar name={d.name} className="size-10" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{d.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {d.specialization} · {d.hospital}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums">{d.patientCount}</p>
              <p className="text-[11px] text-muted-foreground">patients</p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        )}
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

      <DoctorFormDialog open={formOpen} onOpenChange={setFormOpen} doctor={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        destructive
        title={`Delete ${deleting?.name ?? "doctor"}?`}
        description={
          deleting?.patientCount
            ? `This will also permanently delete their ${deleting.patientCount} patient${deleting.patientCount === 1 ? "" : "s"}. This cannot be undone.`
            : "This doctor has no patients. This cannot be undone."
        }
        confirmLabel="Delete doctor"
        loading={deleteDoctor.isPending}
        onConfirm={() =>
          deleting && deleteDoctor.mutate(deleting._id, { onSuccess: () => setDeleting(undefined) })
        }
      />
    </div>
  );
}
