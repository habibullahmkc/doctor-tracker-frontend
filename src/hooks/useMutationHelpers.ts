"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

/** Doctors, patients and dashboard figures all depend on each other — refresh them together. */
export function useInvalidateClinicalData() {
  const queryClient = useQueryClient();
  return useCallback(
    () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.patients.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
      ]),
    [queryClient],
  );
}

export const toastError = (error: unknown) =>
  toast.error(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
