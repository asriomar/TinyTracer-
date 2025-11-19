
export interface LessonItem {
  char: string;
  word: string; // Word for letters, or number name for numbers
  color: string;
  icon?: string;
}

export interface AIResponse {
  success: boolean;
  message: string;
  funFact?: string;
  stars: number; // 1-3
}

export enum AppState {
  MENU = 'MENU',
  PRACTICE = 'PRACTICE',
}

export enum LessonType {
  UPPERCASE = 'UPPERCASE',
  LOWERCASE = 'LOWERCASE',
  NUMBERS = 'NUMBERS'
}

export const UPPERCASE: LessonItem[] = [
  { char: 'A', word: 'Apple', color: 'bg-red-400' },
  { char: 'B', word: 'Bear', color: 'bg-blue-400' },
  { char: 'C', word: 'Cat', color: 'bg-orange-400' },
  { char: 'D', word: 'Dog', color: 'bg-amber-400' },
  { char: 'E', word: 'Elephant', color: 'bg-gray-400' },
  { char: 'F', word: 'Fish', color: 'bg-cyan-400' },
  { char: 'G', word: 'Giraffe', color: 'bg-yellow-400' },
  { char: 'H', word: 'House', color: 'bg-purple-400' },
  { char: 'I', word: 'Ice Cream', color: 'bg-pink-300' },
  { char: 'J', word: 'Jellyfish', color: 'bg-indigo-400' },
  { char: 'K', word: 'Kite', color: 'bg-rose-400' },
  { char: 'L', word: 'Lion', color: 'bg-yellow-600' },
  { char: 'M', word: 'Monkey', color: 'bg-brown-400' },
  { char: 'N', word: 'Nest', color: 'bg-green-600' },
  { char: 'O', word: 'Owl', color: 'bg-orange-600' },
  { char: 'P', word: 'Penguin', color: 'bg-slate-800' },
  { char: 'Q', word: 'Queen', color: 'bg-fuchsia-500' },
  { char: 'R', word: 'Robot', color: 'bg-gray-500' },
  { char: 'S', word: 'Star', color: 'bg-yellow-300' },
  { char: 'T', word: 'Tiger', color: 'bg-orange-500' },
  { char: 'U', word: 'Umbrella', color: 'bg-blue-600' },
  { char: 'V', word: 'Volcano', color: 'bg-red-600' },
  { char: 'W', word: 'Whale', color: 'bg-blue-800' },
  { char: 'X', word: 'Xylophone', color: 'bg-pink-500' },
  { char: 'Y', word: 'Yak', color: 'bg-stone-600' },
  { char: 'Z', word: 'Zebra', color: 'bg-black' },
];

export const LOWERCASE: LessonItem[] = UPPERCASE.map(item => ({
  ...item,
  char: item.char.toLowerCase()
}));

export const NUMBERS: LessonItem[] = [
  { char: '1', word: 'One', color: 'bg-red-400' },
  { char: '2', word: 'Two', color: 'bg-orange-400' },
  { char: '3', word: 'Three', color: 'bg-yellow-400' },
  { char: '4', word: 'Four', color: 'bg-green-400' },
  { char: '5', word: 'Five', color: 'bg-blue-400' },
  { char: '6', word: 'Six', color: 'bg-indigo-400' },
  { char: '7', word: 'Seven', color: 'bg-purple-400' },
  { char: '8', word: 'Eight', color: 'bg-pink-400' },
  { char: '9', word: 'Nine', color: 'bg-rose-400' },
  { char: '10', word: 'Ten', color: 'bg-teal-400' },
];
