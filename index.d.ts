export interface DryIngredient {
  id: string;
  name: string;
  amount: number;
  percentage: number;
}

export interface WetIngredient {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  waterAmount: number;
  waterPercentage: number;
}

export interface Leaven {
  flour: Array<DryIngredient>;
  water: number;
  sourdough: number;
}
