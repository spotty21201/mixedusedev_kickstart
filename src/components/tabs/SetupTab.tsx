import React from 'react';
import { useProject } from '../../context/ProjectContext';

export function SetupTab() {
  const { state, updateState } = useProject();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    updateState({
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  // Derived Calculations
  const totalAcquisitionCost = state.siteArea * state.askingPricePerSqm;
  const maxGfa = state.siteArea * state.maxFar;
  const podiumFootprint = state.siteArea * (state.maxBcr / 100);
  const towerFootprint = podiumFootprint * 0.33; // Simplified assumption for preview

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-5 space-y-8">
        
        {/* Site Info Section */}
        <section>
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Site Info</h2>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Project Name</label>
              <input 
                type="text" 
                name="projectName"
                value={state.projectName} 
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Gross Site Area (m²)</label>
                <input 
                  type="number" 
                  name="siteArea"
                  value={state.siteArea} 
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-right font-sans" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Frontage (m)</label>
                <input 
                  type="number" 
                  name="frontage"
                  value={state.frontage} 
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-right font-sans" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Shape Complexity</label>
              <select 
                name="shapeComplexity"
                value={state.shapeComplexity}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Rectangular (Regular)</option>
                <option>L-Shape (Semi-Regular)</option>
                <option>Trapezoid (Irregular)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Regulation Parameters Section */}
        <section>
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Regulation Parameters</h2>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Max FAR (KLB)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    name="maxFar"
                    value={state.maxFar} 
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-right font-sans pr-8" 
                  />
                  <span className="absolute right-3 top-2 text-gray-400 text-sm">x</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Max BCR (KDB)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="maxBcr"
                    value={state.maxBcr} 
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-right font-sans pr-8" 
                  />
                  <span className="absolute right-3 top-2 text-gray-400 text-sm">%</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Height Limit (KKOP)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="heightLimit"
                    value={state.heightLimit} 
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-right font-sans pr-8" 
                  />
                  <span className="absolute right-3 top-2 text-gray-400 text-sm">m</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Setback (GSB)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="setback"
                    value={state.setback} 
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-right font-sans pr-8" 
                  />
                  <span className="absolute right-3 top-2 text-gray-400 text-sm">m</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Green Coefficient (KDH)</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="greenCoeff"
                  value={state.greenCoeff} 
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-right font-sans pr-8" 
                />
                <span className="absolute right-3 top-2 text-gray-400 text-sm">%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Land Acquisition Section */}
        <section>
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Land Acquisition</h2>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Asking Price / m²</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm font-medium">Rp</span>
                <input 
                  type="number" 
                  name="askingPricePerSqm"
                  value={state.askingPricePerSqm} 
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-right font-sans pl-10" 
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Acquisition Cost</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white font-sans">
                  Rp {(totalAcquisitionCost / 1000000000).toFixed(1)} B
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column: Outputs */}
      <div className="lg:col-span-7 flex flex-col space-y-6">
        
        {/* Envelope Preview */}
        <div className="flex-grow bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">Envelope Preview</span>
            <div className="flex space-x-2">
              <button className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-2 py-1 rounded text-gray-600 dark:text-gray-300">Reset View</button>
              <button className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-2 py-1 rounded text-gray-600 dark:text-gray-300">ISO</button>
            </div>
          </div>
          <div className="relative flex-grow bg-gray-100 dark:bg-gray-950 flex items-center justify-center overflow-hidden">
            {/* Grid Background */}
            <div 
              className="absolute inset-0 opacity-10 dark:opacity-20" 
              style={{ backgroundImage: 'radial-gradient(#6B7280 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            ></div>
            
            {/* 3D Envelope Representation */}
            <div className="relative w-64 h-64 transform rotate-x-60 rotate-z-45 perspective-1000 transition-all duration-500">
              {/* Site Boundary */}
              <div className="absolute inset-0 bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 opacity-30"></div>
              {/* Podium */}
              <div 
                className="absolute bottom-0 left-4 right-4 bg-gray-300 dark:bg-gray-700 border border-white dark:border-gray-600 shadow-xl opacity-90 transition-all duration-500"
                style={{ height: `${Math.min(state.maxBcr * 1.5, 120)}px` }}
              ></div>
              {/* Tower */}
              <div 
                className="absolute left-10 right-10 bg-gray-400 dark:bg-gray-600 border border-white dark:border-gray-500 shadow-2xl opacity-90 transition-all duration-500"
                style={{ 
                  bottom: `${Math.min(state.maxBcr * 1.5, 120)}px`,
                  height: `${Math.min(state.maxFar * 30, 200)}px` 
                }}
              ></div>
              {/* Setback Dashed Line */}
              <div className="absolute -inset-4 border border-dashed border-red-400 opacity-60 pointer-events-none"></div>
            </div>

            {/* Legend */}
            <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 text-xs backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-sm"></div>
                <span className="text-gray-600 dark:text-gray-300">Podium (Retail)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded-sm"></div>
                <span className="text-gray-600 dark:text-gray-300">Tower (Res/Off)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Summary */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Live Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4 tracking-wider">Buildable Area</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Podium Footprint</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white font-sans">{podiumFootprint.toLocaleString()} m²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tower Footprint</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white font-sans">{towerFootprint.toLocaleString(undefined, {maximumFractionDigits: 0})} m²</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-px my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Total Buildable GFA</span>
                  <span className="text-base font-bold text-blue-600 dark:text-blue-500 font-sans">{maxGfa.toLocaleString()} m²</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4 tracking-wider">Constraints Check</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current KDB</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500 font-sans">
                    {state.maxBcr}% <span className="text-xs font-normal text-gray-500">(Max {state.maxBcr}%)</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current KLB</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500 font-sans">
                    {state.maxFar.toFixed(1)} <span className="text-xs font-normal text-gray-500">(Max {state.maxFar.toFixed(1)})</span>
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-px my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Efficiency Loss</span>
                  <span className="text-base font-bold text-gray-500 font-sans">0.0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
