import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  colorScheme: 'blue' | 'purple' | 'green';
}

export function StatCard({ title, value, colorScheme }: StatCardProps) {
  const getColors = () => {
    switch (colorScheme) {
      case 'blue':
        return {
          hoverBorder: 'hover:border-[#0091DA]',
          hoverText: 'group-hover:text-[#0091DA]',
        };
      case 'purple':
        return {
          hoverBorder: 'hover:border-[#8E2DE2]',
          hoverText: 'group-hover:text-[#8E2DE2]',
        };
      case 'green':
        return {
          hoverBorder: 'hover:border-[#00C2A8]',
          hoverText: 'group-hover:text-[#00C2A8]',
        };
      default:
        return {
          hoverBorder: 'hover:border-[#A0AEC0]',
          hoverText: 'group-hover:text-[#A0AEC0]',
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`bg-[#0D1525] p-6 rounded-2xl border border-[#1A263D] ${colors.hoverBorder} transition-all duration-300 group shadow-lg flex flex-col`}>
      <h3 className="text-[#A0AEC0] text-xs font-bold mb-3 uppercase tracking-widest">{title}</h3>
      <div className="flex-1">
        <p className={`text-4xl font-extrabold text-[#FFFFFF] ${colors.hoverText} transition-colors tracking-tight`}>{value}</p>
      </div>
    </div>
  );
}
