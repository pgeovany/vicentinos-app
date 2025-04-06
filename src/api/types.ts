export interface ApiError {
  message: string;
  statusCode: number;
}

export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}
