export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type Unit =
  | "G"
  | "KG"
  | "ML"
  | "L"
  | "TSP"
  | "TBSP"
  | "PCS"
  | "OUNCE"
  | "POUND"
  | "OTHER";
export interface CreateRecipeParams {
  id?: string;
  title: string;
  steps: string[];
  prepTime?: number;
  cookTime?: number;
  difficulty: Difficulty;
  ingredients: string[];
  isPublic: boolean;
  categoryId: string;
  authorId: string;
  image?: string;
}
export interface IngredientItem {
  name: string;
  quantity: number;
  unit: Unit;
}
