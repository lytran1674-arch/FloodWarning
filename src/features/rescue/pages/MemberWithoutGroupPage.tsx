import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Select, Popconfirm, Spin } from "antd";
import {
  UserPlus,
  Trash2,
  ArrowLeft,
  Pen,
  Search,
  Phone,
  Users,
  X,
  Mail,
} from "lucide-react";
import { toast } from "react-toastify";

import { rescueApi } from "../api/rescureApi";
import { useAvailableMembers } from "../hooks/useAvailableMembers";
import { useAppSelector } from "@/hooks/redux.hooks";
import { useResCue } from "../hooks/useResCue";
import MemberDetailModal from "../components/MemberDetailModal";

export default function MemberWithoutGroupPage() {
  // =====================================================
  // USER / ROLE
  // =====================================================

  const user = useAppSelector((state) => state.auth.user);

  const leaderTeam = user?.isTeamLeader === true;
  const admin = user?.role === "ADMIN";

  // =====================================================
  // ROUTER
  // =====================================================

  const { teamId } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // MEMBERS
  // =====================================================

  const {
    members,
    groups,
    loading: membersLoading,
    refresh,
  } = useAvailableMembers(teamId);

  // =====================================================
  // SEARCH + DETAIL + UPDATE
  // =====================================================

  const {
    searchRescue,
    search,
    detailMember,
    detailMemberTeam,
    updateResCue,
    loading: searchLoading, // hook dùng chung "loading" cho search / detail / update
  } = useResCue(teamId ?? "");

  const [keyword, setKeyword] = useState("");

  // =====================================================
  // SELECTED GROUP
  // =====================================================

  const [selectedGroup, setSelectedGroup] = useState<Record<string, string>>({});

  // =====================================================
  // DETAIL / UPDATE MODAL
  // =====================================================

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(
    null
  );

  const handleOpenDetail = async (userId: string) => {
    setSelectedMemberId(userId);
    setDetailModalOpen(true);

    try {
      await detailMemberTeam(userId);
    } catch {
      toast.error("Không lấy được chi tiết thành viên.");
      setDetailModalOpen(false);
    }
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setSelectedMemberId(null);
  };

  // =====================================================
  // SEARCH DEBOUNCE
  // =====================================================

  useEffect(() => {
    const value = keyword.trim();

    // Nếu xóa keyword thì quay lại danh sách ban đầu
    if (!value) {
      return;
    }

    const timer = setTimeout(() => {
      searchRescue(value);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [keyword, searchRescue]);

  // =====================================================
  // DATA HIỂN THỊ
  // =====================================================

  const displayMembers =
    keyword.trim().length > 0 ? search ?? [] : members;

  // =====================================================
  // AVATAR
  // =====================================================

  const getAvatarText = (fullName?: string) => {
    if (!fullName) {
      return "U";
    }

    const words = fullName.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const handleClearSearch = () => {
    setKeyword("");
  };

  // =====================================================
  // ADD MEMBER TO GROUP
  // =====================================================

  const handleAdd = async (userId: string) => {
    const groupId = selectedGroup[userId];

    if (!groupId) {
      toast.warning("Vui lòng chọn nhóm.");
      return;
    }

    try {
      await rescueApi.addMemberToGroup(groupId, {
        userIds: [userId],
      });

      toast.success("Đã thêm thành viên vào nhóm.");

      // Refresh danh sách
      refresh();

      // Xóa group đã chọn
      setSelectedGroup((prev) => {
        const newState = { ...prev };

        delete newState[userId];

        return newState;
      });
    } catch (e: any) {
      toast.error(
        e.response?.data?.message ??
          "Không thể thêm thành viên."
      );
    }
  };

  // =====================================================
  // DELETE MEMBER FROM TEAM
  // =====================================================

  const handleDelete = async (userId: string) => {
    if (!teamId) {
      return;
    }

    try {
      await rescueApi.removeMemberteam(
        teamId,
        userId
      );

      toast.success(
        "Đã xóa thành viên khỏi đội."
      );

      refresh();
    } catch (e: any) {
      toast.error(
        e.response?.data?.message ??
          "Không thể xóa thành viên."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  const loading =
    membersLoading || searchLoading;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-full bg-slate-50/50 px-6 py-6">

      {/* =================================================
          BACK
      ================================================= */}
    <div className="mb-7 flex justify-start gap-3">
      <button
        onClick={() => navigate(-1)}
        className="
          flex
          items-center
          gap-2
          mb-6
          text-slate-500
          hover:text-slate-800
          transition
        "
      >
        <ArrowLeft size={25} className="text-slate-800" />

      </button>

      {/* =================================================
          HEADER
      ================================================= */}

  
<div>
        <h1
          className="
            text-3xl
            font-bold
            text-slate-800
          "
        >
          Thành viên chưa có Group
        </h1>

        <p
          className="
            text-slate-500
            mt-1
          "
        >
          Danh sách thành viên chưa được phân nhóm.
        </p>
</div>
      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="mb-6">

        <div
          className="
            relative
            w-full
            max-w-[600px]
          "
        >

          {/* SEARCH ICON */}

          <Search
            size={19}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              pointer-events-none
            "
          />

          {/* INPUT */}

          <input
            type="text"
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            placeholder="
              Tìm kiếm theo tên hoặc số điện thoại...
            "
            className="
              w-full
              h-12
              pl-11
              pr-11
              rounded-xl
              border
              border-slate-200
              bg-white
              text-sm
              text-slate-700
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-emerald-500
              focus:ring-2
              focus:ring-emerald-100
            "
          />

          {/* CLEAR */}

          {keyword && !searchLoading && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                w-7
                h-7
                rounded-full
                flex
                items-center
                justify-center
                text-slate-400
                hover:bg-slate-100
                hover:text-slate-600
                transition
              "
            >
              <X size={16} />
            </button>
          )}

        </div>

      </div>
      

      {/* =================================================
          SEARCH RESULT INFO
      ================================================= */}

      {keyword.trim() && (
        <div className="mb-4 text-sm text-slate-500">

          Kết quả tìm kiếm cho{" "}

          <span className="font-semibold text-slate-700">
            "{keyword}"
          </span>

        </div>
      )}

      {/* =================================================
          MEMBER LIST
      ================================================= */}

      <div className="space-y-3">

        {/* LOADING */}

        {loading ? (
          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              py-20
              flex
              items-center
              justify-center
            "
          >
            <div className="flex items-center gap-3 text-slate-500">
              <Spin size="small" />
              <span>Đang tải dữ liệu...</span>
            </div>
          </div>
        ) : (
          <>
            {/* MEMBERS */}

            {displayMembers.map((member) => (

              <div
                key={member.userId}
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  px-5
                  py-4
                  shadow-sm
                  hover:shadow-md
                  transition-all
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-6
                  "
                >

                  {/* =================================================
                      MEMBER INFO
                  ================================================= */}

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      min-w-0
                    "
                  >

                    {/* AVATAR */}

                    <div
                      className="
                        w-14
                        h-14
                        rounded-full
                        bg-emerald-50
                        text-emerald-600
                        flex
                        items-center
                        justify-center
                        font-bold
                        text-lg
                        shrink-0
                      "
                    >
                      {getAvatarText(
                        member.fullName
                      )}
                    </div>

                    {/* INFO */}

                    <div className="min-w-0">

                      <h2
                        className="
                          font-semibold
                          text-[17px]
                          text-slate-800
                          truncate
                        "
                      >
                        {member.fullName}
                      </h2>

                      <div
                        className="
                          flex
                          items-center
                          gap-1.5
                          mt-1
                          text-sm
                          text-slate-500
                        "
                      >
                        <Phone size={15} />

                        <span>
                          {member.phone}
                        </span>
                      </div>
                       <div
                        className="
                          flex
                          items-center
                          gap-1.5
                          mt-1
                          text-sm
                          text-slate-500
                        "
                      >
                        <Mail size={15} />

                        <span>
                          {member.email}
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      STATUS
                  ================================================= */}

                  <div
                    className="
                      hidden
                      xl:flex
                      items-center
                      gap-2
                      px-3
                      py-2
                      rounded-lg
                      bg-slate-50
                      text-sm
                      text-slate-600
                      whitespace-nowrap
                    "
                  >

                    <span
                      className="
                        w-2
                        h-2
                        rounded-full
                        bg-emerald-500
                      "
                    />

                    Chưa có nhóm

                  </div>

                  {/* =================================================
                      ADMIN
                  ================================================= */}

                  {admin && (
                    <Button
                      className="
                        h-10
                        border-blue-600
                        text-blue-600
                        hover:!border-blue-700
                        hover:!text-blue-700
                        shrink-0
                      "
                      icon={<Pen size={16} />}
                      onClick={() =>
                        handleOpenDetail(member.userId)
                      }
                    >
                      Cập nhật
                    </Button>
                  )}

                  {/* =================================================
                      TEAM LEADER
                  ================================================= */}

                  {leaderTeam && (
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        shrink-0
                      "
                    >

                      {/* SELECT GROUP */}

                      <Select
                        placeholder="Chọn nhóm"
                        style={{
                          width: 190,
                          height: 42,
                        }}
                        value={
                          selectedGroup[
                            member.userId
                          ]
                        }
                        onChange={(value) =>
                          setSelectedGroup(
                            (prev) => ({
                              ...prev,
                              [member.userId]:
                                value,
                            })
                          )
                        }
                        suffixIcon={
                          <Users size={16} />
                        }
                      >

                        {groups.map((group) => (

                          <Select.Option
                            key={group.id}
                            value={group.id}
                          >
                            {group.name}
                          </Select.Option>

                        ))}

                      </Select>

                      {/* ADD */}

                      <Button
                        type="primary"
                        icon={
                          <UserPlus size={16} />
                        }
                        onClick={() =>
                          handleAdd(
                            member.userId
                          )
                        }
                        className="
                          h-[42px]
                          px-5
                          bg-emerald-600
                          hover:!bg-emerald-700
                        "
                      >
                        Thêm vào nhóm
                      </Button>

                      {/* DELETE */}

                      <Popconfirm
                        title="Xóa thành viên?"
                        description="
                          Sau khi xóa sẽ không thể đăng nhập.
                        "
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{
                          danger: true,
                        }}
                        onConfirm={() =>
                          handleDelete(
                            member.userId
                          )
                        }
                      >

                        <Button
                          danger
                          icon={
                            <Trash2 size={16} />
                          }
                          className="
                            h-[42px]
                            px-5
                          "
                        >
                          Xóa khỏi đội
                        </Button>

                      </Popconfirm>

                    </div>
                  )}

                </div>

              </div>

            ))}

            {/* =================================================
                EMPTY
            ================================================= */}

            {displayMembers.length === 0 && (
              <div
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  text-center
                  py-20
                  mt-4
                "
              >

                <div
                  className="
                    w-14
                    h-14
                    mx-auto
                    rounded-full
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                    mb-4
                  "
                >
                  <Users
                    size={25}
                    className="text-slate-400"
                  />
                </div>

                <p className="text-slate-500">

                  {keyword.trim()
                    ? "Không tìm thấy thành viên phù hợp."
                    : "Không còn thành viên nào chưa có group."}

                </p>

              </div>
            )}

          </>
        )}

      </div>

      {/* =================================================
          FOOTER COUNT
      ================================================= */}

      {!loading &&
        displayMembers.length > 0 && (

          <div
            className="
              mt-5
              text-sm
              text-slate-500
            "
          >

            Hiển thị{" "}

            <span
              className="
                font-medium
                text-slate-700
              "
            >
              {displayMembers.length}
            </span>{" "}

            thành viên

          </div>
        )}

      {/* =================================================
          MEMBER DETAIL / UPDATE MODAL
      ================================================= */}

      <MemberDetailModal
        open={detailModalOpen}
        memberId={selectedMemberId}
        detail={detailMember}
        loading={searchLoading}
        onClose={handleCloseDetail}
        onUpdate={updateResCue}
        onUpdated={() => {
          refresh();
          handleCloseDetail();
        }}
      />

    </div>
  );
}