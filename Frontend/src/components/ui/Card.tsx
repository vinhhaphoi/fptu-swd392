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
    ? "hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer"
    : "";

  const glowStyles = glow ? "shadow-lg" : "";

  return (
    <div
      className={`
        bg-card rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]
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
