import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-[#202c33] p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-[#8696a0] uppercase font-bold tracking-wider">{label}</p>
      <p className="text-xl font-bold text-gray-800 dark:text-[#e9edef]">{value}</p>
    </div>
  </div>
);
