import React, { useState, useEffect, useRef } from 'react';
import { Clock } from './components/Clock';
import { RabbitScene } from './components/RabbitScene';
import { ExplanationPanel } from './components/ExplanationPanel';
import { parseTime, formatTime } from './utils/time';
import { Play, RotateCcw, Clock as ClockIcon, HelpCircle } from 'lucide-react';

/*
  App.tsx — 应用主组件（产品角度的说明）：
  - 这是页面的主要界面逻辑和布局：左侧动画（兔子/时钟)，中间控件（设置结束时间和持续分钟数）,
    右侧展示计算结果或详细解题说明。
  - 核心功能：用户输入“结束时间”和“吃饭持续分钟数”，点击 Start 会触发 3 秒的“回放”动画，
    动画过程中时钟从结束时间逐渐回退到开始时间，动画结束后在右侧显示解题说明和最终答案。
*/

/* -------- 状态定义（解释每个状态的用途，便于产品理解） -------- */
const App: React.FC = () => {
  // 用户输入：结束时间（字符串，格式 "HH:MM"）
  const [endTime, setEndTime] = useState<string>('09:24');
  // 用户输入：持续时间（分钟）
  const [duration, setDuration] = useState<number>(34);
  // 动画是否正在运行（用于禁用输入和按钮）
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  // 动画展示相关状态：
  // displayMinutes：当前动画中显示的分钟数（总分钟数，便于时钟组件显示）
  const [displayMinutes, setDisplayMinutes] = useState<number>(parseTime('09:24'));
  // progress：视觉进度（1 表示到达结束时间，0 表示回退到开始时间）用于进度条和场景渲染
  const [progress, setProgress] = useState<number>(1);
  // 是否展示步骤/解释面板（动画结束后显示）
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // requestAnimationFrame 的引用，用于启动/取消帧循环
  const requestRef = useRef<number>(0);
  // 动画开始的时间戳（performance.now）
  const startTimeRef = useRef<number>(0);

  // 保存上一次的输入值，防止在动画结束时输入变化导致不必要的 UI 重置
  const prevEndTime = useRef(endTime);
  const prevDuration = useRef(duration);

  /* -------- 计算值（把用户可读的时间转换为内部分钟数） -------- */
  // 结束时间对应的总分钟数（例如 09:24 -> 9*60+24）
  const endTimeMinutes = parseTime(endTime);
  // 根据持续分钟数计算开始时间（分钟数）
  const startTimeMinutes = endTimeMinutes - duration;
  // 格式化后的开始时间字符串（用于展示最终答案）
  const calculatedStartTimeStr = formatTime(startTimeMinutes);

  /* 当用户修改 endTime 或 duration 时，如果当前不在动画中，重置显示为结束时间 */
  useEffect(() => {
    const inputsChanged = prevEndTime.current !== endTime || prevDuration.current !== duration;

    if (inputsChanged) {
        if (!isAnimating) {
            // 把显示重置回结束时间（未开始动画时始终显示结束时间）
            setDisplayMinutes(endTimeMinutes);
            setProgress(1);
            setShowExplanation(false);
        }
        // 更新上一次输入缓存
        prevEndTime.current = endTime;
        prevDuration.current = duration;
    }
  }, [endTime, duration, isAnimating, endTimeMinutes]);

  /* -------- 启动动画（用户点击 Start） -------- */
  const startAnimation = () => {
    if (isAnimating) return; // 如果正在动画中，忽略重复点击
    
    setIsAnimating(true);
    setShowExplanation(false);
    setProgress(1);
    setDisplayMinutes(endTimeMinutes);
    startTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(animate);
  };

  /* 动画帧函数：负责 3 秒内从结束时间“回退”到开始时间并更新 UI */
  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;
    const durationMs = 3000; // 动画时长 3 秒

    // rawProgress 从 0 -> 1（表示动画完成度）
    const rawProgress = Math.min(elapsed / durationMs, 1);
    
    // 视觉上的进度从 1 -> 0（因为我们在“回退”）
    const currentVisualProgress = 1 - rawProgress; 
    
    // 根据 rawProgress 线性插值计算当前显示的分钟数（从 endTimeMinutes 减少 duration）
    const currentMins = endTimeMinutes - (duration * rawProgress);

    setDisplayMinutes(currentMins);
    setProgress(currentVisualProgress);

    if (elapsed < durationMs) {
      // 继续下一帧
      requestRef.current = requestAnimationFrame(animate);
    } else {
      // 动画结束：确保最终值精确，展示说明面板
      setIsAnimating(false);
      setShowExplanation(true);
      setDisplayMinutes(startTimeMinutes); // 精确最终值
      setProgress(0);
    }
  };

  /* 重置：取消动画并把界面恢复到结束时间的默认显示 */
  const reset = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setIsAnimating(false);
    setDisplayMinutes(endTimeMinutes);
    setProgress(1);
    setShowExplanation(false);
  };

  /* -------- JSX 布局（UI）—— 每个大区块前有产品角度说明 -------- */
  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center py-6 px-4 md:py-10 md:px-6 font-sans text-slate-800">
      
      {/* Header：标题与简介，告诉用户这是做什么的 */}
      <header className="mb-8 md:mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-indigo-600 tracking-tight drop-shadow-sm flex flex-col md:flex-row items-center justify-center gap-3">
          <span className="text-5xl md:text-6xl animate-bounce" style={{ animationDuration: '2s' }}>🐰</span> 
          <span>Little Rabbit's Breakfast</span>
        </h1>
        <p className="text-slate-500 mt-3 text-lg md:text-xl font-medium">Time Travel Math: Find the Start Time!</p>
      </header>

      {/* Main：三列布局（大屏幕）：
          - 左：动画和时钟（RabbitScene + Clock）
          - 中：设置面板（结束时间、持续时间、Start/Reset）
          - 右：结果/解释面板（动画结束后显示）
      */}
      <main className="w-full max-w-[90rem] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* Card 1: Visuals (Animation) — 主要展示动画和当前时间 */}
        <div className="w-full flex flex-col gap-6 order-1">
          <div className="bg-white p-4 sm:p-6 rounded-[2rem] shadow-xl border-4 border-indigo-100 relative overflow-hidden transition-all hover:shadow-2xl h-full min-h-[500px] flex flex-col justify-between">
            {/* Progress Bar Top（使用 progress 控制宽度） */}
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
               <div 
                 className="h-full bg-pink-400 transition-all duration-75 ease-linear" 
                 style={{ width: `${progress * 100}%` }}
               />
            </div>
            
            <div className="mb-4">
                 {/* RabbitScene 接受 progress 控制场景（例如兔子位置或食物量） */}
                 <RabbitScene progress={progress} />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 mt-auto py-4">
               {/* Clock 组件显示当前 displayMinutes */}
               <Clock totalMinutes={displayMinutes} />
               <div className="text-center">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Current Time</div>
                  <div className="text-4xl font-mono font-bold text-slate-700 bg-slate-100 px-6 py-3 rounded-2xl border border-slate-200 shadow-inner min-w-[140px]">
                    {formatTime(displayMinutes)}
                  </div>
               </div>
            </div>
            
            {/* 动画进行中时显示覆盖提示 */}
            {isAnimating && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-bold text-lg shadow-2xl animate-pulse border-2 border-white/30">
                   Rewinding Time... ⏳
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Controls — 中间设置面板，用户在这里输入并控制动画 */}
        <div className="w-full flex flex-col gap-6 order-2">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border-4 border-white ring-1 ring-indigo-50 h-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <ClockIcon size={24} strokeWidth={2.5} />
              </div>
              Set the Scene
            </h2>

            <div className="space-y-8">
              {/* 输入：结束时间（time 类型，易于用户选择） */}
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

              {/* 输入：持续分钟数（可通过数字框或滑块调整） */}
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

              {/* 操作按钮：Start（开始动画） 和 Reset */}
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
          
        {/* Card 3: Explanation / Result — 动画结束后展示计算过程与答案 */}
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
                // 占位提示：引导用户点击 Start 查看步骤
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