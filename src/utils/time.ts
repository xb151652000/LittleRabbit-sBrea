/* 工具函数：时间解析、格式化与时钟角度计算
   - parseTime("09:24") -> 返回总分钟数（9*60 + 24）
   - formatTime( minutes ) -> 格式化回 "HH:MM"（支持负数或超过 24 小时的处理按常见习惯修正）
   - getRotation(totalMinutes) -> 根据分钟数返回时针与分针的角度（度）
*/

export function parseTime(timeStr: string): number {
  // timeStr 格式 "HH:MM"（24 小时制）
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  return h * 60 + m;
}

export function formatTime(totalMinutes: number): string {
  // 把分钟数规范化为 0..23 小时与 0..59 分钟
  // 允许 totalMinutes 为负（例如跨日向前算），这里按 24 小时循环处理
  const minutesInDay = 24 * 60;
  let t = ((Math.round(totalMinutes) % minutesInDay) + minutesInDay) % minutesInDay;
  const h = Math.floor(t / 60);
  const m = t % 60;
  const hh = h.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

export function getRotation(totalMinutes: number) {
  // 计算分针和时针的角度（以度为单位）
  // - 分针：360deg 每 60 分钟 => 每分钟 6deg
  // - 时针：360deg 每 12 小时（720 分钟） => 每分钟 0.5deg，随分钟改变微调
  const minute = totalMinutes % 60;
  const hour = (totalMinutes / 60) % 12;
  const minuteRotation = minute * 6;           // 每分钟 6 度
  const hourRotation = hour * 30;              // 每小时 30 度（并已含小数分钟）
  return { minuteRotation, hourRotation };
}