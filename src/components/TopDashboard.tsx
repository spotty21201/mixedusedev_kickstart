import React from 'react';
import { Info, Building, PieChart, CheckCircle2, Gavel } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export function TopDashboard() {
  const { state } = useProject();

  // Derived calculations (simplified for now)
  const maxGfa = state.siteArea * state.maxFar;
  const blendedEff = 82.4; // Placeholder, will calculate later

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-6 px-6 shadow-sm transition-colors">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-7xl mx-auto">
        
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Site Area</span>
            <Info size={14} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-sans">
            {state.siteArea.toLocaleString()} <span className="text-sm font-normal text-gray-500 font-sans">m²</span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Max GFA</span>
            <Building size={14} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-sans">
            {maxGfa.toLocaleString()} <span className="text-sm font-normal text-gray-500 font-sans">m²</span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Blended Eff.</span>
            <PieChart size={14} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-sans">
            {blendedEff.toFixed(1)} <span className="text-sm font-normal text-gray-500 font-sans">%</span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parking</span>
            <CheckCircle2 size={14} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
            Compliant
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-orange-800 dark:text-orange-400 uppercase tracking-wider">Land Verdict</span>
            <Gavel size={14} className="text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">
            Borderline
          </div>
        </div>

      </div>
    </div>
  );
}
