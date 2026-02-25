import React from 'react';
import { Building, PieChart, Car, Gavel, Percent } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { formatNumber, formatPercent } from '../lib/format';

export function TopDashboard() {
  const { state, metrics, setActiveTab } = useProject();
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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-7xl mx-auto">
        
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
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Blended Eff.</span>
            <PieChart size={14} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-sans">
            {formatPercent(metrics.blendedEfficiencyPct, 1)}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parking</span>
            <Car size={14} className={metrics.parkingCompliant ? 'text-emerald-500' : 'text-orange-500'} />
          </div>
          <div className={`text-xl font-bold ${metrics.parkingCompliant ? 'text-emerald-600 dark:text-emerald-500' : 'text-orange-600 dark:text-orange-400'}`}>
            {metrics.parkingStatusLabel}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Req {formatNumber(metrics.parkingRequired)} / Ach {formatNumber(metrics.parkingAchieved)}
          </div>
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
    </div>
  );
}
