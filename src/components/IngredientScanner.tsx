import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, X } from 'lucide-react';
import { analyzeFridgeImage } from '../services/gemini';

interface Props {
  onIngredientsFound: (ingredients: string[]) => void;
}

export default function IngredientScanner({ onIngredientsFound }: Props) {
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setPreview(reader.result as string);
      await scanImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const scanImage = async (base64: string) => {
    setIsScanning(true);
    try {
      const ingredients = await analyzeFridgeImage(base64);
      onIngredientsFound(ingredients);
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-200 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <Camera size={32} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-zinc-800">Scan your fridge</h3>
            <p className="text-sm text-zinc-500 mt-1">Snap a photo or upload an image to identify ingredients</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button className="mt-4 px-6 py-2 bg-zinc-900 text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2">
            <Upload size={16} />
            Upload Photo
          </button>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-zinc-100 aspect-video group">
          <img src={preview} alt="Fridge preview" className="w-full h-full object-cover" />
          
          {isScanning && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
              <Loader2 className="animate-spin mb-4" size={48} />
              <p className="text-lg font-medium animate-pulse">Analyzing ingredients...</p>
              <div className="mt-4 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
              </div>
            </div>
          )}

          {!isScanning && (
            <button 
              onClick={() => setPreview(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
