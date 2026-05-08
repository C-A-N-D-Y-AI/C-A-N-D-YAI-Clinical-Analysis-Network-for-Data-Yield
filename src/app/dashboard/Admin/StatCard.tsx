import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  colorScheme: "blue" | "purple" | "green" | "indigo" | "pink";
}

export function StatCard({ title, value, colorScheme }: StatCardProps) {
  const getColors = () => {
    switch (colorScheme) {
      case "blue":   return { hoverBorder: "hover:border-blue-500", hoverText: "group-hover:text-blue-600" };
      case "purple": return { hoverBorder: "hover:border-purple-500", hoverText: "group-hover:text-purple-600" };
      case "green":  return { hoverBorder: "hover:border-emerald-500", hoverText: "group-hover:text-emerald-600" };
      case "indigo": return { hoverBorder: "hover:border-indigo-500", hoverText: "group-hover:text-indigo-600" };
      case "pink":   return { hoverBorder: "hover:border-pink-500",  hoverText: "group-hover:text-pink-600" };
      default:       return { hoverBorder: "hover:border-slate-300", hoverText: "group-hover:text-slate-900" };
    }
  };

  const colors = getColors();

  return (
    <div className={`bg-white p-6 rounded-2xl border border-slate-200 ${colors.hoverBorder} transition-all duration-300 group shadow-sm flex flex-col`}>
      <h3 className="text-slate-500 text-xs font-bold mb-3 uppercase tracking-widest">{title}</h3>
      <div className="flex-1">
        <p className={`text-4xl font-extrabold text-slate-900 ${colors.hoverText} transition-colors tracking-tight`}>
          {value}
        </p>
      </div>
    </div>
  );
}