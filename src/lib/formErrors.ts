import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { ApiError } from "./api";

/**
 * Maps a failed API call onto the form: field-level validation errors go
 * under their inputs, a 409 duplicate goes under the conflicting field,
 * anything else becomes a toast.
 */
export function applyServerErrors<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>, fields: string[]) {
  if (error instanceof ApiError) {
    const fieldErrors = (error.errors ?? []).filter((e) => fields.includes(e.field));
    if (fieldErrors.length) {
      fieldErrors.forEach((e, i) =>
        setError(e.field as Path<T>, { type: "server", message: e.message }, { shouldFocus: i === 0 }),
      );
      return;
    }
    if (error.status === 409) {
      const field = fields.find((f) => error.message.toLowerCase().startsWith(f.toLowerCase()));
      if (field) {
        setError(field as Path<T>, { type: "server", message: `This ${field} is already in use` }, { shouldFocus: true });
        return;
      }
    }
    toast.error(error.message);
    return;
  }
  toast.error("Something went wrong. Please try again.");
}
