import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function JobTrackerView() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Job Tracker</CardTitle>
          <CardDescription>Coming soon.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Applications, stages, and notes will land here next, using the same
          typed data layer as Todos.
        </CardContent>
      </Card>
    </div>
  );
}
