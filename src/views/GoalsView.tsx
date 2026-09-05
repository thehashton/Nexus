import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function GoalsView() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Daily Goals</CardTitle>
          <CardDescription>Coming soon.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This view will follow the same repository pattern as Todos — Neon Auth
          session, Data API, and row-level security.
        </CardContent>
      </Card>
    </div>
  );
}
