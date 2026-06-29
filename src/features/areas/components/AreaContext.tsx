import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AreaTree } from "../types/areaType";
import { areaService } from "../services/areaService";
import { useAppSelector } from "../../../hooks/redux.hooks";

type AreaContextType = {
  areas: AreaTree[];
  loading: boolean;
  fetchAreas: () => Promise<void>;
};

const AreaContext = createContext<AreaContextType | null>(null);

export const AreaProvider = ({ children }: { children: ReactNode }) => {
  const [areas, setAreas] = useState<AreaTree[]>([]);
  const [loading, setLoading] = useState(false);

  const token = useAppSelector(state => state.auth.accessToken);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const data = await areaService.getAreas();
      setAreas(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAreas();
    } else {
      setAreas([]); // clear khi logout
    }
  }, [token]);

  return (
    <AreaContext.Provider value={{ areas, loading, fetchAreas }}>
      {children}
    </AreaContext.Provider>
  );
};

export const useAreaContext = () => {
  const ctx = useContext(AreaContext);
  if (!ctx) throw new Error("useAreaContext phải dùng trong AreaProvider");
  return ctx;
};