export const STORAGE_KEY = 'tinytracers_progress';

export const getProgress = (): Record<string, number> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const saveProgress = (char: string, stars: number) => {
  try {
    const current = getProgress();
    // Save if the new score is better or equal to existing score (to update timestamp if we had one, or just refresh)
    if ((current[char] || 0) <= stars) {
      const updated = { ...current, [char]: stars };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error("Failed to save progress", e);
  }
};
