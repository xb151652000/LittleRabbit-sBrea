import React from 'react';
import { getRotation } from '../utils/time';

/*
  Clock.tsx
  - Props:
    - totalMinutes: 用于驱动时钟的时间（以分钟为单位，整数或小数均可）
    - label: 可选的文本标签（例如 "Start" 或 "Current Time"）
    - color: 可选文本颜色类名（Tailwind 风格，例如 "text-slate-700"）
  - 功能概要（产品视角）：
    - 根据 totalMinutes 调用 utils/time.ts 中的 getRotation，获取 hourRotation/minuteRotation（针的角度）
    - 渲染一个圆形表盘（含 12 个刻度、12/3/6/9 数字表示）、中心点、时针和分针
    - 时针/分针使用 CSS transform 旋转，且带有过渡（transition）以实现平滑视觉效果
*/

interface ClockProps {
  totalMinutes: number;
  label?: string;
  color?: string;
}

export const Clock: React.FC<ClockProps> = ({ totalMinutes, label, color = "text-slate-700" }) => {
  // 从工具函数里获取需要旋转的角度值（单位是度）
  // - minuteRotation: 分针需要旋转的角度（相对于表盘垂直向上或其他基准）
  // - hourRotation: 小时针的角度（通常随分钟精细移动）
  const { minuteRotation, hourRotation } = getRotation(totalMinutes);

  return (
    // 最外层容器：垂直布局，时钟在上、可选标签在下
    <div className="flex flex-col items-center gap-2">
      {/* 表盘容器：圆形背景 + 边框 + 阴影，居中对齐 */}
      <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white rounded-full border-4 border-indigo-200 shadow-lg flex items-center justify-center">
        {/* Clock Face Markers — 表盘的 12 个刻度（每 30 度一个） */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            // 这里用绝对定位、小矩形模拟刻度（长短可通过样式调整）
            className="absolute w-1 h-3 bg-slate-300 origin-bottom"
            style={{
              // 旋转到对应角度并沿半径方向平移到表盘边缘附近
              // i * 30deg 对应 12 个小时刻度
              transform: `rotate(${i * 30}deg) translate(0, -56px)` // 响应式尺寸上做了大致调整
            }}
          />
        ))}

        {/* 四个大数字（12/3/6/9），使用绝对定位放置在表盘四周 */}
        <span className="absolute top-1 text-slate-400 font-bold text-xs md:text-sm">12</span>
        <span className="absolute bottom-1 text-slate-400 font-bold text-xs md:text-sm">6</span>
        <span className="absolute left-2 text-slate-400 font-bold text-xs md:text-sm">9</span>
        <span className="absolute right-2 text-slate-400 font-bold text-xs md:text-sm">3</span>

        {/* 表盘中心点（视觉锚点） */}
        <div className="absolute w-3 h-3 bg-indigo-500 rounded-full z-10 shadow-sm" />

        {/* Hour Hand — 小时针
            - 使用绝对定位并以底部为旋转原点（origin-bottom）
            - transform 的 rotate 由 hourRotation 控制（从 getRotation 来）
            - transition 用于在角度变化时平滑过渡（视觉更友好）
            - bottom: '50%' 的设置将针底部对齐到表盘中心附近（根据尺寸调整）
        */}
        <div
          className="absolute w-1.5 h-10 md:h-14 bg-slate-800 rounded-full origin-bottom z-0 transition-transform duration-75 ease-linear"
          style={{
            bottom: '50%',
            transform: `rotate(${hourRotation}deg)`,
          }}
        />

        {/* Minute Hand — 分针（比小时针更长、更醒目）
            - 同样以底部为原点旋转
            - 使用不同颜色（bg-indigo-500）以便视觉区分
        */}
        <div
          className="absolute w-1 h-12 md:h-20 bg-indigo-500 rounded-full origin-bottom z-1 transition-transform duration-75 ease-linear"
          style={{
            bottom: '50%',
            transform: `rotate(${minuteRotation}deg)`,
          }}
        />
      </div>

      {/* 可选的标签（比如 "Current Time" / "Start" / 结果提示），使用传入的 color 类控制文字颜色 */}
      {label && <span className={`font-bold text-lg ${color}`}>{label}</span>}
    </div>
  );
};