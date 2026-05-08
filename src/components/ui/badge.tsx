import * as React from "react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "danger" | "info" | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-transparent bg-sky-500 text-white",
  secondary: "border-transparent bg-slate-700 text-slate-100",
  destructive: "border-transparent bg-red-600 text-white",
  outline: "border-white/20 text-slate-100",
  success: "border-green-500/30 bg-green-500/10 text-green-400",
  warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  danger: "border-red-500/30 bg-red-500/10 text-red-400",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  neutral: "border-slate-600 bg-slate-700/50 text-slate-400",
};

function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

export { Badge };
