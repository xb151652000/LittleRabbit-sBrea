import React from 'react';

interface RabbitSceneProps {
  progress: number; // 0 to 1 (0 = start of meal, 1 = end of meal)
}

export const RabbitScene: React.FC<RabbitSceneProps> = ({ progress }) => {
  // Let's say: progress 0 = Start Time (Full Plate). progress 1 = End Time (Empty Plate).
  // In the App, we rewind from 1 to 0.
  
  const carrotScale = 1 - progress; 
  
  // Chewing happens during the middle of the process
  const isChewing = progress > 0.2 && progress < 0.8;

  return (
    <div className="relative w-full h-48 md:h-64 lg:h-72 bg-gradient-to-b from-green-50 to-green-100 rounded-xl overflow-hidden border-b-4 border-green-200 shadow-inner">
      <style>{`
        @keyframes chew {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.4) translateY(2px); }
        }
        .animate-chew {
          animation: chew 0.3s infinite ease-in-out;
        }
        @keyframes cheeks {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        .animate-cheeks {
          animation: cheeks 0.3s infinite ease-in-out;
        }
      `}</style>

      {/* Background Decor */}
      <div className="absolute top-4 left-10 w-12 h-12 bg-yellow-300 rounded-full opacity-50 animate-pulse blur-xl" />
      <div className="absolute bottom-0 w-full h-10 bg-green-300" />
      
      {/* Table */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 md:w-56 h-24 bg-amber-700 rounded-t-xl shadow-lg" />
      
      {/* Plate */}
      <div className="absolute bottom-28 md:bottom-28 left-1/2 -translate-x-1/2 w-32 md:w-40 h-8 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden border border-gray-100 z-10">
         {/* Carrots on Plate */}
         <div className="flex gap-1 transition-all duration-300" style={{ opacity: carrotScale > 0.1 ? 1 : 0, transform: `scale(${carrotScale})` }}>
            <div className="w-4 h-8 bg-orange-500 rounded-full rotate-45 border-r border-orange-600" />
            <div className="w-4 h-8 bg-orange-500 rounded-full -rotate-12 border-l border-orange-600" />
            <div className="w-4 h-8 bg-orange-500 rounded-full rotate-90" />
         </div>
      </div>

      {/* Rabbit */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-28 md:w-32 h-36 transition-transform duration-500 z-0">
          {/* Ears */}
          <div className={`absolute -top-12 left-2 w-5 h-20 bg-white border-2 border-pink-100 rounded-full origin-bottom transition-transform duration-300 ${progress < 1 ? 'animate-bounce' : ''}`} style={{ animationDuration: '2s' }} />
          <div className={`absolute -top-12 right-2 w-5 h-20 bg-white border-2 border-pink-100 rounded-full origin-bottom transition-transform duration-300 ${progress < 1 ? 'animate-bounce' : ''}`} style={{ animationDuration: '2.5s' }} />
          
          {/* Head */}
          <div className="absolute top-0 w-28 md:w-32 h-28 bg-white rounded-full shadow-md z-10 flex flex-col items-center pt-10">
              {/* Eyes */}
              <div className="flex gap-5 mb-1">
                  <div className="w-3 h-3 bg-slate-800 rounded-full" />
                  <div className="w-3 h-3 bg-slate-800 rounded-full" />
              </div>
              {/* Nose */}
              <div className="w-4 h-3 bg-pink-400 rounded-full mb-1" />
              
              {/* Mouth */}
              <div className={`flex gap-1 ${isChewing ? 'animate-chew' : ''}`}>
                  <div className="w-3 h-3 border-b-2 border-slate-800 rounded-full" />
                  <div className="w-3 h-3 border-b-2 border-slate-800 rounded-full" />
              </div>
              
              {/* Cheeks */}
              <div className={`absolute top-12 left-3 w-5 h-3 bg-pink-200 rounded-full opacity-50 blur-sm transition-all ${isChewing ? 'animate-cheeks' : ''}`} />
              <div className={`absolute top-12 right-3 w-5 h-3 bg-pink-200 rounded-full opacity-50 blur-sm transition-all ${isChewing ? 'animate-cheeks' : ''}`} />
          </div>

          {/* Body */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-20 bg-white rounded-t-3xl z-0 shadow-inner" />
          
          {/* Hands holding fork/spoon if eating */}
          <div className="absolute top-20 -left-6 w-10 h-10 bg-white rounded-full border border-gray-100 z-20 flex items-center justify-center shadow-sm" 
               style={{ transform: `rotate(${progress * 360}deg)` }}>
            <span className="text-xl">🍴</span>
          </div>
      </div>
      
      {/* Speech Bubble */}
      <div className="absolute top-4 right-4 md:right-10 bg-white px-3 py-2 rounded-xl rounded-bl-none shadow-md max-w-[120px] text-xs md:text-sm text-center border border-slate-100 font-bold text-slate-600 animate-pulse">
        {progress >= 0.95 ? "I'm full!" : progress <= 0.05 ? "So hungry!" : "Yum yum!"}
      </div>
    </div>
  );
};
