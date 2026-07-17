// src/features/province_operator/components/CandidateTeamsPanel.tsx

import { useMemo } from "react";
import { Loader, MapPin, Phone, User } from "lucide-react";

import type { CandidateTeam, SupportRequestDetail } from "../types/provinceType";

import { getAvailableGroups, SUPPORT_TYPE_LABEL } from "../utils/supportType";

import type { GeoMapMarker } from "@/features/map/components/GeoMap";

import GeoMap from "@/features/map/components/GeoMap";

// ======================================================
// PROPS
// ======================================================

interface CandidateTeamsPanelProps {
  teams: CandidateTeam[];
  loading: boolean;
  items: SupportRequestDetail[];
  sosLat?: number | null;
  sosLon?: number | null;
  selectedTeamIds: string[];
  onToggleTeam: (teamId: string) => void;
}

// ======================================================
// HELPER: NORMALIZE LAT/LON
// ======================================================

function normalizeLatLon(lat: number, lon: number): [number, number] {
  const latValid = lat >= -90 && lat <= 90;
  const lonAsLatValid = lon >= -90 && lon <= 90;

  if (!latValid && lonAsLatValid) {
    return [lon, lat];
  }
  return [lat, lon];
}

// ======================================================
// COMPONENT
// ======================================================

export function CandidateTeamsPanel({
  teams,
  loading,
  items,
  sosLat,
  sosLon,
  selectedTeamIds,
  onToggleTeam,
}: CandidateTeamsPanelProps) {
  // ======================================================
  // TOTAL REQUIRED GROUPS
  // ======================================================

  const totalRequiredGroups = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + (item.requiredGroupCount || 0),
      0
    );
  }, [items]);

  // ======================================================
  // TEAM TOTAL AVAILABLE GROUPS
  // ======================================================

  const getTotalAvailableGroups = (team: CandidateTeam) => {
    return items.reduce(
      (sum, item) => sum + getAvailableGroups(team, item.supportType),
      0
    );
  };

  // ======================================================
  // TOTAL SELECTED GROUPS
  // ======================================================

  const totalSelectedGroups = useMemo(() => {
    return teams
      .filter((team) => selectedTeamIds.includes(team.id))
      .reduce((sum, team) => sum + getTotalAvailableGroups(team), 0);
  }, [teams, selectedTeamIds, items]);

  // ======================================================
  // SORTED TEAMS
  // ======================================================

  const sortedTeams = useMemo(() => {
    return [...teams].sort(
      (a, b) => (a.distanceKm ?? Number.MAX_VALUE) - (b.distanceKm ?? Number.MAX_VALUE)
    );
  }, [teams]);

  // ======================================================
  // MAP MARKERS
  // ======================================================

  const markers: GeoMapMarker[] = useMemo(() => {
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
      ...sortedTeams
        .filter(
          (team) =>
            typeof team.lat === "number" && typeof team.lon === "number"
        )
        .map((team) => {
          const [lat, lon] = normalizeLatLon(team.lat, team.lon);
          return {
            id: team.id,
            lat,
            lon,
            label: team.teamName,
            type: "team" as const,
            selected: selectedTeamIds.includes(team.id),
            disabled:
              items.some(
                (item) =>
                  item.requiredGroupCount > 0 &&
                  getAvailableGroups(team, item.supportType) === 0
              ) || team.requesterTeam,
            requesterTeam: team.requesterTeam,
          };
        }),
    ];
  }, [sortedTeams, sosLat, sosLon, selectedTeamIds, items]);

  // ======================================================
  // MAP CLICK
  // ======================================================

  const handleMarkerClick = (teamId: string) => {
    onToggleTeam(teamId);
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex justify-center rounded-xl border bg-white p-5 shadow-sm">
        <Loader className="h-5 w-5 animate-spin text-blue-500" />
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
      {/* HEADER */}
      <div>
        <h3 className="text-sm font-semibold">Chọn đội cứu hộ chi viện</h3>

        <p className="mt-1 text-xs text-gray-500">
          Tổng cần{" "}
          <span className="font-semibold">{totalRequiredGroups}</span> nhóm
          hỗ trợ
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item.id}
              className="rounded-full bg-gray-100 px-2 py-1 text-[11px] text-gray-700"
            >
              {SUPPORT_TYPE_LABEL[item.supportType]}:{" "}
              {item.requiredGroupCount} nhóm
            </span>
          ))}
        </div>
      </div>

      {/* MAP */}
      <div className="h-64 overflow-hidden rounded-lg border">
        <GeoMap
          markers={markers}
          onMarkerClick={handleMarkerClick}
          showCurrentPin={false}
          fitToMarkers={true}
          className="h-full w-full"
        />
      </div>

      {/* SELECTED */}
      <div
        className={`rounded-lg border px-3 py-2 text-sm font-medium
        ${
          totalSelectedGroups >= totalRequiredGroups
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-orange-200 bg-orange-50 text-orange-700"
        }
      `}
      >
        Đã chọn {totalSelectedGroups}/{totalRequiredGroups} nhóm
      </div>

      {/* TEAM LIST */}
      <div className="space-y-2">
        {sortedTeams.length === 0 ? (
          <p className="text-sm text-gray-400">Không có đội khả dụng</p>
        ) : (
        sortedTeams.map((team) => {
  const totalGroups  = getTotalAvailableGroups(team)
  const isChecked    = selectedTeamIds.includes(team.id)
  const isRequester  = team.requesterTeam
  const isDisabled   =
    items.some(
      (item) =>
        item.requiredGroupCount > 0 &&
        getAvailableGroups(team, item.supportType) === 0
    ) || isRequester

            return (
              <div
                key={team.id}
                className={`
                  flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors

                  ${
                    isChecked
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }

                  ${isDisabled ? "cursor-not-allowed opacity-50" : ""}
                `}
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => onToggleTeam(team.id)}
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{team.teamName}</p>

                    <div className="flex items-center gap-1.5">
                      {isRequester && (
                        <span className="whitespace-nowrap rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-600">
                          Đội yêu cầu
                        </span>
                      )}

                      <span
                        className={`
                          whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium

                          ${
                            totalGroups === 0
                              ? "bg-gray-100 text-gray-500"
                              : "bg-green-100 text-green-700"
                          }
                        `}
                      >
                        Còn {totalGroups} nhóm
                      </span>
                    </div>
                  </div>

                {/* === HIỂN THỊ SỐ NHÓM === */}
<div className="mt-1.5 flex flex-wrap gap-2">
  {items.map((item) => {
    // ✅ Dùng availableGroupCount trực tiếp — BE đã filter đúng type
    const count = team.availableGroupCount ?? 0
    if (count === 0) return null
    return (
      <span
        key={item.supportType}
        className="rounded bg-green-100 px-2 py-0.5 text-[11px] text-green-700"
      >
        {SUPPORT_TYPE_LABEL[item.supportType]}: {count}
      </span>
    )
  })}
</div>

                  {/* THÔNG TIN ĐỘI */}
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {team.leaderName}
                    </span>

                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {team.leaderPhone}
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {team.distanceKm?.toFixed(1)} km
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}