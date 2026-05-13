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
    <header className="mb-6 border-b border-[#1A263D] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-[#FFFFFF]">
          {title} <span className="text-[#0091DA]">.</span>
        </h1>
        <p className="text-[#A0AEC0]">{description}</p>
      </div>
      <div className="flex items-center gap-4 bg-[#0D1525] px-4 py-2 rounded-full border border-[#1A263D]">
        <div className="w-9 h-9 rounded-full bg-[#0091DA] flex items-center justify-center font-bold text-[#FFFFFF] shadow-[0_0_10px_rgba(0,145,218,0.3)]">
          {userInitials}
        </div>
        <span className="font-semibold text-[#FFFFFF] tracking-wide">{userName}</span>
      </div>
    </header>
  );
}