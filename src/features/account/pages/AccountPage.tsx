
import { InfomationUser } from "../components/InfomationUser";
import { UseAccount } from "../hooks/useAccount";

export const AccountPage = () => {
  const { account } = UseAccount();

  if (!account) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <InfomationUser data={account} />
    </div>
  );
};