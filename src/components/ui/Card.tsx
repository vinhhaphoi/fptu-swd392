import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

export default function Card({
  children,
  className = "",
  hover = false,
  glow = false,
  padding = "md",
}: CardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverStyles = hover
    ? "hover:scale-[1.02] hover:shadow-xl hover:border-indigo-500/30 cursor-pointer"
    : "";

  const glowStyles = glow ? "shadow-lg shadow-indigo-500/10" : "";

  return (
    <div
      className={`
        bg-card backdrop-blur-sm border border-card-border rounded-2xl
        transition-all duration-300
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${glowStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
