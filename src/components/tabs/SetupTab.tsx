import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { InfoTip } from '../InfoTip';
import { formatCurrency, formatNumber, parseNumber } from '../../lib/format';

function NumericInput({
  value,
  onChange,
  suffix,
  prefix,
}: {
  value: number;
  onChange: (val: number) => void;
  suffix?: string;
  prefix?: string;
}) {
  return (
    <div className="relative">
      {prefix && <span className="absolute left-3 top-2 text-gray-500 text-sm">{prefix}</span>}
      <input
        type="text"
        inputMode="decimal"
        value={formatNumber(value, 0)}
        onChange={(e) => onChange(parseNumber(e.target.value))}
        className={`w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-right font-sans ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-8' : ''}`}
      />
      {suffix && <span className="absolute right-3 top-2 text-gray-500 text-sm">{suffix}</span>}
    </div>
  );
}

function AdderRow({
  label,
  pct,
  amount,
  onPct,
  onAmount,
}: {
  label: string;
  pct: number;
  amount: number;
  onPct: (val: number) => void;
  onAmount: (val: number) => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-3 items-center">
      <div className="col-span-5 text-sm text-gray-700 dark:text-gray-300">{label}</div>
      <div className="col-span-3">
        <NumericInput value={pct} onChange={onPct} suffix="%" />
      </div>
      <div className="col-span-4">
        <NumericInput value={amount} onChange={onAmount} prefix="Rp" />
      </div>
    </div>
  );
}

