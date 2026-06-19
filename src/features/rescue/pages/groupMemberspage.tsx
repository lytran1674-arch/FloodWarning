import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Crown, ArrowLeft } from "lucide-react";
import { rescueApi } from "../api/rescureApi";

export default function GroupMembersPage() {

  const { groupId } = useParams();

  const navigate = useNavigate();

  const [members, setMembers] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (!groupId) return;

    const load = async () => {

      try {

        setLoading(true);

        const data =
          await rescueApi.getMemberByGroup(
            groupId
          );

        const sorted =
          [...data].sort(
            (a,b) =>
              Number(b.isLeader) -
              Number(a.isLeader)
          );

        setMembers(sorted);

      } finally {

        setLoading(false);

      }

    };

    load();

  }, [groupId]);

  return (

    <div className="p-6">

      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex gap-2"
      >
        <ArrowLeft size={18}/>
        Quay lại
      </button>

      <h1 className="text-2xl font-bold mb-6">
        Thành viên nhóm
      </h1>

      {loading && (
        <p>Đang tải...</p>
      )}

      <div className="space-y-3">

        {members.map(member => (

          <div
            key={member.userId}
            className="
              border
              rounded-xl
              p-4
            "
          >

            <div className="flex justify-between">

              <div>

                <h3 className="font-medium">
                  {member.fullName}
                </h3>

                <p className="text-sm text-slate-500">
                  {member.phone}
                </p>

              </div>

              {member.isLeader && (

                <div className="
                  flex
                  items-center
                  gap-1
                  text-yellow-600
                ">
                  <Crown size={18}/>
                  Leader
                </div>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}