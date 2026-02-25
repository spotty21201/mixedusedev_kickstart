import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Lock, Unlock, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { ParkingRuleType, ProgramUse, UseId } from '../../types';
import { formatNumber } from '../../lib/format';
import { SelectInput, TextInput } from '../ui/FormControls';

const TYPOLOGY_HELP = {
  podium_tower: 'Best for compact mixed-use sites. Strong retail podium + separated vertical stacks.',
  mid_rise: 'Flatter distribution with lower core intensity; often easier construction sequencing.',
  courtyard: 'Amenity-led format with stronger public realm but lower net efficiency.',
} as const;

const PARKING_RULE_OPTIONS: Array<{ value: ParkingRuleType; label: string }> = [
  { value: 'per_100_nla', label: 'Per 100 m² NLA' },
  { value: 'per_unit', label: 'Per unit' },
  { value: 'per_key', label: 'Per key' },
];

function rebalanceUses(uses: ProgramUse[]): ProgramUse[] {
  const active = uses.filter((u) => u.enabled);
  const lockedSum = active.filter((u) => u.locked).reduce((sum, u) => sum + u.allocationPct, 0);
  const unlocked = active.filter((u) => !u.locked);
  const remaining = Math.max(0, 100 - lockedSum);
  if (unlocked.length === 0) return uses;

  const unlockedCurrentSum = unlocked.reduce((sum, u) => sum + u.allocationPct, 0);
  const nextActive = active.map((u) => {
    if (u.locked) return u;
    if (unlockedCurrentSum === 0) {
      return { ...u, allocationPct: remaining / unlocked.length };
    }
    return { ...u, allocationPct: (u.allocationPct / unlockedCurrentSum) * remaining };
  });

  return uses.map((u) => nextActive.find((nu) => nu.id === u.id) ?? u);
}

function normalizeUses(uses: ProgramUse[]): ProgramUse[] {
  const active = uses.filter((u) => u.enabled);
  const sum = active.reduce((total, u) => total + u.allocationPct, 0);
  if (sum <= 0) return uses;
  const nextActive = active.map((u) => ({ ...u, allocationPct: (u.allocationPct / sum) * 100 }));
  return uses.map((u) => nextActive.find((nu) => nu.id === u.id) ?? u);
}

