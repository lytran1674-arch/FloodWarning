
import { OverviewCards } from '../component/OverViewCard'
import { ResourceCards } from '../component/ResourceCards'
import { FloodRiskStatistics } from '../component/FloodRiskStatistics'
import { SOSStatistics } from '../component/SOSStatistics'
import { useThongKe } from '../hook/useThongKe'
import { useEffect, useState } from 'react'

export const ThongKePage = () => {
  const { count,latestResult,filteredResult,sumSos,snapshot,getAiFloodPredictions } = useThongKe();
  const [selectedDate,setselectedDate]=useState("")
  const [selectedJobType,setselectedJobType]=useState()
   
   useEffect(() => {
       if (selectedDate && selectedJobType) {
           getAiFloodPredictions(selectedDate, selectedJobType);
       }
   }, [selectedDate, selectedJobType]);
  return (
     <div className="w-full lg:m-2">
      <OverviewCards
       totalSos={count?.totalSos}
  todaySos={count?.todaySos}
  pendingSos={count?.pendingSos}
  assignedSos={count?.assignedSos}
  processingSos={count?.processingSos}
  completedSos={count?.completedSos}
  cancelledSos={count?.cancelledSos}
       />
      <ResourceCards
       totalTeams={count?.totalTeams}
  totalGroups={count?.totalGroups}
  totalMembers={count?.totalMembers}
  totalDevices={count?.totalDevices}
      />
      <FloodRiskStatistics
      aiSummary={{
    totalAreas: latestResult?.totalAreas,
    lowRiskAreas: latestResult?.lowRiskAreas,
    mediumRiskAreas: latestResult?.mediumRiskAreas,
    highRiskAreas: latestResult?.highRiskAreas,
  }}
  aiTopRiskAreas={aiTopRiskAreas}

  aiotSummary={{
    totalAreas: snapshot?.totalAreas,
    lowRiskAreas: snapshot?.lowRiskAreas,
    mediumRiskAreas: snapshot?.mediumRiskAreas,
    highRiskAreas: snapshot?.highRiskAreas,
  }}
  aiotTopRiskAreas={aiotTopRiskAreas} />
      <SOSStatistics
      totalSos={sumSos?.totalSos}
  completedSos={sumSos?.completedSos}
  processingSos={sumSos?.processingSos}
  cancelledSos={sumSos?.cancelledSos}
  chartsumSos={sumSos?.chart ?? []}
  fromDate={fromDate}
  toDate={toDate}
  onFromDateChange={setFromDate}
  onToDateChange={setToDate}
  onApply={handleApply}
      />
    </div>
  )
}
