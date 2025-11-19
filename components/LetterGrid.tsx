
import React, { useEffect, useState } from 'react';
import { LessonItem, UPPERCASE, LOWERCASE, NUMBERS, LessonType } from '../types';
import { Star, CaseUpper, CaseLower, Hash } from 'lucide-react';
import { getProgress } from '../services/storage';
import { playSound } from '../services/audio';

interface LetterGridProps {
  onSelect: (item: LessonItem, type: LessonType) => void;
}

export const LetterGrid: React.FC<LetterGridProps> = ({ onSelect }) => {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<LessonType>(LessonType.UPPERCASE);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const handleSelect = (item: LessonItem) => {
    playSound('pop');
    onSelect(item, activeTab);
  };

  const handleTabChange = (type: LessonType) => {
    playSound('pop');
    setActiveTab(type);
  };

  let currentItems: LessonItem[] = [];
  if (activeTab === LessonType.UPPERCASE) currentItems = UPPERCASE;
  else if (activeTab === LessonType.LOWERCASE) currentItems = LOWERCASE;
  else if (activeTab === LessonType.NUMBERS) currentItems = NUMBERS;

  return (
    <div className="p-4 w-full max-w-5xl mx-auto animate-in fade-in duration-500 flex flex-col h-full">
      <header className="mb-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-600 drop-shadow-sm mb-2 tracking-tight font-[Fredoka]">
          TinyTracers ✏️
        </h1>
        
        {/* Category Tabs - Designed for kids (Big targets) */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mt-6">
          <button
            onClick={() => handleTabChange(LessonType.UPPERCASE)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg transition-all border-b-4
              ${activeTab === LessonType.UPPERCASE 
                ? 'bg-blue-500 text-white border-blue-700 shadow-none translate-y-1' 
                : 'bg-white text-gray-600 border-gray-200 shadow-sm hover:bg-gray-50 hover:-translate-y-0.5'}
            `}
          >
            <CaseUpper size={28} />
            <span>Big ABC</span>
          </button>

          <button
            onClick={() => handleTabChange(LessonType.LOWERCASE)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg transition-all border-b-4
              ${activeTab === LessonType.LOWERCASE 
                ? 'bg-green-500 text-white border-green-700 shadow-none translate-y-1' 
                : 'bg-white text-gray-600 border-gray-200 shadow-sm hover:bg-gray-50 hover:-translate-y-0.5'}
            `}
          >
            <CaseLower size={28} />
            <span>Small abc</span>
          </button>

          <button
            onClick={() => handleTabChange(LessonType.NUMBERS)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg transition-all border-b-4
              ${activeTab === LessonType.NUMBERS 
                ? 'bg-orange-500 text-white border-orange-700 shadow-none translate-y-1' 
                : 'bg-white text-gray-600 border-gray-200 shadow-sm hover:bg-gray-50 hover:-translate-y-0.5'}
            `}
          >
            <Hash size={24} />
            <span>1-2-3</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-8">
        {currentItems.map((item) => {
          const stars = progress[item.char] || 0;
          const isMastered = stars === 3;

          return (
            <button
              key={item.char}
              onClick={() => handleSelect(item)}
              className={`
                group relative rounded-3xl aspect-square flex flex-col items-center justify-center 
                shadow-[0_6px_0_0_rgba(0,0,0,0.1)] border-2 transition-all duration-200
                ${isMastered ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-transparent'}
                active:translate-y-1 active:shadow-none
                hover:scale-[1.02] hover:-translate-y-1
                ${item.color}
              `}
            >
              <span className="text-5xl font-bold text-white drop-shadow-md mb-1 font-[Fredoka]">{item.char}</span>
              <span className="text-white/90 text-sm font-bold">{item.word}</span>
              
              {/* Star Rating */}
              <div className="absolute top-3 right-3 flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i <= stars ? 'text-yellow-300 fill-yellow-300 drop-shadow-sm' : 'text-black/10 fill-black/10'}`} 
                  />
                ))}
              </div>

              {/* Mastered Badge */}
              {isMastered && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm animate-bounce">
                  MASTER!
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
