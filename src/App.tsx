import React, { useState, useEffect } from 'react';
import { ChefHat, Filter, Sparkles, Loader2, UtensilsCrossed, ListTodo, Camera, Smartphone } from 'lucide-react';
import { Recipe, DietaryRestriction } from './types';
import { generateRecipes } from './services/gemini';
import IngredientScanner from './components/IngredientScanner';
import RecipeCard from './components/RecipeCard';
import StepByStepMode from './components/StepByStepMode';
import ShoppingList from './components/ShoppingList';
import { motion, AnimatePresence } from 'motion/react';

const DIETARY_OPTIONS: DietaryRestriction[] = ['None', 'Vegetarian', 'Vegan', 'Keto', 'Gluten-Free', 'Paleo'];

export default function App() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [restriction, setRestriction] = useState<DietaryRestriction>('None');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'recipes' | 'shopping'>('recipes');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    // Detect if running in an iframe
    setIsInIframe(window.self !== window.top);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleLaunchFullApp = () => {
    window.open(window.location.href, '_top');
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleIngredientsFound = (found: string[]) => {
    setIngredients(found);
  };

  useEffect(() => {
    if (ingredients.length > 0) {
      fetchRecipes();
    }
  }, [ingredients, restriction]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const suggested = await generateRecipes(ingredients, restriction);
      setRecipes(suggested);
    } catch (error) {
      console.error("Failed to fetch recipes", error);
    } finally {
      setLoading(false);
    }
  };

  const addToShoppingList = (item: string) => {
    if (!shoppingList.includes(item)) {
      setShoppingList(prev => [...prev, item]);
    }
  };

  const removeFromShoppingList = (item: string) => {
    setShoppingList(prev => prev.filter(i => i !== item));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FDFCFB]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-white border-r border-zinc-100 p-6 flex flex-col gap-8 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-lg shadow-zinc-200">
            <ChefHat size={24} />
          </div>
          <h1 className="text-xl font-serif font-bold text-zinc-900 tracking-tight">Culinary AI</h1>
        </div>

        <nav className="space-y-1">
          <button 
            onClick={() => setActiveTab('recipes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
              activeTab === 'recipes' ? 'bg-emerald-50 text-emerald-700' : 'text-zinc-500 hover:bg-zinc-50'
            }`}
          >
            <UtensilsCrossed size={18} />
            Recipes
          </button>
          <button 
            onClick={() => setActiveTab('shopping')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
              activeTab === 'shopping' ? 'bg-emerald-50 text-emerald-700' : 'text-zinc-500 hover:bg-zinc-50'
            }`}
          >
            <ListTodo size={18} />
            Shopping List
            {shoppingList.length > 0 && (
              <span className="ml-auto bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {shoppingList.length}
              </span>
            )}
          </button>
          
          {isInstallable && (
            <button 
              onClick={handleInstallClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all mt-4 border border-emerald-200"
            >
              <Smartphone size={18} />
              Install App
            </button>
          )}

          {isInIframe && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
              <p className="text-[10px] text-amber-700 font-medium mb-2 leading-tight">
                Installation is restricted inside the preview. Launch the full app to install.
              </p>
              <button 
                onClick={handleLaunchFullApp}
                className="w-full flex items-center justify-center gap-2 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all"
              >
                <Smartphone size={14} />
                Launch Full App
              </button>
            </div>
          )}
        </nav>

        <div className="mt-auto pt-8 border-t border-zinc-100">
          <div className="flex items-center gap-2 mb-4 text-zinc-400">
            <Filter size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Dietary Filter</span>
          </div>
          <div className="space-y-2">
            {DIETARY_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setRestriction(opt)}
                className={`w-full text-left px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  restriction === opt ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'recipes' ? (
              <motion.div 
                key="recipes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                      <Sparkles size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Smart Assistant</span>
                    </div>
                    <h2 className="text-4xl font-serif font-bold text-zinc-900 leading-tight">
                      What's in your <br /> fridge today?
                    </h2>
                  </div>
                  {ingredients.length > 0 && (
                    <button 
                      onClick={() => {setIngredients([]); setRecipes([]);}}
                      className="flex items-center gap-2 px-6 py-3 bg-zinc-100 text-zinc-600 rounded-2xl text-sm font-semibold hover:bg-zinc-200 transition-all"
                    >
                      <Camera size={18} />
                      Rescan Fridge
                    </button>
                  )}
                </div>

                {/* Scanner Section */}
                {ingredients.length === 0 ? (
                  <IngredientScanner onIngredientsFound={handleIngredientsFound} />
                ) : (
                  <div className="space-y-8">
                    {/* Found Ingredients */}
                    <div className="flex flex-wrap gap-2">
                      {ingredients.map((ing, idx) => (
                        <span key={idx} className="px-4 py-1.5 bg-white border border-zinc-200 rounded-full text-xs font-medium text-zinc-600 shadow-sm">
                          {ing}
                        </span>
                      ))}
                    </div>

                    {/* Recipe Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="glass-panel rounded-3xl h-96 animate-pulse p-6 space-y-4">
                            <div className="w-full h-40 bg-zinc-100 rounded-2xl" />
                            <div className="w-3/4 h-6 bg-zinc-100 rounded-full" />
                            <div className="w-1/2 h-4 bg-zinc-100 rounded-full" />
                            <div className="w-full h-12 bg-zinc-100 rounded-2xl mt-auto" />
                          </div>
                        ))
                      ) : recipes.length > 0 ? (
                        recipes.map((recipe) => (
                          <RecipeCard 
                            key={recipe.id} 
                            recipe={recipe} 
                            onSelect={setSelectedRecipe}
                            onAddToShoppingList={addToShoppingList}
                            isInShoppingList={(item) => shoppingList.includes(item)}
                          />
                        ))
                      ) : (
                        <div className="col-span-full py-20 text-center">
                          <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mx-auto mb-4">
                            <UtensilsCrossed size={32} className="text-zinc-300" />
                          </div>
                          <p className="text-zinc-500 font-medium">No recipes found. Try scanning again!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="shopping"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-md mx-auto h-[calc(100vh-120px)]"
              >
                <ShoppingList 
                  items={shoppingList} 
                  onRemove={removeFromShoppingList}
                  onClear={() => setShoppingList([])}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Step by Step Overlay */}
      <AnimatePresence>
        {selectedRecipe && (
          <StepByStepMode 
            recipe={selectedRecipe} 
            onClose={() => setSelectedRecipe(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
