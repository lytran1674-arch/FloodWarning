
import { FloodRiskTable } from '../components/FloodRiskTable'
import { useFloodRiskData } from '../hooks/useFloodRiskData'

export const FloodRisk = () => {
      const { floodRiskData, loading } = useFloodRiskData()

  if (loading) return <div>Đang tải dữ liệu...</div>
  return (
  <FloodRiskTable data={floodRiskData}/>
  )
}
