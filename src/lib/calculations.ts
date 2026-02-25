import { ProjectState, ProgramUse, TypologyType } from '../types';

export interface ScenarioCase {
  label: 'Base' | 'Downside' | 'Upside';
  revenue: number;
  capex: number;
  capRatePct: number;
  terminalValue: number;
  targetProfit: number;
  rlvTotal: number;
  rlvPerSqm: number;
  headroomPct: number;
  breakEvenAskingPerSqm: number;
}

export interface ProjectMetrics {
  allocationTotalPct: number;
  allocationWarning: boolean;
  maxGfa: number;
  effectiveDevelopableArea: number;
  blendedEfficiencyPct: number;
  gfaByUse: Record<string, number>;
  nlaByUse: Record<string, number>;
  totalNla: number;
  totalUnitsByUse: Record<string, number>;
  totalKeysByUse: Record<string, number>;
  parkingRequired: number;
  parkingAchieved: number;
  parkingGap: number;
  parkingCompliant: boolean;
  parkingStatusLabel: string;
  landBasePrice: number;
  acquisitionAddersTotal: number;
  totalAcquisitionCost: number;
  infraCost: number;
  hardCost: number;
  softCost: number;
  contingencyCost: number;
  financeCost: number;
  holdingCost: number;
  totalCapex: number;
  annualRevenue: number;
  annualEbitda: number;
  terminalValueBase: number;
  cases: ScenarioCase[];
  activeVerdict: 'Good' | 'Borderline' | 'Overpriced';
  activeHeadroomPct: number;
  returnScore: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function typologyEfficiencyDelta(typology: TypologyType): number {
  if (typology === 'mid_rise') return 1.5;
  if (typology === 'courtyard') return -1.25;
  return 0;
}

function typologyParkingDelta(typology: TypologyType): number {
  if (typology === 'mid_rise') return 0.95;
  if (typology === 'courtyard') return 0.9;
  return 1;
}

function enabledUses(uses: ProgramUse[]): ProgramUse[] {
  return uses.filter((use) => use.enabled);
}

export function calculateProjectMetrics(state: ProjectState): ProjectMetrics {
  const activeUses = enabledUses(state.uses);
  const allocationTotalPct = activeUses.reduce((sum, use) => sum + Math.max(use.allocationPct, 0), 0);
  const allocationFactor = allocationTotalPct > 0 ? 100 / allocationTotalPct : 0;
  const normalizedAllocations = activeUses.map((use) => ({
    ...use,
    normalizedPct: use.allocationPct * allocationFactor,
  }));

  const maxGfa = state.siteArea * state.maxFar;
  const setbackPenalty = clamp((state.setback / 100) * 0.2, 0.01, 0.08);
  const greenPenalty = clamp(state.greenCoeff / 100, 0.05, 0.5);
  const effectiveDevelopableArea = state.siteArea * (1 - Math.max(setbackPenalty, greenPenalty * 0.35));

  const gfaByUse: Record<string, number> = {};
  const nlaByUse: Record<string, number> = {};
  const totalUnitsByUse: Record<string, number> = {};
  const totalKeysByUse: Record<string, number> = {};

  let totalNla = 0;
  let weightedEff = 0;
  let hardCost = 0;
  let annualRevenue = 0;
  let annualEbitda = 0;
  let parkingRequired = 0;

  const parkingTypologyFactor = typologyParkingDelta(state.typology);
  const efficiencyTypologyDelta = typologyEfficiencyDelta(state.typology);

  normalizedAllocations.forEach((use) => {
    const gfa = maxGfa * (use.normalizedPct / 100);
    const effPct = clamp(use.efficiencyPct + efficiencyTypologyDelta, 55, 92);
    const nla = gfa * (effPct / 100);
    const rule = state.parkingRules[use.id];
    const units = use.avgUnitSize > 0 ? nla / use.avgUnitSize : 0;
    const keys = use.avgKeySize > 0 ? nla / use.avgKeySize : 0;

    gfaByUse[use.id] = gfa;
    nlaByUse[use.id] = nla;
    totalUnitsByUse[use.id] = units;
    totalKeysByUse[use.id] = keys;
    totalNla += nla;
    weightedEff += gfa * effPct;
    hardCost += gfa * use.buildCostPerSqm;

    let revenue = 0;
    if (use.revenueModel === 'rent') {
      revenue = nla * use.rentPerSqmMonth * 12;
    } else if (use.revenueModel === 'asp') {
      revenue = nla * use.aspPerSqm;
    } else {
      revenue = keys * use.adr * 365 * (use.occupancyPct / 100);
    }

    annualRevenue += revenue;
    annualEbitda += revenue * (use.ebitdaMarginPct / 100);

    if (rule.ruleType === 'per_100_nla') {
      parkingRequired += (nla / 100) * rule.value;
    } else if (rule.ruleType === 'per_unit') {
      parkingRequired += units * rule.value;
    } else if (rule.ruleType === 'per_key') {
      parkingRequired += keys * rule.value;
    }
  });

  const blendedEfficiencyPct = maxGfa > 0 ? weightedEff / maxGfa : 0;
  const baseParkingArea =
    state.parkingStrategy === 'surface'
      ? Math.max(state.siteArea * (1 - state.maxBcr / 100), 0)
      : state.parkingStrategy === 'podium'
        ? state.siteArea * (state.maxBcr / 100) * Math.max(state.podiumParkingFloors, 1)
        : state.siteArea * (state.maxBcr / 100) * Math.max(state.basementLevels, 1);
  const parkingAchieved = (baseParkingArea * state.parkingEfficiency * parkingTypologyFactor) / state.stallAreaSqm;
  const parkingGap = Math.max(parkingRequired - parkingAchieved, 0);
  const parkingCompliant = parkingGap <= 0.01;

  const landBasePrice = state.useLumpSumAsking
    ? state.lumpSumAsking
    : state.askingPricePerSqm * Math.max(state.landArea, 1);
  const calcAdder = (pct: number, amount: number) => landBasePrice * (pct / 100) + amount;
  const acquisitionAddersTotal =
    calcAdder(state.acquisitionAdders.bphtbFees.pct, state.acquisitionAdders.bphtbFees.amount) +
    calcAdder(state.acquisitionAdders.legal.pct, state.acquisitionAdders.legal.amount) +
    calcAdder(state.acquisitionAdders.dueDiligence.pct, state.acquisitionAdders.dueDiligence.amount) +
    calcAdder(state.acquisitionAdders.broker.pct, state.acquisitionAdders.broker.amount);
  const totalAcquisitionCost = landBasePrice + acquisitionAddersTotal;

  const infraBasis = state.infraCostBasis === 'site' ? state.siteArea : maxGfa;
  const infraCost = infraBasis * state.infraCostRate;
  const softCost = hardCost * (state.softCostPct / 100);
  const contingencyCost = hardCost * (state.contingencyPct / 100);
  const financeCost = hardCost * (state.financePct / 100);
  const holdingCost =
    totalAcquisitionCost * (state.holdingCostPctAnnual / 100) * (state.holdingPeriodMonths / 12);
  const totalCapex =
    totalAcquisitionCost + infraCost + hardCost + softCost + contingencyCost + financeCost + holdingCost;

  const caseInputs = [
    { label: 'Base' as const, revenueFactor: 1, capexFactor: 1, capRateShift: 0 },
    {
      label: 'Downside' as const,
      revenueFactor: 1 - state.deltaRevenuePct / 100,
      capexFactor: 1 + state.deltaCapexPct / 100,
      capRateShift: state.deltaCapRateBps / 100,
    },
    {
      label: 'Upside' as const,
      revenueFactor: 1 + state.deltaRevenuePct / 100,
      capexFactor: 1 - state.deltaCapexPct / 100,
      capRateShift: -state.deltaCapRateBps / 100,
    },
  ];

  const cases: ScenarioCase[] = caseInputs.map((input) => {
    const capRatePct = Math.max(0.5, state.yieldCapRatePct + input.capRateShift);
    const revenue = annualRevenue * input.revenueFactor;
    const ebitda = annualEbitda * input.revenueFactor;
    const capex = totalCapex * input.capexFactor;
    const terminalValue = ebitda / (capRatePct / 100);
    const targetProfit = terminalValue * (state.targetProfitPct / 100);
    const rlvTotal = terminalValue - capex - targetProfit;
    const rlvPerSqm = rlvTotal / Math.max(state.landArea, 1);
    const breakEvenAskingPerSqm = (terminalValue - capex - targetProfit) / Math.max(state.landArea, 1);
    const currentAskingPerSqm = state.useLumpSumAsking
      ? state.lumpSumAsking / Math.max(state.landArea, 1)
      : state.askingPricePerSqm;
    const headroomPct = ((rlvPerSqm - currentAskingPerSqm) / Math.max(currentAskingPerSqm, 1)) * 100;
    return {
      label: input.label,
      revenue,
      capex,
      capRatePct,
      terminalValue,
      targetProfit,
      rlvTotal,
      rlvPerSqm,
      headroomPct,
      breakEvenAskingPerSqm,
    };
  });

  const baseCase = cases[0];
  const threshold = state.safetyHeadroomThresholdPct;
  const activeVerdict =
    baseCase.headroomPct >= threshold
      ? 'Good'
      : baseCase.headroomPct >= 0
        ? 'Borderline'
        : 'Overpriced';

  const ebitdaCapexRatio = totalCapex > 0 ? annualEbitda / totalCapex : 0;
  const paybackYears = annualEbitda > 0 ? totalCapex / annualEbitda : 99;
  const scoreFromRatio = clamp(ebitdaCapexRatio * 140, 0, 60);
  const scoreFromPayback = clamp((12 - paybackYears) * 4, 0, 25);
  const scoreFromParking = parkingCompliant ? 10 : clamp(10 - parkingGap * 0.2, 0, 10);
  const scoreFromHeadroom = clamp(baseCase.headroomPct * 0.5, 0, 15);
  const returnScore = Math.round(scoreFromRatio + scoreFromPayback + scoreFromParking + scoreFromHeadroom);

  return {
    allocationTotalPct,
    allocationWarning: Math.abs(allocationTotalPct - 100) > 0.01,
    maxGfa,
    effectiveDevelopableArea,
    blendedEfficiencyPct,
    gfaByUse,
    nlaByUse,
    totalNla,
    totalUnitsByUse,
    totalKeysByUse,
    parkingRequired,
    parkingAchieved,
    parkingGap,
    parkingCompliant,
    parkingStatusLabel: parkingCompliant ? 'Compliant' : 'Non-compliant',
    landBasePrice,
    acquisitionAddersTotal,
    totalAcquisitionCost,
    infraCost,
    hardCost,
    softCost,
    contingencyCost,
    financeCost,
    holdingCost,
    totalCapex,
    annualRevenue,
    annualEbitda,
    terminalValueBase: baseCase.terminalValue,
    cases,
    activeVerdict,
    activeHeadroomPct: baseCase.headroomPct,
    returnScore,
  };
}
