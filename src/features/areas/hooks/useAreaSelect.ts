import { useEffect, useMemo, useState } from "react";
import type {  Option } from "../../auth/types/authType";
import type { Area, AreaTree } from "../types/areaType";
import { areaService } from "../services/areaService";

export const useAreaSelect = () => {
  const [danhSachTinh, setDanhSachTinh] = useState<AreaTree[]>([]);
  const [danhSachPhuongXa, setDanhSachPhuongXa] = useState<Area[]>([]);

  const [tinhId, setTinhId] = useState("");
  const [phuongXaId, setPhuongXaId] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArea = async () => {
      setLoading(true);

      try {
        const data = await areaService.getAreas();
        setDanhSachTinh(data);
      } finally {
        setLoading(false);
      }
    };

    fetchArea();
  }, []);

  const handleChangeTinh = (id: string) => {
    setTinhId(id);
    setPhuongXaId("");

    const tinh = danhSachTinh.find((t) => t.id === id);

    setDanhSachPhuongXa(tinh?.children ?? []);
  };

  const tinhOptions: Option[] = useMemo(() => {
    return danhSachTinh.map((t) => ({
      value: t.id,
      label: t.tenkhuvuc,
    }));
  }, [danhSachTinh]);

  const phuongXaOptions: Option[] = useMemo(() => {
    return danhSachPhuongXa.map((p) => ({
      value: p.id,
      label: p.tenkhuvuc,
    }));
  }, [danhSachPhuongXa]);

  return {
    loading,

    tinhId,
    setTinhId: handleChangeTinh,

    phuongXaId,
    setPhuongXaId,

    tinhOptions,
    phuongXaOptions,

    danhSachTinh,
    danhSachPhuongXa,
  };
};