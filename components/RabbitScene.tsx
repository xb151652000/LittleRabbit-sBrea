import React from 'react';

interface RabbitSceneProps {
  progress: number; // 0 to 1 (0 = start of meal, 1 = end of meal)
}

export const RabbitScene: React.FC<RabbitSceneProps> = ({ progress }) => {
  // progress 1 = full plate (finished? no wait, logic needs to be clear)
  // Let's say: progress 0 = Start Time (Full Plate). progress 1 = End Time (Empty Plate).
  
  const carrotScale = 1 - progress; // Carrots disappear as time moves forward

  return (
    <div className="relative w-full h-48 bg-green-100 rounded-xl overflow-hidden border-b-4 border-green-200 shadow-inner">
      {/* Background Decor */}
      <div className="absolute top-4 left-10 w-8 h-8 bg-yellow-300 rounded-full opacity-50 animate-pulse" />
      <div className="absolute bottom-0 w-full h-8 bg-green-300" />
      
      {/* Table */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-700 rounded-t-xl" />
      
      {/* Plate */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-32 h-6 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden">
         {/* Carrots on Plate */}
         <div className="flex gap-1 transition-all duration-300" style={{ opacity: carrotScale > 0.1 ? 1 : 0, transform: `scale(${carrotScale})` }}>
            <div className="w-4 h-8 bg-orange-500 rounded-full rotate-45" />
            <div className="w-4 h-8 bg-orange-500 rounded-full -rotate-12" />
            <div className="w-4 h-8 bg-orange-500 rounded-full rotate-90" />
         </div>
      </div>

      {/* Rabbit */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-32 transition-transform duration-500">
          {/* Ears */}
          <div className={`absolute -top-10 left-2 w-4 h-16 bg-white border-2 border-pink-100 rounded-full origin-bottom transition-transform duration-300 ${progress < 1 ? 'animate-bounce' : ''}`} style={{ animationDuration: '2s' }} />
          <div className={`absolute -top-10 right-2 w-4 h-16 bg-white border-2 border-pink-100 rounded-full origin-bottom transition-transform duration-300 ${progress < 1 ? 'animate-bounce' : ''}`} style={{ animationDuration: '2.5s' }} />
          
          {/* Head */}
          <div className="absolute top-0 w-24 h-24 bg-white rounded-full shadow-md z-10 flex flex-col items-center pt-8">
              {/* Eyes */}
              <div className="flex gap-4 mb-1">
                  <div className="w-2 h-2 bg-slate-800 rounded-full" />
                  <div className="w-2 h-2 bg-slate-800 rounded-full" />
              </div>
              {/* Nose */}
              <div className="w-3 h-2 bg-pink-400 rounded-full mb-1" />
              {/* Mouth */}
              <div className="flex gap-1">
                  <div className="w-2 h-2 border-b-2 border-slate-800 rounded-full" />
                  <div className="w-2 h-2 border-b-2 border-slate-800 rounded-full" />
              </div>
              
              {/* Cheeks */}
              <div className="absolute top-10 left-2 w-4 h-2 bg-pink-200 rounded-full opacity-50" />
              <div className="absolute top-10 right-2 w-4 h-2 bg-pink-200 rounded-full opacity-50" />
          </div>

          {/* Body */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-16 bg-white rounded-t-3xl z-0" />
          
          {/* Hands holding fork/spoon if eating */}
          <div className="absolute top-16 -left-4 w-8 h-8 bg-white rounded-full border border-gray-100 z-20 flex items-center justify-center" 
               style={{ transform: `rotate(${progress * 360}deg)` }}>
            <span className="text-lg">🍴</span>
          </div>
      </div>
      
      {/* Speech Bubble */}
      <div className="absolute top-4 right-4 md:right-10 bg-white p-2 rounded-xl rounded-bl-none shadow-md max-w-[120px] text-xs text-center border border-slate-100">
        {progress >= 0.95 ? "I'm full!" : progress <= 0.05 ? "Hungry!" : "Yum yum!"}
      </div>
    </div>
  );
};