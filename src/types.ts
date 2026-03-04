export interface Ingredient {
  name: string;
  amount?: string;
  isMissing?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  calories: number;
  ingredients: Ingredient[];
  instructions: string[];
  imagePrompt: string;
}

export type DietaryRestriction = 'None' | 'Vegetarian' | 'Vegan' | 'Keto' | 'Gluten-Free' | 'Paleo';
