import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <div className="bg-wa-panel-bg p-5 rounded-xl shadow-sm border border-wa-divider flex items-center gap-4">
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-xs text-wa-text-secondary uppercase font-bold tracking-wider">{label}</p>
      <p className="text-xl font-bold text-gray-800 dark:text-wa-text-primary">{value}</p>
    </div>
  </div>
);
