import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Combobox } from "@/components/ui/Combobox";
import { Button } from "@/components/ui/Button";
import { useAppSelector } from "@/hooks/redux.hooks";
// TODO: sửa path cho đúng vị trí thật
import type { Group } from "../../grouprescue/types/groupType";
import { useGroup } from "../hooks/useGroup";

export interface RescueGroup {
  id: string;
  groupName: string;
  leaderName: string;
  distance: number;
  role: string;
  status: string;
}

interface Props {
  selectedGroup?: string;
  onSelect: (id: string) => void;
}

// ==========================================
// Trạng thái tiếng Việt để hiển thị
// TODO: nếu Group.status có thêm giá trị khác ngoài 3 giá trị này thì bổ sung
// ==========================================
const statusLabelMap: Record<string, string> = {
  AVAILABLE: "SẴN SÀNG",
  BUSY: "ĐANG BẬN",
  UNAVAILABLE: "KHÔNG SẴN SÀNG",
};

// ==========================================
// ADAPTER: Group (từ useGroup) -> RescueGroup (table cần)
// TODO: kiểm tra field thật trong groupType.ts
// - leaderName: Group hiện chưa có field này
// - distance: Group hiện chưa có field này (cần BE trả toạ độ / khoảng cách)
// ==========================================
const mapGroupToRescueGroup = (group: Group): RescueGroup => {
  const roleParts: string[] = [];
  if (group.hasBoat) roleParts.push("Có xuồng");
  if (group.hasMedical) roleParts.push("Có y tế");

  return {
    id: group.id,
    groupName: group.name,
    leaderName: (group as any).leaderName ?? "Chưa có trưởng nhóm", // TODO
    distance: (group as any).distance ?? 0, // TODO
    role: roleParts.length > 0 ? roleParts.join(", ") : "Chưa rõ nhiệm vụ",
    status: statusLabelMap[group.status] ?? group.status,
  };
};

export const RescueGroupTable = ({ selectedGroup, onSelect }: Props) => {
  const [keyword, setKeyword] = useState("");

  // Lấy teamId từ redux, giống cách SOSASSGINPAGE đang làm
  const user = useAppSelector((state) => state.auth.user);
  const teamId = user?.teamId;

  const { groups, loading } = useGroup(teamId);

  // Map Group[] -> RescueGroup[]
  const rescueGroups: RescueGroup[] = useMemo(
    () => groups.map(mapGroupToRescueGroup),
    [groups]
  );

  const filtered = rescueGroups.filter((g) =>
    g.groupName.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow border">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold">2. Chọn nhóm cứu hộ</h2>

        <div className="grid grid-cols-4 gap-3 mt-3">
          <Input
            placeholder="Tên nhóm..."
            value={keyword}
            onChange={(value) => setKeyword(value)}
          />

          <Combobox
            value=""
            options={[{ value: "rescue", label: "Loại nhiệm vụ" }]}
            placeholder="Loại nhiệm vụ"
            onChange={() => {}}
          />

          <Combobox
            value=""
            options={[{ value: "near", label: "Khoảng cách" }]}
            placeholder="Khoảng cách"
            onChange={() => {}}
          />

          <Combobox
            value=""
            options={[{ value: "ready", label: "Sẵn sàng" }]}
            placeholder="Trạng thái"
            onChange={() => {}}
          />
        </div>
      </div>

      {/* Trạng thái loading / rỗng */}
      {loading ? (
        <p className="p-4 text-sm text-gray-400">Đang tải danh sách đội...</p>
      ) : filtered.length === 0 ? (
        <p className="p-4 text-sm text-gray-400">
          Không tìm thấy đội cứu hộ nào
        </p>
      ) : (
        <table className="w-full">
          <thead className="bg-slate-50 text-sm">
            <tr>
              <th className="p-3 text-left">Nhóm cứu hộ</th>
              <th className="p-3 text-left">Nhiệm vụ</th>
              <th className="p-3">Khoảng cách</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((group) => (
              <tr
                key={group.id}
                className={`border-t hover:bg-slate-50 ${
                  selectedGroup === group.id ? "bg-blue-50" : ""
                }`}
              >
                <td className="p-3">
                  <div className="font-medium">{group.groupName}</div>
                  <div className="text-xs text-gray-500">
                    {group.leaderName}
                  </div>
                </td>

                <td className="p-3 text-sm">{group.role}</td>

                <td className="p-3 text-center">{group.distance} km</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      group.status === "SẴN SÀNG"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {group.status}
                  </span>
                </td>

                <td className="p-3">
                  <Button onClick={() => onSelect(group.id)}>
                    {selectedGroup === group.id ? "Đã chọn" : "Chọn"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};