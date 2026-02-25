export type TabType = 'setup' | 'allocation' | 'fs' | 'compare';

export type TypologyType = 'podium_tower' | 'mid_rise' | 'courtyard';
export type UseId =
  | 'retail'
  | 'office'
  | 'hotel'
  | 'residential'
  | 'serviced_apartment'
  | 'healthcare'
  | 'education'
  | 'entertainment'
  | 'fnb'
  | 'event';
export type RevenueModel = 'rent' | 'hotel' | 'asp';
export type ParkingRuleType = 'per_100_nla' | 'per_unit' | 'per_key';
export type ParkingStrategy = 'surface' | 'podium' | 'basement';
export type InfraCostBasis = 'site' | 'buildable';

export interface ProgramUse {
  id: UseId;
  label: string;
  colorClass: string;
  allocationPct: number;
  locked: boolean;
  enabled: boolean;
  showDetails: boolean;
  revenueModel: RevenueModel;
  efficiencyPct: number;
  buildCostPerSqm: number;
  rentPerSqmMonth: number;
  aspPerSqm: number;
  adr: number;
  occupancyPct: number;
  avgUnitSize: number;
  avgKeySize: number;
  ebitdaMarginPct: number;
}

export interface AcquisitionAdder {
  pct: number;
  amount: number;
}

export interface ProjectState {
  projectName: string;
  siteArea: number;
  landArea: number;
  frontage: number;
  shapeComplexity: string;
  maxFar: number;
  maxBcr: number;
  heightLimit: number;
  setback: number;
  greenCoeff: number;

  useLumpSumAsking: boolean;
  askingPricePerSqm: number;
  lumpSumAsking: number;
  acquisitionAdders: {
    bphtbFees: AcquisitionAdder;
    legal: AcquisitionAdder;
    dueDiligence: AcquisitionAdder;
    broker: AcquisitionAdder;
  };

  uses: ProgramUse[];
  typology: TypologyType;

  parkingRules: Record<UseId, { ruleType: ParkingRuleType; value: number }>;
  parkingStrategy: ParkingStrategy;
  basementLevels: number;
  podiumParkingFloors: number;
  stallAreaSqm: number;
  parkingEfficiency: number;

  infraCostRate: number;
  infraCostBasis: InfraCostBasis;
  softCostPct: number;
  contingencyPct: number;
  financePct: number;
  yieldCapRatePct: number;
  targetProfitPct: number;
  holdingPeriodMonths: number;
  holdingCostPctAnnual: number;

  deltaRevenuePct: number;
  deltaCapexPct: number;
  deltaCapRateBps: number;
  safetyHeadroomThresholdPct: number;
}

