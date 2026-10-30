"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
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
import { useCreateDoctor, useDoctorFilterOptions, useUpdateDoctor } from "@/hooks/useDoctors";
import { SPECIALIZATIONS } from "@/lib/constants";
import { applyServerErrors } from "@/lib/formErrors";
import type { Doctor } from "@/types/doctor";
import { doctorFormSchema, type DoctorFormInput, type DoctorFormValues } from "@/validations/doctor.schema";

interface DoctorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present → edit mode. */
  doctor?: Doctor;
}

export function DoctorFormDialog({ open, onOpenChange, doctor }: DoctorFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{doctor ? "Edit doctor" : "Add a doctor"}</DialogTitle>
          <DialogDescription>
            {doctor ? "Update the doctor's details." : "Register a new doctor. All fields are required."}
          </DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so default values are always fresh. */}
        {open && <DoctorForm doctor={doctor} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

const FIELDS = ["name", "specialization", "hospital", "phone", "email"];

function DoctorForm({ doctor, onDone }: { doctor?: Doctor; onDone: () => void }) {
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const { data: filterOptions } = useDoctorFilterOptions();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<DoctorFormInput, unknown, DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: doctor?.name ?? "",
      specialization: doctor?.specialization,
      hospital: doctor?.hospital ?? "",
      phone: doctor?.phone ?? "",
      email: doctor?.email ?? "",
    },
  });

  const onSubmit = async (values: DoctorFormValues) => {
    try {
      if (doctor) await updateDoctor.mutateAsync({ id: doctor._id, body: values });
      else await createDoctor.mutateAsync(values);
      onDone();
    } catch (error) {
      applyServerErrors(error, setError, FIELDS);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <FormField id="doctor-name" label="Full name" required error={errors.name?.message}>
        <Input {...fieldA11y("doctor-name", errors.name?.message)} placeholder="Dr. Sarah Ahmed" autoFocus {...register("name")} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="doctor-specialization" label="Specialization" required error={errors.specialization?.message}>
          <Controller
            control={control}
            name="specialization"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  {...fieldA11y("doctor-specialization", errors.specialization?.message)}
                  className="w-full"
                  onBlur={field.onBlur}
                  ref={field.ref}
                >
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {SPECIALIZATIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField id="doctor-hospital" label="Hospital" required error={errors.hospital?.message}>
          <Input
            {...fieldA11y("doctor-hospital", errors.hospital?.message)}
            list="hospital-suggestions"
            placeholder="Square Hospital"
            autoComplete="off"
            {...register("hospital")}
          />
          <datalist id="hospital-suggestions">
            {filterOptions?.hospitals.map((h) => <option key={h} value={h} />)}
          </datalist>
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="doctor-phone" label="Phone" required error={errors.phone?.message}>
          <Input {...fieldA11y("doctor-phone", errors.phone?.message)} type="tel" placeholder="+8801712345678" {...register("phone")} />
        </FormField>
        <FormField id="doctor-email" label="Email" required error={errors.email?.message}>
          <Input {...fieldA11y("doctor-email", errors.email?.message)} type="email" placeholder="doctor@hospital.com" {...register("email")} />
        </FormField>
      </div>

      <DialogFooter className="pt-2">
        <Button type="button" variant="outline" onClick={onDone} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || (Boolean(doctor) && !isDirty)}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {doctor ? "Save changes" : "Add doctor"}
        </Button>
      </DialogFooter>
    </form>
  );
}
