import { useCallback, useEffect, useState } from "react";
import { LoginView } from "@/components/auth/LoginView";
import { AppShell } from "@/components/layout/AppShell";
import { getSession, signOut, type AuthUser } from "@/lib/auth";

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [booting, setBooting] = useState(true);

  const syncSession = useCallback(async () => {
    const result = await getSession();
    const nextUser = result.data?.user;
    setUser(
      nextUser
        ? {
            id: nextUser.id,
            email: nextUser.email,
            name: nextUser.name,
          }
        : null,
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    syncSession().finally(() => {
      if (!cancelled) setBooting(false);
    });
    return () => {
      cancelled = true;
    };
  }, [syncSession]);

  async function handleSignOut() {
    await signOut();
    setUser(null);
  }

  if (booting) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-sm text-muted-foreground">
        Loading Nexus…
      </div>
    );
  }

  if (!user) {
    return <LoginView onAuthenticated={syncSession} />;
  }

  return <AppShell email={user.email} onSignOut={() => void handleSignOut()} />;
}
