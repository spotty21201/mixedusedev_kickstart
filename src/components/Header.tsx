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
    const gfaRows = activeUses
      .map(
        (use) =>
          `<tr><td>${use.label}</td><td>${formatNumber(metrics.gfaByUse[use.id] ?? 0)}</td><td>${formatNumber(metrics.nlaByUse[use.id] ?? 0)}</td></tr>`,
      )
      .join('');

    const html = `
      <html>
      <head>
        <title>${state.projectName} - Snapshot</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 14px; font-size: 11px; color:#111; }
          h1,h2{ margin:0 0 6px 0; }
          .row { display:flex; gap:8px; margin-bottom:8px; }
          .card { border:1px solid #d4d4d8; padding:8px; border-radius:6px; flex:1; }
          table { width:100%; border-collapse:collapse; }
          th,td { border:1px solid #e4e4e7; padding:4px; text-align:right; }
          th:first-child, td:first-child { text-align:left; }
          @page { size: A4 portrait; margin: 8mm; }
        </style>
      </head>
      <body>
        <h1>Mixed Use Destination Kickstart - Investor Snapshot</h1>
        <div>Project: ${state.projectName}</div>
        <div class="row">
          <div class="card">Site Area: ${formatNumber(state.siteArea)} m2</div>
          <div class="card">Max GFA: ${formatNumber(metrics.maxGfa)} m2</div>
          <div class="card">Blended Eff: ${formatPercent(metrics.blendedEfficiencyPct)}</div>
          <div class="card">Parking: ${formatNumber(metrics.parkingRequired)} / ${formatNumber(metrics.parkingAchieved)}</div>
        </div>
        <div class="row">
          <div class="card">Total Acquisition: ${formatCurrency(metrics.totalAcquisitionCost)}</div>
          <div class="card">Total Capex: ${formatCurrency(metrics.totalCapex)}</div>
          <div class="card">Revenue: ${formatCurrency(metrics.annualRevenue)}</div>
          <div class="card">EBITDA: ${formatCurrency(metrics.annualEbitda)}</div>
        </div>
        <h2>GFA / NLA by Use</h2>
        <table><thead><tr><th>Use</th><th>GFA m2</th><th>NLA m2</th></tr></thead><tbody>${gfaRows}</tbody></table>
        <h2 style="margin-top:8px;">RLV and Land Verdict</h2>
        <table>
          <thead><tr><th>Case</th><th>RLV Total</th><th>RLV/m2</th><th>Headroom %</th><th>Break-even Ask/m2</th></tr></thead>
          <tbody>
            <tr><td>Base</td><td>${formatCurrency(cBase.rlvTotal)}</td><td>${formatCurrency(cBase.rlvPerSqm)}</td><td>${formatPercent(cBase.headroomPct)}</td><td>${formatCurrency(cBase.breakEvenAskingPerSqm)}</td></tr>
            <tr><td>Down</td><td>${formatCurrency(cDown.rlvTotal)}</td><td>${formatCurrency(cDown.rlvPerSqm)}</td><td>${formatPercent(cDown.headroomPct)}</td><td>${formatCurrency(cDown.breakEvenAskingPerSqm)}</td></tr>
            <tr><td>Up</td><td>${formatCurrency(cUp.rlvTotal)}</td><td>${formatCurrency(cUp.rlvPerSqm)}</td><td>${formatPercent(cUp.headroomPct)}</td><td>${formatCurrency(cUp.breakEvenAskingPerSqm)}</td></tr>
          </tbody>
        </table>
        <div style="margin-top:8px;"><b>Verdict:</b> ${metrics.activeVerdict}</div>
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
