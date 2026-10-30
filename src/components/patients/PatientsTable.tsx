"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { RowActions } from "@/components/shared/RowActions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, initials } from "@/lib/format";
import type { Patient } from "@/types/patient";
import { ConditionBadge, StatusBadge } from "./PatientBadges";

interface PatientsTableProps {
  data: Patient[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  onRetry: () => void;
  emptyState: ReactNode;
  footer?: ReactNode;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  /** Hide on a doctor's own page. */
  showDoctor?: boolean;
  deleteLabel?: string;
}

export function PatientsTable({
  data,
  isLoading,
  isFetching,
  error,
  onRetry,
  emptyState,
  footer,
  onEdit,
  onDelete,
  showDoctor = true,
  deleteLabel = "Delete",
}: PatientsTableProps) {
  const columns = useMemo<Column<Patient>[]>(() => {
    const cols: Column<Patient>[] = [
      {
        key: "patient",
        header: "Patient",
        cell: (p) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-muted text-xs font-medium">{initials(p.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">{p.name}</p>
              <p className="truncate text-xs text-muted-foreground tabular-nums">{p.phone}</p>
            </div>
          </div>
        ),
      },
      {
        key: "age",
        header: "Age / Gender",
        cell: (p) => (
          <span className="text-sm">
            <span className="tabular-nums">{p.age}</span>
            <span className="text-muted-foreground"> · {p.gender}</span>
          </span>
        ),
        headerClassName: "hidden lg:table-cell",
        className: "hidden lg:table-cell",
      },
      { key: "condition", header: "Condition", cell: (p) => <ConditionBadge condition={p.condition} /> },
      { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    ];
    if (showDoctor) {
      cols.push({
        key: "doctor",
        header: "Doctor",
        cell: (p) => (
          <Link
            href={`/doctors/${p.doctor._id}`}
            className="text-sm hover:text-primary hover:underline"
            onClick={(event) => event.stopPropagation()}
          >
            {p.doctor.name}
          </Link>
        ),
      });
    }
    cols.push(
      {
        key: "admitted",
        header: "Admitted",
        cell: (p) => <span className="text-sm text-muted-foreground">{formatDate(p.admissionDate)}</span>,
        headerClassName: "hidden xl:table-cell",
        className: "hidden xl:table-cell",
      },
      {
        key: "actions",
        header: <span className="sr-only">Actions</span>,
        className: "w-12",
        cell: (p) => (
          <RowActions
            label={p.name}
            actions={[
              { label: "Edit", icon: Pencil, onSelect: () => onEdit(p) },
              { label: deleteLabel, icon: Trash2, destructive: true, onSelect: () => onDelete(p) },
            ]}
          />
        ),
      },
    );
    return cols;
  }, [showDoctor, onEdit, onDelete, deleteLabel]);

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(p) => p._id}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      onRetry={onRetry}
      emptyState={emptyState}
      footer={footer}
      renderMobileCard={(p) => (
        <div className="flex items-start gap-3 px-4 py-3">
          <Avatar className="mt-0.5 size-9">
            <AvatarFallback className="bg-muted text-xs font-medium">{initials(p.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div>
              <p className="truncate font-medium">{p.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {p.age} · {p.gender}
                {showDoctor && <> · {p.doctor.name}</>}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <StatusBadge status={p.status} />
              <ConditionBadge condition={p.condition} />
              <span className="text-[11px] text-muted-foreground">{formatDate(p.admissionDate)}</span>
            </div>
          </div>
          <RowActions
            label={p.name}
            actions={[
              { label: "Edit", icon: Pencil, onSelect: () => onEdit(p) },
              { label: deleteLabel, icon: Trash2, destructive: true, onSelect: () => onDelete(p) },
            ]}
          />
        </div>
      )}
    />
  );
}
