export interface ApiResponse<T> {
  status?: number;
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    total?: number;
    total_items?: number;
    page?: number;
    page_size?: number;
  };
}
