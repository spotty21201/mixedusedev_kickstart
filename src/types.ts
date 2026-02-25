export type TabType = 'setup' | 'allocation' | 'fs' | 'compare';

export interface ProjectState {
  // 1. Setup Inputs
  projectName: string;
  siteArea: number;
  frontage: number;
  shapeComplexity: string;
  maxFar: number;
  maxBcr: number;
  heightLimit: number;
  setback: number;
  greenCoeff: number;
  askingPricePerSqm: number;

  // 2. Allocation Inputs
  mixRetail: number;
  mixOffice: number;
  mixHotel: number;
  mixResidential: number;
  typology: 'podium_tower' | 'mid_rise' | 'courtyard';
  basementParking: boolean;

  // 3. FS Inputs
  infraCostRate: number;
  softCostMultiplier: number;
  buildCostResidential: number;
  aspResidential: number;
  buildCostRetail: number;
  aspRetail: number;
  buildCostIndustrial: number;
  aspIndustrial: number;
}

export const defaultProjectState: ProjectState = {
  projectName: 'Sudirman Lot 9 - Mixed Use',
  siteArea: 5400,
  frontage: 65,
  shapeComplexity: 'Rectangular (Regular)',
  maxFar: 4.0,
  maxBcr: 60,
  heightLimit: 150,
  setback: 15,
  greenCoeff: 20,
  askingPricePerSqm: 35000000,

  mixRetail: 25,
  mixOffice: 35,
  mixHotel: 10,
  mixResidential: 30,
  typology: 'podium_tower',
  basementParking: true,

  infraCostRate: 500000,
  softCostMultiplier: 12,
  buildCostResidential: 4500000,
  aspResidential: 12000000,
  buildCostRetail: 3800000,
  aspRetail: 15000000,
  buildCostIndustrial: 2500000,
  aspIndustrial: 6500000,
};
