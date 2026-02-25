import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Lock, Unlock, Building2, Building, Home } from 'lucide-react';

interface SliderProps {
  value: number;
  onChange: (val: number) => void;
  colorClass: string;
  label: string;
  dotColor: string;
}

function MixSlider({ value, onChange, colorClass, label, dotColor }: SliderProps) {
  return (
    <div className="group mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${dotColor}`}></span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-900 dark:text-white">{value.toFixed(1)}%</span>
          <Unlock size={14} className="text-gray-400 hover:text-orange-500 cursor-pointer" />
        </div>
      </div>
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center">
        <div className={`absolute h-full rounded-full ${colorClass}`} style={{ width: `${value}%` }}></div>
        <input 
          type="range" 
          min="0" max="100" 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div 
          className={`absolute h-4 w-4 bg-white border-2 rounded-full shadow-sm pointer-events-none ${colorClass.replace('bg-', 'border-')}`} 
          style={{ left: `calc(${value}% - 8px)` }}
        ></div>
      </div>
    </div>
  );
}

export function AllocationTab() {
  const { state, updateState } = useProject();

  const handleMixChange = (key: keyof typeof state, value: number) => {
    updateState({ [key]: value });
  };

  const totalAllocation = state.mixRetail + state.mixOffice + state.mixHotel + state.mixResidential;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left Column: Inputs */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* Program Mix Allocation */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">Program Mix Allocation (% GFA)</h3>
            <div className="flex gap-3">
              <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 transition-colors">
                Rebalance
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <MixSlider 
              label="Retail & F&B" 
              value={state.mixRetail} 
              onChange={(v) => handleMixChange('mixRetail', v)} 
              colorClass="bg-pink-500" dotColor="bg-pink-500" 
            />
            <MixSlider 
              label="Office / Commercial" 
              value={state.mixOffice} 
              onChange={(v) => handleMixChange('mixOffice', v)} 
              colorClass="bg-blue-500" dotColor="bg-blue-500" 
            />
            <MixSlider 
              label="Hospitality / Hotel" 
              value={state.mixHotel} 
              onChange={(v) => handleMixChange('mixHotel', v)} 
              colorClass="bg-purple-500" dotColor="bg-purple-500" 
            />
            <MixSlider 
              label="Residential" 
              value={state.mixResidential} 
              onChange={(v) => handleMixChange('mixResidential', v)} 
              colorClass="bg-yellow-400" dotColor="bg-yellow-400" 
            />
            
            <div className="flex justify-end pt-4 border-t border-dashed border-gray-200 dark:border-gray-700 mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Total Allocation:</span>
              <span className={`text-sm font-bold ${totalAllocation === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {totalAllocation.toFixed(1)}%
              </span>
            </div>
          </div>
        </section>

        {/* Typology Selection */}
        <section>
          <h3 className="text-sm uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-4">Typology Selection</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <button 
              onClick={() => updateState({ typology: 'podium_tower' })}
              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                state.typology === 'podium_tower' 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300'
              }`}
            >
              <Building2 size={32} className="mb-2" />
              <span className="text-sm font-semibold">Podium + Tower</span>
            </button>
            <button 
              onClick={() => updateState({ typology: 'mid_rise' })}
              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                state.typology === 'mid_rise' 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300'
              }`}
            >
              <Building size={32} className="mb-2" />
              <span className="text-sm font-semibold">Mid-rise Slab</span>
            </button>
            <button 
              onClick={() => updateState({ typology: 'courtyard' })}
              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                state.typology === 'courtyard' 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300'
              }`}
            >
              <Home size={32} className="mb-2" />
              <span className="text-sm font-semibold">Courtyard Block</span>
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl flex items-center justify-between border border-gray-200 dark:border-gray-800 shadow-sm">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Basement Parking</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Enable if parking is below grade.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={state.basementParking}
                onChange={(e) => updateState({ basementParking: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </section>
      </div>

      {/* Right Column: Preview */}
      <div className="lg:col-span-5 border-l border-gray-200 dark:border-gray-800 pl-0 lg:pl-8">
        <h3 className="text-sm uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-6">Vertical Stacking Preview</h3>
        
        <div className="bg-gray-100 dark:bg-gray-950 rounded-xl p-8 flex flex-col items-center justify-center min-h-[450px] border border-gray-200 dark:border-gray-800 relative overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10 dark:opacity-20" style={{ backgroundImage: 'radial-gradient(#6B7280 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative w-48 flex flex-col-reverse shadow-xl z-10 transition-all duration-500">
            
            {/* Residential */}
            {state.mixResidential > 0 && (
              <div 
                className="bg-yellow-400/90 backdrop-blur-sm border-2 border-yellow-500 rounded-t-lg flex items-center justify-center relative group transition-all duration-300"
                style={{ height: `${Math.max(state.mixResidential * 2, 20)}px` }}
              >
                <span className="text-yellow-900 font-bold text-xs uppercase bg-white/50 px-2 py-1 rounded">Residential</span>
              </div>
            )}
            
            {/* Hotel */}
            {state.mixHotel > 0 && (
              <div 
                className="bg-purple-500/90 backdrop-blur-sm border-2 border-purple-600 flex items-center justify-center relative group transition-all duration-300"
                style={{ height: `${Math.max(state.mixHotel * 2, 20)}px` }}
              >
                <span className="text-white font-bold text-xs uppercase bg-black/20 px-2 py-1 rounded">Hotel</span>
              </div>
            )}
            
            {/* Office */}
            {state.mixOffice > 0 && (
              <div 
                className="bg-blue-500/90 backdrop-blur-sm border-2 border-blue-600 flex items-center justify-center relative group transition-all duration-300"
                style={{ height: `${Math.max(state.mixOffice * 2, 20)}px` }}
              >
                <span className="text-white font-bold text-xs uppercase bg-black/20 px-2 py-1 rounded">Office</span>
              </div>
            )}
            
            {/* Retail Podium */}
            {state.mixRetail > 0 && (
              <div 
                className="bg-pink-500/90 backdrop-blur-sm border-2 border-pink-600 rounded-b-sm w-64 -mx-8 flex items-center justify-center relative group shadow-md transition-all duration-300"
                style={{ height: `${Math.max(state.mixRetail * 2, 40)}px` }}
              >
                <span className="text-white font-bold text-xs uppercase bg-black/20 px-2 py-1 rounded">Retail Podium</span>
              </div>
            )}
            
            {/* Ground Line */}
            <div className="w-80 h-1 bg-gray-400 dark:bg-gray-600 absolute -bottom-1 -left-16 rounded-full"></div>
            <div className="absolute -bottom-8 w-full text-center text-xs font-sans text-gray-500 dark:text-gray-400">Ground Level</div>
            
            {/* Basement Parking */}
            {state.basementParking && (
              <div className="bg-gray-300 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 border-dashed rounded-b-lg h-16 w-64 -mx-8 flex items-center justify-center relative -bottom-0 opacity-70 mt-1">
                <span className="text-gray-600 dark:text-gray-400 font-bold text-xs uppercase">Parking (B1-B2)</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1 uppercase font-semibold">Est. Height</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white font-sans">
              {Math.round(state.heightLimit * 0.9)}m <span className="text-xs font-normal text-gray-400 font-sans">({Math.round(state.heightLimit * 0.9 / 4)} Floors)</span>
            </span>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1 uppercase font-semibold">Floor Plate Avg</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white font-sans">
              {Math.round((state.siteArea * (state.maxBcr / 100)) * 0.5).toLocaleString()} <span className="text-xs font-normal text-gray-400 font-sans">sqm</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
