import { useState } from "react";
import { Plus, TrashIcon, UploadCloud } from "lucide-react";
import { ImportProvinceOperatorModal } from "../components/ImportProvinceOperatorModal";
import { useProvince } from "../hooks/useProvince";
import { provinceService } from "../services/provinceService";
import type {
  ProvinceOperatorDetail,
  RescueTeamItem,
} from "../types/provinceType";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ListProvinceOperatorPage() {
  const { operators, loading, error, reload,deleteProvinceOperator } = useProvince();

  const [importOpen, setImportOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const navigate=useNavigate()
  const [selected, setSelected] =
    useState<ProvinceOperatorDetail | null>(null);
  const [deleteMode, setDeleteMode] = useState(false);
const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [teams, setTeams] = useState<RescueTeamItem[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
const [openDelete, setOpenDelete] = useState(false);
  //hàm bỏ chọn 
  const toggleSelect = (id: string) => {
  setSelectedIds((prev) =>
    prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]
  );
};
  const handleViewDetail = async (id: string) => {
    try {
      setLoadingDetail(true);

      const detail = await provinceService.getProvinceOperatorDetail(id);
      const teamData = await provinceService.getTeamsByProvinceOperator(id);

      setSelected(detail);
      setTeams(teamData);

      setDetailOpen(true);
    } catch (err) {
      console.error(err);
      alert("Không thể tải thông tin điều hành.");
    } finally {
      setLoadingDetail(false);
    }
  };

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }
  const handleOnClick=()=>{
  navigate("/province_operator/add-member");
  }

const handleDelete = async () => {
  try {
    await deleteProvinceOperator({
      ids: selectedIds,
    });

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
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">
          Danh sách điều hành cấp tỉnh
        </h1>
    <div className="flex justify-end items-center gap-3">
       <button
          onClick={handleOnClick}
          className="flex items-center gap-2 bg-orange-400  text-black px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Thành viên
        </button>
        <button
          onClick={() => setImportOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <UploadCloud className="w-4 h-4" />
          Import danh sách
        </button>      
    {!deleteMode ? (
  <button
    onClick={() => setDeleteMode(true)}
    className="flex items-center gap-2 bg-red-200 px-4 py-2 rounded-lg"
  >
    <TrashIcon className="text-red-500" />
    <span className="text-red-500 font-medium">Xóa</span>
  </button>
) : (
  <>
    <button
      onClick={() => setOpenDelete(true)}
      disabled={selectedIds.length === 0}
      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
    >
      <TrashIcon size={18} />
      Xóa ({selectedIds.length})
    </button>

    <button
      onClick={() => {
        setDeleteMode(false);
        setSelectedIds([]);
      }}
      className="border px-4 py-2 rounded-lg"
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

      <div className="overflow-hidden rounded-lg shadow bg-white">
        <table className="min-w-full">
       <thead className="bg-slate-100">
  <tr>
    {deleteMode && (
      <th className="w-12 px-4 py-3"></th>
    )}

    <th className="px-4 py-3 text-center">STT</th>
    <th className="px-4 py-3 text-left">Họ tên</th>
    <th className="px-4 py-3 text-left">Khu vực phụ trách</th>
  </tr>
</thead>

         <tbody>
{operators.map((item,index)=>(
<tr
    key={item.id}
    onClick={()=>{
        if(!deleteMode){
            handleViewDetail(item.id);
        }
    }}
    className="border-b hover:bg-gray-100 cursor-pointer"
>

    {deleteMode && (
       <td className="px-4 py-3 text-center">
  <input
    type="checkbox"
    checked={selectedIds.includes(item.id)}
    onClick={(e) => e.stopPropagation()}
    onChange={() => toggleSelect(item.id)}
    className="h-4 w-4 rounded border-gray-300 accent-red-600"
  />
</td>
    )}

   <td className="px-4 py-3 text-center">
  {index + 1}
</td>

<td className="px-4 py-3">
  {item.hoten}
</td>

<td className="px-4 py-3">
  {item.tenkhuvuc_phutrach}
</td>

</tr>
))}
</tbody>
        </table>
      </div>

      {/* Modal */}

      {openDelete && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <TrashIcon className="text-red-600" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            Xác nhận xóa
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Bạn có chắc muốn xóa{" "}
            <span className="font-semibold text-red-600">
              {selectedIds.length}
            </span>{" "}
            điều phối viên?
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setOpenDelete(false)}
          className="rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          Hủy
        </button>

        <button
          onClick={handleDelete}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Xóa
        </button>
      </div>
    </div>
  </div>
)}


      {detailOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[700px] max-h-[85vh] overflow-y-auto p-6">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">
                Chi tiết điều hành cấp tỉnh
              </h2>

              <button
                onClick={() => setDetailOpen(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {loadingDetail ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : (
              selected && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="font-semibold">Họ tên</p>
                      <p>{selected.hoten}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Số điện thoại</p>
                      <p>{selected.sodt}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Email</p>
                      <p>{selected.email}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Khu vực phụ trách</p>
                      <p>{selected.tenKhuVucPhuTrach}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Số đội cứu hộ</p>
                      <p>{selected.teamCount}</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3">
                    Danh sách đội cứu hộ
                  </h3>

                  <table className="w-full border rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-3 py-2">Tên đội</th>
                        <th className="border px-3 py-2">Đội trưởng</th>
                        <th className="border px-3 py-2">Số nhóm</th>
                      </tr>
                    </thead>

                    <tbody>
                      {teams.length > 0 ? (
                        teams.map((team) => (
                          <tr key={team.id}>
                            <td className="border px-3 py-2">
                              {team.name}
                            </td>
                            <td className="border px-3 py-2">
                              {team.leaderName}
                            </td>
                            <td className="border px-3 py-2 text-center">
                              {team.groupCount}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="border px-3 py-4 text-center text-gray-500"
                          >
                            Chưa có đội cứu hộ.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}