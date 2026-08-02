import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MoreVertical,
  Ship,
  Cross,
  LifeBuoy,
  Truck,
  Users2,
  Crown,
  Pen,
  Trash,
} from "lucide-react";
import { Popconfirm } from "antd";
import { IoRemove } from "react-icons/io5";
import { toast } from "react-toastify";
import { useGroup } from "../hooks/useGroup";
import { rescueApi } from "../api/rescureApi";
import { useAppSelector } from "@/hooks/redux.hooks";

// Nhãn hiển thị cho GroupStatus — cập nhật lại khi biết đủ giá trị enum thật
const STATUS_LABEL: Record<string, { text: string; style: string }> = {
  BUSY: { text: "Đang thực hiện nhiệm vụ", style: "bg-amber-50 text-amber-700" },
  AVAILABLE: { text: "Sẵn sàng", style: "bg-emerald-50 text-emerald-700" },
  OFFLINE: { text: "Ngừng hoạt động", style: "bg-gray-100 text-gray-500" },
};

const TYPE_LABEL: Record<string, string> = {
  OPERATIONAL: "Nhóm tác chiến",
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 py-2 text-sm">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-right text-gray-900">{value}</span>
    </div>
  );
}

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { detailgroup: group, detailLoading, detailGroup, error } = useGroup();
  const navigate=useNavigate();

  const handleQuayLai=async()=>{
    navigate(-1);
  }

  // Chỉ leaderTeam (trưởng đội) mới được giải tán nhóm, loại thành viên
  // khỏi nhóm và đặt trưởng nhóm mới.
  const user = useAppSelector((state) => state.auth.user);
  const isLeaderTeam = user?.isTeamLeader === true;

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // userId của thành viên đang có action chạy (loại khỏi nhóm hoặc đặt trưởng nhóm),
  // dùng để disable/hiện loading đúng dòng đó thôi, không khóa cả danh sách.
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (groupId) {
      detailGroup(groupId);
    }
  }, [groupId, detailGroup]);

  // Loại thành viên khỏi nhóm (gộp từ GroupMembersPage)
  const handleRemoveMember = async (member: { userId: string; fullName: string }) => {
    if (!groupId) return;
    if (!isLeaderTeam) {
      toast.error("Chỉ trưởng đội mới được loại thành viên khỏi nhóm.");
      return;
    }

    try {
      setProcessingUserId(member.userId);
      setOpenMenuId(null);
      await rescueApi.removeMemberGroup(groupId, member.userId);

      toast.success("Đã loại thành viên khỏi nhóm.");
      await detailGroup(groupId);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Không thể loại thành viên.");
    } finally {
      setProcessingUserId(null);
    }
  };

  // Đặt trưởng nhóm mới (gộp từ GroupMembersPage). Sau khi đổi thành công,
  // trưởng nhóm cũ trở thành thành viên thường và có thể bị loại như bình thường.
  const handleSetLeader = async (member: { userId: string; fullName: string }) => {
    if (!groupId) return;
    if (!isLeaderTeam) {
      toast.error("Chỉ trưởng đội mới được đặt trưởng nhóm mới.");
      return;
    }

    try {
      setProcessingUserId(member.userId);
      setOpenMenuId(null);
      await rescueApi.pickLeaderGroup(groupId, { userId: member.userId });

      toast.success(`Đã đặt ${member.fullName} làm trưởng nhóm.`);
      await detailGroup(groupId);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Không thể đặt làm trưởng nhóm.");
    } finally {
      setProcessingUserId(null);
    }
  };

  const statusInfo = group
    ? STATUS_LABEL[group.status] ?? { text: group.status, style: "bg-gray-100 text-gray-500" }
    : null;

  const tags = useMemo(() => {
    if (!group) return [];
    return [
      group.hasBoat && { icon: Ship, label: "Xuồng", color: "text-blue-500" },
      group.hasMedical && { icon: Cross, label: "Y tế", color: "text-rose-500" },
      group.hasSearchRescue && { icon: LifeBuoy, label: "Tìm kiếm cứu nạn", color: "text-amber-500" },
      group.hasLogistics && { icon: Truck, label: "Hậu cần", color: "text-violet-500" },
    ].filter(Boolean) as { icon: typeof Ship; label: string; color: string }[];
  }, [group]);

  if (detailLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-400">
        Đang tải chi tiết nhóm...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-rose-600">
        {error}
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-400">
        Không có dữ liệu nhóm.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 text-sm">
            <button type="button" aria-label="Quay lại" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-4 w-4" onClick={handleQuayLai} />
            </button>
            <span className="text-gray-400">{group.teamName}</span>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-900">Chi tiết nhóm</span>
          </div>

          {isLeaderTeam && (
            <div className="flex justify-end items-center lg:gap-3">
             
              <div className="flex justify-start items-center gap-1 lg:p-2 border bg-blue-600  rounded-md">
              <Pen className="text-white"/>
                  <button
                    type="button"
                    className=" text-xs lg:text-sm font-medium text-white "
                  >
                   Cập nhật 
                  </button>
                  </div>
                   <div className="flex justify-start items-center gap-1 lg:p-2 border bg-red-200  rounded-md">
                   <Trash className="text-red-600"/>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className=" text-xs text-red-600 font-medium lg:text-sm"
                  >
                    Giải tán nhóm
                  </button>
            </div>
            
            </div>
          )}
        </div>

        {/* Header card */}
        <div className="mx-6 flex flex-col gap-4 rounded-xl border border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50">
              <Users2 className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900">{group.name}</h1>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo!.style}`}>
                  {statusInfo!.text}
                </span>
              </div>

              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                  {tags.map(({ icon: Icon, label, color }) => (
                    <span key={label} className="flex items-center gap-1.5 text-gray-600">
                      <Icon className={`h-4 w-4 ${color}`} /> {label}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-2 space-y-0.5 text-sm text-gray-500">
                <p>Đội quản lý: {group.teamName}</p>
                <p>
                  Nhóm trưởng: {group.leader.leaderName} 
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 sm:pl-4">
            <div className="text-center">
              <p className="text-xs text-gray-400">Thành viên</p>
              <p className="text-lg font-semibold text-blue-600 bg-blue-100 rounded-md p-1">
                {group.currentMember} / {group.maxMember}
              </p>
           
            </div>
          </div>
        </div>

        {/* Thông tin + Thành viên */}
        <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-gray-900">Thông tin nhóm</h2>
            <div className="divide-y divide-gray-50">
              <InfoRow label="Tên nhóm" value={group.name} />
              <InfoRow label="Loại nhóm" value={TYPE_LABEL[group.type] ?? group.type} />
              <InfoRow label="Đội quản lý" value={group.teamName} />
              <InfoRow label="Sức chứa tối đa" value={`${group.maxMember} thành viên`} />
              <InfoRow label="Số lượng tối thiểu" value={`${group.minMember} thành viên`} />
              <InfoRow label="Số lượng hiện tại" value={`${group.currentMember} thành viên`} />
              <InfoRow label="Xuồng" value={group.hasBoat ? "Có" : "Không"} />
              <InfoRow label="Y tế" value={group.hasMedical ? "Có" : "Không"} />
              <InfoRow label="Tìm kiếm cứu nạn" value={group.hasSearchRescue ? "Có" : "Không"} />
              <InfoRow label="Hậu cần" value={group.hasLogistics ? "Có" : "Không"} />
              <InfoRow label="Trưởng nhóm" value={`${group.leader.leaderName} (${group.leader.phone})`} />
              <InfoRow label="Ghi chú" value={group.notes} />
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-gray-900">
              Danh sách thành viên ({group.members.length}/{group.maxMember})
            </h2>

            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full text-sm hh">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                    <th className="w-10 py-2.5 pl-4 font-medium">#</th>
                    <th className="py-2.5 font-medium">Họ và tên</th>
                    <th className="py-2.5 font-medium">SĐT</th>
                    <th className="w-10 py-2.5 pr-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {group.members.map((m, idx) => {
                    const isLeader = m.userId === group.leader.leaderId;
                    return (
                      <tr key={m.userId} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pl-4 text-gray-400">{idx + 1}</td>
                        <td className="py-3 font-medium text-gray-900">
                          <span className="flex items-center gap-1.5">
                            {m.fullName}
                            {isLeader && (
                              <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                <Crown className="h-3 w-3" /> Trưởng nhóm
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="py-3 text-gray-600">{m.phone}</td>
                        <td className="relative py-3 pr-4 text-right">
                          {isLeaderTeam && (
                          <button
                            type="button"
                            aria-label={`Tùy chọn cho ${m.fullName}`}
                            onClick={() => setOpenMenuId(openMenuId === m.userId ? null : m.userId)}
                            disabled={processingUserId === m.userId}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          )}
                          {isLeaderTeam && openMenuId === m.userId && (
                            <div className="absolute right-4 top-8 z-10 w-48 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                              {!isLeader && (
                                <Popconfirm
                                  title="Đặt làm trưởng nhóm?"
                                  description={`${m.fullName} sẽ trở thành trưởng nhóm mới.`}
                                  okText="Xác nhận"
                                  cancelText="Hủy"
                                  onConfirm={() => handleSetLeader(m)}
                                >
                                  <button
                                    type="button"
                                    disabled={processingUserId !== null}
                                    className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                  >
                                    <Crown className="h-3 w-3" /> Đặt làm trưởng nhóm
                                  </button>
                                </Popconfirm>
                              )}

                              {!isLeader && (
                                <Popconfirm
                                  title="Loại thành viên khỏi nhóm?"
                                  description={`${m.fullName} sẽ mất quyền truy cập nhóm ngay lập tức.`}
                                  okText="Xác nhận"
                                  cancelText="Hủy"
                                  okButtonProps={{ danger: true }}
                                  onConfirm={() => handleRemoveMember(m)}
                                >
                                  <button
                                    type="button"
                                    disabled={processingUserId !== null}
                                    className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                                  >
                                    <IoRemove className="h-3 w-3" /> Loại khỏi nhóm
                                  </button>
                                </Popconfirm>
                              )}

                              {isLeader && (
                                <span className="block px-3 py-2 text-left text-xs text-gray-400">
                                  Trưởng nhóm không thể tự loại
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Xác nhận giải tán nhóm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-gray-900">Giải tán nhóm?</h3>
            <p className="mt-1 text-sm text-gray-500">
              Toàn bộ {group.currentMember} thành viên trong "{group.name}" sẽ được đưa về trạng thái chưa
              có nhóm. Hành động này không thể hoàn tác.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
              >
                Giải tán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}