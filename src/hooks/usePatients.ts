"use client";

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { patientsService } from "@/services/patients.service";
import type { PatientInput, PatientListParams } from "@/types/patient";
import { toastError, useInvalidateClinicalData } from "./useMutationHelpers";

export function usePatients(params: PatientListParams) {
  return useQuery({
    queryKey: queryKeys.patients.list(params),
    queryFn: () => patientsService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreatePatient() {
  const invalidate = useInvalidateClinicalData();
  return useMutation({
    mutationFn: (body: PatientInput) => patientsService.create(body),
    onSuccess: ({ data }) => {
      toast.success(`${data.name} added`);
      return invalidate();
    },
  });
}

export function useUpdatePatient() {
  const invalidate = useInvalidateClinicalData();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<PatientInput> }) => patientsService.update(id, body),
    onSuccess: ({ data }) => {
      toast.success(`${data.name} updated`);
      return invalidate();
    },
  });
}

export function useDeletePatient() {
  const invalidate = useInvalidateClinicalData();
  return useMutation({
    mutationFn: (id: string) => patientsService.remove(id),
    onSuccess: () => {
      toast.success("Patient deleted");
      return invalidate();
    },
    onError: toastError,
  });
}
