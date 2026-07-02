import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { ImportProvinceOperatorModal } from "../components/ImportProvinceOperatorModal";
import { useProvince } from "../hooks/useProvince";
import { provinceService } from "../services/provinceService";
import type {
  ProvinceOperatorDetail,
  RescueTeamItem,
} from "../types/provinceType";

export default function ListProvinceOperatorPage() {
  const { operators, loading, error, reload } = useProvince();

  const [importOpen, setImportOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [selected, setSelected] =
    useState<ProvinceOperatorDetail | null>(null);

  const [teams, setTeams] = useState<RescueTeamItem[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">
          Danh sách điều hành cấp tỉnh
        </h1>

        <button
          onClick={() => setImportOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <UploadCloud className="w-4 h-4" />
          Import danh sách
        </button>
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
              <th className="px-4 py-3">STT</th>
              <th className="px-4 py-3 text-left">Họ tên</th>
              <th className="px-4 py-3 text-left">Khu vực phụ trách</th>
            </tr>
          </thead>

          <tbody>
            {operators.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => handleViewDetail(item.id)}
                className="border-b hover:bg-gray-100 cursor-pointer"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{item.hoten}</td>
                <td className="px-4 py-3">{item.tenkhuvuc_phutrach}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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