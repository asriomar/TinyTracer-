
# TinyTracers: Alphabet & Numbers Game ✏️

TinyTracers is an interactive, educational web application designed to teach children how to write alphabet letters (uppercase and lowercase) and numbers (1-10). 

It provides a fun "trace and play" experience with encouraging feedback, star ratings, and interactive elements. The app is built with **React**, **Tailwind CSS**, and the **Web Audio API** for a polished, mobile-friendly experience.

## ✨ Features

*   **Three Learning Modes**:
    *   **Big ABC**: Uppercase letters A-Z.
    *   **Small abc**: Lowercase letters a-z.
    *   **1-2-3**: Numbers 1-10.
*   **Progress Tracking**: Automatically saves progress stars so children can see their mastery.
*   **Rich Feedback System**:
    *   **Visual**: Confetti celebrations for completing letters, colorful UI, and guide outlines.
    *   **Audio**: Text-to-Speech (TTS) reads the letters/words, plus cheerful sound effects for success and interaction.
*   **Child-Friendly UI**: Large buttons, bright colors, intuitive navigation, and touch-optimized drawing canvas (works on iPad/Tablets/Phones).

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript, Vite (implied environment).
*   **Styling**: Tailwind CSS for responsive design.
*   **Icons**: `lucide-react`.
*   **Audio**: Native Web Audio API (for sound effects) and SpeechSynthesis API (for voice).
*   **Storage**: LocalStorage for saving progress.

## 🚀 Getting Started

### Installation

1.  **Clone the repository** (or download the files):
    ```bash
    git clone https://github.com/yourusername/tiny-tracers.git
    cd tiny-tracers
    ```

2.  **Install Dependencies** (if using a local Node environment):
    ```bash
    npm install
    ```

3.  **Run the App**:
    ```bash
    npm run dev
    ```

## 🎮 How to Play

1.  **Choose a Lesson**: Select "Big ABC", "Small abc", or "1-2-3" from the main menu.
2.  **Pick a Character**: Tap on a letter or number card to start practicing.
3.  **Draw**: Trace the outline on the canvas. You can change colors or use the eraser.
4.  **Done**: Press the "Done" button when finished to get your stars!
5.  **Next**: Proceed to the next letter automatically.

## 📁 Project Structure

*   `index.html` - Entry point with Tailwind CDN.
*   `index.tsx` - React application mount.
*   `App.tsx` - Main layout and state management.
*   `components/`
    *   `LetterGrid.tsx` - The main menu with tabs and progress indicators.
    *   `DrawingCanvas.tsx` - The drawing interface with canvas logic.
*   `services/`
    *   `audio.ts` - Synthesizer for game sound effects.
    *   `storage.ts` - Manages LocalStorage for progress.
*   `types.ts` - TypeScript interfaces and data for lessons.

## 📄 License

This project is open source. Feel free to modify and use it for educational purposes.
