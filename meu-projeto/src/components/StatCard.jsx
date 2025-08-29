import React from 'react';

const StatCard = ({ icon, title, value, change, changeType }) => {
  const isPositive = changeType === 'positive';
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 animate-fadeInUp">
      <div className="bg-red-100 text-red-500 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className={`text-xs ${changeColor}`}>
          {isPositive ? '↑' : '↓'} {change} vs Mês Anterior
        </p>
      </div>
    </div>
  );
};

export default StatCard;