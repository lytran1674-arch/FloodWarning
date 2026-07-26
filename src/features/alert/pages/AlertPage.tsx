import { Title } from '../components/Title'
import { AlertCard } from '../components/AlertCard'
import { useMyAlerts } from '../hooks/useAlert'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/store'

export const AlertPage = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id) ?? ''
  const { alerts, loading, error } = useMyAlerts(userId)

  return (
    <div>
      <Title />

      {loading && <p className='text-center py-6'>Đang tải...</p>}
      {error && <p className='text-red-500 text-center py-6'>{error}</p>}

      {!loading &&
        alerts.map((alert, idx) => (
          <AlertCard
            key={idx}
            riskLevel={alert.riskLevel}
            tenkhuvuc={alert.tenkhuvuc}
            channel={alert.channel}
            status={alert.status}
            time={new Date(alert.createdAt).toLocaleTimeString('vi-VN')}
            date={new Date(alert.createdAt).toLocaleDateString('vi-VN')}
          />
        ))}

      {!loading && alerts.length === 0 && (
        <p className='text-gray-400 text-center py-10'>Không có cảnh báo nào</p>
      )}
    </div>
  )
}