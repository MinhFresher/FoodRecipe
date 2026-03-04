import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Recipe } from '../types';
import { speakText } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

export default function StepByStepMode({ recipe, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleSpeak = async () => {
    if (isSpeaking) {
      audio?.pause();
      setIsSpeaking(false);
      return;
    }

    const text = recipe.instructions[currentStep];
    const base64Audio = await speakText(text);
    
    if (base64Audio) {
      const newAudio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
      newAudio.onended = () => setIsSpeaking(false);
      setAudio(newAudio);
      newAudio.play();
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    return () => {
      audio?.pause();
    };
  }, [audio]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-white flex flex-col"
    >
      {/* Header */}
      <div className="px-6 py-4 border-bottom border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={24} />
          </button>
          <div>
            <h2 className="text-lg font-serif font-bold text-zinc-900">{recipe.title}</h2>
            <p className="text-xs text-zinc-500">Step {currentStep + 1} of {recipe.instructions.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSpeak}
            className={`p-3 rounded-full transition-all ${isSpeaking ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
          >
            {isSpeaking ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-zinc-100">
        <motion.div 
          className="h-full bg-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / recipe.instructions.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 md:px-24 text-center max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold mb-4">
              {currentStep + 1}
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-zinc-900 leading-tight">
              {recipe.instructions[currentStep]}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-8 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <button 
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-zinc-600 hover:bg-zinc-200 disabled:opacity-30 transition-all"
        >
          <ChevronLeft size={24} />
          Previous
        </button>

        <div className="hidden md:flex gap-2">
          {recipe.instructions.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full transition-all ${idx === currentStep ? 'w-8 bg-emerald-500' : 'bg-zinc-300'}`}
            />
          ))}
        </div>

        {currentStep === recipe.instructions.length - 1 ? (
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-12 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
          >
            Finish Cooking
          </button>
        ) : (
          <button 
            onClick={() => setCurrentStep(prev => Math.min(recipe.instructions.length - 1, prev + 1))}
            className="flex items-center gap-2 px-12 py-4 rounded-2xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 shadow-lg shadow-zinc-200 transition-all"
          >
            Next Step
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
