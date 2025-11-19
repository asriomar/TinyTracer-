
import React, { useState, useCallback } from 'react';
import { LetterGrid } from './components/LetterGrid';
import { DrawingCanvas } from './components/DrawingCanvas';
import { AppState, LessonItem, UPPERCASE, LOWERCASE, NUMBERS, LessonType } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.MENU);
  const [currentItem, setCurrentItem] = useState<LessonItem | null>(null);
  const [currentLessonType, setCurrentLessonType] = useState<LessonType>(LessonType.UPPERCASE);

  const handleSelectItem = (item: LessonItem, type: LessonType) => {
    setCurrentItem(item);
    setCurrentLessonType(type);
    setView(AppState.PRACTICE);
  };

  const handleBack = () => {
    setView(AppState.MENU);
    setCurrentItem(null);
  };

  const handleNext = useCallback(() => {
    if (!currentItem) return;

    let currentList: LessonItem[] = [];
    if (currentLessonType === LessonType.UPPERCASE) currentList = UPPERCASE;
    else if (currentLessonType === LessonType.LOWERCASE) currentList = LOWERCASE;
    else if (currentLessonType === LessonType.NUMBERS) currentList = NUMBERS;

    const currentIndex = currentList.findIndex(l => l.char === currentItem.char);
    const nextIndex = (currentIndex + 1) % currentList.length;
    setCurrentItem(currentList[nextIndex]);
  }, [currentItem, currentLessonType]);

  return (
    <div className="min-h-screen flex flex-col items-center py-6 md:py-12 px-4">
      
      {view === AppState.MENU && (
        <LetterGrid onSelect={handleSelectItem} />
      )}

      {view === AppState.PRACTICE && currentItem && (
        <DrawingCanvas 
            currentItem={currentItem} 
            lessonType={currentLessonType}
            onBack={handleBack}
            onNext={handleNext}
        />
      )}

      <footer className="mt-auto py-6 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} TinyTracers • Fun Learning Game</p>
      </footer>
    </div>
  );
};

export default App;
