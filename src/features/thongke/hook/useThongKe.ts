import { useCallback, useEffect, useState } from "react";
import { type AiFloodPredictions, type AIIoT, type Overview, type SumRequestSoS } from "../type/thongkeType";
import { ThongKeService } from "../service/thongkeService";
import type { JobType } from "@/features/floodriskdata/types/floodriskType";

export const useThongKe = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [count, setCount] = useState<Overview>();
    const [latestResult, setLatestResult] = useState<AiFloodPredictions>();
    const [filteredResult, setFilteredResult] = useState<AiFloodPredictions>();
    const [snapshot, setSnapshot] = useState<AIIoT>();
    const [sumSos, setSumSos] = useState<SumRequestSoS>();


    const getDashboardStats = useCallback(async () => {
        try {
            setLoading(true);
            const res = await ThongKeService.getDashboardStats();
            setCount(res);
            return res;
        } catch (err) {
            console.error(err);
            setError("Có lỗi xảy ra!");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAiFloodPredictionsLatest = useCallback(async () => {
        try {
            setLoading(true);
            const res = await ThongKeService.getAiFloodPredictionsLatest();
            setLatestResult(res);
            return res;
        } catch (err) {
            console.error(err);
            setError("Có lỗi xảy ra!");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAiFloodPredictions = useCallback(async (date: string, jobType: JobType) => {
        try {
            setLoading(true);
            const res = await ThongKeService.getAiFloodPredictions(date, jobType);
            setFilteredResult(res);
            return res;
        } catch (err) {
            console.error(err);
            setError("Có lỗi xảy ra!");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAiIotFloodRisk = useCallback(async () => {
        try {
            setLoading(true);
            const res = await ThongKeService.getAiIotFloodRisk();
            setSnapshot(res);
            return res;
        } catch (err) {
            console.error(err);
            setError("Có lỗi xảy ra!");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

     const getSumRequestSoS = useCallback(async (from: string, to: string) => {
        try {
            setLoading(true);
            const res = await ThongKeService.getSumRequestSoS(from, to);
            setSumSos(res);
            return res;
        } catch (err) {
            console.error(err);
            setError("Có lỗi xảy ra!");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Chỉ gọi các API không cần tham số khi mount
    useEffect(() => {
        getDashboardStats();
        getAiFloodPredictionsLatest();
        getAiIotFloodRisk();
    }, [getDashboardStats, getAiFloodPredictionsLatest, getAiIotFloodRisk]);

    return {
        loading,
        error,
        count,
        latestResult,
        filteredResult,
        snapshot,
        sumSos,
        getDashboardStats,
        getAiFloodPredictionsLatest,
        getAiFloodPredictions,
        getAiIotFloodRisk,
        getSumRequestSoS
    };
};