import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  UploadCloud,
  Pencil,
  X,
  Eye,
  Users,
  Save,
} from "lucide-react";
import { ImportProvinceOperatorModal } from "../components/ImportProvinceOperatorModal";
import { useProvince } from "../hooks/useProvince";
import { provinceService } from "../services/provinceService";
import type {
  ProvinceOperatorDetail,
  RescueTeamItem,
} from "../types/provinceType";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { UpdateResCue } from "@/features/rescue/types/rescueType";
import { areaApi } from "@/features/areas/api/areaApi";
import type { Area } from "@/features/areas/types/areaType";
// Chỉnh lại đường dẫn 2 import dưới cho khớp vị trí thật trong dự án của bạn


export default function ListProvinceOperatorPage() {
  const {
    operators,
    loading,
    error,
    reload,
    deleteProvinceOperator,
    updateProvinceOperator,
  } = useProvince();

  const [importOpen, setImportOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ProvinceOperatorDetail | null>(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [teams, setTeams] = useState<RescueTeamItem[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Trạng thái chỉnh sửa trong modal
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateResCue | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Tên khu vực phụ trách hiện tại — chỉ để hiển thị ở chế độ xem.
  // Ở chế độ sửa, dùng dropdown "provinces" bên dưới để chọn areaId mới.
  const [areaLabel, setAreaLabel] = useState("");

  // Danh sách tỉnh/thành (level 1) để đổ vào dropdown "Khu vực phụ trách" khi sửa
  const [provinces, setProvinces] = useState<Area[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const all = await areaApi.getAll();
        // Chỉ lấy khu vực cấp tỉnh/thành (level 1) — điều phối viên phụ trách theo tỉnh
        setProvinces(all.filter((a) => a.level === 1));
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách tỉnh/thành.");
      } finally {
        setLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleViewDetail = async (id: string, editMode = false) => {
    try {
      setLoadingDetail(true);
      setIsEditing(editMode);

      const detail = await provinceService.getProvinceOperatorDetail(id);
      const teamData = await provinceService.getTeamsByProvinceOperator(id);

      setSelected(detail);

      // Map dữ liệu chi tiết -> đúng shape UpdateResCue.
      // GET trả gioitinh dạng boolean, nhưng payload update cần string "true"/"false".
      setFormData({
        id: detail.id,
        hoten: detail.hoten ?? "",
        gioitinh: detail.gioitinh ? "true" : "false",
        ngaysinh: detail.ngaysinh ?? "",
        sodt: detail.sodt ?? "",
        email: detail.email ?? "",
        ghichu: "", 
        areaId: detail.areaId ?? "",
      });

      // Tên khu vực chỉ để hiển thị, không gửi lên API
      setAreaLabel(detail.tenKhuVucPhuTrach?? "");

      setTeams(teamData);
      setDetailOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải thông tin điều hành.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData) return;

    if (!formData.hoten.trim()) {
      toast.warning("Vui lòng nhập họ tên.");
      return;
    }
    if (!formData.sodt.trim()) {
      toast.warning("Vui lòng nhập số điện thoại.");
      return;
    }
    if (!formData.email.trim()) {
      toast.warning("Vui lòng nhập email.");
      return;
    }
    try {
      setIsSaving(true);
      await updateProvinceOperator(formData);
      toast.success("Cập nhật thành công");
      setIsEditing(false);
   
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selected) {
      // hủy thay đổi, nạp lại từ dữ liệu gốc đã tải
      setFormData({
        id: selected.id,
        hoten: selected.hoten ?? "",
        gioitinh: selected.gioitinh ? "true" : "false",
        ngaysinh: selected.ngaysinh ?? "",
        sodt: selected.sodt ?? "",
        email: selected.email ?? "",
        ghichu: "",
        areaId: selected.areaId ?? "",
      });
      // Nếu lỡ chọn nhầm tỉnh khác trong lúc sửa, khôi phục lại tên khu vực gốc
      setAreaLabel(selected.tenKhuVucPhuTrach ?? "");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProvinceOperator({ ids: selectedIds });
      toast.success("Xóa thành viên thành công");
      setDeleteMode(false);
      setSelectedIds([]);
      setOpenDelete(false);
      reload();
    } catch (e) {
      console.error(e);
      toast.error("Xóa thành viên thất bại");
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setIsEditing(false);
    setFormData(null);
    setAreaLabel("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }



  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Danh sách điều hành cấp tỉnh
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý thông tin điều phối viên và đội cứu hộ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate("/province_operator/add-member")}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Thêm thành viên
          </button>

          <button
            onClick={() => setImportOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            Import
          </button>

          {!deleteMode ? (
            <button
              onClick={() => setDeleteMode(true)}
              className="inline-flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg text-sm font-medium transition"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          ) : (
            <>
              <button
                onClick={() => setOpenDelete(true)}
                disabled={selectedIds.length === 0}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
              >
                <Trash2 className="w-4 h-4" />
                Xóa ({selectedIds.length})
              </button>
              <button
                onClick={() => {
                  setDeleteMode(false);
                  setSelectedIds([]);
                }}
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition"
              >
                Hủy
              </button>
            </>
          )}
        </div>
      </div>

      <ImportProvinceOperatorModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={() => {
          setImportOpen(false);
          reload();
        }}
      />

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                {deleteMode && <th className="w-12 px-4 py-3.5"></th>}
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                  STT
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Khu vực phụ trách
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {operators.length === 0 ? (
                <tr>
                  <td
                    colSpan={deleteMode ? 5 : 4}
                    className="px-5 py-16 text-center text-gray-400"
                  >
                    Chưa có dữ liệu điều hành cấp tỉnh
                  </td>
                </tr>
              ) : (
                operators.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {deleteMode && (
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="h-4 w-4 rounded border-gray-300 accent-red-600"
                        />
                      </td>
                    )}
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {item.hoten}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.tenkhuvuc_phutrach || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetail(item.id, false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Chi tiết
                        </button>
                        <button
                          onClick={() => handleViewDetail(item.id, true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Cập nhật
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {openDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Xác nhận xóa
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Bạn có chắc muốn xóa{" "}
                    <span className="font-semibold text-red-600">
                      {selectedIds.length}
                    </span>{" "}
                    điều phối viên? Hành động này không thể hoàn tác.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setOpenDelete(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chi tiết / Chỉnh sửa */}
      {detailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="mt-9 bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {isEditing
                      ? "Cập nhật điều hành cấp tỉnh"
                      : "Chi tiết điều hành cấp tỉnh"}
                  </h2>
                  {selected && (
                    <p className="text-sm text-gray-500">{selected.hoten}</p>
                  )}
                </div>
                
              </div>
              
              <button
                onClick={handleCloseDetail}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
             
            </div>
 {error&&(
                  <div className="text-red-500 lg:ml-7 ">{error}</div>
                )}
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingDetail ? (
                <div className="flex items-center justify-center py-20 text-gray-400">
                  Đang tải thông tin...
                </div>
              ) : formData ? (
                <div className="space-y-6">
                  {/* Form thông tin */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Họ tên"
                      value={formData.hoten}
                      editing={isEditing}
                      onChange={(val) =>
                        setFormData({ ...formData, hoten: val })
                      }
                    />
                    <FormField
                      label="Số điện thoại"
                      value={formData.sodt}
                      editing={isEditing}
                      onChange={(val) =>
                        setFormData({ ...formData, sodt: val })
                      }
                    />
                    <FormField
                      label="Email"
                      value={formData.email}
                      editing={isEditing}
                      onChange={(val) =>
                        setFormData({ ...formData, email: val })
                      }
                    />

                    {/* Giới tính — select riêng vì là true/false, không dùng FormField text */}
                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                        Giới tính
                      </p>
                      {isEditing ? (
                        <select
                          value={formData.gioitinh}
                          onChange={(e) =>
                            setFormData({ ...formData, gioitinh: e.target.value })
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          <option value="true">Nam</option>
                          <option value="false">Nữ</option>
                        </select>
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">
                          {formData.gioitinh === "true" ? "Nam" : "Nữ"}
                        </p>
                      )}
                    </div>

                    <FormField
                      label="Ngày sinh"
                      value={formData.ngaysinh}
                      editing={isEditing}
                      type="date"
                      onChange={(val) =>
                        setFormData({ ...formData, ngaysinh: val })
                      }
                    />

                    {/* Khu vực phụ trách — chế độ xem: chỉ hiển thị tên.
                        Chế độ sửa: dropdown chọn tỉnh, cập nhật formData.areaId (giá trị thật gửi API)
                        và areaLabel (chỉ để hiển thị lại sau khi lưu). */}
                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                        Khu vực phụ trách
                      </p>
                      {isEditing ? (
                        <select
                          value={formData.areaId || ""}
                          disabled={loadingProvinces}
                          onChange={(e) => {
                            const areaId = e.target.value;
                            const picked = provinces.find((p) => p.id === areaId);
                            setFormData({ ...formData, areaId });
                            setAreaLabel(picked?.tenkhuvuc ?? "");
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          <option value="">
                            {loadingProvinces ? "Đang tải..." : "-- Chọn tỉnh/thành --"}
                          </option>
                          {provinces.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.tenkhuvuc}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm font-semibold text-gray-900 break-all">
                          {areaLabel || "—"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Số đội cứu hộ */}
                  <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-5">
                    <p className="text-sm font-medium text-emerald-700 mb-1">
                      Số đội cứu hộ phụ trách
                    </p>
                    <p className="text-3xl font-bold text-emerald-800">
                      {selected?.teamCount ?? 0}
                    </p>
                  </div>

                  {/* Danh sách đội */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">
                      Danh sách đội cứu hộ
                    </h3>
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="px-4 py-3">Tên đội</th>
                            <th className="px-4 py-3">Đội trưởng</th>
                            <th className="px-4 py-3 text-center">Số nhóm</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {teams.length > 0 ? (
                            teams.map((team) => (
                              <tr key={team.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                  {team.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {team.leaderName || "—"}
                                </td>
                                <td className="px-4 py-3 text-sm text-center text-gray-600">
                                  {team.groupCount ?? 0}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={3}
                                className="px-4 py-10 text-center text-sm text-gray-400"
                              >
                                Chưa có đội cứu hộ nào
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            {formData && !loadingDetail && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg transition shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleCloseDetail}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Đóng
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm"
                    >
                      <Pencil className="w-4 h-4" />
                      Cập nhật thông tin
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* Component FormField */
function FormField({
  label,
  value,
  editing,
  onChange,
  type = "text",
}: {
  label: string;
  value?: string | null;
  editing: boolean;
  onChange: (val: string) => void;
  type?: "text" | "date";
}) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </p>
      {editing ? (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      ) : (
        <p className="text-sm font-semibold text-gray-900 break-all">
          {value || "—"}
        </p>
      )}
    </div>
  );
}