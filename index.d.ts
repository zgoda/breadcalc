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
