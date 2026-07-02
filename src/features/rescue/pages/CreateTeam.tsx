import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArea } from "../../areas/hooks/useArea";
import { rescueApi } from "../api/rescureApi";
import type { ResCue } from "../types/rescueType";
import { toast } from "react-toastify";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const RecenterMap = ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);

  return null;
};

const MapClickHandler = ({
  setLat,
  setLng,
}: {
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });

  return null;
};

export const CreateTeam = () => {
  const navigate = useNavigate();

  const { areas } = useArea();

  const [teamName, setTeamName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [
    emergencyPhone,
    setEmergencyPhone,
  ] = useState("");

  const [
    addressDetail,
    setAddressDetail,
  ] = useState("");

  const [lat, setLat] = useState<
    number | null
  >(null);

  const [lng, setLng] = useState<
    number | null
  >(null);

  const [
    selectedArea,
    setSelectedArea,
  ] = useState<string | null>(null);

  const [
    selectedAreaLabel,
    setSelectedAreaLabel,
  ] = useState("");

  const [searchArea, setSearchArea] =
    useState("");

  const [openArea, setOpenArea] =
    useState(false);

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [
    showLeaderModal,
    setShowLeaderModal,
  ] = useState(false);

  const [members, setMembers] =
    useState<ResCue[]>([]);

  const [
    createdTeamId,
    setCreatedTeamId,
  ] = useState("");

  const [
    selectingLeader,
    setSelectingLeader,
  ] = useState(false);

  const areaOptions = useMemo(() => {
    return areas.flatMap((parent) =>
      (parent.children ?? []).map(
        (child) => ({
          id: child.id,
          label: `${parent.tenkhuvuc} > ${child.tenkhuvuc}`,
        })
      )
    );
  }, [areas]);

  const filteredAreas =
    areaOptions.filter((area) =>
      area.label
        .toLowerCase()
        .includes(searchArea.toLowerCase())
    );

  const geocodeAddress = async (
    fullAddress: string
  ) => {
    try {
      const url =
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullAddress
        )}`;

      const response = await fetch(url);

      const data = await response.json();

      if (data.length > 0) {
        setLat(Number(data[0].lat));

        setLng(Number(data[0].lon));
      }
    } catch (error) {
      console.error(
        "Geocode error",
        error
      );
    }
  };

  useEffect(() => {
    if (
      !addressDetail ||
      !selectedAreaLabel
    )
      return;

    const fullAddress =
      `${addressDetail}, ${selectedAreaLabel}`;

    const timer = setTimeout(() => {
      geocodeAddress(fullAddress);
    }, 700);

    return () => clearTimeout(timer);
  }, [
    addressDetail,
    selectedAreaLabel,
  ]);

  const handleCreateTeam = async () => {
  try {

    if (!teamName.trim()) {
      toast.warning(
        "Vui lòng nhập tên đội cứu hộ"
      );

      return;
    }

    if (!selectedArea) {
      toast.warning(
        "Vui lòng chọn khu vực"
      );

      return;
    }

    if (lat == null || lng == null) {
      toast.warning(
        "Không lấy được tọa độ từ địa chỉ"
      );

      return;
    }

    setLoading(true);

    const payload = {
      name: teamName,

      description,

      areaId: selectedArea,

      emergencyPhone,

      diachi:
        `${addressDetail}, ${selectedAreaLabel}`,

      lat,

      lon: lng,
    };

    console.log(payload);

    const teamResponse =
      await rescueApi.createTeam(
        payload
      );

    const teamId =
      teamResponse.result.id;

    if (file) {

      const importResponse =
        await rescueApi.importRescuers(
          teamId,
          file
        );

      toast.success(
        `Import thành công ${importResponse.result.success} thành viên`
      );
    }

    const importedMembers =
      await rescueApi.getTeamMembersWithoutGroup(
        teamId
      );

    setMembers(importedMembers);

    setCreatedTeamId(teamId);

    setShowLeaderModal(true);

  } catch (error) {

    console.error(error);

    toast.error(
      "Có lỗi xảy ra khi tạo đội cứu hộ"
    );

  } finally {

    setLoading(false);

  }
};

  const handlePickLeader =
    async (userId: string) => {
      try {
        setSelectingLeader(true);

        await rescueApi.PickLeader(
          createdTeamId,
          userId
        );

        toast.success(
          "Gán đội trưởng thành công"
        );

        setShowLeaderModal(false);

        navigate("/rescue-management");
      } catch (error: any) {
        console.error(error);

        toast.error(
          error?.response?.data
            ?.message ||
            "Không thể gán đội trưởng"
        );
      } finally {
        setSelectingLeader(false);
      }
    };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">

        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Tạo đội cứu hộ
          </h1>

          <p className="mt-1 text-gray-500">
            Tạo đội cứu hộ và định vị trên bản đồ
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <div className="rounded-xl border bg-white p-5 shadow-sm">

            <h2 className="mb-4 text-lg font-semibold">
              Thông tin đội cứu hộ
            </h2>

            <div className="space-y-4">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Tên đội
                </label>

                <input
                  value={teamName}
                  onChange={(e) =>
                    setTeamName(
                      e.target.value
                    )
                  }
                  placeholder="Nhập tên đội cứu hộ"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Hotline khẩn cấp
                </label>

                <input
                  value={emergencyPhone}
                  onChange={(e) =>
                    setEmergencyPhone(
                      e.target.value
                    )
                  }
                  placeholder="Nhập số hotline"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Địa chỉ chi tiết
                </label>

                <input
                  value={addressDetail}
                  onChange={(e) =>
                    setAddressDetail(
                      e.target.value
                    )
                  }
                  placeholder="Ví dụ: 12 Nguyễn Huệ"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Khu vực
                </label>

                <div className="relative">

                  <input
                    value={searchArea}
                    onFocus={() =>
                      setOpenArea(true)
                    }
                    onChange={(e) => {
                      setSearchArea(
                        e.target.value
                      );

                      setOpenArea(true);
                    }}
                    placeholder="Tìm kiếm khu vực..."
                    className="w-full rounded-lg border p-3"
                  />

                  {openArea && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">

                      {filteredAreas.length >
                      0 ? (
                        filteredAreas.map(
                          (area) => (
                            <button
                              key={
                                area.id
                              }
                              type="button"
                              className="block w-full px-4 py-3 text-left hover:bg-slate-100"
                              onClick={() => {
                                setSelectedArea(
                                  area.id
                                );

                                setSelectedAreaLabel(
                                  area.label
                                );

                                setSearchArea(
                                  area.label
                                );

                                setOpenArea(
                                  false
                                );
                              }}
                            >
                              {
                                area.label
                              }
                            </button>
                          )
                        )
                      ) : (
                        <div className="p-3 text-sm text-gray-500">
                          Không tìm thấy
                          khu vực
                        </div>
                      )}

                    </div>
                  )}

                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Latitude
                  </label>

                  <input
                    value={lat ?? ""}
                    readOnly
                    className="w-full rounded-lg border bg-slate-50 p-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Longitude
                  </label>

                  <input
                    value={lng ?? ""}
                    readOnly
                    className="w-full rounded-lg border bg-slate-50 p-3"
                  />
                </div>

              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Mô tả
                </label>

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Nhập mô tả đội cứu hộ"
                  className="w-full resize-none rounded-lg border p-3"
                />
              </div>

                    {/*import file excel*/}
                    <div>
  <label className="mb-2 block text-sm font-medium">
    Import thành viên
  </label>

  <input
    type="file"
    accept=".xlsx,.xls,.csv"
    onChange={(e) => {
      if (e.target.files?.[0]) {
        setFile(e.target.files[0]);
      }
    }}
    className="w-full rounded-lg border p-3"
  />

  {file && (
    <div className="mt-2 rounded-lg bg-slate-100 p-3 text-sm">
      <p className="font-medium">
        File đã chọn:
      </p>

      <p className="text-slate-600">
        {file.name}
      </p>
    </div>
  )}
</div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">

            <h2 className="mb-4 text-lg font-semibold">
              Vị trí trên bản đồ
            </h2>

            <div className="overflow-hidden rounded-xl border">

              <MapContainer
                center={[
                  lat || 10.8231,
                  lng || 106.6297,
                ]}
                zoom={15}
                style={{
                  height: "500px",
                  width: "100%",
                }}
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {lat && lng && (
                  <>
                    <Marker
                      position={[
                        lat,
                        lng,
                      ]}
                    >
                      <Popup>
                        Vị trí đội cứu hộ
                      </Popup>
                    </Marker>

                    <RecenterMap
                      lat={lat}
                      lng={lng}
                    />
                  </>
                )}

                <MapClickHandler
                  setLat={setLat}
                  setLng={setLng}
                />

              </MapContainer>

            </div>

            <p className="mt-3 text-sm text-slate-500">
              Có thể click trực tiếp
              trên map để chỉnh tọa độ
            </p>

          </div>

        </div>

        <div className="mt-6 flex justify-end">

          <button
            disabled={loading}
            onClick={handleCreateTeam}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white"
          >
            {loading
              ? "Đang tạo..."
              : "Tạo đội cứu hộ"}
          </button>

        </div>

      </div>

      {showLeaderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="w-full max-w-4xl rounded-xl bg-white p-6">

            <h2 className="mb-4 text-xl font-bold">
              Chọn đội trưởng
            </h2>

            <div className="max-h-[450px] overflow-auto rounded-lg border">

              <table className="w-full">

                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-3 text-left">
                      User ID
                    </th>

                    <th className="p-3 text-left">
                      Họ tên
                    </th>

                    <th className="p-3 text-left">
                      Số điện thoại
                    </th>

                    <th className="p-3 text-center">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {members.map(
                    (member) => (
                      <tr
                        key={
                          member.userId
                        }
                        className="border-t"
                      >
                        <td className="p-3">
                          {
                            member.userId
                          }
                        </td>

                        <td className="p-3">
                          {
                            member.fullName
                          }
                        </td>

                        <td className="p-3">
                          {
                            member.phone
                          }
                        </td>

                        <td className="p-3 text-center">

                          <button
                            disabled={
                              selectingLeader
                            }
                            onClick={() =>
                              handlePickLeader(
                                member.userId
                              )
                            }
                            className="rounded bg-blue-600 px-3 py-1 text-white"
                          >
                            Chọn Leader
                          </button>

                        </td>
                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};