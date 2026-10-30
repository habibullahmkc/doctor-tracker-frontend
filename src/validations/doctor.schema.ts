import { z } from "zod";
import { SPECIALIZATIONS } from "@/lib/constants";

// Mirrors the backend rules so most errors are caught before a request is sent.
export const phoneRule = z
  .string()
  .trim()
  .regex(/^\+?[0-9][0-9\s-]{6,19}$/, "Enter a valid phone number, e.g. +8801712345678");

export const doctorFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  specialization: z.enum(SPECIALIZATIONS, "Select a specialization"),
  hospital: z.string().trim().min(2, "Hospital must be at least 2 characters").max(150),
  phone: phoneRule,
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address")),
});

export type DoctorFormInput = z.input<typeof doctorFormSchema>;
export type DoctorFormValues = z.output<typeof doctorFormSchema>;