const baseUses: ProgramUse[] = [
  {
    id: 'retail',
    label: 'Retail',
    colorClass: 'bg-pink-500',
    allocationPct: 25,
    locked: false,
    enabled: true,
    showDetails: false,
    revenueModel: 'rent',
    efficiencyPct: 78,
    buildCostPerSqm: 3800000,
    rentPerSqmMonth: 320000,
    aspPerSqm: 0,
    adr: 0,
    occupancyPct: 0,
    avgUnitSize: 0,
    avgKeySize: 0,
    ebitdaMarginPct: 45,
  },
  {
    id: 'office',
    label: 'Office',
    colorClass: 'bg-blue-500',
    allocationPct: 35,
    locked: false,
    enabled: true,
    showDetails: false,
    revenueModel: 'rent',
    efficiencyPct: 82,
    buildCostPerSqm: 4200000,
    rentPerSqmMonth: 280000,
    aspPerSqm: 0,
    adr: 0,
    occupancyPct: 0,
    avgUnitSize: 0,
    avgKeySize: 0,
    ebitdaMarginPct: 48,
  },
  {
    id: 'hotel',
    label: 'Hotel',
    colorClass: 'bg-violet-500',
    allocationPct: 10,
    locked: false,
    enabled: true,
    showDetails: false,
    revenueModel: 'hotel',
    efficiencyPct: 72,
    buildCostPerSqm: 5200000,
    rentPerSqmMonth: 0,
    aspPerSqm: 0,
    adr: 900000,
    occupancyPct: 68,
    avgUnitSize: 0,
    avgKeySize: 30,
    ebitdaMarginPct: 34,
  },
  {
    id: 'residential',
    label: 'Residential',
    colorClass: 'bg-amber-400',
    allocationPct: 30,
    locked: false,
    enabled: true,
    showDetails: false,
    revenueModel: 'asp',
    efficiencyPct: 84,
    buildCostPerSqm: 4500000,
    rentPerSqmMonth: 0,
    aspPerSqm: 12000000,
    adr: 0,
    occupancyPct: 0,
    avgUnitSize: 60,
    avgKeySize: 0,
    ebitdaMarginPct: 40,
  },
  {
    id: 'serviced_apartment',
    label: 'Serviced Apt',
    colorClass: 'bg-teal-500',
    allocationPct: 0,
    locked: false,
    enabled: false,
    showDetails: false,
    revenueModel: 'asp',
    efficiencyPct: 82,
    buildCostPerSqm: 4700000,
    rentPerSqmMonth: 0,
    aspPerSqm: 13500000,
    adr: 0,
    occupancyPct: 0,
    avgUnitSize: 45,
    avgKeySize: 0,
    ebitdaMarginPct: 38,
  },
  {
    id: 'healthcare',
    label: 'Healthcare / Clinic',
    colorClass: 'bg-red-500',
    allocationPct: 0,
    locked: false,
    enabled: false,
    showDetails: false,
    revenueModel: 'rent',
    efficiencyPct: 70,
    buildCostPerSqm: 6000000,
    rentPerSqmMonth: 260000,
    aspPerSqm: 0,
    adr: 0,
    occupancyPct: 0,
    avgUnitSize: 0,
    avgKeySize: 0,
    ebitdaMarginPct: 30,
  },
  {
    id: 'education',
    label: 'Education',
    colorClass: 'bg-indigo-500',
    allocationPct: 0,
    locked: false,
    enabled: false,
    showDetails: false,
    revenueModel: 'rent',
    efficiencyPct: 76,
    buildCostPerSqm: 4000000,
    rentPerSqmMonth: 180000,
    aspPerSqm: 0,
    adr: 0,
    occupancyPct: 0,
    avgUnitSize: 0,
    avgKeySize: 0,
    ebitdaMarginPct: 28,
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    colorClass: 'bg-fuchsia-500',
    allocationPct: 0,
    locked: false,
    enabled: false,
    showDetails: false,
    revenueModel: 'rent',
    efficiencyPct: 74,
    buildCostPerSqm: 5500000,
    rentPerSqmMonth: 240000,
    aspPerSqm: 0,
    adr: 0,
    occupancyPct: 0,
    avgUnitSize: 0,
    avgKeySize: 0,
    ebitdaMarginPct: 32,
  },
  {
    id: 'fnb',
    label: 'F&B',
    colorClass: 'bg-orange-500',
    allocationPct: 0,
    locked: false,
    enabled: false,
    showDetails: false,
    revenueModel: 'rent',
    efficiencyPct: 75,
    buildCostPerSqm: 4300000,
    rentPerSqmMonth: 300000,
    aspPerSqm: 0,
    adr: 0,
    occupancyPct: 0,
    avgUnitSize: 0,
    avgKeySize: 0,
    ebitdaMarginPct: 36,
  },
  {
    id: 'event',
    label: 'Event Hall',
    colorClass: 'bg-slate-500',
    allocationPct: 0,
    locked: false,
    enabled: false,
    showDetails: false,
    revenueModel: 'rent',
    efficiencyPct: 68,
    buildCostPerSqm: 4700000,
    rentPerSqmMonth: 160000,
    aspPerSqm: 0,
    adr: 0,
    occupancyPct: 0,
    avgUnitSize: 0,
    avgKeySize: 0,
    ebitdaMarginPct: 26,
  },
];

export const defaultProjectState: ProjectState = {
  projectName: 'Sudirman Lot 9 - Mixed Use',
  siteArea: 5400,
  landArea: 5400,
  frontage: 65,
  shapeComplexity: 'Rectangular (Regular)',
  maxFar: 4.0,
  maxBcr: 60,
  heightLimit: 150,
  setback: 15,
  greenCoeff: 20,

  useLumpSumAsking: false,
  askingPricePerSqm: 35000000,
  lumpSumAsking: 189000000000,
  acquisitionAdders: {
    bphtbFees: { pct: 5, amount: 0 },
    legal: { pct: 0.75, amount: 0 },
    dueDiligence: { pct: 0.35, amount: 0 },
    broker: { pct: 1.5, amount: 0 },
  },

  uses: baseUses,
  typology: 'podium_tower',

  parkingRules: {
    retail: { ruleType: 'per_100_nla', value: 3.5 },
    office: { ruleType: 'per_100_nla', value: 2.2 },
    hotel: { ruleType: 'per_key', value: 0.75 },
    residential: { ruleType: 'per_unit', value: 1.0 },
    serviced_apartment: { ruleType: 'per_unit', value: 0.8 },
    healthcare: { ruleType: 'per_100_nla', value: 2.4 },
    education: { ruleType: 'per_100_nla', value: 1.8 },
    entertainment: { ruleType: 'per_100_nla', value: 3.0 },
    fnb: { ruleType: 'per_100_nla', value: 3.8 },
    event: { ruleType: 'per_100_nla', value: 2.0 },
  },
  parkingStrategy: 'basement',
  basementLevels: 2,
  podiumParkingFloors: 2,
  stallAreaSqm: 32,
  parkingEfficiency: 0.8,

  infraCostRate: 500000,
  infraCostBasis: 'site',
  softCostPct: 12,
  contingencyPct: 5,
  financePct: 6,
  yieldCapRatePct: 8.5,
  targetProfitPct: 20,
  holdingPeriodMonths: 18,
  holdingCostPctAnnual: 6,

  deltaRevenuePct: 10,
  deltaCapexPct: 10,
  deltaCapRateBps: 50,
  safetyHeadroomThresholdPct: 12,
};
