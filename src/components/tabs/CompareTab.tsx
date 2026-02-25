import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Plus, Verified } from 'lucide-react';

export function CompareTab() {
  const scenarios = [
    {
      id: 'A',
      title: 'Scenario A: High Density Mixed',
      badge: 'Feasible',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
      score: 92,
      scoreColor: 'text-blue-600 dark:text-blue-500',
      stack: [
        { color: 'bg-purple-400 dark:bg-purple-500', height: '15%' },
        { color: 'bg-orange-400 dark:bg-orange-500', height: '15%' },
        { color: 'bg-orange-400 dark:bg-orange-500', height: '15%' },
        { color: 'bg-blue-500 dark:bg-blue-600', height: '15%' },
        { color: 'bg-blue-500 dark:bg-blue-600', height: '15%' },
        { color: 'bg-blue-500 dark:bg-blue-600', height: '15%' },
        { color: 'bg-blue-500 dark:bg-blue-600', height: '10%' },
      ],
      metrics: { gfa: '45,200 m²', eff: '82.5%', park: '105%', cost: '$420 psf' },
      verdictTitle: 'Acquisition Recommended',
      verdictIcon: <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />,
      verdictDesc: 'Maximized FAR usage with optimal residential mix. Meets all zoning constraints.',
      isBestFit: true,
    },
    {
      id: 'B',
      title: 'Scenario B: Mid-Rise Office',
      badge: 'Review',
      badgeColor: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
      score: 78,
      scoreColor: 'text-gray-800 dark:text-gray-200',
      stack: [
        { color: 'bg-purple-400 dark:bg-purple-500', height: '20%' },
        { color: 'bg-orange-400 dark:bg-orange-500', height: '20%' },
        { color: 'bg-orange-400 dark:bg-orange-500', height: '20%' },
        { color: 'bg-orange-400 dark:bg-orange-500', height: '20%' },
      ],
      metrics: { gfa: '32,100 m²', eff: '79.0%', park: '120%', cost: '$510 psf' },
      verdictTitle: 'Marginal Returns',
      verdictIcon: <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400" />,
      verdictDesc: 'Underutilized FAR capacity. Commercial leasing risk is high in this sector.',
      isBestFit: false,
    },
    {
      id: 'C',
      title: 'Scenario C: Luxury Residential',
      badge: 'Rejected',
      badgeColor: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
      score: 55,
      scoreColor: 'text-gray-500 dark:text-gray-400',
      stack: [
        { color: 'bg-blue-500 dark:bg-blue-600', height: '16%' },
        { color: 'bg-blue-500 dark:bg-blue-600', height: '16%' },
        { color: 'bg-blue-500 dark:bg-blue-600', height: '16%' },
        { color: 'bg-blue-500 dark:bg-blue-600', height: '16%' },
        { color: 'bg-blue-500 dark:bg-blue-600', height: '16%' },
        { color: 'bg-blue-500 dark:bg-blue-600', height: '20%' },
      ],
      metrics: { gfa: '52,800 m²', eff: '75.5%', park: '65%', cost: '$380 psf' },
      verdictTitle: 'Constraint Violation',
      verdictIcon: <XCircle size={16} className="text-red-600 dark:text-red-400" />,
      verdictDesc: 'Exceeds height limits by 2 storeys. Requires impossible variance.',
      isBestFit: false,
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scenario Comparison Board</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Compare vertical yield strategies and feasibility across generated massing options.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
          <button className="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-900 dark:text-white shadow-sm">Card View</button>
          <button className="px-3 py-1.5 rounded text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">Table View</button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex gap-6 overflow-x-auto pb-6 -mx-6 px-6 items-start snap-x scrolling-wrapper">
        
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="min-w-[340px] w-[340px] flex-shrink-0 relative snap-center">
            
            {scenario.isBestFit && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
                <Verified size={14} /> BEST FIT
              </div>
            )}

            <div className={`bg-white dark:bg-gray-900 rounded-xl flex flex-col h-full transition-shadow duration-300 ${
              scenario.isBestFit 
                ? 'border-2 border-blue-600 shadow-lg hover:shadow-xl' 
                : 'border border-gray-200 dark:border-gray-800 shadow-sm hover:border-gray-300 dark:hover:border-gray-700'
            }`}>
              
              {/* Header */}
              <div className={`p-5 border-b border-gray-200 dark:border-gray-800 ${scenario.isBestFit ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight pr-2">{scenario.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium border ${scenario.badgeColor}`}>
                    {scenario.badge}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className={`text-4xl font-bold ${scenario.scoreColor}`}>{scenario.score}</span>
                  <span className="text-gray-400 dark:text-gray-500 text-2xl font-light">/100</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider ml-1">Return Score</span>
                </div>
              </div>

              {/* Stack Visual */}
              <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex justify-center py-8 h-48">
                <div className="w-32 flex flex-col gap-0.5 shadow-sm h-full justify-end">
                  {scenario.stack.map((block, idx) => (
                    <div 
                      key={idx} 
                      className={`w-full ${block.color} opacity-90 ${idx === 0 ? 'rounded-t-sm' : ''} ${idx === scenario.stack.length - 1 ? 'rounded-b-sm' : ''}`}
                      style={{ height: block.height }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="p-5 grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total GFA</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white font-mono">{scenario.metrics.gfa}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Blended Efficiency</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white font-mono">{scenario.metrics.eff}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Parking Achieved</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white font-mono">{scenario.metrics.park}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Land Cost / GFA</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white font-mono">{scenario.metrics.cost}</p>
                </div>
              </div>

              {/* Verdict */}
              <div className="mt-auto p-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 rounded-b-xl">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2">Land Verdict</p>
                <div className="flex items-center gap-2 text-sm font-medium mb-1.5">
                  {scenario.verdictIcon}
                  <span className={
                    scenario.id === 'A' ? 'text-emerald-700 dark:text-emerald-400' :
                    scenario.id === 'B' ? 'text-yellow-700 dark:text-yellow-400' :
                    'text-red-700 dark:text-red-400'
                  }>{scenario.verdictTitle}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {scenario.verdictDesc}
                </p>
              </div>

            </div>
          </div>
        ))}

        {/* Generate New Card */}
        <div className="min-w-[340px] w-[340px] flex-shrink-0 flex flex-col h-full snap-center">
          <button className="h-full min-h-[500px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all bg-gray-50/50 dark:bg-gray-800/20 group">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
              <Plus size={24} />
            </div>
            <span className="font-medium">Generate New Scenario</span>
            <span className="text-xs mt-1 opacity-70">Adjust parameters to create option D</span>
          </button>
        </div>

      </div>

      {/* Legend Footer */}
      <div className="mt-4 flex flex-wrap gap-6 items-center border-t border-gray-200 dark:border-gray-800 pt-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <span>Residential</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>
          <span>Commercial Office</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-400 rounded-sm"></div>
          <span>Retail / Podium</span>
        </div>
        <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
        <span>Last Updated: Today, 14:32</span>
        <div className="ml-auto hidden md:block">
          2D Model does not optimize vertical yield. Use FS-lite for preliminary estimates.
        </div>
      </div>
    </div>
  );
}
