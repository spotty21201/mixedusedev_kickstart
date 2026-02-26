import React from 'react';
import { Building2, RotateCcw, Download, Moon, Sun, FileDown, Table } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { formatCurrency, formatNumber, formatPercent } from '../lib/format';

export function Header() {
  const { resetState, state, metrics } = useProject();
  const [isDark, setIsDark] = React.useState(false);
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [showExportMenu, setShowExportMenu] = React.useState(false);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const activeUses = state.uses.filter((use) => use.enabled);

  const exportCsv = () => {
    const rows: Array<[string, string]> = [];
    rows.push(['project_name', state.projectName]);
    rows.push(['site_area_m2', String(state.siteArea)]);
    rows.push(['land_area_m2', String(state.landArea)]);
    rows.push(['max_gfa_m2', String(metrics.maxGfa)]);
    rows.push(['blended_efficiency_pct', String(metrics.blendedEfficiencyPct)]);
    rows.push(['parking_required', String(metrics.parkingRequired)]);
    rows.push(['parking_achieved', String(metrics.parkingAchieved)]);
    rows.push(['parking_gap', String(metrics.parkingGap)]);
    rows.push(['annual_revenue', String(metrics.annualRevenue)]);
    rows.push(['annual_ebitda', String(metrics.annualEbitda)]);
    rows.push(['total_capex', String(metrics.totalCapex)]);
    rows.push(['total_acquisition', String(metrics.totalAcquisitionCost)]);
    rows.push(['verdict', metrics.activeVerdict]);

    metrics.cases.forEach((c) => {
      rows.push([`rlv_${c.label.toLowerCase()}_total`, String(c.rlvTotal)]);
      rows.push([`rlv_${c.label.toLowerCase()}_per_sqm`, String(c.rlvPerSqm)]);
      rows.push([`headroom_${c.label.toLowerCase()}_pct`, String(c.headroomPct)]);
      rows.push([`break_even_${c.label.toLowerCase()}_per_sqm`, String(c.breakEvenAskingPerSqm)]);
    });

    activeUses.forEach((use) => {
      rows.push([`use_${use.id}_allocation_pct`, String(use.allocationPct)]);
      rows.push([`use_${use.id}_gfa`, String(metrics.gfaByUse[use.id] ?? 0)]);
      rows.push([`use_${use.id}_nla`, String(metrics.nlaByUse[use.id] ?? 0)]);
      rows.push([`use_${use.id}_efficiency_pct`, String(use.efficiencyPct)]);
      rows.push([`use_${use.id}_build_cost_per_sqm`, String(use.buildCostPerSqm)]);
    });

    const csv = ['key,value', ...rows.map(([k, v]) => `${k},${v}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${state.projectName.replace(/\s+/g, '_')}_snapshot.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportPdf = () => {
    const cBase = metrics.cases[0];
    const cDown = metrics.cases[1];
    const cUp = metrics.cases[2];
    const askingPerSqm = state.useLumpSumAsking
      ? state.lumpSumAsking / Math.max(state.landArea, 1)
      : state.askingPricePerSqm;
    const totalAsking = askingPerSqm * state.landArea;
    const useOrder = ['retail', 'office', 'hotel', 'residential', 'event'];
    const orderedUses = activeUses
      .slice()
      .sort((a, b) => {
        const ai = useOrder.indexOf(a.id);
        const bi = useOrder.indexOf(b.id);
        const ar = ai === -1 ? 999 : ai;
        const br = bi === -1 ? 999 : bi;
        if (ar === br) return a.label.localeCompare(b.label);
        return ar - br;
      });

    const gfaTotal = orderedUses.reduce((sum, use) => sum + (metrics.gfaByUse[use.id] ?? 0), 0);
    const nlaTotal = orderedUses.reduce((sum, use) => sum + (metrics.nlaByUse[use.id] ?? 0), 0);

    const gfaRows = orderedUses
      .map((use, idx) => {
        const gfa = metrics.gfaByUse[use.id] ?? 0;
        const nla = metrics.nlaByUse[use.id] ?? 0;
        const eff = gfa > 0 ? (nla / gfa) * 100 : 0;
        return `<tr class="${idx % 2 ? 'zebra' : ''}"><td>${use.label}</td><td>${formatNumber(gfa)}</td><td>${formatNumber(nla)}</td><td>${formatPercent(eff, 1)}</td></tr>`;
      })
      .join('');

    const formatHeadroomPdf = (value: number): string => {
      if (value < -100) return '< -100%*';
      return formatPercent(value, 1);
    };
    const formatBreakEven = (value: number): string => {
      if (value <= 0) return 'N/A';
      return formatCurrency(value);
    };

    const verdictBadgeClass =
      metrics.activeVerdict === 'Good'
        ? 'badge-good'
        : metrics.activeVerdict === 'Borderline'
          ? 'badge-borderline'
          : 'badge-overpriced';
    const spreadPct = askingPerSqm > 0 ? ((askingPerSqm - cBase.rlvPerSqm) / askingPerSqm) * 100 : 0;
    const verdictSentence =
      metrics.activeVerdict === 'Overpriced'
        ? `Asking ${formatCurrency(askingPerSqm)}/m² exceeds Base RLV ${formatCurrency(cBase.rlvPerSqm)}/m² by ${formatPercent(Math.max(spreadPct, 0), 1)}.`
        : metrics.activeVerdict === 'Borderline'
          ? `Asking ${formatCurrency(askingPerSqm)}/m² is near Base RLV ${formatCurrency(cBase.rlvPerSqm)}/m² with limited buffer.`
          : `Asking ${formatCurrency(askingPerSqm)}/m² is below Base RLV ${formatCurrency(cBase.rlvPerSqm)}/m² with positive headroom.`;
    const exportedAt = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    let titleProjectName = state.projectName;
    if (titleProjectName.includes(' - ') && !titleProjectName.includes('(')) {
      const [left, right] = titleProjectName.split(' - ');
      if (left && right) titleProjectName = `${left} (${right})`;
    }

    const html = `
      <html>
      <head>
        <title>${state.projectName} - Snapshot</title>
        <style>
          :root {
            --sectionTitleMarginTop: 24px;
            --sectionTitleMarginBottom: 12px;
            --tableBlockPadding: 12px;
            --tableBlockMarginBottom: 20px;
          }
          body { font-family: Arial, sans-serif; padding: 8px 12px; font-size: 10.5px; color:#111827; }
          h2{ margin:0; color:#2563eb; font-size:18px; line-height:1.2; font-weight:700; }
          .band-a { margin-bottom:10px; }
          .band-b { margin-bottom:30px; }
          .band-c { margin-top:4px; }
          .title { margin:0 0 4px 0; font-size:24px; line-height:1.15; font-weight:700; }
          .title .brand { color:#2563eb; }
          .title .project { color:#374151; }
          .meta { margin-bottom:8px; color:#6b7280; font-size:10px; }
          .row { display:flex; gap:6px; margin-bottom:8px; }
          .card { border:1px solid #d1d5db; padding:7px; border-radius:6px; flex:1; min-height:46px; }
          .kpi-label { font-size:9px; color:#6b7280; text-transform:uppercase; margin-bottom:3px; }
          .kpi-value { font-size:13px; font-weight:700; }
          .kpi-risk { color:#f97316; }
          .kpi-good { color:#2563eb; }
          .acq { border:1px solid #d1d5db; border-radius:6px; padding:6px 8px; margin:2px 0 10px; display:grid; grid-template-columns:repeat(6,1fr); gap:6px; }
          .acq div { font-size:10px; }
          .acq b { color:#111827; }
          .section { margin-top: var(--sectionTitleMarginTop); }
          .section-title-wrap { margin-bottom: var(--sectionTitleMarginBottom); }
          .section-subtitle { margin-top:3px; color:#6b7280; font-size:9px; }
          .table-block { padding: 0; margin-bottom: 30px; background:#ffffff; }
          table { width:100%; border-collapse:collapse; }
          th,td { border:1px solid #d1d5db; padding:4px; text-align:right; }
          th { color:#1d4ed8; background:#f9fafb; font-weight:700; font-size:10px; padding-top:3px; padding-bottom:3px; }
          tr.zebra td { background:#fafafa; }
          th:first-child, td:first-child { text-align:left; }
          .badge { display:inline-block; padding:2px 8px; border-radius:999px; border:1px solid; font-weight:700; font-size:10px; }
          .badge-good { color:#1d4ed8; background:#eff6ff; border-color:#bfdbfe; }
          .badge-borderline { color:#92400e; background:#fff7ed; border-color:#fdba74; }
          .badge-overpriced { color:#b45309; background:#fff7ed; border-color:#fdba74; }
          .verdict-line { margin-top: 12px; }
          .footer { margin-top:12px; color:#6b7280; font-size:9px; border-top:1px solid #d1d5db; padding-top:4px; line-height:1.35; }
          @page { size: A4 portrait; margin: 8mm; }
        </style>
      </head>
      <body>
        <div class="band-a">
          <h1 class="title"><span class="brand">Mixed Use Destination Kickstart</span> <span class="project">— ${titleProjectName} — Investment Snapshot</span></h1>
          <div class="meta">Project: ${state.projectName} | Site Area: ${formatNumber(state.siteArea)} m² | Asking: ${formatCurrency(askingPerSqm)}/m²</div>
        </div>

        <div class="band-b">
          <div class="row">
            <div class="card"><div class="kpi-label">Site Area</div><div class="kpi-value">${formatNumber(state.siteArea)} m²</div></div>
            <div class="card"><div class="kpi-label">Max GFA</div><div class="kpi-value">${formatNumber(metrics.maxGfa)} m²</div></div>
            <div class="card"><div class="kpi-label">Blended NLA Eff</div><div class="kpi-value">${formatPercent(metrics.blendedEfficiencyPct, 1)}</div></div>
            <div class="card"><div class="kpi-label">Parking (Req / Ach)</div><div class="kpi-value ${metrics.parkingCompliant ? 'kpi-good' : 'kpi-risk'}">${formatNumber(metrics.parkingRequired)} / ${formatNumber(metrics.parkingAchieved)}</div></div>
            <div class="card"><div class="kpi-label">Asking Price (Rp/m²)</div><div class="kpi-value">${formatCurrency(askingPerSqm)}</div></div>
            <div class="card"><div class="kpi-label">Total Asking (Rp)</div><div class="kpi-value">${formatCurrency(totalAsking)}</div></div>
          </div>
          <div class="acq">
            <div>Land Area<br><b>${formatNumber(state.landArea)} m²</b></div>
            <div>Asking<br><b>${formatCurrency(askingPerSqm)}/m²</b></div>
            <div>Total Asking<br><b>${formatCurrency(totalAsking)}</b></div>
            <div>RLV Base<br><b>${cBase.rlvPerSqm > 0 ? `${formatCurrency(cBase.rlvPerSqm)}/m²` : 'N/A'}</b></div>
            <div>Headroom Base<br><b>${formatHeadroomPdf(cBase.headroomPct)}</b></div>
            <div>Verdict<br><span class="badge ${verdictBadgeClass}">${metrics.activeVerdict}</span></div>
          </div>
          <div class="row">
            <div class="card"><div class="kpi-label">Total Acquisition</div><div class="kpi-value">${formatCurrency(metrics.totalAcquisitionCost)}</div></div>
            <div class="card"><div class="kpi-label">Total Capex</div><div class="kpi-value">${formatCurrency(metrics.totalCapex)}</div></div>
            <div class="card"><div class="kpi-label">Revenue (Annual)</div><div class="kpi-value">${formatCurrency(metrics.annualRevenue)}</div></div>
            <div class="card"><div class="kpi-label">EBITDA / NOI proxy</div><div class="kpi-value">${formatCurrency(metrics.annualEbitda)}</div></div>
          </div>
        </div>

        <div class="band-c">
          <div class="section" style="margin-top:30px;">
            <div class="section-title-wrap">
              <h2>GFA / NLA by Use</h2>
              <div class="section-subtitle">Gross vs Net Leasable Area and efficiency by function.</div>
            </div>
            <div class="table-block" style="margin-top:14px; margin-bottom:30px;">
              <table>
                <thead><tr><th>Use</th><th>GFA (m²)</th><th>NLA (m²)</th><th>Efficiency %</th></tr></thead>
                <tbody>
                  ${gfaRows}
                  <tr><td><b>TOTAL</b></td><td><b>${formatNumber(gfaTotal)}</b></td><td><b>${formatNumber(nlaTotal)}</b></td><td><b>${formatPercent(gfaTotal > 0 ? (nlaTotal / gfaTotal) * 100 : 0, 1)}</b></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="section" style="margin-top:36px;">
            <div class="section-title-wrap">
              <h2>RLV and Land Verdict</h2>
              <div class="section-subtitle">Residual Land Value vs asking price under Base/Down/Up cases.</div>
            </div>
            <div class="table-block" style="margin-top:14px; margin-bottom:20px;">
              <table>
                <thead><tr><th>Case</th><th>RLV Total</th><th>RLV/m²</th><th>Asking (Rp/m²)</th><th>Headroom %</th><th>Break-even Ask/m²</th></tr></thead>
                <tbody>
                  <tr><td>Base</td><td>${formatCurrency(cBase.rlvTotal)}</td><td>${formatCurrency(cBase.rlvPerSqm)}</td><td>${formatCurrency(askingPerSqm)}</td><td>${formatHeadroomPdf(cBase.headroomPct)}</td><td>${formatBreakEven(cBase.breakEvenAskingPerSqm)}</td></tr>
                  <tr class="zebra"><td>Down</td><td>${formatCurrency(cDown.rlvTotal)}</td><td>${formatCurrency(cDown.rlvPerSqm)}</td><td>${formatCurrency(askingPerSqm)}</td><td>${formatHeadroomPdf(cDown.headroomPct)}</td><td>${formatBreakEven(cDown.breakEvenAskingPerSqm)}</td></tr>
                  <tr><td>Up</td><td>${formatCurrency(cUp.rlvTotal)}</td><td>${formatCurrency(cUp.rlvPerSqm)}</td><td>${formatCurrency(askingPerSqm)}</td><td>${formatHeadroomPdf(cUp.headroomPct)}</td><td>${formatBreakEven(cUp.breakEvenAskingPerSqm)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="verdict-line">
            <span class="badge ${verdictBadgeClass}">${metrics.activeVerdict}</span>
            <span style="margin-left:6px;">${verdictSentence} Good requires ≥ +${formatNumber(state.safetyHeadroomThresholdPct)}% headroom.</span>
          </div>
        </div>
        <div class="footer">
          Assumptions: Cap rate ${formatPercent(state.yieldCapRatePct, 2)}, Soft cost ${formatPercent(state.softCostPct, 1)}, Contingency ${formatPercent(state.contingencyPct, 1)}, Target return ${formatPercent(state.targetProfitPct, 1)}.
          <br/>
          Mixed Use Destination Kickstart | Version: v0.0 | Exported: ${exportedAt} | *Headroom below -100% is displayed as &lt; -100%.
          <br/>
          Developed by Kolabs.Design for HDA+AIM Collective.
          <br/>
          Kolabs.Design - https://kolabs.design
        </div>
      </body></html>
    `;

    const popup = window.open('', '_blank', 'width=1100,height=850');
    if (!popup) return;
    popup.document.write(html);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Building2 size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">Mixed Use Destination Kickstart v.0.0</h1>
          <p className="text-xs text-gray-700 dark:text-gray-400 font-small">
            Master Plan+Feasibility Tool Powered by Kolabs.Design for HDA+AIM Collective
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          <RotateCcw size={16} className="mr-1.5" />
          Reset
        </button>

        <div className="relative">
          <button
            onClick={() => setShowExportMenu((prev) => !prev)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Download size={16} className="mr-1.5" />
            Export
          </button>
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 z-50">
              <button
                onClick={() => {
                  exportPdf();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <FileDown size={14} /> PDF (1-page print)
              </button>
              <button
                onClick={() => {
                  exportCsv();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <Table size={14} /> CSV (metrics + assumptions)
              </button>
            </div>
          )}
        </div>

        <button
          onClick={toggleDark}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[70]">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-5 w-[360px] border border-gray-200 dark:border-gray-700 shadow-xl">
            <h3 className="font-semibold text-gray-900 dark:text-white">Reset project values?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">This clears all inputs and local saved state.</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetState();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
