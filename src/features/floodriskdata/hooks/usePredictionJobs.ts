import { useEffect, useState } from "react";
import type {
  PredictionJobs,
  PredictionJobsDetail,
} from "../types/floodriskType";
import { FloodriskdataService } from "../services/floodriskService";

export const usePredictionJobs = () => {
  const [predictjobs, setPredictionJobs] = useState<PredictionJobs[]>([]);
  const [detail, setDetail] = useState<PredictionJobsDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getListPredictionJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await FloodriskdataService.getPredictionJobs();
      setPredictionJobs(res);
    } catch (err:any) {
      const message: string = err.response?.data?.message;
      setError(message)
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDetailPredictionJob = async (id: string) => {
    try {
      setLoading(true);

      const res = await FloodriskdataService.getPredictionJobDetail(id);
      setDetail(res);
    } catch (err:any) {
      const message: string = err.response?.data?.message;
      setError(message)
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListPredictionJobs();
  }, []);

  return {
    predictjobs,
    detail,
    loading,
    error,
    getListPredictionJobs,
    getDetailPredictionJob,
  };
};