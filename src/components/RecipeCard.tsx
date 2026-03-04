import React from 'react';
import { Clock, Flame, ChefHat, Plus, Check } from 'lucide-react';
import { Recipe } from '../types';

interface Props {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onAddToShoppingList: (ingredient: string) => void;
  isInShoppingList: (ingredient: string) => boolean;
}

export default function RecipeCard({ recipe, onSelect, onAddToShoppingList, isInShoppingList }: Props) {
  const missingIngredients = recipe.ingredients.filter(i => i.isMissing);

  return (
    <div className="glass-panel rounded-3xl overflow-hidden recipe-card-hover flex flex-col h-full">
      <div className="relative h-48 bg-zinc-100">
        <img 
          src={`https://picsum.photos/seed/${recipe.id}/600/400`} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-700 shadow-sm">
            {recipe.difficulty}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif font-bold text-zinc-900 leading-tight">{recipe.title}</h3>
        </div>
        
        <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-grow">
          {recipe.description}
        </p>

        <div className="flex items-center gap-4 mb-6 text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-emerald-500" />
            <span className="text-xs font-medium">{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-orange-500" />
            <span className="text-xs font-medium">{recipe.calories} kcal</span>
          </div>
        </div>

        {missingIngredients.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Missing Ingredients</p>
            <div className="flex flex-wrap gap-2">
              {missingIngredients.map((ing, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToShoppingList(ing.name);
                  }}
                  disabled={isInShoppingList(ing.name)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                    isInShoppingList(ing.name) 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {isInShoppingList(ing.name) ? <Check size={10} /> : <Plus size={10} />}
                  {ing.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={() => onSelect(recipe)}
          className="w-full py-3 bg-zinc-900 text-white rounded-2xl text-sm font-semibold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group"
        >
          <ChefHat size={18} className="group-hover:rotate-12 transition-transform" />
          Start Cooking
        </button>
      </div>
    </div>
  );
}
