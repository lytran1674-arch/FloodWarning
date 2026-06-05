import { useState, useEffect, useCallback } from "react";

export const useSearch = <T>(
  searchFn: (keyword: string) => Promise<T[]>,
  defaultData: T[] = [],
  mode: "auto" | "manual" = "auto"
) => {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState<T[]>(defaultData);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!keyword.trim()) setResult(defaultData);
  }, [defaultData]);

  const search = useCallback(async (kw: string) => {
    if (!kw.trim()) {
      setResult(defaultData);
      return;
    }
    try {
      setSearching(true);
      const data = await searchFn(kw);
      setResult(data);
    } catch {
      console.error("Lỗi tìm kiếm");
    } finally {
      setSearching(false);
    }
  }, [searchFn, defaultData]);

  useEffect(() => {
    if (mode !== "auto") return;
    const timer = setTimeout(() => search(keyword), 300);
    return () => clearTimeout(timer);
  }, [keyword, mode]);

  const onSearch = useCallback(() => {
    if (mode === "manual") search(keyword);
  }, [keyword, mode, search]);

  return { keyword, setKeyword, result, searching, onSearch };
};