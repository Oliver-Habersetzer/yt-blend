export interface Error {
  message: string;
  domain: string;
  reason: string;
  location: string;
  locationType: string;
}

export interface ErrorWrapper {
  code: number;
  message: string;
  errors: Error[];
  status: string;
}

export default interface ErrorResponse {
  error: ErrorWrapper;
}
