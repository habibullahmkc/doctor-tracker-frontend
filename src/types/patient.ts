import type { Condition, Gender, PatientStatus, Specialization } from "@/lib/constants";

export interface PatientDoctorRef {
  _id: string;
  name: string;
  specialization: Specialization;
  hospital: string;
}

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email: string;
  condition: Condition;
  status: PatientStatus;
  admissionDate: string;
  notes: string;
  doctor: PatientDoctorRef;
  createdAt: string;
  updatedAt: string;
}

export type PatientSort = "newest" | "oldest" | "name";

export interface PatientListParams {
  page?: number;
  limit?: number;
  search?: string;
  condition?: string;
  status?: string;
  gender?: string;
  doctor?: string;
  from?: string;
  to?: string;
  sort?: PatientSort;
}

export interface PatientInput {
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email?: string;
  condition: Condition;
  status: PatientStatus;
  admissionDate: string;
  notes?: string;
  doctor: string;
}
