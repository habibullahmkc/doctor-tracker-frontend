import { api, toQueryString } from "@/lib/api";
import type { ApiResponse, Paginated } from "@/types/api";
import type {
  Doctor,
  DoctorDetail,
  DoctorFilterOptions,
  DoctorInput,
  DoctorListItem,
  DoctorListParams,
  DoctorOption,
} from "@/types/doctor";
import type { Patient, PatientInput, PatientListParams } from "@/types/patient";

const json = (body: unknown) => JSON.stringify(body);

export const doctorsService = {
  list: (params: DoctorListParams) => api<Paginated<DoctorListItem>>(`/doctors${toQueryString({ ...params })}`),
  get: (id: string) => api<ApiResponse<DoctorDetail>>(`/doctors/${id}`),
  filters: () => api<ApiResponse<DoctorFilterOptions>>("/doctors/filters"),
  options: () => api<ApiResponse<DoctorOption[]>>("/doctors/options"),
  create: (body: DoctorInput) => api<ApiResponse<Doctor>>("/doctors", { method: "POST", body: json(body) }),
  update: (id: string, body: Partial<DoctorInput>) =>
    api<ApiResponse<Doctor>>(`/doctors/${id}`, { method: "PATCH", body: json(body) }),
  remove: (id: string) =>
    api<ApiResponse<{ deletedPatients: number }>>(`/doctors/${id}`, { method: "DELETE" }),
  patients: (id: string, params: PatientListParams) =>
    api<Paginated<Patient>>(`/doctors/${id}/patients${toQueryString({ ...params })}`),
  addPatient: (id: string, body: Omit<PatientInput, "doctor">) =>
    api<ApiResponse<Patient>>(`/doctors/${id}/patients`, { method: "POST", body: json(body) }),
};
