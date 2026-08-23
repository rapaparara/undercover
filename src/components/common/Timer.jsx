import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react';
import { Button } from './Button.jsx';

export function Timer({
  initialSeconds = 60,
  onExpire,
  autoStart = true,
}) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    setTimeLeft(initialSeconds);
    setIsRunning(autoStart);
  }, [initialSeconds, autoStart]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (onExpire) onExpire();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onExpire]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setTimeLeft(initialSeconds);
    setIsRunning(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isLowTime = timeLeft > 0 && timeLeft <= 10;
  const isTimeUp = timeLeft === 0;

  return (
    <div className="flex flex-col items-center justify-center p-4 glass-card border border-slate-700/80 my-4">
      <div className="flex items-center gap-2 mb-2">
        <TimerIcon className="w-5 h-5 text-indigo-400" />
        <span className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
          Waktu Diskusi
        </span>
      </div>

      <div
        className={`text-5xl font-extrabold tracking-widest font-mono my-2 transition-colors duration-300 ${
          isTimeUp
            ? 'text-rose-500 animate-pulse'
            : isLowTime
            ? 'text-amber-400 animate-pulse'
            : 'text-emerald-400'
        }`}
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex items-center gap-3 mt-3">
        <Button
          variant={isRunning ? 'secondary' : 'primary'}
          size="sm"
          onClick={toggleTimer}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-1.5" /> Jeda
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-1.5" /> Mulai
            </>
          )}
        </Button>

        <Button variant="outline" size="sm" onClick={resetTimer}>
          <RotateCcw className="w-4 h-4 mr-1.5" /> Atur Ulang
        </Button>
      </div>
    </div>
  );
}
