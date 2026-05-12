import React from 'react';

interface StatGridProps {
  items: {
    label: string;
    value: string | number;
    color: string;
    sub?: string;
  }[];
}

const StatGrid: React.FC<StatGridProps> = ({
  items
}) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 transition-all duration-200 hover:bg-[#EEF4FF]"
        >
          {/* Top Glow */}
          <div
            className="absolute inset-x-0 top-0 h-[3px]"
            style={{
              background: item.color
            }}
          />

          {/* Label */}
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {item.label}
          </p>

          {/* Value */}
          <p
            className="mt-4 text-3xl font-bold"
            style={{
              color: item.color
            }}
          >
            {item.value}
          </p>

          {/* Sub Text */}
          {item.sub ? (
            <p className="mt-2 text-sm text-slate-600">
              {item.sub}
            </p>
          ) : null}

          {/* Hover Glow */}
          <div
            className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full opacity-10 blur-3xl transition-opacity duration-300 group-hover:opacity-20"
            style={{
              background: item.color
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default StatGrid;