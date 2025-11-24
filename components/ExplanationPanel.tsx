import React from 'react';
import { ArrowLeft, Lightbulb } from 'lucide-react';

interface ExplanationPanelProps {
  endTime: string;
  duration: number;
  calculatedStartTime: string;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ endTime, duration, calculatedStartTime }) => {
  const [endH, endM] = endTime.split(':').map(Number);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [startH, startM] = calculatedStartTime.split(':').map(Number);
  
  // Logic to determine if we borrowed an hour
  const needsBorrow = endM < (duration % 60);
  const borrowedMinutes = endM + 60;
  
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-white ring-1 ring-yellow-100 h-full">
      <div className="flex items-center gap-3 mb-6 bg-yellow-50 p-3 rounded-xl">
        <div className="p-2 bg-yellow-400 rounded-lg text-white shadow-sm">
          <Lightbulb size={24} strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">How do we solve it?</h3>
      </div>

      <div className="space-y-6 text-slate-700">
        <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0 text-sm">1</div>
            <p className="text-sm md:text-base">
                Finish time: <span className="font-bold text-indigo-600 bg-indigo-50 px-1 rounded">{endTime}</span>.
            </p>
        </div>

        <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0 text-sm">2</div>
            <p className="text-sm md:text-base">
                Go back <span className="font-bold text-pink-500 bg-pink-50 px-1 rounded">{duration} mins</span>.
            </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-100 font-mono text-sm">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 gap-y-1 items-center text-center">
                <div className="text-right font-bold text-xs text-slate-400 uppercase">Hour</div>
                <div></div>
                <div className="text-left font-bold text-xs text-slate-400 uppercase">Min</div>
                
                <div className="text-right text-lg">{endH}</div>
                <div className="text-slate-300">:</div>
                <div className="text-left text-lg">{endM}</div>

                <div className="col-span-3 border-b border-slate-300 my-2 relative">
                    <span className="absolute right-0 -top-2.5 text-[10px] text-slate-400 bg-slate-50 px-1">-{duration}</span>
                </div>
            </div>

            {needsBorrow && (
               <div className="mt-3 text-xs md:text-sm text-indigo-600 bg-indigo-50 p-2 rounded-lg">
                   <p className="font-bold mb-1">Borrow 1 Hour:</p>
                   <p>{endH} becomes <strong>{endH - 1}</strong></p>
                   <p>{endM} becomes <strong>{borrowedMinutes}</strong></p>
               </div>
            )}
        </div>

        <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
            <div className="bg-green-100 text-green-700 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0 text-sm">3</div>
            <div className="w-full">
                <p className="text-sm text-slate-500 mb-2">Final Calculation:</p>
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl border border-green-200 text-green-700 font-bold shadow-sm">
                    <span>Result</span>
                    <span className="flex items-center gap-2 text-xl">
                       <ArrowLeft size={16} /> {calculatedStartTime}
                    </span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};