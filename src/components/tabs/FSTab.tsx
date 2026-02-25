import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Info, ArrowUpRight, ArrowDownRight, CircleDollarSign, TrendingUp } from 'lucide-react';

export function FSTab() {
  const { state, updateState } = useProject();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateState({ [name]: Number(value) });
  };

  // Derived Calculations
  const maxGfa = state.siteArea * state.maxFar;
  const retailGfa = maxGfa * (state.mixRetail / 100);
  const officeGfa = maxGfa * (state.mixOffice / 100);
  const hotelGfa = maxGfa * (state.mixHotel / 100);
  const resiGfa = maxGfa * (state.mixResidential / 100);

  const landAcqTotal = state.siteArea * state.askingPricePerSqm;
  const infraTotal = state.siteArea * state.infraCostRate;
  
  // Simplified Build Cost Calculation (using available state variables for demo)
  const buildCostTotal = 
    (retailGfa * state.buildCostRetail) + 
    (resiGfa * state.buildCostResidential) +
    (officeGfa * state.buildCostRetail * 1.1) + // Proxy multiplier for office
    (hotelGfa * state.buildCostRetail * 1.3);   // Proxy multiplier for hotel

  const softCostTotal = buildCostTotal * (state.softCostMultiplier / 100);
  const totalProjectCost = buildCostTotal + infraTotal + softCostTotal;

  // Simplified GDV Calculation
  const gdvTotal = 
    (retailGfa * state.aspRetail) + 
    (resiGfa * state.aspResidential) +
    (officeGfa * state.aspRetail * 0.9) + // Proxy multiplier
    (hotelGfa * state.aspRetail * 1.2);   // Proxy multiplier

  // Residual Land Value (RLV) Calculation
  const targetProfitMargin = 0.20; // 20% target developer profit
  const targetProfit = gdvTotal * targetProfitMargin;
  const rlvTotal = gdvTotal - totalProjectCost - targetProfit;
  const rlvPerSqm = rlvTotal / state.siteArea;

  const headroom = ((rlvPerSqm - state.askingPricePerSqm) / state.askingPricePerSqm) * 100;
  
  let verdict = 'Overpriced';
  let verdictColors = 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800';
  let progressColor = 'bg-red-500';
  
  if (headroom >= 15) {
    verdict = 'Feasible';
    verdictColors = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    progressColor = 'bg-emerald-500';
  } else if (headroom >= 0) {
    verdict = 'Borderline';
    verdictColors = 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800';
    progressColor = 'bg-orange-500';
  }

  const formatIDR = (val: number) => {
    if (val >= 1e12) return `Rp ${(val / 1e12).toFixed(2)} T`;
    if (val >= 1e9) return `Rp ${(val / 1e9).toFixed(1)} B`;
    if (val >= 1e6) return `Rp ${(val / 1e6).toFixed(1)} M`;
    return `Rp ${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Disclaimer */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">FS-lite Disclaimer</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200/80">
              FS = feasibility snapshot. Early-stage assumptions; not a bankable proforma. 2D model does not optimize vertical yield.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <CircleDollarSign className="text-gray-500" />
            Cost & Revenue Inputs
          </h2>
          
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-8">
            
            {/* Land & Infra */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Land & Infrastructure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Land Acquisition Cost (IDR/sqm)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 text-sm">Rp</span>
                    <input 
                      type="number" 
                      name="askingPricePerSqm"
                      value={state.askingPricePerSqm}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-10 font-mono" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Infra Cost Rate (IDR/sqm)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 text-sm">Rp</span>
                    <input 
                      type="number" 
                      name="infraCostRate"
                      value={state.infraCostRate}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-10 font-mono" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Soft Cost Multiplier (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="softCostMultiplier"
                      value={state.softCostMultiplier}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 pr-8 font-mono" 
                    />
                    <span className="absolute right-3 top-2 text-gray-500 text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800"></div>

            {/* Vertical Construction */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Vertical Construction Assumptions</h3>
              
              <div className="grid grid-cols-12 gap-4 items-end mb-2">
                <div className="col-span-4 text-xs font-medium text-gray-500 dark:text-gray-400">Function</div>
                <div className="col-span-4 text-xs font-medium text-gray-500 dark:text-gray-400">Build Cost (IDR/m2)</div>
                <div className="col-span-4 text-xs font-medium text-gray-500 dark:text-gray-400">ASP (IDR/m2)</div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4 text-sm font-medium text-gray-900 dark:text-white">Residential</div>
                <div className="col-span-4 relative">
                  <span className="absolute left-2 top-2 text-xs text-gray-400">Rp</span>
                  <input type="number" name="buildCostResidential" value={state.buildCostResidential} onChange={handleInputChange} className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-8 py-1.5 font-mono" />
                </div>
                <div className="col-span-4 relative">
                  <span className="absolute left-2 top-2 text-xs text-gray-400">Rp</span>
                  <input type="number" name="aspResidential" value={state.aspResidential} onChange={handleInputChange} className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-8 py-1.5 font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4 text-sm font-medium text-gray-900 dark:text-white">Retail / Podium</div>
                <div className="col-span-4 relative">
                  <span className="absolute left-2 top-2 text-xs text-gray-400">Rp</span>
                  <input type="number" name="buildCostRetail" value={state.buildCostRetail} onChange={handleInputChange} className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-8 py-1.5 font-mono" />
                </div>
                <div className="col-span-4 relative">
                  <span className="absolute left-2 top-2 text-xs text-gray-400">Rp</span>
                  <input type="number" name="aspRetail" value={state.aspRetail} onChange={handleInputChange} className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-8 py-1.5 font-mono" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Outputs */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <TrendingUp className="text-gray-500" />
            Quick FS Summary
          </h2>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Metric</h3>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Value (IDR)</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              <div className="px-5 py-3 flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Land Acquisition Total</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{formatIDR(landAcqTotal)}</span>
              </div>
              <div className="px-5 py-3 flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Infrastructure</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{formatIDR(infraTotal)}</span>
              </div>
              <div className="px-5 py-3 flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Build Cost</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{formatIDR(buildCostTotal)}</span>
              </div>
              <div className="px-5 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-800/30">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Total Project Cost</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{formatIDR(totalProjectCost)}</span>
              </div>
              <div className="px-5 py-4 flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/10">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Gross Development Value (GDV)</span>
                <span className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono">{formatIDR(gdvTotal)}</span>
              </div>
            </div>
          </div>

          {/* Land Value Verdict Box */}
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Land Value Verdict</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Residual Land Value vs Asking Price</p>
              </div>
              <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${verdictColors}`}>
                {verdict}
              </span>
            </div>
            
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white font-mono">
                {headroom > 0 ? '+' : ''}{headroom.toFixed(1)}%
              </span>
              <span className={`text-sm font-medium mb-1.5 flex items-center ${headroom > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {headroom > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />} Headroom
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6 overflow-hidden">
              <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${Math.min(Math.max(headroom + 50, 0), 100)}%` }}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Residual Land Value (RLV)</p>
                <p className="font-bold text-gray-900 dark:text-white font-mono">Rp {(rlvPerSqm / 1000000).toFixed(2)} M /m²</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Asking Price</p>
                <p className="font-bold text-gray-900 dark:text-white font-mono">Rp {(state.askingPricePerSqm / 1000000).toFixed(2)} M /m²</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