export function SetupTab() {
  const { state, updateState, metrics } = useProject();

  const updateSimple = (key: keyof typeof state, value: string | number | boolean) => {
    updateState({ [key]: value } as any);
  };

  const askingPerSqm = state.useLumpSumAsking
    ? state.lumpSumAsking / Math.max(state.landArea, 1)
    : state.askingPricePerSqm;
  const lumpSumAsking = state.useLumpSumAsking
    ? state.lumpSumAsking
    : state.askingPricePerSqm * state.landArea;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6 space-y-8">
        <section>
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Site Info</h2>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Project Name</label>
              <input
                type="text"
                value={state.projectName}
                onChange={(e) => updateSimple('projectName', e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Gross Site Area (m²)</label>
                <NumericInput
                  value={state.siteArea}
                  onChange={(val) => {
                    updateState({ siteArea: Math.max(0, val), landArea: Math.max(0, val) });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Frontage (m)</label>
                <NumericInput value={state.frontage} onChange={(val) => updateSimple('frontage', Math.max(0, val))} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Shape Complexity</label>
              <select
                value={state.shapeComplexity}
                onChange={(e) => updateSimple('shapeComplexity', e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Rectangular (Regular)</option>
                <option>L-Shape (Semi-Regular)</option>
                <option>Trapezoid (Irregular)</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Regulation Parameters</h2>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                  Max FAR (KLB)
                  <InfoTip text="KLB/FAR is the maximum floor area ratio: total GFA divided by site area." />
                </label>
                <NumericInput value={state.maxFar} onChange={(val) => updateSimple('maxFar', Math.max(0, val))} suffix="x" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                  Max BCR (KDB)
                  <InfoTip text="KDB is max building coverage: footprint as a percentage of site area." />
                </label>
                <NumericInput value={state.maxBcr} onChange={(val) => updateSimple('maxBcr', Math.max(0, Math.min(100, val)))} suffix="%" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                  Height Limit (KKOP)
                  <InfoTip text="KKOP is aviation-related height control for building envelopes." />
                </label>
                <NumericInput value={state.heightLimit} onChange={(val) => updateSimple('heightLimit', Math.max(0, val))} suffix="m" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                  Setback (GSB)
                  <InfoTip text="GSB is the required setback distance from property boundaries or street edge." />
                </label>
                <NumericInput value={state.setback} onChange={(val) => updateSimple('setback', Math.max(0, val))} suffix="m" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                Green Coefficient (KDH)
                <InfoTip text="KDH is minimum green/open area requirement as percentage of site area." />
              </label>
              <NumericInput value={state.greenCoeff} onChange={(val) => updateSimple('greenCoeff', Math.max(0, Math.min(100, val)))} suffix="%" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Land Acquisition</h2>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Land Area (m²)</label>
                <NumericInput value={state.landArea} onChange={(val) => updateSimple('landArea', Math.max(1, val))} />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => updateSimple('landArea', state.siteArea)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Sync to Site Area
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Use lump-sum asking</span>
              <input
                type="checkbox"
                checked={state.useLumpSumAsking}
                onChange={(e) => updateSimple('useLumpSumAsking', e.target.checked)}
                className="h-4 w-4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Asking Price (IDR/m²)</label>
                <NumericInput
                  value={askingPerSqm}
                  onChange={(val) => {
                    if (state.useLumpSumAsking) {
                      updateSimple('lumpSumAsking', val * state.landArea);
                    } else {
                      updateSimple('askingPricePerSqm', val);
                    }
                  }}
                  prefix="Rp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Lump-Sum Asking (IDR)</label>
                <NumericInput
                  value={lumpSumAsking}
                  onChange={(val) => {
                    if (state.useLumpSumAsking) {
                      updateSimple('lumpSumAsking', val);
                    } else {
                      updateSimple('askingPricePerSqm', val / Math.max(state.landArea, 1));
                    }
                  }}
                  prefix="Rp"
                />
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <div className="grid grid-cols-12 gap-3 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                <div className="col-span-5">Adder</div>
                <div className="col-span-3">%</div>
                <div className="col-span-4">IDR</div>
              </div>

              <AdderRow
                label="BPHTB / PPN / Fees"
                pct={state.acquisitionAdders.bphtbFees.pct}
                amount={state.acquisitionAdders.bphtbFees.amount}
                onPct={(val) =>
                  updateState({
                    acquisitionAdders: {
                      ...state.acquisitionAdders,
                      bphtbFees: { ...state.acquisitionAdders.bphtbFees, pct: Math.max(0, val) },
                    },
                  })
                }
                onAmount={(val) =>
                  updateState({
                    acquisitionAdders: {
                      ...state.acquisitionAdders,
                      bphtbFees: { ...state.acquisitionAdders.bphtbFees, amount: Math.max(0, val) },
                    },
                  })
                }
              />
              <AdderRow
                label="Legal"
                pct={state.acquisitionAdders.legal.pct}
                amount={state.acquisitionAdders.legal.amount}
                onPct={(val) =>
                  updateState({
                    acquisitionAdders: {
                      ...state.acquisitionAdders,
                      legal: { ...state.acquisitionAdders.legal, pct: Math.max(0, val) },
                    },
                  })
                }
                onAmount={(val) =>
                  updateState({
                    acquisitionAdders: {
                      ...state.acquisitionAdders,
                      legal: { ...state.acquisitionAdders.legal, amount: Math.max(0, val) },
                    },
                  })
                }
              />
              <AdderRow
                label="Due Diligence"
                pct={state.acquisitionAdders.dueDiligence.pct}
                amount={state.acquisitionAdders.dueDiligence.amount}
                onPct={(val) =>
                  updateState({
                    acquisitionAdders: {
                      ...state.acquisitionAdders,
                      dueDiligence: { ...state.acquisitionAdders.dueDiligence, pct: Math.max(0, val) },
                    },
                  })
                }
                onAmount={(val) =>
                  updateState({
                    acquisitionAdders: {
                      ...state.acquisitionAdders,
                      dueDiligence: { ...state.acquisitionAdders.dueDiligence, amount: Math.max(0, val) },
                    },
                  })
                }
              />
              <AdderRow
                label="Broker"
                pct={state.acquisitionAdders.broker.pct}
                amount={state.acquisitionAdders.broker.amount}
                onPct={(val) =>
                  updateState({
                    acquisitionAdders: {
                      ...state.acquisitionAdders,
                      broker: { ...state.acquisitionAdders.broker, pct: Math.max(0, val) },
                    },
                  })
                }
                onAmount={(val) =>
                  updateState({
                    acquisitionAdders: {
                      ...state.acquisitionAdders,
                      broker: { ...state.acquisitionAdders.broker, amount: Math.max(0, val) },
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Land Base Price</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(metrics.landBasePrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Acquisition Adders</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(metrics.acquisitionAddersTotal)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between text-sm">
                <span className="font-medium text-gray-900 dark:text-gray-100">Total Acquisition Cost</span>
                <span className="font-bold text-blue-600 dark:text-blue-500">{formatCurrency(metrics.totalAcquisitionCost)}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 min-h-[300px]">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Envelope Preview</h3>
          <div className="rounded-lg bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-6 h-[260px] flex items-end justify-center gap-5 select-none">
            <div className="w-20 rounded-t bg-gray-300 dark:bg-gray-700" style={{ height: `${Math.max(30, Math.min(150, state.maxBcr * 1.8))}px` }} />
            <div className="w-20 rounded-t bg-gray-500 dark:bg-gray-600" style={{ height: `${Math.max(40, Math.min(220, state.maxFar * 35))}px` }} />
            <div className="w-20 rounded-t bg-gray-400 dark:bg-gray-650" style={{ height: `${Math.max(20, Math.min(150, (state.heightLimit / 150) * 180))}px` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wider">Buildability</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Effective Developable Area</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatNumber(metrics.effectiveDevelopableArea)} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Max GFA</span>
                <span className="font-semibold text-blue-600 dark:text-blue-500">{formatNumber(metrics.maxGfa)} m²</span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wider">Land Test</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Asking (effective)</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(askingPerSqm)}/m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Base Headroom</span>
                <span className={`font-semibold ${metrics.activeHeadroomPct >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{metrics.activeHeadroomPct.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
