import type { GROUPTYPE } from "@/features/rescue/types/rescueType"


export type FailedReasonOption="BOAT_BROKEN" | "VEHICLE_BROKEN" |"LOST_CONTACT" | "CANNOT_ACCESS" | "OTHER"

export interface AssignCandidateGroup {
  id: string
  name: string
  type: GROUPTYPE
  status: string
  memberCount: number
  leaderId: string
  leaderName: string
  callFailed : boolean
}

export interface CallTask {
  callTaskId: string
  targetUserId: string
  targetUserName: string
  phoneNumber: string
  targetType: "GROUP_LEADER" | string
  timeoutSeconds: number
  retryCount: number
  status: "CALLING_GROUP_LEADER" | "FAILED" | string
}

export interface AssignRespone {
  code: number
  result: {
    assignmentId: string
    callTask: CallTask
  }
}