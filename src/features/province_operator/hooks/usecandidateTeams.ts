// src/features/province_operator/hooks/useCandidateTeams.ts

import { toast } from "react-toastify";
import { provinceApi } from "../api/provinceApi";
import { useEffect, useState } from "react";
import type { CandidateTeam } from "../types/provinceType";

export function useCandidateTeams(requestId: string | undefined) {
  const [teams, setTeams] = useState<CandidateTeam[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!requestId) {
      console.warn("⚠️ requestId is undefined, skip fetching");
      return;
    }

    console.log("📤 Fetching candidate teams for requestId:", requestId);

    let cancelled = false;

    const fetchTeams = async () => {
      setLoading(true);
      try {
        const result = await provinceApi.getCandidateTeams(requestId);
        console.log("✅ API response:", result);
        if (!cancelled) setTeams(result);
        
      } catch (err: any) {
        console.error("❌ API error:", err);
        if (!cancelled) {
          toast.error(err?.response?.data?.message || "Không tải được danh sách đội");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTeams();

    return () => {
      cancelled = true;
      
    };
  }, [requestId]);

  return { teams, loading };
}
