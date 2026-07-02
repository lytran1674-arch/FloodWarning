// src/features/support-request/api/supportRequestApi.ts
import { axiosClient } from "@/api/axiosClient";
import type {
  CreateSupportRequestPayload,
  CreateSupportRequestResponse,
} from "../types/provinceType";

export const createSupportRequest = async (
  payload: CreateSupportRequestPayload
): Promise<CreateSupportRequestResponse> => {
  const { data } = await axiosClient.post<CreateSupportRequestResponse>(
    "/support-request",
    payload
  );
  return data;
};