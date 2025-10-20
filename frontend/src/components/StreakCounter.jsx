import React, { useState, useEffect } from 'react';
import { FaFire } from 'react-icons/fa'; // Flame icon for streak

const StreakCounter = ({
  iconColor = '#f97316',
  iconSize = '1.5em',
  textColor = '#1f2937',
  textSize = '1.125rem',
  className = '',
}) => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const calculateStreak = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const storedStreak = parseInt(localStorage.getItem('streakCount') || '0');
      const storedLastVisit = localStorage.getItem('lastVisitDate');
      let lastVisit = storedLastVisit ? new Date(storedLastVisit) : null;

      let currentStreak = storedStreak;

      if (lastVisit) {
        lastVisit.setHours(0, 0, 0, 0);
        const diffTime = today.getTime() - lastVisit.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak += 1;
          localStorage.setItem('streakCount', currentStreak.toString());
          localStorage.setItem('lastVisitDate', today.toISOString());
        } else if (diffDays > 1) {
          currentStreak = 1;
          localStorage.setItem('streakCount', currentStreak.toString());
          localStorage.setItem('lastVisitDate', today.toISOString());
        }
        // If diffDays === 0, it's the same day, don't update
      } else {
        currentStreak = 1;
        localStorage.setItem('streakCount', currentStreak.toString());
        localStorage.setItem('lastVisitDate', today.toISOString());
      }

      setStreak(currentStreak);
    };

    calculateStreak();
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      clearStreak();
      setStreak(0);
    };

    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, []);

  return (
    <div
      className={`flex items-center space-x-2 p-2 rounded-md bg-gray-100 ${className}`}
      title={
        streak > 0
          ? `You have a ${streak}-day streak!`
          : 'Start your daily streak!'
      }
    >
      <FaFire style={{ fontSize: iconSize, color: iconColor }} />
      <span style={{ color: textColor, fontSize: textSize }} className="font-semibold">
        {streak}
      </span>
    </div>
  );
};

// Export a helper function to clear streak on logout
export const clearStreak = () => {
  localStorage.removeItem('streakCount');
  localStorage.removeItem('lastVisitDate');
};

export default StreakCounter;
