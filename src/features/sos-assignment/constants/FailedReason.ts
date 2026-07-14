
export type FailedReason="BOAT_BROKEN" | "VEHICLE_BROKEN" |"LOST_CONTACT" | "CANNOT_ACCESS" | "OTHER";

export type GroupStatusAfterFail = "OFFLINE" | "AVAILABLE";

export interface FailedReasonOption{
    value:FailedReason
    label:string
    resultingGroupStatus:GroupStatusAfterFail
    requiredNote?:boolean

}
export const FAILEDREASONOPTIONS :FailedReasonOption[]=[
    {
        value:"BOAT_BROKEN",
        label:"Xuồng hỏng",
        resultingGroupStatus:"OFFLINE",
    },
    {
        value:"VEHICLE_BROKEN",
        label:"Phương tiện hỏng",
        resultingGroupStatus:"OFFLINE",
    },
    {
        value:"LOST_CONTACT",
        label:"Mất liên lạc ",
        resultingGroupStatus:"OFFLINE",
    },
    {
        value:"CANNOT_ACCESS",
        label:"Không thể tiếp cận hiện trường",
        resultingGroupStatus:"AVAILABLE",
    },
    {
        value:"OTHER",
        label:"Lý do khác",
        resultingGroupStatus:"AVAILABLE",
    },
];

export const getFailedReasonOption=(
    reason:FailedReason
):FailedReasonOption | undefined=>
    FAILEDREASONOPTIONS.find((r)=>r.value===reason)