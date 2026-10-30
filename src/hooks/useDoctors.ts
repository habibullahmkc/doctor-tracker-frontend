"use client";

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { doctorsService } from "@/services/doctors.service";
import type { DoctorInput, DoctorListParams } from "@/types/doctor";
import type { PatientInput, PatientListParams } from "@/types/patient";
import { toastError, useInvalidateClinicalData } from "./useMutationHelpers";

export function useDoctors(params: DoctorListParams) {
  return useQuery({
    queryKey: queryKeys.doctors.list(params),
    queryFn: () => doctorsService.list(params),
    placeholderData: keepPreviousData, // keep the old page visible while the next one loads
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: queryKeys.doctors.detail(id),
    queryFn: async () => (await doctorsService.get(id)).data,
    enabled: Boolean(id),
  });
}

export function useDoctorPatients(id: string, params: PatientListParams) {
  return useQuery({
    queryKey: queryKeys.doctors.patients(id, params),
    queryFn: () => doctorsService.patients(id, params),
    placeholderData: keepPreviousData,
    enabled: Boolean(id),
  });
}

export function useDoctorFilterOptions() {
  return useQuery({
    queryKey: queryKeys.doctors.filters(),
    queryFn: async () => (await doctorsService.filters()).data,
    staleTime: 5 * 60_000,
  });
}

export function useDoctorOptions() {
  return useQuery({
    queryKey: queryKeys.doctors.options(),
    queryFn: async () => (await doctorsService.options()).data,
    staleTime: 5 * 60_000,
  });
}

export function useCreateDoctor() {
  const invalidate = useInvalidateClinicalData();
  return useMutation({
    mutationFn: (body: DoctorInput) => doctorsService.create(body),
    onSuccess: ({ data }) => {
      toast.success(`${data.name} added`);
      return invalidate();
    },
  });
}

export function useUpdateDoctor() {
  const invalidate = useInvalidateClinicalData();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<DoctorInput> }) => doctorsService.update(id, body),
    onSuccess: ({ data }) => {
      toast.success(`${data.name} updated`);
      return invalidate();
    },
  });
}

export function useDeleteDoctor() {
  const invalidate = useInvalidateClinicalData();
  return useMutation({
    mutationFn: (id: string) => doctorsService.remove(id),
    onSuccess: ({ data }) => {
      toast.success(
        data.deletedPatients
          ? `Doctor deleted along with ${data.deletedPatients} patient${data.deletedPatients === 1 ? "" : "s"}`
          : "Doctor deleted",
      );
      return invalidate();
    },
    onError: toastError,
  });
}

export function useAddPatientToDoctor(doctorId: string) {
  const invalidate = useInvalidateClinicalData();
  return useMutation({
    mutationFn: (body: Omit<PatientInput, "doctor">) => doctorsService.addPatient(doctorId, body),
    onSuccess: ({ data }) => {
      toast.success(`${data.name} added`);
      return invalidate();
    },
  });
}