export function AllocationTab() {
  const { state, updateState, metrics } = useProject();
  const activeUses = state.uses.filter((u) => u.enabled);
  const inactiveUses = state.uses.filter((u) => !u.enabled);

  const updateUse = (useId: UseId, patch: Partial<ProgramUse>) => {
    updateState({ uses: state.uses.map((u) => (u.id === useId ? { ...u, ...patch } : u)) });
  };

  const addUse = (useId: UseId) => {
    updateState({
      uses: rebalanceUses(
        state.uses.map((u) =>
          u.id === useId
            ? {
                ...u,
                enabled: true,
                allocationPct: 10,
              }
            : u,
        ),
      ),
    });
  };

  const removeUse = (useId: UseId) => {
    updateState({
      uses: rebalanceUses(
        state.uses.map((u) =>
          u.id === useId
            ? {
                ...u,
                enabled: false,
                allocationPct: 0,
                locked: false,
              }
            : u,
        ),
      ),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-8">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">Program Mix Allocation (% GFA)</h3>
            <div className="flex gap-2">
              <button
                onClick={() => updateState({ uses: rebalanceUses(state.uses) })}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700"
              >
                Rebalance
              </button>
              <button
                onClick={() => updateState({ uses: normalizeUses(state.uses) })}
                className="bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-700"
              >
                Normalize
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            {activeUses.map((use) => (
              <div key={use.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${use.colorClass}`} />
                  <div className="w-36 text-sm font-medium text-gray-800 dark:text-gray-200">{use.label}</div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.5"
                    value={use.allocationPct}
                    onChange={(e) => updateUse(use.id, { allocationPct: Number(e.target.value) })}
                    className="flex-1"
                    disabled={use.locked}
                  />
                  <div className="w-16 text-right text-sm font-semibold">{use.allocationPct.toFixed(1)}%</div>
                  <button
                    onClick={() => updateUse(use.id, { locked: !use.locked })}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    title={use.locked ? 'Unlock' : 'Lock'}
                  >
                    {use.locked ? <Lock size={16} className="text-orange-500" /> : <Unlock size={16} className="text-gray-400" />}
                  </button>
                  <button
                    onClick={() => removeUse(use.id)}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="Remove use"
                  >
                    <Trash2 size={16} className="text-gray-400" />
                  </button>
                </div>

                <div className="mt-2">
                  <button
                    onClick={() => updateUse(use.id, { showDetails: !use.showDetails })}
                    className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1"
                  >
                    Details {use.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {use.showDetails && (
                  <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-lg">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">Efficiency (%)</label>
                      <TextInput
                        type="number"
                        min="0"
                        max="100"
                        value={use.efficiencyPct}
                        onChange={(e) => updateUse(use.id, { efficiencyPct: Number(e.target.value) })}
                        className="text-right"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">Build Cost (IDR/m²)</label>
                      <TextInput
                        type="number"
                        min="0"
                        value={use.buildCostPerSqm}
                        onChange={(e) => updateUse(use.id, { buildCostPerSqm: Number(e.target.value) })}
                        className="text-right"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
              <label className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Add Use</label>
              <div className="flex flex-wrap gap-2">
                {inactiveUses.map((use) => (
                  <button
                    key={use.id}
                    onClick={() => addUse(use.id)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1"
                  >
                    <Plus size={12} /> {use.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Allocation</span>
              <span className={`text-sm font-bold ${metrics.allocationWarning ? 'text-orange-600' : 'text-emerald-600'}`}>
                {metrics.allocationTotalPct.toFixed(1)}%
              </span>
            </div>
            {metrics.allocationWarning && (
              <div className="text-xs text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-2 rounded">
                Total allocation must be 100%. Use Rebalance or Normalize.
              </div>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-sm uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-4">Typology Selection</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'podium_tower', label: 'Podium + Tower' },
              { id: 'mid_rise', label: 'Mid-rise Slab' },
              { id: 'courtyard', label: 'Courtyard Block' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => updateState({ typology: item.id as any })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  state.typology === item.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="font-semibold text-sm">{item.label}</div>
                <div className="text-xs mt-2 opacity-80">{TYPOLOGY_HELP[item.id as keyof typeof TYPOLOGY_HELP]}</div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-4">Parking Rules & Strategy</h3>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            {activeUses.map((use) => {
              const rule = state.parkingRules[use.id];
              return (
                <div key={`parking-${use.id}`} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3 text-sm">{use.label}</div>
                  <SelectInput
                    value={rule.ruleType}
                    onChange={(e) =>
                      updateState({
                        parkingRules: {
                          ...state.parkingRules,
                          [use.id]: { ...rule, ruleType: e.target.value as ParkingRuleType },
                        },
                      })
                    }
                    className="col-span-6"
                  >
                    {PARKING_RULE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </SelectInput>
                  <TextInput
                    type="number"
                    min="0"
                    value={rule.value}
                    onChange={(e) =>
                      updateState({
                        parkingRules: {
                          ...state.parkingRules,
                          [use.id]: { ...rule, value: Number(e.target.value) },
                        },
                      })
                    }
                    className="col-span-3 text-right"
                  />
                </div>
              );
            })}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Parking Strategy</label>
                <SelectInput
                  value={state.parkingStrategy}
                  onChange={(e) => updateState({ parkingStrategy: e.target.value as any })}
                  className="w-full"
                >
                  <option value="surface">Surface</option>
                  <option value="podium">Podium</option>
                  <option value="basement">Basement</option>
                </SelectInput>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Basement Levels</label>
                <TextInput
                  type="number"
                  min="0"
                  value={state.basementLevels}
                  onChange={(e) => updateState({ basementLevels: Number(e.target.value) })}
                  className="text-right"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Podium Parking Floors</label>
                <TextInput
                  type="number"
                  min="0"
                  value={state.podiumParkingFloors}
                  onChange={(e) => updateState({ podiumParkingFloors: Number(e.target.value) })}
                  className="text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <div className="text-xs text-gray-500">Required</div>
                <div className="font-semibold">{formatNumber(metrics.parkingRequired)}</div>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <div className="text-xs text-gray-500">Achieved</div>
                <div className="font-semibold">{formatNumber(metrics.parkingAchieved)}</div>
              </div>
              <div className={`rounded-lg border p-3 ${metrics.parkingGap > 0 ? 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20' : 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20'}`}>
                <div className="text-xs">Gap</div>
                <div className="font-semibold">{formatNumber(metrics.parkingGap)}</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="lg:col-span-5 border-l border-gray-200 dark:border-gray-800 pl-0 lg:pl-8">
        <h3 className="text-sm uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-6">Vertical Stacking Preview</h3>

        <div className="bg-gray-100 dark:bg-gray-950 rounded-xl p-8 flex flex-col items-center justify-center min-h-[450px] border border-gray-200 dark:border-gray-800 relative overflow-hidden">
          <div className="relative w-52 flex flex-col-reverse shadow-xl z-10 transition-all duration-500">
            {activeUses
              .slice()
              .sort((a, b) => a.allocationPct - b.allocationPct)
              .map((use, idx) => (
                <div
                  key={use.id}
                  className={`${use.colorClass}/90 border border-white dark:border-gray-700 flex items-center justify-center transition-all duration-300 ${idx === activeUses.length - 1 ? 'rounded-t-lg' : ''}`}
                  style={{ height: `${Math.max(use.allocationPct * 2.2, 20)}px` }}
                >
                  <span className="text-white font-bold text-[10px] uppercase bg-black/25 px-2 py-0.5 rounded">{use.label}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1 uppercase font-semibold">Typology</span>
            <span className="text-base font-bold text-gray-900 dark:text-white">{state.typology.replace('_', ' ')}</span>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1 uppercase font-semibold">Blended Eff.</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">{metrics.blendedEfficiencyPct.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
