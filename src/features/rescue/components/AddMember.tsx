import { useEffect, useState } from "react";
import { rescueApi } from "../api/rescureApi";
import { toast } from "react-toastify";

interface Props {
teamId: string;
onClose: () => void;
onSuccess: () => void;
}

interface Member {
userId: string;
fullName: string;
phone: string;
}

export const AddMember = ({
teamId,
onClose,
onSuccess,
}: Props) => {
const [step, setStep] = useState(1);

const [groupId, setGroupId] =
useState("");

const [groupName, setGroupName] =
useState("");

const [status, setStatus] =
useState("AVAILABLE");

const [hasBoat, setHasBoat] =
useState(false);

const [hasMedical, setHasMedical] =
useState(false);

const [notes, setNotes] =
useState("");

const [members, setMembers] =
useState<Member[]>([]);

const [selectedUsers, setSelectedUsers] =
useState<string[]>([]);

const [leaderId, setLeaderId] =
useState("");

const [loading, setLoading] =
useState(false);

const toggleMember = (
userId: string
) => {
setSelectedUsers((prev) =>
prev.includes(userId)
? prev.filter(
(id) => id !== userId
)
: [...prev, userId]
);
};

const createGroup = async () => {
try {
setLoading(true);

  const group =
    await rescueApi.CreateGroup(
      teamId,
      {
        name: groupName,
        status,
        hasBoat,
        hasMedical,
        notes,
      }
    );

  setGroupId(group.id);

  const availableMembers =
    await rescueApi.getTeamMembersWithoutGroup(
      teamId
    );

  setMembers(availableMembers);

  setStep(2);
} catch (err) {
  toast.error(
    "Tạo nhóm thất bại"
  );
} finally {
  setLoading(false);
}

};

const saveMembers = async () => {
try {
await rescueApi.addMemberToGroup(
  groupId,
  {
    userIds: selectedUsers,
  }
);


  setStep(3);
} catch {
  toast.error(
    "Thêm thành viên thất bại"
  );
}


};

const saveLeader = async () => {
try {
await rescueApi.pickLeaderGroup(
  groupId,
  {
    userId: leaderId,
  }
);


  toast.success(
    "Tạo nhóm thành công"
  );

  onSuccess();
} catch {
  toast.error(
    "Chọn nhóm trưởng thất bại"
  );
}


};

return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">


  <div className="w-full max-w-3xl rounded-xl bg-white p-6">

    <h2 className="mb-6 text-2xl font-bold">
      Tạo nhóm cứu hộ
    </h2>

    <div className="mb-6 flex gap-4">

      <div
        className={
          step >= 1
            ? "font-bold text-blue-600"
            : ""
        }
      >
        1. Tạo nhóm
      </div>

      <div
        className={
          step >= 2
            ? "font-bold text-blue-600"
            : ""
        }
      >
        2. Thành viên
      </div>

      <div
        className={
          step >= 3
            ? "font-bold text-blue-600"
            : ""
        }
      >
        3. Nhóm trưởng
      </div>

    </div>

    {step === 1 && (
      <div className="space-y-4">

        <input
          value={groupName}
          onChange={(e) =>
            setGroupName(
              e.target.value
            )
          }
          placeholder="Tên nhóm"
          className="w-full border rounded p-3"
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
          className="w-full border rounded p-3"
        >
          <option value="AVAILABLE">
            AVAILABLE
          </option>

          <option value="BUSY">
            BUSY
          </option>
        </select>

        <button
          onClick={createGroup}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Tạo nhóm
        </button>

      </div>
    )}

    {step === 2 && (
      <div>

        <h3 className="mb-4 font-semibold">
          Chọn thành viên
        </h3>

        <div className="space-y-2">

          {members.map((m) => (
            <label
              key={m.userId}
              className="flex gap-2"
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(
                  m.userId
                )}
                onChange={() =>
                  toggleMember(
                    m.userId
                  )
                }
              />

              {m.fullName}
            </label>
          ))}

        </div>

        <button
          onClick={saveMembers}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
        >
          Tiếp tục
        </button>

      </div>
    )}

    {step === 3 && (
      <div>

        <h3 className="mb-4 font-semibold">
          Chọn nhóm trưởng
        </h3>

        <select
          value={leaderId}
          onChange={(e) =>
            setLeaderId(
              e.target.value
            )
          }
          className="w-full border rounded p-3"
        >
          <option value="">
            Chọn nhóm trưởng
          </option>

          {members
            .filter((m) =>
              selectedUsers.includes(
                m.userId
              )
            )
            .map((m) => (
              <option
                key={m.userId}
                value={m.userId}
              >
                {m.fullName}
              </option>
            ))}
        </select>

        <button
          onClick={saveLeader}
          className="mt-4 rounded bg-green-600 px-4 py-2 text-white"
        >
          Hoàn tất
        </button>

      </div>
    )}

  </div>

</div>


);
};
