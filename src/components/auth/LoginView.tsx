import { CircleAlert, CircleCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { AccountCreated } from "@/components/auth/AccountCreated";
import { BrandWordmark } from "@/components/layout/BrandWordmark";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth";

type LoginViewProps = {
  onAuthenticated: () => Promise<void> | void;
};

export function LoginView({ onAuthenticated }: LoginViewProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const showConfirmStatus = mode === "signup" && confirmTouched && confirmPassword.length > 0;
  const confirmInvalid = showConfirmStatus && !passwordsMatch;

  useEffect(() => {
    if (mode !== "signup" || confirmPassword.length === 0) return;
    const timer = window.setTimeout(() => setConfirmTouched(true), 400);
    return () => window.clearTimeout(timer);
  }, [confirmPassword, mode]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (mode === "signup") {
      setConfirmTouched(true);
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setPending(true);

    try {
      const result =
        mode === "signup"
          ? await signUp(email.trim(), password, name.trim() || email.split("@")[0])
          : await signIn(email.trim(), password);

      if (result.error) {
        setError(result.error.message ?? "Authentication failed.");
        return;
      }

      if (mode === "signup") {
        setCreated(true);
        window.setTimeout(() => {
          void onAuthenticated();
        }, 1600);
        return;
      }

      await onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="relative w-full max-w-md">
        {!created ? (
          <p className="nexus-welcome-underlap" aria-hidden="true">
            {mode === "signin" ? "Welcome back" : "Join Nexus"}
          </p>
        ) : null}
        <Card className="relative z-10 w-full">
        <CardHeader className="items-center justify-items-center text-center">
          <BrandWordmark className="mx-auto mb-2 h-12" />
          {created ? <CardTitle>Welcome to Nexus</CardTitle> : null}
          {!created ? (
            <CardDescription>
              {mode === "signin"
                ? "Sign in to your personal Nexus workspace."
                : "First-time setup for this machine."}
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          {created ? (
            <AccountCreated />
          ) : (
            <form className="grid gap-4" onSubmit={handleSubmit}>
              {mode === "signup" ? (
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    autoComplete="name"
                    value={name}
                    disabled={pending}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
              ) : null}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={pending}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  required
                  minLength={8}
                  disabled={pending}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
                  {mode === "signup" ? (
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    disabled={pending}
                    value={confirmPassword}
                    aria-invalid={confirmInvalid}
                    aria-describedby={
                      showConfirmStatus ? "confirm-password-status" : undefined
                    }
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      if (error === "Passwords do not match.") setError(null);
                    }}
                    onBlur={() => {
                      if (confirmPassword.length > 0) setConfirmTouched(true);
                    }}
                  />
                  {showConfirmStatus ? (
                    <p
                      id="confirm-password-status"
                      className={
                        passwordsMatch
                          ? "flex items-center gap-1.5 text-sm text-teal-400"
                          : "flex items-center gap-1.5 text-sm text-destructive"
                      }
                      role="status"
                      aria-live="polite"
                    >
                      {passwordsMatch ? (
                        <CircleCheck className="size-3.5" />
                      ) : (
                        <CircleAlert className="size-3.5" />
                      )}
                      {passwordsMatch
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </p>
                  ) : null}
                </div>
              ) : null}
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" disabled={pending || confirmInvalid}>
                {pending ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="nexus-spinner" aria-hidden="true" />
                    {mode === "signup" ? "Creating account…" : "Signing in…"}
                  </span>
                ) : mode === "signin" ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </Button>
              <button
                type="button"
                className="text-center text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
                disabled={pending}
                onClick={() => {
                  setError(null);
                  setConfirmPassword("");
                  setConfirmTouched(false);
                  setMode(mode === "signin" ? "signup" : "signin");
                }}
              >
                {mode === "signin"
                  ? "Need an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </form>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
