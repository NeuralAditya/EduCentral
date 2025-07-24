import { useState, useEffect } from "react";

interface TestTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export default function TestTimer({ durationMinutes, onTimeUp, isActive }: TestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/20 rounded-lg p-3">
      <p className="text-sm">Time Remaining</p>
      <p className="text-2xl font-bold">{formatTime(timeRemaining)}</p>
    </div>
  );
}
