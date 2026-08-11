import { useEffect, useState } from "react";
import type { Account } from "../type/accountType";
import { AccountService } from "../services/accountService";

export const UseAccount = () => {
  const [account, setAccount] = useState<Account>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getInfAccount = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await AccountService.getAccount();

      console.log("ACCOUNT:", res);

      setAccount(res);
    } catch (err:any) {
      const message: string = err.response?.data?.message;
      setError(message)
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInfAccount();
  }, []);

  return {
    error,
    account,
    loading,
    getInfAccount,
  };
};