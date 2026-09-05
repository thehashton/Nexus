import { Briefcase, CheckSquare, LogOut, Target } from "lucide-react";
import { BrandWordmark } from "@/components/layout/BrandWordmark";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppView } from "@/components/layout/AppShell";

const items: { id: AppView; label: string; icon: typeof CheckSquare }[] = [
  { id: "todos", label: "Todos", icon: CheckSquare },
  { id: "goals", label: "Daily Goals", icon: Target },
  { id: "jobs", label: "Job Tracker", icon: Briefcase },
];

type SidebarNavProps = {
  active: AppView;
  onNavigate: (view: AppView) => void;
  email?: string | null;
  onSignOut: () => void;
};

export function SidebarNav({
  active,
  onNavigate,
  email,
  onSignOut,
}: SidebarNavProps) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center justify-between gap-2 px-4 py-5">
        <BrandWordmark className="h-8" />
        <ThemeToggle />
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        {email ? (
          <p className="mb-2 truncate px-1 text-xs text-muted-foreground">
            {email}
          </p>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          onClick={onSignOut}
        >
          <LogOut />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
