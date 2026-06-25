/**
 * SOSAssignPage.tsx
 * Màn hình Team Leader phân công group cho SOS
 *
 * APIs dùng:
 *   GET  /sos-request/{id}              → chi tiết SOS (lat, lon, mô tả, assignments)
 *   GET  /res-team/{teamId}/group       → danh sách group của đội
 *   POST /sos-assignment                → phân công group { sosId, groupId, role, note }
 */

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SosDetail {
  id: string;
  teamId: string;
  phoneNumber: string;
  victimCount: number;
  injured: boolean;
  trapped: boolean;
  vulnerable: boolean;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  baseSeverityScore: number;
  priorityReason: string;
  environmentRisk: string;
  lat: number;
  lon: number;
  address: string;
  status: string;
  createdAt: string;
  assignments: Assignment[];
}

interface Assignment {
  id: string;
  groupId: string;
  groupName: string;
  role: "PRIMARY" | "SUPPORT";
  status: string;
  note?: string;
}

interface Group {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  status: "AVAILABLE" | "BUSY" | "OFFLINE";
  hasBoat: boolean;
  hasMedical: boolean;
  notes?: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const API_BASE = "https://api-lulut.io.vn";
const TOKEN = localStorage.getItem("token") || "";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
  HIGH:     "bg-orange-100 text-orange-700 border-orange-200",
  MEDIUM:   "bg-yellow-100 text-yellow-700 border-yellow-200",
  LOW:      "bg-green-100 text-green-700 border-green-200",
};

const STATUS_COLOR: Record<string, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  BUSY:      "bg-amber-100 text-amber-700",
  OFFLINE:   "bg-gray-100 text-gray-500",
};

/** Haversine distance (km) */
function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const sosIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:36px;height:36px;border-radius:50%;
    background:#ef4444;border:3px solid #fff;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    display:flex;align-items:center;justify-content:center;
    font-size:18px;
  ">🆘</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// ─── Sub-components ──────────────────────────────────────────────────────────

function FlyTo({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lon], 14, { duration: 1 }); }, [lat, lon]);
  return null;
}

