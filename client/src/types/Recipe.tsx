export type Recipe = {
  id?: string;
  title: string;
  prepTime: number;
  cookTime: number;
  ingredients: string[];
  steps: string[];
  difficulty: string;
  categoryId: string;
  isPublic: boolean;
  image?: any;
};
