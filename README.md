# TinyTracers: AI Alphabet & Numbers Game ✏️

TinyTracers is an interactive, educational web application designed to teach children how to write alphabet letters (uppercase and lowercase) and numbers (1-10). 

It utilizes **Google Gemini AI** to analyze handwriting in real-time, providing encouraging feedback, star ratings, and fun facts to keep children engaged. The app is built with **React**, **Tailwind CSS**, and the **Web Audio API** for a polished, mobile-friendly experience.

## ✨ Features

*   **Three Learning Modes**:
    *   **Big ABC**: Uppercase letters A-Z.
    *   **Small abc**: Lowercase letters a-z.
    *   **1-2-3**: Numbers 1-10.
*   **AI-Powered Grading**: Uses Google's Gemini 2.5 Flash model to visually analyze the child's drawing and provide personalized feedback.
*   **Progress Tracking**: Automatically saves "Star Ratings" (1-3 stars) for every letter/number so children can see their mastery.
*   **Rich Feedback System**:
    *   **Visual**: Confetti celebrations for perfect scores, colorful UI, and guide outlines.
    *   **Audio**: Text-to-Speech (TTS) reads the letters/words, plus cheerful sound effects for success and interaction.
*   **Child-Friendly UI**: Large buttons, bright colors, intuitive navigation, and touch-optimized drawing canvas (works on iPad/Tablets/Phones).

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript, Vite (implied environment).
*   **Styling**: Tailwind CSS for responsive design.
*   **AI Integration**: `@google/genai` SDK (Gemini 2.5 Flash).
*   **Icons**: `lucide-react`.
*   **Audio**: Native Web Audio API (for sound effects) and SpeechSynthesis API (for voice).
*   **Storage**: LocalStorage for saving progress.

## 🚀 Getting Started

### Prerequisites

You need a Google Gemini API Key. You can get one for free at [Google AI Studio](https://aistudio.google.com/).

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

3.  **Configure API Key**:
    *   Create a `.env` file in the root directory.
    *   Add your API key:
        ```env
        API_KEY=your_google_api_key_here
        ```
    *   *Note: If running in a browser-based bundler or simple HTML setup, ensure the process.env.API_KEY replacement is handled by your build tool (Vite/Webpack).*

4.  **Run the App**:
    ```bash
    npm run dev
    ```

## 🎮 How to Play

1.  **Choose a Lesson**: Select "Big ABC", "Small abc", or "1-2-3" from the main menu.
2.  **Pick a Character**: Tap on a letter or number card to start practicing.
3.  **Draw**: Trace the outline on the canvas. You can change colors or use the eraser.
4.  **Check**: Press the "Done" button when finished.
5.  **Get Feedback**: 
    *   The AI will grade the drawing.
    *   **3 Stars**: Perfect! You get confetti and a "Master" badge on the menu.
    *   **1-2 Stars**: Good try! Read the feedback and try again.

## 📁 Project Structure

*   `index.html` - Entry point with Tailwind CDN.
*   `index.tsx` - React application mount.
*   `App.tsx` - Main layout and state management.
*   `components/`
    *   `LetterGrid.tsx` - The main menu with tabs and progress indicators.
    *   `DrawingCanvas.tsx` - The drawing interface with canvas logic and AI integration.
*   `services/`
    *   `gemini.ts` - Handles communication with Google Gemini API.
    *   `audio.ts` - Synthesizer for game sound effects.
    *   `storage.ts` - Manages LocalStorage for progress.
*   `types.ts` - TypeScript interfaces and data for lessons.

## 📄 License

This project is open source. Feel free to modify and use it for educational purposes.
