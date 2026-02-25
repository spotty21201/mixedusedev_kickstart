import React from 'react';
import { Building, PieChart, Car, Gavel, Percent, LandPlot, CircleDollarSign } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { formatCurrency, formatNumber, formatPercent } from '../lib/format';

export function TopDashboard() {
  const { state, metrics, setActiveTab } = useProject();
  const askingPerSqm = state.useLumpSumAsking
    ? state.lumpSumAsking / Math.max(state.landArea, 1)
    : state.askingPricePerSqm;
  const totalAsking = askingPerSqm * state.landArea;
  const rlvBasePerSqm = metrics.cases[0]?.rlvPerSqm ?? 0;
  const verdictColor =
    metrics.activeVerdict === 'Good'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800'
      : metrics.activeVerdict === 'Borderline'
        ? 'text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-300 dark:bg-orange-900/30 dark:border-orange-800'
        : 'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-900/30 dark:border-red-800';

  const onJumpLandVerdict = () => {
    setActiveTab('fs');
    requestAnimationFrame(() => {
      setTimeout(() => {
        const target = document.getElementById('land-verdict-panel');
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-6 shadow-sm transition-colors sticky top-[64px] z-40">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 max-w-7xl mx-auto">
        
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Site Area</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-sans">
            {formatNumber(state.siteArea)} <span className="text-sm font-normal text-gray-500 font-sans">m²</span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Max GFA</span>
            <Building size={14} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-sans">
            {formatNumber(metrics.maxGfa)} <span className="text-sm font-normal text-gray-500 font-sans">m²</span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Blended NLA Eff.</span>
            <PieChart size={14} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-sans">
            {formatPercent(metrics.blendedEfficiencyPct, 1)}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parking (Req / Ach)</span>
            <Car size={14} className={metrics.parkingCompliant ? 'text-emerald-500' : 'text-orange-500'} />
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {formatNumber(metrics.parkingRequired)} / {formatNumber(metrics.parkingAchieved)}
          </div>
          <div className={`text-xs ${metrics.parkingCompliant ? 'text-emerald-600 dark:text-emerald-500' : 'text-orange-600 dark:text-orange-400'}`}>
            {metrics.parkingStatusLabel}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asking Price (Rp/m²)</span>
            <LandPlot size={14} className="text-gray-400" />
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(askingPerSqm)}</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Asking (Rp)</span>
            <CircleDollarSign size={14} className="text-gray-400" />
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalAsking)}</div>
        </div>

        <button
          type="button"
          onClick={onJumpLandVerdict}
          className={`p-4 rounded-xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${verdictColor}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Land Verdict</span>
            <Gavel size={14} />
          </div>
          <div className="text-2xl font-bold">{metrics.activeVerdict}</div>
        </button>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Headroom</span>
            <Percent size={14} className="text-gray-400" />
          </div>
          <div className={`text-2xl font-bold ${metrics.activeHeadroomPct >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-400'}`}>
            {formatPercent(metrics.activeHeadroomPct, 1)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Base case</div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-3 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm grid grid-cols-1 md:grid-cols-6 gap-2 bg-white dark:bg-gray-900">
        <div>Land Area: <span className="font-semibold">{formatNumber(state.landArea)} m²</span></div>
        <div>Asking: <span className="font-semibold">{formatCurrency(askingPerSqm)}/m²</span></div>
        <div>Total Asking: <span className="font-semibold">{formatCurrency(totalAsking)}</span></div>
        <div>RLV Base: <span className="font-semibold">{rlvBasePerSqm > 0 ? `${formatCurrency(rlvBasePerSqm)}/m²` : 'N/A'}</span></div>
        <div>Headroom Base: <span className={`font-semibold ${metrics.activeHeadroomPct >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-orange-600 dark:text-orange-400'}`}>{formatPercent(metrics.activeHeadroomPct, 1)}</span></div>
        <div>Verdict: <span className={`inline-flex px-2 py-0.5 rounded border text-xs font-semibold ${verdictColor}`}>{metrics.activeVerdict}</span></div>
      </div>
    </div>
  );
}
