import React, { useState, useEffect, useRef } from 'react';
import { Clock } from './components/Clock';
import { RabbitScene } from './components/RabbitScene';
import { ExplanationPanel } from './components/ExplanationPanel';
import { parseTime, formatTime } from './utils/time';
import { Play, RotateCcw, Clock as ClockIcon } from 'lucide-react';

const App: React.FC = () => {
  // Initial State
  const [endTime, setEndTime] = useState<string>('09:24');
  const [duration, setDuration] = useState<number>(34);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  // Animation State
  const [displayMinutes, setDisplayMinutes] = useState<number>(parseTime('09:24'));
  const [progress, setProgress] = useState<number>(1); // 1 = End Time, 0 = Start Time
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Refs to track previous inputs to prevent unwanted resets on animation end
  const prevEndTime = useRef(endTime);
  const prevDuration = useRef(duration);

  // Calculated Values
  const endTimeMinutes = parseTime(endTime);
  const startTimeMinutes = endTimeMinutes - duration;
  const calculatedStartTimeStr = formatTime(startTimeMinutes);

  // Reset display when inputs change
  useEffect(() => {
    const inputsChanged = prevEndTime.current !== endTime || prevDuration.current !== duration;

    if (inputsChanged) {
        if (!isAnimating) {
            setDisplayMinutes(endTimeMinutes);
            setProgress(1);
            setShowExplanation(false);
        }
        // Update refs
        prevEndTime.current = endTime;
        prevDuration.current = duration;
    }
  }, [endTime, duration, isAnimating, endTimeMinutes]);

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowExplanation(false);
    setProgress(1);
    setDisplayMinutes(endTimeMinutes);
    startTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(animate);
  };

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;
    const durationMs = 3000; // Animation takes 3 seconds

    // Calculate progress (goes from 0 to 1 over durationMs)
    const rawProgress = Math.min(elapsed / durationMs, 1);
    
    // We want to visualize "Un-eating" or "Going back in time"
    // So visual progress goes from 1 (End) to 0 (Start)
    const currentVisualProgress = 1 - rawProgress; 
    
    // Interpolate time
    const currentMins = endTimeMinutes - (duration * rawProgress);

    setDisplayMinutes(currentMins);
    setProgress(currentVisualProgress);

    if (elapsed < durationMs) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      setShowExplanation(true);
      setDisplayMinutes(startTimeMinutes); // Ensure exact final value
      setProgress(0);
    }
  };

  const reset = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setIsAnimating(false);
    setDisplayMinutes(endTimeMinutes);
    setProgress(1);
    setShowExplanation(false);
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center py-8 px-4 font-sans text-slate-800">
      
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-indigo-600 tracking-tight drop-shadow-sm flex items-center justify-center gap-3">
          <span className="text-4xl md:text-6xl">🐰</span> 
          Little Rabbit's Breakfast
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Let's learn how to calculate time backwards!</p>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Visuals */}
        <div className="flex flex-col gap-6">
          {/* Animation Stage */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
               <div 
                 className="h-full bg-pink-400 transition-all duration-75" 
                 style={{ width: `${progress * 100}%` }}
               />
            </div>
            
            <RabbitScene progress={progress} />
            
            <div className="mt-8 flex justify-center items-center gap-8">
               <Clock totalMinutes={displayMinutes} />
               <div className="text-center">
                  <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Current Time</div>
                  <div className="text-4xl font-mono font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                    {formatTime(displayMinutes)}
                  </div>
               </div>
            </div>
            
            {isAnimating && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/10 backdrop-blur-[1px] px-6 py-3 rounded-full text-white font-bold text-xl shadow-lg animate-pulse">
                   Time Traveling... ⏳
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Controls & Inputs */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-4 border-white">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ClockIcon className="text-indigo-500" />
              Set the Scene
            </h2>

            <div className="space-y-6">
              {/* Input: End Time */}
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 transition-colors focus-within:border-indigo-300 focus-within:bg-indigo-100">
                <label htmlFor="endTime" className="block text-indigo-900 font-bold mb-2">
                  When did the rabbit finish?
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={isAnimating}
                  className="w-full text-3xl font-bold text-indigo-700 bg-transparent outline-none cursor-pointer"
                />
              </div>

              {/* Input: Duration */}
              <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 transition-colors focus-within:border-pink-300 focus-within:bg-pink-100">
                <label htmlFor="duration" className="block text-pink-900 font-bold mb-2">
                  How many minutes did eating take?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 0))}
                    disabled={isAnimating}
                    min="1"
                    max="180"
                    className="w-24 text-3xl font-bold text-pink-600 bg-transparent outline-none border-b-2 border-pink-200 focus:border-pink-500 text-center"
                  />
                  <span className="text-xl text-pink-800 font-bold">minutes</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="120" 
                  value={duration} 
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  disabled={isAnimating}
                  className="w-full mt-4 accent-pink-500 h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={startAnimation}
                  disabled={isAnimating}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-lg md:text-xl font-bold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnimating ? 'Calculating...' : (
                    <>
                      <Play fill="currentColor" /> Show me!
                    </>
                  )}
                </button>
                
                <button
                  onClick={reset}
                  disabled={isAnimating}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                  aria-label="Reset"
                >
                  <RotateCcw />
                </button>
              </div>
            </div>
          </div>
          
          {/* Result / Explanation Area */}
          <div className={`transition-all duration-700 ease-out transform ${showExplanation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none absolute'}`}>
             <ExplanationPanel 
                endTime={endTime} 
                duration={duration} 
                calculatedStartTime={calculatedStartTimeStr} 
             />
          </div>

        </div>
      </main>

      <footer className="mt-12 text-slate-400 text-sm text-center">
        <p>© 2024 Math Adventures for Kids. Learning made fun!</p>
      </footer>
    </div>
  );
};

export default App;