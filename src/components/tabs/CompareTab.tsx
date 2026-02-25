import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '../../lib/format';

export function CompareTab() {
  const { state, metrics } = useProject();
  const scenarios = [
    {
      id: 'base',
      title: 'Scenario Base',
      case: metrics.cases[0],
      score: metrics.returnScore,
      status: metrics.activeVerdict,
    },
    {
      id: 'down',
      title: 'Scenario Downside',
      case: metrics.cases[1],
      score: Math.max(0, metrics.returnScore - 12),
      status: metrics.cases[1].headroomPct >= 0 ? 'Borderline' : 'Overpriced',
    },
    {
      id: 'up',
      title: 'Scenario Upside',
      case: metrics.cases[2],
      score: Math.min(100, metrics.returnScore + 10),
      status: metrics.cases[2].headroomPct >= state.safetyHeadroomThresholdPct ? 'Good' : 'Borderline',
    },
  ];

  const statusIcon = (status: string) => {
    if (status === 'Good') return <CheckCircle2 size={16} className="text-emerald-600" />;
    if (status === 'Borderline') return <AlertTriangle size={16} className="text-orange-600" />;
    return <XCircle size={16} className="text-red-600" />;
  };

  const activeUses = state.uses.filter((u) => u.enabled);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scenario Comparison Board</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Side-by-side Base, Downside, and Upside scenario output from the current assumption set.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{scenario.title}</h3>
                <span className="text-sm font-bold">{scenario.score}/100</span>
              </div>
            </div>

            <div className="p-4 space-y-3 text-sm">
              <div className="flex justify-between"><span>RLV Total</span><span className="font-semibold">{formatCurrency(scenario.case.rlvTotal)}</span></div>
              <div className="flex justify-between"><span>RLV / m²</span><span className="font-semibold">{formatCurrency(scenario.case.rlvPerSqm)}</span></div>
              <div className="flex justify-between"><span>Headroom</span><span className="font-semibold">{formatPercent(scenario.case.headroomPct)}</span></div>
              <div className="flex justify-between"><span>Cap Rate</span><span className="font-semibold">{formatPercent(scenario.case.capRatePct, 2)}</span></div>
              <div className="flex justify-between"><span>Revenue</span><span className="font-semibold">{formatCurrency(scenario.case.revenue)}</span></div>
              <div className="flex justify-between"><span>Capex</span><span className="font-semibold">{formatCurrency(scenario.case.capex)}</span></div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2">
                {statusIcon(scenario.status)}
                <span className="font-medium">{scenario.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h4 className="font-semibold mb-3">Stack + Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 text-sm">
            {activeUses.map((use) => (
              <div key={use.id} className="flex justify-between">
                <span>{use.label}</span>
                <span>{use.allocationPct.toFixed(1)}% ({formatNumber(metrics.gfaByUse[use.id] ?? 0)} m²)</span>
              </div>
            ))}
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Parking Required</span><span>{formatNumber(metrics.parkingRequired)}</span></div>
            <div className="flex justify-between"><span>Parking Achieved</span><span>{formatNumber(metrics.parkingAchieved)}</span></div>
            <div className="flex justify-between"><span>Gap</span><span>{formatNumber(metrics.parkingGap)}</span></div>
            <div className="flex justify-between"><span>Max GFA</span><span>{formatNumber(metrics.maxGfa)} m²</span></div>
            <div className="flex justify-between"><span>Blended Efficiency</span><span>{formatPercent(metrics.blendedEfficiencyPct)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
