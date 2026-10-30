import { z } from "zod";
import { CONDITIONS, GENDERS, PATIENT_STATUSES } from "@/lib/constants";
import { toYMD } from "@/lib/format";
import { phoneRule } from "./doctor.schema";

export const patientFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  age: z.coerce
    .number<string | number>("Enter an age")
    .int("Age must be a whole number")
    .min(0, "Age cannot be negative")
    .max(120, "Age must be 120 or less"),
  gender: z.enum(GENDERS, "Select a gender"),
  phone: phoneRule,
  email: z.union([z.literal(""), z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address"))]),
  condition: z.enum(CONDITIONS, "Select a condition"),
  status: z.enum(PATIENT_STATUSES, "Select a status"),
  admissionDate: z
    .string()
    .min(1, "Select the admission date")
    .refine((value) => value <= toYMD(new Date()), "Admission date cannot be in the future"),
  doctor: z.string().min(1, "Select a doctor"),
  notes: z.string().trim().max(500, "Notes must be 500 characters or less"),
});

export type PatientFormInput = z.input<typeof patientFormSchema>;
export type PatientFormValues = z.output<typeof patientFormSchema>;