function GroupCard({
  group,
  distance,
  alreadyAssigned,
  selected,
  onSelect,
}: {
  group: Group;
  distance: number | null;
  alreadyAssigned: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const unavailable = group.status !== "AVAILABLE" || alreadyAssigned;

  return (
    <button
      onClick={unavailable ? undefined : onSelect}
      disabled={unavailable}
      className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-150 ${
        selected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : unavailable
          ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm">{group.name}</span>
            {alreadyAssigned && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                Đã phân công
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[group.status]}`}>
              {group.status === "AVAILABLE" ? "Sẵn sàng" : group.status === "BUSY" ? "Đang bận" : "Offline"}
            </span>
            {group.hasBoat && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 font-medium">
                🚤 Có xuồng
              </span>
            )}
            {group.hasMedical && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium">
                💊 Y tế
              </span>
            )}
          </div>
          {group.notes && (
            <p className="mt-1.5 text-xs text-gray-500 truncate">{group.notes}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          {distance !== null && (
            <span className="text-sm font-semibold text-gray-700">
              {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
            </span>
          )}
          {selected && (
            <div className="mt-1 text-blue-500">
              <svg className="w-5 h-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  sosId: string;
  teamId: string;
  onBack?: () => void;
  onAssigned?: () => void;
}

export default function SOSAssignPage({ sosId, teamId, onBack, onAssigned }: Props) {
  const [sos, setSos] = useState<SosDetail | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [role, setRole] = useState<"PRIMARY" | "SUPPORT">("PRIMARY");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load SOS detail + group list
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [sosRes, groupRes] = await Promise.all([
          fetch(`${API_BASE}/sos-request/${sosId}`, { headers }),
          fetch(`${API_BASE}/res-team/${teamId}/group`, { headers }),
        ]);
        const sosData = await sosRes.json();
        const groupData = await groupRes.json();

        if (sosData.code !== 0) throw new Error("Không tải được SOS");
        if (groupData.code !== 0) throw new Error("Không tải được danh sách group");

        setSos(sosData.result);
        // Sort groups by distance to SOS
        const lat = sosData.result.lat;
        const lon = sosData.result.lon;
        const sorted = (groupData.result.content as Group[]).sort((a: any, b: any) => {
          // Groups don't have lat/lon in this API so sort by status then name
          if (a.status === "AVAILABLE" && b.status !== "AVAILABLE") return -1;
          if (a.status !== "AVAILABLE" && b.status === "AVAILABLE") return 1;
          return a.name.localeCompare(b.name);
        });
        setGroups(sorted);
      } catch (e: any) {
        setError(e.message || "Lỗi kết nối");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sosId, teamId]);

  const assignedGroupIds = new Set(sos?.assignments?.map((a) => a.groupId) ?? []);

  async function handleAssign() {
    if (!selectedGroupId || !sos) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`${API_BASE}/sos-assignment`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          sosId: sos.id,
          groupId: selectedGroupId,
          role,
          note: note.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.code !== 0) throw new Error(data.message || "Phân công thất bại");
      setSubmitSuccess(true);
      setTimeout(() => {
        onAssigned?.();
      }, 1200);
    } catch (e: any) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
          <span className="text-sm">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (error || !sos) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error || "Không tìm thấy SOS"}</p>
          <button onClick={onBack} className="text-sm text-blue-600 hover:underline">← Quay lại</button>
        </div>
      </div>
    );
  }

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-gray-900 text-base truncate">Phân công cứu hộ</h1>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_COLOR[sos.priority]}`}>
              {sos.priority}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate mt-0.5">{sos.address}</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* ── Left: Map + SOS info ── */}
        <div className="lg:w-1/2 flex flex-col">
          {/* Map */}
          <div className="h-64 lg:h-80 relative">
            <MapContainer
              center={[sos.lat, sos.lon]}
              zoom={14}
              className="h-full w-full"
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <FlyTo lat={sos.lat} lon={sos.lon}/>
              <Marker position={[sos.lat, sos.lon]} icon={sosIcon}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{sos.description}</p>
                    <p className="text-gray-600 mt-1">{sos.address}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* SOS info card */}
          <div className="bg-white border-b border-gray-200 p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-red-600">{sos.victimCount}</p>
                <p className="text-xs text-red-500 mt-0.5">Nạn nhân</p>
              </div>
              <div className={`rounded-xl p-3 text-center ${sos.injured ? "bg-orange-50" : "bg-gray-50"}`}>
                <p className="text-2xl">{sos.injured ? "🤕" : "—"}</p>
                <p className={`text-xs mt-0.5 ${sos.injured ? "text-orange-600" : "text-gray-400"}`}>
                  {sos.injured ? "Bị thương" : "Không bị thương"}
                </p>
              </div>
              <div className={`rounded-xl p-3 text-center ${sos.trapped ? "bg-yellow-50" : "bg-gray-50"}`}>
                <p className="text-2xl">{sos.trapped ? "🔒" : "—"}</p>
                <p className={`text-xs mt-0.5 ${sos.trapped ? "text-yellow-600" : "text-gray-400"}`}>
                  {sos.trapped ? "Bị mắc kẹt" : "Không kẹt"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Mô tả</p>
              <p className="text-sm text-gray-800">{sos.description}</p>
            </div>

            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-1">Lý do ưu tiên</p>
              <p className="text-sm text-amber-800">{sos.priorityReason}</p>
            </div>

            {/* Already assigned */}
            {sos.assignments?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Đã phân công ({sos.assignments.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {sos.assignments.map((a) => (
                    <span key={a.id} className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      {a.groupName} · {a.role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Group list + form ── */}
        <div className="lg:w-1/2 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900 text-sm">
                Chọn nhóm cứu hộ
              </h2>
              <span className="text-xs text-gray-500">
                {groups.filter((g) => g.status === "AVAILABLE").length} sẵn sàng / {groups.length} tổng
              </span>
            </div>

            {groups.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">🚨</p>
                <p className="text-sm">Không có nhóm nào trong đội</p>
              </div>
            ) : (
              groups.map((g) => (
                <GroupCard
                  key={g.id}
                  group={g}
                  distance={null}
                  alreadyAssigned={assignedGroupIds.has(g.id)}
                  selected={selectedGroupId === g.id}
                  onSelect={() => setSelectedGroupId(g.id)}
                />
              ))
            )}
          </div>

          {/* ── Assignment form ── */}
          <div className="bg-white border-t border-gray-200 p-4 space-y-3">
            {submitSuccess ? (
              <div className="flex items-center justify-center gap-3 py-4 text-emerald-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">Phân công thành công!</span>
              </div>
            ) : (
              <>
                {selectedGroup && (
                  <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    <span className="text-sm font-medium text-blue-700">{selectedGroup.name}</span>
                    <div className="flex gap-1 ml-auto">
                      {selectedGroup.hasBoat && <span className="text-xs">🚤</span>}
                      {selectedGroup.hasMedical && <span className="text-xs">💊</span>}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {(["PRIMARY", "SUPPORT"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${
                        role === r
                          ? r === "PRIMARY"
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-purple-500 bg-purple-500 text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {r === "PRIMARY" ? "🔵 Chính" : "🟣 Hỗ trợ"}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Ghi chú nhiệm vụ (không bắt buộc)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                />

                {submitError && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">
                    ⚠️ {submitError}
                  </p>
                )}

                <button
                  onClick={handleAssign}
                  disabled={!selectedGroupId || submitting}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
                    selectedGroupId && !submitting
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 active:scale-[0.98]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      Đang phân công...
                    </span>
                  ) : selectedGroupId ? (
                    `Phân công ${selectedGroup?.name}`
                  ) : (
                    "Chọn nhóm cứu hộ"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}