import React from 'react';

interface StatGridProps {
  items: { label: string; value: string | number; color: string; sub?: string }[];
}

const StatGrid: React.FC<StatGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {items.map((item, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500">{item.label}</p>
          <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
          {item.sub && <p className="text-xs text-gray-400 mt-1">{item.sub}</p>}
        </div>
      ))}
    </div>
  );
};

export default StatGrid;