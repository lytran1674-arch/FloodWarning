import { OverviewCards } from '../component/OverViewCard'
import { ResourceCards } from '../component/ResourceCards'
import { FloodRiskStatistics } from '../component/FloodRiskStatistics'
import { SOSStatistics } from '../component/SOSStatistics'
import { useThongKe } from '../hook/useThongKe'
import { useEffect, useState } from 'react'
import type { JobType } from '@/features/floodriskdata/types/floodriskType'

export const ThongKePage = () => {
  const {
    count,
    latestResult,
    filteredResult,
    sumSos,
    snapshot,
    getAiFloodPredictions,
    getSumRequestSoS,
  } = useThongKe();

  // Filter cho phần "Dự báo lũ bằng AI"
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedJobType, setSelectedJobType] = useState<JobType | "">("");

  // Filter cho phần "Thống kê yêu cầu cứu hộ (SOS)"
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    if (selectedDate && selectedJobType) {
      getAiFloodPredictions(selectedDate, selectedJobType as JobType);
    }
  }, [selectedDate, selectedJobType, getAiFloodPredictions]);

  // Có filter thì dùng filteredResult, chưa có thì dùng latestResult
  const aiSummarySource = selectedDate && selectedJobType ? filteredResult : latestResult;

  const handleApplySosFilter = () => {
    if (fromDate && toDate) {
      getSumRequestSoS(fromDate, toDate);
    }
  };

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
          totalAreas: aiSummarySource?.totalAreas,
          lowRiskAreas: aiSummarySource?.lowRiskAreas,
          mediumRiskAreas: aiSummarySource?.mediumRiskAreas,
          highRiskAreas: aiSummarySource?.highRiskAreas,
        }}
        aiTopRiskAreas={aiSummarySource?.topHighRiskAreas ?? []}
        aiDate={selectedDate}
        aiJobType={selectedJobType}
        onDateChange={setSelectedDate}
        onJobTypeChange={(jobType) => setSelectedJobType(jobType as JobType)}
        aiotSummary={{
          totalAreas: snapshot?.totalAreas,
          lowRiskAreas: snapshot?.lowRiskAreas,
          mediumRiskAreas: snapshot?.mediumRiskAreas,
          highRiskAreas: snapshot?.highRiskAreas,
        }}
        aiotTopRiskAreas={snapshot?.topHighAreas ?? []}
      />
      <SOSStatistics
        totalSos={sumSos?.totalSos}
        completedSos={sumSos?.completedSos}
        processingSos={sumSos?.processingSos}
        cancelledSos={sumSos?.cancelledSos}
        chartData={sumSos?.chart ?? []}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onApply={handleApplySosFilter}
      />
    </div>
  )
}