import React from 'react';

interface MainWorkspaceProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function MainWorkspace({ 
  title = "Área de Trabajo", 
  description = "Selecciona un módulo del menú para comenzar a administrar el sistema.",
  children 
}: MainWorkspaceProps) {
  return (
    <div className="mt-4 bg-[#0D1525] rounded-2xl border border-[#1A263D] p-8 min-h-[400px] flex items-center justify-center flex-col text-center shadow-md">
      {children ? (
        <div className="w-full h-full text-left">
          {children}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center max-w-md mx-auto py-12">
          <div className="w-20 h-20 mb-6 rounded-full bg-[#1A263D]/50 flex items-center justify-center border border-[#1A263D]">
            <svg className="w-10 h-10 text-[#0091DA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#FFFFFF] mb-3 tracking-tight">{title}</h2>
          <p className="text-[#A0AEC0] text-sm leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
