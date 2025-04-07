interface IApiError {
  message: string;
  statusCode: number;
}

export class ApiError extends Error implements IApiError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}
