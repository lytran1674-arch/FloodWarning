import { Header } from "../../../components/sidebar/header"
import { Menu } from "../../../components/sidebar/Menu"
import { AreaTable } from "../components/AreaTable"
import { AreaTree } from "../components/AreaTree"

import { useArea } from "../hooks/useArea"

import { buildTree } from "../utils/buildTree"

export const AreaPage = () => {
  const { areas, loading } = useArea();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const treeData = buildTree(areas);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Header
        title="HỆ THỐNG CẢNH BÁO VÀ CỨU HỘ LŨ LỤT"
        bgColor="bg-[#1E4DAF]"
        textColor="text-white"
      />

      <Menu textColor="text-white"  text={[
    "Quản lý khu vực",
    "Quản lý người dùng",
    "Quản lý cứu hộ",
  ]} bgColor="bg-blue-600" />

      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-12 md:col-span-3 bg-white rounded shadow p-3">
          <AreaTree areas={treeData} />
        </div>

        <div className="col-span-12 md:col-span-9 bg-white rounded shadow p-3">
          <p className="font-bold mb-3">Nội dung bên phải</p>
          <AreaTable data={areas} />
        </div>
      </div>
    </div>
  );
};