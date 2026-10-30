"use client";

import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { useDoctorOptions } from "@/hooks/useDoctors";
import { CONDITIONS, GENDERS, PATIENT_STATUSES } from "@/lib/constants";
import { SORT_OPTIONS } from "@/lib/searchParams";
import type { PatientSort } from "@/types/patient";

export interface PatientFilterValues {
  condition: string;
  status: string;
  gender: string;
  doctor: string;
  from: string;
  to: string;
  sort: PatientSort;
}

interface PatientFiltersProps {
  values: PatientFilterValues;
  onChange: (patch: Partial<PatientFilterValues> & { page?: number }) => void;
  /** Hide the doctor filter on a doctor's own page. */
  showDoctor?: boolean;
}

export function PatientFilters({ values, onChange, showDoctor = true }: PatientFiltersProps) {
  const { data: doctors } = useDoctorOptions();

  return (
    <>
      <FilterSelect
        allLabel="All conditions"
        ariaLabel="Condition"
        value={values.condition}
        options={CONDITIONS}
        onChange={(condition) => onChange({ condition, page: 1 })}
      />
      <FilterSelect
        allLabel="All statuses"
        ariaLabel="Status"
        value={values.status}
        options={PATIENT_STATUSES}
        onChange={(status) => onChange({ status, page: 1 })}
      />
      <FilterSelect
        allLabel="All genders"
        ariaLabel="Gender"
        value={values.gender}
        options={GENDERS}
        onChange={(gender) => onChange({ gender, page: 1 })}
        className="sm:min-w-32"
      />
      {showDoctor && (
        <FilterSelect
          allLabel="All doctors"
          ariaLabel="Doctor"
          value={values.doctor}
          options={doctors?.map((d) => ({ value: d._id, label: d.name })) ?? []}
          onChange={(doctor) => onChange({ doctor, page: 1 })}
        />
      )}
      <DateRangeFilter
        label="Admitted"
        from={values.from}
        to={values.to}
        onChange={(range) => onChange({ ...range, page: 1 })}
      />
      <FilterSelect
        required
        allLabel="Sort"
        ariaLabel="Sort patients"
        value={values.sort}
        options={SORT_OPTIONS}
        onChange={(sort) => onChange({ sort: sort as PatientSort, page: 1 })}
      />
    </>
  );
}

export const countPatientFilters = (v: Partial<PatientFilterValues>) =>
  [v.condition, v.status, v.gender, v.doctor, v.from || v.to].filter(Boolean).length;
