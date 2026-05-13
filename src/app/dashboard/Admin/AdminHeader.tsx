import React from "react";

interface AdminHeaderProps {
  title: string;
  description: string;
  userName?: string;
  userInitials?: string;
}

export function AdminHeader({
  title,
  description,
  userName = "Admin",
  userInitials = "AD",
}: AdminHeaderProps) {
  return (
    <header className="mb-6 border-b border-slate-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-900">
          {title} <span className="text-blue-600">.</span>
        </h1>
        <p className="text-slate-500">{description}</p>
      </div>
      <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">
          {userInitials}
        </div>
        <span className="font-semibold text-slate-900 tracking-wide">{userName}</span>
      </div>
    </header>
  );
}