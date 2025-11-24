import React, { useState, useEffect, useRef } from 'react';
import { Clock } from './components/Clock';
import { RabbitScene } from './components/RabbitScene';
import { ExplanationPanel } from './components/ExplanationPanel';
import { parseTime, formatTime } from './utils/time';
import { Play, RotateCcw, Clock as ClockIcon, HelpCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-sky-50 flex flex-col items-center py-6 px-4 md:py-10 md:px-6 font-sans text-slate-800">
      
      {/* Header */}
      <header className="mb-8 md:mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-indigo-600 tracking-tight drop-shadow-sm flex flex-col md:flex-row items-center justify-center gap-3">
          <span className="text-5xl md:text-6xl animate-bounce" style={{ animationDuration: '2s' }}>🐰</span> 
          <span>Little Rabbit's Breakfast</span>
        </h1>
        <p className="text-slate-500 mt-3 text-lg md:text-xl font-medium">Time Travel Math: Find the Start Time!</p>
      </header>

      {/* Main Layout: 3 Columns on large screens */}
      <main className="w-full max-w-[90rem] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* Card 1: Visuals (Animation) */}
        <div className="w-full flex flex-col gap-6 order-1">
          <div className="bg-white p-4 sm:p-6 rounded-[2rem] shadow-xl border-4 border-indigo-100 relative overflow-hidden transition-all hover:shadow-2xl h-full min-h-[500px] flex flex-col justify-between">
            {/* Progress Bar Top */}
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
               <div 
                 className="h-full bg-pink-400 transition-all duration-75 ease-linear" 
                 style={{ width: `${progress * 100}%` }}
               />
            </div>
            
            <div className="mb-4">
                 <RabbitScene progress={progress} />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 mt-auto py-4">
               <Clock totalMinutes={displayMinutes} />
               <div className="text-center">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Current Time</div>
                  <div className="text-4xl font-mono font-bold text-slate-700 bg-slate-100 px-6 py-3 rounded-2xl border border-slate-200 shadow-inner min-w-[140px]">
                    {formatTime(displayMinutes)}
                  </div>
               </div>
            </div>
            
            {isAnimating && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-bold text-lg shadow-2xl animate-pulse border-2 border-white/30">
                   Rewinding Time... ⏳
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Controls */}
        <div className="w-full flex flex-col gap-6 order-2">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border-4 border-white ring-1 ring-indigo-50 h-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <ClockIcon size={24} strokeWidth={2.5} />
              </div>
              Set the Scene
            </h2>

            <div className="space-y-8">
              {/* Input: End Time */}
              <div className="group bg-indigo-50 p-5 rounded-2xl border-2 border-indigo-100 transition-all focus-within:border-indigo-400 focus-within:bg-indigo-100 focus-within:shadow-md hover:border-indigo-200">
                <label htmlFor="endTime" className="block text-indigo-900 font-bold mb-2 text-xs uppercase tracking-wide">
                  Finish Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={isAnimating}
                  className="w-full text-4xl font-black text-indigo-600 bg-transparent outline-none cursor-pointer font-mono"
                />
              </div>

              {/* Input: Duration */}
              <div className="group bg-pink-50 p-5 rounded-2xl border-2 border-pink-100 transition-all focus-within:border-pink-400 focus-within:bg-pink-100 focus-within:shadow-md hover:border-pink-200">
                <label htmlFor="duration" className="block text-pink-900 font-bold mb-2 text-xs uppercase tracking-wide">
                  Duration (Minutes)
                </label>
                <div className="flex flex-wrap items-end gap-3">
                  <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 0))}
                    disabled={isAnimating}
                    min="1"
                    max="180"
                    className="w-28 text-4xl font-black text-pink-500 bg-transparent outline-none border-b-2 border-pink-300 focus:border-pink-500 text-center font-mono"
                  />
                  <span className="text-xl text-pink-800 font-bold pb-2">min</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="120" 
                  value={duration} 
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  disabled={isAnimating}
                  className="w-full mt-6 accent-pink-500 h-3 bg-pink-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 mt-auto">
                <button
                  onClick={startAnimation}
                  disabled={isAnimating}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 active:scale-[0.98] text-white text-lg font-bold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isAnimating ? (
                    <>
                      <span className="animate-spin text-xl">⏳</span> Calculating...
                    </>
                  ) : (
                    <>
                      <Play fill="currentColor" size={20} /> Start
                    </>
                  )}
                </button>
                
                <button
                  onClick={reset}
                  disabled={isAnimating}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 w-14 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
                  aria-label="Reset"
                  title="Reset"
                >
                  <RotateCcw size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
          
        {/* Card 3: Explanation / Result */}
        <div className="w-full order-3 h-full">
            {showExplanation ? (
                <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ExplanationPanel 
                        endTime={endTime} 
                        duration={duration} 
                        calculatedStartTime={calculatedStartTimeStr} 
                    />
                </div>
            ) : (
                // Placeholder State
                <div className="bg-white/50 border-4 border-dashed border-slate-200 p-8 rounded-[2rem] h-full min-h-[400px] flex flex-col items-center justify-center text-center gap-4 transition-all">
                    <div className="bg-slate-100 p-4 rounded-full text-slate-400">
                        <HelpCircle size={48} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-400 mb-2">Answer Area</h3>
                        <p className="text-slate-400 max-w-[200px] mx-auto">
                            Click <strong>Start</strong> to see the step-by-step solution here!
                        </p>
                    </div>
                </div>
            )}
        </div>

      </main>

      <footer className="mt-12 text-slate-400 text-sm text-center">
        <p>© 2024 Math Adventures for Kids. Learning made fun!</p>
      </footer>
    </div>
  );
};

export default App;