import { AreaTable } from "../components/AreaTable"
import { AreaTree } from "../components/AreaTree"
import { useArea } from "../hooks/useArea"

export const AreaPage = () => {
  const { areas, loading } = useArea();

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-12 md:col-span-3 bg-white rounded shadow p-3">
        <AreaTree areas={areas} />
      </div>
      <div className="col-span-12 md:col-span-9 bg-white rounded shadow p-3">
        <p className="font-bold mb-3">Quản lý khu vực</p>
        <AreaTable data={areas} />
      </div>
    </div>
  );
};