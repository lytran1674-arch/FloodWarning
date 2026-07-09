  // features/sos/types/groupType.ts

  export type GroupStatus = "AVAILABLE" | "BUSY" | "UNAVAILABLE" | string;


//OPERATIONAL: Nhóm thực thi nhiệm vụ
//HOTLINE:nhóm trực hotline
  export interface Group {
    id: string;
    name: string;
    teamId: string;
    teamName: string;
    status: GroupStatus;
    hasBoat: boolean;
    hasMedical: boolean;
    hasSearchRescue:boolean
    hasLogistics:boolean
    notes: string;

  }

  export interface PageInfo {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }

  export interface GroupListResult {
    content: Group[];
    page: PageInfo;
  }

  export interface GroupListResponse {
    code: number;
    result: GroupListResult;
  }