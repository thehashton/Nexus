import { useState } from "react";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { GoalsView } from "@/views/GoalsView";
import { JobTrackerView } from "@/views/JobTrackerView";
import { TodosView } from "@/views/TodosView";

export type AppView = "todos" | "goals" | "jobs";

type AppShellProps = {
  email?: string | null;
  onSignOut: () => void;
};

export function AppShell({ email, onSignOut }: AppShellProps) {
  const [active, setActive] = useState<AppView>("todos");

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <SidebarNav
        active={active}
        onNavigate={setActive}
        email={email}
        onSignOut={onSignOut}
      />
      <main className="min-w-0 flex-1 overflow-y-auto p-6 md:p-8">
        {active === "todos" ? <TodosView /> : null}
        {active === "goals" ? <GoalsView /> : null}
        {active === "jobs" ? <JobTrackerView /> : null}
      </main>
    </div>
  );
}
