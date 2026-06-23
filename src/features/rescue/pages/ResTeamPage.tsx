import { useEffect, useState } from "react";
import { useArea } from "../../areas/hooks/useArea";
import { rescueApi } from "../api/rescureApi";
import type { ResTeam } from "../types/rescueType";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Plus } from "lucide-react";

export const ResTeamPage = () => {
  const { areas } = useArea();

  const [selectedArea, setSelectedArea] = useState("");
  const [teams, setTeams] = useState<ResTeam[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = user.role;
  const userTeamId = user.teamId;

  useEffect(() => {
    if (areas.length > 0 && !selectedArea) {
      const anGiang = areas.find((area) =>
        area.tenkhuvuc
          ?.toLowerCase()
          .includes("an giang")
      );

      if (anGiang) {
        setSelectedArea(anGiang.id);
      }
    }
  }, [areas, selectedArea]);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!selectedArea) {
        setTeams([]);
        return;
      }

      try {
        setLoading(true);

        const result =
          await rescueApi.getTeamByArea(
            selectedArea
          );

        const allTeams = Array.isArray(result)
          ? result
          : [];

        // ADMIN thấy tất cả đội
        if (role === "ADMIN") {
          setTeams(allTeams);
        }
        // LEADER và MEMBER chỉ thấy đội của mình
        else {
          setTeams(
            allTeams.filter(
              (team) =>
                team.id === userTeamId
            )
          );
        }
      } catch (error) {
        console.error(error);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [selectedArea, role, userTeamId]);

  const handleCreateTeam = () => {
    navigate("/create-team");
  };

  const handleTeamClick = (
    teamId: string
  ) => {
    navigate(
      `/res-teams/${teamId}/groups`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              Danh sách đội cứu hộ
            </h1>

            <p className="text-slate-500">
              Hiển thị các đội theo khu vực
            </p>
          </div>

          {/* Chỉ ADMIN được thêm đội */}
          {role === "ADMIN" && (
            <Button
              onClick={handleCreateTeam}
              className="text-black bg-yellow-600 lg:text-xl md:text-xl text-sm border border-yellow-400 h-10 p-4 rounded-md"
            >
              <Plus />
              Thêm đội cứu hộ
            </Button>
          )}
        </div>

        <div className="mb-6 bg-white p-4 rounded-xl border">
          <label className="block mb-2 text-sm font-medium">
            Khu vực
          </label>

          <select
            value={selectedArea}
            onChange={(e) =>
              setSelectedArea(
                e.target.value
              )
            }
            className="w-full md:w-96 border rounded-lg p-3"
          >
            <option value="">
              Chọn khu vực
            </option>

            {areas.map((area) => (
              <option
                key={area.id}
                value={area.id}
              >
                {area.tenkhuvuc}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="text-center py-10">
            Đang tải...
          </div>
        )}

        {!loading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() =>
                  handleTeamClick(team.id)
                }
                className="rounded-xl border bg-white p-4 shadow-sm cursor-pointer hover:shadow-md transition"
              >
                <div className="flex gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                    {team.name?.slice(0, 2)}
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {team.name}
                    </h3>

                    <p className="text-green-600 text-sm">
                      ● Đang hoạt động
                    </p>
                  </div>
                </div>

                <hr className="my-3" />

                <p className="text-sm">
                  <span className="text-slate-500">
                    Leader:
                  </span>{" "}
                  <strong>
                    {team.leaderName ??
                      "Chưa phân công"}
                  </strong>
                </p>
              </div>
            ))}
          </div>
        )}

        {!loading &&
          selectedArea &&
          teams.length === 0 && (
            <div className="bg-white border rounded-xl p-10 text-center">
              Không có đội cứu hộ nào
            </div>
          )}
      </div>
    </div>
  );
};