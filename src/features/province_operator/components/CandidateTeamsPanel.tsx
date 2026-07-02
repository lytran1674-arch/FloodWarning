// src/features/province_operator/components/CandidateTeamsPanel.tsx
import { useEffect, useMemo, useState } from "react";
import { Loader, MapPin, Phone, User } from "lucide-react";
import { toast } from "react-toastify";
import type { CandidateTeam, SupportRequestDetail } from "../types/provinceType";
import { provinceApi } from "../api/provinceApi";
import type { GeoMapMarker } from "@/features/map/components/GeoMap";
import GeoMap from "@/features/map/components/GeoMap";

const AVAILABLE_FIELD_BY_TYPE: Record<string, keyof CandidateTeam> = {
  BOAT: "availableBoatGroups",
  MEDICAL: "availableMedicalGroups",
  SEARCH_RESCUE: "availableSearchRescueGroups",
  LOGISTICS: "availableLogisticsGroups",
};

const SUPPORT_TYPE_LABEL: Record<string, string> = {
  BOAT: "Xuồng cứu hộ",
  MEDICAL: "Y tế",
  SEARCH_RESCUE: "Tìm kiếm cứu nạn",
  LOGISTICS: "Hậu cần",
};

interface CandidateTeamsPanelProps {
  requestId: string;
  items: SupportRequestDetail[];
  sosLat?: number | null;
  sosLon?: number | null;
  selectedTeamsByItem: Record<string, string[]>;
  onToggleTeam: (itemId: string, teamId: string, maxCount: number) => void;
}

