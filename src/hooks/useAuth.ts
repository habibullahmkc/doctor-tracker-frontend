"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { authService } from "@/services/auth.service";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => (await authService.me()).data,
    staleTime: 5 * 60_000,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      queryClient.clear();
      router.replace("/login");
      router.refresh();
    },
    onSuccess: () => toast.success("Signed out"),
  });
}
