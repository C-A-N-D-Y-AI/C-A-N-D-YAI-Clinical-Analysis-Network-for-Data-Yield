import React from "react";

interface MonthlyActivityChartProps {
  data: { label: string; value: number }[];
}

export function MonthlyActivityChart({ data = [] }: MonthlyActivityChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 10);

  return (
    <div className="w-full bg-[#0D1525] border border-[#1A263D] rounded-3xl p-8 shadow-2xl h-full flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Registros de Usuarios</h3>
          <p className="text-sm text-[#A0AEC0]">Nuevos usuarios en los últimos 6 meses</p>
        </div>
        <div className="flex gap-4 bg-white/5 rounded-full px-4 py-2 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
            <span className="text-xs text-white font-bold">Nuevos Usuarios</span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 min-h-[250px] flex items-end justify-between gap-4 md:gap-8 pt-6 mt-auto">
        <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-px bg-white/[0.03]"></div>
          ))}
        </div>

        {data.map((item, index) => {
          const heightPercentage = item.value === 0 ? 2 : Math.max((item.value / maxValue) * 100, 4);
          const barStyle = item.value === 0
            ? "bg-white/5 border border-white/10"
            : "bg-gradient-to-t from-sky-900 to-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.15)] hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]";

          return (
            <div key={index} className="relative flex-1 flex flex-col items-center group h-full">
              <div className="w-full flex justify-center items-end h-full z-10 pb-8">
                <div
                  className={`w-full max-w-[48px] rounded-t-md hover:brightness-125 transition-all duration-500 relative cursor-pointer ${barStyle}`}
                  style={{ height: `${heightPercentage}%` }}
                >
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[11px] font-black text-white opacity-0 group-hover:opacity-100 transition-all bg-[#0D1525] px-2.5 py-1 rounded-md border border-white/10 z-20 shadow-xl">
                    {item.value} {item.value === 1 ? "Usuario" : "Usuarios"}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#A0AEC0] absolute bottom-0 group-hover:text-white transition-colors">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}