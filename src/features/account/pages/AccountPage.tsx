import { AccountForm } from "../components/AccountForm";
import { UseAccount } from "../hooks/useAccount";

export const AccountPage = () => {
  const { account } = UseAccount();

  if (!account) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <AccountForm data={account} />
    </div>
  );
};