import { AccountApi } from "../api/accountApi";
import type { Account } from "../type/accountType";

export const AccountService={
    async getAccount():Promise<Account>{
        return await AccountApi.getAccount()
    }
}