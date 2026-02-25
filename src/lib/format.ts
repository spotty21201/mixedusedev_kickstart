export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number, digits = 1): string {
  return `${formatNumber(value, digits)}%`;
}

export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e12) return `Rp ${formatNumber(value / 1e12, 2)} T`;
  if (abs >= 1e9) return `Rp ${formatNumber(value / 1e9, 2)} B`;
  if (abs >= 1e6) return `Rp ${formatNumber(value / 1e6, 2)} M`;
  return `Rp ${formatNumber(value, 0)}`;
}

export function parseNumber(value: string): number {
  const normalized = value.replace(/,/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}
