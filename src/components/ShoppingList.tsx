import React from 'react';
import { ShoppingBag, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  items: string[];
  onRemove: (item: string) => void;
  onClear: () => void;
}

export default function ShoppingList({ items, onRemove, onClear }: Props) {
  return (
    <div className="glass-panel rounded-3xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <ShoppingBag size={20} />
          </div>
          <h2 className="text-lg font-serif font-bold text-zinc-900">Shopping List</h2>
        </div>
        {items.length > 0 && (
          <button 
            onClick={onClear}
            className="text-xs font-medium text-zinc-400 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-grow overflow-y-auto space-y-2 pr-2">
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center mb-4">
                <Plus size={24} className="text-zinc-300" />
              </div>
              <p className="text-sm font-medium">Your list is empty</p>
              <p className="text-xs">Add missing ingredients from recipes</p>
            </div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="group flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-200 flex items-center justify-center group-hover:border-emerald-400 transition-colors">
                    <CheckCircle2 size={12} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm font-medium text-zinc-700">{item}</span>
                </div>
                <button 
                  onClick={() => onRemove(item)}
                  className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-6 border-t border-zinc-100">
        <p className="text-[10px] text-center text-zinc-400 font-medium uppercase tracking-widest">
          {items.length} {items.length === 1 ? 'Item' : 'Items'} to buy
        </p>
      </div>
    </div>
  );
}
