export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  percentage: number;
}

export interface Leaven {
  flour: Array<Ingredient>;
  water: number;
  sourdough: number;
}
