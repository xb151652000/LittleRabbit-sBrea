export const formatTime = (minutesFromMidnight: number): string => {
  // Normalize to 24h
  let normalized = minutesFromMidnight % (24 * 60);
  if (normalized < 0) normalized += 24 * 60;

  const h = Math.floor(normalized / 60);
  const m = Math.floor(normalized % 60);
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export const parseTime = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

export const getRotation = (totalMinutes: number) => {
  const minutes = totalMinutes % 60;
  const hours = (totalMinutes / 60) % 12;
  
  return {
    minuteRotation: minutes * 6, // 360 / 60
    hourRotation: hours * 30,    // 360 / 12
  };
};