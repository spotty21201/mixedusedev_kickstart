import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { InfoTip } from '../InfoTip';
import { formatCurrency, formatNumber, parseNumber } from '../../lib/format';
import { SelectInput, TextInput } from '../ui/FormControls';

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">{label}</label>
      {children}
    </div>
  );
}

function NumericInput({
  value,
  onChange,
  suffix,
  prefix,
  disabled,
}: {
  value: number;
  onChange: (val: number) => void;
  suffix?: string;
  prefix?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{prefix}</span>}
      <TextInput
        type="text"
        inputMode="decimal"
        value={formatNumber(value, 0)}
        onChange={(e) => onChange(parseNumber(e.target.value))}
        className={`text-right ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-12' : ''}`}
        disabled={disabled}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{suffix}</span>}
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
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <Field label="Project Name">
              <TextInput
                type="text"
                value={state.projectName}
                onChange={(e) => updateSimple('projectName', e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Gross Site Area">
                <NumericInput
                  value={state.siteArea}
                  suffix="m²"
                  onChange={(val) => {
                    updateState({ siteArea: Math.max(0, val), landArea: Math.max(0, val) });
                  }}
                />
              </Field>
              <Field label="Frontage">
                <NumericInput
                  value={state.frontage}
                  suffix="m"
                  onChange={(val) => updateSimple('frontage', Math.max(0, val))}
                />
              </Field>
            </div>

            <Field label="Shape Complexity">
              <SelectInput value={state.shapeComplexity} onChange={(e) => updateSimple('shapeComplexity', e.target.value)}>
                <option>Rectangular (Regular)</option>
                <option>L-Shape (Semi-Regular)</option>
                <option>Trapezoid (Irregular)</option>
              </SelectInput>
            </Field>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Regulation Parameters</h2>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field
                label={
                  <span className="inline-flex items-center gap-2">
                    Max FAR (KLB)
                    <InfoTip text="KLB/FAR is the maximum floor area ratio: total GFA divided by site area." />
                  </span>
                }
              >
                <NumericInput value={state.maxFar} onChange={(val) => updateSimple('maxFar', Math.max(0, val))} suffix="x" />
              </Field>
              <Field
                label={
                  <span className="inline-flex items-center gap-2">
                    Max BCR (KDB)
                    <InfoTip text="KDB is max building coverage: footprint as a percentage of site area." />
                  </span>
                }
              >
                <NumericInput value={state.maxBcr} onChange={(val) => updateSimple('maxBcr', Math.max(0, Math.min(100, val)))} suffix="%" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label={
                  <span className="inline-flex items-center gap-2">
                    Height Limit (KKOP)
                    <InfoTip text="KKOP is aviation-related height control for building envelopes." />
                  </span>
                }
              >
                <NumericInput value={state.heightLimit} onChange={(val) => updateSimple('heightLimit', Math.max(0, val))} suffix="m" />
              </Field>
              <Field
                label={
                  <span className="inline-flex items-center gap-2">
                    Setback (GSB)
                    <InfoTip text="GSB is the required setback distance from property boundaries or street edge." />
                  </span>
                }
              >
                <NumericInput value={state.setback} onChange={(val) => updateSimple('setback', Math.max(0, val))} suffix="m" />
              </Field>
            </div>

            <Field
              label={
                <span className="inline-flex items-center gap-2">
                  Green Coefficient (KDH)
                  <InfoTip text="KDH is minimum green/open area requirement as percentage of site area." />
                </span>
              }
            >
              <NumericInput value={state.greenCoeff} onChange={(val) => updateSimple('greenCoeff', Math.max(0, Math.min(100, val)))} suffix="%" />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Land Acquisition</h2>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Land Area">
                <NumericInput value={state.landArea} onChange={(val) => updateSimple('landArea', Math.max(1, val))} suffix="m²" />
              </Field>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Sync</label>
                <button
                  onClick={() => updateSimple('landArea', state.siteArea)}
                  className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
                >
                  Sync to Site Area
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border border-gray-300 dark:border-gray-700 p-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Use lump-sum asking</span>
              <input
                type="checkbox"
                checked={state.useLumpSumAsking}
                onChange={(e) => updateSimple('useLumpSumAsking', e.target.checked)}
                className="h-4 w-4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Asking Price">
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
                  suffix="/m²"
                />
              </Field>
              <Field label="Lump-Sum Asking">
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
              </Field>
            </div>

            <div className="rounded-md border border-gray-300 dark:border-gray-700 p-4 space-y-3">
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

            <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
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
