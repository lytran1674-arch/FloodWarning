// // src/features/province_operator/hooks/useCandidateTeams.ts

// import { toast } from "react-toastify";
// import { provinceApi } from "../api/provinceApi";
// import { useEffect, useState } from "react";
// import type { CandidateTeam } from "../types/provinceType";

// export function useCandidateTeams(requestId: string | undefined) {
//   const [teams, setTeams] = useState<CandidateTeam[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!requestId) {
//       console.warn("⚠️ requestId is undefined, skip fetching");
//       return;
//     }

//     console.log("📤 Fetching candidate teams for requestId:", requestId);

//     let cancelled = false;

//     const fetchTeams = async () => {
//       setLoading(true);
//       try {
//         const result = await provinceApi.getCandidateTeams(requestId);
//         console.log("✅ API response:", result);
//         if (!cancelled) setTeams(result);
        
//       } catch (err: any) {
//         console.error("❌ API error:", err);
//         if (!cancelled) {
//           toast.error(err?.response?.data?.message || "Không tải được danh sách đội");
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     fetchTeams();

//     return () => {
//       cancelled = true;
      
//     };
//   }, [requestId]);

//   return { teams, loading };
// }


// src/features/province_operator/hooks/useCandidateTeams.ts

import { toast } from "react-toastify";
import { provinceApi } from "../api/provinceApi";
import { useCallback, useState } from "react";
import type { CandidateTeam } from "../types/provinceType";

export function useCandidateTeams() {
  const [teamsByItem, setTeamsByItem] = useState<Record<string, CandidateTeam[]>>({});
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  // Gọi trực tiếp mỗi khi user mở 1 item -> lưu kết quả đúng theo itemId của lần gọi đó,
  // không dựa vào state "đang chọn item nào" để tránh ghi nhầm key khi user đổi item nhanh.
  const fetchCandidateTeams = useCallback(async (itemId: string): Promise<boolean> => {
    setLoadingItemId(itemId);
    try {
      const result = await provinceApi.getCandidateTeams(itemId);
      setTeamsByItem((prev) => ({ ...prev, [itemId]: result }));
      return true;
    } catch (err: any) {
      console.error("❌ API error:", err);
      toast.error(err?.response?.data?.message || "Không tải được danh sách đội");
      return false;
    } finally {
      setLoadingItemId((current) => (current === itemId ? null : current));
    }
  }, []);

  return { teamsByItem, loadingItemId, fetchCandidateTeams };
}