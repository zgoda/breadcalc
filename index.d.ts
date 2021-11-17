export interface DryItem {
  id: string;
  name: string;
  amount: number;
  percentage: number;
}

export interface WetItem {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  waterAmount: number;
  waterPercentage: number;
}

export interface Leaven {
  flour: Array<DryItem>;
  water: number;
  sourdough: number;
}

export interface WaterData {
  total: number;
  percentage: number;
  left: number;
}

export interface FlourData {
  total: number;
  left: number;
}

export interface SaltData {
  total: number;
  percentage: number;
  left: number;
}
