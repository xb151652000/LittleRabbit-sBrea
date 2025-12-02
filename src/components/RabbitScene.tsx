import React from 'react';

/*
  RabbitScene.tsx — 左侧视觉场景（产品/交互说明）
  作用（产品角度）：
  - 可视化“兔子吃早餐”的场景，用于配合时钟的回退动画（App 会把 progress 从 1 -> 0 回播）。
  - 通过 progress（0..1）控制场景中元素的状态：
      progress = 1 表示“到达结束时间”（盘子空、兔子可能不动）；
      progress = 0 表示“开始时间”（盘子满、兔子刚开始吃）。
  - 组件为示例实现，目标是用简单的视觉元素（缩放、透明度、位移、关键帧）传达“回退时间”的感觉。
  - 开发可据此替换为更复杂的 SVG/Canvas 动画或引入帧图序列。
*/

/* Props 说明（产品视角）：
   - progress: 数值范围 0..1，代表动画/进度状态（App 的 progress 值驱动此组件）
     - 1: 动画起点（结束时间），界面展示“吃完”或较静态的状态
     - 0: 动画终点（开始时间），界面展示“刚开始吃/盘子满”的状态
*/
interface RabbitSceneProps {
  progress: number; // 0 to 1 (0 = start of meal, 1 = end of meal)
}

export const RabbitScene: React.FC<RabbitSceneProps> = ({ progress }) => {
  // 视觉变量说明（由 progress 派生，便于产品理解每个元素如何随进度变化）
  // carrotScale：控制盘子上胡萝卜（食物）的缩放和可见性，progress 越大（越接近结束），胡萝卜越少
  const carrotScale = 1 - progress; 
  
  // isChewing：在进度的中间阶段让兔子出现“咀嚼”动画（更生动）
  const isChewing = progress > 0.2 && progress < 0.8;

  return (
    // 场景容器：背景渐变、圆角、阴影，内部绝对定位若干视觉层
    <div className="relative w-full h-48 md:h-64 lg:h-72 bg-gradient-to-b from-green-50 to-green-100 rounded-xl overflow-hidden border-b-4 border-green-200 shadow-inner">
      {/* 内联样式：定义组件局部用到的 keyframes 动画（咀嚼、脸颊跳动） */}
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

      {/* 背景装饰（纯视觉）：淡黄色圆和地面 */}
      <div className="absolute top-4 left-10 w-12 h-12 bg-yellow-300 rounded-full opacity-50 animate-pulse blur-xl" />
      <div className="absolute bottom-0 w-full h-10 bg-green-300" />
      
      {/* 桌子（放置盘子与兔子的支撑面） */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 md:w-56 h-24 bg-amber-700 rounded-t-xl shadow-lg" />
      
      {/* 盘子（白色，圆形，居中） */}
      <div className="absolute bottom-28 md:bottom-28 left-1/2 -translate-x-1/2 w-32 md:w-40 h-8 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden border border-gray-100 z-10">
         {/* 盘子上的胡萝卜组（用缩放和透明度表示吃掉的过程） */}
         <div
           className="flex gap-1 transition-all duration-300"
           style={{
             // 当 progress -> 1（吃完），carrotScale -> 0，元素缩小并淡出
             opacity: carrotScale > 0.1 ? 1 : 0,
             transform: `scale(${carrotScale})`,
           }}
         >
            {/* 三根胡萝卜的简易图形：块状元素代表食物 */}
            <div className="w-4 h-8 bg-orange-500 rounded-full rotate-45 border-r border-orange-600" />
            <div className="w-4 h-8 bg-orange-500 rounded-full -rotate-12 border-l border-orange-600" />
            <div className="w-4 h-8 bg-orange-500 rounded-full rotate-90" />
         </div>
      </div>

      {/* 兔子主体（包含耳朵、头、身体、手等） */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-28 md:w-32 h-36 transition-transform duration-500 z-0">
          {/* 耳朵：当未完全吃完（progress < 1）时用 bounce 动画活跃展示 */}
          <div
            className={`absolute -top-12 left-2 w-5 h-20 bg-white border-2 border-pink-100 rounded-full origin-bottom transition-transform duration-300 ${progress < 1 ? 'animate-bounce' : ''}`}
            style={{ animationDuration: '2s' }}
          />
          <div
            className={`absolute -top-12 right-2 w-5 h-20 bg-white border-2 border-pink-100 rounded-full origin-bottom transition-transform duration-300 ${progress < 1 ? 'animate-bounce' : ''}`}
            style={{ animationDuration: '2.5s' }}
          />
          
          {/* 头部：包含眼睛、鼻子、嘴与脸颊 */}
          <div className="absolute top-0 w-28 md:w-32 h-28 bg-white rounded-full shadow-md z-10 flex flex-col items-center pt-10">
              {/* 眼睛：两个小圆点 */}
              <div className="flex gap-5 mb-1">
                  <div className="w-3 h-3 bg-slate-800 rounded-full" />
                  <div className="w-3 h-3 bg-slate-800 rounded-full" />
              </div>

              {/* 鼻子：粉色小椭圆 */}
              <div className="w-4 h-3 bg-pink-400 rounded-full mb-1" />
              
              {/* 嘴：如果处于中间进度则添加咀嚼动画（animate-chew） */}
              <div className={`flex gap-1 ${isChewing ? 'animate-chew' : ''}`}>
                  <div className="w-3 h-3 border-b-2 border-slate-800 rounded-full" />
                  <div className="w-3 h-3 border-b-2 border-slate-800 rounded-full" />
              </div>
              
              {/* 两侧脸颊：随着咀嚼放大与变透明，增加可爱感 */}
              <div className={`absolute top-12 left-3 w-5 h-3 bg-pink-200 rounded-full opacity-50 blur-sm transition-all ${isChewing ? 'animate-cheeks' : ''}`} />
              <div className={`absolute top-12 right-3 w-5 h-3 bg-pink-200 rounded-full opacity-50 blur-sm transition-all ${isChewing ? 'animate-cheeks' : ''}`} />
          </div>

          {/* 身体（白色块，位于头部下方） */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-20 bg-white rounded-t-3xl z-0 shadow-inner" />
          
          {/* 手持餐具（视觉上旋转以表现“动作”），其旋转角度以 progress 绑定作为示例 */}
          <div
            className="absolute top-20 -left-6 w-10 h-10 bg-white rounded-full border border-gray-100 z-20 flex items-center justify-center shadow-sm"
            style={{ transform: `rotate(${progress * 360}deg)` }}
          >
            <span className="text-xl">🍴</span>
          </div>
      </div>
      
      {/* 语气气泡：根据 progress 显示不同文本，便于用户理解当前状态 */}
      <div className="absolute top-4 right-4 md:right-10 bg-white px-3 py-2 rounded-xl rounded-bl-none shadow-md max-w-[120px] text-xs md:text-sm text-center border border-slate-100 font-bold text-slate-600 animate-pulse">
        {progress >= 0.95 ? "I'm full!" : progress <= 0.05 ? "So hungry!" : "Yum yum!"}
      </div>
    </div>
  );
};
