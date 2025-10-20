import React, { useState, useEffect } from 'react';

const ProgressBar = ({
  percentage = 0,
  barColor = 'bg-blue-500',
  height = 'h-4',
  width = 'w-full',
  textColor = 'text-white',
  textSize = 'text-xs',
  className = '',
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Ensure percentage is within 0-100 range
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    setProgress(clampedPercentage);
  }, [percentage]);

  return (
    <div
      className={`relative ${width} ${height} bg-gray-200 rounded-full overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className={`absolute top-0 left-0 ${height} ${barColor} rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2`}
        style={{ width: `${progress}%` }}
      >
        <span className={`font-bold ${textColor} ${textSize}`}>
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
