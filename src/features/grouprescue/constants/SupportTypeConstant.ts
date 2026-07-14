export type SupportType = "BOAT" | "MEDICAL" | "SEARCH_RESCUE" | "LOGISTICS";

export interface SupportTypeOption {
  value: SupportType;
  label: string;
}

export const SUPPORT_TYPE_OPTIONS: SupportTypeOption[] = [
  { value: "BOAT", label: "Xuồng / Thuyền" },
  { value: "MEDICAL", label: "Y tế" },
  { value: "SEARCH_RESCUE", label: "Tìm kiếm cứu nạn" },
  { value: "LOGISTICS", label: "Hậu cần" },
];

export const getSupportTypeLabel = (value: SupportType | ""): string =>
  SUPPORT_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? "";