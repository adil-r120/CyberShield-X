import React from 'react';

interface RiskMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

const RiskMeter: React.FC<RiskMeterProps> = ({ score, size = 'md' }) => {
  const getColor = (s: number) => {
    if (s >= 70) return 'stroke-red-500';
    if (s >= 30) return 'stroke-amber-500';
    return 'stroke-emerald-500';
  };

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const sizes = {
    sm: 'w-16 h-16 text-sm',
    md: 'w-32 h-32 text-xl',
    lg: 'w-48 h-48 text-3xl'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]}`}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-slate-800"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${getColor(score)} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center font-bold`}>
        <span className={getColor(score).replace('stroke-', 'text-')}>{score}%</span>
        {size === 'lg' && <span className="text-xs uppercase tracking-widest text-slate-500 mt-1">Risk</span>}
      </div>
    </div>
  );
};

export default RiskMeter;
