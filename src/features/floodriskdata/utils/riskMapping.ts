export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'DANGER';

export const getHighestRisk = (item: any): RiskLevel => {
  const risks = [item.lead1, item.lead2, item.lead3];
  if (risks.includes('DANGER')) return 'DANGER';
  if (risks.includes('HIGH')) return 'HIGH';
  if (risks.includes('MEDIUM')) return 'MEDIUM';
  return 'LOW';
};

export const getRiskColor = (risk: RiskLevel): string => {
  switch (risk) {
    case 'DANGER': return '#FF0000';
    case 'HIGH': return '#FF6600';
    case 'MEDIUM': return '#FFCC00';
    default: return '#00AA00';
  }
};

export const hasDanger = (forecastData: any[]): boolean => {
  return forecastData.some(item => 
    item.lead1 === 'DANGER' || item.lead2 === 'DANGER' || item.lead3 === 'DANGER'
  );
};