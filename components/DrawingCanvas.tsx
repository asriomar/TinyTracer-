
import React, { useRef, useLayoutEffect, useState } from 'react';
import { Eraser, Check, ArrowLeft } from 'lucide-react';
import { saveProgress } from '../services/storage';
import { playSound } from '../services/audio';
import { LessonItem, AIResponse, LessonType } from '../types';

interface DrawingCanvasProps {
  currentItem: LessonItem;
  lessonType: LessonType;
  onBack: () => void;
  onNext: () => void;
}

// Simple confetti particle system
class Particle {
  x: number;
  y: number;
  color: string;
  velocity: { x: number; y: number };
  size: number;
  rotation: number;
  rotationSpeed: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    const colors = ['#FCD34D', '#F87171', '#60A5FA', '#34D399', '#A78BFA'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.velocity = {
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 1) * 8 - 5
    };
    this.size = Math.random() * 8 + 4;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 10;
  }

  update(gravity: number) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.y += gravity;
    this.rotation += this.rotationSpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ currentItem, lessonType, onBack, onNext }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#3b82f6');
  const [lineWidth] = useState(20);
  const [feedback, setFeedback] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Refs to access latest state inside event listeners without re-binding
  const stylesRef = useRef({ strokeColor, lineWidth });

  // Keep refs synced with state and update context if needed
  useLayoutEffect(() => {
    stylesRef.current = { strokeColor, lineWidth };
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
        const dpr = window.devicePixelRatio || 1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = strokeColor;
        // Scale line width by DPR so it looks consistently thick on all screens
        ctx.lineWidth = lineWidth * dpr; 
    }
  }, [strokeColor, lineWidth]);

  // Helper: Setup Canvas Resolution (Physical Pixels)
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Avoid updating if rect is invalid (e.g. hidden)
    if (rect.width === 0 || rect.height === 0) return;

    const targetWidth = Math.round(rect.width * dpr);
    const targetHeight = Math.round(rect.height * dpr);

    // Only resize if dimensions actually changed
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // NO ctx.scale() here! We map coordinates manually.
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = stylesRef.current.strokeColor;
            ctx.lineWidth = stylesRef.current.lineWidth * dpr;
        }
    }
  };

  // Helper: Clear Content
  const clearCanvasContent = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
  };

  // Setup Effect: Resize Handling & Initial Clear
  useLayoutEffect(() => {
    // 1. Initial Setup
    setupCanvas();
    clearCanvasContent();
    
    // 2. Observer for layout shifts
    const resizeObserver = new ResizeObserver(() => {
        setupCanvas();
    });
    if (canvasRef.current) {
        resizeObserver.observe(canvasRef.current);
    }

    // 3. Fallback check for first-render layout jank
    const rafId = requestAnimationFrame(() => setupCanvas());

    // 4. Clear Confetti
    if (confettiRef.current) {
      const cCtx = confettiRef.current.getContext('2d');
      cCtx?.clearRect(0, 0, confettiRef.current.width, confettiRef.current.height);
    }

    // Reset State
    setFeedback(null);
    setHasDrawn(false);
    setIsLoading(false);
    speakItem();

    return () => {
        resizeObserver.disconnect();
        cancelAnimationFrame(rafId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem]); 

  const speakItem = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      let text = currentItem.char;
      if (lessonType === LessonType.NUMBERS) {
        text = `Number ${currentItem.word}`;
      } else if (lessonType === LessonType.LOWERCASE) {
        text = `Small ${currentItem.char}`;
      } else {
        text = `Big ${currentItem.char}`;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // CRITICAL: Map screen coordinates to canvas buffer coordinates
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Calculate ratio of Buffer Pixels to CSS Pixels
    // This guarantees the drawing is always under the cursor, even if the
    // resolution hasn't fully updated or is different from the display size.
    const scaleX = rect.width > 0 ? canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? canvas.height / rect.height : 1;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (feedback) return;
    
    // Safety check: If canvas resolution is stale (e.g. first load glitch), fix it now.
    // This might clear the canvas, but since we are just starting a stroke, it's safe.
    const canvas = canvasRef.current;
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== Math.round(rect.width * dpr)) {
            setupCanvas();
        }
    }
    
    setIsDrawing(true);
    setHasDrawn(true);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
    playSound('pop');
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || feedback) return;
    if (e.cancelable) e.preventDefault(); // Block scrolling on touch
    
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (feedback) return;
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.closePath();
  };

  const clearCanvas = () => {
    playSound('pop');
    clearCanvasContent();
    setFeedback(null);
    setHasDrawn(false);
  };

  const fireConfetti = () => {
    const canvas = confettiRef.current;
    if (!canvas) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(canvas.width / 2, canvas.height / 2));
    }

    let animationId: number;
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        particles.forEach(p => {
            p.update(0.2);
            p.draw(ctx);
            if (p.y < canvas.height + 20) active = true;
        });

        if (active) {
            animationId = requestAnimationFrame(animate);
        }
    };
    animate();
  };

  const checkWork = () => {
    if (!canvasRef.current || !hasDrawn) return;

    setIsLoading(true);

    setTimeout(() => {
        let funFact = "";
        if (lessonType === LessonType.NUMBERS) {
            funFact = `You wrote the number ${currentItem.word}!`;
        } else {
            funFact = `${currentItem.char} is for ${currentItem.word}!`;
        }

        const result: AIResponse = {
            success: true,
            stars: 3,
            message: "Great job!",
            funFact: funFact
        };

        setFeedback(result);
        saveProgress(currentItem.char, result.stars);
        playSound('success');
        fireConfetti();

        if ('speechSynthesis' in window) {
             const synth = new SpeechSynthesisUtterance(`Great job! ${funFact}`);
             window.speechSynthesis.speak(synth);
        }
        setIsLoading(false);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 select-none">
        
      {/* Header Controls */}
      <div className="flex justify-between w-full items-center mb-6">
        <button 
            onClick={() => { playSound('pop'); onBack(); }}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-[0_4px_0_0_rgba(0,0,0,0.1)] font-bold text-gray-600 active:translate-y-1 active:shadow-none transition-all border-2 border-gray-100"
        >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
        </button>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
            <span className={`flex items-center justify-center w-12 h-12 rounded-xl ${currentItem.color} text-white shadow-md`}>
                {currentItem.char}
            </span>
        </h2>

        <button 
            onClick={() => { playSound('pop'); speakItem(); }}
            className="p-3 bg-white rounded-2xl shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none text-blue-500 border-2 border-gray-100 transition-all"
            aria-label="Speak"
        >
            🔊
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full aspect-square max-w-[400px] mb-8">
        
        {/* Confetti Layer */}
        <canvas 
            ref={confettiRef} 
            className="absolute inset-0 w-full h-full z-40 pointer-events-none"
        />

        {/* Background Guide */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 bg-white rounded-[2rem] shadow-xl border-4 border-blue-100">
            {/* Guide Character */}
            <span 
                className="font-bold text-gray-100 select-none" 
                style={{ 
                    fontFamily: "'Fredoka', sans-serif",
                    fontSize: lessonType === LessonType.NUMBERS && currentItem.char === '10' ? '180px' : '250px' // Adjust font size for wide numbers
                }}
            >
                {currentItem.char}
            </span>
            {/* Dashed Guide Lines */}
            <div className="absolute w-[90%] border-b-4 border-dashed border-blue-100/50 top-1/2"></div>
            <div className="absolute w-[90%] border-b-4 border-dashed border-blue-100/50 top-[20%]"></div>
            <div className="absolute w-[90%] border-b-4 border-dashed border-blue-100/50 bottom-[20%]"></div>
        </div>

        {/* Drawing Canvas */}
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-10 cursor-crosshair rounded-[2rem] touch-none"
            style={{ touchAction: 'none' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
        />

        {/* Loading Overlay */}
        {isLoading && (
            <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center rounded-[2rem] backdrop-blur-sm transition-all">
                <div className="flex flex-col items-center animate-bounce">
                    <div className="text-4xl mb-2">⭐</div>
                    <p className="text-blue-600 font-bold text-xl">Checking...</p>
                </div>
            </div>
        )}

        {/* Feedback Overlay */}
        {feedback && (
            <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center rounded-[2rem] p-6 text-center animate-in zoom-in duration-300">
                <div className="text-7xl mb-4 drop-shadow-md">
                    🌟
                </div>
                
                <h3 className="text-2xl font-bold mb-2 text-green-600">
                    {feedback.message}
                </h3>

                <div className="flex gap-2 mb-6 justify-center bg-gray-100 p-3 rounded-2xl">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`transform transition-all duration-500 ${i < feedback.stars ? 'scale-110' : 'scale-100'}`}>
                             <svg 
                                width="32" height="32" 
                                viewBox="0 0 24 24" 
                                fill={i < feedback.stars ? "#FACC15" : "none"} 
                                stroke={i < feedback.stars ? "#EAB308" : "#D1D5DB"} 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </div>
                    ))}
                </div>

                {feedback.funFact && (
                    <div className="bg-blue-50 p-4 rounded-xl mb-6 text-sm text-blue-800 font-medium border-2 border-blue-100 shadow-sm">
                        <span className="block text-xs uppercase tracking-widest text-blue-400 mb-1">Fun Fact</span>
                        {feedback.funFact}
                    </div>
                )}

                <div className="flex gap-3 w-full">
                    <button 
                        onClick={clearCanvas}
                        className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200"
                    >
                        Try Again
                    </button>
                    <button 
                        onClick={() => { playSound('pop'); onNext(); }}
                        className="flex-1 py-3 rounded-xl font-bold bg-blue-500 text-white hover:bg-blue-600 shadow-[0_4px_0_0_rgba(37,99,235,1)] active:translate-y-1 active:shadow-none transition-all"
                    >
                        Next ➜
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 sm:gap-4 items-center justify-center p-2 bg-white rounded-2xl shadow-xl border-2 border-gray-100 w-full max-w-[400px]">
        
        {['#3b82f6', '#ef4444', '#22c55e'].map((color) => (
            <button 
                key={color}
                onClick={() => { playSound('pop'); setStrokeColor(color); }}
                className={`p-2 rounded-xl transition-all relative ${strokeColor === color ? 'bg-gray-100 scale-110' : 'hover:bg-gray-50'}`}
            >
                <div className="w-8 h-8 rounded-full shadow-sm border-2 border-white ring-1 ring-gray-200" style={{ backgroundColor: color }}></div>
                {strokeColor === color && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>}
            </button>
        ))}

        <div className="w-0.5 h-10 bg-gray-100 mx-1"></div>

        <button 
            onClick={clearCanvas}
            className="p-3 text-gray-400 hover:bg-red-50 hover:text-red-400 rounded-xl transition-colors"
            title="Clear"
        >
            <Eraser size={24} />
        </button>

        <button 
            onClick={checkWork}
            disabled={!hasDrawn}
            className={`ml-auto px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all
                ${hasDrawn 
                    ? 'bg-green-500 shadow-green-600 hover:bg-green-600' 
                    : 'bg-gray-300 cursor-not-allowed shadow-none'}`}
        >
            <Check size={22} strokeWidth={3} />
            <span className="hidden sm:inline">Done</span>
        </button>

      </div>
    </div>
  );
};
