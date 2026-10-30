import type { Condition, PatientStatus, Specialization } from "@/lib/constants";

export type StatsRange = "7d" | "30d" | "12m";

export interface NameValue<T extends string = string> {
  name: T;
  value: number;
}

export interface DashboardStats {
  range: StatsRange;
  totals: {
    doctors: number;
    patients: number;
    activePatients: number;
    avgPatientsPerDoctor: number;
    newThisMonth: number;
    newLastMonth: number;
  };
  /** `date` is "YYYY-MM-DD" (7d/30d) or "YYYY-MM" (12m), zero-filled. */
  admissions: { date: string; count: number }[];
  patientsPerDoctor: { doctorId: string; name: string; specialization: Specialization; patients: number }[];
  byCondition: NameValue<Condition>[];
  byStatus: NameValue<PatientStatus>[];
  bySpecialization: NameValue<Specialization>[];
  recentPatients: {
    _id: string;
    name: string;
    condition: Condition;
    status: PatientStatus;
    admissionDate: string;
    doctor: { _id: string; name: string };
  }[];
}
