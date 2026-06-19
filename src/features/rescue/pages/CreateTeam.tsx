// import { useMemo, useState } from "react";
// import { useArea } from "../../areas/hooks/useArea";
// import { rescueApi } from "../api/rescureApi";

// export const CreateTeam=()=> {
//   const { areas } = useArea();

//   const [teamName, setTeamName] = useState("");
//   const [description, setDescription] = useState("");

//   const [selectedArea, setSelectedArea] = useState<string | null>(null);
//   const [searchArea, setSearchArea] = useState("");
//   const [openArea, setOpenArea] = useState(false);

//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   const areaOptions = useMemo(() => {
//     return areas.flatMap((parent) =>
//       (parent.children ?? []).map((child) => ({
//         id: child.id,
//         label: `${parent.tenkhuvuc} > ${child.tenkhuvuc}`,
//       }))
//     );
//   }, [areas]);

//   const filteredAreas = areaOptions.filter((area) =>
//     area.label.toLowerCase().includes(searchArea.toLowerCase())
//   );

//   const handleCreateTeam = async () => {
//     try {
//       if (!teamName.trim()) {
//         alert("Vui lòng nhập tên đội cứu hộ");
//         return;
//       }

//       if (!selectedArea) {
//         alert("Vui lòng chọn khu vực");
//         return;
//       }

//       setLoading(true);

//       const payload = {
//         name: teamName,
//         description,
//         areaId: selectedArea,
//       };

//       console.log("Create Team Payload:", payload);

//       const teamResponse = await rescueApi.createTeam(payload);

//       console.log("Create Team Response:", teamResponse);

//       const teamId = teamResponse.result.id;

//       if (file) {
//         const importResponse =
//           await rescueApi.importRescuers(teamId, file);

//         console.log("Import Response:", importResponse);
//         console.log("File:", file);
//         alert(
//           `Tạo đội thành công.\nImport thành công: ${importResponse.result.success}\nImport lỗi: ${importResponse.result.failed}`
//         );
//       } else {
//         alert("Tạo đội cứu hộ thành công");
//       }

//       // Reset form
//       setTeamName("");
//       setDescription("");
//       setSelectedArea(null);
//       setSearchArea("");
//       setFile(null);
//     } catch (error) {
//       console.error(error);
//       alert("Có lỗi xảy ra khi tạo đội cứu hộ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 md:p-6">
//       <div className="mx-auto max-w-6xl">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold">Tạo đội cứu hộ</h1>
//           <p className="mt-1 text-gray-500">
//             Tạo đội cứu hộ và import danh sách thành viên từ file Excel
//           </p>
//         </div>

//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//           {/* Thông tin đội */}
//           <div className="rounded-xl border bg-white p-5 shadow-sm">
//             <h2 className="mb-4 text-lg font-semibold">
//               Thông tin đội cứu hộ
//             </h2>

//             <div className="space-y-4">
//               <div>
//                 <label className="mb-2 block text-sm font-medium">
//                   Tên đội
//                 </label>

//                 <input
//                   value={teamName}
//                   onChange={(e) => setTeamName(e.target.value)}
//                   placeholder="Nhập tên đội cứu hộ"
//                   className="w-full rounded-lg border p-3 outline-none focus:ring"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium">
//                   Khu vực
//                 </label>

//                 <div className="relative">
//                   <input
//                     value={searchArea}
//                     onFocus={() => setOpenArea(true)}
//                     onChange={(e) => {
//                       setSearchArea(e.target.value);
//                       setOpenArea(true);
//                     }}
//                     placeholder="Tìm kiếm khu vực..."
//                     className="w-full rounded-lg border p-3 outline-none focus:ring"
//                   />

