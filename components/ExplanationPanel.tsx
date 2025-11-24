import React from 'react';
import { Clock as ClockIcon, ArrowLeft, Lightbulb } from 'lucide-react';

interface ExplanationPanelProps {
  endTime: string;
  duration: number;
  calculatedStartTime: string;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ endTime, duration, calculatedStartTime }) => {
  const [endH, endM] = endTime.split(':').map(Number);
  const [startH, startM] = calculatedStartTime.split(':').map(Number);
  
  // Logic to determine if we borrowed an hour
  const needsBorrow = endM < (duration % 60);
  const borrowedMinutes = endM + 60;
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-yellow-400 w-full max-w-2xl mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="text-yellow-500 w-6 h-6" />
        <h3 className="text-xl font-bold text-slate-800">How do we solve this?</h3>
      </div>

      <div className="space-y-4 text-slate-700">
        <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0">1</div>
            <p>
                We know Little Rabbit finished eating at <span className="font-bold text-indigo-600">{endTime}</span>.
            </p>
        </div>

        <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0">2</div>
            <p>
                The meal took <span className="font-bold text-pink-500">{duration} minutes</span>. We need to go <strong>backwards</strong> in time.
            </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-sm md:text-base">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-2 items-center text-center">
                <div className="text-right font-bold">Hour</div>
                <div></div>
                <div className="text-left font-bold">Minutes</div>
                
                <div className="text-right">{endH}</div>
                <div>:</div>
                <div className="text-left">{endM}</div>

                <div className="col-span-3 border-b border-slate-300 my-1 relative">
                    <span className="absolute right-0 -top-3 text-xs text-slate-400 bg-slate-50 px-1">Subtract {duration} mins</span>
                </div>
            </div>

            {needsBorrow && (
               <div className="mt-2 text-indigo-600">
                   <p>Wait! <strong>{endM}</strong> is smaller than <strong>{duration % 60}</strong> (part of {duration}).</p>
                   <p className="mt-1">Let's borrow 1 hour (60 minutes) from {endH}.</p>
                   <p className="mt-1 font-bold">{endH} becomes {endH - 1}, and {endM} becomes {borrowedMinutes} ({endM} + 60).</p>
               </div>
            )}
        </div>

        <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0">3</div>
            <div>
                <p>Now we subtract the minutes:</p>
                <p className="font-bold text-lg mt-1">
                    {needsBorrow ? borrowedMinutes : endM} - {duration} = {needsBorrow ? borrowedMinutes - duration : endM - duration} minutes? 
                    <br/>
                    <span className="text-sm font-normal text-slate-500">(Wait, simpler way: Start at {endTime}, count back {duration} mins)</span>
                </p>
                <div className="mt-2 flex items-center gap-2 text-green-600 font-bold text-xl">
                    <ArrowLeft /> Result: {calculatedStartTime}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};