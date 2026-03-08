import React from 'react';

const DonutChart = ({ interest, principal }) => {
  const total = interest + principal;
  const interestPct = (interest / total) * 100;
  const strokeDasharray = `${interestPct} ${100 - interestPct}`;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="3.8" />
        <circle
          cx="18" cy="18" r="15.915" fill="transparent" stroke="#2dd4bf" strokeWidth="3.8"
          strokeDasharray={strokeDasharray} strokeDashoffset="0"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs text-gray-500 uppercase">Interest</span>
        <span className="text-xl font-bold">{interestPct.toFixed(0)}%</span>
      </div>
    </div>
  );
};

export default DonutChart;