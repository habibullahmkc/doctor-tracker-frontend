import type { StatsRange } from "@/types/dashboard";
import type { DoctorListParams } from "@/types/doctor";
import type { PatientListParams } from "@/types/patient";

/**
 * Hierarchical query keys: invalidating a prefix (e.g. `queryKeys.doctors.all`)
 * refreshes every list/detail beneath it.
 */
export const queryKeys = {
  me: ["me"] as const,
  doctors: {
    all: ["doctors"] as const,
    lists: () => [...queryKeys.doctors.all, "list"] as const,
    list: (params: DoctorListParams) => [...queryKeys.doctors.lists(), params] as const,
    detail: (id: string) => [...queryKeys.doctors.all, "detail", id] as const,
    patients: (id: string, params: PatientListParams) => [...queryKeys.doctors.all, "patients", id, params] as const,
    filters: () => [...queryKeys.doctors.all, "filters"] as const,
    options: () => [...queryKeys.doctors.all, "options"] as const,
  },
  patients: {
    all: ["patients"] as const,
    list: (params: PatientListParams) => [...queryKeys.patients.all, "list", params] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    stats: (range: StatsRange) => [...queryKeys.dashboard.all, range] as const,
  },
};
