import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { InfoTip } from '../InfoTip';
import { formatCurrency, formatNumber, formatPercent } from '../../lib/format';
import { SelectInput, TextInput } from '../ui/FormControls';

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      {children}
    </div>
  );
}

export function FSTab() {
  const { state, updateState, metrics } = useProject();
  const activeUses = state.uses.filter((u) => u.enabled);

  const updateUse = (id: string, patch: any) => {
    updateState({ uses: state.uses.map((u) => (u.id === id ? { ...u, ...patch } : u)) });
  };

  const verdictClass =
    metrics.activeVerdict === 'Good'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800'
      : metrics.activeVerdict === 'Borderline'
        ? 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800'
        : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800';

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
        <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">FS-lite Disclaimer</h4>
        <p className="text-sm text-blue-800 dark:text-blue-200/80">Early-stage deterministic underwriting proxy; not a bankable model.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-4">Per-use Assumptions</h3>

            <div className="space-y-4">
              {activeUses.map((use) => (
                <div key={use.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                  <div className="font-semibold mb-3">{use.label}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Field label="Build Cost (IDR/m²)">
                      <TextInput
                        type="number"
                        min="0"
                        value={use.buildCostPerSqm}
                        onChange={(e) => updateUse(use.id, { buildCostPerSqm: Number(e.target.value) })}
                        className="text-right"
                      />
                    </Field>
                    <Field
                      label={
                        <span className="inline-flex items-center gap-2">
                          NLA Efficiency (%)
                          <InfoTip text="NLA efficiency is net leasable/sellable area divided by gross floor area." />
                        </span>
                      }
                    >
                      <TextInput
                        type="number"
                        min="0"
                        max="100"
                        value={use.efficiencyPct}
                        onChange={(e) => updateUse(use.id, { efficiencyPct: Number(e.target.value) })}
                        className="text-right"
                      />
                    </Field>

                    {use.revenueModel === 'rent' && (
                      <Field label="Rent (IDR/m²/month)">
                        <TextInput
                          type="number"
                          min="0"
                          value={use.rentPerSqmMonth}
                          onChange={(e) => updateUse(use.id, { rentPerSqmMonth: Number(e.target.value) })}
                          className="text-right"
                        />
                      </Field>
                    )}

                    {use.revenueModel === 'asp' && (
                      <>
                        <Field label="ASP (IDR/m²)">
                          <TextInput
                            type="number"
                            min="0"
                            value={use.aspPerSqm}
                            onChange={(e) => updateUse(use.id, { aspPerSqm: Number(e.target.value) })}
                            className="text-right"
                          />
                        </Field>
                        <Field label="Avg Unit Size (m²)">
                          <TextInput
                            type="number"
                            min="1"
                            value={use.avgUnitSize}
                            onChange={(e) => updateUse(use.id, { avgUnitSize: Number(e.target.value) })}
                            className="text-right"
                          />
                        </Field>
                      </>
                    )}

                    {use.revenueModel === 'hotel' && (
                      <>
                        <Field label="ADR (IDR/key/night)">
                          <TextInput
                            type="number"
                            min="0"
                            value={use.adr}
                            onChange={(e) => updateUse(use.id, { adr: Number(e.target.value) })}
                            className="text-right"
                          />
                        </Field>
                        <Field label="Occupancy (%)">
                          <TextInput
                            type="number"
                            min="0"
                            max="100"
                            value={use.occupancyPct}
                            onChange={(e) => updateUse(use.id, { occupancyPct: Number(e.target.value) })}
                            className="text-right"
                          />
                        </Field>
                        <Field label="Avg Key Size (m²)">
                          <TextInput
                            type="number"
                            min="1"
                            value={use.avgKeySize}
                            onChange={(e) => updateUse(use.id, { avgKeySize: Number(e.target.value) })}
                            className="text-right"
                          />
                        </Field>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">Underwriting Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Infra Rate (IDR/m²)">
                <TextInput
                  type="number"
                  min="0"
                  value={state.infraCostRate}
                  onChange={(e) => updateState({ infraCostRate: Number(e.target.value) })}
                  className="text-right"
                />
              </Field>
              <Field label="Infra Basis">
                <SelectInput
                  value={state.infraCostBasis}
                  onChange={(e) => updateState({ infraCostBasis: e.target.value as any })}
                  className="w-full"
                >
                  <option value="site">Per site m²</option>
                  <option value="buildable">Per buildable area (GFA)</option>
                </SelectInput>
              </Field>
              <Field label="Yield / Cap Rate (%)">
                <TextInput
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={state.yieldCapRatePct}
                  onChange={(e) => updateState({ yieldCapRatePct: Number(e.target.value) })}
                  className="text-right"
                />
              </Field>
              <Field label="Developer Profit / Target Return (%)">
                <TextInput
                  type="number"
                  min="0"
                  value={state.targetProfitPct}
                  onChange={(e) => updateState({ targetProfitPct: Number(e.target.value) })}
                  className="text-right"
                />
              </Field>
              <Field label="Soft Cost (%)">
                <TextInput
                  type="number"
                  min="0"
                  value={state.softCostPct}
                  onChange={(e) => updateState({ softCostPct: Number(e.target.value) })}
                  className="text-right"
                />
              </Field>
              <Field label="Contingency (%)">
                <TextInput
                  type="number"
                  min="0"
                  value={state.contingencyPct}
                  onChange={(e) => updateState({ contingencyPct: Number(e.target.value) })}
                  className="text-right"
                />
              </Field>
              <Field label="Finance / Interest Proxy (%)">
                <TextInput
                  type="number"
                  min="0"
                  value={state.financePct}
                  onChange={(e) => updateState({ financePct: Number(e.target.value) })}
                  className="text-right"
                />
              </Field>
              <Field label="Holding Period (months)">
                <TextInput
                  type="number"
                  min="0"
                  value={state.holdingPeriodMonths}
                  onChange={(e) => updateState({ holdingPeriodMonths: Number(e.target.value) })}
                  className="text-right"
                />
              </Field>
              <Field label="Holding Cost Proxy (% annual)">
                <TextInput
                  type="number"
                  min="0"
                  value={state.holdingCostPctAnnual}
                  onChange={(e) => updateState({ holdingCostPctAnnual: Number(e.target.value) })}
                  className="text-right"
                />
              </Field>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">Scenario Deltas (Base / Down / Up)</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Field label="Revenue Delta (%)">
                <TextInput
                  type="number"
                  min="0"
                  value={state.deltaRevenuePct}
                  onChange={(e) => updateState({ deltaRevenuePct: Number(e.target.value) })}
                  className="text-right"
                />
              </Field>
              <Field label="Capex Delta (%)">
                <TextInput
                  type="number"
                  min="0"
                  value={state.deltaCapexPct}
                  onChange={(e) => updateState({ deltaCapexPct: Number(e.target.value) })}
                  className="text-right"
                />
              </Field>
              <Field label="Cap Rate Delta (bps)">
                <TextInput
                  type="number"
                  min="0"
                  value={state.deltaCapRateBps}
                  onChange={(e) => updateState({ deltaCapRateBps: Number(e.target.value) })}
                  className="text-right"
                />
              </Field>
              <Field label="Safety Headroom Threshold (%)">
                <TextInput
                  type="number"
                  min="0"
                  value={state.safetyHeadroomThresholdPct}
                  onChange={(e) => updateState({ safetyHeadroomThresholdPct: Number(e.target.value) })}
                  className="text-right"
                />
              </Field>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Quick FS Summary</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
              <div className="px-5 py-3 flex justify-between"><span>Total Acquisition</span><span className="font-semibold">{formatCurrency(metrics.totalAcquisitionCost)}</span></div>
              <div className="px-5 py-3 flex justify-between"><span>Hard Cost</span><span className="font-semibold">{formatCurrency(metrics.hardCost)}</span></div>
              <div className="px-5 py-3 flex justify-between"><span>Soft + Contingency + Finance</span><span className="font-semibold">{formatCurrency(metrics.softCost + metrics.contingencyCost + metrics.financeCost)}</span></div>
              <div className="px-5 py-3 flex justify-between"><span>Total Capex</span><span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(metrics.totalCapex)}</span></div>
              <div className="px-5 py-3 flex justify-between"><span>Annual Revenue / GDV proxy</span><span className="font-semibold">{formatCurrency(metrics.annualRevenue)}</span></div>
              <div className="px-5 py-3 flex justify-between"><span>EBITDA / NOI proxy</span><span className="font-semibold">{formatCurrency(metrics.annualEbitda)}</span></div>
              <div className="px-5 py-3 flex justify-between"><span>Terminal Value</span><span className="font-semibold">{formatCurrency(metrics.terminalValueBase)}</span></div>
              <div className="px-5 py-3 flex justify-between"><span>Return Score</span><span className="font-bold">{metrics.returnScore}/100</span></div>
            </div>
          </section>

          <section id="land-verdict-panel" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 inline-flex items-center gap-2">
                  Land Value Verdict
                  <InfoTip text="RLV is the residual value left for land after capex and target return are deducted from terminal value." />
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Base / Downside / Upside</p>
              </div>
              <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${verdictClass}`}>{metrics.activeVerdict}</span>
            </div>

            <div className="text-3xl font-bold mb-4">{formatPercent(metrics.activeHeadroomPct)}</div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-gray-800">
                    <th className="py-1">Case</th>
                    <th className="py-1 text-right">RLV Total</th>
                    <th className="py-1 text-right">RLV/m²</th>
                    <th className="py-1 text-right">Break-even Ask</th>
                    <th className="py-1 text-right">Headroom</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.cases.map((c) => (
                    <tr key={c.label} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-1.5">{c.label}</td>
                      <td className="py-1.5 text-right">{formatCurrency(c.rlvTotal)}</td>
                      <td className="py-1.5 text-right">{formatCurrency(c.rlvPerSqm)}</td>
                      <td className="py-1.5 text-right">{formatCurrency(c.breakEvenAskingPerSqm)}</td>
                      <td className="py-1.5 text-right">{formatPercent(c.headroomPct)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-4">Investor Snapshot (In-app)</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-xs uppercase text-gray-500 mb-1">GFA / NLA by Use</div>
                <div className="space-y-1">
                  {activeUses.map((use) => (
                    <div key={`snap-${use.id}`} className="flex justify-between">
                      <span>{use.label}</span>
                      <span className="font-medium">
                        {formatNumber(metrics.gfaByUse[use.id] ?? 0)} / {formatNumber(metrics.nlaByUse[use.id] ?? 0)} m²
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800 pt-3 space-y-1">
                <div className="flex justify-between"><span>Parking (Req/Ach/Gap)</span><span className="font-medium">{formatNumber(metrics.parkingRequired)} / {formatNumber(metrics.parkingAchieved)} / {formatNumber(metrics.parkingGap)}</span></div>
                <div className="flex justify-between"><span>Capex Breakdown</span><span className="font-medium">Hard {formatCurrency(metrics.hardCost)} + Other {formatCurrency(metrics.totalCapex - metrics.hardCost)}</span></div>
                <div className="flex justify-between"><span>Revenue / EBITDA</span><span className="font-medium">{formatCurrency(metrics.annualRevenue)} / {formatCurrency(metrics.annualEbitda)}</span></div>
                <div className="flex justify-between"><span>Terminal Value</span><span className="font-medium">{formatCurrency(metrics.terminalValueBase)}</span></div>
                <div className="flex justify-between"><span>RLV (Base)</span><span className="font-medium">{formatCurrency(metrics.cases[0].rlvPerSqm)}/m²</span></div>
                <div className="flex justify-between"><span>Verdict</span><span className="font-semibold">{metrics.activeVerdict}</span></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
