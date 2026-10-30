"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { Controller, useForm, type Control, type FieldPath } from "react-hook-form";
import { FormField, fieldA11y } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAddPatientToDoctor, useDoctorOptions } from "@/hooks/useDoctors";
import { useCreatePatient, useUpdatePatient } from "@/hooks/usePatients";
import { CONDITIONS, GENDERS, PATIENT_STATUSES } from "@/lib/constants";
import { applyServerErrors } from "@/lib/formErrors";
import { toYMD } from "@/lib/format";
import type { Patient } from "@/types/patient";
import { patientFormSchema, type PatientFormInput, type PatientFormValues } from "@/validations/patient.schema";

interface PatientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present → edit mode. */
  patient?: Patient;
  /** Create under this doctor (doctor field is fixed). */
  doctor?: { _id: string; name: string };
}

export function PatientFormDialog({ open, onOpenChange, patient, doctor }: PatientFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{patient ? "Edit patient" : doctor ? `Add patient to ${doctor.name}` : "Add a patient"}</DialogTitle>
          <DialogDescription>
            {patient ? "Update the patient's details and care status." : "Fields marked * are required."}
          </DialogDescription>
        </DialogHeader>
        {open && <PatientForm patient={patient} doctor={doctor} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

const FIELDS = ["name", "age", "gender", "phone", "email", "condition", "status", "admissionDate", "doctor", "notes"];

function SelectField({
  control,
  name,
  id,
  options,
  placeholder,
  error,
  disabled,
}: {
  control: Control<PatientFormInput, unknown, PatientFormValues>;
  name: FieldPath<PatientFormInput>;
  id: string;
  options: readonly { value: string; label: string }[];
  placeholder: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select value={(field.value as string) || undefined} onValueChange={field.onChange} disabled={disabled}>
          <SelectTrigger {...fieldA11y(id, error)} className="w-full" onBlur={field.onBlur} ref={field.ref}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent position="popper" className="max-h-72">
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

const asOptions = (values: readonly string[]) => values.map((v) => ({ value: v, label: v }));

function PatientForm({
  patient,
  doctor,
  onDone,
}: {
  patient?: Patient;
  doctor?: { _id: string; name: string };
  onDone: () => void;
}) {
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const addToDoctor = useAddPatientToDoctor(doctor?._id ?? "");
  const { data: doctorOptions, isLoading: doctorsLoading } = useDoctorOptions();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PatientFormInput, unknown, PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: patient?.name ?? "",
      age: patient?.age ?? "",
      gender: patient?.gender,
      phone: patient?.phone ?? "",
      email: patient?.email ?? "",
      condition: patient?.condition,
      status: patient?.status ?? "Admitted",
      admissionDate: patient ? toYMD(parseISO(patient.admissionDate)) : toYMD(new Date()),
      doctor: patient?.doctor._id ?? doctor?._id ?? "",
      notes: patient?.notes ?? "",
    },
  });

  const onSubmit = async (values: PatientFormValues) => {
    try {
      if (patient) {
        await updatePatient.mutateAsync({ id: patient._id, body: values });
      } else if (doctor) {
        // The doctor comes from the URL on this endpoint, so it is not sent in the body.
        const body: Omit<PatientFormValues, "doctor"> & { doctor?: string } = { ...values };
        delete body.doctor;
        await addToDoctor.mutateAsync(body);
      } else {
        await createPatient.mutateAsync(values);
      }
      onDone();
    } catch (error) {
      applyServerErrors(error, setError, FIELDS);
    }
  };

  const doctorSelectOptions =
    doctorOptions?.map((d) => ({ value: d._id, label: `${d.name} · ${d.specialization}` })) ??
    (patient ? [{ value: patient.doctor._id, label: patient.doctor.name }] : []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
        <FormField id="patient-name" label="Full name" required error={errors.name?.message}>
          <Input {...fieldA11y("patient-name", errors.name?.message)} placeholder="Fatema Akter" autoFocus {...register("name")} />
        </FormField>
        <FormField id="patient-age" label="Age" required error={errors.age?.message}>
          <Input {...fieldA11y("patient-age", errors.age?.message)} type="number" inputMode="numeric" min={0} max={120} {...register("age")} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="patient-gender" label="Gender" required error={errors.gender?.message}>
          <SelectField control={control} name="gender" id="patient-gender" options={asOptions(GENDERS)} placeholder="Select…" error={errors.gender?.message} />
        </FormField>
        <FormField id="patient-phone" label="Phone" required error={errors.phone?.message}>
          <Input {...fieldA11y("patient-phone", errors.phone?.message)} type="tel" placeholder="+8801712345678" {...register("phone")} />
        </FormField>
      </div>

      <FormField id="patient-email" label="Email" hint="Optional" error={errors.email?.message}>
        <Input {...fieldA11y("patient-email", errors.email?.message)} type="email" placeholder="patient@email.com" {...register("email")} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="patient-condition" label="Condition" required error={errors.condition?.message}>
          <SelectField control={control} name="condition" id="patient-condition" options={asOptions(CONDITIONS)} placeholder="Select…" error={errors.condition?.message} />
        </FormField>
        <FormField id="patient-status" label="Status" required error={errors.status?.message}>
          <SelectField control={control} name="status" id="patient-status" options={asOptions(PATIENT_STATUSES)} placeholder="Select…" error={errors.status?.message} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="patient-admission" label="Admission date" required error={errors.admissionDate?.message}>
          <Input {...fieldA11y("patient-admission", errors.admissionDate?.message)} type="date" max={toYMD(new Date())} {...register("admissionDate")} />
        </FormField>
        <FormField
          id="patient-doctor"
          label="Doctor"
          required
          error={errors.doctor?.message}
          hint={doctor ? "Fixed for this doctor" : undefined}
        >
          {doctor ? (
            <Input id="patient-doctor" value={doctor.name} disabled readOnly />
          ) : (
            <SelectField
              control={control}
              name="doctor"
              id="patient-doctor"
              options={doctorSelectOptions}
              placeholder={doctorsLoading ? "Loading doctors…" : "Select a doctor"}
              error={errors.doctor?.message}
            />
          )}
        </FormField>
      </div>

      <FormField id="patient-notes" label="Notes" hint="Optional, up to 500 characters" error={errors.notes?.message}>
        <Textarea {...fieldA11y("patient-notes", errors.notes?.message)} rows={3} placeholder="Allergies, follow-up instructions…" {...register("notes")} />
      </FormField>

      <DialogFooter className="pt-2">
        <Button type="button" variant="outline" onClick={onDone} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || (Boolean(patient) && !isDirty)}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {patient ? "Save changes" : "Add patient"}
        </Button>
      </DialogFooter>
    </form>
  );
}