//                   {openArea && (
//                     <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
//                       {filteredAreas.length > 0 ? (
//                         filteredAreas.map((area) => (
//                           <button
//                             key={area.id}
//                             type="button"
//                             className="block w-full px-4 py-3 text-left hover:bg-slate-100"
//                             onClick={() => {
//                               setSelectedArea(area.id);
//                               setSearchArea(area.label);
//                               setOpenArea(false);
//                             }}
//                           >
//                             {area.label}
//                           </button>
//                         ))
//                       ) : (
//                         <div className="p-3 text-sm text-gray-500">
//                           Không tìm thấy khu vực
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {selectedArea && (
//                   <p className="mt-2 text-xs text-green-600">
//                     Đã chọn khu vực
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium">
//                   Mô tả
//                 </label>

//                 <textarea
//                   rows={5}
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Nhập mô tả đội cứu hộ"
//                   className="w-full resize-none rounded-lg border p-3"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Upload Excel */}
//           <div className="rounded-xl border bg-white p-5 shadow-sm">
//             <h2 className="mb-4 text-lg font-semibold">
//               Import thành viên
//             </h2>

//             <div className="rounded-xl border-2 border-dashed p-8 text-center">
//               <input
//                 id="excelFile"
//                 type="file"
//                 accept=".xlsx,.xls"
//                 className="hidden"
//                 onChange={(e) =>
//                   setFile(e.target.files?.[0] || null)
//                 }
//               />

//               <label
//                 htmlFor="excelFile"
//                 className="cursor-pointer"
//               >
//                 <div className="mb-3 text-5xl">📄</div>

//                 <p className="font-medium">
//                   Chọn file Excel
//                 </p>

//                 <p className="mt-1 text-sm text-gray-500">
//                   Hỗ trợ .xlsx và .xls
//                 </p>
//               </label>

//               {file && (
//                 <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm">
//                   <strong>Đã chọn:</strong> {file.name}
//                 </div>
//               )}
//             </div>

//             <div className="mt-4 rounded-lg bg-blue-50 p-4">
//               <p className="mb-2 font-medium">
//                 Định dạng file Excel
//               </p>

//               <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
//                 <li>Họ tên</li>
//                 <li>Số điện thoại</li>
//                 <li>Địa chỉ</li>
//                 <li>Kỹ năng</li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
//           <button
//             type="button"
//             className="rounded-lg border px-5 py-3"
//           >
//             Hủy
//           </button>

//           <button
//             type="button"
//             disabled={loading}
//             onClick={handleCreateTeam}
//             className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
//           >
//             {loading
//               ? "Đang tạo..."
//               : "Tạo đội cứu hộ"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// //PickLEADER
// // import { rescueApi } from '../api/rescureApi';
// // import { RescuerTable } from '../components/RescuerTable'
// // import { useResCue } from '../hooks/useResCue'

// // export const QLRescuePage = () => {

// //   const handleSelectLeader = async (userId: string) => {
// //   try {
// //     await rescueApi.PickLeader(teamId, userId);

// //     alert("Chọn đội trưởng thành công");
// //   } catch (error) {
// //     console.error(error);
// //     alert("Có lỗi xảy ra");
// //   }
// // };
// //   const teamId="019ed9af-6b91-7297-86f7-14b2ee327ec2"
// //   const {rescue}=useResCue(teamId);
// //   return (
// //     <div>
// //       <RescuerTable data={rescue}
// //         onSelectLeader={handleSelectLeader}/>
// //     </div>
// //   )
// // }


// // //TẠO NHÓM 
// // import React from 'react'
// // import { CreateGroup } from '../components/CreateGroup'

// // export const QLRescuePage = () => {
// //   return (
// //     <div>
// //       <CreateGroup/>
// //     </div>
// //   )
// // }
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArea } from "../../areas/hooks/useArea";
import { rescueApi } from "../api/rescureApi";
import type { ResCue } from "../types/rescueType";
import { toast } from "react-toastify";

export const CreateTeam = () => {
  const navigate = useNavigate();
  const { areas } = useArea();

  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");

  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [searchArea, setSearchArea] = useState("");
  const [openArea, setOpenArea] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [members, setMembers] = useState<ResCue[]>([]);
  const [createdTeamId, setCreatedTeamId] = useState("");
  const [selectingLeader, setSelectingLeader] = useState(false);

  const areaOptions = useMemo(() => {
    return areas.flatMap((parent) =>
      (parent.children ?? []).map((child) => ({
        id: child.id,
        label: `${parent.tenkhuvuc} > ${child.tenkhuvuc}`,
      }))
    );
  }, [areas]);

  const filteredAreas = areaOptions.filter((area) =>
    area.label.toLowerCase().includes(searchArea.toLowerCase())
  );

  const handleCreateTeam = async () => {
    try {
      if (!teamName.trim()) {
        toast.warning("Vui lòng nhập tên đội cứu hộ");
        return;
      }

      if (!selectedArea) {
        toast.warning("Vui lòng chọn khu vực");
        return;
      }

      setLoading(true);

      const payload = {
        name: teamName,
        description,
        areaId: selectedArea,
      };

      const teamResponse = await rescueApi.createTeam(payload);

      const teamId = teamResponse.result.id;

    if (file) {
  const importResponse =
    await rescueApi.importRescuers(
      teamId,
      file
    );

  alert(
    `Import thành công ${importResponse.result.success} thành viên`
  );
}

      const importedMembers =
        await rescueApi.getTeamMembersWithoutGroup(teamId);

      setMembers(importedMembers);
      setCreatedTeamId(teamId);

      setShowLeaderModal(true);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi tạo đội cứu hộ");
    } finally {
      setLoading(false);
    }
  };
const handlePickLeader = async (userId: string) => {
  try {
    setSelectingLeader(true);

    console.log("TEAM ID:", createdTeamId);
    console.log("USER ID:", userId);

    await rescueApi.PickLeader(
      createdTeamId,
      userId
    );

    toast.success("Gán đội trưởng thành công");

    setShowLeaderModal(false);

    navigate("/rescue-management");
  } catch (error: any) {
    console.error(error);

    console.log(
      "BE ERROR:",
      error?.response?.data
    );

    toast.error(
      error?.response?.data?.message ||
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
            Tạo đội cứu hộ và import danh sách thành viên từ file Excel
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* THÔNG TIN ĐỘI */}
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
                    setTeamName(e.target.value)
                  }
                  placeholder="Nhập tên đội cứu hộ"
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
                    onFocus={() => setOpenArea(true)}
                    onChange={(e) => {
                      setSearchArea(e.target.value);
                      setOpenArea(true);
                    }}
                    placeholder="Tìm kiếm khu vực..."
                    className="w-full rounded-lg border p-3"
                  />

                  {openArea && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                      {filteredAreas.length > 0 ? (
                        filteredAreas.map((area) => (
                          <button
                            key={area.id}
                            type="button"
                            className="block w-full px-4 py-3 text-left hover:bg-slate-100"
                            onClick={() => {
                              setSelectedArea(area.id);
                              setSearchArea(area.label);
                              setOpenArea(false);
                            }}
                          >
                            {area.label}
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-500">
                          Không tìm thấy khu vực
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Mô tả
                </label>

                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Nhập mô tả đội cứu hộ"
                  className="w-full resize-none rounded-lg border p-3"
                />
              </div>

            </div>
          </div>

          {/* IMPORT EXCEL */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">

            <h2 className="mb-4 text-lg font-semibold">
              Import thành viên
            </h2>

            <div className="rounded-xl border-2 border-dashed p-8 text-center">

              <input
                id="excelFile"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
              />

              <label
                htmlFor="excelFile"
                className="cursor-pointer"
              >
                <div className="mb-3 text-5xl">
                  📄
                </div>

                <p className="font-medium">
                  Chọn file Excel
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Hỗ trợ .xlsx và .xls
                </p>
              </label>

              {file && (
                <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm">
                  <strong>Đã chọn:</strong> {file.name}
                </div>
              )}
            </div>

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

      {/* MODAL CHỌN LEADER */}
      {showLeaderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="w-full max-w-4xl rounded-xl bg-white p-6">

            <h2 className="mb-2 text-xl font-bold">
              Chọn đội trưởng
            </h2>

            <p className="mb-4 text-sm text-slate-500">
              Danh sách thành viên vừa import
            </p>

            <div className="max-h-[450px] overflow-auto border rounded-lg">

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
  {members.map((member) => (
    <tr
      key={member.userId}
      className="border-t"
    >
      <td className="p-3">
        {member.userId}
      </td>

      <td className="p-3">
        {member.fullName}
      </td>

      <td className="p-3">
        {member.phone}
      </td>

      <td className="p-3 text-center">
        <button
          disabled={selectingLeader}
          onClick={() =>
            handlePickLeader(member.userId)
          }
          className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
        >
          Chọn Leader
        </button>
      </td>
    </tr>
  ))}
</tbody>
              </table>

            </div>
{/* 
            <div className="mt-4 flex justify-end">
              <button
                onClick={() =>
                  navigate("/res-team")
                }
                className="rounded border px-4 py-2"
              >
                Bỏ qua
              </button>
            </div> */}

          </div>

        </div>
      )}

    </div>
  );
};