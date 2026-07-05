// src/features/province_operator/hooks/useCandidateTeams.ts

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { provinceApi } from "../api/provinceApi";
import type { CandidateTeam } from "../types/provinceType";

// ======================================================
// USE CANDIDATE TEAMS
// Hook dùng chung để fetch danh sách đội cứu hộ ứng viên cho
// 1 support request. Được dùng ở cả SupportRequestReviewPage
// (để tính toán phân bổ nhóm/duyệt) và CandidateTeamsPanel
// (để hiển thị UI), tránh fetch trùng lặp và đảm bảo cả 2 nơi
// dùng chung 1 nguồn dữ liệu.
//
// Endpoint: GET /support-request/{requestId}/candidate-teams
// ======================================================

export function useCandidateTeams(requestId: string | undefined) {
  const [teams, setTeams] = useState<CandidateTeam[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!requestId) return;

    let cancelled = false;

    const fetchTeams = async () => {
      setLoading(true);

      try {
        const result = await provinceApi.getCandidateTeams(requestId);
        if (!cancelled) {
          setTeams(result);
        }
      } catch (err: any) {
        console.error("GET TEAM ERROR:", err);
        if (!cancelled) {
          toast.error(
            err?.response?.data?.message || "Không tải được danh sách đội"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTeams();

    return () => {
      cancelled = true;
    };
  }, [requestId]);

  return { teams, loading };
}