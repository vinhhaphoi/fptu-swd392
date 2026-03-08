import { SkillType } from "@/types";
import Link from "next/link";

interface SkillHeaderProps {
  skill: SkillType;
  skillData: {
    name: string;
    icon: string;
    color: string;
    description: string;
  };
}

export default function SkillHeader({ skill, skillData }: SkillHeaderProps) {
  return (
    <div className="mb-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-foreground/60 mb-6">
        <Link
          href="/"
          className="hover:text-foreground transition-colors"
        >
          Home
        </Link>
        <span>/</span>
        <Link
          href="/practice"
          className="hover:text-foreground transition-colors"
        >
          Practice
        </Link>
        <span>/</span>
        <span className="text-foreground capitalize">{skillData.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${skillData.color} flex items-center justify-center text-4xl shadow-lg flex-shrink-0`}
        >
          {skillData.icon}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {skillData.name} Practice
          </h1>
          <p className="text-foreground/60 text-lg">{skillData.description}</p>
        </div>
      </div>
    </div>
  );
}
