import { useNavigate } from "react-router-dom";
import type { AreaTree } from "../types/areaType";
import { Table } from "../../../components/ui/Table";

interface Props {
  data: AreaTree[];
}

const flattenAreas = (areas: AreaTree[]): AreaTree[] => {
  return areas.flatMap((area) => [
    area,
    ...flattenAreas(area.children ?? []),
  ]);
};

export const AreaTable = ({ data }: Props) => {
  const navigate = useNavigate();

  const flatData = flattenAreas(data);

  const columns = [
    {
      title: "Tên khu vực",
      key: "tenkhuvuc" as keyof AreaTree,
      render: (item: AreaTree) => (
        <div
          style={{
            paddingLeft: `${(item.level - 1) * 24}px`,
          }}
        >
          {item.tenkhuvuc}
        </div>
      ),
    },
    { title: "Cấp độ", key: "level" as keyof AreaTree },
    { title: "Vĩ độ", key: "lat" as keyof AreaTree },
    { title: "Kinh độ", key: "lon" as keyof AreaTree },
  ];

  return (
    <Table<AreaTree>
      columns={columns}
      data={flatData}
      onRowClick={(item) => navigate(`/weather-data/${item.id}`)}
    />
  );
};