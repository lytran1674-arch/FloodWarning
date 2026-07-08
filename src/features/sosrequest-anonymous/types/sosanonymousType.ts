export interface CancelAnonymousPayload {
  sodt: string;
  clientDeviceId: string;
}

export interface CancelResponse {
  code: number;
  message: string;
}