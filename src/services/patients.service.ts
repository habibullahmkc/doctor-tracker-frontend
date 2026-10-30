import { api, toQueryString } from "@/lib/api";
import type { ApiResponse, Paginated } from "@/types/api";
import type { Patient, PatientInput, PatientListParams } from "@/types/patient";

const json = (body: unknown) => JSON.stringify(body);

export const patientsService = {
  list: (params: PatientListParams) => api<Paginated<Patient>>(`/patients${toQueryString({ ...params })}`),
  get: (id: string) => api<ApiResponse<Patient>>(`/patients/${id}`),
  create: (body: PatientInput) => api<ApiResponse<Patient>>("/patients", { method: "POST", body: json(body) }),
  update: (id: string, body: Partial<PatientInput>) =>
    api<ApiResponse<Patient>>(`/patients/${id}`, { method: "PATCH", body: json(body) }),
  remove: (id: string) => api<{ success: true }>(`/patients/${id}`, { method: "DELETE" }),
};