export function CandidateTeamsPanel({
  requestId,
  items,
  sosLat,
  sosLon,
  selectedTeamsByItem,
  onToggleTeam,
}: CandidateTeamsPanelProps) {
  // teamsByType: { BOAT: [...], MEDICAL: [...] }
  const [teamsByType, setTeamsByType] = useState<Record<string, CandidateTeam[]>>({});
  const [loading, setLoading] = useState(false);

  const supportTypes = useMemo(
    () => Array.from(new Set(items.map((i) => i.supportType))),
    [items]
  );
  const supportTypesKey = supportTypes.join(",");

  // ======================================================
  // FETCH TEAMS CHO TỪNG LOẠI supportType
  // ======================================================
  useEffect(() => {
    const fetchAll = async () => {
      if (!requestId || supportTypes.length === 0) return;
      setLoading(true);
      try {
        const results = await Promise.all(
          supportTypes.map((type) =>
            provinceApi
              .getCandidateTeams(requestId, {
                supportType: type,
                lat: sosLat ?? undefined,
                lon: sosLon ?? undefined,
              })
              .catch((err) => {
                console.error(`GET CANDIDATE TEAMS ERROR (${type}):`, err);
                toast.error(
                  err?.response?.data?.message ||
                    `Không thể tải danh sách đội cho ${SUPPORT_TYPE_LABEL[type] ?? type}`
                );
                return [] as CandidateTeam[];
              })
          )
        );

        const map: Record<string, CandidateTeam[]> = {};
        supportTypes.forEach((type, idx) => {
          map[type] = results[idx] || [];
        });
        setTeamsByType(map);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, supportTypesKey, sosLat, sosLon]);

  // ======================================================
  // GỘP MARKER CHO 1 MAP DUY NHẤT (khử trùng theo team.id)
  // ======================================================
  const allSelectedTeamIds = useMemo(
    () => new Set(Object.values(selectedTeamsByItem).flat()),
    [selectedTeamsByItem]
  );

  const markers: GeoMapMarker[] = useMemo(() => {
    const seen = new Set<string>();
    const teamMarkers: GeoMapMarker[] = [];

    Object.entries(teamsByType).forEach(([type, teams]) => {
      const availableField = AVAILABLE_FIELD_BY_TYPE[type];
      teams
        .filter((team) => typeof team.lat === "number" && typeof team.lon === "number")
        .forEach((team) => {
          if (seen.has(team.id)) return; // đội này đã có trong map (trùng giữa 2 loại)
          seen.add(team.id);

          const availableCount = availableField
            ? (team[availableField] as number)
            : undefined;

          teamMarkers.push({
            id: team.id,
            lat: team.lat,
            lon: team.lon,
            label: team.teamName,
            type: "team" as const,
            selected: allSelectedTeamIds.has(team.id),
            disabled: availableCount === 0 || team.requesterTeam,
            requesterTeam: team.requesterTeam,
          });
        });
    });

    return [
      ...(sosLat != null && sosLon != null
        ? [
            {
              id: "sos",
              lat: sosLat,
              lon: sosLon,
              label: "Vị trí SOS",
              type: "sos" as const,
            },
          ]
        : []),
      ...teamMarkers,
    ];
  }, [teamsByType, sosLat, sosLon, allSelectedTeamIds]);

  // ======================================================
  // BẤM MARKER TRÊN MAP -> gán vào item đầu tiên CHƯA đủ số lượng
  // ======================================================
  const handleMarkerClick = (teamId: string) => {
    const pendingItem = items.find((item) => {
      const selected = selectedTeamsByItem[item.id] || [];
      const maxCount = item.requiredGroupCount || 1;
      return selected.length < maxCount && !selected.includes(teamId);
    });
    if (pendingItem) {
      const maxCount = pendingItem.requiredGroupCount || 1;
      onToggleTeam(pendingItem.id, teamId, maxCount);
    } else {
      toast.info("Tất cả các loại hỗ trợ đã chọn đủ số đội yêu cầu");
    }
  };

  // ======================================================
  // LOADING
  // ======================================================
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-5 shadow-sm flex justify-center">
        <Loader className="w-5 h-5 animate-spin text-blue-500" />
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-semibold">Chọn đội cứu hộ chi viện</h3>

      {/* 1 MAP DUY NHẤT cho tất cả các loại */}
      <div className="h-64 rounded-lg overflow-hidden border">
        <GeoMap
          markers={markers}
          onMarkerClick={handleMarkerClick}
          showCurrentPin={false}
          fitToMarkers={true}
          className="w-full h-full"
        />
      </div>

      {/* DANH SÁCH ĐỘI - nhóm theo từng loại vì cần chọn riêng, cho phép chọn nhiều theo requiredGroupCount */}
      {items.map((item) => {
        const teams = teamsByType[item.supportType] || [];
        const availableField = AVAILABLE_FIELD_BY_TYPE[item.supportType];
        const selected = selectedTeamsByItem[item.id] || [];
        const maxCount = item.requiredGroupCount || 1;
        const isMaxReached = selected.length >= maxCount;

        return (
          <div key={item.id} className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
              {SUPPORT_TYPE_LABEL[item.supportType] ?? item.supportType}
              <span
                className={
                  selected.length === maxCount
                    ? "text-green-600 normal-case font-medium"
                    : "text-orange-600 normal-case font-medium"
                }
              >
                Đã chọn {selected.length}/{maxCount}
              </span>
            </p>

            {teams.length === 0 ? (
              <p className="text-sm text-gray-400">
                Không có đội khả dụng cho loại này
              </p>
            ) : (
              teams.map((team) => {
                const availableCount = availableField
                  ? (team[availableField] as number)
                  : undefined;
                const isFull = availableCount === 0;
                const isRequester = team.requesterTeam;
                const isChecked = selected.includes(team.id);
                const isDisabled = isFull || isRequester || (isMaxReached && !isChecked);

                return (
                  <label
                    key={team.id}
                    className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition-colors
                      ${isChecked ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}
                      ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={() => onToggleTeam(item.id, team.id, maxCount)}
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">
                          {team.teamName || "Chưa có tên đội"}
                        </p>

                        <div className="flex items-center gap-1.5">
                          {isRequester && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-600 whitespace-nowrap">
                              Đội yêu cầu
                            </span>
                          )}
                          {availableCount !== undefined && (
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap
                                ${isFull ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"}
                              `}
                            >
                              Còn {availableCount} nhóm
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {team.leaderName || "Chưa có trưởng nhóm"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {team.leaderPhone || "Chưa có SĐT"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {team.distanceKm != null
                            ? `${team.distanceKm.toFixed(1)} km`
                            : "Chưa xác định khoảng cách"}
                        </span>
                      </div>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        );
      })}
    </div>
  );
}