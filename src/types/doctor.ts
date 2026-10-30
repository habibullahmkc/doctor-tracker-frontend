import type { PatientStatus, Specialization } from "@/lib/constants";

export interface Doctor {
  _id: string;
  name: string;
  specialization: Specialization;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorListItem extends Doctor {
  patientCount: number;
}

export interface DoctorDetail extends Doctor {
  patientCount: number;
  patientsByStatus: Partial<Record<PatientStatus, number>>;
}

export interface DoctorOption {
  _id: string;
  name: string;
  specialization: Specialization;
  hospital: string;
}

export interface DoctorFilterOptions {
  specializations: Specialization[];
  hospitals: string[];
}

export type DoctorSort = "newest" | "oldest" | "name";

export interface DoctorListParams {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  hospital?: string;
  from?: string;
  to?: string;
  sort?: DoctorSort;
}

export type DoctorInput = Pick<Doctor, "name" | "specialization" | "hospital" | "phone" | "email">;
