import React, { useEffect } from 'react'
import { useResCue } from '../hooks/useResCue'
import { useAppSelector } from '@/hooks/redux.hooks';
import { InfTeam } from '../components/InfTeam';

export const InfTeamPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const teamId = user?.teamId;

  const { loading, detail, error, detailTeam } = useResCue(teamId ?? "");

  useEffect(() => {
    if (teamId) {
      detailTeam(teamId);
    }
  }, [teamId, detailTeam]);

  if (loading) {
    return <div>Đang tải...</div>;
  }


  if (error) {
    return <div className="text-red-600">{error}</div>;
  }


  if (!teamId) {
    return <div className="text-sm text-gray-500">Không có thông tin đội</div>;
  }

  if (!detail) {
  return <div className="text-sm text-gray-500">Không có dữ liệu đội</div>;
}
  return (
    <div>
      <InfTeam data={detail} />
    </div>
  );
}