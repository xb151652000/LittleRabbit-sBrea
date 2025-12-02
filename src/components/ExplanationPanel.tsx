import React from 'react';
import { ArrowLeft, Lightbulb } from 'lucide-react';

/*
  ExplanationPanel.tsx
  作用（产品角度）：
  - 在动画结束后在右侧面板展示“逐步解题思路”和最终答案。
  - 输入（Props）：
      endTime: 用户输入的结束时间，格式 "HH:MM"
      duration: 用户输入的持续分钟数（例如 34）
      calculatedStartTime: 计算得到的开始时间，格式 "HH:MM"
  - 面板会以“步骤+竖式演算+是否借位”的形式，清晰地向用户展示从结束时间回退到开始时间的过程。
*/

interface ExplanationPanelProps {
  endTime: string;
  duration: number;
  calculatedStartTime: string;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ endTime, duration, calculatedStartTime }) => {
  /* 解析输入的结束时间字符串 为小时和分钟数字，便于后续竖式展示和判断 */
  const [endH, endM] = endTime.split(':').map(Number);

  /* 解析计算出的开始时间（仅用于展示/比对），暂时未直接使用 startH/startM */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [startH, startM] = calculatedStartTime.split(':').map(Number);
  
  /*
    借位判断逻辑（数学说明，产品可读）：
    - 当结束分钟 endM 小于要回退的分钟数（duration 的分钟部分）时，
      需要从小时上“借 1 小时”（也就是把分钟加 60 再做减法）。
    - 例如结束为 09:24，要往前 34 分钟，24 < 34 -> 需要借 1 小时，24 + 60 = 84，然后 84 - 34 = 50 分钟，小时减 1。
  */
  const needsBorrow = endM < (duration % 60);
  const borrowedMinutes = endM + 60; // 借位后用于展示的分钟数示例

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-white ring-1 ring-yellow-100 h-full">
      {/* 标题区：用提示图标和标题说明这个面板是“解题思路” */}
      <div className="flex items-center gap-3 mb-6 bg-yellow-50 p-3 rounded-xl">
        <div className="p-2 bg-yellow-400 rounded-lg text-white shadow-sm">
          <Lightbulb size={24} strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">How do we solve it?</h3>
      </div>

      {/* 内容区：按步骤展示，文本颜色与卡片样式用于区分重点 */}
      <div className="space-y-6 text-slate-700">
        {/* 步骤 1：展示结束时间（Finish time） */}
        <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0 text-sm">1</div>
            <p className="text-sm md:text-base">
                Finish time: <span className="font-bold text-indigo-600 bg-indigo-50 px-1 rounded">{endTime}</span>.
            </p>
        </div>

        {/* 步骤 2：展示需要回退的分钟数（Duration） */}
        <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0 text-sm">2</div>
            <p className="text-sm md:text-base">
                Go back <span className="font-bold text-pink-500 bg-pink-50 px-1 rounded">{duration} mins</span>.
            </p>
        </div>

        {/* 竖式演算展示区：把小时与分钟竖式排列，直观表现减法过程 */}
        <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-100 font-mono text-sm">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 gap-y-1 items-center text-center">
                {/* 列标题：Hour / Min，用于帮助非数学熟练用户理解竖式结构 */}
                <div className="text-right font-bold text-xs text-slate-400 uppercase">Hour</div>
                <div></div>
                <div className="text-left font-bold text-xs text-slate-400 uppercase">Min</div>
                
                {/* 结束时间的小时与分钟数字（用于竖式第一行） */}
                <div className="text-right text-lg">{endH}</div>
                <div className="text-slate-300">:</div>
                <div className="text-left text-lg">{endM}</div>

                {/* 分隔线并在右上角标注要减的分钟数（视觉强调） */}
                <div className="col-span-3 border-b border-slate-300 my-2 relative">
                    <span className="absolute right-0 -top-2.5 text-[10px] text-slate-400 bg-slate-50 px-1">-{duration}</span>
                </div>
            </div>

            {/* 如果需要借位（endM < duration%60），显示借位解释模块，帮助用户理解为何小时减 1，分钟加 60 */}
            {needsBorrow && (
               <div className="mt-3 text-xs md:text-sm text-indigo-600 bg-indigo-50 p-2 rounded-lg">
                   <p className="font-bold mb-1">Borrow 1 Hour:</p>
                   {/* 举例说明：小时变为 endH - 1，分钟变为 endM + 60，然后再减去 duration 的分钟部分 */}
                   <p>{endH} becomes <strong>{endH - 1}</strong></p>
                   <p>{endM} becomes <strong>{borrowedMinutes}</strong></p>
               </div>
            )}
        </div>

        {/* 步骤 3：最终结果展示区（Final Calculation） */}
        <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
            <div className="bg-green-100 text-green-700 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0 text-sm">3</div>
            <div className="w-full">
                <p className="text-sm text-slate-500 mb-2">Final Calculation:</p>
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl border border-green-200 text-green-700 font-bold shadow-sm">
                    <span>Result</span>
                    <span className="flex items-center gap-2 text-xl">
                       {/* 箭头图标 + 最终计算出的开始时间（calculatedStartTime） */}
                       <ArrowLeft size={16} /> {calculatedStartTime}
                    </span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};