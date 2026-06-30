import { useState, useMemo } from 'react'
import { Title } from '../components/Title'
import { Status } from '../components/Status'
import { AlertCard } from '../components/AlertCard'
import { useMyAlerts } from '../hooks/useAlert'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/store'

type FilterTab = 'ALL' | 'UNREAD' | 'READ'

export const AlertPage = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id) ?? ''
  const { alerts, loading, error } = useMyAlerts(userId)
  const [tab, setTab] = useState<FilterTab>('ALL')

  const filteredAlerts = useMemo(() => {
    if (tab === 'UNREAD') return alerts.filter((a) => a.status === 'PENDING')
    if (tab === 'READ') return alerts.filter((a) => a.status === 'SENT')
    return alerts
  }, [alerts, tab])

  return (
    <div>
      <Title />
      <Status active={tab} onChange={setTab} />

      {loading && <p className='text-center py-6'>Đang tải...</p>}
      {error && <p className='text-red-500 text-center py-6'>{error}</p>}

      {!loading &&
        filteredAlerts.map((alert, idx) => (
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

      {!loading && filteredAlerts.length === 0 && (
        <p className='text-gray-400 text-center py-10'>Không có cảnh báo nào</p>
      )}
    </div>
  )
}