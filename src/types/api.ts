export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface Paginated<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
}

export interface FieldError {
  field: string;
  message: string;
}
