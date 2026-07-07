"use client";

import { useEffect, useState } from "react";

interface BigFiveGaugeProps {
  score: number;
  dimension: string;
}

export default function BigFiveGauge({ score, dimension }: BigFiveGaugeProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getColor = () => {
    if (score === 2) return "bg-emerald-500";
    if (score === 1) return "bg-emerald-400";
    if (score === -1) return "bg-rose-400";
    if (score === -2) return "bg-rose-600";
    return "bg-slate-400";
  };

  const width = animated ? `${Math.abs(score) * 25}%` : "0%";

  return (
    <div className="space-y-1">
      {/* Barre de jauge */}
      <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
        {/* Ligne centrale */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-400 z-10" />
        
        {/* Barre animée */}
        <div
          className={`h-full absolute ${getColor()} transition-all duration-1000 ease-out ${
            score < 0 ? "right-1/2" : "left-1/2"
          }`}
          style={{ width }}
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between items-center text-[10px] font-bold">
        <span className="text-rose-500">-2</span>
        <span className="text-slate-400 uppercase">{dimension}</span>
        <span className="text-emerald-500">+2</span>
      </div>
    </div>
  );
}